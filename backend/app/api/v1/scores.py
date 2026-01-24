"""Score endpoints."""

import uuid
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.score import SubcategoryScore, CategoryScore, FunctionScore
from app.models.user import User
from app.schemas.score import (
    SubcategoryScoreResponse,
    CategoryScoreResponse,
    FunctionScoreResponse,
    ScoreSummaryResponse,
)
from app.dependencies.auth import get_current_user, require_user
from app.services.scoring.scoring_engine import ScoringEngine

router = APIRouter()


@router.post("/assessments/{assessment_id}/calculate")
async def calculate_scores(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    """Calculate all scores for an assessment."""
    scoring_engine = ScoringEngine(db)

    result = scoring_engine.calculate_all_scores(
        assessment_id=assessment_id,
        user_id=current_user.id,
    )

    return result


@router.get("/assessments/{assessment_id}/summary")
async def get_score_summary(
    assessment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get score summary for an assessment."""
    scoring_engine = ScoringEngine(db)
    return scoring_engine.get_score_summary(assessment_id)


@router.get("/assessments/{assessment_id}/{level}")
async def get_scores_by_level(
    assessment_id: uuid.UUID,
    level: Literal["subcategories", "categories", "functions"],
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get scores at a specific level (subcategories, categories, or functions)."""
    from app.models.framework import CSFSubcategory, CSFCategory, CSFFunction

    if level == "subcategories":
        scores = db.query(SubcategoryScore).filter(
            SubcategoryScore.assessment_id == assessment_id
        ).all()

        result = []
        for s in scores:
            subcat = db.query(CSFSubcategory).filter(CSFSubcategory.id == s.subcategory_id).first()
            result.append({
                "id": s.id,
                "assessment_id": s.assessment_id,
                "subcategory_id": s.subcategory_id,
                "subcategory_code": subcat.code if subcat else None,
                "score": s.score,
                "explanation_payload": s.explanation_payload,
                "calculated_at": s.calculated_at.isoformat(),
                "version": s.version,
            })
        return result

    elif level == "categories":
        scores = db.query(CategoryScore).filter(
            CategoryScore.assessment_id == assessment_id
        ).all()

        result = []
        for s in scores:
            cat = db.query(CSFCategory).filter(CSFCategory.id == s.category_id).first()
            result.append({
                "id": s.id,
                "assessment_id": s.assessment_id,
                "category_id": s.category_id,
                "category_code": cat.code if cat else None,
                "category_name": cat.name if cat else None,
                "score": s.score,
                "explanation_payload": s.explanation_payload,
                "calculated_at": s.calculated_at.isoformat(),
                "version": s.version,
            })
        return result

    else:  # functions
        scores = db.query(FunctionScore).filter(
            FunctionScore.assessment_id == assessment_id
        ).all()

        result = []
        for s in scores:
            func = db.query(CSFFunction).filter(CSFFunction.id == s.function_id).first()
            result.append({
                "id": s.id,
                "assessment_id": s.assessment_id,
                "function_id": s.function_id,
                "function_code": func.code if func else None,
                "function_name": func.name if func else None,
                "score": s.score,
                "explanation_payload": s.explanation_payload,
                "calculated_at": s.calculated_at.isoformat(),
                "version": s.version,
            })
        return result


@router.get("/{score_id}/explanation")
async def get_score_explanation(
    score_id: uuid.UUID,
    score_type: Literal["subcategory", "category", "function"],
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    """Get detailed explanation for a score."""
    from app.models.framework import CSFSubcategory, CSFCategory, CSFFunction

    if score_type == "subcategory":
        score = db.query(SubcategoryScore).filter(SubcategoryScore.id == score_id).first()
        if not score:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Score not found")
        subcat = db.query(CSFSubcategory).filter(CSFSubcategory.id == score.subcategory_id).first()
        code = subcat.code if subcat else None

    elif score_type == "category":
        score = db.query(CategoryScore).filter(CategoryScore.id == score_id).first()
        if not score:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Score not found")
        cat = db.query(CSFCategory).filter(CSFCategory.id == score.category_id).first()
        code = cat.code if cat else None

    else:  # function
        score = db.query(FunctionScore).filter(FunctionScore.id == score_id).first()
        if not score:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Score not found")
        func = db.query(CSFFunction).filter(CSFFunction.id == score.function_id).first()
        code = func.code if func else None

    return {
        "score_id": score.id,
        "level": score_type,
        "code": code,
        "score": score.score,
        "explanation": score.explanation_payload,
    }
