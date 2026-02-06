"""Interview endpoints."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.interview import InterviewSession
from app.models.user import User
from app.schemas.interview import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewResponseCreate,
    NextQuestionResponse,
    InterviewProgressResponse,
)
from app.dependencies.auth import get_current_user, require_user
from app.services.interview.session_manager import InterviewSessionManager

router = APIRouter()


@router.post(
    "/assessments/{assessment_id}/sessions",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_interview_session(
    assessment_id: uuid.UUID,
    session_in: InterviewSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Create a new interview session for an assessment."""
    session_manager = InterviewSessionManager(db)

    session = session_manager.create_session(
        assessment_id=assessment_id,
        interviewee_id=session_in.interviewee_id,
        interviewee_name=session_in.interviewee_name,
        interviewee_role=session_in.interviewee_role,
        user_id=current_user.id,
    )

    return InterviewSessionResponse.model_validate(session)


@router.get("/{session_id}", response_model=InterviewSessionResponse)
async def get_interview_session(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get an interview session by ID."""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found",
        )

    return InterviewSessionResponse.model_validate(session)


@router.get("/{session_id}/next-question")
async def get_next_question(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get the next question in an interview session."""
    session_manager = InterviewSessionManager(db)
    result = session_manager.get_next_question(session_id)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"],
        )

    return result


@router.post("/{session_id}/responses")
async def submit_response(
    session_id: uuid.UUID,
    response_in: InterviewResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Submit a response to an interview question."""
    session_manager = InterviewSessionManager(db)

    result = session_manager.submit_response(
        session_id=session_id,
        question_id=response_in.question_id,
        response_text=response_in.response_text,
        response_value=response_in.response_value,
        confidence_level=response_in.confidence_level,
        evidence_references=response_in.evidence_references,
        user_id=current_user.id,
    )

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"],
        )

    return result


@router.get("/assessments/{assessment_id}/sessions", response_model=list[InterviewSessionResponse])
async def list_assessment_sessions(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """List all interview sessions for an assessment."""
    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.assessment_id == assessment_id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )

    return [InterviewSessionResponse.model_validate(session) for session in sessions]


@router.get("/assessments/{assessment_id}/progress")
async def get_assessment_interview_progress(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get interview progress for an assessment."""
    sessions = db.query(InterviewSession).filter(
        InterviewSession.assessment_id == assessment_id
    ).all()

    session_manager = InterviewSessionManager(db)
    progress_data = []

    for session in sessions:
        progress = session_manager.get_session_progress(session.id)
        progress_data.append(progress)

    total_sessions = len(sessions)
    completed_sessions = sum(1 for p in progress_data if p.get("status") == "completed")

    return {
        "assessment_id": assessment_id,
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "sessions": progress_data,
    }


@router.post("/{session_id}/pause")
async def pause_interview(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Pause an interview session."""
    session_manager = InterviewSessionManager(db)
    result = session_manager.pause_session(session_id, current_user.id)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"],
        )

    return result


@router.post("/{session_id}/resume")
async def resume_interview(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Resume a paused interview session."""
    session_manager = InterviewSessionManager(db)
    result = session_manager.resume_session(session_id, current_user.id)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"],
        )

    return result
