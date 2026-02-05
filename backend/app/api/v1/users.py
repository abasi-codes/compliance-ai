"""User profile and preferences API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserPreferences
from app.schemas.user import (
    UserUpdate,
    UserPreferencesUpdate,
    UserPreferencesResponse,
    UserProfileResponse,
)
from app.dependencies.auth import require_user
from app.services.audit.audit_service import AuditService

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Get the current user's profile including preferences.
    """
    return UserProfileResponse.from_user(current_user)


@router.patch("/me", response_model=UserProfileResponse)
async def update_current_user_profile(
    data: UserUpdate,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Update the current user's profile.
    """
    audit_service = AuditService(db)
    old_values = {}
    new_values = {}

    if data.name is not None and data.name != current_user.name:
        old_values["name"] = current_user.name
        new_values["name"] = data.name
        current_user.name = data.name

    if data.email is not None and data.email != current_user.email:
        # Check if email is already taken
        existing = db.query(User).filter(
            User.email == data.email,
            User.id != current_user.id,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use",
            )
        old_values["email"] = current_user.email
        new_values["email"] = data.email
        current_user.email = data.email

    if new_values:
        audit_service.log_update(
            entity_type="user",
            entity_id=current_user.id,
            old_values=old_values,
            new_values=new_values,
            user_id=current_user.id,
        )
        db.commit()
        db.refresh(current_user)

    return UserProfileResponse.from_user(current_user)


@router.get("/me/preferences", response_model=UserPreferencesResponse)
async def get_current_user_preferences(
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Get the current user's preferences.

    If no preferences exist, creates default preferences.
    """
    if not current_user.preferences:
        # Create default preferences
        preferences = UserPreferences(
            user_id=current_user.id,
            theme="system",
            email_notifications=True,
            items_per_page=25,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
        return UserPreferencesResponse.model_validate(preferences)

    return UserPreferencesResponse.model_validate(current_user.preferences)


@router.patch("/me/preferences", response_model=UserPreferencesResponse)
async def update_current_user_preferences(
    data: UserPreferencesUpdate,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Update the current user's preferences.
    """
    audit_service = AuditService(db)

    # Create preferences if they don't exist
    if not current_user.preferences:
        preferences = UserPreferences(
            user_id=current_user.id,
            theme="system",
            email_notifications=True,
            items_per_page=25,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(preferences)
        db.flush()
    else:
        preferences = current_user.preferences

    old_values = {}
    new_values = {}

    if data.theme is not None and data.theme != preferences.theme:
        old_values["theme"] = preferences.theme
        new_values["theme"] = data.theme
        preferences.theme = data.theme

    if data.email_notifications is not None and data.email_notifications != preferences.email_notifications:
        old_values["email_notifications"] = preferences.email_notifications
        new_values["email_notifications"] = data.email_notifications
        preferences.email_notifications = data.email_notifications

    if data.default_framework_id is not None:
        old_values["default_framework_id"] = str(preferences.default_framework_id) if preferences.default_framework_id else None
        new_values["default_framework_id"] = str(data.default_framework_id)
        preferences.default_framework_id = data.default_framework_id

    if data.items_per_page is not None and data.items_per_page != preferences.items_per_page:
        old_values["items_per_page"] = preferences.items_per_page
        new_values["items_per_page"] = data.items_per_page
        preferences.items_per_page = data.items_per_page

    if new_values:
        preferences.updated_at = datetime.utcnow()
        audit_service.log_update(
            entity_type="user_preferences",
            entity_id=preferences.id,
            old_values=old_values,
            new_values=new_values,
            user_id=current_user.id,
        )

    db.commit()
    db.refresh(preferences)

    return UserPreferencesResponse.model_validate(preferences)
