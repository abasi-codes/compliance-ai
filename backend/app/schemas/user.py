"""User schemas."""

from uuid import UUID
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserUpdate(BaseModel):
    """Schema for updating user profile."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None


class UserPreferencesBase(BaseModel):
    """Base schema for user preferences."""

    theme: str = Field(default="system", pattern="^(light|dark|system)$")
    email_notifications: bool = True
    default_framework_id: Optional[UUID] = None
    items_per_page: int = Field(default=25, ge=10, le=100)


class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences."""

    theme: Optional[str] = Field(None, pattern="^(light|dark|system)$")
    email_notifications: Optional[bool] = None
    default_framework_id: Optional[UUID] = None
    items_per_page: Optional[int] = Field(None, ge=10, le=100)


class UserPreferencesResponse(UserPreferencesBase):
    """Schema for user preferences response."""

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserProfileResponse(BaseModel):
    """Schema for user profile response."""

    id: UUID
    email: str
    name: str
    is_active: bool
    roles: list[str]
    created_at: datetime
    updated_at: datetime
    preferences: Optional[UserPreferencesResponse] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_user(cls, user) -> "UserProfileResponse":
        """Create response from User model."""
        prefs = None
        if user.preferences:
            prefs = UserPreferencesResponse.model_validate(user.preferences)

        return cls(
            id=user.id,
            email=user.email,
            name=user.name,
            is_active=user.is_active,
            roles=[role.name for role in user.roles],
            created_at=user.created_at,
            updated_at=user.updated_at,
            preferences=prefs,
        )
