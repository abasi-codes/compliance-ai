"""API endpoints for requirement clusters and interview optimization."""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.unified_framework import ClusterType
from app.services.clustering.clustering_service import ClusteringService
from app.services.clustering.embedding_service import EmbeddingService

router = APIRouter()


# Request/Response models
class ClusterGenerateRequest(BaseModel):
    framework_ids: Optional[list[str]] = None
    threshold: float = Field(default=0.85, ge=0.0, le=1.0)
    min_cluster_size: int = Field(default=2, ge=2)
    cluster_type: str = Field(default="semantic")


class ClusterResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    cluster_type: str
    member_count: int
    is_active: bool
    interview_question: Optional[str]


class ClusterMemberResponse(BaseModel):
    requirement_id: str
    requirement_code: str
    requirement_name: str
    framework_id: str
    similarity_score: float


class EmbeddingStatsResponse(BaseModel):
    total_requirements: int
    with_embeddings: int
    without_embeddings: int
    coverage_percentage: float


class InterviewReductionResponse(BaseModel):
    total_requirements: int
    clustered_requirements: int
    unclustered_requirements: int
    total_clusters: int
    questions_without_clustering: int
    questions_with_clustering: int
    reduction_percentage: float


# Endpoints
@router.get("", response_model=list[ClusterResponse])
async def list_clusters(
    cluster_type: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
):
    """List all requirement clusters."""
    service = ClusteringService(db)

    ct = None
    if cluster_type:
        try:
            ct = ClusterType(cluster_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid cluster type: {cluster_type}",
            )

    clusters = service.list_clusters(
        cluster_type=ct,
        is_active=is_active,
    )

    return [
        ClusterResponse(
            id=str(c.id),
            name=c.name,
            description=c.description,
            cluster_type=c.cluster_type,
            member_count=len(c.members) if c.members else 0,
            is_active=c.is_active,
            interview_question=c.interview_question,
        )
        for c in clusters
    ]


@router.get("/{cluster_id}", response_model=ClusterResponse)
async def get_cluster(
    cluster_id: str,
    db: Session = Depends(get_db),
):
    """Get a cluster by ID."""
    service = ClusteringService(db)
    cluster = service.get_cluster(uuid.UUID(cluster_id))

    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cluster {cluster_id} not found",
        )

    return ClusterResponse(
        id=str(cluster.id),
        name=cluster.name,
        description=cluster.description,
        cluster_type=cluster.cluster_type,
        member_count=len(cluster.members) if cluster.members else 0,
        is_active=cluster.is_active,
        interview_question=cluster.interview_question,
    )


@router.get("/{cluster_id}/members", response_model=list[ClusterMemberResponse])
async def get_cluster_members(
    cluster_id: str,
    db: Session = Depends(get_db),
):
    """Get all requirements in a cluster."""
    service = ClusteringService(db)
    members = service.get_cluster_members(uuid.UUID(cluster_id))

    if not members:
        # Check if cluster exists
        cluster = service.get_cluster(uuid.UUID(cluster_id))
        if not cluster:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cluster {cluster_id} not found",
            )

    return [
        ClusterMemberResponse(
            requirement_id=str(req.id),
            requirement_code=req.code,
            requirement_name=req.name,
            framework_id=str(req.framework_id),
            similarity_score=score,
        )
        for req, score in members
    ]


@router.post("/generate")
async def generate_clusters(
    data: ClusterGenerateRequest,
    db: Session = Depends(get_db),
):
    """Generate requirement clusters using AI-powered similarity analysis."""
    service = ClusteringService(db)

    try:
        cluster_type = ClusterType(data.cluster_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid cluster type: {data.cluster_type}. Must be one of: semantic, topic, interview",
        )

    framework_ids = [uuid.UUID(fid) for fid in data.framework_ids] if data.framework_ids else None

    clusters = service.generate_clusters(
        framework_ids=framework_ids,
        threshold=data.threshold,
        min_cluster_size=data.min_cluster_size,
        cluster_type=cluster_type,
    )

    return {
        "message": f"Generated {len(clusters)} clusters",
        "total_clusters": len(clusters),
        "clusters": [
            {
                "id": str(c.id),
                "name": c.name,
                "member_count": len(c.members) if c.members else 0,
            }
            for c in clusters
        ],
    }


@router.delete("")
async def delete_clusters(
    cluster_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Delete all clusters (optionally filtered by type)."""
    service = ClusteringService(db)

    ct = None
    if cluster_type:
        try:
            ct = ClusterType(cluster_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid cluster type: {cluster_type}",
            )

    count = service.delete_clusters(cluster_type=ct)
    return {"message": f"Deleted {count} clusters"}


@router.get("/interview-reduction", response_model=InterviewReductionResponse)
async def estimate_interview_reduction(
    framework_ids: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Estimate interview question reduction from clustering."""
    service = ClusteringService(db)

    fids = None
    if framework_ids:
        fids = [uuid.UUID(fid.strip()) for fid in framework_ids.split(",")]

    estimate = service.estimate_interview_reduction(framework_ids=fids)
    return InterviewReductionResponse(**estimate)


@router.get("/requirement/{requirement_id}/cluster")
async def get_requirement_cluster(
    requirement_id: str,
    cluster_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get the cluster a requirement belongs to."""
    service = ClusteringService(db)

    ct = None
    if cluster_type:
        try:
            ct = ClusterType(cluster_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid cluster type: {cluster_type}",
            )

    cluster = service.get_requirement_cluster(
        requirement_id=uuid.UUID(requirement_id),
        cluster_type=ct,
    )

    if not cluster:
        return {"cluster": None, "message": "Requirement is not in any cluster"}

    return {
        "cluster": {
            "id": str(cluster.id),
            "name": cluster.name,
            "description": cluster.description,
            "cluster_type": cluster.cluster_type,
            "interview_question": cluster.interview_question,
        }
    }


# Embedding management endpoints
@router.post("/embeddings/generate")
async def generate_embeddings(
    framework_id: Optional[str] = None,
    force: bool = False,
    db: Session = Depends(get_db),
):
    """Generate embeddings for requirements."""
    service = EmbeddingService(db)

    fid = uuid.UUID(framework_id) if framework_id else None

    stats = service.embed_all_requirements(
        framework_id=fid,
        force=force,
    )

    return {
        "message": "Embedding generation complete",
        "processed": stats["processed"],
        "skipped": stats["skipped"],
        "failed": stats["failed"],
    }


@router.get("/embeddings/stats", response_model=EmbeddingStatsResponse)
async def get_embedding_stats(
    framework_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get embedding coverage statistics."""
    from app.models.unified_framework import FrameworkRequirement

    query = db.query(FrameworkRequirement).filter(
        FrameworkRequirement.is_assessable == True
    )

    if framework_id:
        query = query.filter(FrameworkRequirement.framework_id == uuid.UUID(framework_id))

    total = query.count()
    with_embeddings = query.filter(
        FrameworkRequirement.embedding.isnot(None)
    ).count()

    return EmbeddingStatsResponse(
        total_requirements=total,
        with_embeddings=with_embeddings,
        without_embeddings=total - with_embeddings,
        coverage_percentage=(with_embeddings / total * 100) if total > 0 else 0,
    )
