"""Control endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.control import Control
from app.models.user import User
from app.schemas.control import (
    ControlResponse,
    ControlUploadResponse,
)
from app.dependencies.auth import get_current_user, require_user
from app.services.ingestion.control_ingestion import ControlIngestionService
from app.core.config import settings

router = APIRouter()


@router.post(
    "/assessments/{assessment_id}/controls/upload",
    response_model=ControlUploadResponse,
)
async def upload_controls(
    assessment_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Upload controls from a CSV or XLSX file."""
    # Validate file extension
    filename = file.filename or "unknown"
    extension = filename.lower().split(".")[-1]

    if f".{extension}" not in settings.allowed_control_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {settings.allowed_control_extensions}",
        )

    # Check file size
    content = await file.read()
    if len(content) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.max_upload_size_mb}MB",
        )

    # Process the file
    ingestion_service = ControlIngestionService(db)
    result = ingestion_service.ingest_file(
        file_content=content,
        filename=filename,
        assessment_id=assessment_id,
        user_id=current_user.id,
    )

    return ControlUploadResponse(
        total_rows=result["total_rows"],
        successful=result["successful"],
        failed=result["failed"],
        errors=result.get("errors"),
        controls=[ControlResponse.model_validate(c) for c in result["controls"]],
    )


@router.get("/assessments/{assessment_id}/controls", response_model=list[ControlResponse])
async def list_controls(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """List all controls for an assessment."""
    controls = db.query(Control).filter(Control.assessment_id == assessment_id).all()
    return controls


@router.get("/controls/{control_id}", response_model=ControlResponse)
async def get_control(
    control_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get a control by ID."""
    control = db.query(Control).filter(Control.id == control_id).first()

    if not control:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Control not found",
        )

    return control


@router.delete("/controls/{control_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_control(
    control_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Delete a control."""
    control = db.query(Control).filter(Control.id == control_id).first()

    if not control:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Control not found",
        )

    db.delete(control)
    db.commit()
