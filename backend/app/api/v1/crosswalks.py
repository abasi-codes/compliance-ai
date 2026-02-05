"""API endpoints for cross-framework requirement mappings (crosswalks)."""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.unified_framework import MappingType
from app.services.frameworks.crosswalk_service import CrosswalkService

router = APIRouter()


# Request/Response models
class CrosswalkGenerateRequest(BaseModel):
    source_framework_id: str
    target_framework_id: str
    similarity_threshold: float = Field(default=0.75, ge=0.0, le=1.0)
    top_k_per_requirement: int = Field(default=5, ge=1, le=20)
    validate_with_llm: bool = True
    auto_approve_threshold: float = Field(default=0.9, ge=0.0, le=1.0)


class CrosswalkCreateRequest(BaseModel):
    source_requirement_id: str
    target_requirement_id: str
    mapping_type: str = Field(default="related")
    reasoning: Optional[str] = None


class CrosswalkResponse(BaseModel):
    id: str
    source_requirement_id: str
    source_requirement_code: Optional[str]
    target_requirement_id: str
    target_requirement_code: Optional[str]
    mapping_type: str
    confidence_score: float
    mapping_source: str
    reasoning: Optional[str]
    is_approved: bool
    approved_at: Optional[str]


class CrosswalkStatsResponse(BaseModel):
    total_crosswalks: int
    approved: int
    pending_review: int
    by_type: dict
    by_source: dict
    average_confidence: float


class BulkCrosswalkRequest(BaseModel):
    crosswalk_ids: list[str]


class BulkCrosswalkResult(BaseModel):
    crosswalk_id: str
    success: bool
    error: Optional[str] = None


class BulkCrosswalkResponse(BaseModel):
    total: int
    successful: int
    failed: int
    results: list[BulkCrosswalkResult]


# Endpoints - specific paths MUST come before parameterized paths

@router.get("", response_model=list[CrosswalkResponse])
async def list_crosswalks(
    source_framework_id: Optional[str] = None,
    target_framework_id: Optional[str] = None,
    is_approved: Optional[bool] = None,
    mapping_type: Optional[str] = None,
    min_confidence: Optional[float] = None,
    db: Session = Depends(get_db),
):
    """List cross-framework mappings with optional filters."""
    service = CrosswalkService(db)

    mt = None
    if mapping_type:
        try:
            mt = MappingType(mapping_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid mapping type: {mapping_type}",
            )

    crosswalks = service.list_crosswalks(
        source_framework_id=uuid.UUID(source_framework_id) if source_framework_id else None,
        target_framework_id=uuid.UUID(target_framework_id) if target_framework_id else None,
        is_approved=is_approved,
        mapping_type=mt,
        min_confidence=min_confidence,
    )

    return [
        CrosswalkResponse(
            id=str(cw.id),
            source_requirement_id=str(cw.source_requirement_id),
            source_requirement_code=cw.source_requirement.code if cw.source_requirement else None,
            target_requirement_id=str(cw.target_requirement_id),
            target_requirement_code=cw.target_requirement.code if cw.target_requirement else None,
            mapping_type=cw.mapping_type,
            confidence_score=cw.confidence_score,
            mapping_source=cw.mapping_source,
            reasoning=cw.reasoning,
            is_approved=cw.is_approved,
            approved_at=cw.approved_at.isoformat() if cw.approved_at else None,
        )
        for cw in crosswalks
    ]


@router.get("/stats", response_model=CrosswalkStatsResponse)
async def get_crosswalk_stats(
    db: Session = Depends(get_db),
):
    """Get statistics about crosswalks."""
    service = CrosswalkService(db)
    stats = service.get_crosswalk_statistics()
    return CrosswalkStatsResponse(**stats)


