# AI Development Playbook

This document defines the recommended workflow for developing software using the Agentic AI-native development platform.

The platform combines:

- documentation-driven development
- modular architecture starters
- specialized AI agents
- structured project governance

This playbook explains how developers and AI agents collaborate throughout the development lifecycle.

---

# 1. Core Principles

Development in this platform follows a few core principles.

Documentation-first

Architecture and decisions must be documented before implementation.

Deterministic structure

Projects follow a consistent structure defined by the template and starter ecosystem.

Agent collaboration

AI agents assist development but follow clearly defined responsibilities.

Minimal complexity

Changes should be incremental, explicit, and traceable.

---

# 2. Project Structure

Projects created from the template follow this structure.

app/
  backend/
  web/
  client/
  infra/
  contracts/
  composition/

docs/
.github/

Architecture modules are installed through official starters.

---

# 3. Architecture Starters

Architecture is assembled using independent starter repositories.

Examples:

agentic-clean-backend  
agentic-dotnet-backend  
agentic-react-spa  
agentic-angular-spa  
agentic-flutter-client  
agentic-react-native  
agentic-api-contracts-api  
agentic-postgres-dev  
agentic-fullstack-composition  

Starters install into fixed locations inside the project.

Example mapping:

backend → app/backend  
web → app/web  
client → app/client  
contracts → app/contracts  
infra → app/infra  
composition → app/composition  

Backend and web are alternative starters per slot canonico while keeping canonical install paths unchanged.

Starter installation is managed by the **starter-installer agent**.

---

# 4. Feature Development Lifecycle

Features follow a documentation-driven lifecycle.

00 REQUEST

Feature idea or requirement is defined.

01 PLAN

Feature plan and architecture impact are evaluated.

02 TEST STRATEGY

Testing approach and acceptance criteria are defined.

03 IMPLEMENTATION

Code implementation begins.

04 REVIEW

Architecture, documentation, and tests are validated.

05 DONE

Feature meets Definition of Done.

Reference:

docs/governance/AGENTIC-WORKFLOW.md

---

# 5. AI Agent Collaboration

Development tasks are coordinated by specialized agents.

Agents collaborate but respect strict responsibility boundaries.

Starter installer

Installs architecture starters and validates project structure.

Feature orchestrator

Manages the feature lifecycle.

Architecture guardian

Protects architecture integrity and evaluates ADR requirements.

Documentation guardian

Ensures documentation completeness and quality.

Test designer

Defines testing strategies and verifies testability.

UX navigator

Ensures UX consistency and navigation coherence.

Domain template

Provides domain modeling templates and bounded context structures.

Agent responsibilities:

docs/platform/AGENT-RESPONSIBILITIES.md

Agent routing:

docs/routing/AGENT-ROUTING.md

---

# 6. Documentation System

Documentation is organized by purpose.

Architecture

docs/architecture/

Architecture Decision Records

docs/adr/

Governance and workflow

docs/governance/

Platform documentation

docs/platform/

Domain templates

docs/domain-templates/

UX guidelines

docs/ux/

Documentation routing

docs/routing/

Documentation routing rules are defined in:

docs/routing/ROUTING-MAP.md

---

# 7. Working with Copilot

When working with Copilot:

Prefer structured requests.

Example:

Plan this feature using the feature lifecycle.

Avoid vague prompts.

Bad example:

Build the backend logic for this feature.

Better example:

Plan the architecture impact of this feature and check if an ADR is required.

---

# 8. Typical Development Scenario

Example feature workflow.

Step 1

Feature request is introduced.

Feature orchestrator interprets the request.

Step 2

Architecture guardian evaluates architecture impact.

Step 3

Domain template proposes domain model changes if needed.

Step 4

Test designer defines test strategy.

Step 5

UX navigator validates UX implications.

Step 6

Documentation guardian verifies documentation completeness.

Step 7

Implementation proceeds.

---

# 9. Starter-Based Project Assembly

A new project is assembled using architecture starters.

Example setup:

backend starter (clean-backend or dotnet-backend)  
web starter (react-spa or angular-spa)  
contracts starter  
infra starter  
composition starter  

Starter installer ensures:

- correct installation paths
- deterministic project structure
- no destructive file overwrites

---

# 10. Governance and Quality Gates

Quality is enforced through governance rules.

Definition of Done

docs/governance/DEFINITION-OF-DONE.md

Change management

docs/governance/CHANGE-MANAGEMENT.md

Project constitution

docs/governance/PROJECT-CONSTITUTION.md

---

# 11. Recommended Copilot Request Patterns

Examples of effective prompts.

Install backend starter:

Install agentic-clean-backend or agentic-dotnet-backend and validate project structure.

Plan feature:

Create a feature plan for this request following the workflow.

Architecture validation:

Evaluate whether this change requires an ADR.

Documentation review:

Check whether documentation is complete for this feature.

Testing strategy:

Define the test strategy for this feature.

UX validation:

Review whether this change affects navigation or UX flows.

More request examples:

docs/routing/REQUEST-PATTERNS.md

---

# 12. Development Philosophy

The Agentic platform encourages:

clarity over speed  
documentation over assumptions  
structured workflows over ad-hoc coding  

AI agents assist development but do not replace architecture thinking.

Developers remain responsible for final decisions.