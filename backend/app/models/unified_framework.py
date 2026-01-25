"""Unified framework models for multi-framework compliance support.

Supports NIST CSF 2.0, ISO/IEC 27001:2022, SOC 2 TSC, and custom frameworks.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, String, Text, Float, JSON, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.assessment import Assessment
    from app.models.user import User


class FrameworkType(str, Enum):
    """Types of compliance frameworks."""
    NIST_CSF = "nist_csf"
    ISO_27001 = "iso_27001"
    SOC2_TSC = "soc2_tsc"
    CUSTOM = "custom"


class MappingType(str, Enum):
    """Types of cross-framework mappings."""
    EQUIVALENT = "equivalent"  # Requirements are essentially the same
    PARTIAL = "partial"  # Target partially satisfies source
    RELATED = "related"  # Requirements are related but distinct


class MappingSource(str, Enum):
    """Source of the mapping."""
    AI_GENERATED = "ai_generated"
    MANUAL = "manual"
    OFFICIAL = "official"  # From official crosswalk documents


class ClusterType(str, Enum):
    """Types of requirement clusters."""
    SEMANTIC = "semantic"  # Grouped by meaning similarity
    TOPIC = "topic"  # Grouped by topic/domain
    INTERVIEW = "interview"  # Optimized for interview flow


class Framework(Base):
    """A compliance framework (e.g., NIST CSF 2.0, ISO 27001, SOC 2)."""
    __tablename__ = "frameworks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    framework_type: Mapped[str] = mapped_column(
        String(50), default=FrameworkType.CUSTOM.value, nullable=False
    )
    # Number of hierarchy levels (e.g., NIST CSF has 3: Function > Category > Subcategory)
    hierarchy_levels: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    # Labels for each hierarchy level (e.g., ["Function", "Category", "Subcategory"])
    hierarchy_labels: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    # Additional framework metadata (e.g., publication date, official URL)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_builtin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    requirements: Mapped[list["FrameworkRequirement"]] = relationship(
        back_populates="framework",
        foreign_keys="FrameworkRequirement.framework_id"
    )
    company_frameworks: Mapped[list["CompanyFramework"]] = relationship(
        back_populates="framework"
    )


class FrameworkRequirement(Base):
    """A requirement within a compliance framework.

    This is a unified table that can represent requirements at any hierarchy level:
    - NIST CSF: Functions, Categories, Subcategories
    - ISO 27001: Clauses, Controls
    - SOC 2: Categories, Criteria
    - Custom: Any hierarchical structure
    """
    __tablename__ = "framework_requirements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    framework_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("frameworks.id"), index=True, nullable=False
    )
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("framework_requirements.id"),
        index=True, nullable=True
    )
    code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    guidance: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Hierarchy level (0 = root, 1 = first level, etc.)
    level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    # Whether this requirement can be directly assessed (leaf nodes)
    is_assessable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Display order within parent
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    # Additional metadata (e.g., implementation examples, references)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    # Vector embedding for similarity search (stored as list, indexed by pgvector)
    embedding: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    framework: Mapped["Framework"] = relationship(
        back_populates="requirements",
        foreign_keys=[framework_id]
    )
    parent: Mapped[Optional["FrameworkRequirement"]] = relationship(
        "FrameworkRequirement",
        foreign_keys=[parent_id],
        remote_side="FrameworkRequirement.id",
        back_populates="children"
    )
    children: Mapped[list["FrameworkRequirement"]] = relationship(
        "FrameworkRequirement",
        foreign_keys=[parent_id],
        back_populates="parent"
    )
    source_crosswalks: Mapped[list["RequirementCrosswalk"]] = relationship(
        back_populates="source_requirement",
        foreign_keys="RequirementCrosswalk.source_requirement_id"
    )
    target_crosswalks: Mapped[list["RequirementCrosswalk"]] = relationship(
        back_populates="target_requirement",
        foreign_keys="RequirementCrosswalk.target_requirement_id"
    )
    cluster_memberships: Mapped[list["RequirementClusterMember"]] = relationship(
        back_populates="requirement"
    )

    # Unique constraint: code must be unique within a framework
    __table_args__ = (
        # Index for fast lookup by framework and code
        # UniqueConstraint will be added via migration
    )


class RequirementCrosswalk(Base):
    """Cross-framework mapping between requirements.

    Maps requirements from one framework to equivalent/related requirements
    in another framework. Supports AI-generated and manually curated mappings.
    """
    __tablename__ = "requirement_crosswalks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source_requirement_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("framework_requirements.id"),
        index=True,
        nullable=False
    )
    target_requirement_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("framework_requirements.id"),
        index=True,
        nullable=False
    )
    mapping_type: Mapped[str] = mapped_column(
        String(50), default=MappingType.RELATED.value, nullable=False
    )
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    mapping_source: Mapped[str] = mapped_column(
        String(50), default=MappingSource.AI_GENERATED.value, nullable=False
    )
    # AI-generated reasoning for the mapping
    reasoning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Human approval tracking
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    approved_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    source_requirement: Mapped["FrameworkRequirement"] = relationship(
        back_populates="source_crosswalks",
        foreign_keys=[source_requirement_id]
    )
    target_requirement: Mapped["FrameworkRequirement"] = relationship(
        back_populates="target_crosswalks",
        foreign_keys=[target_requirement_id]
    )
    approved_by: Mapped[Optional["User"]] = relationship()


class RequirementCluster(Base):
    """A cluster of semantically similar requirements across frameworks.

    Used to optimize interviews by grouping related requirements,
    so a single question can assess multiple requirements at once.
    """
    __tablename__ = "requirement_clusters"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cluster_type: Mapped[str] = mapped_column(
        String(50), default=ClusterType.SEMANTIC.value, nullable=False
    )
    # Centroid embedding for the cluster (average of member embeddings)
    embedding_centroid: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    # Representative question that covers all cluster members
    interview_question: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Metadata (e.g., clustering parameters, quality metrics)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    members: Mapped[list["RequirementClusterMember"]] = relationship(
        back_populates="cluster",
        cascade="all, delete-orphan"
    )


class RequirementClusterMember(Base):
    """Association between a requirement and a cluster."""
    __tablename__ = "requirement_cluster_members"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    cluster_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("requirement_clusters.id"),
        index=True,
        nullable=False
    )
    requirement_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("framework_requirements.id"),
        index=True,
        nullable=False
    )
    # Similarity score to cluster centroid
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    cluster: Mapped["RequirementCluster"] = relationship(back_populates="members")
    requirement: Mapped["FrameworkRequirement"] = relationship(
        back_populates="cluster_memberships"
    )

    # Unique constraint: requirement can only belong to one cluster of each type
    __table_args__ = (
        # UniqueConstraint will be added via migration
    )


class CompanyFramework(Base):
    """Tracks which frameworks a company has selected for compliance.

    For the MVP, we use organization_name from assessments as a proxy for company.
    This allows companies to select which frameworks they need to comply with.
    """
    __tablename__ = "company_frameworks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    # Using organization_name as company identifier for MVP
    organization_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    framework_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("frameworks.id"), index=True, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Priority order for this framework (lower = higher priority)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    # Notes about why this framework was selected
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    framework: Mapped["Framework"] = relationship(back_populates="company_frameworks")


class AssessmentFrameworkScope(Base):
    """Defines which frameworks and requirements are in scope for an assessment.

    Allows assessments to include multiple frameworks and optionally
    exclude specific requirements from the assessment scope.
    """
    __tablename__ = "assessment_framework_scope"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assessments.id"), index=True, nullable=False
    )
    framework_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("frameworks.id"), index=True, nullable=False
    )
    # Whether to include all requirements from this framework
    include_all: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # List of requirement IDs to exclude (only used if include_all is True)
    excluded_requirement_ids: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    # List of requirement IDs to include (only used if include_all is False)
    included_requirement_ids: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    assessment: Mapped["Assessment"] = relationship()
    framework: Mapped["Framework"] = relationship()
