"""Interview session management service."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.interview import (
    InterviewQuestion,
    InterviewSession,
    InterviewResponse,
    InterviewSessionStatus,
)
from app.services.audit.audit_service import AuditService
from app.services.interview.question_sequencer import QuestionSequencer
from app.services.interview.branching_logic import BranchingLogic


class InterviewSessionManager:
    """Service for managing interview sessions."""

    def __init__(self, db: Session):
        self.db = db
        self.audit_service = AuditService(db)
        self.sequencer = QuestionSequencer(db)
        self.branching = BranchingLogic(db)

    def create_session(
        self,
        assessment_id: uuid.UUID,
        interviewee_id: uuid.UUID | None = None,
        interviewee_name: str | None = None,
        interviewee_role: str | None = None,
        user_id: uuid.UUID | None = None,
    ) -> InterviewSession:
        """Create a new interview session."""
        # Get total questions
        all_questions = self.sequencer.get_ordered_questions()

        session = InterviewSession(
            id=uuid.uuid4(),
            assessment_id=assessment_id,
            interviewee_id=interviewee_id,
            interviewee_name=interviewee_name,
            interviewee_role=interviewee_role,
            status=InterviewSessionStatus.NOT_STARTED.value,
            current_question_index=0,
            total_questions=len(all_questions),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            skipped_questions={"skipped": []},
        )

        self.db.add(session)
        self.db.flush()

        self.audit_service.log_create(
            entity_type="interview_session",
            entity_id=session.id,
            new_values={
                "assessment_id": str(assessment_id),
                "interviewee_name": interviewee_name,
                "total_questions": len(all_questions),
            },
            user_id=user_id,
        )

        self.db.commit()
        return session

    def get_next_question(
        self,
        session_id: uuid.UUID,
    ) -> dict[str, Any]:
        """Get the next question for a session."""
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id
        ).first()

        if not session:
            return {"error": "Session not found"}

        # Get ordered questions
        all_questions = self.sequencer.get_ordered_questions()

        # Get answered question IDs
        answered_ids = set(
            r.question_id
            for r in self.db.query(InterviewResponse.question_id).filter(
                InterviewResponse.session_id == session_id
            ).all()
        )

        # Find next unanswered, non-skipped question
        next_question = None
        question_number = 0

        for i, question in enumerate(all_questions):
            if question.id in answered_ids:
                continue

            if self.branching.should_skip_question(question, session):
                continue

            next_question = question
            question_number = i + 1
            break

        # Calculate progress
        effective_total = self.branching.calculate_effective_total(session, all_questions)
        answered_count = len(answered_ids)
        progress = (answered_count / effective_total * 100) if effective_total > 0 else 0

        # Check if complete
        is_complete = next_question is None

        if is_complete and session.status != InterviewSessionStatus.COMPLETED.value:
            session.status = InterviewSessionStatus.COMPLETED.value
            session.completed_at = datetime.utcnow()
            session.updated_at = datetime.utcnow()
            self.db.commit()

        # Update session status if this is the first question
        if session.status == InterviewSessionStatus.NOT_STARTED.value and not is_complete:
            session.status = InterviewSessionStatus.IN_PROGRESS.value
            session.started_at = datetime.utcnow()
            session.updated_at = datetime.utcnow()
            self.db.commit()

        response = {
            "question_number": question_number,
            "total_questions": effective_total,
            "progress_percentage": round(progress, 2),
            "is_complete": is_complete,
        }

        if next_question:
            context = self.sequencer.get_question_context(next_question)
            response["question"] = {
                "id": next_question.id,
                "subcategory_id": next_question.subcategory_id,
                "subcategory_code": next_question.subcategory.code,
                "question_text": next_question.question_text,
                "question_type": next_question.question_type,
                "order": next_question.order,
                "target_roles": next_question.target_roles,
                "is_active": next_question.is_active,
                "context": context,
            }

        return response

    def submit_response(
        self,
        session_id: uuid.UUID,
        question_id: uuid.UUID,
        response_text: str | None = None,
        response_value: str | None = None,
        confidence_level: str | None = None,
        evidence_references: dict | None = None,
        user_id: uuid.UUID | None = None,
    ) -> dict[str, Any]:
        """Submit a response to an interview question."""
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id
        ).first()

        if not session:
            return {"error": "Session not found"}

        question = self.db.query(InterviewQuestion).filter(
            InterviewQuestion.id == question_id
        ).first()

        if not question:
            return {"error": "Question not found"}

        # Check for existing response
        existing = self.db.query(InterviewResponse).filter(
            InterviewResponse.session_id == session_id,
            InterviewResponse.question_id == question_id,
        ).first()

        if existing:
            # Update existing response
            existing.response_text = response_text
            existing.response_value = response_value
            existing.confidence_level = confidence_level
            existing.evidence_references = evidence_references
            existing.responded_at = datetime.utcnow()
            response = existing
        else:
            # Create new response
            response = InterviewResponse(
                id=uuid.uuid4(),
                session_id=session_id,
                question_id=question_id,
                response_text=response_text,
                response_value=response_value,
                confidence_level=confidence_level,
                evidence_references=evidence_references,
                responded_at=datetime.utcnow(),
                created_at=datetime.utcnow(),
            )
            self.db.add(response)

        # Handle branching logic
        if response_value:
            self.branching.mark_questions_to_skip(session, question, response_value)

        # Update session
        session.current_question_index += 1
        session.updated_at = datetime.utcnow()

        self.db.flush()

        self.audit_service.log_create(
            entity_type="interview_response",
            entity_id=response.id,
            new_values={
                "session_id": str(session_id),
                "question_id": str(question_id),
                "response_value": response_value,
            },
            user_id=user_id,
        )

        self.db.commit()

        # Get next question
        return self.get_next_question(session_id)

    def get_session_progress(
        self,
        session_id: uuid.UUID,
        include_responses: bool = False,
    ) -> dict[str, Any]:
        """Get the progress of an interview session."""
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id
        ).first()

        if not session:
            return {"error": "Session not found"}

        all_questions = self.sequencer.get_ordered_questions()
        effective_total = self.branching.calculate_effective_total(session, all_questions)

        responses = self.db.query(InterviewResponse).filter(
            InterviewResponse.session_id == session_id
        ).all()

        answered_count = len(responses)
        progress = (answered_count / effective_total * 100) if effective_total > 0 else 0

        result = {
            "session_id": session.id,
            "status": session.status,
            "questions_answered": answered_count,
            "total_questions": effective_total,
            "progress_percentage": round(progress, 2),
        }

        if include_responses:
            result["responses"] = [
                {
                    "id": r.id,
                    "question_id": r.question_id,
                    "response_text": r.response_text,
                    "response_value": r.response_value,
                    "confidence_level": r.confidence_level,
                    "evidence_references": r.evidence_references,
                    "responded_at": r.responded_at.isoformat(),
                }
                for r in responses
            ]

        return result

    def pause_session(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID | None = None,
    ) -> dict[str, Any]:
        """Pause an interview session."""
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id
        ).first()

        if not session:
            return {"error": "Session not found"}

        old_status = session.status
        session.status = InterviewSessionStatus.PAUSED.value
        session.updated_at = datetime.utcnow()

        self.audit_service.log_state_change(
            entity_type="interview_session",
            entity_id=session_id,
            old_state=old_status,
            new_state=InterviewSessionStatus.PAUSED.value,
            user_id=user_id,
        )

        self.db.commit()

        return {"status": "paused", "session_id": session_id}

    def resume_session(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID | None = None,
    ) -> dict[str, Any]:
        """Resume a paused interview session."""
        session = self.db.query(InterviewSession).filter(
            InterviewSession.id == session_id
        ).first()

        if not session:
            return {"error": "Session not found"}

        old_status = session.status
        session.status = InterviewSessionStatus.IN_PROGRESS.value
        session.updated_at = datetime.utcnow()

        self.audit_service.log_state_change(
            entity_type="interview_session",
            entity_id=session_id,
            old_state=old_status,
            new_state=InterviewSessionStatus.IN_PROGRESS.value,
            user_id=user_id,
        )

        self.db.commit()

        return self.get_next_question(session_id)
