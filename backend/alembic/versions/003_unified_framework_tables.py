"""Add unified framework tables for multi-framework support

Revision ID: 003
Revises: 002
Create Date: 2025-01-25

This migration adds the core tables for multi-framework compliance support:
- frameworks: Registry of compliance frameworks (NIST CSF, ISO 27001, SOC 2, custom)
- framework_requirements: Unified requirements table (replaces CSF hierarchy)
- requirement_crosswalks: Cross-framework mappings
- requirement_clusters: Groups of similar requirements for interview optimization
- company_frameworks: Company framework selection
- assessment_framework_scope: Assessment-specific framework scope

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Frameworks registry table
    op.create_table(
        "frameworks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.String(50), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("version", sa.String(50), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("framework_type", sa.String(50), nullable=False, default="custom"),
        sa.Column("hierarchy_levels", sa.Integer, nullable=False, default=1),
        sa.Column("hierarchy_labels", postgresql.JSONB, nullable=True),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
        sa.Column("is_builtin", sa.Boolean, nullable=False, default=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Framework requirements table (unified hierarchy)
    op.create_table(
        "framework_requirements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "framework_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("frameworks.id"),
            nullable=False,
        ),
        sa.Column(
            "parent_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
        sa.Column("code", sa.String(100), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("guidance", sa.Text, nullable=True),
        sa.Column("level", sa.Integer, nullable=False, default=0),
        sa.Column("is_assessable", sa.Boolean, nullable=False, default=True),
        sa.Column("display_order", sa.Integer, nullable=False, default=0),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
        sa.Column("embedding", postgresql.JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Requirement crosswalks table (cross-framework mappings)
    op.create_table(
        "requirement_crosswalks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "source_requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=False,
        ),
        sa.Column(
            "target_requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=False,
        ),
        sa.Column("mapping_type", sa.String(50), nullable=False, default="related"),
        sa.Column("confidence_score", sa.Float, nullable=False),
        sa.Column("mapping_source", sa.String(50), nullable=False, default="ai_generated"),
        sa.Column("reasoning", sa.Text, nullable=True),
        sa.Column("is_approved", sa.Boolean, nullable=False, default=False),
        sa.Column(
            "approved_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column("approved_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Requirement clusters table
    op.create_table(
        "requirement_clusters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("cluster_type", sa.String(50), nullable=False, default="semantic"),
        sa.Column("embedding_centroid", postgresql.JSONB, nullable=True),
        sa.Column("interview_question", sa.Text, nullable=True),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Requirement cluster members table
    op.create_table(
        "requirement_cluster_members",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "cluster_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("requirement_clusters.id"),
            nullable=False,
        ),
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=False,
        ),
        sa.Column("similarity_score", sa.Float, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Company frameworks table
    op.create_table(
        "company_frameworks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("organization_name", sa.String(255), nullable=False),
        sa.Column(
            "framework_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("frameworks.id"),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
        sa.Column("priority", sa.Integer, nullable=False, default=0),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Assessment framework scope table
    op.create_table(
        "assessment_framework_scope",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "framework_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("frameworks.id"),
            nullable=False,
        ),
        sa.Column("include_all", sa.Boolean, nullable=False, default=True),
        sa.Column("excluded_requirement_ids", postgresql.JSONB, nullable=True),
        sa.Column("included_requirement_ids", postgresql.JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Create indexes for new tables
    op.create_index("ix_frameworks_code", "frameworks", ["code"])
    op.create_index("ix_frameworks_type", "frameworks", ["framework_type"])
    op.create_index("ix_frameworks_active", "frameworks", ["is_active"])

    op.create_index("ix_framework_requirements_framework_id", "framework_requirements", ["framework_id"])
    op.create_index("ix_framework_requirements_parent_id", "framework_requirements", ["parent_id"])
    op.create_index("ix_framework_requirements_code", "framework_requirements", ["code"])
    op.create_index("ix_framework_requirements_level", "framework_requirements", ["level"])
    op.create_index("ix_framework_requirements_assessable", "framework_requirements", ["is_assessable"])

    # Unique constraint for code within framework
    op.create_unique_constraint(
        "uq_framework_requirements_framework_code",
        "framework_requirements",
        ["framework_id", "code"]
    )

    op.create_index("ix_requirement_crosswalks_source", "requirement_crosswalks", ["source_requirement_id"])
    op.create_index("ix_requirement_crosswalks_target", "requirement_crosswalks", ["target_requirement_id"])
    op.create_index("ix_requirement_crosswalks_approved", "requirement_crosswalks", ["is_approved"])

    # Unique constraint for source-target pair
    op.create_unique_constraint(
        "uq_requirement_crosswalks_source_target",
        "requirement_crosswalks",
        ["source_requirement_id", "target_requirement_id"]
    )

    op.create_index("ix_requirement_clusters_type", "requirement_clusters", ["cluster_type"])
    op.create_index("ix_requirement_clusters_active", "requirement_clusters", ["is_active"])

    op.create_index("ix_requirement_cluster_members_cluster", "requirement_cluster_members", ["cluster_id"])
    op.create_index("ix_requirement_cluster_members_requirement", "requirement_cluster_members", ["requirement_id"])

    op.create_index("ix_company_frameworks_org", "company_frameworks", ["organization_name"])
    op.create_index("ix_company_frameworks_framework", "company_frameworks", ["framework_id"])

    # Unique constraint for org-framework pair
    op.create_unique_constraint(
        "uq_company_frameworks_org_framework",
        "company_frameworks",
        ["organization_name", "framework_id"]
    )

    op.create_index("ix_assessment_framework_scope_assessment", "assessment_framework_scope", ["assessment_id"])
    op.create_index("ix_assessment_framework_scope_framework", "assessment_framework_scope", ["framework_id"])

    # Unique constraint for assessment-framework pair
    op.create_unique_constraint(
        "uq_assessment_framework_scope_assessment_framework",
        "assessment_framework_scope",
        ["assessment_id", "framework_id"]
    )


def downgrade() -> None:
    # Drop unique constraints
    op.drop_constraint("uq_assessment_framework_scope_assessment_framework", "assessment_framework_scope")
    op.drop_constraint("uq_company_frameworks_org_framework", "company_frameworks")
    op.drop_constraint("uq_requirement_crosswalks_source_target", "requirement_crosswalks")
    op.drop_constraint("uq_framework_requirements_framework_code", "framework_requirements")

    # Drop indexes
    op.drop_index("ix_assessment_framework_scope_framework")
    op.drop_index("ix_assessment_framework_scope_assessment")
    op.drop_index("ix_company_frameworks_framework")
    op.drop_index("ix_company_frameworks_org")
    op.drop_index("ix_requirement_cluster_members_requirement")
    op.drop_index("ix_requirement_cluster_members_cluster")
    op.drop_index("ix_requirement_clusters_active")
    op.drop_index("ix_requirement_clusters_type")
    op.drop_index("ix_requirement_crosswalks_approved")
    op.drop_index("ix_requirement_crosswalks_target")
    op.drop_index("ix_requirement_crosswalks_source")
    op.drop_index("ix_framework_requirements_assessable")
    op.drop_index("ix_framework_requirements_level")
    op.drop_index("ix_framework_requirements_code")
    op.drop_index("ix_framework_requirements_parent_id")
    op.drop_index("ix_framework_requirements_framework_id")
    op.drop_index("ix_frameworks_active")
    op.drop_index("ix_frameworks_type")
    op.drop_index("ix_frameworks_code")

    # Drop tables
    op.drop_table("assessment_framework_scope")
    op.drop_table("company_frameworks")
    op.drop_table("requirement_cluster_members")
    op.drop_table("requirement_clusters")
    op.drop_table("requirement_crosswalks")
    op.drop_table("framework_requirements")
    op.drop_table("frameworks")
