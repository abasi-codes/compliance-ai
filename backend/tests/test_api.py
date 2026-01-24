"""Tests for API endpoints."""

import uuid
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.models.user import User, Role


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client with database override."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db):
    """Create a test user."""
    user = User(
        id=uuid.uuid4(),
        email="test@example.com",
        name="Test User",
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


class TestAssessmentAPI:
    """Tests for Assessment endpoints."""

    def test_create_assessment(self, client, test_user):
        """Test creating an assessment."""
        response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Assessment"
        assert data["organization_name"] == "Test Org"
        assert data["status"] == "draft"

    def test_list_assessments(self, client, db, test_user):
        """Test listing assessments."""
        # Create an assessment first
        client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )

        response = client.get("/api/v1/assessments")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1

    def test_get_assessment(self, client, test_user):
        """Test getting a single assessment."""
        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        # Get the assessment
        response = client.get(f"/api/v1/assessments/{assessment_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == assessment_id
        assert data["name"] == "Test Assessment"

    def test_update_assessment(self, client, test_user):
        """Test updating an assessment."""
        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        # Update the assessment
        response = client.patch(
            f"/api/v1/assessments/{assessment_id}",
            json={"name": "Updated Assessment"},
            headers={"X-User-ID": str(test_user.id)},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Assessment"

    def test_get_nonexistent_assessment(self, client):
        """Test getting a non-existent assessment."""
        fake_id = str(uuid.uuid4())
        response = client.get(f"/api/v1/assessments/{fake_id}")

        assert response.status_code == 404


class TestFrameworkAPI:
    """Tests for Framework endpoints."""

    def test_get_framework_summary(self, client):
        """Test getting framework summary."""
        response = client.get("/api/v1/framework/summary")

        assert response.status_code == 200
        data = response.json()
        assert "functions_count" in data
        assert "categories_count" in data
        assert "subcategories_count" in data

    def test_get_functions(self, client):
        """Test getting CSF functions."""
        response = client.get("/api/v1/framework/functions")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_seed_framework(self, client, db):
        """Test seeding framework data."""
        response = client.post("/api/v1/framework/seed")

        assert response.status_code == 200
        data = response.json()
        assert "seeded" in data
        assert data["seeded"]["functions"] > 0


class TestScoresAPI:
    """Tests for Score endpoints."""

    def test_get_score_summary_empty(self, client, test_user):
        """Test getting score summary for assessment with no scores."""
        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        response = client.get(f"/api/v1/scores/assessments/{assessment_id}/summary")

        assert response.status_code == 200
        data = response.json()
        assert data["overall_maturity"] == 0.0
        assert data["function_scores"] == []


class TestInterviewAPI:
    """Tests for Interview endpoints."""

    def test_create_interview_session(self, client, test_user, db):
        """Test creating an interview session."""
        # Seed framework data first
        client.post("/api/v1/framework/seed")

        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        # Create interview session
        response = client.post(
            f"/api/v1/interviews/assessments/{assessment_id}/sessions",
            json={
                "assessment_id": assessment_id,
                "interviewee_name": "John Doe",
                "interviewee_role": "IT Manager",
            },
            headers={"X-User-ID": str(test_user.id)},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["interviewee_name"] == "John Doe"
        assert data["status"] == "not_started"


class TestDeviationAPI:
    """Tests for Deviation endpoints."""

    def test_get_risk_summary_empty(self, client, test_user):
        """Test getting risk summary for assessment with no deviations."""
        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        response = client.get(f"/api/v1/assessments/{assessment_id}/risk-summary")

        assert response.status_code == 200
        data = response.json()
        assert data["total_deviations"] == 0


class TestReportAPI:
    """Tests for Report endpoints."""

    def test_list_reports_empty(self, client, test_user):
        """Test listing reports for assessment with no reports."""
        # Create an assessment
        create_response = client.post(
            "/api/v1/assessments",
            json={
                "name": "Test Assessment",
                "description": "A test assessment",
                "organization_name": "Test Org",
            },
            headers={"X-User-ID": str(test_user.id)},
        )
        assessment_id = create_response.json()["id"]

        response = client.get(f"/api/v1/reports/assessments/{assessment_id}/list")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["items"] == []
