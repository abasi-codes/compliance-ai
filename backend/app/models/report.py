"""Report models for assessment outputs."""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, String, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.user import User


class ReportType(str, Enum):
    """Types of reports that can be generated."""
    FULL_ASSESSMENT = "full_assessment"
    EXECUTIVE_SUMMARY = "executive_summary"
    MATURITY_SUMMARY = "maturity_summary"
    GAP_ANALYSIS = "gap_analysis"
    DEVIATION_REPORT = "deviation_report"
    REMEDIATION_PLAN = "remediation_plan"


class Report(Base):
    """A generated assessment report."""
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True
    )
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    generated_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    version: Mapped[int] = mapped_column(default=1)
    is_final: Mapped[bool] = mapped_column(default=False)

    # Relationships
    assessment: Mapped["Assessment"] = relationship(back_populates="reports")
    generated_by: Mapped[Optional["User"]] = relationship()
