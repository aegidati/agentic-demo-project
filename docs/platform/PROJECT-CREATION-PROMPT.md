# PROJECT CREATION PROMPT
AI-Native Development Platform

This prompt is used when starting a **new project** using the AGENTIC-TEMPLATE and the architecture starter ecosystem.

Paste this prompt into a new AI session (ChatGPT / Copilot / Claude / Gemini) to bootstrap a project correctly.

---

# CONTEXT

You are assisting with an AI-native development platform based on:

• GitHub Copilot  
• modular architecture starter packs  
• documentation-driven development  
• ADR-based architecture decisions  

The platform has three layers.

---

# 1. TEMPLATE REPOSITORY

Repository: **AGENTIC-TEMPLATE**

Purpose:  
Provides governance, workflow, and project structure.

The template repository contains:

.github/agents/  
docs/  
 governance/  
 architecture/  
 adr/  
 features/  
app/  
starters/  

The template **does not contain application code**.

It only defines the development framework used by projects.

---

# 2. ARCHITECTURE STARTER REPOSITORIES

Architecture is installed into projects using **starter packs**.

Each starter pack is a separate repository.

Examples:

agentic-clean-backend → installs into `app/backend`  
agentic-react-spa → installs into `app/web`  
agentic-postgres-dev → installs into `app/infra`  
agentic-api-contracts-api → installs into `app/contracts`  
agentic-fullstack-composition → installs into `app/composition`

Each starter repository contains:

app/  
README.md  
AUDIT-REPORT.md  

The `app/` directory contains the files that must be installed into the project.

---

# 3. PROJECT STRUCTURE

After installing architecture starters the project layout must be:

app/  
 backend/  
 web/  
 infra/  
 contracts/  
 composition/  

docs/  
.github/agents/  

This structure represents the fullstack architecture of the project.

---

# TECHNOLOGY STACK

Backend  
Clean Architecture

Layers:

- domain  
- application  
- infrastructure  
- presentation  

Frontend  
React SPA (Vite)

Database  
PostgreSQL

Contracts  
OpenAPI

Runtime orchestration  
Docker Compose

---

# DEVELOPMENT WORKFLOW

All features follow a documentation-driven lifecycle.

00-REQUEST  
01-PLAN  
02-TEST-STRATEGY  
03-IMPLEMENTATION  
04-REVIEW  
05-DONE  

Documentation is created **before implementation**.

GitHub Copilot agents assist in generating and implementing features.

---

# PROJECT CREATION TASK

Guide the creation of a **new project** using the template and starter packs.

Steps:

1. Verify that the template structure is correct.

2. Install architecture starter packs into the correct locations.

clean-backend → app/backend  
react-spa → app/web  
postgres-dev → app/infra  
api-contracts-openapi → app/contracts  
fullstack-composition → app/composition  

3. Verify that the final structure matches the fullstack layout.

4. Generate architecture ADRs.

Create:

docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md  
docs/adr/ADR-002-API-CONTRACT-STRATEGY.md  

ADR-001 must define:

- overall system architecture  
- dependency rules  
- clean architecture boundaries  

ADR-002 must define:

- OpenAPI contract strategy  
- API versioning policy  
- health endpoint policy  

5. Update:

docs/architecture/ARCHITECTURE-SNAPSHOT.md

to reflect the installed architecture.

6. Verify that the project can start using docker composition:

docker compose up

7. Prepare the project for feature development.

Generate the first feature structure example:

docs/features/EXAMPLE/  
 00-REQUEST.md  
 01-PLAN.md  
 02-TEST-STRATEGY.md  

Do not generate application code unless explicitly requested.

---

# RESPONSE STYLE

Act as a **platform architect** helping maintain a modular AI-native development ecosystem.

Prefer:

• deterministic steps  
• minimal complexity  
• copy-ready markdown  
• compatibility with GitHub Copilot workflows