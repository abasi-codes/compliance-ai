"""Assessment CRUD endpoints."""

import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.assessment import Assessment, AssessmentStatus
from app.models.user import User
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentUpdate,
    AssessmentResponse,
    AssessmentListResponse,
)
from app.dependencies.auth import get_current_user, require_user
from app.services.audit.audit_service import AuditService
from app.services.workflow.state_machine import AssessmentStateMachine

router = APIRouter()


@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_in: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Create a new assessment."""
    assessment = Assessment(
        id=uuid.uuid4(),
        name=assessment_in.name,
        description=assessment_in.description,
        organization_name=assessment_in.organization_name,
        status=AssessmentStatus.DRAFT.value,
        created_by_id=current_user.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(assessment)

    audit_service = AuditService(db)
    audit_service.log_create(
        entity_type="assessment",
        entity_id=assessment.id,
        new_values={
            "name": assessment.name,
            "organization_name": assessment.organization_name,
        },
        user_id=current_user.id,
    )

    db.commit()
    db.refresh(assessment)

    return assessment


@router.get("", response_model=AssessmentListResponse)
async def list_assessments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """List all assessments."""
    query = db.query(Assessment)

    if status_filter:
        query = query.filter(Assessment.status == status_filter)

    total = query.count()
    assessments = query.order_by(Assessment.created_at.desc()).offset(skip).limit(limit).all()

    return AssessmentListResponse(items=assessments, total=total)


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get an assessment by ID."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    return assessment


@router.patch("/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: uuid.UUID,
    assessment_in: AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Update an assessment."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    audit_service = AuditService(db)
    old_values = {
        "name": assessment.name,
        "description": assessment.description,
        "organization_name": assessment.organization_name,
        "status": assessment.status,
    }

    # Handle status change through state machine
    if assessment_in.status and assessment_in.status.value != assessment.status:
        state_machine = AssessmentStateMachine(db)
        result = state_machine.transition(
            assessment_id=assessment_id,
            new_status=assessment_in.status.value,
            user_id=current_user.id,
        )
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"],
            )

    # Update other fields
    update_data = assessment_in.model_dump(exclude_unset=True, exclude={"status"})
    for field, value in update_data.items():
        setattr(assessment, field, value)

    assessment.updated_at = datetime.utcnow()

    new_values = {
        "name": assessment.name,
        "description": assessment.description,
        "organization_name": assessment.organization_name,
        "status": assessment.status,
    }

    audit_service.log_update(
        entity_type="assessment",
        entity_id=assessment_id,
        old_values=old_values,
        new_values=new_values,
        user_id=current_user.id,
    )

    db.commit()
    db.refresh(assessment)

    return assessment


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Delete an assessment."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    audit_service = AuditService(db)
    audit_service.log_delete(
        entity_type="assessment",
        entity_id=assessment_id,
        old_values={
            "name": assessment.name,
            "organization_name": assessment.organization_name,
            "status": assessment.status,
        },
        user_id=current_user.id,
    )

    db.delete(assessment)
    db.commit()


@router.get("/{assessment_id}/transitions")
async def get_available_transitions(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get available status transitions for an assessment."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    state_machine = AssessmentStateMachine(db)
    transitions = state_machine.get_available_transitions(assessment)

    return {
        "current_status": assessment.status,
        "available_transitions": transitions,
    }
