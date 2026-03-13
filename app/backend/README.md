# Agentic Clean Backend

## Purpose

This starter provides the backend foundation for Agentic platform projects.

It implements a Clean Architecture structure separating:

- Domain
- Application
- Infrastructure
- Presentation

The goal is to provide a deterministic backend architecture that can evolve independently from UI, infrastructure, and runtime composition.

---

## Install target

This starter installs into:

app/backend

---

## Included

- Clean Architecture folder structure
- Backend bootstrap configuration
- Domain / Application / Infrastructure / Presentation layers
- Backend development entrypoint

---

## Not included

This starter intentionally does not include:

- Domain business modules
- Authentication systems
- Observability tooling
- Production infrastructure configuration
- External service integrations

Those concerns are implemented by other starters.

---

## Prerequisites

Typical runtime prerequisites:

- Python runtime
- Backend dependency manager (pip / poetry / similar)
- Optional Docker runtime for fullstack composition

---

## Expected structure after installation

app/backend
  domain
  application
  infrastructure
  presentation

---

## Installation

1. Create a project using AGENTIC-TEMPLATE.
2. Install this starter into:

app/backend

3. Install backend dependencies.
4. Run validation checks.

---

## Post-install validation

Verify that:

- backend dependencies install successfully
- backend folder structure exists
- backend boot command runs
- backend tests execute correctly

---

## Compatibility

Compatible with:

- agentic-react-spa
- agentic-flutter-client
- agentic-api-contracts-api
- agentic-postgres-dev
- agentic-fullstack-composition

---

## Exit criteria

Installation is successful when:

- app/backend exists
- architecture layers exist
- dependencies install successfully
- backend application boot command runs
- no unresolved placeholders remain

---

## Notes

This starter is intentionally minimal.

Domain logic and application services should be added through feature modules.
