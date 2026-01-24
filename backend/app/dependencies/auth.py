"""Authentication and authorization dependencies."""

from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.permissions import Permission, has_permission


async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
) -> UUID | None:
    """
    Get the current user ID from headers.

    In production, this would validate a JWT or session token.
    For MVP, we use a simple header-based approach.
    """
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
