"""API endpoints for multi-framework management."""

import uuid
from typing import Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.unified_framework import Framework, FrameworkType
from app.services.frameworks.framework_service import FrameworkService
from app.services.frameworks.requirement_service import RequirementService
from app.services.frameworks.loaders.document_loader import DocumentFrameworkLoader

router = APIRouter()


# Request/Response models
class FrameworkCreate(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=255)
    version: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    hierarchy_levels: int = Field(default=1, ge=1, le=10)
    hierarchy_labels: Optional[list[str]] = None
    metadata: Optional[dict] = None


class FrameworkUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    metadata: Optional[dict] = None


class FrameworkResponse(BaseModel):
    id: str
    code: str
    name: str
    version: str
    description: Optional[str]
    framework_type: str
    hierarchy_levels: int
    hierarchy_labels: Optional[list[str]]
    is_active: bool
    is_builtin: bool
    metadata: Optional[dict]

    class Config:
        from_attributes = True


class FrameworkStatsResponse(BaseModel):
    framework_id: str
    framework_code: str
    framework_name: str
    total_requirements: int
    assessable_requirements: int
    requirements_by_level: dict


class CompanyFrameworkCreate(BaseModel):
    framework_id: str
    priority: int = Field(default=0, ge=0)
    notes: Optional[str] = None


class AssessmentScopeCreate(BaseModel):
    framework_id: str
    include_all: bool = True
    excluded_requirement_ids: Optional[list[str]] = None
    included_requirement_ids: Optional[list[str]] = None


class FrameworkUploadConfirm(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=255)
    version: str = Field(default="1.0", min_length=1, max_length=50)
    description: Optional[str] = None
    hierarchy_labels: Optional[list[str]] = None
    requirements: list[dict]


