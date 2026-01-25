"""Create backward-compatible views for legacy CSF queries

Revision ID: 006
Revises: 005
Create Date: 2025-01-25

This migration creates views that allow legacy code to continue querying
the CSF hierarchy while the codebase transitions to the unified framework.

These views can be removed once all code has been migrated to use
the framework_requirements table directly.

"""

from typing import Sequence, Union

from alembic import op

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create view for CSF Functions from unified requirements
    op.execute(
        """
        CREATE OR REPLACE VIEW v_csf_functions AS
        SELECT
            fr.id,
            fr.code,
            fr.name,
            fr.description
        FROM framework_requirements fr
        JOIN frameworks f ON f.id = fr.framework_id
        WHERE f.code = 'NIST-CSF-2.0'
          AND fr.level = 0
        """
    )

    # Create view for CSF Categories from unified requirements
    op.execute(
        """
        CREATE OR REPLACE VIEW v_csf_categories AS
        SELECT
            fr.id,
            fr.parent_id AS function_id,
            fr.code,
            fr.name,
            fr.description
        FROM framework_requirements fr
        JOIN frameworks f ON f.id = fr.framework_id
        WHERE f.code = 'NIST-CSF-2.0'
          AND fr.level = 1
        """
    )

    # Create view for CSF Subcategories from unified requirements
    op.execute(
        """
        CREATE OR REPLACE VIEW v_csf_subcategories AS
        SELECT
            fr.id,
            fr.parent_id AS category_id,
            fr.code,
            fr.description
        FROM framework_requirements fr
        JOIN frameworks f ON f.id = fr.framework_id
        WHERE f.code = 'NIST-CSF-2.0'
          AND fr.level = 2
        """
    )

    # Create unified view for all assessable requirements with framework info
    op.execute(
        """
        CREATE OR REPLACE VIEW v_assessable_requirements AS
        SELECT
            fr.id,
            fr.framework_id,
            f.code AS framework_code,
            f.name AS framework_name,
            fr.code AS requirement_code,
            fr.name AS requirement_name,
            fr.description,
            fr.guidance,
            fr.level,
            fr.parent_id,
            p.code AS parent_code,
            p.name AS parent_name
        FROM framework_requirements fr
        JOIN frameworks f ON f.id = fr.framework_id
        LEFT JOIN framework_requirements p ON p.id = fr.parent_id
        WHERE fr.is_assessable = true
          AND f.is_active = true
        """
    )

    # Create view for requirement hierarchy with full path
    op.execute(
        """
        CREATE OR REPLACE VIEW v_requirement_hierarchy AS
        WITH RECURSIVE hierarchy AS (
            -- Base case: root level requirements
            SELECT
                fr.id,
                fr.framework_id,
                fr.code,
                fr.name,
                fr.description,
                fr.level,
                fr.parent_id,
                fr.is_assessable,
                fr.code::text AS full_path,
                ARRAY[fr.id] AS path_ids
            FROM framework_requirements fr
            WHERE fr.parent_id IS NULL

            UNION ALL

            -- Recursive case: children
            SELECT
                child.id,
                child.framework_id,
                child.code,
                child.name,
                child.description,
                child.level,
                child.parent_id,
                child.is_assessable,
                (h.full_path || ' > ' || child.code)::text AS full_path,
                h.path_ids || child.id AS path_ids
            FROM framework_requirements child
            JOIN hierarchy h ON child.parent_id = h.id
        )
        SELECT
            h.*,
            f.code AS framework_code,
            f.name AS framework_name
        FROM hierarchy h
        JOIN frameworks f ON f.id = h.framework_id
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_requirement_hierarchy")
    op.execute("DROP VIEW IF EXISTS v_assessable_requirements")
    op.execute("DROP VIEW IF EXISTS v_csf_subcategories")
    op.execute("DROP VIEW IF EXISTS v_csf_categories")
    op.execute("DROP VIEW IF EXISTS v_csf_functions")
