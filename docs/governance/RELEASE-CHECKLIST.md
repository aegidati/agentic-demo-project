# Release Checklist

This document defines the checklist used to determine whether a project or feature is ready for release.

The checklist is used by developers and by the **project-auditor agent** to evaluate release readiness.

The goal is to ensure that releases are consistent with:

- architecture rules
- documentation requirements
- testing expectations
- workflow completion
- platform standards

---

# 1. Architecture Integrity

The project architecture must remain consistent with documented architecture rules.

Checklist:

- Project structure follows the expected layout
- Module boundaries are respected
- No undocumented structural changes exist
- Architecture-impacting changes are documented
- ADRs exist for significant architecture decisions

Reference documents:

docs/architecture/ARCHITECTURE-REQUIREMENTS.md  
docs/adr/ADR-INDEX.md

---

# 2. Starter Integrity

If architecture starters are used, their installation must remain valid.

Checklist:

- starters are installed in official paths
- no files have been moved outside their expected directories
- composition and infrastructure layers remain consistent
- no cross-starter structural drift is visible

Reference documents:

docs/platform/STARTER-ECOSYSTEM.md  
docs/architecture/STARTER-PACKS.md

---

# 3. Feature Workflow Completion

Features included in the release must follow the official lifecycle.

Lifecycle:

00 REQUEST  
01 PLAN  
02 TEST STRATEGY  
03 IMPLEMENTATION  
04 REVIEW  
05 DONE  

Checklist:

- the feature request is documented
- a plan exists
- testing strategy is defined
- implementation is complete
- review has occurred
- documentation is updated

Reference document:

docs/governance/AGENTIC-WORKFLOW.md

---

# 4. Documentation Completeness

Documentation must reflect the current system state.

Checklist:

- architecture documentation reflects the current structure
- relevant ADRs are recorded
- feature documentation exists
- outdated documentation has been updated
- platform documentation references remain correct

Reference documents:

docs/architecture/  
docs/adr/  
docs/features/

---

# 5. Testing Coverage

Testing expectations must be satisfied.

Checklist:

- a test strategy exists for the feature
- tests cover critical behavior
- acceptance criteria are testable
- major functionality is validated
- regression risks are addressed

Reference document:

docs/governance/DEFINITION-OF-DONE.md

---

# 6. UX Consistency

User-facing behavior must remain coherent.

Checklist:

- navigation changes are intentional and documented
- UX guidelines are respected
- user journeys remain consistent
- new UI flows do not break existing patterns

Reference document:

docs/ux/UX-GUIDELINES.md

---

# 7. Change Management

Changes must follow the project's change management rules.

Checklist:

- breaking changes are documented
- change impact is described
- documentation has been updated accordingly
- versioning implications are considered

Reference document:

docs/governance/CHANGE-MANAGEMENT.md

---

# 8. Project Structure Validation

The project structure must remain aligned with the platform.

Expected structure:

app/
  backend/
  web/
  client/
  infra/
  contracts/
  composition/

docs/
.github/

Checklist:

- project structure remains consistent
- modules remain within their intended boundaries
- documentation directories are intact
- platform files remain present

---

# 9. Release Readiness Evaluation

After performing the checklist, the release can be classified as:

Ready

All major checklist items are satisfied.

Ready with warnings

Minor issues exist but do not block release.

Not ready

Critical items are missing or inconsistent.

---

# 10. Recommended Release Audit

Before a release, run a project audit.

Example prompt:

Run a full project audit and evaluate release readiness using the release checklist.

The audit should verify:

- architecture integrity
- documentation completeness
- workflow completion
- testing readiness
- UX consistency