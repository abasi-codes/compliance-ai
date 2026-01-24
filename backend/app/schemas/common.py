"""Common schemas used across the application."""

from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class StatusResponse(BaseModel):
    """Generic status response."""
    status: str
    message: str | None = None


class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: str | None = None
    field_errors: dict[str, list[str]] | None = None


class AuditInfo(BaseModel):
    """Audit information for tracked entities."""
    created_at: str
    updated_at: str | None = None
    created_by_id: UUID | None = None
