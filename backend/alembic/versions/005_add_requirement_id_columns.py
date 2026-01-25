"""Add requirement_id columns to existing tables for multi-framework support

Revision ID: 005
Revises: 004
Create Date: 2025-01-25

This migration adds requirement_id columns to tables that currently reference
csf_subcategories, allowing a gradual transition to the unified framework system.

Tables modified:
- control_mappings: Add requirement_id, keep subcategory_id for backward compat
- policy_mappings: Add requirement_id, keep subcategory_id for backward compat
- interview_questions: Add requirement_id and cluster_id
- subcategory_scores: Add requirement_id (will rename table in future)
- deviations: Add requirement_id

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add requirement_id to control_mappings
    op.add_column(
        "control_mappings",
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_control_mappings_requirement_id", "control_mappings", ["requirement_id"])

    # Add requirement_id to policy_mappings
    op.add_column(
        "policy_mappings",
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_policy_mappings_requirement_id", "policy_mappings", ["requirement_id"])

    # Add requirement_id and cluster_id to interview_questions
    op.add_column(
        "interview_questions",
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
    )
    op.add_column(
        "interview_questions",
        sa.Column(
            "cluster_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("requirement_clusters.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_interview_questions_requirement_id", "interview_questions", ["requirement_id"])
    op.create_index("ix_interview_questions_cluster_id", "interview_questions", ["cluster_id"])

    # Add requirement_id to subcategory_scores
    op.add_column(
        "subcategory_scores",
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_subcategory_scores_requirement_id", "subcategory_scores", ["requirement_id"])

    # Add requirement_id to deviations
    op.add_column(
        "deviations",
        sa.Column(
            "requirement_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("framework_requirements.id"),
            nullable=True,
        ),
    )
    op.create_index("ix_deviations_requirement_id", "deviations", ["requirement_id"])

    # Backfill requirement_id from subcategory_id for existing records
    # Since we used the same IDs during migration, subcategory_id = requirement_id

    # Backfill control_mappings
    op.execute(
        """
        UPDATE control_mappings
        SET requirement_id = subcategory_id
        WHERE requirement_id IS NULL AND subcategory_id IS NOT NULL
        """
    )

    # Backfill policy_mappings
    op.execute(
        """
        UPDATE policy_mappings
        SET requirement_id = subcategory_id
        WHERE requirement_id IS NULL AND subcategory_id IS NOT NULL
        """
    )

    # Backfill interview_questions
    op.execute(
        """
        UPDATE interview_questions
        SET requirement_id = subcategory_id
        WHERE requirement_id IS NULL AND subcategory_id IS NOT NULL
        """
    )

    # Backfill subcategory_scores
    op.execute(
        """
        UPDATE subcategory_scores
        SET requirement_id = subcategory_id
        WHERE requirement_id IS NULL AND subcategory_id IS NOT NULL
        """
    )

    # Backfill deviations
    op.execute(
        """
        UPDATE deviations
        SET requirement_id = subcategory_id
        WHERE requirement_id IS NULL AND subcategory_id IS NOT NULL
        """
    )


def downgrade() -> None:
    # Remove indexes
    op.drop_index("ix_deviations_requirement_id")
    op.drop_index("ix_subcategory_scores_requirement_id")
    op.drop_index("ix_interview_questions_cluster_id")
    op.drop_index("ix_interview_questions_requirement_id")
    op.drop_index("ix_policy_mappings_requirement_id")
    op.drop_index("ix_control_mappings_requirement_id")

    # Remove columns
    op.drop_column("deviations", "requirement_id")
    op.drop_column("subcategory_scores", "requirement_id")
    op.drop_column("interview_questions", "cluster_id")
    op.drop_column("interview_questions", "requirement_id")
    op.drop_column("policy_mappings", "requirement_id")
    op.drop_column("control_mappings", "requirement_id")
