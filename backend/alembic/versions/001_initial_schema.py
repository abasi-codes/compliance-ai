"""Initial schema with core entities, RBAC, and audit logging

Revision ID: 001
Revises:
Create Date: 2025-01-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # RBAC: Roles table
    op.create_table(
        "roles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(50), unique=True, nullable=False),
        sa.Column("description", sa.String(255)),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # RBAC: User-Role association table
    op.create_table(
        "user_roles",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            primary_key=True,
        ),
        sa.Column(
            "role_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("roles.id"),
            primary_key=True,
        ),
    )

    # NIST CSF 2.0 Framework: Functions
    op.create_table(
        "csf_functions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.String(10), unique=True, nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("description", sa.Text),
    )

    # NIST CSF 2.0 Framework: Categories
    op.create_table(
        "csf_categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "function_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_functions.id"),
            nullable=False,
        ),
        sa.Column("code", sa.String(20), unique=True, nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("description", sa.Text),
    )

    # NIST CSF 2.0 Framework: Subcategories
    op.create_table(
        "csf_subcategories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_categories.id"),
            nullable=False,
        ),
        sa.Column("code", sa.String(20), unique=True, nullable=False),
        sa.Column("description", sa.Text, nullable=False),
    )

    # Assessments table
    op.create_table(
        "assessments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("organization_name", sa.String(255), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, default="draft"),
        sa.Column(
            "created_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Controls table
    op.create_table(
        "controls",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column("identifier", sa.String(100), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("owner", sa.String(255)),
        sa.Column("control_type", sa.String(100)),
        sa.Column("implementation_status", sa.String(50)),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Control Mappings table
    op.create_table(
        "control_mappings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "control_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("controls.id"),
            nullable=False,
        ),
        sa.Column(
            "subcategory_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_subcategories.id"),
            nullable=False,
        ),
        sa.Column("confidence_score", sa.Float),
        sa.Column("is_approved", sa.Boolean, nullable=False, default=False),
        sa.Column(
            "approved_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
        ),
        sa.Column("approved_at", sa.DateTime),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Policies table
    op.create_table(
        "policies",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("version", sa.String(50)),
        sa.Column("owner", sa.String(255)),
        sa.Column("file_path", sa.String(500)),
        sa.Column("content_text", sa.Text),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Policy Mappings table
    op.create_table(
        "policy_mappings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "policy_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("policies.id"),
            nullable=False,
        ),
        sa.Column(
            "subcategory_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_subcategories.id"),
            nullable=False,
        ),
        sa.Column("confidence_score", sa.Float),
        sa.Column("is_approved", sa.Boolean, nullable=False, default=False),
        sa.Column(
            "approved_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
        ),
        sa.Column("approved_at", sa.DateTime),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Audit Log table
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
        ),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True)),
        sa.Column("old_values", postgresql.JSONB),
        sa.Column("new_values", postgresql.JSONB),
        sa.Column("ip_address", sa.String(50)),
        sa.Column("user_agent", sa.String(500)),
        sa.Column("timestamp", sa.DateTime, nullable=False),
        sa.Column("details", sa.Text),
    )

    # Create indexes for common queries
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_assessments_status", "assessments", ["status"])
    op.create_index("ix_controls_assessment_id", "controls", ["assessment_id"])
    op.create_index("ix_policies_assessment_id", "policies", ["assessment_id"])
    op.create_index("ix_audit_logs_timestamp", "audit_logs", ["timestamp"])
    op.create_index("ix_audit_logs_entity", "audit_logs", ["entity_type", "entity_id"])

    # Seed default roles
    op.execute(
        """
        INSERT INTO roles (id, name, description, created_at) VALUES
        (gen_random_uuid(), 'admin', 'System administrator with full access', NOW()),
        (gen_random_uuid(), 'compliance_manager', 'Manages assessments and reviews mappings', NOW()),
        (gen_random_uuid(), 'consultant', 'External assessor conducting evaluations', NOW()),
        (gen_random_uuid(), 'control_owner', 'Responds to interviews for assigned controls', NOW()),
        (gen_random_uuid(), 'viewer', 'Read-only access to assessment reports', NOW())
        """
    )


def downgrade() -> None:
    op.drop_index("ix_audit_logs_entity")
    op.drop_index("ix_audit_logs_timestamp")
    op.drop_index("ix_policies_assessment_id")
    op.drop_index("ix_controls_assessment_id")
    op.drop_index("ix_assessments_status")
    op.drop_index("ix_users_email")

    op.drop_table("audit_logs")
    op.drop_table("policy_mappings")
    op.drop_table("policies")
    op.drop_table("control_mappings")
    op.drop_table("controls")
    op.drop_table("assessments")
    op.drop_table("csf_subcategories")
    op.drop_table("csf_categories")
    op.drop_table("csf_functions")
    op.drop_table("user_roles")
    op.drop_table("users")
    op.drop_table("roles")
