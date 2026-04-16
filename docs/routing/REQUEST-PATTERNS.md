# Request Patterns

This document provides concrete routing examples for the AI agents of the Agentic development platform.

Its purpose is to make agent selection predictable and consistent.

For each request pattern, this document defines:

- the request type
- the primary agent
- optional supporting agents
- the authoritative documents to consult
- the expected outcome

This file complements:

- docs/routing/AGENT-ROUTING.md
- docs/routing/ROUTING-MAP.md
- docs/platform/AGENT-RESPONSIBILITIES.md

---

# 1. Bootstrap and Starter Installation Requests

## Pattern 0 — Run bootstrap prompts 00 to 09 in strict-interactive mode

Request example:

Run prompts 00 to 09 in batch, one step at a time, with PASS/FAIL gate and confirmation before moving forward.

Primary agent:

- feature-orchestrator

Supporting agents:

- project-auditor
- starter-installer
- architecture-guardian
- documentation-guardian
- new-feature-agent
- feature-lifecycle-agent

Documents to consult:

- docs/platform/prompts/00-09-bootstrap-orchestrator.prompt.md
- docs/platform/prompts/00-verify-template-base.prompt.md
- docs/platform/prompts/01-create-project-bootstrap.prompt.md
- docs/platform/prompts/02-install-starters.prompt.md
- docs/platform/prompts/03-architecture-adr-001.prompt.md
- docs/platform/prompts/04-architecture-snapshot.prompt.md
- docs/platform/prompts/05-bootstrap-status-update.prompt.md
- docs/platform/prompts/06-post-install-validation.prompt.md
- docs/platform/prompts/07-first-feature-bootstrap.prompt.md
- docs/platform/prompts/08-project-initialization-report.prompt.md
- docs/platform/prompts/09-final-gate.prompt.md

Expected outcome:

- prompts are executed sequentially (00 to 09)
- each step has explicit PASS/FAIL gate and evidence
- next step requires explicit YES/NO confirmation
- batch stops immediately on FAIL with remediation actions

---

## Pattern 1 — Install a single starter

Request example:

Install `agentic-clean-backend` or `agentic-dotnet-backend` into this project.

Primary agent:

- starter-installer

Supporting agents:

- architecture-guardian
- documentation-guardian

Documents to consult:

- docs/routing/AGENT-ROUTING.md
- docs/routing/ROUTING-MAP.md
- docs/platform/STARTER-ECOSYSTEM.md
- starter.manifest.yaml of the requested starter
- AUDIT-REPORT.md of the requested starter

Expected outcome:

- the starter is installed in the correct target path
- collisions are detected if present
- the final structure is validated
- post-install checks are reported

---

## Pattern 2 — Install multiple starters

Request example:

Assemble this project with `agentic-dotnet-backend`, `agentic-angular-spa`, `agentic-postgres-dev`, and `agentic-fullstack-composition`.

Primary agent:

- starter-installer

Supporting agents:

- architecture-guardian
- documentation-guardian

Documents to consult:

- docs/platform/STARTER-ECOSYSTEM.md
- docs/architecture/STARTER-PACKS.md
- docs/routing/AGENT-ROUTING.md
- starter manifests of all requested starters

Expected outcome:

- correct installation order is proposed or applied
- target paths are respected
- structural conflicts are reported
- project layout remains deterministic

---

## Pattern 3 — Check starter compatibility before installation

Request example:

Can I safely add `agentic-api-contracts-api` to this project?

Primary agent:

- starter-installer

Supporting agents:

- architecture-guardian

Documents to consult:

- docs/platform/STARTER-ECOSYSTEM.md
- docs/routing/AGENT-ROUTING.md
- starter.manifest.yaml
- AUDIT-REPORT.md

Expected outcome:

- compatibility is assessed
- conflicts or missing prerequisites are reported
- safe next steps are proposed

---

# 2. Feature Workflow Requests

## Pattern 4A — Initialize a new feature lifecycle skeleton

Request example:

Create feature: user authentication.

Primary agent:

- new-feature-agent

Supporting agents:

- feature-orchestrator
- documentation-guardian

Documents to consult:

- docs/governance/AGENTIC-WORKFLOW.md
- docs/governance/FEATURE-STATE-MACHINE.md
- docs/features/README.md
- docs/routing/AGENT-ROUTING.md

Expected outcome:

- a new folder is created under docs/features/<feature-slug>/
- canonical lifecycle files are initialized
- kebab-case slug rule is applied deterministically
- handoff to feature-orchestrator is explicit

---

## Pattern 4B — Validate lifecycle status and next transition

Request example:

Evaluate lifecycle status of feature user-authentication.

Primary agent:

- feature-lifecycle-agent

Supporting agents:

- feature-orchestrator
- documentation-guardian
- test-designer

Documents to consult:

- docs/governance/AGENTIC-WORKFLOW.md
- docs/governance/FEATURE-STATE-MACHINE.md
- docs/governance/DEFINITION-OF-DONE.md
- docs/features/<feature-slug>/

Expected outcome:

