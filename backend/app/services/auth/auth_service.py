"""JWT authentication service."""

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User, Role
from app.services.auth.password_service import PasswordService


class AuthService:
    """Service for JWT token management and authentication."""

    def __init__(self, db: Session):
        self.db = db

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not user.password_hash:
            return None
        if not PasswordService.verify_password(password, user.password_hash):
            return None
        if not user.is_active:
            return None
        return user

    def create_user(self, email: str, password: str, name: str) -> User:
        """Create a new user with hashed password."""
        password_hash = PasswordService.hash_password(password)
        user = User(
            email=email,
            name=name,
            password_hash=password_hash,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()

        # Assign default viewer role
        viewer_role = self.db.query(Role).filter(Role.name == "viewer").first()
        if viewer_role:
            user.roles.append(viewer_role)

        self.db.commit()
        self.db.refresh(user)
        return user

    def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> bool:
        """Change a user's password."""
        if not user.password_hash:
            return False
        if not PasswordService.verify_password(current_password, user.password_hash):
            return False
        user.password_hash = PasswordService.hash_password(new_password)
        self.db.commit()
        return True

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get a user by ID."""
        return (
            self.db.query(User)
            .filter(User.id == user_id, User.is_active == True)
            .first()
        )

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email."""
        return self.db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_access_token(user_id: UUID) -> str:
        """Create a new access token."""
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.jwt_access_token_expire_minutes
        )
        to_encode = {
            "sub": str(user_id),
            "type": "access",
            "exp": expire,
        }
        return jwt.encode(
            to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )

    @staticmethod
    def create_refresh_token(user_id: UUID) -> str:
        """Create a new refresh token."""
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.jwt_refresh_token_expire_days
        )
        to_encode = {
            "sub": str(user_id),
            "type": "refresh",
            "exp": expire,
        }
        return jwt.encode(
            to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )

    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        """Decode and validate a JWT token."""
        try:
            payload = jwt.decode(
                token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
            )
            return payload
        except JWTError:
            return None

    @staticmethod
    def get_user_id_from_token(token: str, token_type: str = "access") -> Optional[UUID]:
        """Extract user ID from a valid token."""
        payload = AuthService.decode_token(token)
        if payload is None:
            return None
        if payload.get("type") != token_type:
            return None
        user_id_str = payload.get("sub")
        if user_id_str is None:
            return None
        try:
            return UUID(user_id_str)
        except ValueError:
            return None
