# PLATFORM ARCHITECTURE

NOTE

This document describes a reference architecture used as an example within the platform documentation.

The Agentic template itself is stack-agnostic.
Projects created from this template may adopt different technology stacks depending on the selected starter packs.

The purpose of this document is illustrative, not prescriptive.

AI-Native Development Platform

This document describes the architecture of the AI-native development platform used to create and maintain projects built with the AGENTIC ecosystem.

The platform is designed to support modular architecture, documentation-driven development, and AI-assisted workflows using GitHub Copilot.

It provides a deterministic structure that allows teams to create new projects quickly while maintaining architectural consistency.

---

# PLATFORM OVERVIEW

The platform consists of three main layers:

1. Template repository  
2. Architecture starter repositories  
3. Project repositories  

These layers work together to provide a complete development ecosystem.

Template → defines process and governance  
Starters → provide architecture modules  
Projects → assemble template + starters

---

# HIGH LEVEL PLATFORM MODEL

AGENTIC PLATFORM

Template Layer  
↓  
Starter Architecture Layer  
↓  
Project Layer  

Each layer has a clear responsibility.

---

# TEMPLATE LAYER

Repository:

AGENTIC-TEMPLATE

Purpose:

The template repository defines the development framework used by all projects.

It provides:

- governance rules
- architecture guidelines
- ADR system
- feature lifecycle
- Copilot agent prompts
- base repository structure

The template does not include application architecture.

Architecture is added later through starter packs.

---

# TEMPLATE STRUCTURE

The template repository has the following structure:

.github/  
 agents/  

docs/  
 governance/  
 architecture/  
 adr/  
 features/  
 platform/  

app/  

starters/  

Key responsibilities:

.github/agents  
Defines Copilot agents used for development workflows.

docs/governance  
Defines development rules and project policies.

docs/architecture  
Defines architecture guidelines and snapshots.

docs/adr  
Stores architecture decision records.

docs/features  
Stores feature lifecycle documentation.

docs/platform  
Documents the platform itself.

app  
Placeholder for architecture modules installed via starter packs.

starters  
Documentation about the architecture starter ecosystem.

---

# STARTER ARCHITECTURE LAYER

Architecture is provided through independent starter repositories.

Each starter repository provides a reusable architecture module.

Example starter repositories:

agentic-clean-backend  
agentic-dotnet-backend  
agentic-react-spa  
agentic-angular-spa  
agentic-flutter-client  
agentic-react-native  
agentic-postgres-dev  
agentic-api-contracts-api  
agentic-fullstack-composition  

Optional starter repositories:

agentic-observability  
agentic-auth-foundation  
agentic-domain-customers  
agentic-domain-invoices  

Starter repositories are designed to be modular and independent.

---

# STARTER REPOSITORY STRUCTURE

Each starter repository typically has this structure:

app/  
README.md  
AUDIT-REPORT.md  

The app directory contains the files that will be installed into a project.

README.md explains the architecture module.

AUDIT-REPORT.md contains results from the policy lint system that validates the starter.

---

# STARTER INSTALLATION MODEL

Starter packs are installed into projects using one of the following methods:

Copy installation  
Git subtree installation  
Git submodule installation  

The recommended approach is git subtree.

Example installation:

git subtree add --prefix=app/backend <starter-repo-url> main --squash

This installs the starter architecture into the correct project location.

---

# STANDARD PROJECT ARCHITECTURE

All projects created from the template must follow a standard architecture layout.

Starter packs are installed into the following canonical paths:

agentic-clean-backend → app/backend  
agentic-dotnet-backend → app/backend  
agentic-react-spa → app/web  
agentic-angular-spa → app/web  
agentic-flutter-client OR agentic-react-native → app/client  
agentic-postgres-dev → app/infra  
agentic-api-contracts-api → app/contracts  
agentic-fullstack-composition → app/composition  

Backend and web are alternative starters per slot canonico while keeping canonical install paths unchanged.

This ensures architectural consistency across projects.

---

# RESULTING PROJECT STRUCTURE

After installing architecture starters the project structure becomes:

app/  
 backend/  
 web/  
 client/  
 infra/  
 contracts/  
 composition/  

docs/  
.github/  

This structure represents the fullstack application architecture.

---

# TECHNOLOGY STACK

Backend  
Clean Architecture starter or .NET backend starter

Layers:

- domain  
- application  
- infrastructure  
- presentation  

Frontend  
React SPA using Vite or Angular SPA

Database  
PostgreSQL

Contracts  
OpenAPI specification

Runtime orchestration  
Docker Compose

---

# FULLSTACK RUNTIME ARCHITECTURE

The runtime system consists of multiple services.

Web Application (React SPA or Angular SPA)  
↓  
Backend API (Clean Architecture or .NET backend)  
↓  
Database (PostgreSQL)

These services are orchestrated using Docker Compose.

---

# DEVELOPMENT WORKFLOW

The platform uses a documentation-driven workflow.

Each feature follows the lifecycle:

00-REQUEST  
01-PLAN  
02-TEST-STRATEGY  
03-IMPLEMENTATION  
04-REVIEW  
05-DONE  

Documentation is created before implementation.

GitHub Copilot agents are used to generate plans, tests, and implementation.

---

# ARCHITECTURE DECISION SYSTEM

Architecture decisions are tracked using Architecture Decision Records (ADR).

Key ADR files include:

ADR-001-ARCHITECTURE-STRATEGY  
ADR-002-API-CONTRACT-STRATEGY  

These documents define the architectural boundaries and rules of the project.

---

# STARTER QUALITY CONTROL

All starter repositories must pass a policy lint audit.

The audit verifies:

- required files exist
- architecture consistency
- installability
- documentation completeness

Results are recorded in AUDIT-REPORT.md.

A starter pack is publishable only if it satisfies exit criteria defined by the audit system.

---

# DOMAIN STARTERS (OPTIONAL)

Domain starters provide reusable domain modules.

Examples:

customers  
invoices  
payments  

Domain starters may include:

- domain entities
- use cases
- OpenAPI fragments
- domain tests

These modules accelerate development of common business capabilities.

---

# PLATFORM PRINCIPLES

The platform follows several core principles.

Modularity  
Architecture components are reusable and independent.

Determinism  
Projects always follow the same structure.

Separation of concerns  
The template defines the development process while starters define architecture.

Documentation-first development  
Features and architecture are documented before implementation.

AI-native design  
The platform is optimized for use with GitHub Copilot and AI-assisted workflows.

---

# PLATFORM BENEFITS

Using this platform provides several benefits.

Rapid project creation  
New projects can be created quickly using the template.

Architecture consistency  
All projects share a consistent architecture.

Reusable architecture modules  
Starter packs allow architecture reuse across projects.

Improved collaboration  
Clear documentation and ADRs improve communication.

AI-assisted development  
The structure works well with GitHub Copilot agents.

---

# SUMMARY

The AGENTIC platform provides a structured approach to modern software development.

The ecosystem is composed of:

Template repository → defines development framework  
Starter repositories → provide architecture modules  
Project repositories → assemble template and starters into applications

This architecture enables scalable, modular, and AI-assisted development workflows.