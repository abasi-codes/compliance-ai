"""Audit logging service."""

import uuid
from datetime import datetime
from typing import Any, Optional

from sqlalchemy.orm import Session

from app.models.audit import AuditLog


class AuditService:
    """Service for creating audit log entries."""

    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        action: str,
        entity_type: str,
        entity_id: uuid.UUID | None = None,
        user_id: uuid.UUID | None = None,
        old_values: dict[str, Any] | None = None,
        new_values: dict[str, Any] | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        details: str | None = None,
    ) -> AuditLog:
        """Create an audit log entry."""
        audit_log = AuditLog(
            id=uuid.uuid4(),
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
            user_agent=user_agent,
            timestamp=datetime.utcnow(),
            details=details,
        )
        self.db.add(audit_log)
        self.db.flush()
        return audit_log

    def log_create(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        new_values: dict[str, Any],
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log a create action."""
        return self.log(
            action="create",
            entity_type=entity_type,
            entity_id=entity_id,
            new_values=new_values,
            user_id=user_id,
            **kwargs,
        )

    def log_update(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        old_values: dict[str, Any],
        new_values: dict[str, Any],
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log an update action."""
        return self.log(
            action="update",
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values,
            user_id=user_id,
            **kwargs,
        )

    def log_delete(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        old_values: dict[str, Any],
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log a delete action."""
        return self.log(
            action="delete",
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            user_id=user_id,
            **kwargs,
        )

    def log_state_change(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        old_state: str,
        new_state: str,
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log a state change action."""
        return self.log(
            action="state_change",
            entity_type=entity_type,
            entity_id=entity_id,
            old_values={"status": old_state},
            new_values={"status": new_state},
            user_id=user_id,
            **kwargs,
        )

    def log_approval(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        approved: bool,
        user_id: uuid.UUID,
        **kwargs,
    ) -> AuditLog:
        """Log an approval action."""
        return self.log(
            action="approve" if approved else "reject",
            entity_type=entity_type,
            entity_id=entity_id,
            new_values={"is_approved": approved},
            user_id=user_id,
            **kwargs,
        )

    def log_calculation(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        calculation_type: str,
        result: dict[str, Any],
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log a calculation action (e.g., score calculation)."""
        return self.log(
            action=f"calculate_{calculation_type}",
            entity_type=entity_type,
            entity_id=entity_id,
            new_values=result,
            user_id=user_id,
            **kwargs,
        )

    def log_generation(
        self,
        entity_type: str,
        entity_id: uuid.UUID,
        generation_type: str,
        user_id: uuid.UUID | None = None,
        **kwargs,
    ) -> AuditLog:
        """Log a generation action (e.g., report generation)."""
        return self.log(
            action=f"generate_{generation_type}",
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            **kwargs,
        )
