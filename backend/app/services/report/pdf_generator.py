"""PDF report generation service."""

import io
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader


class PDFGenerator:
    """Service for generating PDF reports from HTML templates."""

    def __init__(self):
        template_dir = Path(__file__).parent / "templates"
        self.env = Environment(
            loader=FileSystemLoader(str(template_dir)),
            autoescape=True,
        )

    def generate_pdf(self, report_content: dict[str, Any]) -> bytes:
        """
        Generate a PDF from report content.

        Args:
            report_content: The report content dictionary from ReportGenerator

        Returns:
            PDF file bytes
        """
        # Import weasyprint here to avoid import errors if not installed
        try:
            from weasyprint import HTML, CSS
        except ImportError:
            raise ImportError(
                "weasyprint is required for PDF generation. "
                "Install it with: pip install weasyprint"
            )

        # Calculate score angle for the gauge (0-360 degrees)
        overall_score = report_content.get("executive_summary", {}).get("overall_maturity", 0)
        score_angle = (overall_score / 4) * 360

        # Render HTML template
        template = self.env.get_template("full_report.html")
        html_content = template.render(
            score_angle=score_angle,
            **report_content,
        )

        # Generate PDF
        pdf_buffer = io.BytesIO()
        HTML(string=html_content).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)

        return pdf_buffer.read()

    def generate_html(self, report_content: dict[str, Any]) -> str:
        """
        Generate HTML from report content (for preview).

        Args:
            report_content: The report content dictionary

        Returns:
            HTML string
        """
        overall_score = report_content.get("executive_summary", {}).get("overall_maturity", 0)
        score_angle = (overall_score / 4) * 360

        template = self.env.get_template("full_report.html")
        return template.render(
            score_angle=score_angle,
            **report_content,
        )
