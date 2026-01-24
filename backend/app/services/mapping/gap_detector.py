"""Gap detection service for identifying coverage gaps."""

import uuid
from typing import Any

from sqlalchemy.orm import Session, joinedload

from app.models.control import Control, ControlMapping
from app.models.policy import Policy, PolicyMapping
from app.models.framework import CSFFunction, CSFCategory, CSFSubcategory


class GapDetectionService:
    """Service for detecting gaps in framework coverage."""

    def __init__(self, db: Session):
        self.db = db

    def detect_gaps(self, assessment_id: uuid.UUID) -> dict[str, Any]:
        """
        Detect coverage gaps for an assessment.

        Identifies:
        - Subcategories with no approved mappings (policy or control)
        - Subcategories with only policy mappings
        - Subcategories with only control mappings

        Returns:
            Gap analysis results
        """
        # Get all subcategories with their hierarchy
        subcategories = (
            self.db.query(CSFSubcategory)
            .join(CSFCategory)
            .join(CSFFunction)
            .options(
                joinedload(CSFSubcategory.category).joinedload(CSFCategory.function)
            )
            .all()
        )

        # Get approved policy mappings for this assessment
        policy_mappings = (
            self.db.query(PolicyMapping)
            .join(Policy)
            .filter(
                Policy.assessment_id == assessment_id,
                PolicyMapping.is_approved == True,
            )
            .all()
        )
        policy_subcat_ids = {pm.subcategory_id for pm in policy_mappings}

        # Get approved control mappings for this assessment
        control_mappings = (
            self.db.query(ControlMapping)
            .join(Control)
            .filter(
                Control.assessment_id == assessment_id,
                ControlMapping.is_approved == True,
            )
            .all()
        )
        control_subcat_ids = {cm.subcategory_id for cm in control_mappings}

        # Build policy and control name lookups
        policy_names_by_subcat = {}
        for pm in policy_mappings:
            policy = self.db.query(Policy).filter(Policy.id == pm.policy_id).first()
            if policy:
                policy_names_by_subcat.setdefault(pm.subcategory_id, []).append(policy.name)

        control_names_by_subcat = {}
        for cm in control_mappings:
            control = self.db.query(Control).filter(Control.id == cm.control_id).first()
            if control:
                control_names_by_subcat.setdefault(cm.subcategory_id, []).append(control.name)

        gaps = []
        unmapped_count = 0
        policy_only_count = 0
        control_only_count = 0

        for subcat in subcategories:
            has_policy = subcat.id in policy_subcat_ids
            has_control = subcat.id in control_subcat_ids

            if not has_policy and not has_control:
                gap_type = "unmapped_subcategory"
                unmapped_count += 1
            elif has_policy and not has_control:
                gap_type = "policy_only"
                policy_only_count += 1
            elif has_control and not has_policy:
                gap_type = "control_only"
                control_only_count += 1
            else:
                # Fully covered
                continue

            gaps.append({
                "gap_type": gap_type,
                "subcategory_id": subcat.id,
                "subcategory_code": subcat.code,
                "subcategory_description": subcat.description,
                "function_code": subcat.category.function.code,
                "category_code": subcat.category.code,
                "has_policy": has_policy,
                "has_control": has_control,
                "policy_names": policy_names_by_subcat.get(subcat.id),
                "control_names": control_names_by_subcat.get(subcat.id),
            })

        total_subcategories = len(subcategories)
        covered_count = total_subcategories - unmapped_count
        coverage_percentage = (covered_count / total_subcategories * 100) if total_subcategories > 0 else 0

        return {
            "assessment_id": assessment_id,
            "total_gaps": len(gaps),
            "unmapped_subcategories": unmapped_count,
            "policy_only_count": policy_only_count,
            "control_only_count": control_only_count,
            "coverage_percentage": round(coverage_percentage, 2),
            "gaps": gaps,
        }

    def get_coverage_by_function(self, assessment_id: uuid.UUID) -> dict[str, Any]:
        """Get coverage breakdown by CSF function."""
        gap_data = self.detect_gaps(assessment_id)

        # Group gaps by function
        by_function = {}
        functions = self.db.query(CSFFunction).all()

        for func in functions:
            func_subcats = (
                self.db.query(CSFSubcategory)
                .join(CSFCategory)
                .filter(CSFCategory.function_id == func.id)
                .all()
            )
            func_subcat_ids = {sc.id for sc in func_subcats}

            func_gaps = [g for g in gap_data["gaps"] if g["subcategory_id"] in func_subcat_ids]
            total = len(func_subcats)
            covered = total - len([g for g in func_gaps if g["gap_type"] == "unmapped_subcategory"])

            by_function[func.code] = {
                "function_name": func.name,
                "total_subcategories": total,
                "covered": covered,
                "coverage_percentage": round((covered / total * 100) if total > 0 else 0, 2),
                "unmapped": len([g for g in func_gaps if g["gap_type"] == "unmapped_subcategory"]),
                "policy_only": len([g for g in func_gaps if g["gap_type"] == "policy_only"]),
                "control_only": len([g for g in func_gaps if g["gap_type"] == "control_only"]),
            }

        return {
            "assessment_id": assessment_id,
            "by_function": by_function,
        }
