"""Schemas for assessments."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.assessment import AssessmentStatus


class AssessmentBase(BaseModel):
    """Base schema for Assessment."""
    name: str = Field(..., max_length=255)
    description: str | None = None
    organization_name: str = Field(..., max_length=255)


class AssessmentCreate(AssessmentBase):
    """Schema for creating an Assessment."""
    pass


class AssessmentUpdate(BaseModel):
    """Schema for updating an Assessment."""
    name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    organization_name: str | None = Field(default=None, max_length=255)
    status: AssessmentStatus | None = None


class AssessmentResponse(AssessmentBase):
    """Schema for Assessment response."""
    id: UUID
    status: str
    created_by_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AssessmentListResponse(BaseModel):
    """Schema for list of assessments."""
    items: list[AssessmentResponse]
    total: int


class AssessmentDetailResponse(AssessmentResponse):
    """Schema for detailed assessment response."""
    controls_count: int = 0
    policies_count: int = 0
    interviews_count: int = 0
    completion_percentage: float = 0.0
