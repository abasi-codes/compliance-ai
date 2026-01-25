"""Migrate NIST CSF 2.0 data to unified framework tables

Revision ID: 004
Revises: 003
Create Date: 2025-01-25

This migration:
1. Creates the NIST CSF 2.0 framework entry
2. Migrates functions, categories, and subcategories to framework_requirements
3. Preserves IDs for backward compatibility

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create NIST CSF 2.0 framework entry
    op.execute(
        """
        INSERT INTO frameworks (id, code, name, version, description, framework_type, hierarchy_levels, hierarchy_labels, is_active, is_builtin, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'NIST-CSF-2.0',
            'NIST Cybersecurity Framework',
            '2.0',
            'The NIST Cybersecurity Framework (CSF) 2.0 provides guidance to industry, government agencies, and other organizations to manage cybersecurity risks.',
            'nist_csf',
            3,
            '["Function", "Category", "Subcategory"]'::jsonb,
            true,
            true,
            NOW(),
            NOW()
        )
        """
    )

    # Migrate CSF Functions to framework_requirements (level 0)
    # We use a CTE to get the framework_id and then insert functions
    op.execute(
        """
        WITH nist_framework AS (
            SELECT id FROM frameworks WHERE code = 'NIST-CSF-2.0'
        )
        INSERT INTO framework_requirements (id, framework_id, parent_id, code, name, description, guidance, level, is_assessable, display_order, metadata, created_at, updated_at)
        SELECT
            f.id,
            nf.id,
            NULL,
            f.code,
            f.name,
            f.description,
            NULL,
            0,
            false,
            CASE f.code
                WHEN 'GV' THEN 0
                WHEN 'ID' THEN 1
                WHEN 'PR' THEN 2
                WHEN 'DE' THEN 3
                WHEN 'RS' THEN 4
                WHEN 'RC' THEN 5
                ELSE 99
            END,
            jsonb_build_object('legacy_type', 'function', 'legacy_table', 'csf_functions'),
            NOW(),
            NOW()
        FROM csf_functions f
        CROSS JOIN nist_framework nf
        """
    )

    # Migrate CSF Categories to framework_requirements (level 1)
    op.execute(
        """
        INSERT INTO framework_requirements (id, framework_id, parent_id, code, name, description, guidance, level, is_assessable, display_order, metadata, created_at, updated_at)
        SELECT
            c.id,
            fr.framework_id,
            c.function_id,
            c.code,
            c.name,
            c.description,
            NULL,
            1,
            false,
            ROW_NUMBER() OVER (PARTITION BY c.function_id ORDER BY c.code),
            jsonb_build_object('legacy_type', 'category', 'legacy_table', 'csf_categories'),
            NOW(),
            NOW()
        FROM csf_categories c
        JOIN framework_requirements fr ON fr.id = c.function_id
        """
    )

    # Migrate CSF Subcategories to framework_requirements (level 2)
    op.execute(
        """
        INSERT INTO framework_requirements (id, framework_id, parent_id, code, name, description, guidance, level, is_assessable, display_order, metadata, created_at, updated_at)
        SELECT
            s.id,
            fr.framework_id,
            s.category_id,
            s.code,
            s.code,
            s.description,
            NULL,
            2,
            true,
            ROW_NUMBER() OVER (PARTITION BY s.category_id ORDER BY s.code),
            jsonb_build_object('legacy_type', 'subcategory', 'legacy_table', 'csf_subcategories'),
            NOW(),
            NOW()
        FROM csf_subcategories s
        JOIN framework_requirements fr ON fr.id = s.category_id
        """
    )


def downgrade() -> None:
    # Remove migrated data from framework_requirements
    op.execute(
        """
        DELETE FROM framework_requirements
        WHERE framework_id IN (SELECT id FROM frameworks WHERE code = 'NIST-CSF-2.0')
        """
    )

    # Remove NIST CSF 2.0 framework
    op.execute("DELETE FROM frameworks WHERE code = 'NIST-CSF-2.0'")
