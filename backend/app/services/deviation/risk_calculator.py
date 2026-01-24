"""Risk calculation service for deviations."""

from typing import Any


# Function criticality mapping (impact multiplier)
FUNCTION_CRITICALITY = {
    "GV": 1.2,  # Governance impacts everything
    "ID": 1.0,  # Identify
    "PR": 1.1,  # Protect - critical
    "DE": 1.0,  # Detect
    "RS": 1.1,  # Respond - critical during incidents
    "RC": 1.0,  # Recover
}


class RiskCalculator:
    """Calculator for risk scores on deviations."""

    def calculate_risk_score(
        self,
        impact: int,
        likelihood: int,
    ) -> tuple[int, str]:
        """
        Calculate risk score and severity.

        Args:
            impact: Impact score (1-5)
            likelihood: Likelihood score (1-5)

        Returns:
            Tuple of (risk_score, severity)
        """
        impact = max(1, min(5, impact))
        likelihood = max(1, min(5, likelihood))

        risk_score = impact * likelihood

        if risk_score >= 15:
            severity = "critical"
        elif risk_score >= 10:
            severity = "high"
        elif risk_score >= 5:
            severity = "medium"
        else:
            severity = "low"

        return risk_score, severity

    def calculate_impact_from_function(
        self,
        function_code: str,
        base_impact: int = 3,
    ) -> int:
        """
        Calculate impact score based on CSF function.

        Args:
            function_code: The CSF function code (e.g., "GV", "PR")
            base_impact: Base impact score (1-5)

        Returns:
            Adjusted impact score (1-5)
        """
        multiplier = FUNCTION_CRITICALITY.get(function_code, 1.0)
        adjusted = int(base_impact * multiplier)
        return max(1, min(5, adjusted))

    def calculate_likelihood_from_evidence(
        self,
        has_policy: bool,
        has_control: bool,
        has_documentation: bool,
    ) -> int:
        """
        Estimate likelihood based on existing evidence.

        Less evidence = higher likelihood of issue occurring.

        Args:
            has_policy: Whether a policy exists
            has_control: Whether a control exists
            has_documentation: Whether documentation exists

        Returns:
            Likelihood score (1-5)
        """
        score = 5  # Start at highest likelihood

        if has_policy:
            score -= 1
        if has_control:
            score -= 2
        if has_documentation:
            score -= 1

        return max(1, score)

    def get_risk_summary(
        self,
        deviations: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """
        Calculate risk summary from a list of deviations.

        Args:
            deviations: List of deviation dicts with severity and risk_score

        Returns:
            Risk summary statistics
        """
        if not deviations:
            return {
                "total_deviations": 0,
                "critical_count": 0,
                "high_count": 0,
                "medium_count": 0,
                "low_count": 0,
                "average_risk_score": 0.0,
                "highest_risk_areas": [],
                "risk_by_function": {},
            }

        severity_counts = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
        }

        risk_by_function = {}
        total_risk = 0

        for dev in deviations:
            severity = dev.get("severity", "low")
            severity_counts[severity] = severity_counts.get(severity, 0) + 1

            risk_score = dev.get("risk_score", 0)
            total_risk += risk_score

            func_code = dev.get("function_code")
            if func_code:
                if func_code not in risk_by_function:
                    risk_by_function[func_code] = {"total_risk": 0, "count": 0}
                risk_by_function[func_code]["total_risk"] += risk_score
                risk_by_function[func_code]["count"] += 1

        # Calculate average risk by function
        for func_code in risk_by_function:
            data = risk_by_function[func_code]
            data["average_risk"] = round(data["total_risk"] / data["count"], 2)

        # Get highest risk areas
        sorted_deviations = sorted(
            deviations,
            key=lambda x: x.get("risk_score", 0),
            reverse=True,
        )
        highest_risk = sorted_deviations[:5]

        return {
            "total_deviations": len(deviations),
            "critical_count": severity_counts["critical"],
            "high_count": severity_counts["high"],
            "medium_count": severity_counts["medium"],
            "low_count": severity_counts["low"],
            "average_risk_score": round(total_risk / len(deviations), 2),
            "highest_risk_areas": [
                {
                    "subcategory_code": d.get("subcategory_code"),
                    "title": d.get("title"),
                    "risk_score": d.get("risk_score"),
                    "severity": d.get("severity"),
                }
                for d in highest_risk
            ],
            "risk_by_function": {
                k: v["average_risk"] for k, v in risk_by_function.items()
            },
        }
