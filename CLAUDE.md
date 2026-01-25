# Compliance AI Agent Instructions

Language: Python 3.12
Framework: FastAPI (backend), Next.js 15 (frontend)
Architecture: Single-tenant, API-first backend with modern React frontend

## Hard scope limits (must not implement)
- Control effectiveness testing
- Evidence collection or validation
- Continuous monitoring
- External integrations (except AI APIs)
- Multi-tenant SaaS
- Non-English support

## Core Features

### Multi-Framework Compliance Support
- **Supported Frameworks**: NIST CSF 2.0, ISO/IEC 27001:2022, SOC 2 Trust Services Criteria, Custom frameworks
- **Unified Database Schema**: Generic schema supporting any compliance framework with hierarchical requirements
- **Companies select applicable frameworks** per assessment with configurable scope
- **AI-powered requirement clustering** groups similar requirements across frameworks to reduce interview burden (~65% reduction)
- **Cross-framework mappings** with embeddings + LLM validation and human approval workflow

### Assessment Workflow
- Database schema and migrations (Alembic)
- Controls ingestion (CSV, XLSX)
- Policy ingestion (PDF, DOCX, TXT, MD)
- AI-powered mapping suggestions with confidence scores and human approval
- Interviews with deterministic sequencing and save/resume
- Explainable scoring (0 to 4 scale)
- Deviations and risk ranking
- Report generation (JSON first)
- Workflow states with audit logging

## Architecture

### Backend Structure
```
backend/
├── app/
│   ├── api/v1/           # API endpoints
│   │   ├── frameworks.py     # Multi-framework CRUD
│   │   ├── crosswalks.py     # Cross-framework mappings
│   │   ├── clusters.py       # Requirement clustering
│   │   └── ...
│   ├── models/
│   │   ├── unified_framework.py  # Framework, FrameworkRequirement, Crosswalks, Clusters
│   │   └── ...
│   ├── services/
│   │   ├── frameworks/       # Framework management
│   │   │   ├── loaders/      # NIST, ISO, SOC2, Custom loaders
│   │   │   ├── framework_service.py
│   │   │   ├── requirement_service.py
│   │   │   └── crosswalk_service.py
│   │   ├── clustering/       # AI-powered clustering
│   │   │   ├── embedding_service.py
│   │   │   ├── clustering_service.py
│   │   │   └── similarity_service.py
│   │   └── ...
│   └── core/
│       └── config.py         # Settings including OpenAI config
└── alembic/                  # Database migrations
```

### Frontend Structure
```
frontend/
├── app/
│   ├── frameworks/           # Framework management pages
│   │   ├── page.tsx              # List all frameworks
│   │   ├── [id]/page.tsx         # Framework detail
│   │   ├── crosswalks/page.tsx   # Cross-framework mappings
│   │   ├── clusters/page.tsx     # Requirement clusters
│   │   └── settings/page.tsx     # Company framework selection
│   └── assessments/
│       └── [id]/
│           └── scope/page.tsx    # Assessment framework scope
├── components/
│   ├── frameworks/           # Framework components
│   │   ├── FrameworkSelector.tsx
│   │   ├── CrosswalkViewer.tsx
│   │   └── ClusterViewer.tsx
│   └── assessment/
│       └── MultiFrameworkProgress.tsx
└── lib/
    ├── api/                  # API client functions
    │   ├── frameworks.ts
    │   ├── crosswalks.ts
    │   └── clusters.ts
    └── types/
        └── unified-framework.ts
```

## Key Database Tables

### Unified Framework Schema
- `frameworks` - Registry of compliance frameworks (NIST CSF, ISO 27001, SOC 2, custom)
- `framework_requirements` - Hierarchical requirements with embeddings for AI
- `requirement_crosswalks` - Cross-framework mappings (equivalent, partial, related)
- `requirement_clusters` - Groups of similar requirements for interview optimization
- `requirement_cluster_members` - Membership with similarity scores
- `company_frameworks` - Company's selected frameworks
- `assessment_framework_scope` - Which frameworks are in scope for each assessment

## API Endpoints

### Framework Management
- `GET/POST /api/v1/frameworks` - List/create frameworks
- `GET/PATCH/DELETE /api/v1/frameworks/{id}` - Framework CRUD
- `POST /api/v1/frameworks/load-builtin` - Load built-in frameworks
- `GET /api/v1/frameworks/{id}/hierarchy` - Requirement tree

### Cross-Framework Mappings
- `GET/POST /api/v1/crosswalks` - List/create mappings
- `POST /api/v1/crosswalks/generate` - AI-powered mapping generation
- `POST /api/v1/crosswalks/{id}/approve` - Approve mapping

### Requirement Clusters
- `GET /api/v1/clusters` - List clusters
- `POST /api/v1/clusters/generate` - Generate AI clusters
- `GET /api/v1/clusters/interview-reduction` - Interview optimization stats
- `POST /api/v1/clusters/embeddings/generate` - Generate embeddings

## Engineering Rules
- Small, testable modules
- All scoring must store explanation payloads
- All approvals and state changes must be audit logged
- Use unified framework schema for all compliance frameworks
- Human review workflow for AI-generated mappings (auto-approve only at >0.9 confidence)

## AI Integration
- **Embeddings**: OpenAI text-embedding-3-small for semantic similarity
- **LLM Validation**: Claude/GPT for crosswalk validation and cluster coherence
- **Clustering**: Hierarchical agglomerative clustering on embeddings
- **Similarity Threshold**: Configurable (default 0.85 for clustering, 0.75 for crosswalks)
