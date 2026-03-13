# Agentic React SPA

## Purpose

This starter provides the web frontend foundation for Agentic platform projects.

It implements a React Single Page Application architecture intended for deterministic integration inside the platform ecosystem.

The goal is to provide a reusable frontend baseline that can evolve independently from backend, contracts, and runtime composition.

---

## Install target

This starter installs into:

app/web

---

## Included

- React SPA foundation
- Frontend application bootstrap
- Vite-based development structure
- Basic web app structure for UI development

---

## Not included

This starter intentionally does not include:

- Business-specific pages
- Authentication flows
- API client integration details
- Observability tooling
- Production deployment configuration

Those concerns are handled by other starters or feature modules.

---

## Prerequisites

Typical runtime prerequisites:

- Node.js runtime
- Frontend package manager (npm / pnpm / yarn)
- Optional Docker runtime for fullstack composition

---

## Expected structure after installation

app/web

---

## Installation

1. Create a project using AGENTIC-TEMPLATE.
2. Install this starter into:

app/web

3. Install frontend dependencies.
4. Run validation checks.

---

## Post-install validation

Verify that:

- frontend dependencies install successfully
- frontend build command runs
- frontend lint command runs
- frontend dev server command is valid

---

## Compatibility

Compatible with:

- agentic-clean-backend
- agentic-api-contracts-api
- agentic-postgres-dev
- agentic-fullstack-composition

---

## Exit criteria

Installation is successful when:

- app/web exists
- frontend dependencies install successfully
- frontend build command runs
- frontend lint command runs
- no unresolved placeholders remain

---

## Notes

This starter is intentionally minimal.

Application pages, routing structure, API integration, and UI modules should be extended through project-specific features.
