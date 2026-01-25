"""Loader for custom/internal compliance frameworks."""

import json
from pathlib import Path
from typing import Optional, Union

from app.models.unified_framework import FrameworkType
from app.services.frameworks.loaders.base_loader import (
    BaseFrameworkLoader,
    FrameworkData,
    RequirementData,
)


class CustomFrameworkLoader(BaseFrameworkLoader):
    """Loader for custom/internal compliance frameworks.

    Supports loading frameworks from:
    - JSON files
    - CSV files
    - Python dictionaries

    JSON format:
    {
        "code": "CUSTOM-1.0",
        "name": "My Custom Framework",
        "version": "1.0",
        "description": "Optional description",
        "hierarchy_labels": ["Category", "Requirement"],
        "requirements": [
            {
                "code": "CAT1",
                "name": "Category 1",
                "description": "Category description",
                "children": [
                    {
                        "code": "CAT1.1",
                        "name": "Requirement 1.1",
                        "description": "Requirement description",
                        "guidance": "Optional implementation guidance"
                    }
                ]
            }
        ]
    }

    CSV format:
    level,code,name,description,guidance,parent_code
    0,CAT1,Category 1,Category description,,
    1,CAT1.1,Requirement 1.1,Requirement description,Optional guidance,CAT1
    """

    def __init__(
        self,
        data: Optional[Union[dict, str, Path]] = None,
        file_path: Optional[Union[str, Path]] = None,
    ):
        """Initialize the custom framework loader.

        Args:
            data: Framework data as dict, JSON string, or file path
            file_path: Path to JSON or CSV file containing framework data
        """
        self._data = data
        self._file_path = file_path
        self._framework_data: Optional[FrameworkData] = None

    def get_framework_data(self) -> FrameworkData:
        """Get the framework data."""
        if self._framework_data is not None:
            return self._framework_data

        if self._file_path:
            self._framework_data = self._load_from_file(self._file_path)
        elif isinstance(self._data, dict):
            self._framework_data = self._parse_dict(self._data)
        elif isinstance(self._data, str):
            # Try to parse as JSON
            self._framework_data = self._parse_dict(json.loads(self._data))
        else:
            raise ValueError(
                "CustomFrameworkLoader requires either data or file_path"
            )

        return self._framework_data

    def _load_from_file(self, file_path: Union[str, Path]) -> FrameworkData:
        """Load framework data from a file."""
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"Framework file not found: {path}")

        if path.suffix.lower() == ".json":
            return self._load_from_json(path)
        elif path.suffix.lower() == ".csv":
            return self._load_from_csv(path)
        else:
            raise ValueError(f"Unsupported file format: {path.suffix}")

    def _load_from_json(self, path: Path) -> FrameworkData:
        """Load framework from JSON file."""
        with open(path, "r") as f:
            data = json.load(f)
        return self._parse_dict(data)

    def _load_from_csv(self, path: Path) -> FrameworkData:
        """Load framework from CSV file.

        Expected columns: level, code, name, description, guidance, parent_code
        """
        import csv

        rows = []
        with open(path, "r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)

        if not rows:
            raise ValueError("CSV file is empty")

        # Extract framework metadata from first row or filename
        framework_code = path.stem.upper().replace(" ", "-")
        framework_name = path.stem.replace("-", " ").replace("_", " ").title()

        # Build requirement hierarchy
        requirements = self._build_hierarchy_from_csv(rows)

        # Calculate hierarchy levels
        max_level = max(int(row.get("level", 0)) for row in rows)

        return FrameworkData(
            code=framework_code,
            name=framework_name,
            version="1.0",
            description=f"Custom framework loaded from {path.name}",
            framework_type=FrameworkType.CUSTOM,
            hierarchy_levels=max_level + 1,
            requirements=requirements,
        )

    def _build_hierarchy_from_csv(self, rows: list[dict]) -> list[RequirementData]:
        """Build requirement hierarchy from CSV rows."""
        # Index rows by code for parent lookup
        by_code: dict[str, dict] = {}
        for row in rows:
            by_code[row["code"]] = row

        # Find root level requirements (no parent or level 0)
        roots = []
        for row in rows:
            level = int(row.get("level", 0))
            parent_code = row.get("parent_code", "").strip()

            if level == 0 or not parent_code:
                roots.append(row)

        # Build tree recursively
        def build_children(parent_code: str, level: int) -> list[RequirementData]:
            children = []
            for row in rows:
                row_level = int(row.get("level", 0))
                row_parent = row.get("parent_code", "").strip()

                if row_parent == parent_code and row_level == level:
                    req = self._row_to_requirement(row, level)
                    req.children = build_children(row["code"], level + 1)
                    if not req.children:
                        req.is_assessable = True
                    children.append(req)
            return children

        result = []
        for idx, row in enumerate(roots):
            level = int(row.get("level", 0))
            req = self._row_to_requirement(row, level)
            req.display_order = idx
            req.children = build_children(row["code"], level + 1)
            if not req.children:
                req.is_assessable = True
            result.append(req)

        return result

    def _row_to_requirement(self, row: dict, level: int) -> RequirementData:
        """Convert a CSV row to a RequirementData object."""
        return RequirementData(
            code=row["code"],
            name=row["name"],
            description=row.get("description"),
            guidance=row.get("guidance"),
            level=level,
            is_assessable=False,  # Will be set based on children
            metadata={k: v for k, v in row.items() if k not in {
                "code", "name", "description", "guidance", "level", "parent_code"
            } and v},
        )

    def _parse_dict(self, data: dict) -> FrameworkData:
        """Parse framework data from a dictionary."""
        requirements = [
            self._parse_requirement(req, 0, idx)
            for idx, req in enumerate(data.get("requirements", []))
        ]

        # Calculate hierarchy levels
        def get_max_level(reqs: list[RequirementData], current: int = 0) -> int:
            if not reqs:
                return current
            return max(
                get_max_level(req.children, req.level)
                for req in reqs
            )

        hierarchy_levels = get_max_level(requirements) + 1 if requirements else 1

        return FrameworkData(
            code=data["code"],
            name=data["name"],
            version=data.get("version", "1.0"),
            description=data.get("description"),
            framework_type=FrameworkType.CUSTOM,
            hierarchy_levels=data.get("hierarchy_levels", hierarchy_levels),
            hierarchy_labels=data.get("hierarchy_labels"),
            metadata=data.get("metadata"),
            requirements=requirements,
        )

    def _parse_requirement(
        self,
        data: dict,
        level: int,
        order: int,
    ) -> RequirementData:
        """Recursively parse a requirement from dictionary data."""
        children = [
            self._parse_requirement(child, level + 1, idx)
            for idx, child in enumerate(data.get("children", []))
        ]

        # Leaf nodes (no children) are assessable by default
        is_assessable = data.get("is_assessable", len(children) == 0)

        return RequirementData(
            code=data["code"],
            name=data["name"],
            description=data.get("description"),
            guidance=data.get("guidance"),
            level=level,
            is_assessable=is_assessable,
            display_order=order,
            metadata=data.get("metadata"),
            children=children,
        )

    @classmethod
    def from_json(cls, json_data: Union[str, dict]) -> "CustomFrameworkLoader":
        """Create a loader from JSON data.

        Args:
            json_data: JSON string or dictionary

        Returns:
            CustomFrameworkLoader instance
        """
        return cls(data=json_data)

    @classmethod
    def from_file(cls, file_path: Union[str, Path]) -> "CustomFrameworkLoader":
        """Create a loader from a file.

        Args:
            file_path: Path to JSON or CSV file

        Returns:
            CustomFrameworkLoader instance
        """
        return cls(file_path=file_path)
