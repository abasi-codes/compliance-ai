from fastapi import FastAPI

from app.api.health import router as health_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="AI-driven NIST CSF 2.0 compliance assessment engine",
    version="0.1.0",
)

app.include_router(health_router, tags=["health"])
