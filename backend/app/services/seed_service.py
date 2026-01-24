"""Service for seeding NIST CSF 2.0 framework data and interview questions."""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.models.framework import CSFFunction, CSFCategory, CSFSubcategory
from app.models.interview import InterviewQuestion, QuestionType


def load_json_file(filename: str) -> dict[str, Any]:
    """Load a JSON file from the data directory."""
    data_dir = Path(__file__).parent.parent / "data"
    file_path = data_dir / filename
    with open(file_path, "r") as f:
        return json.load(f)


def seed_csf_framework(db: Session) -> dict[str, dict[str, uuid.UUID]]:
    """
    Seed the NIST CSF 2.0 framework data.

    Returns a mapping of codes to UUIDs for functions, categories, and subcategories.
    """
    data = load_json_file("csf_2_0.json")

    code_to_id = {
        "functions": {},
        "categories": {},
        "subcategories": {},
    }

    for func_data in data["functions"]:
        # Check if function already exists
        existing = db.query(CSFFunction).filter(CSFFunction.code == func_data["code"]).first()
        if existing:
            code_to_id["functions"][func_data["code"]] = existing.id
            function_id = existing.id
        else:
            function = CSFFunction(
                id=uuid.uuid4(),
                code=func_data["code"],
                name=func_data["name"],
                description=func_data["description"],
            )
            db.add(function)
            db.flush()
            code_to_id["functions"][func_data["code"]] = function.id
            function_id = function.id

        for cat_data in func_data["categories"]:
            existing_cat = db.query(CSFCategory).filter(CSFCategory.code == cat_data["code"]).first()
            if existing_cat:
                code_to_id["categories"][cat_data["code"]] = existing_cat.id
                category_id = existing_cat.id
            else:
                category = CSFCategory(
                    id=uuid.uuid4(),
                    function_id=function_id,
                    code=cat_data["code"],
                    name=cat_data["name"],
                    description=cat_data["description"],
                )
                db.add(category)
                db.flush()
                code_to_id["categories"][cat_data["code"]] = category.id
                category_id = category.id

            for subcat_data in cat_data["subcategories"]:
                existing_subcat = db.query(CSFSubcategory).filter(
                    CSFSubcategory.code == subcat_data["code"]
                ).first()
                if existing_subcat:
                    code_to_id["subcategories"][subcat_data["code"]] = existing_subcat.id
                else:
                    subcategory = CSFSubcategory(
                        id=uuid.uuid4(),
                        category_id=category_id,
                        code=subcat_data["code"],
                        description=subcat_data["description"],
                    )
                    db.add(subcategory)
                    db.flush()
                    code_to_id["subcategories"][subcat_data["code"]] = subcategory.id

    db.commit()
    return code_to_id


def seed_interview_questions(
    db: Session,
    subcategory_codes: dict[str, uuid.UUID] | None = None
) -> int:
    """
    Seed the interview question bank.

    Returns the number of questions seeded.
    """
    # Get subcategory mappings if not provided
    if subcategory_codes is None:
        subcategories = db.query(CSFSubcategory).all()
        subcategory_codes = {s.code: s.id for s in subcategories}

    data = load_json_file("question_bank.json")
    count = 0

    for question_data in data["questions"]:
        subcat_code = question_data["subcategory_code"]
        if subcat_code not in subcategory_codes:
            continue

        # Check if question already exists
        existing = db.query(InterviewQuestion).filter(
            InterviewQuestion.subcategory_id == subcategory_codes[subcat_code],
            InterviewQuestion.question_text == question_data["question_text"],
        ).first()

        if existing:
            continue

        question = InterviewQuestion(
            id=uuid.uuid4(),
            subcategory_id=subcategory_codes[subcat_code],
            question_text=question_data["question_text"],
            question_type=question_data["question_type"],
            order=question_data.get("order", 0),
            target_roles=question_data.get("target_roles"),
            is_active=True,
            created_at=datetime.utcnow(),
        )
        db.add(question)
        count += 1

    db.commit()
    return count


def seed_all(db: Session) -> dict[str, Any]:
    """Seed all framework data and questions."""
    code_mappings = seed_csf_framework(db)
    question_count = seed_interview_questions(db, code_mappings["subcategories"])

    return {
        "functions": len(code_mappings["functions"]),
        "categories": len(code_mappings["categories"]),
        "subcategories": len(code_mappings["subcategories"]),
        "questions": question_count,
    }
