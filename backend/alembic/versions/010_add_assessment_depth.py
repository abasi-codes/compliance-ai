"""Add depth_level and ai_prompt_overrides columns to assessments table

Revision ID: 010
Revises: 009
Create Date: 2025-02-05

Adds depth_level for assessment depth (design/implementation) and
ai_prompt_overrides for user-customizable AI prompts.
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "010"
down_revision: Union[str, None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "assessments",
        sa.Column(
            "depth_level",
            sa.String(50),
            nullable=False,
            server_default=sa.text("'design'"),
        ),
    )
    op.add_column(
        "assessments",
        sa.Column(
            "ai_prompt_overrides",
            sa.JSON(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("assessments", "ai_prompt_overrides")
    op.drop_column("assessments", "depth_level")
