"""Add interview, score, deviation, and report tables

Revision ID: 002
Revises: 001
Create Date: 2025-01-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Interview Questions table
    op.create_table(
        "interview_questions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "subcategory_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_subcategories.id"),
            nullable=False,
        ),
        sa.Column("question_text", sa.Text, nullable=False),
        sa.Column("question_type", sa.String(50), nullable=False),
        sa.Column("order", sa.Integer, nullable=False, default=0),
        sa.Column(
            "follow_up_on_yes_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("interview_questions.id"),
            nullable=True,
        ),
        sa.Column(
            "follow_up_on_no_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("interview_questions.id"),
            nullable=True,
        ),
        sa.Column("target_roles", postgresql.JSONB, nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Interview Sessions table
    op.create_table(
        "interview_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "interviewee_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column("interviewee_name", sa.String(255), nullable=True),
        sa.Column("interviewee_role", sa.String(255), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, default="not_started"),
        sa.Column("current_question_index", sa.Integer, nullable=False, default=0),
        sa.Column("total_questions", sa.Integer, nullable=False, default=0),
        sa.Column("started_at", sa.DateTime, nullable=True),
        sa.Column("completed_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("skipped_questions", postgresql.JSONB, nullable=True),
    )

    # Interview Responses table
    op.create_table(
        "interview_responses",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "session_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("interview_sessions.id"),
            nullable=False,
        ),
        sa.Column(
            "question_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("interview_questions.id"),
            nullable=False,
        ),
        sa.Column("response_text", sa.Text, nullable=True),
        sa.Column("response_value", sa.String(50), nullable=True),
        sa.Column("confidence_level", sa.String(50), nullable=True),
        sa.Column("evidence_references", postgresql.JSONB, nullable=True),
        sa.Column("responded_at", sa.DateTime, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Subcategory Scores table
    op.create_table(
        "subcategory_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "subcategory_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_subcategories.id"),
            nullable=False,
        ),
        sa.Column("score", sa.Integer, nullable=False),
        sa.Column("explanation_payload", postgresql.JSONB, nullable=False),
        sa.Column("calculated_at", sa.DateTime, nullable=False),
        sa.Column("calculated_by", sa.String(100), nullable=True),
        sa.Column("version", sa.Integer, nullable=False, default=1),
    )

    # Category Scores table
    op.create_table(
        "category_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_categories.id"),
            nullable=False,
        ),
        sa.Column("score", sa.Float, nullable=False),
        sa.Column("explanation_payload", postgresql.JSONB, nullable=False),
        sa.Column("calculated_at", sa.DateTime, nullable=False),
        sa.Column("version", sa.Integer, nullable=False, default=1),
    )

    # Function Scores table
    op.create_table(
        "function_scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "function_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_functions.id"),
            nullable=False,
        ),
        sa.Column("score", sa.Float, nullable=False),
        sa.Column("explanation_payload", postgresql.JSONB, nullable=False),
        sa.Column("calculated_at", sa.DateTime, nullable=False),
        sa.Column("version", sa.Integer, nullable=False, default=1),
    )

    # Deviations table
    op.create_table(
        "deviations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column(
            "subcategory_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("csf_subcategories.id"),
            nullable=False,
        ),
        sa.Column("deviation_type", sa.String(50), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, default="open"),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("evidence", postgresql.JSONB, nullable=True),
        sa.Column("impact_score", sa.Integer, nullable=False),
        sa.Column("likelihood_score", sa.Integer, nullable=False),
        sa.Column("risk_score", sa.Integer, nullable=False),
        sa.Column("recommended_remediation", sa.Text, nullable=True),
        sa.Column("remediation_notes", sa.Text, nullable=True),
        sa.Column("detected_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Reports table
    op.create_table(
        "reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "assessment_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("assessments.id"),
            nullable=False,
        ),
        sa.Column("report_type", sa.String(50), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("content", postgresql.JSONB, nullable=False),
        sa.Column("generated_at", sa.DateTime, nullable=False),
        sa.Column(
            "generated_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column("version", sa.Integer, nullable=False, default=1),
        sa.Column("is_final", sa.Boolean, nullable=False, default=False),
    )

    # Create indexes
    op.create_index("ix_interview_questions_subcategory_id", "interview_questions", ["subcategory_id"])
    op.create_index("ix_interview_sessions_assessment_id", "interview_sessions", ["assessment_id"])
    op.create_index("ix_interview_sessions_status", "interview_sessions", ["status"])
    op.create_index("ix_interview_responses_session_id", "interview_responses", ["session_id"])
    op.create_index("ix_subcategory_scores_assessment_id", "subcategory_scores", ["assessment_id"])
    op.create_index("ix_category_scores_assessment_id", "category_scores", ["assessment_id"])
    op.create_index("ix_function_scores_assessment_id", "function_scores", ["assessment_id"])
    op.create_index("ix_deviations_assessment_id", "deviations", ["assessment_id"])
    op.create_index("ix_deviations_severity", "deviations", ["severity"])
    op.create_index("ix_deviations_status", "deviations", ["status"])
    op.create_index("ix_reports_assessment_id", "reports", ["assessment_id"])


def downgrade() -> None:
    op.drop_index("ix_reports_assessment_id")
    op.drop_index("ix_deviations_status")
    op.drop_index("ix_deviations_severity")
    op.drop_index("ix_deviations_assessment_id")
    op.drop_index("ix_function_scores_assessment_id")
    op.drop_index("ix_category_scores_assessment_id")
    op.drop_index("ix_subcategory_scores_assessment_id")
    op.drop_index("ix_interview_responses_session_id")
    op.drop_index("ix_interview_sessions_status")
    op.drop_index("ix_interview_sessions_assessment_id")
    op.drop_index("ix_interview_questions_subcategory_id")

    op.drop_table("reports")
    op.drop_table("deviations")
    op.drop_table("function_scores")
    op.drop_table("category_scores")
    op.drop_table("subcategory_scores")
    op.drop_table("interview_responses")
    op.drop_table("interview_sessions")
    op.drop_table("interview_questions")
