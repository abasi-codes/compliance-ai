"""Mapping endpoints."""

import uuid
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.control import ControlMapping
from app.models.policy import PolicyMapping
from app.models.user import User
from app.schemas.mapping import (
    MappingGenerateRequest,
    MappingGenerateResponse,
    MappingApproveRequest,
    GapListResponse,
)
from app.schemas.control import ControlMappingResponse
from app.schemas.policy import PolicyMappingResponse
from app.dependencies.auth import get_current_user, require_user
from app.services.mapping.ai_mapper import AIMappingService
from app.services.mapping.gap_detector import GapDetectionService

router = APIRouter()


@router.post(
    "/assessments/{assessment_id}/generate",
    response_model=MappingGenerateResponse,
)
async def generate_mappings(
    assessment_id: uuid.UUID,
    request: MappingGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Generate AI-powered mapping suggestions for an assessment."""
    mapper = AIMappingService(db)

    result = mapper.generate_mappings_for_assessment(
        assessment_id=assessment_id,
        user_id=current_user.id,
        include_policies=request.include_policies,
        include_controls=request.include_controls,
        confidence_threshold=request.confidence_threshold,
    )

    return MappingGenerateResponse(**result)


@router.get("/assessments/{assessment_id}/policies")
async def get_policy_mappings(
    assessment_id: uuid.UUID,
    approved_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get all policy mappings for an assessment."""
    from app.models.policy import Policy

    query = (
        db.query(PolicyMapping)
        .join(Policy)
        .filter(Policy.assessment_id == assessment_id)
    )

    if approved_only:
        query = query.filter(PolicyMapping.is_approved == True)

    mappings = query.all()

    return [PolicyMappingResponse.model_validate(m) for m in mappings]


@router.get("/assessments/{assessment_id}/controls")
async def get_control_mappings(
    assessment_id: uuid.UUID,
    approved_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get all control mappings for an assessment."""
    from app.models.control import Control

    query = (
        db.query(ControlMapping)
        .join(Control)
        .filter(Control.assessment_id == assessment_id)
    )

    if approved_only:
        query = query.filter(ControlMapping.is_approved == True)

    mappings = query.all()

    return [ControlMappingResponse.model_validate(m) for m in mappings]


@router.post("/{mapping_id}/approve")
async def approve_mapping(
    mapping_id: uuid.UUID,
    mapping_type: Literal["policy", "control"],
    request: MappingApproveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Approve or reject a mapping suggestion."""
    mapper = AIMappingService(db)

    result = mapper.approve_mapping(
        mapping_id=mapping_id,
        mapping_type=mapping_type,
        approved=request.is_approved,
        user_id=current_user.id,
    )

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"],
        )

    return result


@router.post("/{mapping_id}/reject")
async def reject_mapping(
    mapping_id: uuid.UUID,
    mapping_type: Literal["policy", "control"],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Reject a mapping suggestion."""
    mapper = AIMappingService(db)

    result = mapper.approve_mapping(
        mapping_id=mapping_id,
        mapping_type=mapping_type,
        approved=False,
        user_id=current_user.id,
    )

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"],
        )

    return result


@router.get("/assessments/{assessment_id}/gaps", response_model=GapListResponse)
async def get_gaps(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get coverage gaps for an assessment."""
    gap_detector = GapDetectionService(db)
    result = gap_detector.detect_gaps(assessment_id)

    return GapListResponse(**result)
