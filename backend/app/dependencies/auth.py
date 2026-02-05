"""Authentication and authorization dependencies."""

from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.permissions import Permission, has_permission
from app.services.auth import AuthService

# Optional bearer token security scheme
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
) -> UUID | None:
    """
    Get the current user ID from JWT token or legacy header.

    Supports both:
    - Authorization: Bearer <token> (preferred)
    - X-User-ID: <uuid> (legacy, for backwards compatibility)
    """
    # Prefer JWT token if provided
    if credentials and credentials.credentials:
        user_id = AuthService.get_user_id_from_token(
            credentials.credentials, token_type="access"
        )
        if user_id:
            return user_id
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fall back to legacy X-User-ID header
    if x_user_id:
        try:
            return UUID(x_user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format",
            )

    return None


async def get_current_user(
    user_id: UUID | None = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> User | None:
    """Get the current user from the database."""
    if user_id is None:
        return None

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


async def require_user(
    user: User | None = Depends(get_current_user),
) -> User:
    """Require an authenticated user."""
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_permission(permission: Permission):
    """Factory for permission-checking dependencies."""

    async def check_permission(
        user: User = Depends(require_user),
    ) -> User:
        user_roles = [role.name for role in user.roles]
        if not has_permission(user_roles, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission.value}",
            )
        return user

    return check_permission


def require_any_permission(*permissions: Permission):
    """Factory for checking any of multiple permissions."""

    async def check_permissions(
        user: User = Depends(require_user),
    ) -> User:
        user_roles = [role.name for role in user.roles]
        for permission in permissions:
            if has_permission(user_roles, permission):
                return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    return check_permissions
