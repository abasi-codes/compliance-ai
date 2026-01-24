"""Schemas for deviations and risk."""

from datetime import datetime
from uuid import UUID
from typing import Any

from pydantic import BaseModel, Field

from app.models.deviation import DeviationType, DeviationSeverity, DeviationStatus


class DeviationBase(BaseModel):
    """Base schema for Deviation."""
    subcategory_id: UUID
    deviation_type: str
    severity: str
    title: str = Field(..., max_length=500)
    description: str
    evidence: dict | None = None
    impact_score: int = Field(..., ge=1, le=5)
    likelihood_score: int = Field(..., ge=1, le=5)
    recommended_remediation: str | None = None


class DeviationCreate(DeviationBase):
    """Schema for creating a Deviation."""
    assessment_id: UUID


class DeviationUpdate(BaseModel):
    """Schema for updating a Deviation."""
    status: str | None = None
    remediation_notes: str | None = None
    severity: str | None = None


class DeviationResponse(DeviationBase):
    """Schema for Deviation response."""
    id: UUID
    assessment_id: UUID
    status: str
    risk_score: int
    remediation_notes: str | None = None
    detected_at: datetime
    updated_at: datetime
    subcategory_code: str | None = None

    model_config = {"from_attributes": True}


class DeviationListResponse(BaseModel):
    """List of deviations with summary."""
    items: list[DeviationResponse]
    total: int
    by_severity: dict[str, int]
    by_status: dict[str, int]


class RiskSummaryResponse(BaseModel):
    """Risk summary for an assessment."""
    assessment_id: UUID
    total_deviations: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    average_risk_score: float
    highest_risk_areas: list[dict[str, Any]]
    risk_by_function: dict[str, float]


class RiskMatrixEntry(BaseModel):
    """Entry in the risk matrix."""
    impact: int
    likelihood: int
    count: int
    deviations: list[UUID]