- current lifecycle stage is identified
- missing artifacts are listed
- invalid transitions are rejected with reasons
- next allowed step is clearly stated

---

## Pattern 4 — Start a new feature

Request example:

Plan a new feature for customer onboarding.

Primary agent:

- feature-orchestrator

Supporting agents:

- architecture-guardian
- test-designer
- documentation-guardian
- ux-navigator
- domain-template-agent

Documents to consult:

- docs/governance/AGENTIC-WORKFLOW.md
- docs/governance/DEFINITION-OF-DONE.md
- docs/routing/AGENT-ROUTING.md
- docs/routing/ROUTING-MAP.md

Expected outcome:

- the feature is mapped into the official lifecycle
- missing phases are identified
- planning artifacts are proposed
- cross-functional concerns are identified

---

## Pattern 5 — Check missing lifecycle steps

Request example:

Check whether this feature is missing workflow steps.

Primary agent:

- feature-orchestrator

Supporting agents:

- documentation-guardian
- test-designer

Documents to consult:

- docs/governance/AGENTIC-WORKFLOW.md
- docs/features/
- docs/governance/DEFINITION-OF-DONE.md

Expected outcome:

- missing lifecycle phases are identified
- missing documents are highlighted
- next actions are proposed

---

# 2.1 Feature Implementation Requests

## Pattern 6 — Implement an approved feature plan

Request example:

Implement feature-<id> based on REQUEST and PLAN artifacts.

Primary agent:

- feature-implementer

Supporting agents:

- architecture-guardian
- test-designer
- documentation-guardian
- ux-navigator (if user-facing)
- domain-template-agent (if domain model changes)

Documents to consult:

- docs/features/<feature-id>/00-REQUEST.md
- docs/features/<feature-id>/01-PLAN.md
- docs/governance/AGENTIC-WORKFLOW.md
- docs/governance/DEFINITION-OF-DONE.md
- docs/architecture/ARCHITECTURE-REQUIREMENTS.md

Expected outcome:

- implementation increments are applied
- tests are executed and reported
- architecture boundary risks are escalated
- implementation evidence is documented

---

## Pattern 7 — Review implementation readiness before merge

Request example:

Review whether this implemented feature is ready to move to DONE.

Primary agent:

- feature-implementer

Supporting agents:

- test-designer
- documentation-guardian
- architecture-guardian

Documents to consult:

- docs/features/<feature-id>/
- docs/governance/DEFINITION-OF-DONE.md
- docs/governance/AGENTIC-WORKFLOW.md
- docs/architecture/ARCHITECTURE-SNAPSHOT.md

Expected outcome:

- pass/fail readiness assessment
- missing tests/docs identified
- final go/no-go recommendation with blockers

---

# 3. Architecture Requests

## Pattern 8 — Evaluate architecture impact

Request example:

Evaluate the architecture impact of adding a new payments module.

Primary agent:

- architecture-guardian

Supporting agents:

- feature-orchestrator
- domain-template-agent

Documents to consult:

- docs/architecture/ARCHITECTURE-REQUIREMENTS.md
- docs/architecture/ARCHITECTURE-SNAPSHOT.md
- docs/adr/ADR-INDEX.md
- docs/routing/ROUTING-MAP.md

Expected outcome:

- architecture impact is explained
- affected modules or boundaries are identified
- an ADR requirement is evaluated

---

## Pattern 9 — Check if an ADR is required

Request example:

Does this change require an ADR?

Primary agent:

- architecture-guardian

Supporting agents:

- documentation-guardian

Documents to consult:

- docs/adr/ADR-INDEX.md
- docs/adr/ADR-TEMPLATE.md
- docs/architecture/ARCHITECTURE-REQUIREMENTS.md
- docs/governance/CHANGE-MANAGEMENT.md

Expected outcome:

- ADR necessity is clearly stated
- rationale is provided
- the next documentation step is identified

---

# 4. Documentation Requests

## Pattern 10 — Review documentation completeness

Request example:

Review the documentation for this feature and identify what is missing.

Primary agent:

- documentation-guardian

Supporting agents:

- feature-orchestrator
- architecture-guardian
- test-designer

Documents to consult:

- docs/features/
- docs/governance/CHANGE-MANAGEMENT.md
- docs/governance/AGENTIC-WORKFLOW.md
- docs/routing/ROUTING-MAP.md

Expected outcome:

- missing documentation is identified
- outdated or incomplete files are highlighted
- required updates are proposed

---

## Pattern 11 — Prepare documentation for release

Request example:

Check whether the project documentation is ready for release.

Primary agent:

- documentation-guardian

Supporting agents:

- test-designer
- architecture-guardian

Documents to consult:

- docs/governance/DEFINITION-OF-DONE.md
- docs/governance/CHANGE-MANAGEMENT.md
- docs/features/
- docs/adr/
- docs/architecture/

Expected outcome:

- documentation readiness is evaluated
- gaps are identified
- release blockers are reported

---

# 5. Testing Requests

## Pattern 12 — Define test strategy

Request example:

Define the test strategy for this feature.

Primary agent:

- test-designer

Supporting agents:

- feature-orchestrator
- architecture-guardian
- ux-navigator

