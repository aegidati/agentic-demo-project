# Agentic API Contracts API

## Purpose

This starter provides the API contract foundation for Agentic platform projects.

Its role is to define and organize the interface contracts exchanged between clients, backend services, and runtime composition layers.

---

## Install target

This starter installs into:

app/contracts

---

## Included

- API contract foundation
- Interface definition structure
- Contract-first documentation baseline
- Deterministic location for shared API specifications

---

## Not included

This starter intentionally does not include:

- Backend implementation
- Frontend API client implementation
- Domain business logic
- Infrastructure runtime configuration

Those concerns are handled by other starters.

---

## Prerequisites

Typical prerequisites:

- Contract specification standard
- Contract validation tooling
- Optional integration with backend and frontend/client starters

---

## Expected structure after installation

app/contracts

---

## Installation

1. Create a project using AGENTIC-TEMPLATE.
2. Install this starter into:

app/contracts

3. Add or validate contract files.
4. Run contract validation checks.

---

## Post-install validation

Verify that:

- contract directory exists
- contract files are present
- contract validation command runs
- contract structure is internally consistent

---

## Compatibility

Compatible with:

- agentic-clean-backend
- agentic-react-spa
- agentic-flutter-client
- agentic-fullstack-composition

---

## Exit criteria

Installation is successful when:

- app/contracts exists
- contract files are present
- validation command runs
- contract structure is consistent
- no unresolved placeholders remain

---

## Notes

This starter is intentionally implementation-agnostic.

Concrete API definitions, schemas, and client/backend integration details should be added by project-specific modules.
