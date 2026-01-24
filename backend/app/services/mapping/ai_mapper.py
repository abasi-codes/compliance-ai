"""AI-powered mapping service for policies and controls to CSF subcategories."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.control import Control, ControlMapping
from app.models.policy import Policy, PolicyMapping
from app.models.framework import CSFSubcategory
from app.core.ai_client import ai_client
from app.core.config import settings
from app.services.audit.audit_service import AuditService


class AIMappingService:
    """Service for generating AI-powered mapping suggestions."""

    def __init__(self, db: Session):
        self.db = db
        self.audit_service = AuditService(db)

    def generate_mappings_for_assessment(
        self,
        assessment_id: uuid.UUID,
        user_id: uuid.UUID | None = None,
        include_policies: bool = True,
        include_controls: bool = True,
        confidence_threshold: float | None = None,
    ) -> dict[str, Any]:
        """
        Generate mapping suggestions for all policies and controls in an assessment.

        Args:
            assessment_id: Assessment to generate mappings for
            user_id: User requesting the generation
            include_policies: Whether to generate policy mappings
            include_controls: Whether to generate control mappings
            confidence_threshold: Minimum confidence score (default from settings)

        Returns:
            Summary of generated mappings
        """
        if confidence_threshold is None:
            confidence_threshold = settings.default_confidence_threshold

        # Get all subcategories
        subcategories = self.db.query(CSFSubcategory).all()
        subcat_data = [
            {"code": sc.code, "description": sc.description, "id": sc.id}
            for sc in subcategories
        ]

        suggestions = []
        policy_mappings_count = 0
        control_mappings_count = 0

        # Generate policy mappings
        if include_policies:
            policies = self.db.query(Policy).filter(
                Policy.assessment_id == assessment_id
            ).all()

            for policy in policies:
                if not policy.content_text:
                    continue

                policy_suggestions = self._generate_mappings_for_entity(
                    entity=policy,
                    entity_type="policy",
                    subcategories=subcat_data,
                    confidence_threshold=confidence_threshold,
                )

                for suggestion in policy_suggestions:
                    # Create policy mapping
                    mapping = PolicyMapping(
                        id=uuid.uuid4(),
                        policy_id=policy.id,
                        subcategory_id=suggestion["subcategory_id"],
                        confidence_score=suggestion["confidence_score"],
                        is_approved=False,
                        created_at=datetime.utcnow(),
                    )
                    self.db.add(mapping)
                    policy_mappings_count += 1

                    suggestions.append({
                        "entity_type": "policy",
                        "entity_id": policy.id,
                        "entity_name": policy.name,
                        "subcategory_id": suggestion["subcategory_id"],
                        "subcategory_code": suggestion["subcategory_code"],
                        "confidence_score": suggestion["confidence_score"],
                        "reasoning": suggestion.get("reasoning"),
                    })

        # Generate control mappings
        if include_controls:
            controls = self.db.query(Control).filter(
                Control.assessment_id == assessment_id
            ).all()

            for control in controls:
                control_text = f"{control.name}\n{control.description or ''}"
                if not control_text.strip():
                    continue

                control_suggestions = self._generate_mappings_for_entity(
                    entity=control,
                    entity_type="control",
                    subcategories=subcat_data,
                    confidence_threshold=confidence_threshold,
                )

                for suggestion in control_suggestions:
                    # Create control mapping
                    mapping = ControlMapping(
                        id=uuid.uuid4(),
                        control_id=control.id,
                        subcategory_id=suggestion["subcategory_id"],
                        confidence_score=suggestion["confidence_score"],
                        is_approved=False,
                        created_at=datetime.utcnow(),
                    )
                    self.db.add(mapping)
                    control_mappings_count += 1

                    suggestions.append({
                        "entity_type": "control",
                        "entity_id": control.id,
                        "entity_name": control.name,
                        "subcategory_id": suggestion["subcategory_id"],
                        "subcategory_code": suggestion["subcategory_code"],
                        "confidence_score": suggestion["confidence_score"],
                        "reasoning": suggestion.get("reasoning"),
                    })

        self.db.flush()

        # Audit log
        self.audit_service.log_generation(
            entity_type="mapping",
            entity_id=assessment_id,
            generation_type="ai_mappings",
            user_id=user_id,
            details=f"Generated {len(suggestions)} mapping suggestions",
        )

        self.db.commit()

        return {
            "assessment_id": assessment_id,
            "suggestions_count": len(suggestions),
            "policy_mappings": policy_mappings_count,
            "control_mappings": control_mappings_count,
            "suggestions": suggestions,
        }

    def _generate_mappings_for_entity(
        self,
        entity: Policy | Control,
        entity_type: str,
        subcategories: list[dict],
        confidence_threshold: float,
    ) -> list[dict[str, Any]]:
        """Generate mapping suggestions for a single entity."""
        if entity_type == "policy":
            text = entity.content_text or ""
        else:
            text = f"{entity.name}\n{entity.description or ''}"

        if not text.strip():
            return []

        try:
            ai_suggestions = ai_client.generate_mapping_suggestions(
                entity_text=text,
                entity_type=entity_type,
                subcategories=[
                    {"code": sc["code"], "description": sc["description"]}
                    for sc in subcategories
                ],
            )
        except Exception:
            # If AI fails, return empty list
            return []

        # Map AI suggestions to internal format
        code_to_id = {sc["code"]: sc["id"] for sc in subcategories}
        suggestions = []

        for suggestion in ai_suggestions:
            code = suggestion.get("subcategory_code")
            confidence = suggestion.get("confidence_score", 0)

            if code not in code_to_id:
                continue

            if confidence < confidence_threshold:
                continue

            suggestions.append({
                "subcategory_id": code_to_id[code],
                "subcategory_code": code,
                "confidence_score": confidence,
                "reasoning": suggestion.get("reasoning"),
            })

        return suggestions

    def approve_mapping(
        self,
        mapping_id: uuid.UUID,
        mapping_type: str,
        approved: bool,
        user_id: uuid.UUID,
    ) -> dict[str, Any]:
        """
        Approve or reject a mapping suggestion.

        Args:
            mapping_id: ID of the mapping to approve/reject
            mapping_type: "policy" or "control"
            approved: Whether to approve
            user_id: User making the decision

        Returns:
            Updated mapping information
        """
        if mapping_type == "policy":
            mapping = self.db.query(PolicyMapping).filter(PolicyMapping.id == mapping_id).first()
        else:
            mapping = self.db.query(ControlMapping).filter(ControlMapping.id == mapping_id).first()

        if not mapping:
            return {"success": False, "error": "Mapping not found"}

        mapping.is_approved = approved
        mapping.approved_by_id = user_id
        mapping.approved_at = datetime.utcnow() if approved else None

        # Audit log
        self.audit_service.log_approval(
            entity_type=f"{mapping_type}_mapping",
            entity_id=mapping_id,
            approved=approved,
            user_id=user_id,
        )

        self.db.commit()

        return {
            "mapping_id": mapping_id,
            "mapping_type": mapping_type,
            "is_approved": approved,
            "approved_at": mapping.approved_at.isoformat() if mapping.approved_at else None,
        }

    def create_manual_mapping(
        self,
        entity_id: uuid.UUID,
        entity_type: str,
        subcategory_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> dict[str, Any]:
        """Create a manual mapping (auto-approved)."""
        if entity_type == "policy":
            mapping = PolicyMapping(
                id=uuid.uuid4(),
                policy_id=entity_id,
                subcategory_id=subcategory_id,
                confidence_score=1.0,
                is_approved=True,
                approved_by_id=user_id,
                approved_at=datetime.utcnow(),
                created_at=datetime.utcnow(),
            )
        else:
            mapping = ControlMapping(
                id=uuid.uuid4(),
                control_id=entity_id,
                subcategory_id=subcategory_id,
                confidence_score=1.0,
                is_approved=True,
                approved_by_id=user_id,
                approved_at=datetime.utcnow(),
                created_at=datetime.utcnow(),
            )

        self.db.add(mapping)

        self.audit_service.log_create(
            entity_type=f"{entity_type}_mapping",
            entity_id=mapping.id,
            new_values={
                "entity_id": str(entity_id),
                "subcategory_id": str(subcategory_id),
                "is_manual": True,
            },
            user_id=user_id,
        )

        self.db.commit()

        return {
            "mapping_id": mapping.id,
            "entity_type": entity_type,
            "is_approved": True,
        }
