1. EXECUTIVE SUMMARY
Product Name: Compliance AI – an AI-driven cybersecurity compliance assessment engine.
Value Proposition: Compliance AI automates the execution of formal NIST Cybersecurity Framework (CSF) 2.0 assessments, a process traditionally performed by costly risk consultants over several weeks . By leveraging AI for control mapping, structured interviews, and maturity scoring, the product delivers consistent, repeatable assessments that reduce manual effort and human subjectivity . The result is a faster, more transparent evaluation of an organization’s cybersecurity posture, with detailed insights into policy and control gaps that would otherwise be obscured by high-level consultant reports .
Target Users & Use Cases: The primary users are Compliance Managers and Risk Consultants who conduct NIST CSF assessments, as well as Control Owners who provide input and CISOs who consume the final reports. Internal compliance teams will use Compliance AI for self-assessments and audit preparation, replacing ad-hoc spreadsheets and interviews with a streamlined workflow. External assessors can use the tool to standardize their engagements across clients, ensuring consistent quality. Use cases include baseline CSF maturity assessments, periodic compliance check-ups, and pre-audit readiness evaluations – all with full documentation and audit trails.
Key MVP Capabilities: The Minimum Viable Product will support NIST CSF 2.0 assessments end-to-end. Core features include: (1) Data ingestion of an organization’s control inventory (CSV/XLSX) and policy documents (PDF/DOCX) to build a centralized library of controls and policies. (2) Automated mapping of these controls and policies to NIST CSF 2.0 Functions/Categories/Subcategories, using AI suggestions with human review. (3) An AI-driven interview bot that conducts structured cybersecurity interviews with control owners, using a question bank aligned to each CSF Subcategory, to gather qualitative details on control design and implementation. (4) A Maturity scoring engine that evaluates each control and policy against CSF criteria, producing explainable Subcategory-level scores aligned to NIST Implementation Tiers (Partial through Adaptive). (5) Deviation detection logic that identifies gaps such as missing policies or insufficient control designs for each CSF requirement. (6) Automated report generation that compiles the findings into a comprehensive assessment report, including an overall maturity dashboard, Function/Category summaries, a risk-ranked list of compliance gaps, and detailed recommendations.
Out of Scope (MVP): Compliance AI’s initial release focuses on design and documentation maturity only, not live control effectiveness testing. It will not perform automated evidence collection from production systems or verify control operation via logs or technical scans. Other frameworks (e.g. ISO 27001, SOC 2) are excluded from MVP. Continuous real-time monitoring and multi-tenant SaaS capabilities are also out of scope for the first release – the MVP is a single-tenant, on-premise or dedicated-cloud solution for one organization’s assessments. Integration with external GRC platforms is deferred. These constraints ensure the MVP remains focused on NIST CSF 2.0 gap assessments and can deliver a robust experience in that domain.
Success Criteria: Success for Compliance AI will be measured by its efficiency, consistency, and insight. The tool should reduce the time and cost of a NIST CSF assessment by at least 50% compared to a manual consultant-led approach (e.g. completing an assessment in ~2 weeks instead of 4–6 weeks) . Assessment results should be reproducible and not dependent on individual assessor judgment – eliminating the variability where one auditor’s “partially implemented” is another’s “fully implemented” . All findings must be backed by clear explanations (e.g. citing which policy or interview response led to a gap), addressing the common complaint that high-level compliance scores are ambiguous and not actionable . Early adopter organizations should be able to use Compliance AI to identify previously overlooked risks (e.g. missing controls or policies) that manual processes missed, demonstrating improved insight. Lastly, stakeholder satisfaction is key: Compliance managers and consultants should feel that the tool makes their job easier (through automation and AI assistance), and CISOs should trust the accuracy and clarity of the reports. Meeting these criteria in the MVP will validate Compliance AI’s approach and lay the groundwork for expanding to broader compliance functionality in future phases.
2. PRODUCT VISION AND SCOPE
2.1 Vision Statement
Compliance AI will become an intelligent co-pilot for cybersecurity compliance, transforming the labor-intensive assessment process into an efficient, data-driven practice. In the long term, Compliance AI will continuously map organizational controls to multiple frameworks, conduct AI-guided audits with minimal human intervention, and provide real-time visibility into compliance posture – all while ensuring transparency, accuracy, and alignment with enterprise risk management objectives.
2.2 Problem Statement
Organizations today struggle with costly, inefficient, and inconsistent cybersecurity assessments. A formal NIST CSF assessment requires significant manual effort – consultants must map hundreds of controls to framework subcategories, interview many stakeholders, and synthesize findings into reports. This process can take months and cost tens of thousands of dollars . The manual nature introduces several problems:
	•	High Cost & Inefficiency: Each assessment is a bespoke project. Consultants or internal teams spend weeks in workshops, interviews, and document reviews  . The effort is duplicated every cycle, often using spreadsheet tools that don’t scale. The result is an expensive snapshot that may be obsolete by the time it’s delivered.
	•	Inconsistent Quality: Assessment outcomes depend heavily on the individual assessor’s expertise and judgment. Interviews and scoring are subjective – one assessor’s interpretation of “partially implemented” vs “fully implemented” may differ from another’s . This inconsistency leads to variable results and makes it hard for management to know where they truly stand. Consultant turnover or differing methodologies mean two assessments of the same organization can yield divergent maturity ratings.
	•	Lack of Explainability: Traditional reports often provide high-level maturity scores (e.g. “Protect = Tier 2”) without clear traceability to evidence or specific gaps. Non-technical executives struggle to understand what it means to be “Tier 3” or how that reduces risk . If a report labels a function as “Repeatable (Tier 3)”, it still may not reveal which critical system is missing a control or how to improve. This ambiguity erodes the value of the assessment – decision makers can’t tie the scores to concrete risk reduction actions .
	•	Process Visibility and Audit Trail Gaps: Tracking the progress of a manual assessment is difficult. There is no unified system of record; evidence may be scattered in emails, documents, and spreadsheets. Maintaining an audit trail of who was interviewed, what was asked, and how conclusions were reached is cumbersome. This lack of transparency makes it hard to assure regulators or internal audit that the assessment was thorough and unbiased.
	•	Governance and Continuity Challenges: When relying on individual consultants, knowledge of the organization’s context and past assessments might not carry over. Each new assessor must reconstruct understanding of the business, and subtle nuances may be lost. This also makes it difficult to monitor improvements year-over-year in a structured way.
Compliance AI directly addresses these issues. It automates the repetitive mapping and data gathering tasks, reducing labor and cost. Its AI-driven interviews enforce consistency in questions and follow-ups, minimizing subjective variance. The platform produces explainable findings – every deviation or score is tied to specific input (a policy document, an interview answer, or lack thereof), solving the explainability gap. Throughout the process, every action is logged: which control was mapped to which requirement, which questions were answered by whom, and how the score was calculated – providing a full audit trail for both internal oversight and external auditors. By tackling the cost, inconsistency, and opacity of manual assessments, Compliance AI enables organizations to achieve a reliable and repeatable compliance process that scales with their needs.
2.3 Scope Boundaries
In Scope (MVP): Compliance AI’s initial release is tightly focused on delivering a full NIST CSF 2.0 design maturity assessment workflow:
	•	Framework: NIST CSF 2.0 only. The entire CSF 2.0 Functions, Categories, and Subcategories taxonomy is built into the system as the assessment baseline  . No other frameworks (ISO 27001, SOC 2, etc.) are included in this version.
	•	Control & Policy Ingestion: The system will intake structured control inventories and policy documents provided by the user. This includes reading spreadsheets of controls (with defined schema) and parsing text from policy/procedure documents. Ingestion covers capturing control attributes, policy contents, and linking them to the internal data model.
	•	AI-Assisted Structured Interviews: Compliance AI will conduct structured interviews with control owners and SMEs to gather qualitative information about control design and implementation. An AI interview bot will ask predetermined, framework-aligned questions (with dynamic branching as needed) for each applicable Subcategory. The bot’s goal is to understand how each control is implemented and managed (e.g. frequency, responsibility, process details) in a consistent manner.
	•	Control Design Maturity Evaluation: The focus of MVP is on design maturity of controls (i.e., the existence and quality of control design and policy, not the operational effectiveness). The system will evaluate, for each CSF Subcategory, whether the organization has designed appropriate policies and controls. This includes assessing if policies address the requirements, if controls are documented and assigned, and if their design reflects higher maturity practices (e.g. formalization, regular review).
	•	Deviation Identification: Compliance AI will automatically identify gaps or deviations at two levels: (1) Policy-level deviations – e.g. missing required policies for a subcategory, or policies that exist but don’t fully meet CSF outcomes; (2) Control design-level deviations – e.g. missing controls for a subcategory outcome, or controls that are ad hoc and not repeatable. Detected deviations will be documented with context (which Subcategory, what the expected outcome is, and what is missing or weak in the organization’s implementation).
	•	Assessment Report Generation: The MVP will generate a comprehensive assessment report that includes an executive summary of overall CSF function maturity, detailed findings for each Category/Subcategory, a list of all identified deviations (gaps) ranked by risk, and recommendations for improvement. The report will be available in PDF and DOCX formats with the organization’s branding.
	•	Risk-Based Prioritization: While the MVP does not perform full risk quantification, it will assign a severity or risk rating to each deviation based on impact criteria (such as which CSF Function it falls under and the criticality of the control gap). This provides a prioritized list of issues for the organization to address first.
	•	User Interface & Audit Trail: A user-friendly interface is in scope to manage the workflow: uploading data, reviewing AI mapping suggestions, monitoring interview progress, and reviewing findings. All user actions (e.g. mapping overrides, answers provided) will be logged. Audit trail and role-based access (for different personas like manager vs. consultant vs. control owner) are included in MVP for governance and accountability.
Out of Scope (MVP): The following capabilities are explicitly excluded from the MVP to ensure focus:
	•	Control Effectiveness Testing: The MVP will not perform automated evidence collection or technical testing of control effectiveness. Activities like log analysis, vulnerability scanning, or checking control operation in real-time are out of scope. For example, the tool won’t verify if an access control is actually working in practice or if incident response drills are effective – it only assesses design and documented practice, not live execution.
	•	Additional Frameworks: No support for frameworks other than NIST CSF 2.0. Popular frameworks like ISO/IEC 27001, NIST 800-53, CIS Controls, SOC 2, COBIT, etc., and their control sets are not included in this version. The mapping engine and data model are built with extensibility in mind, but the MVP will handle only the CSF 2.0 content and terminology.
	•	Continuous Monitoring: The system is not a continuous compliance monitoring tool in MVP. It performs point-in-time assessments. There is no feature for ongoing automated tracking of control status or drift (e.g. it won’t automatically re-check if a control has fallen out of compliance next month). The assessment is initiated on-demand or at planned intervals by the user.
	•	Automated Evidence Collection: The MVP relies on user-provided inputs (documents, interviews). It will not integrate directly with enterprise systems to pull data (e.g. connect to Active Directory to fetch user lists, or scan configurations). Integration hooks for evidence gathering (APIs, connectors to security tools) are deferred.
	•	External GRC Platform Integration: While reports and data can be exported, the MVP will not have out-of-the-box integration with external GRC platforms or ERM systems (e.g. ServiceNow GRC, Archer). There are no real-time API feeds or two-way sync in MVP. It operates as a standalone tool for now, with the expectation that future versions might provide richer integration capabilities.
	•	Multi-Tenancy & SaaS: The MVP will be delivered as a single-tenant application (e.g. deployable for one enterprise or on one client instance). Functionality for multi-tenant SaaS use (hosting multiple client organizations on one installation with strict data partitioning) is not included. The focus is on a single-organization deployment, which can be on-premises or a dedicated cloud instance for that organization or consulting firm.
