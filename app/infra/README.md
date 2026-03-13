# Agentic Postgres Dev

## Purpose

This starter provides the local PostgreSQL development foundation for Agentic platform projects.

Its role is to standardize local database provisioning and development-time database integration in a deterministic way.

---

## Install target

This starter installs into:

app/infra

---

## Included

- Local PostgreSQL development foundation
- Database bootstrap configuration
- Deterministic infrastructure location for development database assets

---

## Not included

This starter intentionally does not include:

- Production database provisioning
- Cloud infrastructure configuration
- Migration strategy implementation
- Business-specific schema design

Those concerns are handled by other modules or project-specific decisions.

---

## Prerequisites

Typical runtime prerequisites:

- Docker
- Docker Compose or equivalent local runtime tooling

---

## Expected structure after installation

app/infra

---

## Installation

1. Create a project using AGENTIC-TEMPLATE.
2. Install this starter into:

app/infra

3. Validate local database configuration.
4. Run development database startup checks.

---

## Post-install validation

Verify that:

- infrastructure directory exists
- database configuration files are present
- database startup command is valid
- compose configuration is valid when applicable

---

## Compatibility

Compatible with:

- agentic-clean-backend
- agentic-fullstack-composition

---

## Exit criteria

Installation is successful when:

- app/infra exists
- database configuration files are present
- startup command is valid
- compose configuration is valid
- no unresolved placeholders remain

---

## Notes

This starter is focused on development-time infrastructure only.

Production database provisioning, backups, security hardening, and cloud deployment are intentionally out of scope.
