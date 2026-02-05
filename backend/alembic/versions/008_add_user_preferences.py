"""Add user_preferences table

Revision ID: 008
Revises: 007
Create Date: 2025-01-29

This migration adds a user_preferences table for storing
user settings like theme, notifications, and defaults.
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = "008"
down_revision: Union[str, None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_preferences",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            unique=True,
            nullable=False,
        ),
        sa.Column("theme", sa.String(20), default="system", nullable=False),
        sa.Column("email_notifications", sa.Boolean, default=True, nullable=False),
        sa.Column(
            "default_framework_id",
            UUID(as_uuid=True),
            sa.ForeignKey("frameworks.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("items_per_page", sa.Integer, default=25, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    op.create_index(
        "ix_user_preferences_user_id",
        "user_preferences",
        ["user_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_user_preferences_user_id")
    op.drop_table("user_preferences")