By clearly defining these scope boundaries, the MVP of Compliance AI stays concentrated on solving the core problem: executing a NIST CSF 2.0 design maturity assessment from start to finish with AI assistance. This clarity helps ensure development efforts are aligned with delivering immediate value, while laying the groundwork for expanded features in subsequent phases.
3. USER PERSONAS
This section describes the key personas who will interact with Compliance AI. Each persona includes their role, responsibilities, goals, pain points, and how they will use the product. All personas are assumed to have a stake in cybersecurity compliance and will engage with the system in different capacities.
Persona 1: Compliance Manager (Internal)
Role & Context: A Compliance Manager is typically an internal GRC (Governance, Risk, and Compliance) professional responsible for the organization’s overall compliance posture. They usually report to the CISO or risk officer and coordinate assessments, audits, and policy management.
Primary Responsibilities: They maintain the compliance program, ensure that security controls and policies meet framework requirements, and prepare for external audits. They schedule and scope assessments (e.g. deciding to assess against NIST CSF 2.0 annually), gather necessary documentation, and liaise with both auditors and internal teams. They also track remediation of any identified gaps.
Goals: When using Compliance AI, the Compliance Manager aims to streamline the assessment process and gain a clear view of the organization’s CSF maturity. They want a single source of truth for compliance status and a way to easily identify high-risk gaps. A key goal is to produce credible reports for executive leadership and regulators that demonstrate due diligence. They also seek to reduce reliance on expensive external consultants by empowering in-house processes.
Pain Points: Traditionally, this persona struggles with labor-intensive assessments – chasing down control owners for interviews, manually mapping controls to frameworks, and compiling evidence. Inconsistent findings from different consultants make it hard for them to track progress year over year. They often worry that something might be missed (e.g. a policy that wasn’t reviewed or a control gap hidden in a spreadsheet). Another pain point is explaining technical gaps to business leadership; without clear data, their reports can be questioned.
Key Workflows in Compliance AI: The Compliance Manager will initiate a new NIST CSF assessment in the tool, upload control and policy data, and oversee the progress. They will use the Framework Mapping interface to review AI-suggested mappings and approve or adjust them. They assign interviews to appropriate employees (control owners) via the system and monitor response completion. Throughout, they track overall assessment status on the dashboard (e.g. which sections are complete, which interviews pending). After analysis, they review the generated report within the tool, focusing on the list of deviations and their risk rankings. They may iteratively go back to control owners for clarifications if needed (using the collaboration features). Finally, they will present or distribute the final report to executives and possibly external auditors.
Technical Proficiency: Moderate. The Compliance Manager is comfortable with GRC software and spreadsheets, but may not be deeply technical in IT; they understand security concepts and frameworks well. They expect a professional UI that doesn’t require programming skills – mostly point-and-click configuration and review. They value clear visualizations (charts for maturity scores) and the ability to drill down into details when needed.
Persona 2: External Risk Consultant/Assessor
Role & Context: This persona is a consultant from a third-party firm (or an independent assessor) who conducts cybersecurity framework assessments for clients. They might work for a Big Four consulting firm or a specialized boutique. They often handle multiple client assessments in parallel, each with different environments.
Primary Responsibilities: For each client engagement, the Risk Consultant plans and executes the assessment: conducting kickoff meetings, collecting documentation, performing interviews, evaluating controls, and writing the final report with recommendations. They are responsible for delivering an objective, comprehensive assessment to the client’s management.
Goals: Using Compliance AI, the consultant wants to increase efficiency and consistency of their assessments. They aim to spend less time on rote tasks (like mapping controls to the CSF – which can be automated) and more on analyzing results and advising the client. A key goal is to enforce a standardized methodology across all their assessments (so that quality does not vary by individual). They also want to easily produce polished reports. Ultimately, this tool should allow them to serve more clients or focus on higher-value consulting (like risk treatment planning) rather than data gathering.
Pain Points: Traditionally, consultants face tight timelines and budget pressures; gathering information from clients is often slow (scheduling interviews, waiting for documents). They may use generic spreadsheets or questionnaires that clients find cumbersome. Ensuring nothing is overlooked (especially if a client is less organized) is a challenge. Also, writing the final report can be very time-consuming, and maintaining consistency (especially in a team of multiple consultants) is hard – one consultant’s style or thoroughness may differ from another’s. They fear missing a critical gap or mis-scoring a control due to incomplete information.
Key Workflows in Compliance AI: The Risk Consultant will start by inputting the client’s data (or guiding the client to do so via the system). They may use the tool’s data ingestion to upload the client’s control catalog and policies. Then, they leverage the AI mapping engine to quickly map the client’s controls/policies to CSF subcategories, drastically cutting down the manual work of cross-referencing frameworks. Next, they initiate the interview phase: they may configure the interview assignments for various client stakeholders (e.g. sending the AI interview to the client’s IT manager for technical controls, to HR for training-related questions, etc.). They will monitor in real-time as the client enters responses or as the AI bot conducts chat-based interviews asynchronously. If some answers are unclear, the consultant will see flags and can manually intervene or schedule a follow-up. Throughout the assessment, they use the Compliance AI dashboard to track what’s done and what needs attention. After the AI’s analysis and scoring, the consultant reviews the draft findings and can adjust any scoring or notes (with justification) before finalizing. Finally, they export the report (likely customizing it with their consulting firm’s branding if needed) and present the results to the client. The tool also helps the consultant show the client a clear audit trail and evidence for each finding, lending credibility to their work.
Technical Proficiency: High. This persona is well-versed in various frameworks and likely comfortable with advanced GRC tools. They can understand how AI suggestions are generated and are capable of tuning the system (for example, tweaking mapping suggestions or adding custom interview questions if needed). They expect the tool to have advanced features (like the ability to override AI decisions or input expert judgment) without being overly simplistic. They are not afraid of complex interfaces but do value time-saving automation and reliable outputs.
Persona 3: Control Owner (Business/IT SME)
Role & Context: A Control Owner is an internal employee responsible for one or more specific security controls or processes. This could be an IT manager (for technical controls like patch management or access control), a HR manager (for security training programs), or a business unit manager (for controls around vendor management, etc.). They are the subject matter expert for how that control is implemented in practice.
Primary Responsibilities: They operate and maintain the day-to-day aspects of the control. For example, an Identity & Access Management owner ensures new hires get appropriate access, or an Incident Response owner maintains the IR plan and conducts drills. They also provide evidence during audits and answer questions about how their controls work.
Goals: When engaging with Compliance AI, the Control Owner’s goal is to easily provide accurate information about their controls and policies without unnecessary burden. They want to clearly understand what is being asked in the assessment and respond efficiently. They are also interested in the outcome if it relates to their domain – e.g. if the assessment finds their control area as immature, they want to know so they can improve it. But generally, their primary goal is completing their part of the assessment with minimal disruption to their regular work.
Pain Points: Control Owners are often busy with operational duties. In traditional assessments, they might be pulled into long meetings or asked to fill lengthy questionnaires. They find it frustrating if questions are unclear or seem not applicable to their area. They may also worry that their answers could be misinterpreted, or that they’ll be blamed for any gaps. The process can feel opaque – after giving input, they often don’t hear back until a final report, and even then they might not see how their contributions were used. They need clarity and efficiency, not jargon or redundancy (e.g. being asked the same question twice).
Key Workflows in Compliance AI: The Control Owner will primarily interact with the AI Interview Bot interface. They will receive an assignment or link (from the Compliance Manager or Consultant) prompting them to complete a questionnaire or live chat about their control area. For example, the owner of the “Vulnerability Management” control might get an interview covering CSF Subcategory ID.RA-01 (asset vulnerabilities identification) and related areas. They will log into Compliance AI (or a dedicated interview portal), where the interface presents them with questions one at a time in a clear, conversational manner. They will answer questions such as “Do you have an up-to-date inventory of all software and hardware? How is it maintained?” possibly with multiple choice or free text as needed. The AI bot may ask follow-ups like “You mentioned weekly scans – who reviews the scan results?” based on their answers. The Control Owner can also upload evidence documents if requested (though for MVP, evidence collection is minimal). They can pause and resume the interview if needed. Throughout, they see progress (e.g. 10 of 15 questions answered) so they know how much is left. If a question is unclear, they might ask for clarification from the bot, which will be programmed to provide additional context or definitions (like explaining what a “change management process” means if asked). Once done, they submit their responses. They might later be asked to review the findings relevant to their area for accuracy – e.g. if a deviation was identified in their control, the Compliance Manager might involve them to confirm details.
Technical Proficiency: Varies – some control owners are deeply technical (IT admins), others might be non-technical managers. Therefore, the interview interface must be extremely user-friendly and jargon-free. The persona might not spend much time in the tool beyond their interview, so it should require no training. Simple web form or chat-style Q&A suits them. They expect that the tool knows which questions to ask them and doesn’t require them to navigate the CSF framework themselves. In summary, their proficiency might be low, and the system should cater to a layperson with respect to compliance frameworks (though they know their own subject well).
Persona 4: CISO / Security Executive
Role & Context: The Chief Information Security Officer (or equivalent security executive) is the senior leader accountable for the organization’s cybersecurity risk management. They may be a direct recipient of the assessment findings and are often the one who requested the assessment (to benchmark progress or to report to the Board/regulators). They might not use the tool hands-on, but they are a key stakeholder in its output.
Primary Responsibilities: The CISO sets security strategy and ensures compliance with frameworks and regulations. They allocate budget and resources for remediation of identified gaps. They also present the organization’s cybersecurity posture to executive management and the Board, often referencing frameworks like NIST CSF for structure.
Goals: For the CISO, Compliance AI should deliver high-quality, credible insights that inform strategic decisions. They want to see where their program stands in a quantifiable way (e.g. “We are Tier 2 overall, aiming for Tier 3 next year”). They also want prioritization of risks – which gaps could lead to incidents or regulatory non-compliance. In addition, they value having an audit-ready artifact that they can show to external auditors or regulators to demonstrate due diligence (for example, evidence that they did a formal CSF assessment with a defined methodology). The CISO’s goal is to improve the organization’s security maturity efficiently, and this tool should highlight where investments are needed.
Pain Points: CISOs often receive thick audit reports or consultant slide decks that are too dense or not actionable. They dislike when assessments produce vague recommendations or simply state compliance levels without context. They also face the challenge of explaining technical details to business leaders – they need the assessment results in a format that translates well to risk and business impact. Another pain point is trust: they need confidence that the assessment process was thorough. If a breach happens in an area the assessment said was “green,” that undermines credibility. So they are cautious and will question the methodology if it’s not transparent.
Key Workflows in Compliance AI: The CISO will mostly be a consumer of the outputs. They may set up their direct reports (Compliance Manager) to use the tool, and possibly glance at the live dashboard periodically (especially if the tool provides a high-level view like “80% of assessment complete, preliminary scores by function…”). When the assessment is done, they will use the Reporting module to get an executive summary – likely a one-page dashboard of maturity by function (perhaps with a radar/spider chart or bar charts) and the top 5-10 high-risk gaps. They will read the detailed report sections for context as needed, but may focus on the summary and the risk-ranked deviations list. The CISO might also use the tool in presentations: for example, exporting graphics or data from the report to include in a slide to the Board (“Our Identify function is at 65% of target maturity, here are the major gaps…”). If the tool supports role-based access, the CISO could have a view-only access to the assessment results at any time. Additionally, if there’s a feature to compare against a previous assessment (for future versions), they’d be interested in seeing trends (e.g. improvement from last year). For MVP, they will use the output to drive decision-making on where to focus resources (e.g. if “Protect – PR.DS (Data Security)” is low scored with multiple deviations, they might initiate a project to invest in data encryption solutions or policies).
Technical Proficiency: High-level. The CISO typically has a strong background in security but is now in a leadership role. They won’t spend time tweaking the tool, but they understand frameworks deeply. They expect the results to be defensible; if an AI is used, they may ask how it works and whether its conclusions can be trusted. They appreciate clear visualizations and concise explanations. They might also want the ability to drill into specifics when needed (for instance, to see exactly which policy was flagged as missing). Overall, they have the proficiency to understand any part of the assessment but limited time – so the tool must present what’s important at a glance.
Persona 5: System Administrator (Platform Admin)
Role & Context: The System Administrator is the technical user responsible for installing, configuring, and maintaining the Compliance AI application. This could be an internal IT admin in the organization’s infrastructure team or an admin at the consulting firm deploying the tool for use with clients. They ensure the system is up, users are provisioned, and data is secure.
Primary Responsibilities: They handle deployment (on-prem or in cloud), manage user accounts and permissions (e.g. assigning roles to Compliance Manager vs Control Owner, etc.), integrate the product with corporate authentication systems (Single Sign-On if applicable), and perform backups and updates. They also ensure that sensitive data (policies, results) is stored securely according to the company’s IT standards. If any issues or errors occur (performance, bugs), the System Admin troubleshoots or contacts vendor support. They may also configure reference data like uploading the NIST CSF framework content if not pre-loaded (in MVP, it will be pre-loaded).
Goals: The System Admin’s goal is to have a reliable and secure system with minimal maintenance overhead. They want the deployment to be straightforward and the system to run smoothly so that the compliance team can do their job. They also aim to enforce proper access control – ensuring that only authorized users can see the sensitive compliance data. For example, they might need to ensure the control owners can only answer questions and not see other parts of the assessment, depending on policy. They also value logging and monitoring – they want to be able to audit who logged in, any configuration changes, etc., for security purposes.
Pain Points: If the tool is complex to install or has many dependencies, that’s a problem. They often juggle many systems, so they prefer software that adheres to standard enterprise IT practices (e.g. runs on a known stack, supports containerization, etc.). A pain point could be if the tool requires a lot of manual configuration for each assessment – they would like templates or automation. Also, since the data is sensitive (security gaps of the org), they worry about proper encryption and segregation. If the system doesn’t have good role management, they have to devise workarounds. They also need clarity on system requirements and compatibility (to avoid spending time on troubleshooting environment issues).
Key Workflows in Compliance AI: Initially, the System Admin will perform the installation and setup. This might involve deploying a server or cloud instance, running an installer or setting up a database, etc. They will configure integrations like linking to the corporate directory (LDAP/AD) for user authentication if possible, or they will create user accounts in the system for the identified personas (Compliance Manager, etc.). They set up roles and permissions as defined (ensuring least privilege: e.g. Control Owners only can access their interview, consultants can see multiple assessments, etc.). They might also upload initial master data like the NIST CSF framework (if the system didn’t have it pre-populated) – however, in MVP this is likely pre-loaded. During usage, they monitor system health. For example, if the AI processing happens, they ensure the server has enough CPU/Memory and that any AI model or API keys are properly configured. If the organization’s policy requires all tools to meet certain compliance (like data encryption at rest), they will verify Compliance AI’s configuration (perhaps turning on encryption settings, etc.). They will also schedule regular backups of the assessment database or ensure snapshots are taken, especially before upgrades. In case of user issues (“I can’t log in” or “I’m not seeing the assessment I should”), the System Admin intervenes by checking user roles, resetting passwords, or liaising with support. Finally, as new versions of Compliance AI come out, the System Admin will test and apply updates in a timely manner.
Technical Proficiency: High. They are typically well-versed in system architecture, databases, and possibly security. They can navigate configuration files, manage services, and integrate with enterprise IT tools. They may know basics of NLP/AI system requirements if applicable. They’ll read admin guides and expect the product to provide technical documentation on installation, security configuration, and backup/restore procedures. They likely have scripting skills to automate certain tasks. The UI for them might be less important than good documentation and robust logs. They appreciate features that make admin life easier, like admin dashboards showing user activity or one-click backup, but those are nice-to-haves. Primarily, they need the system to meet corporate IT standards and not introduce vulnerabilities or instability into the environment.
4. NIST CSF 2.0 FRAMEWORK REFERENCE
4.1 Framework Structure
The NIST Cybersecurity Framework (CSF) 2.0 Core is organized hierarchically into Functions, Categories, and Subcategories, which represent cybersecurity outcomes at increasing levels of granularity  . Compliance AI uses this structure as the backbone of assessments. Below is the complete CSF 2.0 structure, listing all Functions with their Categories and Subcategories:
	•	Function: GOVERN (GV) – “The organization’s cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored.”  This new Function in CSF 2.0 addresses overarching governance and resources that guide all other Functions.
	•	Category: Organizational Context (GV.OC) – The organization’s mission, stakeholders, and legal/regulatory requirements are understood in the context of cybersecurity risk  .
	•	GV.OC-01: The organizational mission is understood and informs cybersecurity risk management .
	•	GV.OC-02: Stakeholders’ needs and expectations regarding cybersecurity are understood and considered  .
	•	GV.OC-03: Legal, regulatory, and contractual cybersecurity requirements (including privacy/civil liberties) are understood and managed  .
	•	GV.OC-04: Critical objectives, services, and capabilities expected by external stakeholders are understood and communicated  .
	•	GV.OC-05: Outcomes, services, and dependencies the organization relies on (from others) are understood and communicated  .
	•	Category: Risk Management Strategy (GV.RM) – The organization’s priorities, risk appetite, and risk management processes are established and utilized  .
	•	GV.RM-01: Risk management objectives are established and agreed to by stakeholders .
	•	GV.RM-02: Risk appetite and tolerance statements are established, communicated, and maintained  .
	•	GV.RM-03: Cybersecurity risk management activities/outcomes are integrated into enterprise risk management (ERM) processes  .
	•	GV.RM-04: A strategic direction for risk response options is established and communicated  .
	•	GV.RM-05: Lines of communication across the org are established for cybersecurity risks (including supplier/third-party risks)  .
	•	GV.RM-06: A standardized method for risk categorization and prioritization is established and communicated  .
	•	GV.RM-07: Strategic opportunities (positive risks) are characterized and included in cyber risk discussions .
	•	Category: Roles, Responsibilities, and Authorities (GV.RR) – Cybersecurity roles and responsibilities are assigned to enable accountability and performance tracking  .
	•	GV.RR-01: Leadership is accountable for cybersecurity risk and fosters a risk-aware, ethical, continually improving culture  .
	•	GV.RR-02: Cybersecurity risk management roles, responsibilities, and authorities are clearly established, communicated, and enforced  .
	•	GV.RR-03: Adequate resources are allocated in line with the cybersecurity strategy, roles, and policies  .
	•	GV.RR-04: Cybersecurity is integrated into human resources practices (e.g. job descriptions, training, performance)  .
	•	Category: Policy (GV.PO) – Enterprise cybersecurity policies are established and kept current  .
	•	GV.PO-01: A cybersecurity risk management policy is established based on context and strategy, and is communicated and enforced  .
	•	GV.PO-02: The policy is reviewed and updated to reflect changes (requirements, threats, technology, mission) and re-communicated/enforced  .
	•	Category: Oversight (GV.OV) – Governance results and performance are reviewed to adjust strategy as needed  .
	•	GV.OV-01: Cybersecurity risk management outcomes are reviewed to inform adjustments in strategy/direction  .
	•	GV.OV-02: The cybersecurity strategy is periodically reviewed and adjusted to cover all requirements and risks  .
	•	GV.OV-03: Organizational cybersecurity risk management performance is evaluated and improvements are identified  .
	•	Category: Cybersecurity Supply Chain Risk Management (GV.SC) – Cyber supply chain risks are managed through programmatic activities and stakeholder coordination  .
	•	GV.SC-01: A cybersecurity supply chain risk management program/strategy with objectives and processes is established and agreed by stakeholders  .
	•	GV.SC-02: Roles and responsibilities for cybersecurity in supplier, customer, and partner relationships are established and communicated  .
	•	GV.SC-03: Cyber SCRM is integrated into broader cybersecurity and ERM processes; performance is monitored  .
	•	GV.SC-04: Suppliers are identified and prioritized by criticality (so the most critical receive greatest scrutiny)  .
	•	GV.SC-05: Security requirements for suppliers/third parties are established, prioritized, and embedded in contracts/agreements  .
	•	GV.SC-06: Planning and due diligence occur before entering supplier relationships to reduce risk .
	•	GV.SC-07: Risks posed by suppliers (and their products/services) are assessed, prioritized, responded to, and monitored throughout the relationship  .
	•	GV.SC-08: Relevant suppliers/third parties are included in incident planning, response, and recovery activities  .
	•	GV.SC-09: Supply chain security practices are integrated into cybersecurity and ERM programs and monitored across the product/service lifecycle  .
	•	GV.SC-10: SCRM plans include provisions for offboarding – activities after a partnership or service agreement ends  .
	•	Function: IDENTIFY (ID) – “The organization’s current cybersecurity risks are understood.”  This Function is about developing an understanding of organizational context, assets, data, and risk to inform cybersecurity priorities.
	•	Category: Asset Management (ID.AM) – Physical and software assets, data, and resources are inventoried and managed consistent with their importance  .
	•	ID.AM-01: Inventories of hardware assets are maintained (what devices are on the network) .
	•	ID.AM-02: Inventories of software, services, and systems are maintained .
	•	ID.AM-03: Network diagrams/data flow maps are maintained to understand connectivity  .
	•	ID.AM-04: Inventories of third-party services (supplier provided services) are maintained  .
	•	ID.AM-05: Assets are prioritized by classification, criticality, and impact (so one knows which are most critical)  .
	•	ID.AM-06: (Not used in CSF 2.0 — placeholder for a relocated 1.1 subcategory) .
	•	ID.AM-07: Inventories of data (by type) and associated metadata are maintained  .
	•	ID.AM-08: Systems, hardware, software, services, and data are managed throughout their life cycles (tracked from onboarding to decommission)  .
	•	Category: Risk Assessment (ID.RA) – The organization understands the cybersecurity risks to organizational operations, assets, and individuals  .
	•	ID.RA-01: Vulnerabilities in organizational assets are identified, validated, and recorded .
	•	ID.RA-02: Cyber threat intelligence is received from information-sharing forums/sources (threat data is gathered) .
	•	ID.RA-03: Internal and external threats are identified and recorded (threat modeling) .
	•	ID.RA-04: Potential impacts and likelihoods of threat exploitation of vulnerabilities are identified (risk scenarios are analyzed)  .
	•	ID.RA-05: Threat, vulnerability, likelihood, and impact information is used to determine inherent risk and prioritize response  .
	•	ID.RA-06: Risk responses (mitigation plans) are chosen, prioritized, planned, tracked, and communicated (i.e., there’s a process to decide how to treat each risk)  .
	•	ID.RA-07: Changes and exceptions (deviations from standard process) are managed, assessed for risk, recorded, and tracked  .
	•	ID.RA-08: Processes are established for receiving, analyzing, and responding to vulnerability disclosures (e.g. a procedure to handle reports of new vulns)  .
	•	ID.RA-09: The authenticity and integrity of hardware and software are assessed before acquisition and use (supply chain due diligence on products)  .
	•	ID.RA-10: Critical suppliers are assessed for risk prior to acquisition (supplier risk assessments are done)  .
	•	Category: Improvement (ID.IM) – The organization monitors and improves its cybersecurity processes across all functions  .
	•	ID.IM-01: Improvements are identified from evaluations (e.g. after action reviews, assessments)  .
	•	ID.IM-02: Improvements are identified from security tests and exercises (including those with suppliers/third-parties)  .
	•	ID.IM-03: Improvements are identified from operational practices (learning from day-to-day security operations)  .
	•	ID.IM-04: Incident response plans and other cybersecurity plans that affect operations are established, maintained, and improved (continuous refinement of plans)  .
	•	Function: PROTECT (PR) – “Safeguards to manage the organization’s cybersecurity risks are used.”  This Function covers protective measures and controls to ensure delivery of critical services.
	•	Category: Identity Management, Authentication, and Access Control (PR.AA) – Access to assets is limited to authorized users/devices, managed commensurate with risk  .
	•	PR.AA-01: Identities and credentials for authorized users, services, and devices are managed (account provisioning processes exist)  .
	•	PR.AA-02: Identities are proofed and bound to credentials based on context of interactions (identity verification procedures vary by risk of the action)  .
	•	PR.AA-03: Users, services, and devices are authenticated (authentication mechanisms like passwords, MFA are in place) .
	•	PR.AA-04: Identity assertions (claims about identity, such as tokens) are protected and verified in interactions .
	•	PR.AA-05: Access permissions and authorizations are managed and enforced, incorporating least privilege and separation of duties  .
	•	PR.AA-06: Physical access to assets is managed and protected commensurate with risk (badges, locks, etc., scaled to sensitivity)  .
	•	Category: Awareness and Training (PR.AT) – Personnel are trained so they can perform security tasks and be aware of risks  .
	•	PR.AT-01: All personnel are provided cybersecurity awareness education so they know how to perform general tasks securely  .
	•	PR.AT-02: Individuals in specialized security roles receive training so they have the knowledge/skills for their specific tasks  .
(Note: Additional PR.AT subcategories from CSF 1.1 such as PR.AT-3,4 on third-party stakeholders and executives may be incorporated, but CSF 2.0 focuses these two core outcomes.)
	•	Category: Data Security (PR.DS) – Data is managed consistent with risk to protect its confidentiality, integrity, availability  .
	•	PR.DS-01: Protections (e.g. encryption, access controls) are in place for data-at-rest  .
	•	PR.DS-02: Protections are in place for data-in-transit (e.g. network encryption, secure protocols)  .
	•	PR.DS-10: Protections are in place for data-in-use (e.g. memory encryption or strict access in processing)  .
	•	PR.DS-11: Backups of data are performed, protected, maintained, and tested (to ensure availability and integrity)  .
(Note: The numbering indicates PR.DS-03 through PR.DS-09 were moved or consolidated; PR.DS-10 and 11 correspond to data-in-use and backups in CSF 2.0.)
	•	Category: Platform Security (PR.PS) – Security of hardware, software (OS, firmware, applications), and services on platforms is maintained consistent with risk  .
	•	PR.PS-01: Configuration management practices are established and applied (baseline configurations, hardening of platforms)  .
	•	PR.PS-02: Software is maintained, upgraded, or removed as needed relative to risk (patch management and decommissioning)  .
	•	PR.PS-03: Hardware is maintained, upgraded, or removed as needed relative to risk (lifecycle management of devices)  .
	•	PR.PS-04: Logging is enabled on platforms and logs are made available for monitoring (ensuring audit logs exist for security events)  .
	•	PR.PS-05: Installation and execution of unauthorized software is prevented (application allowlisting, etc.)  .
	•	PR.PS-06: Secure software development practices are integrated and monitored through the SDLC (security in DevOps for in-house software)  .
	•	Category: Technology Infrastructure Resilience (PR.IR) – Security architectures and measures ensure resilience of networks and infrastructures, aligned with risk tolerance  .
	•	PR.IR-01: Networks and environments are protected from unauthorized logical access and usage (network segmentation, firewalls, etc.)  .
	•	PR.IR-02: Technology assets are protected from environmental threats (power loss, fire, flooding – e.g. UPS, climate control)  .
	•	PR.IR-03: Mechanisms are implemented to meet resilience requirements in normal and adverse situations (redundancies, failover, DR capabilities)  .
	•	PR.IR-04: Adequate resource capacity is maintained to ensure availability (capacity planning so that demand spikes or component failures don’t compromise services)  .
	•	Function: DETECT (DE) – “Possible cybersecurity events are proactively discovered.”  This Function covers activities to continuously monitor and detect anomalies and incidents.
	•	Category: Continuous Monitoring (DE.CM) – IT systems and assets are monitored to identify anomalous events and potential cybersecurity incidents  .
	•	DE.CM-01: Networks and network services are monitored for potentially adverse events (e.g. IDS sensors on network)  .
	•	DE.CM-02: The physical environment is monitored for intrusions or anomalies (e.g. badge access monitoring, CCTV alerts)  .
	•	DE.CM-03: Personnel activity and behavior on systems are monitored for suspicious events (e.g. user activity monitoring)  .
	•	DE.CM-06: External service provider activities are monitored for potential security events (monitoring of outsourced/cloud services)  .
	•	DE.CM-09: Computing infrastructure (hardware, software, runtime environments) and their data are monitored for anomalies (covers host-based and application monitoring)  .
(Note: Gaps in numbering indicate CSF 1.1 subcategories removed or reallocated; DE.CM-04,05,07,08 pertain to detection processes integrated into other subcategories or dropped.)
	•	Category: Adverse Event Analysis (DE.AE) – Detected anomalies and events are analyzed to understand their potential impact and whether they constitute actual incidents  .
	•	DE.AE-02: Detected events are analyzed to understand the nature of the activity (what happened, which systems involved)  .
	•	DE.AE-03: Information from multiple sources is correlated (e.g. logs from different systems are linked to see the full picture)  .
	•	DE.AE-04: The estimated impact and scope of events are determined (analysis identifies what data/processes were affected)  .
	•	DE.AE-06: Analysis results are provided to authorized staff and tools (so incident responders/tools get the info promptly)  .
	•	DE.AE-07: Cyber threat intelligence and context are integrated into analysis (enriching understanding of events with external threat data)  .
	•	DE.AE-08: Incidents are defined/declared when adverse events meet defined criteria (clear criteria exist for declaring an incident)  .
(Numbering suggests DE.AE-01 (anomaly detection baseline) and DE.AE-05 (incident triage) were altered or removed in CSF 2.0.)
	•	Function: RESPOND (RS) – “Actions regarding a detected cybersecurity incident are taken.”  This Function covers being prepared to respond and executing response activities when an incident occurs to mitigate impact.
	•	Category: Incident Management (RS.MA) – Response activities are coordinated and managed to contain the incident  .
	•	RS.MA-01: The incident response plan is executed with relevant third parties once an incident is declared (following plan coordination)  .
	•	RS.MA-02: Incident reports (alerts) are triaged and validated (ensuring reported issues are confirmed incidents)  .
	•	RS.MA-03: Incidents are categorized and prioritized (according to severity/impact levels)  .
	•	RS.MA-04: Incidents are escalated as needed (if criteria met, they’re elevated to higher management or outside support)  .
	•	RS.MA-05: Criteria for initiating recovery are applied (knowing when to invoke disaster recovery/business continuity)  .
	•	Category: Incident Analysis (RS.AN) – In-depth analysis is performed on incidents to inform effective response and support forensics/recovery  .
	•	RS.AN-03: Analysis is performed to determine what happened during the incident and the root cause (forensic analysis)  .
	•	RS.AN-06: All actions taken during investigation are recorded, with integrity and provenance preserved (chain-of-custody for evidence)  .
	•	RS.AN-07: Incident data and metadata are collected and preserved with integrity (ensuring evidence isn’t tampered)  .
	•	RS.AN-08: The incident’s magnitude (scope, severity) is estimated and validated (so the org knows the overall impact)  .
(Gaps indicate RS.AN-01,02,04,05 likely removed or merged. The included ones focus on analysis and evidence.)
	•	Category: Incident Response Reporting and Communication (RS.CO) – Response activities are coordinated with stakeholders (internal and external) consistent with obligations  .
	•	RS.CO-02: Internal and external stakeholders are notified of incidents (appropriate notifications occur)  .
	•	RS.CO-03: Information is shared with designated stakeholders (e.g. law enforcement, regulators, affected customers, as required)  .
(RS.CO-01,04, etc., might have been re-scoped in CSF 2.0. The ones listed emphasize communication.)
	•	Category: Incident Mitigation (RS.MI) – Activities are performed to prevent incident expansion and resolve its effects  .
	•	RS.MI-01: Incidents are contained (stopping the spread to other systems, isolating affected components)  .
	•	RS.MI-02: Incidents are eradicated (malware removed, compromised accounts disabled, etc.)  .
(RS.MI-03+ might cover other mitigation like system restoration which flows into Recover. Here focus is on contain and eliminate threat.)
	•	Function: RECOVER (RC) – “Activities are maintained to restore any capabilities or services impaired by cybersecurity incidents.”  This Function covers post-incident recovery and improvements.
	•	Category: Incident Recovery Plan Execution (RC.RP) – Recovery plans are executed to restore systems and data affected by incidents  .
	•	RC.RP-01: The recovery phase of the incident response plan is executed when initiated from incident response (transition from response to recovery is smooth)  .
	•	RC.RP-02: Recovery actions are selected, prioritized, and performed (restore in a structured, prioritized way) .
	•	RC.RP-03: Integrity of backups and other restoration assets is verified before use (to ensure clean recovery media)  .
	•	RC.RP-04: Critical business functions and cybersecurity risk considerations inform the establishment of post-incident normal operations (maybe decide if any interim controls needed post-incident)  .
	•	RC.RP-05: Integrity of restored systems is verified and systems/services are confirmed back to normal operation  .
	•	RC.RP-06: The end of recovery is formally declared based on criteria, and incident documentation is completed (ensuring a formal closure and record)  .
	•	Category: Incident Recovery Communication (RC.CO) – Restoration activities are coordinated with internal and external parties to manage expectations and comply with obligations .
	•	RC.CO-03: Recovery progress and status of restoring services are communicated to stakeholders (internal leadership, customers, etc.)  .
	•	RC.CO-04: Public communications about incident recovery are conducted using approved messaging (PR/communications aspect)  .
