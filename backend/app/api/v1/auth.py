"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    TokenRefresh,
    PasswordChange,
    UserResponse,
)
from app.services.auth import AuthService
from app.dependencies.auth import require_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserRegister,
    db: Session = Depends(get_db),
):
    """
    Register a new user.

    Creates a new user account with the provided email, password, and name.
    The user is assigned the default 'viewer' role.
    """
    auth_service = AuthService(db)

    # Check if email is already taken
    existing_user = auth_service.get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = auth_service.create_user(
        email=data.email,
        password=data.password,
        name=data.name,
    )

    return UserResponse.from_user(user)


@router.post("/login", response_model=TokenResponse)
async def login(
    data: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Login with email and password.

    Returns access and refresh tokens on successful authentication.
    """
    auth_service = AuthService(db)

    user = auth_service.authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = AuthService.create_access_token(user.id)
    refresh_token = AuthService.create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/guest", response_model=TokenResponse)
async def guest_login(
    db: Session = Depends(get_db),
):
    """
    Create a temporary guest account and return tokens.

    Creates a guest user with read-only (viewer) permissions.
    No credentials are required.
    """
    auth_service = AuthService(db)

    user = auth_service.create_guest_user()

    access_token = AuthService.create_access_token(user.id)
    refresh_token = AuthService.create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    data: TokenRefresh,
    db: Session = Depends(get_db),
):
    """
    Refresh access token using a valid refresh token.

    Returns new access and refresh tokens.
    """
    auth_service = AuthService(db)

    user_id = AuthService.get_user_id_from_token(data.refresh_token, token_type="refresh")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    access_token = AuthService.create_access_token(user.id)
    refresh_token = AuthService.create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout():
    """
    Logout the current user.

    Note: With stateless JWT tokens, logout is handled client-side by
    discarding the tokens. This endpoint exists for API consistency
    and could be extended to implement token blacklisting.
    """
    return None


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(require_user),
):
    """
    Get the current authenticated user's information.
    """
    return UserResponse.from_user(current_user)


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    data: PasswordChange,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Change the current user's password.

    Requires the current password for verification.
    """
    auth_service = AuthService(db)

    success = auth_service.change_password(
        user=current_user,
        current_password=data.current_password,
        new_password=data.new_password,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    return None
