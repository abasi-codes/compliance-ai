"""Interview models for structured assessment interviews."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, String, Text, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.framework import CSFSubcategory
    from app.models.user import User


class QuestionType(str, Enum):
    """Types of interview questions aligned with control evaluation."""
    EXISTENCE = "existence"  # Does something exist?
    DESIGN = "design"  # Is it properly designed?
    OPERATION = "operation"  # Is it operating effectively?
    DOCUMENTATION = "documentation"  # Is it documented?
    RESPONSIBILITY = "responsibility"  # Who is responsible?


class InterviewSessionStatus(str, Enum):
    """Status of an interview session."""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class InterviewQuestion(Base):
    """Questions in the interview question bank."""
    __tablename__ = "interview_questions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    subcategory_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_subcategories.id"), index=True
    )
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), nullable=False)
    order: Mapped[int] = mapped_column(default=0)
    follow_up_on_yes_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_questions.id"), nullable=True
    )
    follow_up_on_no_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_questions.id"), nullable=True
    )
    target_roles: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    subcategory: Mapped["CSFSubcategory"] = relationship(back_populates="questions")
    follow_up_on_yes: Mapped[Optional["InterviewQuestion"]] = relationship(
        "InterviewQuestion",
        foreign_keys=[follow_up_on_yes_id],
        remote_side="InterviewQuestion.id",
    )
    follow_up_on_no: Mapped[Optional["InterviewQuestion"]] = relationship(
        "InterviewQuestion",
        foreign_keys=[follow_up_on_no_id],
        remote_side="InterviewQuestion.id",
    )
    responses: Mapped[list["InterviewResponse"]] = relationship(back_populates="question")


class InterviewSession(Base):
    """A single interview session with an interviewee."""
    __tablename__ = "interview_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True
    )
    interviewee_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    interviewee_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    interviewee_role: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default=InterviewSessionStatus.NOT_STARTED.value
    )
    current_question_index: Mapped[int] = mapped_column(default=0)
    total_questions: Mapped[int] = mapped_column(default=0)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    skipped_questions: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="interview_sessions")
    interviewee: Mapped[Optional["User"]] = relationship()
    responses: Mapped[list["InterviewResponse"]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )


class InterviewResponse(Base):
    """A response to an interview question."""
    __tablename__ = "interview_responses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_sessions.id"), index=True
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_questions.id"), index=True
    )
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_value: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    confidence_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    evidence_references: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    responded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    session: Mapped["InterviewSession"] = relationship(back_populates="responses")
    question: Mapped["InterviewQuestion"] = relationship(back_populates="responses")
