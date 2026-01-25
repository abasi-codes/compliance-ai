"""Score models for maturity assessments."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, String, Float, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.framework import CSFSubcategory, CSFCategory, CSFFunction
    from app.models.unified_framework import FrameworkRequirement


class SubcategoryScore(Base):
    """Score for a specific requirement in an assessment.

    Note: Named SubcategoryScore for backward compatibility.
    Supports both legacy CSF subcategory scores and new unified requirement scores.
    """
    __tablename__ = "subcategory_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True
    )
    # Legacy: CSF subcategory reference (will be deprecated)
    subcategory_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_subcategories.id"), index=True
    )
    # New: Unified requirement reference
    requirement_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("framework_requirements.id"),
        index=True, nullable=True
    )
    score: Mapped[int] = mapped_column(nullable=False)  # 0-4 aligned with NIST tiers
    explanation_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    calculated_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    version: Mapped[int] = mapped_column(default=1)

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="subcategory_scores")
    subcategory: Mapped["CSFSubcategory"] = relationship()
    requirement: Mapped[Optional["FrameworkRequirement"]] = relationship()


class CategoryScore(Base):
    """Aggregated score for a CSF category."""
    __tablename__ = "category_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_categories.id"), index=True
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    version: Mapped[int] = mapped_column(default=1)

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="category_scores")
    category: Mapped["CSFCategory"] = relationship()


class FunctionScore(Base):
    """Aggregated score for a CSF function."""
    __tablename__ = "function_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True
    )
    function_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_functions.id"), index=True
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    version: Mapped[int] = mapped_column(default=1)

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="function_scores")
    function: Mapped["CSFFunction"] = relationship()
