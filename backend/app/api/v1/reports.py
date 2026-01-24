"""Report endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportResponse
from app.dependencies.auth import get_current_user, require_user
from app.services.report.generator import ReportGenerator

router = APIRouter()


@router.post("/assessments/{assessment_id}/generate", response_model=ReportResponse)
async def generate_report(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Generate a full assessment report."""
    generator = ReportGenerator(db)

    try:
        report = generator.generate_full_report(
            assessment_id=assessment_id,
            user_id=current_user.id,
        )
        return ReportResponse.model_validate(report)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get a report by ID."""
    generator = ReportGenerator(db)
    report = generator.get_report(report_id)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    return ReportResponse.model_validate(report)


@router.get("/{report_id}/download")
async def download_report(
    report_id: uuid.UUID,
    format: str = "json",
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Download a report in the specified format."""
    generator = ReportGenerator(db)
    report = generator.get_report(report_id)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if format != "json":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JSON format is supported in MVP",
        )

    # Return as downloadable JSON
    return JSONResponse(
        content=report.content,
        headers={
            "Content-Disposition": f'attachment; filename="report_{report_id}.json"',
        },
    )


@router.get("/assessments/{assessment_id}/list")
async def list_reports(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """List all reports for an assessment."""
    generator = ReportGenerator(db)
    reports = generator.list_reports(assessment_id)

    return {
        "items": [ReportResponse.model_validate(r) for r in reports],
        "total": len(reports),
    }


@router.patch("/{report_id}/finalize")
async def finalize_report(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Mark a report as final."""
    from datetime import datetime
    from app.services.audit.audit_service import AuditService

    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    report.is_final = True

    audit_service = AuditService(db)
    audit_service.log_update(
        entity_type="report",
        entity_id=report_id,
        old_values={"is_final": False},
        new_values={"is_final": True},
        user_id=current_user.id,
    )

    db.commit()

    return {"id": report_id, "is_final": True}