@router.post("/generate")
async def generate_crosswalks(
    data: CrosswalkGenerateRequest,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db),
):
    """Generate AI-powered cross-framework mappings between two frameworks."""
    service = CrosswalkService(db)

    crosswalks = service.generate_crosswalks(
        source_framework_id=uuid.UUID(data.source_framework_id),
        target_framework_id=uuid.UUID(data.target_framework_id),
        similarity_threshold=data.similarity_threshold,
        top_k_per_requirement=data.top_k_per_requirement,
        validate_with_llm=data.validate_with_llm,
        auto_approve_threshold=data.auto_approve_threshold,
    )

    return {
        "message": f"Generated {len(crosswalks)} crosswalk mappings",
        "total_generated": len(crosswalks),
        "auto_approved": sum(1 for cw in crosswalks if cw.is_approved),
        "pending_review": sum(1 for cw in crosswalks if not cw.is_approved),
        "crosswalks": [
            {
                "id": str(cw.id),
                "source_requirement_id": str(cw.source_requirement_id),
                "target_requirement_id": str(cw.target_requirement_id),
                "mapping_type": cw.mapping_type,
                "confidence_score": cw.confidence_score,
                "is_approved": cw.is_approved,
            }
            for cw in crosswalks
        ],
    }


@router.post("", response_model=CrosswalkResponse, status_code=status.HTTP_201_CREATED)
async def create_crosswalk(
    data: CrosswalkCreateRequest,
    x_user_id: str = Header(None),
    db: Session = Depends(get_db),
):
    """Create a manual crosswalk mapping."""
    service = CrosswalkService(db)

    try:
        mapping_type = MappingType(data.mapping_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid mapping type: {data.mapping_type}. Must be one of: equivalent, partial, related",
        )

    user_id = uuid.UUID(x_user_id) if x_user_id else None

    cw = service.create_manual_crosswalk(
        source_requirement_id=uuid.UUID(data.source_requirement_id),
        target_requirement_id=uuid.UUID(data.target_requirement_id),
        mapping_type=mapping_type,
        reasoning=data.reasoning,
        created_by_id=user_id,
    )

    return CrosswalkResponse(
        id=str(cw.id),
        source_requirement_id=str(cw.source_requirement_id),
        source_requirement_code=cw.source_requirement.code if cw.source_requirement else None,
        target_requirement_id=str(cw.target_requirement_id),
        target_requirement_code=cw.target_requirement.code if cw.target_requirement else None,
        mapping_type=cw.mapping_type,
        confidence_score=cw.confidence_score,
        mapping_source=cw.mapping_source,
        reasoning=cw.reasoning,
        is_approved=cw.is_approved,
        approved_at=cw.approved_at.isoformat() if cw.approved_at else None,
    )


@router.get("/requirement/{requirement_id}/mappings")
async def get_requirement_crosswalks(
    requirement_id: str,
    as_source: bool = True,
    as_target: bool = True,
    is_approved: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """Get all crosswalks involving a requirement."""
    service = CrosswalkService(db)
    crosswalks = service.get_mappings_for_requirement(
        requirement_id=uuid.UUID(requirement_id),
        as_source=as_source,
        as_target=as_target,
        is_approved=is_approved,
    )

    return [
        {
            "id": str(cw.id),
            "source_requirement_id": str(cw.source_requirement_id),
            "source_requirement_code": cw.source_requirement.code if cw.source_requirement else None,
            "target_requirement_id": str(cw.target_requirement_id),
            "target_requirement_code": cw.target_requirement.code if cw.target_requirement else None,
            "mapping_type": cw.mapping_type,
            "confidence_score": cw.confidence_score,
            "is_approved": cw.is_approved,
            "direction": "source" if str(cw.source_requirement_id) == requirement_id else "target",
        }
        for cw in crosswalks
    ]


@router.get("/requirement/{requirement_id}/equivalents")
async def get_equivalent_requirements(
    requirement_id: str,
    transitive: bool = False,
    db: Session = Depends(get_db),
):
    """Get all requirements equivalent to the given requirement."""
    service = CrosswalkService(db)
    equivalents = service.get_equivalent_requirements(
        requirement_id=uuid.UUID(requirement_id),
        transitive=transitive,
    )

    return [
        {
            "id": str(req.id),
            "code": req.code,
            "name": req.name,
            "framework_id": str(req.framework_id),
        }
        for req in equivalents
    ]


# Parameterized routes MUST come after specific paths
@router.get("/{crosswalk_id}", response_model=CrosswalkResponse)
async def get_crosswalk(
    crosswalk_id: str,
    db: Session = Depends(get_db),
):
    """Get a crosswalk by ID."""
    service = CrosswalkService(db)
    cw = service.get_crosswalk(uuid.UUID(crosswalk_id))

    if not cw:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crosswalk {crosswalk_id} not found",
        )

    return CrosswalkResponse(
        id=str(cw.id),
        source_requirement_id=str(cw.source_requirement_id),
        source_requirement_code=cw.source_requirement.code if cw.source_requirement else None,
        target_requirement_id=str(cw.target_requirement_id),
        target_requirement_code=cw.target_requirement.code if cw.target_requirement else None,
        mapping_type=cw.mapping_type,
        confidence_score=cw.confidence_score,
        mapping_source=cw.mapping_source,
        reasoning=cw.reasoning,
        is_approved=cw.is_approved,
        approved_at=cw.approved_at.isoformat() if cw.approved_at else None,
    )


