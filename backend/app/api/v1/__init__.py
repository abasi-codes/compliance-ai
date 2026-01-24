from fastapi import APIRouter

from app.api.v1.assessments import router as assessments_router
from app.api.v1.controls import router as controls_router
from app.api.v1.policies import router as policies_router
from app.api.v1.mappings import router as mappings_router
from app.api.v1.interviews import router as interviews_router
from app.api.v1.scores import router as scores_router
from app.api.v1.deviations import router as deviations_router
from app.api.v1.reports import router as reports_router
from app.api.v1.framework import router as framework_router

api_router = APIRouter()

api_router.include_router(assessments_router, prefix="/assessments", tags=["assessments"])
api_router.include_router(controls_router, tags=["controls"])
api_router.include_router(policies_router, tags=["policies"])
api_router.include_router(mappings_router, prefix="/mappings", tags=["mappings"])
api_router.include_router(interviews_router, prefix="/interviews", tags=["interviews"])
api_router.include_router(scores_router, prefix="/scores", tags=["scores"])
api_router.include_router(deviations_router, tags=["deviations"])
api_router.include_router(reports_router, prefix="/reports", tags=["reports"])
api_router.include_router(framework_router, prefix="/framework", tags=["framework"])
