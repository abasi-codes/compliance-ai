"""Branching logic for interview question flow."""

import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.models.interview import (
    InterviewQuestion,
    InterviewSession,
    InterviewResponse,
    QuestionType,
)


class BranchingLogic:
    """Service for determining the next question based on responses."""

    def __init__(self, db: Session):
        self.db = db

    def should_skip_question(
        self,
        question: InterviewQuestion,
        session: InterviewSession,
    ) -> bool:
        """
        Determine if a question should be skipped based on previous responses.

        Rules:
        - If existence question was answered "No", skip design/operation questions
          for the same subcategory
        - Follow configured follow-up paths

        Args:
            question: The question to evaluate
            session: The current interview session

        Returns:
            True if the question should be skipped
        """
        # Get all responses for this session
        responses = (
            self.db.query(InterviewResponse)
            .filter(InterviewResponse.session_id == session.id)
            .all()
        )

        response_by_question = {r.question_id: r for r in responses}

        # Check if we need to skip based on existence question
        if question.question_type in [QuestionType.DESIGN.value, QuestionType.OPERATION.value]:
            # Find existence question for the same subcategory
            existence_question = (
                self.db.query(InterviewQuestion)
                .filter(
                    InterviewQuestion.subcategory_id == question.subcategory_id,
                    InterviewQuestion.question_type == QuestionType.EXISTENCE.value,
                    InterviewQuestion.is_active == True,
                )
                .first()
            )

            if existence_question and existence_question.id in response_by_question:
                response = response_by_question[existence_question.id]
                # Skip if existence was answered "No"
                if response.response_value and response.response_value.lower() == "no":
                    return True

        # Check if this is in the skipped questions list
        if session.skipped_questions:
            if str(question.id) in session.skipped_questions.get("skipped", []):
                return True

        return False

    def get_follow_up_question(
        self,
        current_question: InterviewQuestion,
        response_value: str,
    ) -> InterviewQuestion | None:
        """
        Get the follow-up question based on the response.

        Args:
            current_question: The question that was just answered
            response_value: The response value (yes/no/partial/etc.)

        Returns:
            The follow-up question, or None if there isn't one
        """
        response_lower = response_value.lower() if response_value else ""

        if response_lower in ["yes", "true", "1"]:
            if current_question.follow_up_on_yes_id:
                return self.db.query(InterviewQuestion).filter(
                    InterviewQuestion.id == current_question.follow_up_on_yes_id
                ).first()
        elif response_lower in ["no", "false", "0"]:
            if current_question.follow_up_on_no_id:
                return self.db.query(InterviewQuestion).filter(
                    InterviewQuestion.id == current_question.follow_up_on_no_id
                ).first()

        return None

    def mark_questions_to_skip(
        self,
        session: InterviewSession,
        question: InterviewQuestion,
        response_value: str,
    ) -> list[uuid.UUID]:
        """
        Mark questions that should be skipped based on a response.

        Args:
            session: The interview session
            question: The question that was answered
            response_value: The response value

        Returns:
            List of question IDs that will be skipped
        """
        skipped_ids = []
        response_lower = response_value.lower() if response_value else ""

        # If existence question answered "No", skip design/operation for same subcategory
        if question.question_type == QuestionType.EXISTENCE.value:
            if response_lower in ["no", "false", "0"]:
                subsequent_questions = (
                    self.db.query(InterviewQuestion)
                    .filter(
                        InterviewQuestion.subcategory_id == question.subcategory_id,
                        InterviewQuestion.question_type.in_([
                            QuestionType.DESIGN.value,
                            QuestionType.OPERATION.value,
                        ]),
                        InterviewQuestion.is_active == True,
                    )
                    .all()
                )
                skipped_ids = [q.id for q in subsequent_questions]

        # Update session's skipped questions
        if skipped_ids:
            current_skipped = session.skipped_questions or {"skipped": []}
            current_skipped["skipped"].extend([str(qid) for qid in skipped_ids])
            session.skipped_questions = current_skipped
            self.db.flush()

        return skipped_ids

    def calculate_effective_total(
        self,
        session: InterviewSession,
        all_questions: list[InterviewQuestion],
    ) -> int:
        """
        Calculate the effective total questions after accounting for skips.

        Args:
            session: The interview session
            all_questions: All ordered questions

        Returns:
            The effective total number of questions
        """
        skipped = session.skipped_questions or {"skipped": []}
        skipped_ids = set(skipped.get("skipped", []))

        effective_count = sum(
            1 for q in all_questions
            if str(q.id) not in skipped_ids
        )

        return effective_count
