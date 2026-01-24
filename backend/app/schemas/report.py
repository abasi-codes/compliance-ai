"""Schemas for reports."""

from datetime import datetime
from uuid import UUID
from typing import Any

from pydantic import BaseModel, Field

from app.models.report import ReportType


class ExecutiveSummary(BaseModel):
    """Executive summary section of report."""
    overall_maturity: float
    key_strengths: list[str]
    critical_gaps: list[str]
    recommendations_summary: str


class MaturitySummary(BaseModel):
    """Maturity summary section of report."""
    by_function: list[dict[str, Any]]
    by_category: list[dict[str, Any]]


class DeviationSummary(BaseModel):
    """Deviation summary section of report."""
    total_count: int
    by_severity: dict[str, int]
    risk_ranked_list: list[dict[str, Any]]


class RecommendationSet(BaseModel):
    """Recommendations section of report."""
    immediate: list[dict[str, Any]]
    short_term: list[dict[str, Any]]
    long_term: list[dict[str, Any]]


class ReportContent(BaseModel):
    """Full report content structure."""
    executive_summary: ExecutiveSummary
    maturity_summary: MaturitySummary
    deviations: DeviationSummary
    recommendations: RecommendationSet
    function_details: list[dict[str, Any]] | None = None
    appendices: dict[str, Any] | None = None


class ReportBase(BaseModel):
    """Base schema for Report."""
    report_type: str
    title: str = Field(..., max_length=500)


class ReportCreate(ReportBase):
    """Schema for creating a Report."""
    assessment_id: UUID


class ReportResponse(ReportBase):
    """Schema for Report response."""
    id: UUID
    assessment_id: UUID
    content: dict
    generated_at: datetime
    generated_by_id: UUID | None = None
    version: int
    is_final: bool

    model_config = {"from_attributes": True}


class ReportListResponse(BaseModel):
    """List of reports."""
    items: list[ReportResponse]
    total: int
