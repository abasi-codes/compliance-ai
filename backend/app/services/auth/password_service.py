"""Password hashing service."""

from passlib.context import CryptContext


class PasswordService:
    """Service for password hashing and verification."""

    _context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Hash a password using bcrypt."""
        return cls._context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return cls._context.verify(plain_password, hashed_password)