Documents to consult:

- docs/governance/DEFINITION-OF-DONE.md
- docs/governance/AGENTIC-WORKFLOW.md
- docs/features/
- docs/ux/UX-GUIDELINES.md when user-facing behavior is involved

Expected outcome:

- test strategy is proposed
- test levels are identified
- acceptance criteria are mapped to tests

---

## Pattern 13 — Check testability of acceptance criteria

Request example:

Are these acceptance criteria testable?

Primary agent:

- test-designer

Supporting agents:

- feature-orchestrator

Documents to consult:

- docs/governance/DEFINITION-OF-DONE.md
- docs/features/

Expected outcome:

- testability issues are identified
- unclear criteria are highlighted
- stronger criteria are proposed

---

# 6. UX Requests

## Pattern 14 — Review navigation consistency

Request example:

Review the navigation consistency of this feature.

Primary agent:

- ux-navigator

Supporting agents:

- documentation-guardian
- feature-orchestrator

Documents to consult:

- docs/ux/UX-GUIDELINES.md
- docs/routing/ROUTING-MAP.md

Expected outcome:

- UX inconsistencies are identified
- navigation issues are reported
- alignment with UX rules is evaluated

---

## Pattern 15 — Validate user flow impact

Request example:

Check whether this feature changes the user journey in a problematic way.

Primary agent:

- ux-navigator

Supporting agents:

- architecture-guardian
- documentation-guardian

Documents to consult:

- docs/ux/UX-GUIDELINES.md
- docs/routing/ROUTING-MAP.md
- feature documentation if available

Expected outcome:

- impacted user flows are identified
- UX risks are reported
- mitigation suggestions are proposed

---

# 7. Domain Modeling Requests

## Pattern 16 — Create a domain template

Request example:

Create a domain template for a new customers module.

Primary agent:

- domain-template-agent

Supporting agents:

- architecture-guardian
- feature-orchestrator

Documents to consult:

- docs/domain-templates/
- docs/architecture/ARCHITECTURE-REQUIREMENTS.md
- docs/adr/ADR-INDEX.md if existing domain decisions are relevant

Expected outcome:

- a domain template is proposed
- entities, responsibilities, and structure are outlined
- alignment with architecture boundaries is checked

---

## Pattern 17 — Review domain consistency

Request example:

Review whether this new domain concept is consistent with the existing domain model.

Primary agent:

- domain-template-agent

Supporting agents:

- architecture-guardian

Documents to consult:

- docs/domain-templates/
- docs/architecture/
- relevant ADRs if present

Expected outcome:

- domain consistency issues are identified
- duplicate or conflicting concepts are highlighted
- next modeling steps are proposed

---

# 8. Cross-Cutting Requests

## Pattern 18 — Full feature readiness review

Request example:

Review whether this feature is ready to move forward.

Primary agent:

- feature-orchestrator

Supporting agents:

- architecture-guardian
- documentation-guardian
- test-designer
- ux-navigator
- domain-template-agent if domain changes exist

Documents to consult:

- docs/governance/AGENTIC-WORKFLOW.md
- docs/governance/DEFINITION-OF-DONE.md
- docs/features/
- docs/routing/AGENT-ROUTING.md
- docs/routing/ROUTING-MAP.md

Expected outcome:

- current lifecycle state is evaluated
- blockers are identified
- next required activities are listed

---

## Pattern 19 — Validate project structure after major changes

Request example:

Validate that the project structure is still consistent after these changes.

Primary agent:

- architecture-guardian

Supporting agents:

- starter-installer
- documentation-guardian

Documents to consult:

- docs/architecture/ARCHITECTURE-SNAPSHOT.md
- docs/architecture/ARCHITECTURE-REQUIREMENTS.md
- docs/platform/PLATFORM-ARCHITECTURE.md
- docs/platform/STARTER-ECOSYSTEM.md

Expected outcome:

- structural consistency is assessed
- ownership or boundary violations are reported
- corrective actions are proposed

---

# 9. Default Routing Heuristics

If the request is about installing or composing modules, use:

- starter-installer

If the request is about feature planning or workflow progress, use:

- feature-orchestrator

If the request is about creating a new feature folder and lifecycle docs, use:

- new-feature-agent

If the request is about lifecycle transition validation and completeness, use:

- feature-lifecycle-agent

If the request is about structure, boundaries, or ADRs, use:

- architecture-guardian

If the request is about missing docs or release documentation, use:

- documentation-guardian

If the request is about tests, testability, or Definition of Done from a QA perspective, use:

- test-designer

If the request is about user-facing flows or navigation, use:

- ux-navigator

If the request is about domain model structure, use:

- domain-template-agent

---

# 10. Routing Constraints

- Do not use starter-installer for feature planning.
- Do not use feature-orchestrator for starter installation.
- Do not use feature-lifecycle-agent to initialize a missing feature skeleton.
- Do not use documentation-guardian as architecture authority.
- Do not use ux-navigator for backend-only technical changes unless they affect user-facing behavior.
- Do not use domain-template-agent for implementation details outside domain modeling.