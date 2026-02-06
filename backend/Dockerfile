FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (including WeasyPrint requirements)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libcairo2 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Copy source and install
COPY . .
RUN pip install --no-cache-dir .

# Run migrations then start server
CMD sh -c "alembic upgrade head 2>&1 && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
