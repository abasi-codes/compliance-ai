"""Schemas for interviews."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.interview import QuestionType, InterviewSessionStatus


class InterviewQuestionBase(BaseModel):
    """Base schema for Interview Question."""
    question_text: str
    question_type: str
    order: int = 0
    target_roles: list[str] | None = None


class InterviewQuestionResponse(InterviewQuestionBase):
    """Schema for Interview Question response."""
    id: UUID
    subcategory_id: UUID
    subcategory_code: str | None = None
    follow_up_on_yes_id: UUID | None = None
    follow_up_on_no_id: UUID | None = None
    is_active: bool

    model_config = {"from_attributes": True}


class InterviewSessionBase(BaseModel):
    """Base schema for Interview Session."""
    interviewee_name: str | None = Field(default=None, max_length=255)
    interviewee_role: str | None = Field(default=None, max_length=255)
    notes: str | None = None


class InterviewSessionCreate(InterviewSessionBase):
    """Schema for creating an Interview Session."""
    assessment_id: UUID
    interviewee_id: UUID | None = None


class InterviewSessionUpdate(BaseModel):
    """Schema for updating an Interview Session."""
    interviewee_name: str | None = Field(default=None, max_length=255)
    interviewee_role: str | None = Field(default=None, max_length=255)
    notes: str | None = None
    status: str | None = None


class InterviewSessionResponse(InterviewSessionBase):
    """Schema for Interview Session response."""
    id: UUID
    assessment_id: UUID
    interviewee_id: UUID | None = None
    status: str
    current_question_index: int
    total_questions: int
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InterviewResponseBase(BaseModel):
    """Base schema for Interview Response."""
    response_text: str | None = None
    response_value: str | None = Field(default=None, max_length=50)
    confidence_level: str | None = Field(default=None, max_length=50)
    evidence_references: dict | None = None


class InterviewResponseCreate(InterviewResponseBase):
    """Schema for creating an Interview Response."""
    question_id: UUID


class InterviewResponseResponse(InterviewResponseBase):
    """Schema for Interview Response response."""
    id: UUID
    session_id: UUID
    question_id: UUID
    responded_at: datetime
    created_at: datetime
    question_text: str | None = None

    model_config = {"from_attributes": True}


class NextQuestionResponse(BaseModel):
    """Response for next interview question."""
    question: InterviewQuestionResponse | None = None
    question_number: int
    total_questions: int
    progress_percentage: float
    is_complete: bool = False


class InterviewProgressResponse(BaseModel):
    """Response for interview progress."""
    session_id: UUID
    status: str
    questions_answered: int
    total_questions: int
    progress_percentage: float
    responses: list[InterviewResponseResponse] | None = None
