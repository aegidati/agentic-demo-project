# STARTER ECOSYSTEM
AI-Native Development Platform

This document describes the architecture starter ecosystem used by projects created from the **AGENTIC-TEMPLATE**.

The goal of the starter ecosystem is to provide **modular, reusable architecture components** that can be installed into projects in a deterministic and repeatable way.

The template defines the **development process and governance**, while starter packs provide the **technical architecture**.

---

# OVERVIEW

The platform is composed of three layers:

1. Template repository  
2. Architecture starter repositories  
3. Project repositories  

The relationship between these layers is:

Template → defines development framework  
Starters → provide architecture modules  
Projects → assemble template + starters

---

# TEMPLATE REPOSITORY

Repository:

AGENTIC-TEMPLATE

Purpose:

Provide the development framework for projects.

The template includes:

- governance rules
- architecture guidelines
- ADR decision system
- feature lifecycle
- Copilot agents
- base project structure

The template **does not include application architecture or runtime components**.

Architecture is added using starter packs.

---

# STARTER REPOSITORIES

Architecture is provided through **independent starter repositories**.

Each starter repository contains a reusable architecture module that can be installed into a project.

Example starter repositories:

agentic-clean-backend  
agentic-dotnet-backend  
agentic-react-spa  
agentic-angular-spa  
agentic-flutter-client  
agentic-postgres-dev  
agentic-api-contracts-api  
agentic-fullstack-composition  

Foundation starter repositories may also exist:

agentic-iam

Optional starters may also exist:

agentic-observability  
agentic-auth-foundation  
agentic-domain-customers  
agentic-domain-invoices  

Starter categories in the platform include:

- Backend
- Frontend
- Contracts
- Infrastructure
- Composition
- Foundation

Each starter repository typically contains:

app/  
README.md  
AUDIT-REPORT.md  

The `app/` directory contains the files that will be installed into the project.

---

# STARTER INSTALLATION MODEL

Starter packs are installed into projects using one of the following approaches:

1. Copy installation  
2. Git subtree installation  
3. Git submodule installation  

The recommended approach is **git subtree**.

Example:

git subtree add --prefix=app/backend <repo-url> main --squash

This installs the starter into the correct location while preserving the ability to update it later.

After starter installation, run the template post-install validation workflow.
Projects derived from this template inherit validation scripts and launcher from the template.
Validation is starter-aware and evaluates only selected or installed modules.

---

# STANDARD INSTALL LOCATIONS

All projects must follow the same architecture layout for runtime starters.

Starter packs are installed into these canonical paths.

agentic-clean-backend → app/backend  
agentic-dotnet-backend → app/backend  
agentic-react-spa → app/web  
agentic-angular-spa → app/web  
agentic-flutter-client → app/client  
agentic-postgres-dev → app/infra  
agentic-api-contracts-api → app/contracts  
agentic-fullstack-composition → app/composition  

Backend and web are alternative starters per slot canonico while preserving the same install paths.

Foundation starters use a manual-adoption model and are not installed into a fixed runtime slot under `app/`.

Example:

agentic-iam → manual copy or subtree-vendor (docs + governance artifacts)

This layout ensures that all projects share a consistent architecture.

---

# RESULTING PROJECT STRUCTURE

After installing the architecture starters a project should have the following layout.

app/  
 backend/  
 web/  
 client/  
 infra/  
 contracts/  
 composition/  

docs/  
.github/agents/  

This structure represents the fullstack runtime architecture.

Foundation starters complement this structure through domain and governance artifacts.

---

# STARTER RESPONSIBILITIES

Each starter pack has a clear architectural responsibility.

clean-backend  
Provides the backend service using Clean Architecture.

Layers:

- domain
- application
- infrastructure
- presentation

react-spa  
Provides the frontend application using React and Vite.

dotnet-backend  
Provides the backend service using .NET architecture conventions.

angular-spa  
Provides the frontend application using Angular.

agentic-flutter-client  
Provides a cross-platform client application using Flutter.

agentic-postgres-dev  
Provides a PostgreSQL development environment.

agentic-api-contracts-api  
Defines the API contracts using OpenAPI.

agentic-fullstack-composition  
Provides Docker Compose orchestration for the full system.

---

# ARCHITECTURE PRINCIPLES

The starter ecosystem follows several architectural principles.

Modularity  
Each architecture component is independent and reusable.

Determinism  
Projects assembled from starters always follow the same structure.

Separation of concerns  
Template defines process while starters define architecture.

Documentation-driven development  
Architecture and features are defined in documentation before implementation.

AI-assisted development  
The architecture is optimized for use with GitHub Copilot and AI agents.

---

# STARTER QUALITY CONTROL

Each starter repository must include:

README.md  
Documentation explaining the architecture module.

AUDIT-REPORT.md  
Generated using the policy lint system.

The audit report verifies:

- required files
- architecture consistency
- installability
- documentation completeness

Starter packs are considered **publishable only if audit exit criteria are satisfied**.

---

# STARTER EVOLUTION

Starter repositories evolve independently from projects.

When a starter pack is updated:

Projects can pull the update using git subtree.

Example:

git subtree pull --prefix=app/backend <repo-url> main --squash

This allows architecture improvements to propagate across projects.

---

# OPTIONAL DOMAIN STARTERS

Domain starters provide reusable domain modules.

Examples:

customers domain  
invoices domain  
payments domain  

These modules include:

- domain entities
- use cases
- OpenAPI contract fragments
- domain tests

Domain starters accelerate development of common business capabilities.

---

# RELATIONSHIP BETWEEN TEMPLATE AND STARTERS

The template and starter packs have clearly separated responsibilities.

Template provides:

- development process
- governance
- ADR system
- feature lifecycle
- Copilot agents

Runtime starter packs provide:

- architecture modules
- runtime services
- infrastructure configuration

Foundation starter packs provide:

- domain language baselines
- policy and governance baselines
- ADR seed guidance for downstream projects

Projects combine both layers to produce a full application.

---

# PLATFORM PHILOSOPHY

This ecosystem is designed to support **AI-native development**.

The architecture is optimized for:

- GitHub Copilot
- documentation-driven workflows
- modular architecture reuse
- deterministic project structure

The result is a platform where new projects can be created quickly while maintaining architectural consistency.

---