(Likely RC.CO-01 (communications planning) and RC.CO-02 (roles for comms) might be repositioned in CSF 2.0 or considered inherent.)
Hierarchy and Identification: Each Subcategory above is identified by a unique code (Function.Category-##). The codes and naming follow CSF 2.0’s official taxonomy  . Gaps in numbering (non-sequential Subcategory IDs) are intentional and stem from changes between CSF 1.1 and 2.0 (some Subcategories were relocated or retired, hence missing numbers) . Compliance AI’s data model will include all these Functions, Categories, and Subcategories to ensure complete coverage.
For quick reference, Table 1 below summarizes the CSF 2.0 Functions and Category identifiers (as given by NIST  ):
Function	Category Name	Category ID
Govern (GV)	Organizational Context	GV.OC
 	Risk Management Strategy	GV.RM
 	Roles, Responsibilities & Authorities	GV.RR
 	Policy	GV.PO
 	Oversight	GV.OV
 	Cybersecurity Supply Chain Risk Management	GV.SC
Identify (ID)	Asset Management	ID.AM
 	Risk Assessment	ID.RA
 	Improvement	ID.IM
Protect (PR)	Identity Mgmt., Authentication & Access Control	PR.AA
 	Awareness and Training	PR.AT
 	Data Security	PR.DS
 	Platform Security	PR.PS
 	Technology Infrastructure Resilience	PR.IR
Detect (DE)	Continuous Monitoring	DE.CM
 	Adverse Event Analysis	DE.AE
Respond (RS)	Incident Management	RS.MA
 	Incident Analysis	RS.AN
 	Incident Response Reporting & Communication	RS.CO
 	Incident Mitigation	RS.MI
Recover (RC)	Incident Recovery Plan Execution	RC.RP
 	Incident Recovery Communication	RC.CO
(The above reflects 6 Functions, 22 Categories in CSF 2.0 as updated , with a total of 106 Subcategories in this list. Compliance AI will reference this structure for assessment coverage.)
4.2 Implementation Tiers
NIST CSF 2.0 defines Implementation Tiers as a way to characterize an organization’s integration of cybersecurity risk management practices. The four Tiers – Tier 1: Partial, Tier 2: Risk-Informed, Tier 3: Repeatable, and Tier 4: Adaptive – represent a progression from informal, reactive approaches to more formalized, agile, and risk-driven practices . These tiers are not strictly “maturity levels” but rather describe how well cybersecurity is woven into enterprise risk management and culture. Compliance AI’s scoring model aligns with these tiers, so understanding their official definitions is important:
	•	Tier 1: Partial – Cybersecurity risk management is ad hoc and siloed. There is little organization-wide awareness of cybersecurity risks. Practices are reactive and implemented inconsistently (if at all). Defining characteristics: Minimal or no formal processes; cybersecurity activities are not aligned with business drivers or risk objectives. For example, some departments might have security measures but others have none, and there’s no central coordination. Typical Behaviors: Issues are dealt with as they arise, often after incidents occur. There is dependence on individual heroes rather than policies. Evidence Indicators: Lack of documented policies or procedures, no formal risk assessment process, and no management oversight of cybersecurity. If asked, different managers have different understandings (or no understanding) of security responsibilities. (This corresponds to “security is not institutionalized” – often only tech personnel care about it)  .
	•	Tier 2: Risk-Informed – The organization has awareness of cybersecurity risks at least in some parts, and management is involved to a degree. Some formal practices exist, but they might not be organization-wide. Defining characteristics: Management has approved certain risk management practices or policies, but they are not consistently implemented across all departments . Teams or business units may be making decisions with risk in mind, but without enterprise-wide standards. Typical Behaviors: There are pockets of good practice. For instance, IT might classify data and handle it accordingly, but other units might not follow the same rigor. Policies exist but may be incomplete or not enforced everywhere. Cyber risk considerations might be included informally in projects. Evidence Indicators: Existence of policy documents or risk assessment procedures, but uneven adoption. Some risk assessments are done for critical systems but not all. Cybersecurity is still not fully integrated into enterprise risk governance; it might be seen as an IT issue. However, if asked, key managers are aware of major cyber risks and there is at least a process to discuss them at management meetings  .
	•	Tier 3: Repeatable – Cybersecurity practices are formally established, documented, and consistently implemented across the organization. This is often considered a “managed” or “defined” level of maturity. Defining characteristics: The organization has institutionalized cybersecurity: policies, processes, and procedures are in place and actively used. There is organization-wide awareness and governance of cyber risks. Activities are repeatable in the sense that if different people execute them, they would achieve similar results because of standard procedures . Typical Behaviors: Regular risk assessments occur; cybersecurity is part of change management and procurement; roles are clearly defined and training is in place. Governance structures (like risk committees) review cybersecurity performance periodically. Evidence Indicators: Documented procedures for all major activities (access control, incident response, etc.), and records showing these procedures are followed. For example, change management tickets all have a security review step. Metrics/KPIs may be collected (like number of incidents, time to patch systems). Compliance requirements are met consistently. Importantly, the organization can measure its cybersecurity performance and adjust (showing a feedback loop). The presence of internal audits or continuous control testing can be evidence of Tier 3. NIST describes this as having risk management processes and activities that are “regularly updated based on changes in business/requirements and threat landscape” .
	•	Tier 4: Adaptive – Cybersecurity risk management is embedded in the organizational culture and is highly adaptive, with a continuous improvement approach. At Tier 4, the organization not only has repeatable processes, but it actively uses lessons learned and predictive indicators to evolve its practices  . Defining characteristics: Cybersecurity is a top-of-mind consideration in all business decisions; the organization can quickly adapt to new threats or changes. Executives view cyber risk as equal to other business risks – monitoring it in real time  . There is a robust feedback loop where after any incident or near-miss, practices are updated. Advanced technologies (automation, analytics) are leveraged to anticipate events. Typical Behaviors: The organization performs continuous monitoring and improvement. For example, threat intelligence is ingested in real-time to adjust controls. If a new zero-day vulnerability emerges, the organization rapidly responds and updates its defense before an incident occurs. Cross-organization information sharing is practiced; cybersecurity considerations extend to suppliers and partners with real-time collaboration  . The org might run chaos engineering or simulations to test resilience regularly. Evidence Indicators: A strong indicator is that the organization’s cybersecurity spending and strategy are risk-driven and forward-looking – budgets are allocated based on predicted future risks, not just past incidents  . There will be evidence of continuous learning: e.g. post-incident review reports that led to changes in policy within weeks; adoption of new security technologies to address emerging threats (like zero trust architectures or AI-based detection). Tier 4 organizations often integrate threat intelligence, conduct regular red team exercises, and have metrics that show reduction in response times. They also ensure third-party risks are managed in real-time (with continuous assessments of critical suppliers) . Essentially, cybersecurity is a living process, and the organization can pivot quickly as the risk environment changes  .
Compliance AI uses these Tier definitions as a foundation for its scoring rubric. During an assessment, each CSF Subcategory (or aggregate Category/Function) will be assigned a tier or a numeric score corresponding to these tier levels. The tool will consider the defining characteristics and evidence associated with each tier when evaluating responses and documentation:
	•	Tier 1 evidence might be absence of formal process, reliance on heroics.
	•	Tier 2 evidence might be existence of policies but inconsistent execution.
	•	Tier 3 evidence is consistent execution with documentation and governance oversight.
	•	Tier 4 evidence is continuous improvement, advanced practices, and integration into culture.
By explicitly mapping our scoring criteria to these characteristics, we ensure the maturity ratings provided by Compliance AI are both explainable and aligned with NIST’s intent. For example, if an organization scores Tier 2 for a Category, the report will explain it has some structured practices but they are not enterprise-wide (matching NIST’s definition) .
It is important to note that NIST CSF Tiers are not strictly linear checklists but high-level portraits. Many organizations might not cleanly fit one tier for all aspects. Compliance AI will allow variability (you might be Tier 3 in one function and Tier 2 in another). This nuance will be captured in our scoring outputs, but overall Tier definitions serve as target states.
Summary of Tier Indicators:
	•	Tier 1 (Partial): Informal, reactive, no organization-wide management of cyber risk. Little to no documentation or consistent processes .
	•	Tier 2 (Risk-Informed): Some formalization; management awareness exists; practices not standardized across all silos .
	•	Tier 3 (Repeatable): Formal policies and processes organization-wide; consistent implementation; regular review and improvement integrated .
	•	Tier 4 (Adaptive): Cybersecurity is part of culture; organization continuously adapts; uses real-time info and lessons learned to evolve practices  .
These tiers will be referenced in the assessment report to contextualize the organization’s maturity. For example, the report might state: “Overall, the organization is assessed at Tier 2 (Risk-Informed), meaning some risk management practices are in place but they are not consistently implemented across the enterprise . Achieving Tier 3 would require formalizing and standardizing these practices enterprise-wide and ensuring they are repeatable and regularly updated .”
4.3 Framework Mapping Requirements
An essential capability of Compliance AI is to map an organization’s internal controls and policies to the NIST CSF 2.0 framework requirements. This mapping is fundamental to identify coverage and gaps. The system must accommodate the complexity of real-world control frameworks, where relationships are rarely one-to-one. Key requirements for the mapping engine include:
	•	Subcategory-Level Granularity: All mappings shall be established at the CSF Subcategory level (the most granular outcome). Each internal control or policy will be linked to one or more CSF Subcategories that it supports or fulfills. This granularity is necessary because Categories and Functions are too broad for precise gap analysis. By mapping to Subcategories (e.g., PR.DS-01 “data-at-rest protection”), we can clearly see if that specific outcome is addressed . The application will maintain a repository of all CSF Subcategories (as listed in section 4.1) and use those as the target points for mapping.
	•	Many-to-Many Relationships: The mapping engine must support fully many-to-many relationships:
	•	One internal control may map to multiple CSF Subcategories. For example, an “Access Control Policy” control might map to PR.AA-01 (identities managed), PR.AA-05 (permissions managed with least privilege), and PR.PS-05 (unauthorized software prevented) if it covers aspects of all. Similarly, a Security Operations Center control could map to subcategories in Detect and Respond Functions. The system should allow linking a single control record to any number of relevant Subcategories.
	•	One CSF Subcategory may be addressed by multiple internal controls. Security outcomes often require layers of controls. For instance, subcategory DE.CM-01 (network monitoring) might be fulfilled by an IDS system control, a managed SOC service, and network device logging configurations collectively. The mapping model should allow a Subcategory to have many controls associated with it. This is crucial for accurately reflecting coverage – if any one control is removed, there might still be partial coverage by others, or one control alone may not suffice to fully meet the outcome.
	•	Similarly, policies (which are high-level documents) can map to multiple subcategories, and subcategories can be covered across multiple policies. For example, an “Information Security Policy” might address elements of governance and protect functions, while a specific “Access Control Standard” addresses PR.AA subcategories.
	•	Partial Mapping and Coverage Indication: The system should allow partial mappings or degrees of coverage to be indicated. Not all controls fully satisfy a subcategory outcome. For example, an organization might have a control that covers data encryption for laptops but not for servers, partially meeting PR.DS-01. While MVP scoring is qualitative, the mapping interface or logic should acknowledge partial coverage. This may be achieved by letting assessors mark a mapping as “fully,” “partially,” or “not” addressed by a given control/policy, or by linking multiple controls to cover one subcategory (implying individually they are partial). For the MVP, a simple approach is to highlight subcategories that have at least one control vs. those with none. However, in analysis, the system will treat a subcategory with incomplete coverage as a deviation (gap) even if some controls exist. We might represent partial coverage by noting in the deviation description which aspects are missing.
	•	Policy-to-Control and Control-to-Framework Linkage: Many organizations first map their internal policies to external frameworks (to ensure all required topics are addressed in policy), and separately ensure controls implement those policies. Compliance AI should facilitate mapping at both levels:
	•	Policy to Subcategory mapping: E.g., a “Data Protection Policy” might map to PR.DS-01, PR.DS-02, etc. If a subcategory is not referenced by any policy, that’s a policy-level gap.
	•	Control to Subcategory mapping: E.g., an “Encryption Control Procedure” maps to PR.DS-01. If a subcategory has no implemented controls, that’s a control gap.
	•	The system should relate these mappings. Ideally, if a policy is mapped to a subcategory but no control is, it signals a gap between governance and implementation. Conversely, if a control exists without a corresponding policy, that might indicate an undocumented practice. MVP requirement is to capture both mapping sets and let the analysis logic compare them for such inconsistencies.
	•	Therefore, policy-control association should be captured. A policy may be implemented via certain controls. In the data model, this could be an explicit link (e.g., a control record might reference the policy it stems from). This helps with deviation detection (checking alignment of control design with policy statements).
	•	Handling Unmapped Items: The system must gracefully handle items that do not map:
	•	Unmapped Subcategories: If a CSF Subcategory has no internal control or policy mapped, the system flags it as a gap (no coverage). For MVP, an unmapped subcategory is a clear deviation – meaning the organization is not addressing that cybersecurity outcome at all. The output should list these explicitly: e.g. “DE.CM-02 (Physical environment monitoring) – No controls or policies found addressing this outcome; potential blind spot.”
	•	Unmapped Controls/Policies: If an internal control or policy doesn’t map to any CSF Subcategory, the system should alert the user because that might indicate either a mapping oversight or that the control is out-of-scope relative to NIST CSF. For example, maybe the organization has a control for something not in CSF (like physical safety). The user can decide if it’s truly out-of-scope or if it should map somewhere. While not a “deviation” in compliance terms (it could be a control beyond CSF requirements), it is useful to identify unmapped items to maintain completeness and possibly suggest mapping to other frameworks in future. MVP might simply report “X controls/policies were not mapped to CSF; review if they are relevant or extra-framework.”
	•	Many-to-One Overlap: Conversely, if multiple controls map to the same subcategory, the system should handle overlap. It’s not necessarily a problem (defense in depth), but the assessment should ensure that more controls doesn’t automatically equal better scoring unless they each add value. For scoring, perhaps having at least one well-designed control is sufficient to mark a subcategory as addressed. Additional controls could be noted as complementary but typically the highest maturity requires comprehensive coverage (which multiple controls could contribute to). The mapping repository will simply hold all linkages, and the maturity algorithm will interpret coverage sufficiency.
	•	Informative References and Alternatives: The mapping engine should be built to accommodate NIST’s concept of Informative References (i.e., mappings to other standards like ISO 27001, COBIT, 800-53). While MVP does not require mapping to those, the internal design should not preclude it. Essentially, each CSF Subcategory can link to any number of references or controls. In future, this could include regulatory citations. For now, ensure the data model allows storing multiple mapping entries per subcategory.
	•	User Review and Override: Since AI will generate initial mapping suggestions (see Section 5.2), the mapping requirements include a manual review step. Users must be able to adjust mappings, e.g. confirm, add, or remove links that the AI proposes. This means the mapping UI should present suggested mappings with confidence scores (for AI-suggested ones) and allow the Compliance Manager (or consultant) to accept or reject each. It should also allow creating new mappings manually if the AI missed something (e.g., user can search for a control and map it to an additional subcategory).
	•	Versioning and Traceability: Each mapping decision should be traceable. If a user changes a mapping (or marks it partial), the system should record that action. This is important to maintain the integrity of the assessment: an auditor should be able to later see the rationale of what was mapped where. This could be a comment or note on each mapping, or a status like “AI-suggested, user approved” vs “user added mapping.”
Summary: The mapping practice in Compliance AI will reflect real-world compliance mapping challenges. It handles the complexity that one internal control can satisfy multiple framework requirements, and one requirement often needs multiple controls  . By capturing this many-to-many web, the product can highlight gaps (requirements with no controls) and overlaps (areas possibly over-controlled or needing rationalization). The system’s flexibility in mapping granularity and partial mappings ensures that assessments are nuanced and accurate, rather than binary checkbox compliance.
For example, if an organization has three controls (policies, processes) all mapping to ID.AM-01 (hardware inventory) but the inventory still misses some devices, the tool can capture that scenario: The existence of controls maps to ID.AM-01, but the interview might reveal it’s incomplete – leading to a partial compliance note. Conversely, if no control maps to DE.CM-09 (monitoring of apps and data), the mapping engine flags DE.CM-09 as an unmapped subcategory, generating a deviation: “No monitoring in place for computing environments” – prompting immediate attention.
In conclusion, comprehensive mapping capabilities in Compliance AI ensure that the foundation of the assessment – knowing what internal practices correspond to each CSF outcome – is solid. This is crucial for everything else (scoring, gap detection, reporting) to be accurate and trustworthy.
5. FUNCTIONAL REQUIREMENTS
The Functional Requirements are organized by major capability areas of Compliance AI. Each requirement is labeled with a unique identifier for traceability. The format is FR-[Area]-[Number] (e.g., FR-ING-001 for an ingestion requirement). For each requirement, we provide a clear description, acceptance criteria, priority, and any dependencies. Priorities are defined as: P0 = Must-have for MVP, P1 = Should-have for MVP if possible, P2 = Future / not in MVP.
5.1 Data Ingestion
This section covers requirements for ingesting user-provided data into Compliance AI, including control inventories, policy documents, and prior assessment artifacts.
5.1.1 Control Spreadsheet Ingestion
	•	FR-ING-001: Supported Control File Formats
Requirement: The system shall support ingestion of control inventory files in common spreadsheet formats, specifically CSV and Excel (XLSX).
Acceptance Criteria: Users can upload a .csv file or an .xlsx file through the UI. The file is parsed successfully, and control records are created in the system. Attempting to upload an unsupported format (e.g. PDF or JSON) should result in a clear error message: “Unsupported file format. Please provide CSV or Excel.”
Priority: P0 (essential – primary input method).
Dependencies: None specific (base file upload functionality, platform ability to parse CSV/XLSX).
	•	FR-ING-002: Required Column Schema
Requirement: The control spreadsheet must adhere to a defined schema (column structure) for successful ingestion. At minimum, the required columns are:
	•	Control Identifier (unique ID or name)
	•	Control Description
	•	Control Owner (name or role)
	•	Control Type/Domain (optional categorization, e.g. technical, administrative – if provided)
	•	Related Policy (optional reference to a policy name or ID)
	•	Current Implementation Status (optional, e.g. “Implemented”, “Planned” – can default if missing)
The system shall validate that at least “Control Identifier” and “Control Description” columns are present.
Acceptance Criteria: If a user uploads a spreadsheet missing required headers, the system rejects the file and provides feedback listing missing columns (e.g., “Upload failed: ‘Control Description’ column not found”). If the columns exist but are named slightly differently, the system attempts a tolerant match (e.g., “Control Name” can map to “Control Identifier”). Successful ingestion means each row becomes a control entity in the system with fields populated accordingly. The system should log or display how many controls were ingested.
Priority: P0.
Dependencies: None (just schema definition available to users via template or documentation).
	•	FR-ING-003: Data Validation Rules for Controls
Requirement: During ingestion, the system shall validate data integrity for each control record:
	•	Control Identifier must be unique (if a duplicate ID is found in the file or already existing, the system flags it).
	•	Control Owner field, if present, should match an existing user or allow creation of a placeholder (depending on design, possibly just store as text if not linking to user directory in MVP).
	•	No required fields are empty (Identifier and Description cannot be blank).
If validation fails for any row, the system will skip that row and report it to the user with a meaningful error (e.g., “Row 5: missing control description; not imported”).
Acceptance Criteria: Test by uploading a file with a known duplicate ID and a missing description. The system should import all valid rows, skip the invalid ones, and present a summary: e.g. “48 controls imported successfully. 2 controls failed import.” with details per failure. The unique constraint can be case-insensitive if needed, and allow override if user explicitly chooses (but MVP can simply enforce uniqueness).
Priority: P0.
Dependencies: Basic data model for controls in place.
	•	FR-ING-004: Error Handling & User Feedback
Requirement: The system shall provide clear, actionable feedback on ingestion errors. This includes:
	•	File format not recognized -> “Unsupported format” (as in FR-ING-001).
	•	Schema mismatch -> list of expected vs found columns.
	•	Validation errors -> row-specific messages.
	•	If the entire process fails (e.g., file corrupt), a general message with suggestion (like “Please check the file format or use the template provided”).
The UI should display these messages, and in case of multiple errors, allow the user to download an “error report” (e.g. CSV listing rows and error reasons) for large files.
Acceptance Criteria: Simulate an import with multiple issues. The interface shows a summary of errors with enough detail for the user to correct their file. For example: a modal or results page listing “Errors: Row 10 – Duplicate Control ID ‘AC-1’ (already exists); Row 12 – Missing Control Description; Row 20 – Unknown column ‘Control Owne’ (did you mean ‘Control Owner’?).” The presence of an error report download (P1 feature possibly) is verified if within scope.
Priority: P0 for basic on-screen feedback; P1 for downloadable error detail if large number of issues.
Dependencies: Ingestion parsing logic, UI framework for notifications.
	•	FR-ING-005: Mapping to Internal Data Model
Requirement: The ingestion process shall map each column to the internal data model attributes of the Control entity. For example:
	•	Control Identifier -> Control.Name or ID field.
	•	Description -> Control.Description.
	•	Owner -> Control.Owner (could link to a User entity or store the string).
	•	Related Policy -> an association to Policy entity by name/ID if that policy already exists in system (or create a placeholder entry to be reconciled after policy ingestion).
	•	Implementation Status -> a field indicating if control is fully implemented, partially, or planned (could be used later in scoring).
The requirement is that after ingestion, the controls are accessible in the system with all provided metadata correctly stored.
Acceptance Criteria: After ingesting a sample file, query the database (or via UI list of controls) to ensure that each field from the file appears in the control’s details. If a control references a policy “InfoSec Policy v1”, and that policy was not yet uploaded, the system should still capture the text and perhaps mark it as unresolved link (MVP can treat it just as text attribute until a policy of that name is ingested, at which point it could auto-link if names match – that auto-link is nice to have, perhaps P1). The mapping logic should handle data types (e.g. if owner is an email and our User entity uses email as key, link them).
Priority: P0.
Dependencies: Defined Control entity model; Policy entity for linking if implemented (see Policy ingestion requirements).
5.1.2 Policy Document Ingestion
	•	FR-ING-006: Supported Policy File Formats
Requirement: The system shall support ingestion of policy and procedure documents in common text-based formats: at minimum PDF, DOC/DOCX, and plain text (TXT/Markdown). This allows organizations to upload their written policies for analysis.
Acceptance Criteria: Users can upload a PDF or Word document of a policy. The system processes it without error (assuming it’s not encrypted/password-protected). If a file is an image scan PDF (non-OCRed), the system should attempt OCR or at least warn that text could not be extracted (perhaps an advanced feature; MVP can require text-based PDFs). The text content of the policy is stored (or indexed) for analysis. Unsupported formats (e.g. an image or PPT) produce a friendly error: “Unsupported file type for policy ingestion.”
Priority: P0 for PDF and DOCX; (TXT/MD are simpler so included).
Dependencies: Integration or library for reading PDF and Word content (which could be via open-source libraries or cloud API if allowed internally).
	•	FR-ING-007: Document Parsing and Text Extraction
Requirement: Upon uploading a policy document, the system shall parse the file and extract its text content in a structured way. This includes:
	•	Capturing the document title (perhaps from the filename or metadata).
	•	Full text extraction for analysis (the AI mapping engine will need this).
	•	Basic segmentation: splitting into sections/paragraphs if possible, to help context for mapping (optional, AI might do it on the fly).
The parser should handle common formatting gracefully (headers, footers repeated on pages can be ignored if possible).
Acceptance Criteria: When a known sample policy (with multiple pages, headings, etc.) is ingested, the system’s internal representation stores the correct text. The system might show a preview of the text or key metadata (like number of pages, number of words) to confirm successful parsing. For instance, a 10-page PDF results in ~5000 characters of text stored, matching the original content (verified by spot-checking a unique phrase). If parsing fails (corrupted PDF), an error is given to user.
Priority: P0 – core to mapping.
Dependencies: Text extraction libraries, possibly OCR if needed (could be P1 to do OCR for image-based PDFs; MVP can specify text-based docs only).
	•	FR-ING-008: Metadata Extraction for Policies
Requirement: The system shall extract or allow input of metadata for each policy document, including:
	•	Policy Name/Title (if not auto-detected, user may input).
	•	Policy Version or Date (if present in doc or file name).
	•	Policy Owner/Department (could be deduced from a cover page or manually tagged by user post-upload).
	•	Scope or Category (e.g., “Access Control Policy” might be categorized under “Protect > PR.AA” domain by user tagging).
	•	Any tags or keywords (optionally via AI scanning important terms).
This metadata will assist in mapping and report generation (like referencing policy by name). Possibly the system prompts user to fill some metadata after uploading, especially if the file name is not clear.
Acceptance Criteria: After uploading a policy document, the UI shows a form or auto-filled fields: e.g., “Title: Access Control Policy”, “Effective Date: 2023-01-01” (maybe found in doc header), “Owner: CIO Office” (perhaps user enters this). The user can accept or edit these before finalizing the ingestion. If a date or version isn’t found, that field remains blank and optional. Saving the policy record stores these attributes. In subsequent mapping steps, the policy is identifiable by this metadata (e.g., showing its title in mapping suggestions).
Priority: P1 (nice-to-have in MVP to capture these systematically; minimum could be just title).
Dependencies: UI workflow for file upload that can accommodate additional input, potential natural language processing to find title/date in text.
	•	FR-ING-009: Policy-to-Control Association
Requirement: The ingestion process should establish links between policies and controls if such relationships are provided or easily inferred. Specifically, if a control record (from FR-ING-005) referenced a policy name that matches a policy document just ingested, the system shall link them. Likewise, if within a policy text certain control IDs are mentioned (less likely), it could hint at mapping. Primarily:
	•	If “Related Policy” field in control matches the title or identifier of an ingested policy, mark that control as associated with that policy.
	•	The system should allow multiple controls to be linked to one policy and vice versa.
This association is used later for checking consistency (e.g., if policy says X must be done, do controls exist to do X?).
Acceptance Criteria: Suppose we ingest a control spreadsheet where Control #5 has “Access Control Policy” in the Related Policy column. Later, the user uploads a policy document and titles it “Access Control Policy”. The system should recognize the name match and link Control #5’s Policy field to this Policy entity (rather than just text). In the UI, Control #5 details would show a link to “Access Control Policy” document. If a match is not found, it remains unlinked text (and maybe appear in a list of orphan references). Successful criteria: At least simple exact name matching should link one, and multiple controls referencing the same policy all link to that one policy record.
Priority: P1 (convenience and important for deviation checks, but not strictly required if user can manually link after).
Dependencies: Policy and Control entities exist; a matching algorithm for names (maybe case-insensitive, ignoring punctuation).
	•	FR-ING-010: Multi-Policy Document Handling
Requirement: In case a single uploaded file contains multiple policies (e.g., a consolidated manual with several policy sections), the system shall support either:
	•	Splitting it into multiple “Policy” records, or
	•	Treat it as one composite policy and still map accordingly.
For MVP, the simpler approach is to treat each file as one policy record. If the user has multiple policies in one document, they might need to either separate them or the system can handle mapping by section internally. Possibly mark sections with headings as distinct policy segments (P2-level complexity).
Acceptance Criteria: MVP: Document with multiple policies is ingested as one record. The user can manually add multiple mappings from that one record to various subcategories. There is no corruption in analysis (the AI can still identify relevant parts for each subcategory during mapping). If we aim for splitting (P2 perhaps), acceptance would be the user is prompted like “This document contains multiple policy sections. Do you want to create separate policy entries for each section?” For MVP, likely skip automatic splitting due to complexity.
Priority: P2 (not addressed in MVP, assume one policy per file).
Dependencies: NLP for automatically detecting distinct policies (which is complex).
5.1.3 Prior Assessment Artifact Ingestion (Optional)
(This is marked as optional; likely P2, but we outline in case it’s considered.)
	•	FR-ING-011: Prior Assessment Import Formats
Requirement: The system may allow importing data from previous assessments, for example if the organization has a last-year NIST CSF assessment results in a structured form (CSV, Excel, or a proprietary export). Supported format could include a CSV mapping of Subcategory -> prior score, and a list of prior deviations. Another format might be an Excel questionnaire they used. Define at least one format for MVP:
	•	Perhaps a CSV with columns: Subcategory, Prior Tier (or score), Prior Comments.
The system shall parse this and attach it to the current assessment for comparison.
Acceptance Criteria: Given a prior assessment CSV (with subcategory IDs matching CSF and a score 1-4), the system can read it and store the values. A successful import means the system knows, for each subcategory, what the previous assessment score was (if provided). If the file is misformatted or has unknown subcategory IDs, errors are shown (like FR-ING-004 style).
Priority: P2 (nice for historical comparison, but MVP might skip due to focus).
Dependencies: The notion of multiple assessments and comparisons in data model.
	•	FR-ING-012: Extraction of Key Data from Prior Reports
Requirement: If a prior assessment is provided as a document (e.g., a PDF report by a consultant), the system could attempt to extract key findings automatically. This would involve NLP to find statements of gaps or scores. For MVP this is likely out of scope. Possibly just store the prior report as an attachment for reference.
Acceptance Criteria: (If implemented) The system highlights say 10 deviation descriptions from the prior report text. But given complexity, likely not met.
Priority: P2 (beyond MVP’s likely capabilities).
Dependencies: Advanced NLP, not planned.
	•	FR-ING-013: Use of Prior Data in Current Assessment
Requirement: Any imported prior assessment data should be available to influence or inform the current assessment. For example:
	•	The maturity scoring engine may show last year vs this year for each category.
	•	If prior deviations are imported, the system can check if they were addressed (maybe by seeing if a gap still exists).
At MVP, a simple use-case: display previous scores next to current scores in the report for context.
Acceptance Criteria: After importing prior scores, when generating the final report, an optional section shows something like “Previous Assessment (2024): Identify Function Tier 2, Protect Tier 2, … Current Assessment (2025): Identify Tier 3, … Improvement: +1 in Identify.” Or at least that data is accessible. If a deviation was previously identified and now is not present, the tool could mark it as “resolved since last assessment”. These are more advanced, so might be manual analysis by user if not automated.
Priority: P2.
Dependencies: Score calculation (present vs prior), UI elements for comparison.
(In summary, 5.1.3 is likely skipped in MVP scope or limited to storing a reference to prior results manually. We include it for completeness with P2 priority.)
5.2 Framework Mapping Engine
This section describes how Compliance AI automatically maps policies and controls to the NIST CSF framework using AI, and how it identifies gaps in mappings.
5.2.1 Automated Policy-to-Framework Mapping
	•	FR-MAP-001: AI Analysis of Policy Documents
Requirement: The system shall utilize an AI (likely an NLP model) to analyze the text of each ingested policy document and suggest which NIST CSF 2.0 Subcategories the policy addresses. This involves scanning for keywords, phrases, and context in the policy text that align with CSF outcomes. For example, if a policy contains statements about access control and account management, the AI should flag subcategories like PR.AA-1 (identities managed) and PR.AA-5 (least privilege) as relevant . The AI should consider synonyms and semantic meaning, not just exact terms (e.g., “contingency planning” might link to Recover function subcategories).
Acceptance Criteria: Given a sample “Access Control Policy” document, the AI outputs a list of suggested subcategories, e.g., [PR.AA-01, PR.AA-02, PR.AA-05] with reasoning like “Policy section 4 describes account issuance and password rules (relevant to PR.AA-1, PR.AA-3, etc.).” The suggestions appear in the UI for user review under that policy’s mapping section. They should cover main applicable subcategories and avoid irrelevant ones (e.g., it wouldn’t flag something unrelated like DS (Data Security) if not mentioned). If the policy is broad (like an InfoSec policy), multiple categories across Functions may be suggested. This is considered acceptable if logical.
Priority: P0 (core value to reduce manual mapping).
Dependencies: Availability of an NLP/LLM model fine-tuned or prompted on CSF subcategory definitions  and common policy language; Policy text must be ingested (FR-ING-007).
	•	FR-MAP-002: Suggested Mappings with Confidence Scores
Requirement: For each policy-to-subcategory mapping proposed by AI, the system shall provide a confidence score or level (e.g., High, Medium, Low or a percentage) indicating how likely the mapping is correct. This helps the user prioritize which suggestions to accept or review carefully. The confidence might be based on factors like keyword match frequency, context strength, or model prediction probability.
Acceptance Criteria: In the UI, next to each AI-suggested mapping, a confidence indicator is visible. For instance, “PR.DS-02 (Data-in-transit protection) – Confidence: 0.8 (High) – rationale: found ‘encrypt data in transit via TLS’ in policy text.” Another mapping might say “ID.AM-05 (Asset prioritization) – Confidence: 0.4 (Low) – rationale: guessed from mention of critical assets but unsure.” The actual numeric or qualitative display is defined (e.g., >0.75 = High, 0.4-0.75 = Medium, <0.4 = Low). The acceptance criteria is that users can clearly see which mappings the AI is sure about and which are borderline.
Priority: P0 (improves user trust and efficiency).
Dependencies: The AI model or algorithm must output a confidence measure.
	•	FR-MAP-003: Human Review & Approval Workflow
Requirement: The system must allow a human (Compliance Manager or consultant persona) to review AI-suggested policy mappings and either approve, modify, or reject them:
	•	Approve: confirms that the policy indeed maps to that Subcategory (the mapping is marked as confirmed).
	•	Reject: indicates the suggestion was incorrect or not applicable (mapping is not used).
	•	Modify: possibly to adjust if AI got Subcategory slightly wrong; e.g., the user might remove one subcategory and add a different one for a section of policy. Or if partial mapping, user could annotate (if supported).
The UI should present an intuitive interface (like a checklist or an editable list). After reviewing, the final set of policy->subcategory mappings is saved.
Acceptance Criteria: For a given policy, suppose AI suggests 5 mappings. The user interface shows these with checkboxes or an approve/reject toggle. The user rejects 1 that is clearly wrong, edits 1 suggestion (maybe the AI flagged GV.SC-02 but user thinks it’s GV.SC-03 – they should be able to change the subcategory code), and approves the rest. The system then records that policy as mapped to the 4 approved Subcategories (with perhaps a flag that those are user-confirmed). The rejected one is not recorded in final mapping. If user wants to add a mapping the AI missed, they can search or browse the CSF list and select additional subcategories for that policy (the “modify” case). This should also be allowed. After this step, the system might mark that policy mapping status as “reviewed”. The acceptance test passes if the user is able to achieve all these actions and the final mapping set persists for use in gap analysis and reports.
Priority: P0.
Dependencies: The full list of CSF subcategories must be accessible in the UI for manual selection (likely in a dropdown or tree of Functions/Categories for ease of navigation).
	•	FR-MAP-004: Handling of Ambiguous/Partial Policy Mappings
Requirement: The mapping engine and interface must accommodate cases where a policy partially addresses a subcategory or is ambiguous:
	•	If the AI is unsure or finds that a policy touches on a subcategory but not fully, it should still flag it (with lower confidence perhaps).
	•	The user should be able to mark a mapping as “partial”. For MVP, a simpler approach: any mapping means the policy at least covers that outcome to some degree. Partial handling might come in scoring instead. But if possible, allow user to note (maybe via a comment) if a policy doesn’t fully meet the requirement.
	•	Ambiguous cases: e.g. a policy statement could correspond to one of two subcategories. The AI might propose both; user can choose which fits best or even keep both if relevant.
Acceptance Criteria: If a policy only mentions a concept in passing, AI suggests it with low confidence; the user sees that and maybe decides to include or not. The system doesn’t force binary all-or-nothing – meaning multiple subcategories can remain if partial coverage. The outcome could be that a policy maps to a subcategory but during deviation analysis, we’ll still detect a gap if no controls implement it or if interviews reveal weakness. The acceptance is more about UI: ensure the user isn’t stuck in an all-or-nothing scenario. They might e.g. leave a comment “policy touches this, but insufficient detail; will treat as partial”. That comment is stored for context (maybe not MVP to have comment per mapping, but beneficial if possible).
Priority: P1 (nice to mark partial explicitly; otherwise just noting in analysis is fine).
Dependencies: Possibly ties into deviation detection logic (to know if we consider a partially addressed subcategory as a gap or not – likely yes if partial).
5.2.2 Automated Control-to-Framework Mapping
	•	FR-MAP-005: AI Analysis of Control Descriptions
Requirement: The system shall use AI to analyze each control’s description (from the ingested inventory) and suggest which NIST CSF Subcategory(ies) it maps to. Essentially, it’s performing a similar NLP task as with policies but on the control procedural level. For example, a control described as “We have a centralized log management system that aggregates and monitors logs from all servers daily” would likely map to DE.CM-01 (monitoring networks) and DE.CM-09 (monitoring software and runtime environments)  . The AI should pick up terms like “log monitoring” -> Detect Function, Continuous Monitoring category.
Acceptance Criteria: Given a control entry “Quarterly access reviews of privileged accounts are conducted”, the AI might suggest PR.AA-05 (access permissions reviewed) with high confidence, and perhaps note it relates to GV.PO or GV.RR if policy requires it. But mainly PR.AA-05 is correct . The suggestions are displayed per control in a mapping UI, similar to policy mapping. The quality is measured by correctness of suggestions: a domain expert reviewing a few cases would agree with most mappings. (We might test with known mappings e.g. if a control explicitly mentions “backups tested monthly”, AI should map to PR.DS-11 backup tested ).
Priority: P0.
Dependencies: The CSF knowledge and NLP models; control text is presumably more succinct than policies, which might be easier in some ways (very direct wording often).
	•	FR-MAP-006: Confidence Scoring for Control Mapping
Requirement: Each AI-suggested mapping of a control to a CSF Subcategory shall include a confidence indicator (similar to FR-MAP-002). The AI might be even more straightforward here because control descriptions often contain keywords (e.g. “vulnerability scan” clearly relates to ID.RA-01 or DE.CM-07 if it existed). Confidence levels help the user quickly validate many controls.
Acceptance Criteria: E.g., control “Firewall rule review conducted annually” -> AI suggests PR.IR-01 (network unauthorized access prevented) with medium confidence because “firewall” implies network protection . It might also suggest DE.CM-01 (monitor network events) incorrectly with low confidence. The UI shows PR.IR-01 (Confidence High) and DE.CM-01 (Low). The user can then accept the first, reject the second, as per next requirement.
Priority: P0.
Dependencies: Same as FR-MAP-002 but applied to control text.
	•	FR-MAP-007: Human Review & Approval for Control Mappings
Requirement: Users must be able to approve/reject/modify AI-proposed mappings for controls, in the same manner as for policies (FR-MAP-003). Given typically a large number of controls, the UI should allow bulk review if needed (maybe by grouping suggestions by control domain or by subcategory). But MVP can rely on listing each control and its suggestions. The user confirms which CSF outcomes each control supports.
Acceptance Criteria: For a sample set of controls, AI suggests mappings. The user goes through them, e.g.:
	•	Control A had 2 suggestions, user approves both.
	•	Control B had 1 suggestion, user changes it to a different subcategory (meaning they disagree with AI, choose a different target).
	•	Control C had no suggestion (AI unsure), user manually maps it to one subcategory (because they know it fits).
	•	Control D had 3 suggestions, user rejects one irrelevant.
After this, the final control mapping table is updated accordingly. We verify that for Control B, the new mapping (user-chosen) appears and the AI-suggested one is removed. And Control C now has a mapping whereas initially it didn’t. The system should perhaps track which were user-added vs AI (but not necessary beyond storing them as confirmed mappings).
Priority: P0.
Dependencies: UI components listing controls and suggestions, selection controls; Full CSF list accessible for manual additions.
	•	FR-MAP-008: Relationship to Policy Mappings
Requirement: The mapping engine should recognize relationships between policy and control mappings. While mapping controls, if a control is linked to a policy (per FR-ING-009) and that policy was mapped to certain subcategories, the system might suggest those subcategories for the control as well, or at least highlight overlap. Conversely, if both a policy and a control independently map to the same subcategory, that reinforces the coverage.
Acceptance Criteria: Example: “Access Control Policy” was mapped (AI/user) to PR.AA-01, PR.AA-02, PR.AA-05. There is a control “User provisioning and deprovisioning process” tied to that policy. While suggesting mapping for that control, the system can hint “Related policy covers PR.AA-01 and PR.AA-02, consider if this control maps to the same.” Ideally, AI picks it up anyway from description, but it’s good to ensure consistency. If a control is linked to a policy, maybe pre-select subcategories that policy addresses as likely relevant. The acceptance is tricky to verify, but basically, consistency: the final mapping should not be wildly mismatched (like a policy maps something but no control does or vice versa) unless that indicates a gap by design. This requirement is partially about guiding user decisions. Possibly just mention in UI: “Policy X associated with this control covers Y subcategories.”
Priority: P1 (logic to cross-suggest based on link might be future, not essential in MVP because deviations will anyway catch mismatches).
Dependencies: Policy-control link data available; requires cross-check logic in mapping UI.
5.2.3 Gap Identification
	•	FR-MAP-009: Detection of Unmapped Subcategories
Requirement: After mapping is completed (or as it progresses), the system shall identify any CSF Subcategory that has no mappings from either controls or policies. These represent potential gaps where the organization may not have anything addressing that requirement. The system should compile a list of these unmapped subcategories for the user.
Acceptance Criteria: Suppose CSF has 106 subcategories, and after all user-approved mappings, 10 of them have zero associated controls and zero policies. The system generates an alert or list such as: “Unmapped CSF Subcategories: ID.RA-05, PR.PS-04, PR.PS-05, DE.CM-08, … (10 total).” For each, it provides the description for clarity (maybe in the UI or report: e.g., “PR.PS-04: Log records are generated and available for monitoring – No corresponding control or policy found” ). The user can then focus on these and decide if indeed nothing exists (then it’s a confirmed gap) or if maybe something was missed in mapping (they could go back and adjust mapping or realize an existing control should map here). The acceptance is that all truly unmapped ones are listed and none that have mappings are mistakenly listed.
Priority: P0 (a primary output for gap analysis).
Dependencies: Completed lists of mapping; Knowledge of full set of subcategories (which we have).
	•	FR-MAP-010: Detection of Insufficient Control Coverage
Requirement: The system shall detect Subcategories that are mapped only to policies but not to any controls, or vice versa mapped only to controls but no policy. These conditions often indicate a gap in design:
	•	Policy-only mapping: The organization has a policy addressing the requirement, but no implemented control to enforce it (gap in execution).
	•	Control-only mapping: There’s a control in place, but no formal policy or higher-level directive covering it (gap in governance/documentation).
Both situations should be flagged as potential gaps or at least noteworthy deviations.
Acceptance Criteria: For each subcategory:
	•	If subcategory X has one or more policy mapped but zero controls mapped, the system flags “Policy-level only” gap. For example, policy says “All devices must be encrypted” (maps to PR.DS-01) but no control is mapped to implement device encryption – this is a deviation: missing control for a policy requirement.
	•	If subcategory Y has controls but no policy, flag “Control without policy” – e.g., team does backups (control mapping to PR.DS-11) but there is no formal data backup policy – a governance gap.
The output could be part of the deviation list, distinguishing type. Acceptance is that at least if we set up a scenario with such mismatches, the system identifies them. E.g., artificially remove a control mapping for one subcategory but leave a policy mapping: the system catches that as a gap.
Priority: P0.
Dependencies: Completed mapping data of both types, FR-ING-009 linking helps but not strictly needed (we can infer by subcategory presence or absence on each side).
	•	FR-MAP-011: Mapping Gap Report/Interface
Requirement: The system should provide an interface or report section summarizing all mapping gaps identified:
	•	Unmapped subcategories (from FR-MAP-009).
	•	Subcategories with only policy or only control (from FR-MAP-010).
Possibly even subcategories with partial coverage (if we had that concept).
This should be accessible before final report (so users can remediate or at least plan) and definitely included in the final output. Each gap entry should include the Subcategory identifier, description, and gap type (no coverage, policy-only, control-only).
Acceptance Criteria: After mapping, the user can navigate to a “Coverage Gaps” view. It shows a table:
| CSF Subcategory | Description | Gap Type |
Example entry: | PR.PS-04 | “Log records are generated and made available for continuous monitoring”  | Unaddressed – no policy or control |
Another: | GV.SC-02 | “Cyber SCRM roles and responsibilities established”  | Policy only – no implementing controls |.
Another: | PR.DS-11 | “Backups of data are created, etc.”  | Control only – no policy reference.
The user can click on an entry to see suggestions or details (maybe listing existing mappings on that subcategory, which in these cases would show empty for one side). This completeness indicates success.
Priority: P0.
Dependencies: The outputs of FR-MAP-009 and FR-MAP-010; UI capability to display nicely; CSF descriptions for clarity (which we have from NIST doc).
5.3 AI Interview Bot
This section covers the AI-driven interview functionality – how interviews are designed, executed, and analyzed.
5.3.1 Interview Design
	•	FR-INT-001: Structured Interview Question Bank
Requirement: The system shall maintain a question bank of interview questions aligned to each NIST CSF Subcategory. These questions are designed based on consulting best practices to elicit information about the existence, design, and operation of controls relevant to that subcategory. The question bank should cover various aspects (existence, design, frequency, documentation, etc. as detailed in 5.3.3). For each Subcategory, there should be one or more primary questions. The bank can be pre-loaded and then extended by AI or users as needed.
Acceptance Criteria: For example, subcategory PR.AA-01 (manage identities) has a set of questions like “How does the organization manage accounts and credentials for authorized users?” and possibly follow-ups like “Do you have an identity management system or process in place for provisioning and deprovisioning?” The presence of at least one relevant question per subcategory in the system’s repository is verified. If we inspect subcategory DE.CM-01 (network monitoring), the bank might have “What tools or processes are in place to monitor your networks for security events?” Each question is stored with a reference to its subcategory, and possibly a type tag (like existence vs operation). The acceptance test could randomly pick 5 subcategories and confirm the system can retrieve a question for each.
Priority: P0 (foundation of interviews).
Dependencies: Knowledge base development – likely an initial static dataset compiled from frameworks or prior assessments; Possibly citable sources like NIST’s own guidance or consultant input.
	•	FR-INT-002: Role-Based Question Targeting
Requirement: The interview design must support directing specific questions to the appropriate persona (role) within the organization. Not every interviewee can answer all questions. For example:
	•	Technical IT control questions (like firewall configuration details) should go to an IT administrator.
	•	Process/policy questions (like “Do we have a policy for X?”) might go to the Compliance Manager or policy owner.
	•	HR or Training-related questions to HR representative.
The system shall allow assignment of questions or entire subcategory interviews to particular roles or individuals designated as owners of those areas (likely from data provided: control owners, etc.).
Acceptance Criteria: During setup, the Compliance Manager can assign, say, “John Doe – Network Security Manager” as the interviewee for all Protect (PR) domain technical questions, and “Jane Smith – HR Director” for PR.AT (training) questions, etc. The system then ensures that when interviews are deployed, John receives questions relevant to his domain, Jane gets hers, etc. If a user is assigned a question outside their knowledge, the design failed. We test by setting up two users with different domain responsibilities, and the tool should produce two separate interview flows containing questions pertinent to each domain, without overlap. E.g., Person A’s question list does not include HR training questions if Person B covers those.
Priority: P0 (ensures accuracy and efficiency of information gathering).
Dependencies: User & Role entity existence; mapping of subcategories or question sets to roles, possibly based on Control Owner field for each control or an internal matrix.
	•	FR-INT-003: Interview Branching Logic
Requirement: The interview process shall incorporate branching logic based on responses, i.e., it should be adaptive. If an interviewee’s answer indicates a particular condition, follow-up questions are asked; if not, those can be skipped. Examples:
	•	If asked “Do you have an incident response plan?” and the answer is “No,” the bot might skip detailed questions about plan testing and go to alternative questions (like “Why not?” or note a gap).
	•	If the answer is “Yes,” it would branch into “Please describe the key components of the plan” or “How often is it tested?”.
Similarly, a “I don’t know” answer might route to a clarification or escalate to another person.
Acceptance Criteria: Simulate an interview scenario: For subcategory RS.RP-01 (execute recovery plan) with a question “Do you have a documented incident recovery plan?”, provide an answer “No, we don’t.” The next question should pivot perhaps to “What is the process you follow when recovering from incidents without a formal plan?” or simply record the gap and skip detailed plan content questions. Conversely, if answer was “Yes,” one would see follow-ups about plan details. The acceptance is that the flow changes appropriately. This can be tested with specific input to the interview bot and verifying the next question differs based on it.
Priority: P0 (the term “structured interview” implies at least some conditional flow).
Dependencies: Implementation of the interview chatbot logic – likely using a dialog tree or an LLM prompt that can decide next steps based on a state. Needs a way to store state (e.g. if a subcategory essentially “N/A” because no control exists, skip related ones).
	•	FR-INT-004: Follow-up Question Generation
Requirement: The system’s AI interview bot shall be capable of generating or selecting contextual follow-up questions dynamically in response to interviewee answers, to probe deeper or clarify. While a base question bank exists, the bot should interpret an answer and if it’s incomplete or raises a flag, ask a relevant follow-up. For instance:
	•	If answer mentions a policy name, follow up with “Can you provide more details about what that policy covers?” if needed.
	•	If answer is vague like “We handle that informally,” follow up: “Could you describe the informal process?”
	•	If an inconsistency is detected (like earlier they said they have no process, but now mention something), the bot can clarify.
Acceptance Criteria: During a test interview, provide an answer such as “We usually discuss security incidents in team meetings.” The bot should logically follow up with something like “How often do these discussions happen and are they documented?” if such detail wasn’t given. Another example: answer: “Yes, we have a backup policy.” Bot: “Who is responsible for ensuring backups are taken and tested according to the policy?” Ideally, these follow-ups align with the question types in 5.3.3. We verify that at least for certain trigger answers (yes/no or mentions of frequency, etc.), the bot produces a relevant follow-up. If answer is very clear and comprehensive, the bot can move on. So the acceptance measure is qualitative: the conversation doesn’t just ask static questions ignoring what was said.
Priority: P1 (makes interview smarter; base might be just static branching. But an LLM could handle dynamic follow-ups, which is a big value-add).
Dependencies: Use of an LLM or rule-based triggers for certain keywords in answers. Ensuring the answer data is parsed in real time.
5.3.2 Interview Execution
	•	FR-INT-005: Conversational Interface
Requirement: The interview bot shall present questions in a conversational manner to the interviewee, ideally through a chat-like interface. The user (interviewee) can type answers in natural language (or select from options if provided) and the bot will respond or proceed accordingly. The interface should show the conversation history so the interviewee can refer back to previous questions and their answers. It should feel like a guided Q&A session rather than a static form.
Acceptance Criteria: When an interviewee logs in and starts their assigned interview, they see a welcome message and the first question. They answer (in a text box) and either press enter or click send. The bot’s next prompt appears beneath with a slight delay (maybe indicating “…thinking” if using an AI model). The UI shows each Q and A in sequence (labeling perhaps “Bot:” and “You:” or similar). The interviewee can scroll up to see earlier Qs. The style is polite and professional. We test by doing a sample Q&A and ensure the flow is smooth and real-time (within reasonable response time).
Priority: P0 (user experience critical to getting good answers).
Dependencies: Web UI technology for chat (or at least a sequential Q display). Possibly web socket or asynchronous call to get AI responses if needed.
	•	FR-INT-006: Asynchronous Completion Support
Requirement: The interview system should allow interviewees to complete their questions asynchronously. They might not finish in one sitting. This means:
	•	The user can save progress and return later to where they left off.
	•	If the bot is session-based, it needs to maintain context over time (the conversation state persists).
	•	Possibly allow the user to navigate or skip questions and come back if needed (though skipping might complicate logic; maybe they can leave an answer blank and return).
Acceptance Criteria: For a given user with 20 questions, they answer 5 and then close the session. When they log back in, the system greets them with something like “Welcome back, we will continue your interview. Last answered: [Q5 and answer].” The next question is Q6 continuing properly. None of their prior answers are lost. If the platform has a concept of a “Continue Interview” button on their dashboard, clicking it resumes the chat exactly where left. We also confirm that if they answered some questions in a different order (maybe they navigated a menu to go to a specific section), those answers persist.
Priority: P0 (practical necessity, since interviews can be lengthy).
Dependencies: State management for interview sessions, database storage of each answer as it’s given, user authentication to identify their session.
	•	FR-INT-007: Progress Tracking and Resumption
Requirement: The system shall display progress to the interviewee and the Compliance Manager. For the interviewee: an indicator (like “Question 5 of 15 completed” or a progress bar) to motivate completion and inform how much is left. For the Compliance Manager: a dashboard to see which interviews (by person or by subcategory) are done, which are in progress, and which not started. If an interview is partially done, show e.g. 33% complete. Also, allow a manager to resend a reminder or escalate if an interview is stuck.
Acceptance Criteria: Interviewee view: at any time, they can see “You have answered X out of Y questions.” Possibly the bot or UI shows “Section 2: Identity Management (3/5 questions answered).” If they attempt to close, maybe it warns “You have 10 questions remaining. Your answers are saved; you can resume later.” Compliance Manager view: on the assessment dashboard, see a list of interview assignments: e.g. “John Doe (Network Controls) – 80% complete, 4/5 answered; Jane Smith (HR/Training) – Not started.” After John finishes, status becomes 100% or “Completed on [date].” This can be tested by logging in as manager after partial answers and verifying the displayed progress.
Priority: P0 for tracking; perhaps P1 for very nice UI features, but baseline tracking is essential.
Dependencies: Each interview item (question set) associated with user and status; real-time update or refresh mechanism for manager; perhaps integration with notifications (see collaboration).
	•	FR-INT-008: Response Capture and Storage
Requirement: All responses provided by interviewees must be captured verbatim and stored securely in the system. Each answer should be linked to the question (and thus the subcategory it pertains to). Data integrity is important: no loss or alteration of responses. The system should timestamp each answer (for audit trail). If the interviewee edits an answer (if allowed), either version history is kept or at least final answer stored.
Acceptance Criteria: Complete an interview question and verify in the backend (database or through an admin view) that the answer text is stored and associated with e.g. “InterviewResponse ID 123 -> InterviewQuestion ID 456 -> Subcategory PR.DS-02.” For audit, ensure there’s a log like “User X answered at 2025-07-01 10:30:00: ‘Our backups are encrypted and tested annually.’” If we simulate a scenario where the network blips after answering, the system should have saved up to that last answer (maybe on each send). So we can test by answering then refreshing mid-interview; the given answers remain when continuing. Security: we won’t test encryption here, but it’s required by Non-functional.
Priority: P0.
Dependencies: Data model and persistence for responses; likely each answer commit to DB.
	•	FR-INT-009: Handling Incomplete or Unclear Responses
Requirement: The interview bot should be able to handle cases where the interviewee’s answer is incomplete, unclear, or off-topic:
	•	If the answer doesn’t address the question (e.g. question asks “Do you have X?” and answer is a tangent), the bot should politely re-ask or clarify: “I’m sorry, I need to understand if [rephrase question]”.
	•	If the user says “I don’t know” or “Not sure”, the bot might ask if there’s someone else who would know, or mark that question for later follow-up (and perhaps notify the manager).
	•	If the user provides a partial answer, the bot can prompt “Could you elaborate on [specific part]?”
Acceptance Criteria: Simulate an answer “I’m not sure about this.” Bot should reply with something like “Okay, no problem. We can note that as unknown. Is there someone else or documentation that might have this information? (You can answer or type ‘skip’).” Or at least mark it and move on. Another simulation: answer is unrelated: Q: “Who is responsible for patch management?” A: “Our firewall is from Vendor X.” Bot should detect mismatch and either rephrase or ask specifically “So to clarify, who oversees applying patches?” This depends on some AI understanding, which might be partial. At minimum, if user doesn’t answer or says skip, system should flag that question as unanswered in manager’s view. The acceptance is that the system doesn’t just accept gibberish – it either gets a clarifying follow-up or marks the need for human review. We can test a few such scenarios and check outcomes (presence of a follow-up or a flag in output like “Control Owner did not provide info for DE.CM-02”).
Priority: P1 (makes the interview effective; MVP could rely on manager catching blanks later, but better to prompt user in real-time).
Dependencies: LLM capabilities to interpret answers, logic for flags.
5.3.3 Interview Question Types
Define question types to ensure coverage of different aspects of controls:
	•	FR-INT-010: Control Existence Questions
Requirement: The interview must include questions confirming the existence of a control or process. These are typically yes/no or binary at first (with follow-ups). E.g., “Does your organization have a documented incident response plan?” or “Is multi-factor authentication implemented for remote access?” These questions ascertain whether a control is in place at all.
Acceptance Criteria: In the question bank, identify that for each subcategory, at least one question is geared towards existence. For example, subcategory RC.RP-01 about a recovery plan has a question “Do you have an incident recovery plan documented and approved?” If answered yes, it branches to design/operation; if no, that subcategory’s further questions might be truncated (as per branching logic). We test a couple: The bot asks “Does X exist?” and if user says “Yes,” it indeed follows up; if “No,” it either asks a gap question or moves on.
Priority: P0.
Dependencies: Question bank content. Branch logic from FR-INT-003 reliant here.
	•	FR-INT-011: Control Design Questions
Requirement: Questions that probe how a control is designed. This includes asking about procedures, frequency, scope, responsible roles, and formalization. E.g., “How is access review conducted? (e.g., what steps are taken, how often, documented or informal?)” or “What are the key elements of your incident response plan (teams, steps, etc.)?” These go beyond yes/no to get descriptive info on control design maturity.
Acceptance Criteria: The interview for a subcategory known to exist asks one or more questions about its design. For instance, after “Do you have MFA?” if yes: “Describe the MFA implementation (for which systems, which users, type of MFA).” We verify that at least key controls in each function have such follow-ups. The presence and logical phrasing of these questions in the bank is the test. And when answered, they provide detail that can later be used in scoring (like if answer indicates partial coverage, scoring logic picks that up).
Priority: P0.
Dependencies: Question bank.
	•	FR-INT-012: Control Operation Questions
Requirement: Questions about how frequently or consistently the control is performed (its operational aspect). Examples: “How often are privileged access reviews performed (e.g., monthly, quarterly)?” or “When was the last phishing drill conducted?” These aim to see if control is not just designed but active and regular.
Acceptance Criteria: For subcategories where operation frequency is relevant (like tasks that should happen periodically or continuously), ensure the interview covers it. E.g., ID.RA-05 risk assessments – ask “How regularly does the organization perform formal risk assessments (annually, etc.)?” If the answer is “never” or “irregularly”, that indicates maturity issues. We check the presence of these in appropriate areas (not every control has a frequency – some are continuous or event-driven). At least all typical repetitive controls (patching, backups, training, reviews) have an operation frequency question.
Priority: P0.
Dependencies: Domain knowledge to pick which subcategories require such questions.
	•	FR-INT-013: Documentation Questions
Requirement: Questions verifying documentation and evidence of controls. E.g., “Where is this process documented? (policy, SOP, ticketing system records?)” or “Is there written procedure for X?” This evaluates maturity (a higher maturity org documents processes). It also is double-check for existence (if they have it but no document, maybe it’s ad hoc).
Acceptance Criteria: Many subcategories should have a question about documentation of that domain. For instance, in Protect/Identity: “Do you have a written user access management procedure or policy?” Or in Detect: “Are monitoring results or incidents documented/reported in writing to management?” We verify that for each main category (at least) there is one documentation-related query. If an interviewee says “No, not documented,” the bot might mark design maturity as low. Testing wise, answer “We do it but it’s not documented” and see that the conversation notes that (maybe a follow-up or just record the gap).
Priority: P0.
Dependencies: Q bank, mapping doc questions to relevant subcategories.
	•	FR-INT-014: Responsibility Questions
Requirement: Ask who (role/department) is responsible for the control or process. E.g., “Who is accountable for reviewing user access logs?” or “Which team is in charge of maintaining the incident response plan?” This checks role assignment (and ties to GV.RR category as well). It’s important for gauging if roles are clear (a hallmark of maturity).
Acceptance Criteria: At least once per subcategory or per function, a question identifies the owner. Possibly one generic question per interview session: “Could you provide the name or role of the person responsible for [the topic]?” But often it’s embedded, e.g., after they describe a process, ask “What team or individual oversees this process?” We test by seeing an answered interview log where such a question was asked and answered. The answer could later feed into the data model (we might capture “Control Owner as per interview: John Doe” if different from initial owner assigned).
Priority: P0.
Dependencies: Already have some idea from control inventory (owner field), but interview verifies or gets specifics if inventory had just a dept.
	•	FR-INT-015: Exception Handling Questions
Requirement: Questions about how exceptions or deviations from the norm are handled. For example, “How do you handle instances where the policy cannot be followed? (are exceptions formally granted?)” or “What happens if a vulnerability cannot be remediated within the standard timeframe?” These reveal if the organization has risk management around control failures or gaps.
Acceptance Criteria: For relevant domains (change management, patching, policy compliance, etc.), ensure an exception question is present. One example: under change management control, “Are there processes for approving and documenting exceptions to configuration standards?” We expect at least a few such questions in the entire interview (especially in Govern category or places like risk management). A test could be to see if a known scenario triggers it: e.g. If user says “We sometimes skip quarterly reviews for minor accounts,” does the bot ask “Do you formally document those exceptions?” But at least statically, if it’s known that exceptions should exist, we ask.
Priority: P1 (maybe not all MVP question sets include this, but good to have for comprehensive maturity check).
Dependencies: Q bank content and domain knowledge.
5.3.4 Interview Analysis
	•	FR-INT-016: AI-driven Key Findings Extraction
Requirement: The system shall use AI/NLP to analyze the completed interview responses and extract key points or findings. This includes identifying statements that indicate non-compliance or gaps (e.g., “we don’t have a formal procedure for X” is a flagged finding), or positive practices (e.g., “we conduct drills quarterly” indicates good practice). The AI should summarize each subcategory’s situation from the raw answers, which will feed into scoring and the report narrative.
Acceptance Criteria: After an interview is done, the system produces a summary for each relevant subcategory, such as: “PR.IP-01 (Identities managed): Organization has an informal process for account provisioning; no dedicated IAM tool; manual approvals via email, indicating a partially implemented control.” This summary either appears in an internal review UI or is directly used in the assessment report draft. We test by inputting a known set of answers and see if the summary captures the essential points (lack of formality, etc.). Another example: If answer for backup testing was “We rarely test backups,” the extracted finding should highlight that: “Backups are not regularly tested, presenting a risk.” The measure is that it correctly picks up and concisely rephrases critical info, not just random details.
Priority: P0 (to avoid manual reading of all text by assessor).
Dependencies: Possibly using an LLM to parse each subcategory’s Q&A, or rule-based keyword searches for “no,” “not,” frequencies, etc.
	•	FR-INT-017: Identification of Cross-Interview Inconsistencies
Requirement: The system should compare responses across different interviews (or within one interview across related questions) to detect inconsistencies. For instance:
	•	The compliance manager says “We have an incident response plan,” but the IT manager says “No formal incident response plan exists.” This is a contradiction that should be flagged.
	•	Or one control owner claims something is done daily, another says monthly – if both answered the same subject differently.
The tool should highlight these for human review. Possibly by aligning answers that relate to the same subcategory or practice and checking for mismatch.
Acceptance Criteria: Set up a scenario: The policy owner’s interview answer: “Yes, we have a company-wide backup policy.” The IT admin’s interview later (or control info) indicates “We do not have any formal backup policy.” The system should output a notice: “Inconsistency: Policy Owner indicates a backup policy exists, IT admin indicates none. Requires reconciliation.” This might show up in an admin review screen or as a warning in the report generation step. Another check: If one interviewee left an answer blank and another answered a related question positively, the system might also catch that as a possible disconnect (“HR says training program exists, but line manager interviewed didn’t know about any training – inconsistency.”). We verify by purposely seeding conflicting answers in test interviews and seeing if a warning or mark is present.
Priority: P1 (enhances reliability; not strictly needed if we rely on humans to notice, but highly valuable for scaling assessments).
Dependencies: A mapping of which questions/responses should logically align (perhaps by subcategory or by policy domain). Data from all interviews accessible to the analysis engine.
	•	FR-INT-018: Linking Interview Findings to Controls and Subcategories
Requirement: The analysis results (findings extracted in FR-INT-016) must be associated with the relevant control(s) and CSF Subcategory in the system. Essentially, each deviation or key point found from an interview should be traceable to:
	•	The CSF Subcategory it impacts (since interviews are structured by subcategory, this is inherent).
	•	If possible, the specific control or policy it pertains to (especially if interviews were done per control owner).
For example, if interview says “We don’t have XYZ process,” and that corresponds to a missing control in subcategory PR.PS-05, the system should tag that subcategory as having a design gap with this justification. Also, if a specific control was supposed to cover it, link that finding to the control as evidence it’s not effectively implemented.
Acceptance Criteria: After processing interviews, the system populates something like a “Deviation” entry that includes:
	•	Subcategory = PR.PS-05 (unauthorized software prevention) .
	•	Description = “No application whitelist or software restriction is in place; process is informal. John (IT Manager) indicated they rely on user discretion, with no technical enforcement.” (sourced from interview).
	•	Linked Control = (if any was mapped to PR.PS-05, link to it; if none, then it’s an unmapped gap).
When we view the Deviation or subcategory assessment, we see the interview evidence tied to it. In testing, we confirm for a couple of subcategories that the narrative includes references to what interviewee said, and if that subcategory had a control record, it’s mentioned like “Control ‘Software Installation Policy’ exists but enforcement is lacking as per interview.” This traceability is crucial for auditors reading the report to know where info came from.
Priority: P0.
Dependencies: Data model linking responses to subcategory, and mapping of subcategory to control, etc., from previous sections.
5.4 Maturity Assessment Engine
This section defines how the tool will calculate maturity scores at various levels, based on the inputs collected (policies, controls, interviews).
5.4.1 Scoring Model
	•	FR-SCORE-001: Alignment with NIST Implementation Tiers
Requirement: The maturity scoring model shall align with the four NIST CSF Implementation Tiers (Partial, Risk-Informed, Repeatable, Adaptive). In practice, for each CSF Subcategory, Compliance AI should determine a score or level that correlates to Tier 1 through Tier 4. The model can use a numeric scale (e.g., 0-3 or 1-4) representing these tiers for computational ease, but in outputs will map to the Tier names. Alternatively, a 5-level scale (0-4) could be used where 0 indicates non-existent. The key point is that our scoring definitions correspond to Tier characteristics:
	•	Tier 1 (Partial): ad hoc, not formalized.
	•	Tier 2 (Risk-Informed): approved but not enterprise-wide.
	•	Tier 3 (Repeatable): standardized, documented, enterprise-wide.
	•	Tier 4 (Adaptive): continuously improving, quantitatively managed.
Acceptance Criteria: Define a rubric table (in Appendix C for examples and internal logic) that clearly states for a given Subcategory, what conditions (as gleaned from inputs) yield Tier1, Tier2, Tier3, Tier4. For instance: If no policy and no formal process, Tier 1. If policy exists but inconsistent practice, Tier 2. If documented process implemented consistently, Tier 3. If continuous improvement and metrics in place, Tier 4.  . The scoring engine is configured with these criteria. We test a few scenarios:
	•	If for subcategory X, the evidence we have is an ad hoc practice with no documentation, the system assigns Tier 1 (score=1).
	•	If for subcategory Y, there’s a formal policy and procedure consistently applied, assign Tier 3.
	•	If an organization demonstrates it reviews and updates the process continuously, Tier 4.
The acceptance is that these tier assignments match an expert’s expected classification given the same evidence.
Priority: P0.
Dependencies: Having definitions for each score per subcategory (could be generic definitions plus some subcategory-specific nuance).
	•	FR-SCORE-002: Granular Subcategory Scoring (0-4 or 1-5 Scale)
Requirement: The tool will produce a quantitative score at the Subcategory level using a defined scale. We anticipate a 5-level scale (0 through 4) or (1 through 5) to give nuance beyond four tiers if needed. For instance, 0 could mean “not implemented at all” (worse than Tier 1 partial), and 4 corresponds to Tier 4 adaptive. Or we use 1-5 aligning to CMMI-like maturity (Initial, Managed, Defined, Quantitatively Managed, Optimizing). We need to clarify: The prompt recommends 0-4 or 1-5 – let’s choose 0-4 with 0 meaning non-existent to align with many models where 0 = no capability. This yields 5 levels: 0=None, 1=Partial, 2=Risk-Informed, 3=Repeatable, 4=Adaptive. Each level needs a clear criteria description.
Acceptance Criteria: Document in the scoring rubric that:
	•	0 (Non-existent): No evidence of the subcategory outcome being addressed at all.
	•	1 (Partial): Ad hoc, reactive, maybe some informal efforts.
	•	2 (Risk-Informed): Some planning and management approval, but limited consistency.
	•	3 (Repeatable): Standardized and consistent implementation organization-wide.
	•	4 (Adaptive): Advanced, proactive, and integrated into culture with continuous improvement.
(This basically maps Tier1-4 to 1-4, with 0 as a step below Tier1 where literally nothing is done, which Tier1 might already imply but we can differentiate absolute absence vs partial.)
The acceptance test is conceptual: ensure each subcategory will be assigned one of 0,1,2,3,4 by our algorithm given any input state, and that the definitions are testable. For example, if evidence shows partial ad hoc practice = should yield 1. If evidence shows totally not even ad hoc = 0. We might verify with some example data for a subcategory and see if the algorithm yields the expected score.
Priority: P0.
Dependencies: Need FR-SCORE-001 definitions to extend to include level 0 if used.
	•	FR-SCORE-003: Scoring Criteria per Level for Each Subcategory
Requirement: We must define specific, testable criteria for what constitutes a level 0,1,2,3,4 for at least representative subcategories, and ideally for all. These criteria will consider:
	•	Policy existence/quality: e.g., No policy (0), policy draft (1), approved policy (2), enforced policy updated regularly (3), policy integrated into ERM (4).
	•	Control existence/design: e.g., No control (0), some ad hoc control (1), documented control implemented (2-3 depending on consistency), advanced control with metrics (4).
	•	Documentation and evidence: is it documented (if yes, likely >=2).
	•	Responsibility clarity: if roles assigned (bump to >=2), if not (likely 1).
	•	Frequency: irregular (1), periodic but not as policy says (2), on schedule (3), and self-audited (4).
We will provide a rubric text (likely in Appendix C) that outlines these for some sample subcategories. In implementation, the algorithm might use weighted rules (see FR-SCORE-004).
Acceptance Criteria: For at least 5 subcategories (as required in Appendix C), a rubric is clearly written, e.g.:
	•	ID.AM-01 (Hardware inventory): 0 = no inventory; 1 = ad hoc lists by some teams; 2 = central inventory exists but not complete or updated; 3 = centralized, regularly updated inventory; 4 = automated asset discovery and inventory integrated with risk mgmt.
We validate those definitions with expert logic and ensure they align with Tier descriptions. Also, the logic in code or decision trees can reference these conditions. The acceptance is largely that these rubrics exist and are logical/testable.
Priority: P0 (documenting them for transparency and coding reference).
Dependencies: Knowledge from standards or COBIT/CMMI mapping. Possibly referencing sources like CMMI or HITRUST maturity definitions for guidance .
	•	FR-SCORE-004: Explainable Scoring Algorithm (Deterministic)
Requirement: The scoring algorithm must be fully explainable and auditable. This implies:
	•	It should not be a black-box ML; it should be rule-based or a transparent logic combining weighted inputs.
	•	We can articulate exactly why a particular subcategory got a certain score, citing evidence.
	•	For each subcategory, the algorithm might use a weighted calculation of factors: e.g.,
Score = w1*PolicyScore + w2*ControlDesignScore + w3*ImplementationScore + w4*DocumentationScore + ... normalized or threshold-based. Or a simpler approach: it could be rule-based thresholds (like must have policy and control to reach level 2+; must have consistent implementation to reach 3, etc.).
	•	Each factor comes from data: Policy exists (true/false), number of controls mapped, interview said X frequency, etc.
We need to define these weightings or rules clearly and be able to trace an outcome to input values.
Acceptance Criteria: Possibly implement a logic table:
For example, define for each subcategory:
	•	If no control AND no policy, score = 0.
	•	Else if policy or control exists but major gaps (from interview like not applied org-wide), score = 1.
	•	Else if policy+control exist but some inconsistency in practice, score = 2.
	•	Else if fully implemented consistently, score = 3.
	•	Else if metrics and improvement present, score = 4.
This is an explainable rule set. Alternatively, define numeric sub-scores: e.g., PolicySubScore (0 or 1), ControlDesignSubScore (0-2 perhaps for partial vs full design), ImplementationSubScore (0-1 for consistent or not), Documented (0-1), etc. Summing them might yield a total that maps to 0-4. Provide these details.
The acceptance is that a person could manually apply the same rules to the evidence and get the same score. Also the system should store intermediate values (like those sub-scores or rule triggers) for audit.
We’ll test by taking a scenario, applying the rules on paper and see the system’s output matches. e.g., an area with policy and control but some inconsistency: by rules expected level 2, does system give 2 and show in explanation “Policy exists (+something), Control exists (+something), inconsistency noted (so not level3). Score =2.”
Priority: P0.
Dependencies: Data points from previous phases (mapping completeness, interview findings). Possibly a small engine or configurable rules.
	•	FR-SCORE-005: Auditability of Scoring Inputs
Requirement: The system shall maintain an audit trail or at least a log for each subcategory score that shows how it was derived, including what inputs were considered:
	•	e.g., “PR.DS-02 scored 2 because: Policy exists (yes), Control exists (yes), Control Owner interview indicates partial encryption coverage and no regular review (limiting to Tier 2).”
	•	This explanation can be used in the UI (when user clicks on a score to see details) and in the report (if needed, maybe in appendix).
	•	All elements (like interview quotes or mapping statuses) that influenced scoring should be referenceable.
Acceptance Criteria: For a chosen subcategory, the system can produce a breakdown such as:
	•	Inputs: Policy = Yes (Access Control Policy covers this), Controls = 2 controls mapped (IDs), Interviews summary: “control owners say process is informal”, Last assessment score if available, etc.
	•	Logic: According to rubric, “Policy present” yields base level 2, “control formalization incomplete” prevents level 3, thus final = 2.
	•	Possibly show a short explanation string and link to evidence: interview response, policy name, etc.
We verify by looking at a subcategory in the system’s admin or debug mode, and confirm such trace info exists. Also possibly trigger the system to generate an explanation for the report and see that it’s meaningful and cites sources  .
Priority: P0 (ties to explainability requirement).
Dependencies: Execution of FR-SCORE-004 rules and storing intermediate decisions, references to mapping and interview data (which should be stored by unique IDs or links to text).
5.4.2 Scoring Inputs
	•	FR-SCORE-006: Policy Existence & Quality Input
Requirement: The scoring engine shall incorporate whether a policy exists for the subcategory and, if so, an assessment of its quality/coverage. This likely is binary for existence (0 or 1), and quality could be judged by:
	•	Is the policy current (if metadata has last review date within threshold)?
	•	Does the policy explicitly cover the subcategory outcomes (maybe from mapping confidence or manual check)?
	•	Possibly, if multiple policies partially cover, quality might be lower than one comprehensive policy.
For MVP, a simpler approach: if any relevant policy exists, count as policy present. If none, that’s a significant hit. If multiple policies conflict or are outdated (we could detect outdated if they gave effective date), that could reduce quality.
Acceptance Criteria: The rubric might say: “Policy: Yes = needed for score >=2. No = max score 1.” and “Policy Updated in last 2 years? If no, maybe treat as weaker (like 0.5 weight vs 1)”. This is an internal detail. We confirm that if policy is missing, the subcategory cannot score above 1 in our rules (for example). If a policy exists but is outdated (we have a flag maybe via metadata, though MVP might not enforce date rules yet), maybe we note that in explanation but keep same base score.
We will test scenarios:
	•	subcategory with no policy but strong control evidence -> likely ends at Tier 2 maximum in our scheme due to governance gap.
	•	subcategory with policy but no control -> Tier 1 or 2 because implemented gap.
Ensure scoring logic aligns: e.g., if no policy (which is key for Tier 3/4 since those imply formal governance), so it should cap out.
Priority: P0.
Dependencies: Data from mapping if any policy mapped; maybe metadata for currency if provided.
	•	FR-SCORE-007: Control Existence & Design Input
Requirement: The engine uses whether controls exist (one or multiple) for the subcategory and how well-designed they are:
	•	Existence: if no control mapped, likely score is 0 or 1 (because nothing in practice).
	•	If controls exist, examine design maturity from interviews: e.g., control is formal vs ad hoc, documented vs not.
Perhaps assign a design score: e.g., 0 = no control, 1 = control exists but informal, 2 = control formalized (SOP etc.).
This can weigh heavily in scoring because actual implementation is key.
Acceptance Criteria: Instances:
	•	Unmapped subcategory (no control) should lead to lowest scores (0 if absolutely none, or 1 if there’s some partial process not recorded as a control? up for interpretation).
	•	Subcategory with a control but interview says “it’s not documented or consistently done” -> design considered weak (maybe effectively Tier1/2).
	•	Control exists and described well (documented, covers scope) -> design strong (score could reach Tier3 if policy exists).
Check the rubric we set covers these.
We’ll simulate: e.g., for data backup subcategory: if backup processes are ad hoc (control exists but not reliable), result maybe Tier1.
If backup processes are formal (control with schedule etc.), Tier3 if other things align.
Check that the final score matches these expectations in test cases.
Priority: P0.
Dependencies: Control mapping and interview responses. Possibly results from FR-INT analysis about control design.
	•	FR-SCORE-008: Control Documentation Input
Requirement: Incorporate whether the control/process is documented (procedure, guidelines, etc.). This often separates Tier 2 from Tier 3:
	•	If documented, that’s a sign of institutionalization (should be required for Tier 3).
	•	If not, likely stays Tier 2 max even if done consistently, because lack of documentation means not fully institutionalized.
Possibly treat “documentation” as a binary flag that boosts a score threshold.
Acceptance Criteria: Confirm the rules reflect:
e.g., “To reach score 3 (Repeatable), process must be documented.” So if everything else is good but documentation is missing, keep at 2.
We’ll test a scenario: e.g., Change management: have a process but it’s not written anywhere. Based on that, expect Tier 2. Check if our logic indeed yields 2 not 3.
If they had docs, maybe they’d get 3. Another scenario: an informal control but they wrote something down (rare, but if someone wrote a draft but practice is inconsistent?), documentation alone can’t jump to 3 if practice isn’t consistent. But documentation is usually correlated with some consistency. We’ll ensure logic accounts for both doc and practice.
Priority: P0.
Dependencies: Interview question on documentation, or if user uploaded SOP as a policy maybe we count that.
	•	FR-SCORE-009: Interview Responses (Implementation Evidence) Input
Requirement: Use the qualitative info from interviews about how the control operates (frequency, coverage, exceptions, recent incidents) to adjust scoring:
	•	If interviews reveal good operational practices (e.g., “we do this monthly as required, no major exceptions”), that leans towards higher maturity.
	•	If reveal gaps (“we rarely do it” or “only done when someone remembers”), that indicates lower maturity.
	•	Also, if an interview indicated improvements in progress or known issues, that might reflect partial implementation.
We might break this into sub-factors like Frequency Score, Consistency Score, etc.
Acceptance Criteria: The scoring rubric includes considerations:
e.g. “If control is performed regularly and as per policy, qualifies for Tier 3; if irregularly or reactive, max Tier 2; if not at all, Tier 1.”
Another: “If exceptions are managed formally, possibly Tier 4 sign (since that shows advanced risk mgmt); if exceptions unmanaged, then that’s a weakness.”
We’ll verify that for at least one scenario, these responses tip the score.
For example, if everything is formal but interview says “in practice, we haven’t done a review in 2 years though policy says annual” – our logic should drop the score (maybe from 3 to 2 because not followed).
Test by providing conflicting info: policy says do X monthly, answer says do annually. The score likely not Tier3 because not as per policy.
Another test: Org has metrics and improvement processes (like “we track incidents and update policies accordingly”) – this is hallmark Tier4. If interview gave such statement, ensure model can raise to 4.
Priority: P0.
Dependencies: Processed interview flags (like frequency = monthly vs yearly, presence of metrics or continuous improvement mention).
	•	FR-SCORE-010: Mapping Completeness Input
Requirement: Consider the completeness of mapping (coverage) as an input:
	•	If one subcategory relies on multiple controls and some are missing, that might reduce maturity. Or if it’s addressed by only one control when best practice uses multiple layers, maybe still okay if that one suffices.
	•	If a subcategory had multiple controls needed (e.g., supply chain risk management might need vendor assessment, contract clauses, monitoring – if they have only one of three, that’s partial).
Possibly approach: If we identified a partial coverage gap (some aspects missing), treat that as lower maturity.
	•	The gap identification (FR-MAP-010) essentially is this: e.g. “policy but no control” would cap maturity at Tier1/2.
Or multiple controls vs one: might not straightforwardly incorporate except via interview (they might say “we rely only on one measure, not defense in depth” – but if that measure suffices, NIST CSF doesn’t require number of controls, just outcome).
So likely this is encompassed by earlier factors (control existence and coverage).
Acceptance Criteria: It’s more internal: ensure that if we had flagged a partial mapping scenario, the scoring logic interprets that as not fully implemented (so not Tier4). For instance, supply chain risk mgmt (GV.SC) has many subcomponents; if they do some but not others, subcategory-level might be partial. But since each subcategory is distinct, if some subcategory not done at all, that subcategory gets low score anyway. This requirement might be more for category-level aggregation: see FR-SCORE-012. Possibly skip at subcategory because subcategory is smallest outcome – partial coverage of a subcategory probably means not fully meeting outcome, thus a lower score inherently. We just ensure e.g. if policy says do A, B, C and they only do A and not B,C (which might still be that subcategory outcome partially done), then maybe the interview captured that. So acceptance: partial coverage is addressed either by multiple control mapping or by interview clarifying what parts done vs not.
We’ll rely on interview analysis to cover partial. So this FR is effectively handled by others but we keep it to emphasize nothing falls through cracks.
Priority: P0 (implicitly done).
Dependencies: FR-MAP gap analysis feeding FR-INT questions and FR-SCORE logic.
	•	FR-SCORE-011: Missing Input Handling
Requirement: If some expected inputs are missing (e.g., no one answered an interview question, or a certain artifact was not provided), the scoring should handle it gracefully:
	•	Possibly assume worst-case for missing info (e.g., if they didn’t provide evidence for a policy, assume no policy until proven otherwise).
	•	Or mark score as “unknown” requiring user input (less likely in automated output; better to assume lower score to be safe).
For MVP, likely treat missing answers as negative evidence (lack of evidence of good practice = we consider it not in place).
Acceptance Criteria: If, say, an interviewee skipped a question “Do you have X?” without answer, the system should not erroneously give credit. It might either explicitly lower the confidence of that subcategory’s score or produce a “Not enough info” flag. But we probably choose to assume ‘No’ for scoring and highlight the uncertainty.
For test, deliberately leave a question blank (simulate an interview incomplete for a subcategory) and see how scoring does:
It should possibly give low score (like 1 or 0) and mark in explanation “Information not provided, assumed missing.” If we design it to require manual intervention, then success is at least it calls it out.
Priority: P0 (scoring must always output something even with incomplete data).
Dependencies: The interview progress tracking and deviation flags might indicate unanswered questions.
5.4.3 Scoring Calculation
	•	FR-SCORE-012: Weighting Factors for Inputs
Requirement: Define weightings for different input categories in the score algorithm if using a numeric approach. For example:
	•	Policy presence (20% weight)
	•	Control design & implementation (50% weight)
	•	Documentation (10% weight)
	•	Interview/performance (20% weight)
These are just example proportions. The actual model might not be strictly linear weighted, could be rule-threshold, but if any formula is used it should reflect that certain factors (like actually doing the control) are more important than others (like just having a policy).
Possibly, a subcategory’s maturity is predominantly defined by whether the control is done and formal (so heavy weight there), and lacking a policy would hold them back a tier but maybe not drop to 0 if everything else done.
Acceptance Criteria: Document the chosen approach:
e.g., “The scoring algorithm uses a rule set rather than continuous weights: lack of policy limits tier to 2, lack of documentation limits to 2, lacking consistent implementation limits to 2, lacking both policy & implementation yields 1, etc. If none of these limiting factors, then 3 or 4 possible if continuous improvement found for 4.”
Alternatively, if numeric:
“score = 0.4PolicyScore + 0.4ImplementationScore + 0.1DocumentationScore + 0.1ContinuousImprovementScore” scaled to 0-4.
We ensure these add up logically. The acceptance is verifying that the defined weighting or logic aligns with the desired prioritization. For example, if there’s a scenario with great policy and docs but poor execution, the result should be low (i.e., execution weighted more, so appropriate).
We’ll test a scenario: Good policy (score high in that domain) but actual practice poor; the final score should be low (like Tier1 or 2). If our weights logic does that, good. Conversely, no policy but strong execution: presumably still mid-tier, not highest.
Possibly by running numbers through an example.
Priority: P0.
Dependencies: The prior FR items that give sub-scores or boolean conditions.
	•	FR-SCORE-013: Aggregation from Subcategory to Category
Requirement: The system shall aggregate subcategory scores into a Category-level score. This could be:
	•	An average of subcategory scores (simple mean).
	•	Or a weighted average if some subcategories are deemed more critical (though within a category typically equal).
	•	Possibly lowest-common-denominator if we want a conservative measure (i.e., category is as weak as its weakest subcategory). But that might undervalue others, probably we average or do weighted by importance.
MVP likely uses simple average (or round down to nearest tier if needed for Tier designation).
Provide method: e.g., Category score = floor(mean of subcategory scores + 0.5) to pick a tier.
Acceptance Criteria: For a category like PR.PS (Platform Security) with 6 subcategories, we assign each a sub-score, then computing category:
If sub-scores are [2,2,3,2,2,1] average = 2.0, maybe category = 2 (Tier2).
If one is much lower but others high, e.g., [3,3,3,3,0,3], average ~2.5, depending on rounding could be Tier3 or if we choose lower bound approach maybe Tier2 because one zero drags significantly.
We must pick a rule and apply consistently.
Document and test:
We’ll feed some known values and see category output. Compare with expectation that if one subcategory is missing, can category still be high? Arguably category can’t be fully repeatable if one part is missing. Could do weighted such that missing subcategory severely impacts average anyway.
Let’s decide: weighted average or mean.
We’ll likely do a plain average but highlight in report the variation.
Test: If category ID has subcat scores [4,4,1] average = 3, Tier3, but one subcategory at Tier1 maybe should indicate overall category isn’t strong. But average might hide that.
Possibly in reporting we show distribution. But requirement is to define how we aggregate, so we commit to e.g. average and perhaps note in narrative if any subcategory is two tiers lower than category (just thinking).
Accept if we can produce category scores and rationalize them.
Priority: P0.
Dependencies: All subcategories scored, mapping from numeric to Tier for output.
	•	FR-SCORE-014: Aggregation from Category to Function
Requirement: Similarly, aggregate Category scores to Function-level. Likely a straightforward average (each Category might be considered equal weight under the Function). But note Functions have differing number of categories.
Alternatively, weight by number of subcategories? That could double-count subcategories, so maybe not needed if each subcategory was equal and we effectively do global average. But might treat each category equally or by subcat count (should double-check). Possibly simplest: treat each category’s tier as number and average them.
Acceptance Criteria: For a Function like Protect with 5 categories (PR.AA, PR.AT, PR.DS, PR.PS, PR.IR), if their scores are [3,3,2,2,3], average = 2.6, presumably round to Tier3.
Implement that consistently and verify with some test values.
We should articulate: “Function X’s score is the average of its Category scores, rounded down to nearest whole tier (to avoid overstating).” Or perhaps normal rounding.
Crisp rule needed.
Test rounding boundaries. E.g., if average 2.4 do we call it Tier2? maybe safer to floor because we want fully meeting Tier3 across categories to claim Tier3.
We’ll likely be conservative: implement as floor of average (or require majority of categories at that level to round up).
Document that decision and test a borderline case: if categories mostly Tier3 but one Tier1, average might still be above 2.5 – if rounding normally, might say Tier3, but floor would give Tier2. Possibly floor is more prudent because that Tier1 category means not fully Tier3. We’ll lean conservative.
Accept if we stick to our rule and results seem plausible.
Priority: P0.
Dependencies: Category scores computed.
	•	FR-SCORE-015: Handling Missing Subcategory Scores
Requirement: If some subcategory could not be scored (due to incomplete data or being out-of-scope intentionally), the aggregation should handle that:
	•	Possibly treat missing as lowest (since cannot confirm maturity, assume weak).
	•	Or exclude from average if truly out-of-scope (but in NIST CSF ideally all subcategories in scope; if organization says a category doesn’t apply – seldom in CSF because it’s broad – but maybe small org might not have something like “development lifecycle” if no dev).
	•	For MVP, likely no explicit concept of N/A; if they claim N/A we might still consider it a gap unless we allow N/A marking. Possibly not in MVP scope to do N/A, treat as gap.
So probably treat missing as 0 or 1 in scoring as earlier.
Acceptance Criteria: If an entire category was skipped (user said not applicable), our scoring would mark those subcategories as 0 or minimal. The category and function scores would then reflect that gap. Possibly produce a footnote “some subcategories not applicable” if needed, but likely we just include them as weaknesses (since regulators often want you to at least consider everything, not just skip).
Test: If out-of-scope subcategory appears as unmapped and unanswered, our process would give it 0 (lack of evidence), which drags category. If that is intended (if truly not applicable maybe the organization doesn’t mind a low score in that one subcategory since they consciously accept it).
Acceptable if our logic doesn’t break. Perhaps mention in report that they consider it N/A, but we can note that in narrative.
For scoring algorithm, ensure no divide by zero if a category had 0 subcategories (not likely in CSF since each category has at least one).
We’ll verify by making sure an unmapped or skipped subcategory shows in score as 0 not something weird like null.
Priority: P0.
Dependencies: Approach to missing from FR-SCORE-011, deviation marking.
	•	FR-SCORE-016: Confidence Indicators for Scores
Requirement: Provide a measure of confidence or completeness for each score to reflect input quality:
	•	If a subcategory score is based on strong evidence (multiple inputs, consistent answers), mark high confidence.
	•	If it’s based on sparse info (maybe no interview, just one policy), mark low confidence.
This helps the user know where results are solid vs need review. Possibly a simple indicator (like each score gets a confidence percentage or High/Med/Low).
Acceptance Criteria: Suppose one subcategory mapping was incomplete (no controls and no interviewee responded), we still gave Tier1 but confidence is low since maybe someone just forgot to fill something. The UI or report might highlight that with a symbol or footnote. Another subcategory where policy, control, interview all aligned, confidence high.
We might calculate confidence by count of evidence sources present:
e.g., out of [Policy, Control, Interview], if 3/3 present => high, 2/3 => medium, 1/3 => low.
Or something along those lines.
We test with a scenario:
	•	Subcategory A had policy+control+interview => system marks high.
	•	B had only policy and partial interview => medium.
	•	C had nothing answered, we assumed gap => low.
Check that output (maybe not visible to end user explicitly unless we incorporate in report or UI tooltips). If in report, maybe we color code heat map with transparency, etc. But at least store it for consumption.
Priority: P1 (not critical but valuable for transparency; might do at least a hidden metric for internal use or when manual review).
Dependencies: Data presence flags from earlier steps.
5.4.4 Score Explainability
	•	FR-SCORE-017: Detailed Score Breakdown
Requirement: For each Subcategory score, the system shall provide a detailed breakdown explaining which components contributed to that score:
	•	Policy: Yes/No (and effect on score)
	•	Controls: list of controls considered and note on their strength/weakness.
	•	Interview highlights: key quotes or findings that influenced score.
	•	Possibly any point deductions: e.g., “score capped at 2 due to lack of documentation”.
This breakdown should be accessible in a UI by clicking on the score, and portions should be reproducible in the final report (maybe in an appendix or on demand).
Acceptance Criteria: E.g., for PR.AA-05 (least privilege):
“Score 2 (Risk-Informed). Policy: Access Control Policy exists (updated 2021) – prerequisite for >1. Controls: Quarterly access review control exists but interviews indicate reviews are not consistently done for all systems. Documentation: Process is documented in IT SOP. Evidence: Control Owner said only high-level accounts are reviewed regularly, others ad hoc . Rationale: Because reviews are partial and not enterprise-wide, maturity is limited to Tier 2.”
If a user or auditor reads this, they understand exactly why not Tier3.
We’ll test by generating an explanation for a sample subcategory and checking it references the relevant policy name, control IDs/names, and interview statements (with maybe interviewee role). It should also mention things like “lack of formal metrics for improvement prevents Tier4”.
Accept if explanation is logically consistent with inputs and covers all key points.
Priority: P0 (ties strongly to transparency demand).
Dependencies: Logging of all relevant data references and ability to compile them in text. Possibly integration with citation style from sources (we might cite internal references in UI, not external).
	•	FR-SCORE-018: Evidence Citation in Score
Requirement: The explanation for scores should cite specific evidence where possible:
	•	If referring to an interview statement, quote or paraphrase from that person’s answer (and attribute like “(Interview with John Doe, 2025-07-01)”).
	•	If referencing a policy or document, mention it by name and section if available.
	•	If referencing control design from the inventory, mention control name/ID.
This ensures the user can trace back the score to concrete evidence.
Acceptance Criteria: In the detailed breakdown (from FR-SCORE-017), verify that each claim is tied to an evidence:
For instance, “Control Owner (Jane Smith) indicated backups are not tested (Interview Q5) ”,
“IT Backup Procedure document not provided - assumed absent”,
“Policy X states monthly testing but logs show last test was 1 year ago (from evidence log submitted).”
If we have actual artifacts in system, maybe hyperlink them for user in UI (like clicking policy opens the text).
For now, text reference is fine.
We test by ensuring at least one example explanation indeed contains such references and that they are accurate (the references exist in the data we have).
Priority: P0 (for trust in AI results).
Dependencies: The system storing the content of interviews, etc., and being able to retrieve snippet. Possibly no actual external citations but internal ones.
	•	FR-SCORE-019: Factors for Score Improvement Identification
Requirement: As part of the explainability, the system should identify what specific factors or changes would be needed to achieve the next higher score level for that Subcategory. This turns into a recommendation of sorts:
	•	e.g., “To reach Tier 3, organization should formalize the process and ensure it is performed consistently across all departments, and document it.”
	•	“Tier 4 would require implementing metrics and continuous improvement feedback loops.”
This essentially is giving the gap to next tier, which is very useful for remediation planning.
Acceptance Criteria: For a subcategory with score 2, the explanation might end with:
“Improvement to Tier 3: Develop and enforce a formal SOP for this process and ensure organization-wide adoption. Improvement to Tier 4: Establish KPIs to measure process effectiveness and perform periodic reviews to adapt process based on findings.”
Or at least for next tier immediate. Possibly list immediate next and eventual Tier4.
We check some sample outputs and see that for each subcategory with not max score, there’s a clear statement of what is lacking relative to next tier’s criteria  .
If a subcategory is already Tier4 (max), maybe note “Continuous improvement in place - maintain and refine as needed.”
Accept if these suggestions align with rubric differences between tiers and do not include any irrelevant things.
Priority: P0 (explicitly requested in PRD to identify factors to improve score).
Dependencies: The rubric definitions which highlight differences between levels, we can map missing pieces to recommendations.
5.5 Deviation Detection
5.5.1 Policy-Level Deviations
	•	FR-DEV-001: Missing Policy Detection
Requirement: The system shall detect any NIST CSF subcategory for which a policy that addresses it is expected but no policy exists in the inputs. Essentially, if a subcategory was mapped to nothing on policy side (and we expected one), that is a policy-level deviation:
	•	“No policy covering [subcategory description] is in place.”
For example, if there is no Acceptable Use Policy or similar covering something like PR.AA (access control), that’s a gap.
Obviously, not every subcategory demands a separate policy doc, many can be in one general policy. But if none of the policy documents cover it (from mapping step), we flag missing policy.
Acceptance Criteria: For each subcategory without any mapped policy (and not marked N/A or such), produce a deviation entry: e.g.,
“Deviation: Missing Policy – The organization lacks any policy addressing ‘PR.DS-02: Data-in-transit protection’ .”
Possibly recommended action: “Develop and implement a policy to cover encryption of data in transit.”
But the detection just identifies it.
We test by having a known list of subcategories and perhaps not uploading a particular expected policy like “Incident Response Policy”. The tool should list RS domain subcategories under policy deviations.
Priority: P0.
Dependencies: Mapping matrix from 5.2, specifically FR-MAP-009.
	•	FR-DEV-002: Inadequate Policy Coverage
Requirement: Detect policies that exist but do not adequately address the subcategory outcomes. This is more nuanced:
	•	Perhaps via AI analysis of policy text vs CSF requirements: e.g., policy might mention incident response broadly but not cover communications (RS.CO) if that subcategory is in CSF. Then RS.CO is not fully addressed in policy.
	•	Or if a policy exists but is outdated or incomplete relative to best practice guidelines.
This is partly subjective, but we can catch obvious ones:
If our mapping confidence for a subcategory is low or partial (the AI found some mention but not comprehensive), we can flag that “Policy X only partially addresses this requirement.”
Or if interview says “Though we have a policy, it doesn’t cover XYZ aspect,” then flag.
Acceptance Criteria: Example:
“Deviation: Policy Gap – The Access Control Policy does not define processes for periodic access reviews, leaving subcategory PR.AA-05 only partially addressed by policy.”
This implies the policy is incomplete. Or:
“Cybersecurity policy exists but does not cover third-party risk management (GV.SC categories), which is required.”
This might come from mapping – if the policy document was mapped to some but not all subcategories in a category, and those missing ones have no other policy, that’s similar to FR-DEV-001 (no policy for those subcats).
If partially covered, we either treat as missing for those specifics or have an explicit partial deviation.
Accept if for at least one scenario (like policy covers some parts of subcategory but not others, maybe from an AI analysis perspective), the system highlights that. It’s hard to algorithmically know “inadequate” but we can use mapping confidences: if AI mapping had low confidence and user still accepted because partial, we can flag that as partial coverage.
Implementation wise, possibly tie to FR-MAP-004 partial mapping mark – that can trigger a deviation “Policy does not fully meet requirement.”
Test: Mark a mapping as partial, see if deviation list includes something for it.
Priority: P0 (important to catch policy content gaps).
Dependencies: AI policy analysis details (maybe scanning if certain keywords of requirement absent), or user flags partial.
	•	FR-DEV-003: Policy vs Framework Requirement Inconsistency
Requirement: Identify if any statements in policies conflict with CSF subcategory outcomes or general best practices. For instance:
	•	If a policy explicitly says something that would contradict a CSF recommendation (rare, as policies usually align, but maybe a policy might allow something that CSF suggests to avoid).
	•	Or if policy sets a weaker standard (like “backups should be done annually” vs CSF expecting more frequent).
Automated detection is hard, but maybe via external references: e.g., mapping NIST 800-53 controls some could categorize severity. Possibly out of MVP scope to do fully. But we can attempt simpler:
If through AI, a policy is found to disclaim something like “We do not enforce XYZ”, which might open a gap. We could flag that as an inconsistency.
Acceptance Criteria: If a policy says “no formal risk assessment is required,” that obviously conflicts with CSF Identify Risk Assessment categories. We would output:
“Deviation: Policy Inconsistency – The policy ‘Risk Management Policy’ states that formal risk assessments are not required, which contradicts CSF subcategory ID.RA-05 calling for prioritized risk response planning .”
But such direct conflicts may be uncommon.
Possibly skip or P2 since it’s complex.
If not fully implementing, might rely on consultant reading. But we could attempt a check: any negative or exception language in policy that indicates not doing something recommended.
Might treat as partial coverage again. Could combine with 5.5.2 if it’s effectively a design deviation in control.
Accept if we either decide out-of-scope (then none flagged), or if we attempt maybe search policy for words like “not required,” “optional” around key controls, flag that snippet for review.
Given difficulty, mark as P2 or best-effort.
Priority: P2 (nice but not core for MVP).
Dependencies: Deep NLP understanding of policy vs CSF normative stance.
	•	FR-DEV-004: Outdated or Unmaintained Policies
Requirement: If policy metadata or interviews indicate that a policy is outdated (not reviewed recently) or incomplete (like marked “draft”), flag that as a deviation:
	•	E.g., “Incident Response Policy last updated 5 years ago; may not reflect current practices or CSF 2.0 updates.”
This is more a compliance hygiene gap.
Could auto-detect using policy metadata date if provided or references in doc. Or if interview remarks “policy is old”.
Acceptance Criteria: If a policy file has metadata “effective 2015” and current year is 2025, flag:
“Deviation: Outdated Policy – The Incident Response Policy has not been updated in over 5 years, which may lead to misalignment with current threats and practices.”
Or if a policy is missing sections (maybe page count small for broad topic might hint incomplete, but not reliable).
Focus on date; if none given, maybe skip. Possibly allow user to input that.
We test by giving an effective date and system comparing with an internal rule (like older than 2-3 years considered outdated for key security policies).
Accept if such a policy triggers a deviation as expected.
If no date info, user can manually note it and we could incorporate as a comment. Maybe not fully automated, but as far as detection goes, date is key.
Priority: P1 (helpful, but if no data might not do at MVP).
Dependencies: Policy metadata (if FR-ING-008 captured LastReviewDate), current date from system.
5.5.2 Control Design-Level Deviations
	•	FR-DEV-005: Missing Control Detection
Requirement: Identify subcategories for which no implemented control exists (i.e., the organization is lacking a control to meet the requirement). This basically overlaps with FR-MAP-009 but on control side:
“No control or process in place to achieve [subcategory outcome].”
It’s a core deviation: e.g., “No vulnerability management program exists for ID.RA-01 vulnerability identification .” or “No data backup mechanism is implemented for PR.DS-11 .”
Acceptance Criteria: After mapping and interviews, list all subcategories with zero controls mapped (and not in planning either).
For each, produce a deviation.
We ensure that if a subcategory is addressed solely by policy but nothing in operations, we catch it.
Test by e.g., leaving a gap in control mapping for known high-level item (like no Incident Response plan execution procedure) and see “Missing control/procedure for RC.RP-01.”
Accept if all known unmapped controls appear in output.
Priority: P0.
Dependencies: FR-MAP-009 (overlap but focusing on control absence).
	•	FR-DEV-006: Inadequate Control Addressing Subcategory
Requirement: Detect if existing controls do not fully or properly address the subcategory. For example:
	•	Control covers only part of required scope (like backups only for some systems, not all critical ones).
	•	Control design is not sufficient to meet outcome (maybe they have anti-virus but not network monitoring, leaving some detection gap).
This would often be derived from interviews and mapping:
If an interview said “we do X for half the departments only”, we know the control is insufficient coverage.
Or if multiple controls should exist and only one type exists (like respond: they have incident response plan but no training or testing of it).
Possibly we rely on interviewer to reveal weaknesses.
The system should turn those into deviations: e.g., “Subcategory DE.CM-03 (monitor personnel activity) partially addressed: user activity monitoring only covers privileged users, not all employees – leaving a gap for others.”
Or “Backups exist but are not tested – control design gap for PR.DS-11.”
Acceptance Criteria: For each subcategory that scored low due to some design shortfall, there should be a corresponding deviation description focusing on that shortfall. Many will overlap with what’s in the scoring explanation but consolidated as key findings:
e.g., “Deviation: Control Design Gap – While a vulnerability scanning process exists, it is informal and not documented, leading to inconsistent execution (ID.RA-01).”
or “Deviation: Insufficient Coverage – The access review process covers only IT systems, leaving business applications unreviewed (PR.AA-05).”
We will cross-check that the “key findings” from interview analysis (FR-INT-016) effectively become these deviation descriptions. Possibly they are one and the same in output, just categorized.
Accept if e.g., in a sample final report, we see such design level issues enumerated for areas where controls exist but have weaknesses.
Priority: P0.
Dependencies: Interview analysis results and scoring triggers (like partial coverage detection) flagged to the deviation list.
	•	FR-DEV-007: Policy vs Control Implementation Inconsistencies
Requirement: Identify if a control’s implementation deviates from what the policy or standards say. For example:
	•	Policy requires quarterly reviews, but control owner does yearly – that’s a deviation either from policy or from expected design.
	•	Policy says “all new employees receive training”, but control shows some don’t.
Essentially, if interviews or evidence show the control is not following the policy requirement.
This can come from direct Q: “Do you meet the policy frequency? No.”
Acceptance Criteria: For a given policy requirement and actual practice mismatch, a deviation should articulate it:
“Deviation: Control Not Meeting Policy – The Password Policy requires annual review of accounts, but interviews indicate reviews happen sporadically (PR.AA-05).”
Or “Policy mandates encrypted USBs, but enforcement control is not in place – removable media not technically enforced (PR.DS-01).”
We test by intentionally including an interview answer like “No, we don’t follow that policy frequency” and see if a deviation is generated highlighting that.
This will partly rely on mapping (policy mapped, control present but interview or evidence says control not effective).
Accept if at least major ones (like where we specifically asked “do you follow the policy?”) get captured.
Priority: P1 (overlap with control design issues, but specifically framing as policy compliance failure – might be slightly less prioritized if already capturing as partial control).
Dependencies: Compare interview answers with policy content – can we parse policy for requirement frequency etc? Possibly not automatically, might rely on user knowledge or question linking. We could cheat by adding direct question “Do you follow the policy as written?” if no, then we have that as a gap.
	•	FR-DEV-008: Control Design vs Interview Response Inconsistencies
Requirement: If there are multiple control owners or multiple interviews referencing the same control area with conflicting info, or a control inventory claims something that interviews contradict:
	•	e.g., Control inventory says “Control in place: yes” but control owner says “we actually stopped doing that” – that’s an inconsistency.
	•	This is similar to FR-INT-017 but focusing on control descriptions vs reality.
The system should flag such cases: essentially “Documented control says X, but practice says Y.”
Possibly output:
“Deviation: Control Implementation Deviation – Control record indicates vulnerability scans are performed monthly, but the team confirmed they have not done scans in 6 months (ID.RA-01).”
Acceptance Criteria: Provide inconsistent data in test: Mark control status “Implemented” in spreadsheet, but interview answer “No, we haven’t implemented that yet.” See if system identifies that and logs it.
This requires correlation of control inventory fields with interview Qs. If we ensured to ask about key controls, we could catch differences. Possibly out-of-scope to fully automate (maybe in future if integrated with real data).
If not explicitly implemented, perhaps skip MVP.
If implemented: maybe we do a simple check like if control sheet says Frequency=Monthly but interview says Yearly, flag.
Accept if any such discrepancy gets noted in results (especially if user themselves sees and can annotate).
Priority: P2 (could be done but requires consistent data shapes; might rely on human noticing, which is okay if we provide data).
Dependencies: Both sources of info present and mapped by control ID or name.
	•	FR-DEV-009: Controls Lacking Essential Attributes
Requirement: Detect controls that don’t have required elements of design, such as:
	•	No defined owner (if control entry missing owner).
	•	No frequency/cadence defined (maybe not in inventory or in answers).
	•	No documentation (if they have a control but not documented – partially overlaps with earlier detection but can specifically list).
	•	Also could include if a technical control missing logging or monitoring aspects (like “control exists but no monitoring to ensure it’s working” – somewhat advanced).
This basically ensures if any control is missing best-practice attributes (which hamper maturity), we flag those details.
Acceptance Criteria: Possibly compile as part of deviation details:
“Control Deficiency: The Data Backup process has no designated owner responsible (PR.DS-01).”
“Control Deficiency: Patch management procedure is informal and not documented (ID.RA-01).”
It might be more natural to incorporate in each related subcategory’s finding rather than separate. But we can also list broad ones.
If we have the control inventory where Owner or Frequency was a field and it was blank, we can directly flag that entry.
Acceptance: upload a control with blank owner, system either during ingestion warns (which is FR-ING-003 perhaps) or at least logs a deviation “Unassigned control could lead to accountability issue – control XYZ has no owner.”
That might appear under Roles category too.
Accept if such issues are either resolved at ingestion or shown in the output as something to fix.
Priority: P1 (foundation for maturity but might handle earlier; at least highlight any empty critical field).
Dependencies: Control inventory content, ingestion validation flagged maybe (if it didn’t fail an import, maybe it allowed blank owner – if allowed, then we should call it out here).
5.5.3 Control Effectiveness Deviations (Future Phase)
(Out of scope for MVP, but describe for completeness.)
	•	FR-DEV-010: Evidence-Based Testing Failures (FUTURE)
Requirement: (Future) If actual effectiveness testing was done (like checking logs or samples), identify controls that failed to operate as intended. E.g., if an automated scan discovered missing patches, or a phishing test succeeded beyond threshold.
Out-of-Scope Explanation: MVP does not perform such evidence collection, so this will not be implemented now. But in future, hooking in continuous controls monitoring or audit tests would yield deviations like “Multi-factor auth not enforced for 3 of 10 test accounts – control ineffective.”
Priority: N/A for MVP (just mark as concept for Phase 2+).
	•	FR-DEV-011: Sampling & Testing Methodology (FUTURE)
Requirement: (Future) The product would have a methodology to sample evidence (like look at 10 user accounts for recertification) and based on results, flag deviations (like “20% of accounts were not recertified – control failure”).
Out-of-Scope Explanation: MVP does not include actual evidence tests, so mention that future phases would incorporate hooking into systems and performing such tests or allowing the user to input test results.
	•	FR-DEV-012: Exception & Incident Data Integration (FUTURE)
Requirement: (Future) incorporate data from incidents or exceptions to identify where controls failed (like if an incident occurred due to control lapse, highlight that as deviation).
Out-of-Scope Explanation: MVP scope excludes integration with incident data or analysis of actual incidents. It can be considered in continuous monitoring future.
(We ensure to clearly mark these items as out-of-scope and possibly mention them in a future section like 12.2. For now just giving definitions so the PRD reader knows the difference. These likely won’t be in the MVP functional list except as placeholder.)
5.5.4 Deviation Attributes
	•	FR-DEV-013: Unique Identifier for Deviations
Requirement: Each detected deviation (finding) shall have a unique ID (like DEV-001, DEV-002 or composite ID like [Subcat]-[#]) to track and reference it. This allows easy cross-reference in reports and in tracking remediation.
Acceptance Criteria: When viewing the list of deviations, each has an ID label. For example, “DEV-PR.DS-01-1: Missing data backup policy” or a sequential “DEV-0001.” Confirm ID is unique and stable (if regenerate assessment, maybe IDs could change but within one report they should be unique).
Priority: P0 (report clarity, albeit naming is straightforward).
Dependencies: Implementation of a counter or naming scheme when populating deviations list.
	•	FR-DEV-014: Deviation Type Classification
Requirement: Deviations shall be classified by type:
	•	“Policy” vs “Control Design” (the two main from 5.5.1 and 5.5.2),
	•	possibly “Control Operation” if we differentiate design vs implementation issues,
	•	or “Documentation”, “Responsibility” etc.
At least differentiate policy-level vs control-level for clarity.
Acceptance Criteria: In the output (UI or report), each deviation entry is tagged with type, e.g., in a column or as part of description:
“Type: Policy Gap” or “Type: Control Implementation Gap”. We see these labels present and correctly reflecting the reason.
If needed, multiple tags if it falls under multiple categories (like a control with no policy covers both).
Accept if sample output clearly shows grouping or tagging by type.
Priority: P0 (explicitly required in PRD outline).
Dependencies: We have categories logically, need to attach them when we compile deviations.
	•	FR-DEV-015: Affected NIST CSF Subcategories
Requirement: Each deviation record shall list the relevant CSF Subcategory(s) it pertains to (most will be exactly one subcategory, since our analysis is subcategory-level). If a deviation spans multiple (like a general observation), maybe list all but usually tie to one.
Acceptance Criteria: Check that for each deviation, the subcategory code and name is included. E.g.:
“PR.DS-11 – Backups of data are not regularly tested (Deviation: Control Design Gap)…”
or in a structured table, a column “CSF Subcategory: PR.DS-11”. This helps trace to the framework reference.
Test that each known gap we flagged indeed correlates to a subcategory and that is correctly labeled.
Priority: P0.
Dependencies: Deviation detection is done per subcategory mostly. The data model for deviation has a field for subcategory ID.
	•	FR-DEV-016: Severity Rating for Deviations
Requirement: Each deviation should have a severity or risk impact rating (High/Medium/Low or numeric) to indicate priority. This will be used in risk ranking (5.6.1).
The severity can be calculated based on:
	•	Which function it is in (maybe Identify and Protect might often have more impact than others, but not strictly).
	•	The maturity gap (Tier1 vs Tier4 gap might not directly mean risk, but Tier1 in a crucial control likely high risk).
	•	Or the inherent risk associated: e.g., lacking incident response plan (Respond function) could be high severity.
Possibly initial approach: define a mapping of function to baseline impact or allow user to adjust severity. Or simpler, just use the risk scoring methodology from 5.6.
For MVP, we might assign a provisional severity (like high if subcategory is critical and score is very low).
Or leave severity assignment as part of risk scoring output (so maybe skip static severity here and do it in 5.6).
But since it’s listed here, perhaps we do initial rating as part of deviation attributes.
Acceptance Criteria: At least in the data model, a field for severity exists (populated by risk scoring or initial logic). In the final report, each deviation is listed with a severity label.
Check that for an obvious critical gap (like no incident response plan) we classify it as High severity in output and something minor (maybe no policy on a trivial thing) as Low. Even if this is just our judgment encoding, see it present.
Priority: P0 (since risk ranking needed severity).
Dependencies: To implement quickly, could leverage 5.6 risk score (which will likely assign a risk value and derive severity band). Possibly do after calculating risk.
	•	FR-DEV-017: Description of Deviation
Requirement: Provide a clear description for each deviation explaining what the gap is. This we have covered inherently by the examples above. It should be written in a way an auditor or manager understands:
	•	State what is missing or inconsistent, and sometimes why it’s an issue (though the ‘why’ may come in recommendations).
Usually one sentence or two.
Acceptance Criteria: We see the description field for each deviation and it matches our earlier outputs from 5.5.1/5.5.2.
E.g., “Incident response testing is not performed – the organization has an IR plan but has never conducted drills or exercises (RS.IM-02).” That clearly describes the gap.
Check that each auto-generated description is grammatically correct and factual based on analysis. Might need to ensure no double negatives or confusion.
Priority: P0.
Dependencies: Having all data to generate it; likely reuse text from FR-INT findings or FR-SCORE explanations concisely.
	•	FR-DEV-018: Evidence Supporting Deviation
Requirement: Each deviation should have supporting evidence references (so similar to score explainability but focused on proving the gap).
This means linking to the specific interview or document or mapping fact that demonstrates the gap.
In the report, we might include a footnote or inline reference (though in final PDF might not want to include raw interview text, but an internal usage yes).
Perhaps in an appendix or internal logs we keep that.
Acceptance Criteria: For a deviation in UI, if clicked, it shows something like “Source: Interview with John Doe on Incident Response – ‘We have not done any drills in past 2 years’ .” or “No control mapping found for DE.CM-02” for missing control.
In the PDF report, maybe not needed to include all references, but at least one can trace if needed.
We verify at least in system there is traceability behind scenes. Possibly in a detailed report or annex, these references appear.
Priority: P0 (ties to evidence-based approach).
Dependencies: Similar to FR-SCORE-018, reuse that data in each deviation context.
	•	FR-DEV-019: Recommended Remediation for Deviation
Requirement: For each deviation, provide a recommended remediation action or suggestion. This can be generated from the nature of the gap:
	•	If missing policy: “Draft and implement a [topic] policy covering [key points].”
	•	If missing control: “Establish a [control name/process].”
	•	If control inadequate: “Improve [control] by [some measure: documentation, expanding scope, frequency].”
Possibly from a knowledge base or template actions for common findings.
Acceptance Criteria: For example:
“Recommendation: Develop a formal Incident Response Plan and conduct regular training and drills to elevate maturity to Tier 3.”
or “Recommendation: Assign an owner for the vulnerability management process and document procedures to ensure consistent execution.”
These should align with what’s needed for next maturity tier (ties to FR-SCORE-019 improvement factors, but phrased as actionable tasks).
We test by checking if high-level each deviation has an associated recommendation in output. It might be in a separate column or combined.
Ensure they are not generic filler but specific enough (like referencing the control/policy missing).
Priority: P0 (helpful in output and demanded by PRD).
Dependencies: Possibly a library of remediation suggestions keyed by subcategory and gap type. At least we can script common ones, and maybe use LLM to generate nice phrasing.
5.6 Risk Ranking
5.6.1 Risk Scoring Methodology
	•	FR-RISK-001: Impact Assessment Criteria
Requirement: Define criteria to assess the impact of each deviation if the risk materializes. Impact could be rated High/Med/Low or numeric:
	•	Based on the function or category (Identify/Protect typically high impact if absent, Respond might be high too; or we can treat all equally and consider the organization’s context).
	•	Possibly ask user to input the business impact of certain domains if needed, but MVP can use a heuristic.
For example:
	•	Functions Identify, Protect are often preventative controls – their failure might directly allow incidents (so high impact).
	•	Respond, Recover are reactive – missing them might not cause incident but worsens outcome (still high in a different way).
Possibly all are critical but maybe we differentiate:
Could also base on subcategory: e.g., missing PR.AA (access control) likely high impact, missing GV objectives maybe medium because it’s governance (though arguable).
More systematically, we might allow weighting each function or category by inherent risk in config (maybe out-of-scope for MVP UI, but could embed known priorities).
We need a stable approach: e.g., use NIST’s notion: Identify and Protect often considered more preventive, maybe weight a bit more.
Or simpler: treat all subcategories equal impact by default, and rely on severity from maturity as proxy.
Acceptance Criteria: Document a table or rules for impact:
For instance,
	•	Functions Govern, Identify, Protect: High inherent impact if not in place (because they prevent incidents).
	•	Detect, Respond, Recover: Medium to High (lack of these means an incident might escalate, which is also high).
Actually likely all considered high in different ways, but to produce risk differentiation, we might rank within each function which categories are more critical (like Identity management vs training, identity maybe more direct security).
If using an LLM or knowledge: possibly not stable enough.
Perhaps we can gather external data (some frameworks like FFIEC or something rank control importance? Or internal default).
For MVP, maybe assign a base impact (1-5) for each Category or Subcategory. Eg, “PR.AA Identity Access Control: Impact 5 (critical)”, “PR.AT Training: Impact 3 (important but human factor unpredictable)”, etc.
Use these values in risk formula.
We accept if we have defined an impact factor for each deviation or at least for type of control missing.
Testing: Check that e.g., missing backups (Recover function) we gave an Impact maybe 4 (since data loss big but not as preventive).
Or missing firewall (Protect) Impact 5.
This is design-phase acceptance (no straightforward test unless we simulate final risk).
Priority: P0 (foundation of risk ranking).
Dependencies: Domain knowledge or default weight set.
	•	FR-RISK-002: Likelihood Assessment Criteria
Requirement: Optionally incorporate likelihood of a threat event exploiting the deviation:
	•	This is tricky without threat modelling. Possibly we can assume certain controls correspond to certain threat scenarios with baseline likelihood.
	•	Or simpler: consider all deviations as likely to be relevant (especially if they are current gaps).
If we do include likelihood, one approach:
	•	Identify link between subcategory and common threats (if missing that control, how likely is an incident? e.g., no patch management -> very likely to get exploited).
	•	Could use qualitative default (lack of preventive control = high likelihood of incident, lack of response control doesn’t increase likelihood of incident occurring, just affects impact; so we might treat detect/respond gaps as not affecting likelihood of breach but affecting impact, whereas protect gaps increase likelihood).
Possibly incorporate by adjusting risk formula rather than separate labeling.
Or we can omit explicit likelihood and just roll into severity.
Acceptance Criteria: If including:
E.g., “If deviation is a missing preventive control, assign likelihood high.” “If deviation in response, likelihood of incident not impacted, keep likelihood low but impact high.”
So risk = impact * likelihood yields something anyway.
Document that or if we skip, mention likely not separate but inherent in severity.
Perhaps define: Protect/Identify controls absent means vulnerability in defense, more likely attack success.
Detect absent doesn’t increase chance of being attacked (that’s external) but can increase damage (impact). So maybe treat those as low likelihood but high impact kind of scenario in risk calc.
We accept if we articulate this logic.
Test concept: missing vulnerability mgmt -> likely exploitation given many threats (so likely=High).
Missing incident response -> not cause incident, likely is normal, so likely= baseline (maybe not relevant).
See if risk ranking then sensibly places first one higher because highimpact vs second moderateimpact.
Not an actual run test but logical scrutiny.
Priority: P0 (for risk calc completeness, though optional in formula).
Dependencies: Risk methodology design.
	•	FR-RISK-003: Inherent vs Residual Risk Consideration
Requirement: Clarify if scoring risk inherently (assuming no controls at all? Already we are kind of measuring residual because deviations are residual issues).
Possibly out-of-scope to do actual inherent vs residual because that requires baseline risk value if controls not present.
But maybe meant to check if we consider any existing partial controls as reducing risk (which we do, since a partial deviation might have lower risk than a full gap).
The product likely deals in residual risk of current state (because it’s evaluating what’s missing in current control environment).
We should mention that risk scores reflect residual risk given current controls, thus high risk findings mean significant uncontrolled risk remains.
Possibly mention ability to incorporate inherent risk in Phase 2 with more risk quantification.
Acceptance Criteria: Document the approach: “Compliance AI’s risk ranking is based on current control gaps (residual risk). It does not separately compute inherent risk at this stage – all risk scores are effectively residual given the absence or weakness of controls, implying what risk remains.”
This satisfies this requirement by acknowledging it and maybe plan to incorporate formal inherent risk in future (like if integrated with risk register).
Accept as long as we clarify in documentation and maybe allow user to override risk if needed (that could be advanced feature, not necessarily included now).
Priority: P0 (just state context).
Dependencies: None beyond conceptual design.
	•	FR-RISK-004: Weighting Based on Function Criticality
Requirement: Possibly adjust risk scoring or ranking weighting depending on the CSF Function:
Some frameworks or clients may consider certain Functions (like Protect) more critical to risk.
We could allow weight: e.g., Protect deviations weight 1.2, Identify 1.1, Respond 1.0 (just examples).
Alternatively, incorporate into impact values per category as earlier (which might be simpler).
If not explicitly, mention that any weighting can be configured (maybe future).
Acceptance Criteria: If we do choose weights, demonstrate via an example:
If two deviations one in Protect, one in Recover with similar maturity gap, possibly rank Protect one slightly higher due to preventative nature.
If we encoded that e.g., Protect categories get +1 risk point.
Accept if the final ranked list does align with intuition (lack of firewall outranks lack of some recovery doc).
Testing out maybe not trivial, but we can conceptually verify a couple.
Possibly mark as optional config for future if not implemented directly.
Priority: P1 (fine-tuning, can skip if we baked into impact).
Dependencies: Overlap with FR-RISK-001 approach (if we set impact by function anyway, that covers it).
5.6.2 Risk Ranking Output
	•	FR-RISK-005: Risk Score Calculation for Deviations
Requirement: Compute a risk score for each deviation, likely by multiplying or otherwise combining impact and likelihood ratings (and any weighting).
Possibly scale to a convenient range (like 1-100 or 1-10).
For example:
If we use high=3, med=2, low=1 for both impact and likelihood, risk = impact * likelihood (so 1-9 scale).
Or use 5-point scales and multiply for 25-point scale.
Could also sum with weights.
Just pick one formula and apply consistently.
Acceptance Criteria: Provide formula: say, “Risk Score = Impact Rating * Likelihood Rating (on a 1-5 scale each), yielding 1-25. We then bucket these into High/Med/Low risk categories (e.g., 15+ = High, 5-14 = Medium, <5 = Low) or rank by continuous score.”
We test with hypothetical:
e.g., missing patch mgmt: impact high (5), likelihood high (5) => 25, definitely top risk.
missing formal training program: impact maybe medium (3), likelihood perhaps medium (since social engineering might still happen anyway) (3) => 9, moderate risk.
Check that these would be ordered correctly and classification sensible.
Accept if we have a clear algorithm and it yields relative differences aligning with expert gut feeling for major vs minor issues.
Priority: P0.
Dependencies: Setting of ratings from FR-RISK-001/002.
	•	FR-RISK-006: Sorted List of Deviations by Risk
Requirement: Output a list of all identified deviations sorted by descending risk score. This is the core risk-ranked finding output.
Also perhaps grouping by High/Med/Low with headings, but sorted list covers it.
Acceptance Criteria: In the UI or report, the deviations appear not in CSF order but risk order. For example:
	1.	“DEV-0007: No patch management process (High Risk)”
	2.	“DEV-0003: No incident response plan testing (High Risk)”
	3.	…
Lower risk ones later like “DEV-0010: Security awareness training not formalized (Medium Risk).”
Check that we indeed sort accordingly. If equal risk score, could keep original ordering or any stable criteria (maybe sort by risk then by function name for tie).
Accept if obvious highs come first (like missing fundamental controls).
We can simulate risk values and ensure sorting logic works.
Priority: P0.
Dependencies: Risk scores computed for all deviations.
	•	FR-RISK-007: Grouping Options
Requirement: Provide the ability to group risk findings by various factors in the UI or report for ease of analysis:
	•	By CSF Function or Category (so one can see all high risks in Identify vs Protect).
	•	By severity (list all High then Medium, etc, which is inherent in sorted but maybe separate sections).
Possibly the report can be structured that way: perhaps first an overall sorted list, then break down by function in sections.
But since specifically called grouping options:
It might mean in UI filters or ability to pivot.
E.g., filter to see all issues in Detect/Respond if someone just cares those.
Acceptance Criteria: In UI: risk deviation table has filters or sort by function/ category. Possibly a dropdown “Group by Function” which rearranges list or shows collapsible headings per function with their issues sorted within. In PDF, maybe a section per function listing issues by risk descending within it.
Accept if some demonstration of being able to see risk from a functional perspective is available. For MVP, likely minimal but maybe in report we under each Function’s analysis mention top deviations in that function.
If not fully implemented, note as a likely UI feature for future.
We’ll say grouping by function and severity in the UI is planned.
Priority: P1 (not essential but nice for large sets).
Dependencies: Data contains function for each deviation (we have subcategory which implies function). A UI component for grouping.
	•	FR-RISK-008: Filtering Capabilities
Requirement: Allow filtering the list of deviations by criteria such as:
	•	Only High severity,
	•	Only a specific function or category,
	•	Only policy vs control type,
	•	Possibly by responsible person if that data tied (like which control owner).
This is more UI, but can mention because analysis behind is trivial (just toggling visible data).
Acceptance Criteria: In the interface, user can select a filter (e.g., severity = high) and the list updates to show only those. Or checkboxes for functions to include.
If out-of-scope for MVP UI complexity, we ensure at least an export CSV is easy to filter offline.
Accept if the design acknowledges this and maybe a basic filter on severity is provided (since they specifically mention filtering).
Possibly skip deeper roles filtering for MVP.
Priority: P1.
Dependencies: UI data table library etc.
5.7 Report Generation
5.7.1 Assessment Report Structure
	•	FR-REP-001: Executive Summary Section
Requirement: The generated assessment report shall include an Executive Summary section that provides a high-level overview:
	•	Scope of assessment (NIST CSF 2.0, which org areas covered).
	•	Overall maturity tier or score summary.
	•	Key strengths and weaknesses (maybe 2-3 of each).
	•	High-level risk posture (like number of high-risk deviations).
	•	Possibly an overall graphic (like a radar chart or bar chart of function scores).
It’s targeted at senior leadership, so concise and focus on big picture and business impact.
Acceptance Criteria: The final report output has a clearly labeled Executive Summary at the start, about 1-2 pages if in a PDF. It mentions:
“Overall, the organization’s cybersecurity maturity is Tier 2 (Risk-Informed) with notable strengths in asset management and incident response planning, but significant gaps in identity management and continuous monitoring . Of the 106 CSF subcategories, the org fully meets X (Y%), partially meets Z, and has gaps in W. The risk assessment identified H high-risk, M medium-risk, and L low-risk findings. Key high-risk areas include [briefly list]. The following sections provide detailed findings and recommendations.”
It might include a table or summary chart of function-level maturity.
Accept if this section present and covers points above. We might test by generating a dummy and reading through to see it aligns.
Priority: P0.
Dependencies: Overall scoring results, risk summary. Possibly an template structure to fill.
	•	FR-REP-002: Assessment Scope & Methodology Section
Requirement: The report shall have a section describing what was assessed and how:
	•	State the framework version (NIST CSF 2.0).
	•	The scope (which business units, which IT assets, if any limitation).
	•	The methodology: e.g. “Compliance AI performed an automated assessment through document analysis, interviews, and mapping of controls. The maturity model aligns with NIST Implementation Tiers. The assessment was conducted from [start date] to [end date].”
	•	Include that it was AI-driven if desired, but likely mention use of structured interviews and evidence.
Also mention out-of-scope aspects (like no effectiveness testing done).
Acceptance Criteria: The report includes a “Scope and Methodology” section after executive summary. It might include bullet points or paragraphs covering:
“Framework: NIST CSF v2.0. Scope: Entire organization’s IT and security processes (or specify departments if limited). The assessment evaluated policies, control design, and practices as of . Method: Structured interviews with 5 control owners, review of 12 policy documents, and analysis of control inventory with 54 controls were performed. No technical control effectiveness tests were conducted (this assessment focuses on design maturity). Implementation Tiers were used to measure maturity. Profiles of current vs target were considered, etc.”
Accept if these details are present and clear.
Priority: P0.
Dependencies: Input from user about scope possibly, otherwise default to full org.
	•	FR-REP-003: Overall Maturity Summary (Visual & Table)
Requirement: Provide an overall summary of maturity by function and category, both visually (graph) and tabular:
	•	A radar/spider chart with the 6 functions and their scores (common way to show CSF profile).
	•	Alternatively, bar graphs or scorecards.
	•	A table listing each function with its Tier and perhaps each category beneath with tier.
The table likely has Function -> Category -> Score Level.
Acceptance Criteria: Confirm report has either:
a figure (like a radar chart showing e.g. Identify=2.5, Protect=2.0, etc) and/or a table like:
Function        | Category                        | Maturity Tier
Govern (GV)     | GV.OC Organizational Context    | Tier 3
                | GV.RM Risk Management Strategy  | Tier 2
                | ... (list all GV categories)
                | **Function Average**           | **Tier 2** (just example)
Identify (ID)   | ID.AM Asset Management          | Tier 2
                | ...
...
The output is fairly detailed. Possibly the main report might only show function-level and category-level in an appendix.
Acceptance: The presence of a visual chart (like radar or bar per function) indicates we succeeded for visual summary. And a table at least with function-level (if category-level too, might be in an appendix).
We might test by verifying values from scoring are correctly placed in the chart and table.
Priority: P0 (most audit reports have such summary).
Dependencies: Chart generation library (embedding static images perhaps). Data from scoring.
	•	FR-REP-004: Function-Level Maturity Ratings with Analysis
Requirement: The report should have a section for each of the 6 Functions (Govern, Identify, etc.), stating the maturity rating for that function and a narrative analysis:
	•	Summarize what is generally good or bad in that function,
	•	Possibly mention major category-level variations or major gaps.
E.g., “Identify: Rated Tier 2 (Risk-Informed). Asset inventory processes are in place but incomplete, and risk assessment activities are ad hoc. Improvement is needed in supplier risk management (Category GV.SC) which is currently partial.”
Wait, GV.SC is govern, let’s stick with each function’s categories:
For Identify, categories ID.AM, ID.RA, ID.IM - mention each briefly.
Acceptance Criteria: Check that for each function, the report contains a subsection:
e.g., “## Identify (ID) – Tier 2: Risk-Informed
Summary: The organization understands its assets and risk to a moderate extent. An asset inventory exists (Tier 2) but is not comprehensive (critical data assets are not fully cataloged). Risk assessments are performed informally without a standardized methodology (Tier 1-2). An improvement program exists conceptually but lacks formal tracking (Tier 2). Collectively, Identify is at the Risk-Informed level. Key gaps: incomplete data inventory (ID.AM-07,08) and lack of formal risk analysis documentation (ID.RA-03…).”
That would be an ideal content.
We verify that indeed each function section covers the categories within it and their statuses.
Priority: P0.
Dependencies: Category-level findings list (like we had subcategory details, need to aggregate up to talk category in narrative).
	•	FR-REP-005: Category-Level Maturity Ratings with Analysis
Requirement: Possibly within the function sections or separate, list each Category with its rating and a brief explanation.
This could be done in a table (which we have above with category ratings) and/or prose.
Likely easiest is narrative in function sections covering categories, plus maybe an appendix table with all categories and subcategory statuses.
Acceptance Criteria: Ensure somewhere we specifically call out e.g., “Asset Management (ID.AM) is Tier 2: inventories exist but are not comprehensive; Risk Assessment (ID.RA) Tier 1: very limited risk analysis done.” etc.
Accept if any category-level mention is present (which we saw in example for Identify).
We might cross-check that any category that is notably different from function average is highlighted.
E.g., if one category is much lower, do we mention it? Ideally yes (“One category within Protect – PR.PS Platform Security – lagged at Tier 1 due to missing patch management, dragging down the whole Protect function.”)
If such detail is in text, good.
Priority: P0.
Dependencies: Category scores from scoring.
	•	FR-REP-006: Subcategory-Level Findings
Requirement: The report should present detailed findings at the Subcategory level (likely in a separate section or appendix). This includes:
	•	Each subcategory ID and description,
	•	The observed maturity (maybe just indirectly via the findings text or explicit level),
	•	Specific deviation points related to it (like the deviations we listed),
	•	Possibly recommendations next to each (or recommendations separate).
This might be done as a table or bullet list per subcategory.
However, listing all ~100 subcategories would be huge; often reports filter to those with issues or major ones.
Possibly the approach: only list subcategories with deviations (gaps) in detail. The ones fully met may be omitted or summarized quickly.
But since PRD says “Subcategory-level findings”, likely meaning where there’s anything notable (particularly deviations).
We’ll interpret it as effectively listing all the deviations by subcategory.
Acceptance Criteria: In the output, probably an appendix called “Detailed Findings” where each subcategory with a gap is written with code, name, and the deviation description and recommendation.
Possibly sorted by function or risk.
Accept if we see such content. Confirm that each deviation identified in analysis appears in report with the necessary context.
E.g., a snippet:
“PR.DS-11 – Backups of data are created, protected, maintained, and tested: Tier 2 (Partial). Finding: Backups are performed but restoration tests are not conducted regularly. Impact: Without regular testing, backup failures may go undetected. Recommendation: Institute periodic backup recovery testing and document results to ensure data can be restored.”
This covers subcategory, what it is, and the gap and rec.
That may be the ideal format.
We’ll consider that success criteria.
Priority: P0 (detailed content needed for technical audience).
Dependencies: Deviation list, recommendations compiled by subcategory.
	•	FR-REP-007: Risk-Ranked Deviation List
Requirement: Include a section (likely in executive summary or right after) listing the deviations sorted by risk (the output of 5.6.2). Possibly a table of “Top Risks” with their summary and risk level.
Acceptance Criteria: The report’s risk section might present:
“Top High-Risk Findings:
1. No formal patch management process (High Risk)
2. Incomplete asset inventory for critical systems (High Risk)
…
See detailed findings section for full list.”
Perhaps a table of all findings with severity column as well but at least highlight high ones.
Accept if top issues are clearly visible in report and align with risk ranking we computed.
Priority: P0.
Dependencies: FR-RISK-005 sorted output, included in content.
	•	FR-REP-008: Detailed Deviation Findings Section
Requirement: Provide a detailed section listing each deviation (preferably grouped by severity or function). Overlaps with FR-REP-006 but focusing specifically on deviations.
Might be combined with subcategory findings if we only detail where deviations exist.
Ensure each deviation from analysis appears with enough context (like what subcategory and what risk).
Acceptance Criteria: Confirm that for each item flagged in analysis, there’s a corresponding entry in the report with description and possibly recommendation.
If FR-REP-006 covers subcategories beyond deviations too, FR-REP-008 ensures all deviations covered anyway.
Accept if each deviation known is documented.
Priority: P0.
Dependencies: Deviation data.
	•	FR-REP-009: Recommendations Section
Requirement: The report shall include a consolidated recommendations section where remediation steps are summarized, possibly prioritized.
This could be combined with the risk list or separate.
Maybe best is after listing deviations, to have a table “Recommended Actions” possibly aligned to each high/med risk or grouped by theme.
Possibly repeating what’s in each finding but can consolidate: e.g., multiple deviations about lack of documentation could be addressed by one action “Develop missing documentation for X, Y, Z.”
But automating consolidation might be complex, maybe not do that now and just list one rec per deviation.
Acceptance Criteria: The report has a section, say “Recommendations” or “Remediation Roadmap,” listing the key recommended actions.
Ideally prioritized by risk or quick wins etc. For MVP, likely just reflect each deviation’s rec.
Example entry: “Develop and implement a Patch Management Procedure (High Priority - to address missing patch control).” etc.
Accept if present and if the recommended actions match those given in deviation entries (maybe slightly reworded if needed).
Priority: P0.
Dependencies: Rec content from FR-DEV-019.
	•	FR-REP-010: Appendices (interview summaries, mapping tables, etc.)
Requirement: The report should contain appendices for supplementary data:
	•	Appendix A: The complete CSF 2.0 Subcategory reference (they requested in prompt as Appendix A).
	•	Appendix B: Sample Interview Summaries or transcripts might be included if needed (some internal might not show to all).
	•	Mapping tables (control-to-subcategory, policy-to-subcategory) for transparency if desired.
	•	Possibly the question bank sample or scoring rubric sample (they asked to include in PRD itself, but in actual report maybe not).
At least references should be available if someone wants detail.
Acceptance Criteria: The template or generated report has an “Appendices” section listing such items.
Confirm that Appendix A listing subcategories with official descriptions is present (since they asked in output to include them).
That shows thoroughness to the client that we considered all subcategories.
Also maybe an appendix of the question bank or summary responses might be too internal, we may skip or summarise “Interviews conducted with X roles, available on request” instead of full transcripts.
Accept if at least the CSF reference is included and possibly the mapping table if not already shown in main body.
Priority: P0 for CSF reference, P1 for others.
Dependencies: NIST CSF data for Appendix A (we have it from 4.1), any other data prepared.
5.7.2 Report Formats
	•	FR-REP-011: PDF Export
Requirement: The system shall generate the final assessment report in PDF format with professional formatting (cover page, headings, possibly company logo if branding allowed).
PDF is a fixed format ideal for distribution.
Acceptance Criteria: After running assessment, user can click “Export PDF” and gets a PDF file. The PDF has:
	•	Cover page with title “NIST CSF Assessment Report - [Org Name] - [Date]”.
	•	Table of contents likely given the length.
	•	All sections properly formatted (headings, tables, charts).
	•	Check a sample PDF to ensure no formatting glitches (like tables not cut off, charts visible with legends).
Possibly test generation with a moderate dataset to ensure it doesn’t break layout.
Priority: P0 (report deliverable must be PDF).
Dependencies: A reporting engine or template in a PDF library. Possibly do via HTML+CSS to PDF or a template doc to PDF conversion.
	•	FR-REP-012: DOCX Export
Requirement: Also allow Word (DOCX) export to enable further editing by users if needed.
Many consultancies might want to tweak phrasing or add commentary manually.
So the system should produce a DOCX which is similar content.
Acceptance Criteria: A “Export to Word” button yields a .docx file that when opened in Word looks similar to PDF in structure (some formatting differences allowed).
Ensure charts either come as images embedded or replaced by placeholder (or a note to paste manually if can’t auto).
But presumably possible to include charts as images in docx.
Test by opening docx and verifying content integrity (no weird markup).
Priority: P0 (for user flexibility).
Dependencies: Libraries for docx generation. Could possibly use Word template approach.
	•	FR-REP-013: Structured Data Export (JSON/CSV)
Requirement: Provide a structured data export of key results for integration.
For example:
	•	JSON containing each subcategory and its score and deviations, or
	•	CSV listing deviations with severity and IDs.
This is useful if the company wants to upload results into a risk tracking tool or do further analysis.
Acceptance Criteria: Perhaps a “Export JSON” that returns:
{
  "functions": { "ID": {"tier":2,"categories":{...}}, ... },
  "deviations": [ {"id":"DEV-001","subcategory":"PR.DS-11", "severity":"High", "description":" ...", "recommendation":" ..."}, ...]
}
Or similar structure.
Or multiple CSV:
	•	one for scores (subcategory vs tier),
	•	one for deviations list,
	•	maybe one for mapping coverage (though less needed).
At minimum, one CSV: columns for subcategory, tier, finding description, risk level, recommendation. But that might not capture all context elegantly.
JSON can be richer, CSV simpler for spreadsheets.
Accept if at least one such structured output is available. Possibly test by exporting and checking it’s parseable and correct content count.
Priority: P0 (explicitly asked likely, since integration mentioned).
Dependencies: Data in structured format, ensure no special chars break CSV (so proper quoting etc).
5.7.3 Report Customization
	•	FR-REP-014: Configurable Report Sections
Requirement: Allow the user to include or exclude certain sections in the report. For example, they may not want the interview appendix or they might want to hide some technical details for an executive audience.
Possibly a checklist before generating PDF: e.g., “Include detailed subcategory findings? Y/N”, “Include CSF reference appendix? Y/N”.
Acceptance Criteria: UI for report options exists (maybe on generation page). If user deselect “Detailed findings”, the PDF generated omits that section or moves it to internal version.
Test by toggling a setting and verifying output missing that part.
If this is too complex for MVP (it could be), then likely skip or have minimal customization like an “Executive Summary only” mode vs “Full Report”.
Could implement two templates.
Accept if at least branding / some minor toggles possible. Possibly mention it’s a roadmap feature if not done.
Priority: P1 (nice to have).
Dependencies: Template generation logic controlling content inclusion.
	•	FR-REP-015: Branding Options
Requirement: Provide ability to apply client’s branding to the report:
	•	Upload a logo to appear on cover and headers,
	•	Set colors for charts or heading highlights to match corporate style,
	•	Possibly cover page format.
This could be done via a simple config.
Acceptance Criteria: The product has somewhere to upload a logo (maybe in settings). When generating report, the logo is on the cover (and maybe small in header footers).
Perhaps colors of charts match a theme (if not config, at least not obviously off). Hard test but e.g., if user provided a custom accent color (# of company), the PDF uses that for headings.
For MVP, likely allow logo at least.
Test by uploading a sample logo and generating PDF, see it appear correctly sized.
Accept if branding is present and does not degrade formatting.
Priority: P1.
Dependencies: UI to store branding asset, template referencing it.
	•	FR-REP-016: Audience-Specific Variants
Requirement: Support generating different report versions for different audiences (like an executive summary only version vs detailed technical version).
Possibly by toggling parts (which ties to FR-REP-014).
We could have a one-click “Generate Executive Report” which produces only summary, and “Generate Full Report”.
Acceptance Criteria: If implemented, we verify two distinct outputs can be produced and each is tailored (Exec one lacks technical details, maybe just high-level and recommendations).
If not implemented, mention plan for later.
Accept if concept addressed (could be considered done if FR-REP-014 covers by including/excluding sections accordingly).
Priority: P2 (lower unless specifically demanded; likely yes given mention).
Dependencies: Section toggling or separate smaller template.
