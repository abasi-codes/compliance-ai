"""Dashboard schemas."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel


class AssessmentCountByStatus(BaseModel):
    """Count of assessments by status."""

    draft: int = 0
    in_progress: int = 0
    review: int = 0
    completed: int = 0
    archived: int = 0


class FrameworkCoverage(BaseModel):
    """Coverage statistics for a framework."""

    framework_id: UUID
    framework_code: str
    framework_name: str
    total_requirements: int
    assessed_requirements: int
    coverage_percentage: float


class DeviationSummary(BaseModel):
    """Summary of deviations by severity."""

    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    total: int = 0


class RecentAssessment(BaseModel):
    """Brief assessment info for dashboard."""

    id: UUID
    name: str
    organization_name: str
    status: str
    maturity_score: Optional[float] = None
    updated_at: datetime


class ActionItem(BaseModel):
    """Pending action item."""

    id: UUID
    type: str  # "mapping_approval", "crosswalk_approval"
    title: str
    assessment_name: Optional[str] = None
    created_at: datetime


class ActivityEntry(BaseModel):
    """Recent activity log entry."""

    id: UUID
    action: str
    entity_type: str
    user_name: Optional[str] = None
    timestamp: datetime
    details: Optional[str] = None


class DashboardSummary(BaseModel):
    """Complete dashboard summary response."""

    # Assessment statistics
    total_assessments: int
    assessments_by_status: AssessmentCountByStatus

    # Overall maturity
    overall_maturity_score: Optional[float] = None
    overall_maturity_trend: Optional[float] = None  # Change from last period

    # Framework coverage
    framework_coverage: list[FrameworkCoverage]

    # Risk snapshot
    deviation_summary: DeviationSummary
    open_deviations: int

    # Recent assessments
    recent_assessments: list[RecentAssessment]

    # Action items (pending approvals)
    pending_approvals: int
    action_items: list[ActionItem]

    # Activity feed
    recent_activity: list[ActivityEntry]
