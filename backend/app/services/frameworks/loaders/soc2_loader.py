"""Loader for SOC 2 Trust Services Criteria."""

from app.models.unified_framework import FrameworkType
from app.services.frameworks.loaders.base_loader import (
    BaseFrameworkLoader,
    FrameworkData,
    RequirementData,
)


class Soc2Loader(BaseFrameworkLoader):
    """Loader for SOC 2 Trust Services Criteria.

    Loads the SOC 2 framework based on the AICPA Trust Services Criteria.
    The framework has 2 hierarchy levels:
    - Level 0: Categories (Security, Availability, Processing Integrity,
               Confidentiality, Privacy)
    - Level 1: Criteria (Common Criteria CC1-CC9 + category-specific) - assessable
    """

    def get_framework_data(self) -> FrameworkData:
        """Get SOC 2 Trust Services Criteria framework data."""
        categories = [
            self._security_category(),
            self._availability_category(),
            self._processing_integrity_category(),
            self._confidentiality_category(),
            self._privacy_category(),
        ]

        return FrameworkData(
            code="SOC2-TSC-2017",
            name="SOC 2 Trust Services Criteria",
            version="2017",
            description=(
                "The SOC 2 Trust Services Criteria (TSC) is a reporting framework "
                "developed by the AICPA for service organizations. It covers five "
                "trust service categories: Security (required), Availability, "
                "Processing Integrity, Confidentiality, and Privacy."
            ),
            framework_type=FrameworkType.SOC2_TSC,
            hierarchy_levels=2,
            hierarchy_labels=["Category", "Criterion"],
            metadata={
                "official_url": "https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome",
                "total_categories": 5,
                "total_common_criteria": 9,
                "publication_year": 2017,
            },
            requirements=categories,
        )

    def _security_category(self) -> RequirementData:
        """Security (Common Criteria) - Required for all SOC 2 reports."""
        criteria = [
            # CC1: Control Environment
            ("CC1.1", "COSO Principle 1", "The entity demonstrates a commitment to integrity and ethical values."),
            ("CC1.2", "COSO Principle 2", "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control."),
            ("CC1.3", "COSO Principle 3", "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives."),
            ("CC1.4", "COSO Principle 4", "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives."),
            ("CC1.5", "COSO Principle 5", "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives."),

            # CC2: Communication and Information
            ("CC2.1", "COSO Principle 13", "The entity obtains or generates and uses relevant, quality information to support the functioning of internal control."),
            ("CC2.2", "COSO Principle 14", "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal control."),
            ("CC2.3", "COSO Principle 15", "The entity communicates with external parties regarding matters affecting the functioning of internal control."),

            # CC3: Risk Assessment
            ("CC3.1", "COSO Principle 6", "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives."),
            ("CC3.2", "COSO Principle 7", "The entity identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed."),
            ("CC3.3", "COSO Principle 8", "The entity considers the potential for fraud in assessing risks to the achievement of objectives."),
            ("CC3.4", "COSO Principle 9", "The entity identifies and assesses changes that could significantly impact the system of internal control."),

            # CC4: Monitoring Activities
            ("CC4.1", "COSO Principle 16", "The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning."),
            ("CC4.2", "COSO Principle 17", "The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors, as appropriate."),

            # CC5: Control Activities
            ("CC5.1", "COSO Principle 10", "The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels."),
            ("CC5.2", "COSO Principle 11", "The entity also selects and develops general control activities over technology to support the achievement of objectives."),
            ("CC5.3", "COSO Principle 12", "The entity deploys control activities through policies that establish what is expected and in procedures that put policies into action."),

            # CC6: Logical and Physical Access Controls
            ("CC6.1", "Logical Access Security", "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives."),
            ("CC6.2", "Access Provisioning", "Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity."),
            ("CC6.3", "Access Removal", "The entity removes access to protected information assets when appropriate."),
            ("CC6.4", "Access Restriction", "The entity restricts physical access to facilities and protected information assets to authorized personnel."),
            ("CC6.5", "Asset Disposal", "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished."),
            ("CC6.6", "Malware Protection", "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software."),
            ("CC6.7", "Transmission Protection", "The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission."),
            ("CC6.8", "Data Handling", "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software."),

            # CC7: System Operations
            ("CC7.1", "Security Event Detection", "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities."),
            ("CC7.2", "Security Incident Response", "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives."),
            ("CC7.3", "Security Incident Recovery", "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives and, if so, takes action to prevent or address such failures."),
            ("CC7.4", "Security Incident Communication", "The entity responds to identified security incidents by executing a defined incident response program to understand, contain, remediate, and communicate security incidents."),
            ("CC7.5", "Security Event Recovery", "The entity identifies, develops, and implements activities to recover from identified security incidents."),

            # CC8: Change Management
            ("CC8.1", "Change Management", "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives."),

            # CC9: Risk Mitigation
            ("CC9.1", "Risk Mitigation Programs", "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions."),
            ("CC9.2", "Vendor Risk Management", "The entity assesses and manages risks associated with vendors and business partners."),
        ]

        return RequirementData(
            code="Security",
            name="Security",
            description=(
                "Information and systems are protected against unauthorized access, "
                "unauthorized disclosure of information, and damage to systems that could "
                "compromise the availability, integrity, confidentiality, and privacy of "
                "information or systems."
            ),
            level=0,
            is_assessable=False,
            display_order=0,
            metadata={"is_required": True, "criterion_count": len(criteria)},
            children=[
                RequirementData(
                    code=code,
                    name=name,
                    description=desc,
                    level=1,
                    is_assessable=True,
                    display_order=idx,
                )
                for idx, (code, name, desc) in enumerate(criteria)
            ],
        )

    def _availability_category(self) -> RequirementData:
        """Availability - Optional category."""
        criteria = [
            ("A1.1", "System Capacity", "The entity maintains, monitors, and evaluates current processing capacity and use of system components to manage capacity demand and to enable the implementation of additional capacity to help meet its objectives."),
            ("A1.2", "Disaster Recovery", "The entity authorizes, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure to meet its objectives."),
            ("A1.3", "Recovery Testing", "The entity tests recovery plan procedures supporting system recovery to meet its objectives."),
        ]

        return RequirementData(
            code="Availability",
            name="Availability",
            description=(
                "Information and systems are available for operation and use to meet "
                "the entity's objectives."
            ),
            level=0,
            is_assessable=False,
            display_order=1,
            metadata={"is_required": False, "criterion_count": len(criteria)},
            children=[
                RequirementData(
                    code=code,
                    name=name,
                    description=desc,
                    level=1,
                    is_assessable=True,
                    display_order=idx,
                )
                for idx, (code, name, desc) in enumerate(criteria)
            ],
        )

    def _processing_integrity_category(self) -> RequirementData:
        """Processing Integrity - Optional category."""
        criteria = [
            ("PI1.1", "Processing Accuracy", "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives."),
            ("PI1.2", "Input Validation", "The entity implements policies and procedures over system inputs that result in products, services, and reporting to meet the entity's objectives."),
            ("PI1.3", "Processing Error Correction", "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives."),
            ("PI1.4", "Output Review", "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely in accordance with specifications to meet the entity's objectives."),
            ("PI1.5", "Data Storage", "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely in accordance with system specifications to meet the entity's objectives."),
        ]

        return RequirementData(
            code="ProcessingIntegrity",
            name="Processing Integrity",
            description=(
                "System processing is complete, valid, accurate, timely, and authorized "
                "to meet the entity's objectives."
            ),
            level=0,
            is_assessable=False,
            display_order=2,
            metadata={"is_required": False, "criterion_count": len(criteria)},
            children=[
                RequirementData(
                    code=code,
                    name=name,
                    description=desc,
                    level=1,
                    is_assessable=True,
                    display_order=idx,
                )
                for idx, (code, name, desc) in enumerate(criteria)
            ],
        )

    def _confidentiality_category(self) -> RequirementData:
        """Confidentiality - Optional category."""
        criteria = [
            ("C1.1", "Confidential Information Identification", "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality."),
            ("C1.2", "Confidential Information Disposal", "The entity disposes of confidential information to meet the entity's objectives related to confidentiality."),
        ]

        return RequirementData(
            code="Confidentiality",
            name="Confidentiality",
            description=(
                "Information designated as confidential is protected to meet the "
                "entity's objectives."
            ),
            level=0,
            is_assessable=False,
            display_order=3,
            metadata={"is_required": False, "criterion_count": len(criteria)},
            children=[
                RequirementData(
                    code=code,
                    name=name,
                    description=desc,
                    level=1,
                    is_assessable=True,
                    display_order=idx,
                )
                for idx, (code, name, desc) in enumerate(criteria)
            ],
        )

    def _privacy_category(self) -> RequirementData:
        """Privacy - Optional category based on GAPP."""
        criteria = [
            ("P1.1", "Privacy Notice", "The entity provides notice to data subjects about its privacy practices to meet the entity's objectives related to privacy."),
            ("P2.1", "Privacy Choice and Consent", "The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information to data subjects."),
            ("P3.1", "Privacy Collection", "Personal information is collected consistent with the entity's objectives related to privacy."),
            ("P3.2", "Privacy Collection from Third Parties", "For information collected from sources other than the individual, the entity collects such information consistent with the entity's objectives related to privacy."),
            ("P4.1", "Privacy Use and Retention", "The entity limits the use of personal information to the purposes identified in the entity's objectives related to privacy."),
            ("P4.2", "Privacy Retention", "The entity retains personal information consistent with the entity's objectives related to privacy."),
            ("P4.3", "Privacy Disposal", "The entity securely disposes of personal information to meet the entity's objectives related to privacy."),
            ("P5.1", "Privacy Access", "The entity grants identified and authenticated data subjects the ability to access their stored personal information for review and, upon request, provides physical or electronic copies of that information."),
            ("P5.2", "Privacy Correction", "The entity corrects, amends, or appends personal information based on information provided by data subjects and communicates such information to third parties."),
            ("P6.1", "Privacy Disclosure", "The entity discloses personal information to third parties with the explicit consent of data subjects."),
            ("P6.2", "Privacy Disclosure Authorization", "The entity creates and retains a complete, accurate, and timely record of authorized disclosures of personal information."),
            ("P6.3", "Privacy Disclosure Notification", "The entity creates and retains a complete, accurate, and timely record of detected or reported unauthorized disclosures of personal information."),
            ("P6.4", "Privacy Third Party Management", "The entity obtains privacy commitments from vendors and other third parties."),
            ("P6.5", "Privacy Third Party Compliance", "The entity obtains privacy commitments from vendors and other third parties and assesses compliance on a periodic and as-needed basis."),
            ("P6.6", "Privacy Breach Notification", "The entity provides notification of breaches and incidents to affected data subjects, regulators, and others."),
            ("P6.7", "Privacy Dispute Resolution", "The entity provides data subjects with an ability to appeal processing decisions.",),
            ("P7.1", "Privacy Quality", "The entity collects and maintains accurate, up-to-date, complete, and relevant personal information."),
            ("P8.1", "Privacy Monitoring", "The entity implements a process for receiving, addressing, resolving, and communicating the resolution of inquiries, complaints, and disputes from data subjects."),
        ]

        return RequirementData(
            code="Privacy",
            name="Privacy",
            description=(
                "Personal information is collected, used, retained, disclosed, and "
                "disposed of to meet the entity's objectives."
            ),
            level=0,
            is_assessable=False,
            display_order=4,
            metadata={"is_required": False, "criterion_count": len(criteria)},
            children=[
                RequirementData(
                    code=code,
                    name=name,
                    description=desc,
                    level=1,
                    is_assessable=True,
                    display_order=idx,
                )
                for idx, (code, name, desc) in enumerate(criteria)
            ],
        )
