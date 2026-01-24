"""Question sequencing service for deterministic interview ordering."""

import uuid
from typing import Any

from sqlalchemy.orm import Session, joinedload

from app.models.interview import InterviewQuestion, QuestionType
from app.models.framework import CSFFunction, CSFCategory, CSFSubcategory


# Define the canonical question type order
QUESTION_TYPE_ORDER = {
    QuestionType.EXISTENCE.value: 1,
    QuestionType.DESIGN.value: 2,
    QuestionType.OPERATION.value: 3,
    QuestionType.DOCUMENTATION.value: 4,
    QuestionType.RESPONSIBILITY.value: 5,
}


class QuestionSequencer:
    """Service for sequencing interview questions in a deterministic order."""

    # Function order based on CSF 2.0
    FUNCTION_ORDER = ["GV", "ID", "PR", "DE", "RS", "RC"]

    def __init__(self, db: Session):
        self.db = db

    def get_ordered_questions(
        self,
        target_roles: list[str] | None = None,
    ) -> list[InterviewQuestion]:
        """
        Get all interview questions in deterministic order.

        Order: Function -> Category -> Subcategory -> question_type -> question.order

        Args:
            target_roles: Optional filter for target roles

        Returns:
            Ordered list of interview questions
        """
        # Build the query with joins for ordering
        query = (
            self.db.query(InterviewQuestion)
            .join(CSFSubcategory)
            .join(CSFCategory)
            .join(CSFFunction)
            .filter(InterviewQuestion.is_active == True)
            .options(
                joinedload(InterviewQuestion.subcategory)
                .joinedload(CSFSubcategory.category)
                .joinedload(CSFCategory.function)
            )
        )

        questions = query.all()

        # Sort questions by:
        # 1. Function (using FUNCTION_ORDER)
        # 2. Category code
        # 3. Subcategory code
        # 4. Question type (using QUESTION_TYPE_ORDER)
        # 5. Question order field
        def sort_key(q: InterviewQuestion):
            func_code = q.subcategory.category.function.code
            func_order = (
                self.FUNCTION_ORDER.index(func_code)
                if func_code in self.FUNCTION_ORDER
                else 999
            )
            cat_code = q.subcategory.category.code
            subcat_code = q.subcategory.code
            type_order = QUESTION_TYPE_ORDER.get(q.question_type, 999)
            return (func_order, cat_code, subcat_code, type_order, q.order)

        questions = sorted(questions, key=sort_key)

        # Filter by target roles if specified
        if target_roles:
            questions = [
                q for q in questions
                if q.target_roles is None or any(r in (q.target_roles or []) for r in target_roles)
            ]

        return questions

    def get_questions_for_subcategory(
        self,
        subcategory_id: uuid.UUID,
    ) -> list[InterviewQuestion]:
        """Get all questions for a specific subcategory in order."""
        questions = (
            self.db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.subcategory_id == subcategory_id,
                InterviewQuestion.is_active == True,
            )
            .all()
        )

        # Sort by question type order, then by order field
        def sort_key(q: InterviewQuestion):
            type_order = QUESTION_TYPE_ORDER.get(q.question_type, 999)
            return (type_order, q.order)

        return sorted(questions, key=sort_key)

    def get_question_context(
        self,
        question: InterviewQuestion,
    ) -> dict[str, Any]:
        """Get the hierarchical context for a question."""
        subcat = question.subcategory
        cat = subcat.category
        func = cat.function

        return {
            "function": {
                "code": func.code,
                "name": func.name,
                "description": func.description,
            },
            "category": {
                "code": cat.code,
                "name": cat.name,
                "description": cat.description,
            },
            "subcategory": {
                "code": subcat.code,
                "description": subcat.description,
            },
        }

    def count_questions_by_function(self) -> dict[str, int]:
        """Count questions grouped by function."""
        questions = self.get_ordered_questions()

        counts = {}
        for q in questions:
            func_code = q.subcategory.category.function.code
            counts[func_code] = counts.get(func_code, 0) + 1

        return counts
