# Consumption Guide

## Purpose

This guide explains how downstream projects should adopt AGENTIC-IAM as a reusable Identity & Access foundation.

This guide assumes the authoritative supported consumption model is manual copy or subtree-style vendoring.

## Step-By-Step Adoption

1. Review the scope in [docs/starter/STARTER-SCOPE.md](STARTER-SCOPE.md) to confirm that a domain/foundation starter is what the project needs.
2. Copy the IAM documentation set into the target repository using a copy-based or subtree-style approach.
3. Keep the core terms User, Tenant, TenantMembership, TenantRole, Permission, and AuditEvent stable unless the project records a deliberate change.
4. Review [docs/domain-templates/IDENTITY-ACCESS/DOMAIN-MODEL.md](../domain-templates/IDENTITY-ACCESS/DOMAIN-MODEL.md) and align the project's business language with it.
5. Convert [docs/domain-templates/IDENTITY-ACCESS/FEATURES-CATALOG.md](../domain-templates/IDENTITY-ACCESS/FEATURES-CATALOG.md) into project-specific feature work.
6. Promote the seeds in [docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md](../domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md) into project ADRs.
7. Use [docs/policies/AUTHORIZATION-PRINCIPLES.md](../policies/AUTHORIZATION-PRINCIPLES.md) and [docs/policies/PERMISSION-MATRIX.md](../policies/PERMISSION-MATRIX.md) as the baseline for project-specific enforcement design.
8. Derive runtime implementation work only after the business model, policy baseline, and key ADRs are explicit.

## How To Copy Or Adopt The Domain Template

The recommended adoption unit is the entire documentation set under docs/domain-templates/IDENTITY-ACCESS plus the policy and starter guidance documents.

Teams may then:

- keep the files in a starter-derived location and reference them directly
- promote them into project-owned documentation locations
- split them into backlog, ADR, and policy assets while preserving traceability to the original starter

## How To Map This Starter Into Project Features And ADRs

- map each IAM feature seed into a project feature, epic, or workstream
- convert each ADR seed into a real decision record with project context
- record any deviations from the baseline Permission matrix or TenantRole assumptions
- ensure any ownership-transfer or last-owner policy is explicitly decided before sensitive workflows are implemented

## How To Derive Project-Specific IAM Implementation Work

Derived implementation work should be framed from the starter, not guessed independently.

Examples of implementation work categories:

- authentication integration choices
- tenant context resolution flows
- authorization enforcement model
- membership lifecycle workflows
- audit persistence and reporting
- ownership transfer safeguards

This starter intentionally avoids prescribing how those categories are implemented.

## How To Keep The Domain Template Architecture-Agnostic

- avoid replacing business terms with framework-specific labels
- avoid embedding API, database, or UI assumptions into shared domain documents
- document runtime choices in project ADRs rather than mutating the starter baseline casually
- preserve the separation between domain guidance and implementation details
