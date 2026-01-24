"""Deviation endpoints."""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.deviation import Deviation
from app.models.user import User
from app.models.framework import CSFSubcategory
from app.schemas.deviation import DeviationResponse, DeviationListResponse, RiskSummaryResponse
from app.dependencies.auth import get_current_user, require_user
from app.services.deviation.detector import DeviationDetector

router = APIRouter()


@router.post("/assessments/{assessment_id}/deviations/detect")
async def detect_deviations(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Detect all deviations for an assessment."""
    detector = DeviationDetector(db)
    deviations = detector.detect_all_deviations(
        assessment_id=assessment_id,
        user_id=current_user.id,
    )

    return {
        "assessment_id": assessment_id,
        "deviations_detected": len(deviations),
    }


@router.get("/assessments/{assessment_id}/deviations")
async def get_deviations(
    assessment_id: uuid.UUID,
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get all deviations for an assessment with optional filters."""
    detector = DeviationDetector(db)
    deviations = detector.get_deviations(
        assessment_id=assessment_id,
        severity=severity,
        status=status_filter,
    )

    items = []
    severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    status_counts = {}

    for dev in deviations:
        subcat = db.query(CSFSubcategory).filter(CSFSubcategory.id == dev.subcategory_id).first()

        items.append({
            "id": dev.id,
            "assessment_id": dev.assessment_id,
            "subcategory_id": dev.subcategory_id,
            "subcategory_code": subcat.code if subcat else None,
            "deviation_type": dev.deviation_type,
            "severity": dev.severity,
            "status": dev.status,
            "title": dev.title,
            "description": dev.description,
            "evidence": dev.evidence,
            "impact_score": dev.impact_score,
            "likelihood_score": dev.likelihood_score,
            "risk_score": dev.risk_score,
            "recommended_remediation": dev.recommended_remediation,
            "remediation_notes": dev.remediation_notes,
            "detected_at": dev.detected_at,
            "updated_at": dev.updated_at,
        })

        severity_counts[dev.severity] = severity_counts.get(dev.severity, 0) + 1
        status_counts[dev.status] = status_counts.get(dev.status, 0) + 1

    return {
        "items": items,
        "total": len(items),
        "by_severity": severity_counts,
        "by_status": status_counts,
    }


@router.get("/assessments/{assessment_id}/risk-summary", response_model=RiskSummaryResponse)
async def get_risk_summary(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get risk summary for an assessment."""
    detector = DeviationDetector(db)
    return detector.get_risk_summary(assessment_id)


@router.patch("/deviations/{deviation_id}")
async def update_deviation(
    deviation_id: uuid.UUID,
    status_update: Optional[str] = None,
    remediation_notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Update a deviation (e.g., change status, add remediation notes)."""
    from datetime import datetime
    from app.services.audit.audit_service import AuditService

    deviation = db.query(Deviation).filter(Deviation.id == deviation_id).first()

    if not deviation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deviation not found",
        )

    audit_service = AuditService(db)
    old_values = {"status": deviation.status, "remediation_notes": deviation.remediation_notes}

    if status_update:
        deviation.status = status_update

    if remediation_notes:
        deviation.remediation_notes = remediation_notes

    deviation.updated_at = datetime.utcnow()

    audit_service.log_update(
        entity_type="deviation",
        entity_id=deviation_id,
        old_values=old_values,
        new_values={"status": deviation.status, "remediation_notes": deviation.remediation_notes},
        user_id=current_user.id,
    )

    db.commit()
    db.refresh(deviation)

    return {"id": deviation.id, "status": deviation.status, "updated_at": deviation.updated_at}