# Endpoints
@router.get("", response_model=list[FrameworkResponse])
async def list_frameworks(
    is_active: Optional[bool] = True,
    framework_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List all compliance frameworks."""
    service = FrameworkService(db)
    frameworks = service.list_frameworks(
        is_active=is_active,
        framework_type=framework_type,
    )
    return [
        FrameworkResponse(
            id=str(f.id),
            code=f.code,
            name=f.name,
            version=f.version,
            description=f.description,
            framework_type=f.framework_type,
            hierarchy_levels=f.hierarchy_levels,
            hierarchy_labels=f.hierarchy_labels,
            is_active=f.is_active,
            is_builtin=f.is_builtin,
            metadata=f.extra_metadata,
        )
        for f in frameworks
    ]


@router.get("/{framework_id}", response_model=FrameworkResponse)
async def get_framework(
    framework_id: str,
    db: Session = Depends(get_db),
):
    """Get a framework by ID."""
    service = FrameworkService(db)
    framework = service.get_framework(uuid.UUID(framework_id))

    if not framework:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Framework {framework_id} not found",
        )

    return FrameworkResponse(
        id=str(framework.id),
        code=framework.code,
        name=framework.name,
        version=framework.version,
        description=framework.description,
        framework_type=framework.framework_type,
        hierarchy_levels=framework.hierarchy_levels,
        hierarchy_labels=framework.hierarchy_labels,
        is_active=framework.is_active,
        is_builtin=framework.is_builtin,
        metadata=framework.extra_metadata,
    )


@router.post("", response_model=FrameworkResponse, status_code=status.HTTP_201_CREATED)
async def create_framework(
    data: FrameworkCreate,
    db: Session = Depends(get_db),
):
    """Create a new custom framework."""
    service = FrameworkService(db)

    # Check if code already exists
    existing = service.get_framework_by_code(data.code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Framework with code {data.code} already exists",
        )

    framework = service.create_custom_framework(
        code=data.code,
        name=data.name,
        version=data.version,
        description=data.description,
        hierarchy_levels=data.hierarchy_levels,
        hierarchy_labels=data.hierarchy_labels,
        metadata=data.metadata,
    )

    return FrameworkResponse(
        id=str(framework.id),
        code=framework.code,
        name=framework.name,
        version=framework.version,
        description=framework.description,
        framework_type=framework.framework_type,
        hierarchy_levels=framework.hierarchy_levels,
        hierarchy_labels=framework.hierarchy_labels,
        is_active=framework.is_active,
        is_builtin=framework.is_builtin,
        metadata=framework.extra_metadata,
    )


@router.patch("/{framework_id}", response_model=FrameworkResponse)
async def update_framework(
    framework_id: str,
    data: FrameworkUpdate,
    db: Session = Depends(get_db),
):
    """Update a framework."""
    service = FrameworkService(db)
    framework = service.update_framework(
        framework_id=uuid.UUID(framework_id),
        name=data.name,
        description=data.description,
        is_active=data.is_active,
        metadata=data.metadata,
    )

    if not framework:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Framework {framework_id} not found",
        )

    return FrameworkResponse(
        id=str(framework.id),
        code=framework.code,
        name=framework.name,
        version=framework.version,
        description=framework.description,
        framework_type=framework.framework_type,
        hierarchy_levels=framework.hierarchy_levels,
        hierarchy_labels=framework.hierarchy_labels,
        is_active=framework.is_active,
        is_builtin=framework.is_builtin,
        metadata=framework.extra_metadata,
    )


@router.delete("/{framework_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_framework(
    framework_id: str,
    db: Session = Depends(get_db),
):
    """Delete a custom framework."""
    service = FrameworkService(db)
    framework = service.get_framework(uuid.UUID(framework_id))

    if not framework:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Framework {framework_id} not found",
        )

    if framework.is_builtin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete built-in frameworks. Use deactivate instead.",
        )

    service.delete_framework(uuid.UUID(framework_id))


@router.get("/{framework_id}/stats", response_model=FrameworkStatsResponse)
async def get_framework_stats(
    framework_id: str,
    db: Session = Depends(get_db),
):
    """Get statistics about a framework."""
    service = FrameworkService(db)
    stats = service.get_framework_stats(uuid.UUID(framework_id))

    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Framework {framework_id} not found",
        )

    return FrameworkStatsResponse(**stats)


@router.get("/{framework_id}/requirements")
async def get_framework_requirements(
    framework_id: str,
    parent_id: Optional[str] = None,
    level: Optional[int] = None,
    is_assessable: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """Get requirements for a framework with optional filters."""
    req_service = RequirementService(db)

    requirements = req_service.list_requirements(
        framework_id=uuid.UUID(framework_id),
        parent_id=uuid.UUID(parent_id) if parent_id else None,
        level=level,
        is_assessable=is_assessable,
    )

    return [
        {
            "id": str(req.id),
            "code": req.code,
            "name": req.name,
            "description": req.description,
            "guidance": req.guidance,
            "level": req.level,
            "is_assessable": req.is_assessable,
            "parent_id": str(req.parent_id) if req.parent_id else None,
            "display_order": req.display_order,
        }
        for req in requirements
    ]


@router.get("/{framework_id}/hierarchy")
async def get_framework_hierarchy(
    framework_id: str,
    max_depth: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Get the full requirement hierarchy as a nested tree."""
    req_service = RequirementService(db)
    tree = req_service.get_hierarchy_tree(
        framework_id=uuid.UUID(framework_id),
        max_depth=max_depth,
    )
    return tree


@router.post("/load-builtin")
async def load_builtin_frameworks(
    framework_type: Optional[str] = Query(
        None,
        description="Specific framework type to load (nist_csf, iso_27001, soc2_tsc). Load all if not specified.",
    ),
    force_reload: bool = False,
    db: Session = Depends(get_db),
):
    """Load built-in frameworks (NIST CSF, ISO 27001, SOC 2)."""
    service = FrameworkService(db)

    if framework_type:
        try:
            framework = service.load_builtin_framework(framework_type, force_reload)
            return {
                "message": f"Framework {framework.code} loaded successfully",
                "framework_id": str(framework.id),
                "framework_code": framework.code,
            }
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
    else:
        frameworks = service.load_all_builtin_frameworks(force_reload)
        return {
            "message": f"Loaded {len(frameworks)} frameworks",
            "frameworks": [
                {"id": str(f.id), "code": f.code, "name": f.name}
                for f in frameworks
            ],
        }


# Document upload endpoints
@router.post("/upload/preview")
async def upload_framework_preview(
    file: UploadFile = File(...),
    column_mapping: Optional[str] = Form(None),
):
    """Upload a document and get a preview of parsed requirements.

    Supports XLSX, CSV, PDF, and DOCX files. For spreadsheets, columns are
    auto-detected or can be explicitly mapped. For PDFs and DOCX files,
    AI is used to extract requirements.

    Returns a preview of parsed requirements that can be confirmed to create the framework.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    allowed = {"csv", "xlsx", "xls", "pdf", "docx", "doc", "txt", "md"}

    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{ext}. Allowed: {', '.join('.' + e for e in sorted(allowed))}",
        )

    content = await file.read()

    if len(content) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    try:
        col_map = None
        if column_mapping:
            import json
            col_map = json.loads(column_mapping)

        if ext in ("csv", "xlsx", "xls"):
            # Parse spreadsheet
            detection = DocumentFrameworkLoader.detect_columns(content, file.filename)
            requirements = DocumentFrameworkLoader.parse_spreadsheet(
                content, file.filename, col_map
            )
            return {
                "filename": file.filename,
                "file_type": "spreadsheet",
                "headers": detection.get("headers", []),
                "suggested_mapping": detection.get("suggested_mapping", {}),
                "requirements_count": len(requirements),
                "requirements": requirements[:100],  # Preview first 100
                "total_available": len(requirements),
            }
        else:
            # Parse document with AI
            requirements = await DocumentFrameworkLoader.parse_document_with_ai(
                content, file.filename
            )
            return {
                "filename": file.filename,
                "file_type": "document",
                "headers": [],
                "suggested_mapping": {},
                "requirements_count": len(requirements),
                "requirements": requirements[:100],
                "total_available": len(requirements),
            }

    except ImportError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")


@router.post("/upload/confirm", response_model=FrameworkResponse, status_code=status.HTTP_201_CREATED)
async def upload_framework_confirm(
    data: FrameworkUploadConfirm,
    db: Session = Depends(get_db),
):
    """Confirm and save a parsed framework from document upload.

    Takes the requirements previewed from /upload/preview and creates
    the framework in the database.
    """
    service = FrameworkService(db)

    # Check if code already exists
    existing = service.get_framework_by_code(data.code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Framework with code {data.code} already exists",
        )

    # Create the framework using DocumentFrameworkLoader
    loader = DocumentFrameworkLoader(
        requirements=data.requirements,
        framework_code=data.code,
        framework_name=data.name,
        framework_version=data.version,
        description=data.description,
        hierarchy_labels=data.hierarchy_labels,
    )

    framework = loader.load(db)

    return FrameworkResponse(
        id=str(framework.id),
        code=framework.code,
        name=framework.name,
        version=framework.version,
        description=framework.description,
        framework_type=framework.framework_type,
        hierarchy_levels=framework.hierarchy_levels,
        hierarchy_labels=framework.hierarchy_labels,
        is_active=framework.is_active,
        is_builtin=framework.is_builtin,
        metadata=framework.extra_metadata,
    )


# Company framework selection endpoints
@router.get("/companies/{organization_name}/frameworks")
async def get_company_frameworks(
    organization_name: str,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db),
):
    """Get frameworks selected by a company."""
    service = FrameworkService(db)
    company_frameworks = service.get_company_frameworks(
        organization_name=organization_name,
        is_active=is_active,
    )

    return [
        {
            "id": str(cf.id),
            "framework_id": str(cf.framework_id),
            "framework_code": cf.framework.code if cf.framework else None,
            "framework_name": cf.framework.name if cf.framework else None,
            "is_active": cf.is_active,
            "priority": cf.priority,
            "notes": cf.notes,
        }
        for cf in company_frameworks
    ]


@router.post("/companies/{organization_name}/frameworks")
async def add_company_framework(
    organization_name: str,
    data: CompanyFrameworkCreate,
    db: Session = Depends(get_db),
):
    """Add a framework to a company's selection."""
    service = FrameworkService(db)
    cf = service.add_company_framework(
        organization_name=organization_name,
        framework_id=uuid.UUID(data.framework_id),
        priority=data.priority,
        notes=data.notes,
    )

    return {
        "id": str(cf.id),
        "framework_id": str(cf.framework_id),
        "is_active": cf.is_active,
        "priority": cf.priority,
    }


@router.delete("/companies/{organization_name}/frameworks/{framework_id}")
async def remove_company_framework(
    organization_name: str,
    framework_id: str,
    db: Session = Depends(get_db),
):
    """Remove a framework from a company's selection."""
    service = FrameworkService(db)
    removed = service.remove_company_framework(
        organization_name=organization_name,
        framework_id=uuid.UUID(framework_id),
    )

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company framework selection not found",
        )

    return {"message": "Framework removed from company selection"}


