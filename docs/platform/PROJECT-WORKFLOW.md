# Agentic Project Workflow

This document defines the **official prompt workflow** for projects created with the **agentic-project-template**.

It describes the exact sequence of prompts used to:

- initialize a project
- install starter repositories
- define architecture
- start feature development
- manage the feature lifecycle

This file acts as the **operational manual** of the template.

---

# Copilot Execution Modes

Copilot supports two execution modes.

| Mode | Purpose |
|-----|-----|
ASK | analysis, planning, validation |
AGENT | modifying files, installing components, implementing code |

General rule:

- **ASK = reasoning**
- **AGENT = repository changes**

---

# Project Initialization Workflow

This sequence must be executed **after creating a repository from the template**.

| Step | Mode | Prompt | Purpose |
|-----|-----|-----|-----|
1 | ASK | Verify that the agentic project template structure is valid and ready for project initialization. | Confirms that the template structure is correct. |
2 | AGENT | Initialize the project bootstrap and create the project manifest. | Creates the bootstrap configuration of the project. |
3 | AGENT | Install the required starter repositories for this project following the platform starter conventions. | Installs the starter repositories. |
4 | ASK | Create ADR-001 describing the architecture strategy for this project. | Defines the architecture strategy. |
5 | ASK | Create or update the architecture snapshot for the current project structure. | Creates the architecture snapshot. |
6 | AGENT | Update the bootstrap status after architecture initialization. | Updates the project bootstrap status. |
7 | ASK | Validate that the project structure, architecture and starters are correctly installed. | Validates the project initialization. |
8 | ASK | Bootstrap the first feature of the project. | Initializes the first feature lifecycle. |
9 | ASK | Generate the project initialization report. | Generates the project initialization report. |

---

# Strict-Interactive Bootstrap Orchestrator (00 to 09)

For deterministic bootstrap execution with explicit gates, use:

docs/platform/prompts/00-09-bootstrap-orchestrator.prompt.md

This orchestration mode enforces:

- sequential execution of prompts 00 to 09
- one step at a time
- explicit PASS/FAIL gate per step with evidence
- explicit user confirmation (YES/NO) before the next step
- immediate stop on FAIL with remediation actions
- explicit continuation question: "Proceed to next step (YES/NO)?"

---

# Starter Installation

Starter repositories contain the **initial application code**.

Starter selection is profile-first:

- `project.profile` is the recommended default mechanism.
- `starters:` is an explicit manual override layer.
- `starter-installer` resolves profile starters first, then applies manual overrides.
- Backward compatibility is preserved for projects that use only `starters:`.

They are installed in the following canonical directories:

app/backend  
app/web  
app/client  
app/contracts  
app/infra  
app/composition  

The template itself **does not contain application code**.

---

# Architecture Artifacts

After initialization the project should contain:

docs/adr/ADR-001-architecture-strategy.md  
docs/architecture/ARCHITECTURE-SNAPSHOT.md  
PROJECT-BOOTSTRAP.yaml  

These files define:

- architecture strategy
- system structure
- project bootstrap configuration

---

# Feature Development Lifecycle

Every feature follows a structured lifecycle.

| Step | Mode | Prompt | Purpose |
|-----|-----|-----|-----|
1 | ASK | Create feature: <feature-name> | Creates the feature lifecycle structure. |
2 | ASK | Evaluate lifecycle status of feature <feature-slug> | Evaluates the lifecycle stage. |
3 | ASK | Review the PLAN and TEST STRATEGY for feature <feature-slug> and confirm readiness for implementation. | Validates planning and testing strategy. |
4 | AGENT | Implement feature <feature-slug> according to the implementation log and project architecture. | Implements the feature. |
5 | ASK | Evaluate lifecycle status of feature <feature-slug> and confirm if it can move to REVIEW. | Checks if the feature is ready for review. |
6 | ASK | Perform a feature review for <feature-slug> following the project governance rules. | Performs the technical review. |
7 | ASK | Evaluate lifecycle status of feature <feature-slug> and confirm if it satisfies Definition of Done. | Validates completion requirements. |
8 | AGENT | Finalize feature <feature-slug> and update DONE documentation. | Closes the feature lifecycle. |

---

# Feature Structure

Each feature creates the following directory:

docs/features/<feature-slug>/

With the lifecycle artifacts:

00-REQUEST.md  
01-PLAN.md  
02-TEST-STRATEGY.md  
03-IMPLEMENTATION-LOG.md  
04-REVIEW.md  
05-DONE.md  

---

# Lifecycle Rules

Feature governance rules:

1. Feature names must use **kebab-case**.
2. Implementation cannot start without:
   - PLAN
   - TEST STRATEGY
3. REVIEW requires completed implementation.
4. DONE requires:
   - approved review
   - Definition of Done validation.

---

# Complete Workflow Overview

Create repository from template  
↓  
Verify template structure  
↓  
Initialize project bootstrap  
↓  
Install starter repositories  
↓  
Create ADR-001  
↓  
Create architecture snapshot  
↓  
Validate project initialization  
↓  
Bootstrap first feature  
↓  
Develop features following lifecycle  

---

# Most Common Prompts

These prompts are used frequently during development.

Create feature: <feature-name>

Evaluate lifecycle status of feature <feature-slug>

Implement feature <feature-slug>

Perform a feature review for <feature-slug>

---

# Workflow Objective

This workflow ensures that every project created from the template:

- maintains explicit architecture
- follows a structured feature lifecycle
- keeps documentation, code and governance aligned

The template therefore acts as a **governed development platform**, not only as a repository scaffold.