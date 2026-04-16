# Agent Responsibilities

This document defines the responsibilities of the AI agents used in the Agentic development platform.

Agents collaborate to enforce architecture, documentation quality, testing discipline, and UX consistency.

Each agent has a specific scope and should not override responsibilities owned by another agent.

---

# 1. Agent Categories

Agents are organized into three categories.

## Platform Agents

Responsible for assembling and structuring the project.

- starter-installer

## Workflow Agents

Responsible for guiding the development lifecycle.

- new-feature-agent
- feature-lifecycle-agent
- feature-orchestrator
- feature-implementer
- test-designer

## Governance Agents

Responsible for ensuring architectural and documentation integrity.

- architecture-guardian
- documentation-guardian
- domain-template-agent
- ux-navigator

---

# 2. Agent Responsibilities

## starter-installer

Purpose:

Install and assemble architecture starters into projects created from the Agentic template.

Responsibilities:

- install architecture starters
- ensure correct install paths
- detect file conflicts
- validate project structure after installation
- preserve deterministic architecture layout

Authority:

- project structure
- starter installation

---

## feature-orchestrator

Purpose:

Guide the development lifecycle of a feature using the documentation-driven workflow.

Responsibilities:

- interpret feature requests
- generate feature plans
- coordinate implementation phases
- ensure lifecycle phases are respected
- coordinate specialized feature agents at high level

Authority:

- feature lifecycle management

Related documents:

docs/governance/AGENTIC-WORKFLOW.md

---

## new-feature-agent

Purpose:

Initialize the canonical documentation skeleton for new features.

Responsibilities:

- create feature folders under `docs/features/<feature-slug>/`
- enforce kebab-case slug naming for feature folders
- initialize lifecycle files from `00-REQUEST.md` through `05-DONE.md`
- hand off initialized features to feature-orchestrator

Authority:

- feature initialization
- lifecycle skeleton creation

Related documents:

docs/governance/AGENTIC-WORKFLOW.md  
docs/governance/FEATURE-STATE-MACHINE.md  
docs/features/README.md

---

## feature-lifecycle-agent

Purpose:

Validate lifecycle progression and completeness for existing features.

Responsibilities:

- inspect lifecycle artifacts under `docs/features/<feature-slug>/`
- enforce transition prerequisites and progression order
- report current stage, missing artifacts, invalid transitions, and next allowed step
- preserve backward compatibility for implementation artifact naming

Authority:

- lifecycle validation
- transition gate enforcement

Related documents:

docs/governance/AGENTIC-WORKFLOW.md  
docs/governance/FEATURE-STATE-MACHINE.md  
docs/governance/DEFINITION-OF-DONE.md

---

## feature-implementer

Purpose:

Implement approved features from lifecycle artifacts in a deterministic, test-first, architecture-safe way.

Responsibilities:

- translate approved feature plans into incremental code changes
- implement and run feature-aligned tests
- preserve module and layer boundaries during implementation
- report blockers, assumptions, and implementation evidence
- escalate architecture-impacting changes when needed

Authority:

- feature implementation execution

Related documents:

docs/governance/AGENTIC-WORKFLOW.md  
docs/governance/DEFINITION-OF-DONE.md  
docs/architecture/ARCHITECTURE-REQUIREMENTS.md

---

## architecture-guardian

Purpose:

Ensure architectural consistency and validate architectural impact of changes.

Responsibilities:

- evaluate architecture impact
- require ADRs when needed
- verify architecture rules
- maintain architecture integrity

Authority:

- architecture decisions
- ADR requirements

Related documents:

docs/adr/ADR-INDEX.md  
docs/architecture/

---

## documentation-guardian

Purpose:

Ensure documentation remains consistent and complete.

Responsibilities:

- validate documentation coverage
- enforce documentation-first practices
- ensure feature documentation exists
- detect outdated documentation

Authority:

- documentation quality

Related documents:

docs/governance/CHANGE-MANAGEMENT.md  
docs/features/

---

## test-designer

Purpose:

Define testing strategy and ensure sufficient test coverage.

Responsibilities:

- design test strategies
- propose test cases
- ensure tests match feature behavior
- validate Definition of Done requirements

Authority:

- test strategy

Related documents:

docs/governance/DEFINITION-OF-DONE.md

---

## ux-navigator

Purpose:

Ensure consistent user experience across the application.

Responsibilities:

- review UX decisions
- enforce UX guidelines
- verify navigation consistency
- detect UX regressions

Authority:

- UX consistency

Related documents:

docs/ux/UX-GUIDELINES.md  
docs/routing/ROUTING-MAP.md

---

## domain-template-agent

Purpose:

Provide domain modeling templates for new modules or bounded contexts.

Responsibilities:

- generate domain templates
- propose domain model structures
- ensure domain consistency

Authority:

- domain structure

Related documents:

docs/domain-templates/

---

# 3. Authority Rules

If agents disagree, the following authority order applies.

Architecture authority:

architecture-guardian

Documentation authority:

documentation-guardian

Testing authority:

test-designer

UX authority:

ux-navigator

Project structure authority:

starter-installer

Feature lifecycle authority:

feature-orchestrator

Feature initialization authority:

new-feature-agent

Feature lifecycle validation authority:

feature-lifecycle-agent

Domain modeling authority:

domain-template-agent

Feature implementation execution:

feature-implementer

---

# 4. Typical Development Workflow

A typical feature workflow involves multiple agents.

Example:

1. new-feature-agent  
   initializes canonical feature lifecycle artifacts for new features

2. feature-lifecycle-agent  
   validates lifecycle completeness and allowed next transition

3. feature-orchestrator  
   coordinates high-level workflow execution

4. feature-implementer  
   executes approved implementation increments

5. architecture-guardian  
   evaluates architecture impact

6. domain-template-agent (if needed)  
   proposes domain model updates

7. test-designer  
   defines testing strategy

8. ux-navigator (if user-facing changes exist)  
   verifies UX consistency

9. documentation-guardian
   validates documentation completeness

---

# 5. When to Use Each Agent

Use starter-installer when:

- installing architecture starters
- assembling a new project

Use feature-orchestrator when:

- coordinating feature workflow at high level
- orchestrating specialized feature agents

Use new-feature-agent when:

- creating a new feature folder under docs/features
- initializing canonical lifecycle files for a new feature

Use feature-lifecycle-agent when:

- validating lifecycle progression of an existing feature
- checking missing artifacts and transition readiness

Use feature-implementer when:

- implementing approved features from REQUEST/PLAN
- executing implementation increments
- collecting test evidence
- escalating architecture impact when needed

Use architecture-guardian when:

- architecture changes
- new modules
- structural decisions

Use documentation-guardian when:

- reviewing documentation
- preparing releases

Use test-designer when:

- defining test strategies
- validating Definition of Done

Use ux-navigator when:

- reviewing UI changes
- validating navigation structure

Use domain-template-agent when:

- creating a new domain module
- defining a domain model

## project-auditor

Purpose:

Audit the repository against platform structure, documentation, workflow, architecture, and release-readiness expectations.

Responsibilities:

- validate project compliance
- detect structural drift
- identify missing documentation
- identify workflow and quality gaps
- assess release readiness

Authority:

- audit reporting
- compliance evaluation