# Assessment scope endpoints
@router.get("/assessments/{assessment_id}/scope")
async def get_assessment_scope(
    assessment_id: str,
    db: Session = Depends(get_db),
):
    """Get the framework scope for an assessment."""
    service = FrameworkService(db)
    scopes = service.get_assessment_scope(uuid.UUID(assessment_id))

    return [
        {
            "id": str(scope.id),
            "framework_id": str(scope.framework_id),
            "framework_code": scope.framework.code if scope.framework else None,
            "include_all": scope.include_all,
            "excluded_requirement_ids": scope.excluded_requirement_ids,
            "included_requirement_ids": scope.included_requirement_ids,
        }
        for scope in scopes
    ]


@router.post("/assessments/{assessment_id}/scope")
async def set_assessment_scope(
    assessment_id: str,
    data: AssessmentScopeCreate,
    db: Session = Depends(get_db),
):
    """Set the scope for a framework in an assessment."""
    service = FrameworkService(db)
    scope = service.set_assessment_scope(
        assessment_id=uuid.UUID(assessment_id),
        framework_id=uuid.UUID(data.framework_id),
        include_all=data.include_all,
        excluded_requirement_ids=data.excluded_requirement_ids,
        included_requirement_ids=data.included_requirement_ids,
    )

    return {
        "id": str(scope.id),
        "framework_id": str(scope.framework_id),
        "include_all": scope.include_all,
    }


@router.delete("/assessments/{assessment_id}/scope/{framework_id}")
async def remove_assessment_scope(
    assessment_id: str,
    framework_id: str,
    db: Session = Depends(get_db),
):
    """Remove a framework from an assessment's scope."""
    service = FrameworkService(db)
    removed = service.remove_assessment_scope(
        assessment_id=uuid.UUID(assessment_id),
        framework_id=uuid.UUID(framework_id),
    )

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment scope not found",
        )

    return {"message": "Framework removed from assessment scope"}
