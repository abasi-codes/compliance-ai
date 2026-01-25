"""Deviation and risk models."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, String, Text, Float, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.framework import CSFSubcategory
    from app.models.unified_framework import FrameworkRequirement


class DeviationType(str, Enum):
    """Types of deviations detected."""
    MISSING_POLICY = "missing_policy"
    MISSING_CONTROL = "missing_control"
    INADEQUATE_POLICY = "inadequate_policy"
    INADEQUATE_CONTROL = "inadequate_control"
    POLICY_CONTROL_GAP = "policy_control_gap"
    DOCUMENTATION_GAP = "documentation_gap"
    IMPLEMENTATION_GAP = "implementation_gap"


class DeviationSeverity(str, Enum):
    """Severity levels for deviations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class DeviationStatus(str, Enum):
    """Status of a deviation."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    REMEDIATED = "remediated"
    ACCEPTED = "accepted"
    FALSE_POSITIVE = "false_positive"


class Deviation(Base):
    """A detected deviation from expected compliance state.

    Supports both legacy CSF subcategory deviations and new unified requirement deviations.
    """
    __tablename__ = "deviations"

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
    deviation_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default=DeviationStatus.OPEN.value
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    impact_score: Mapped[int] = mapped_column(nullable=False)  # 1-5
    likelihood_score: Mapped[int] = mapped_column(nullable=False)  # 1-5
    risk_score: Mapped[int] = mapped_column(nullable=False)  # impact * likelihood
    recommended_remediation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    remediation_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="deviations")
    subcategory: Mapped["CSFSubcategory"] = relationship()
    requirement: Mapped[Optional["FrameworkRequirement"]] = relationship()
