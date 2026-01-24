# Compliance AI (MVP) Agent Instructions

Language: Python 3.12
Framework: FastAPI
Architecture: Single-tenant, API-first backend

## Hard scope limits (must not implement)
- Control effectiveness testing
- Evidence collection or validation
- Continuous monitoring
- External integrations
- Multi-tenant SaaS
- Non-NIST frameworks
- Non-English support

## MVP requirements
- NIST CSF 2.0 only
- Database schema and migrations
- Controls ingestion (CSV, XLSX)
- Policy ingestion (PDF, DOCX, TXT, MD)
- Mapping suggestions with confidence and human approval
- Interviews with deterministic sequencing and save/resume
- Explainable scoring (0 to 4)
- Deviations and risk ranking
- Report generation (JSON first)
- Workflow states with audit logging

## Engineering rules
- Small, testable modules
- All scoring must store explanation payloads
- All approvals and state changes must be audit logged
- Do not introduce additional frameworks unless required
