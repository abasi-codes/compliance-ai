"""Control ingestion service for CSV/XLSX files."""

import uuid
from datetime import datetime
from io import BytesIO
from typing import Any

import pandas as pd
from sqlalchemy.orm import Session

from app.models.control import Control
from app.services.audit.audit_service import AuditService


class ControlIngestionError:
    """Error detail for control ingestion."""

    def __init__(self, row: int, field: str | None, message: str):
        self.row = row
        self.field = field
        self.message = message

    def to_dict(self) -> dict:
        return {
            "row": self.row,
            "field": self.field,
            "message": self.message,
        }


class ControlIngestionService:
    """Service for ingesting controls from spreadsheet files."""

    # Required columns (at least one variation must be present)
    REQUIRED_COLUMNS = {
        "identifier": ["identifier", "id", "control_id", "control id", "ctrl_id"],
        "name": ["name", "control_name", "control name", "title"],
        "description": ["description", "desc", "details", "control_description"],
    }

    # Optional columns
    OPTIONAL_COLUMNS = {
        "owner": ["owner", "control_owner", "responsible", "responsible_party"],
        "control_type": ["type", "control_type", "category"],
        "implementation_status": ["status", "implementation_status", "impl_status"],
        "related_policy": ["policy", "related_policy", "policy_reference"],
    }

    def __init__(self, db: Session):
        self.db = db
        self.audit_service = AuditService(db)

    def ingest_file(
        self,
        file_content: bytes,
        filename: str,
        assessment_id: uuid.UUID,
        user_id: uuid.UUID | None = None,
    ) -> dict[str, Any]:
        """
        Ingest controls from a CSV or XLSX file.

        Returns:
            Dict with total_rows, successful, failed, errors, and controls
        """
        extension = filename.lower().split(".")[-1]

        try:
            if extension == "csv":
                df = pd.read_csv(BytesIO(file_content))
            elif extension in ["xlsx", "xls"]:
                df = pd.read_excel(BytesIO(file_content))
            else:
                return {
                    "total_rows": 0,
                    "successful": 0,
                    "failed": 1,
                    "errors": [{"row": 0, "field": None, "message": f"Unsupported file type: {extension}"}],
                    "controls": [],
                }
        except Exception as e:
            return {
                "total_rows": 0,
                "successful": 0,
                "failed": 1,
                "errors": [{"row": 0, "field": None, "message": f"Failed to parse file: {str(e)}"}],
                "controls": [],
            }

        # Normalize column names
        df.columns = [str(col).lower().strip() for col in df.columns]

        # Map columns
        column_mapping = self._map_columns(df.columns.tolist())
        validation_errors = self._validate_columns(column_mapping)

        if validation_errors:
            return {
                "total_rows": len(df),
                "successful": 0,
                "failed": len(df),
                "errors": [e.to_dict() for e in validation_errors],
                "controls": [],
            }

        controls = []
        errors = []
        successful = 0

        for idx, row in df.iterrows():
            row_num = idx + 2  # Account for header and 0-indexing
            row_errors = []

            # Extract values using column mapping
            identifier = self._get_value(row, column_mapping.get("identifier"))
            name = self._get_value(row, column_mapping.get("name"))
            description = self._get_value(row, column_mapping.get("description"))

            # Validate required fields
            if not identifier:
                row_errors.append(ControlIngestionError(row_num, "identifier", "Identifier is required"))
            if not name:
                row_errors.append(ControlIngestionError(row_num, "name", "Name is required"))

            # Check for duplicate identifier in this assessment
            if identifier:
                existing = self.db.query(Control).filter(
                    Control.assessment_id == assessment_id,
                    Control.identifier == identifier,
                ).first()
                if existing:
                    row_errors.append(
                        ControlIngestionError(row_num, "identifier", f"Duplicate identifier: {identifier}")
                    )

            if row_errors:
                errors.extend(row_errors)
                continue

            # Create control
            control = Control(
                id=uuid.uuid4(),
                assessment_id=assessment_id,
                identifier=identifier,
                name=name,
                description=description,
                owner=self._get_value(row, column_mapping.get("owner")),
                control_type=self._get_value(row, column_mapping.get("control_type")),
                implementation_status=self._get_value(row, column_mapping.get("implementation_status")),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )

            self.db.add(control)
            controls.append(control)
            successful += 1

        # Commit all controls
        if controls:
            self.db.flush()

            # Audit log for batch ingestion
            self.audit_service.log(
                action="batch_ingest",
                entity_type="control",
                new_values={
                    "count": len(controls),
                    "filename": filename,
                    "assessment_id": str(assessment_id),
                },
                user_id=user_id,
                details=f"Ingested {len(controls)} controls from {filename}",
            )

            self.db.commit()

        return {
            "total_rows": len(df),
            "successful": successful,
            "failed": len(errors),
            "errors": [e.to_dict() for e in errors] if errors else None,
            "controls": controls,
        }

    def _map_columns(self, columns: list[str]) -> dict[str, str]:
        """Map actual column names to standard field names."""
        mapping = {}

        for field, variations in {**self.REQUIRED_COLUMNS, **self.OPTIONAL_COLUMNS}.items():
            for col in columns:
                if col in variations:
                    mapping[field] = col
                    break

        return mapping

    def _validate_columns(self, column_mapping: dict[str, str]) -> list[ControlIngestionError]:
        """Validate that all required columns are present."""
        errors = []

        for field in self.REQUIRED_COLUMNS:
            if field not in column_mapping:
                errors.append(
                    ControlIngestionError(
                        row=0,
                        field=field,
                        message=f"Required column '{field}' not found. Expected one of: {self.REQUIRED_COLUMNS[field]}",
                    )
                )

        return errors

    def _get_value(self, row: pd.Series, column: str | None) -> str | None:
        """Get a value from a row, returning None for empty/NaN values."""
        if column is None:
            return None

        value = row.get(column)

        if pd.isna(value):
            return None

        value = str(value).strip()
        return value if value else None