@router.post("/{crosswalk_id}/approve")
async def approve_crosswalk(
    crosswalk_id: str,
    x_user_id: str = Header(...),
    db: Session = Depends(get_db),
):
    """Approve a pending crosswalk mapping."""
    service = CrosswalkService(db)
    cw = service.approve_crosswalk(
        crosswalk_id=uuid.UUID(crosswalk_id),
        approved_by_id=uuid.UUID(x_user_id),
    )

    if not cw:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crosswalk {crosswalk_id} not found",
        )

    return {
        "id": str(cw.id),
        "is_approved": cw.is_approved,
        "approved_at": cw.approved_at.isoformat() if cw.approved_at else None,
    }


@router.delete("/{crosswalk_id}")
async def reject_crosswalk(
    crosswalk_id: str,
    db: Session = Depends(get_db),
):
    """Reject (delete) a crosswalk mapping."""
    service = CrosswalkService(db)
    deleted = service.reject_crosswalk(uuid.UUID(crosswalk_id))

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crosswalk {crosswalk_id} not found",
        )

    return {"message": "Crosswalk rejected and deleted"}


@router.post("/bulk-approve", response_model=BulkCrosswalkResponse)
async def bulk_approve_crosswalks(
    request: BulkCrosswalkRequest,
    x_user_id: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Bulk approve multiple crosswalk mappings.

    Approves all valid crosswalks and reports any failures.
    """
    service = CrosswalkService(db)
    user_id = uuid.UUID(x_user_id)

    results = []
    successful = 0
    failed = 0

    for crosswalk_id in request.crosswalk_ids:
        try:
            cw = service.approve_crosswalk(
                crosswalk_id=uuid.UUID(crosswalk_id),
                approved_by_id=user_id,
            )

            if cw:
                results.append(BulkCrosswalkResult(
                    crosswalk_id=crosswalk_id,
                    success=True,
                    error=None,
                ))
                successful += 1
            else:
                results.append(BulkCrosswalkResult(
                    crosswalk_id=crosswalk_id,
                    success=False,
                    error="Crosswalk not found",
                ))
                failed += 1

        except Exception as e:
            results.append(BulkCrosswalkResult(
                crosswalk_id=crosswalk_id,
                success=False,
                error=str(e),
            ))
            failed += 1

    return BulkCrosswalkResponse(
        total=len(request.crosswalk_ids),
        successful=successful,
        failed=failed,
        results=results,
    )


@router.post("/bulk-reject", response_model=BulkCrosswalkResponse)
async def bulk_reject_crosswalks(
    request: BulkCrosswalkRequest,
    db: Session = Depends(get_db),
):
    """
    Bulk reject (delete) multiple crosswalk mappings.

    Deletes all valid crosswalks and reports any failures.
    """
    service = CrosswalkService(db)

    results = []
    successful = 0
    failed = 0

    for crosswalk_id in request.crosswalk_ids:
        try:
            deleted = service.reject_crosswalk(uuid.UUID(crosswalk_id))

            if deleted:
                results.append(BulkCrosswalkResult(
                    crosswalk_id=crosswalk_id,
                    success=True,
                    error=None,
                ))
                successful += 1
            else:
                results.append(BulkCrosswalkResult(
                    crosswalk_id=crosswalk_id,
                    success=False,
                    error="Crosswalk not found",
                ))
                failed += 1

        except Exception as e:
            results.append(BulkCrosswalkResult(
                crosswalk_id=crosswalk_id,
                success=False,
                error=str(e),
            ))
            failed += 1

    return BulkCrosswalkResponse(
        total=len(request.crosswalk_ids),
        successful=successful,
        failed=failed,
        results=results,
    )
