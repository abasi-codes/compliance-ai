"""Schemas for scores."""

from datetime import datetime
from uuid import UUID
from typing import Any

from pydantic import BaseModel, Field


class ExplanationPayload(BaseModel):
    """Explanation payload for score transparency."""
    components: list[dict[str, Any]]
    rationale: str
    evidence_citations: list[dict[str, Any]] | None = None
    confidence_factors: dict[str, float] | None = None


class SubcategoryScoreBase(BaseModel):
    """Base schema for Subcategory Score."""
    subcategory_id: UUID
    score: int = Field(..., ge=0, le=4)
    explanation_payload: dict


class SubcategoryScoreResponse(SubcategoryScoreBase):
    """Schema for Subcategory Score response."""
    id: UUID
    assessment_id: UUID
    calculated_at: datetime
    calculated_by: str | None = None
    version: int
    subcategory_code: str | None = None

    model_config = {"from_attributes": True}


class CategoryScoreBase(BaseModel):
    """Base schema for Category Score."""
    category_id: UUID
    score: float = Field(..., ge=0.0, le=4.0)
    explanation_payload: dict


class CategoryScoreResponse(CategoryScoreBase):
    """Schema for Category Score response."""
    id: UUID
    assessment_id: UUID
    calculated_at: datetime
    version: int
    category_code: str | None = None
    category_name: str | None = None

    model_config = {"from_attributes": True}


class FunctionScoreBase(BaseModel):
    """Base schema for Function Score."""
    function_id: UUID
    score: float = Field(..., ge=0.0, le=4.0)
    explanation_payload: dict


class FunctionScoreResponse(FunctionScoreBase):
    """Schema for Function Score response."""
    id: UUID
    assessment_id: UUID
    calculated_at: datetime
    version: int
    function_code: str | None = None
    function_name: str | None = None

    model_config = {"from_attributes": True}


class ScoreSummaryResponse(BaseModel):
    """Summary of all scores for an assessment."""
    assessment_id: UUID
    overall_maturity: float
    function_scores: list[FunctionScoreResponse]
    category_scores: list[CategoryScoreResponse] | None = None
    calculated_at: datetime


class ScoreExplanationResponse(BaseModel):
    """Detailed explanation for a score."""
    score_id: UUID
    level: str  # subcategory, category, or function
    code: str
    score: float
    explanation: ExplanationPayload
