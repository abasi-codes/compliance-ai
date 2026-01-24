from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="AI-driven NIST CSF 2.0 compliance assessment engine",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check (no prefix)
app.include_router(health_router, tags=["health"])

# API v1 routes
app.include_router(api_router, prefix=settings.api_v1_prefix)
