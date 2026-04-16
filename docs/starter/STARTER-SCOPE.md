# Starter Scope

## What This Starter Provides

AGENTIC-IAM provides a reusable Identity & Access domain foundation for the Agentic ecosystem.

It includes:

- standardized domain terminology
- a baseline multi-tenant business model
- tenant-scoped authorization principles
- a Permission matrix seed
- reusable feature definitions for derived projects
- ADR seeds for unresolved design decisions
- starter-consumption and installation guidance

## What This Starter Intentionally Does Not Provide

This starter does not provide:

- runtime backend services
- frontend user interfaces
- API contracts
- persistence schemas
- infrastructure templates
- identity provider integrations
- enforcement middleware

## How Downstream Projects Should Use It

Downstream projects should treat this repository as a domain/foundation starter.

The supported adoption posture is manual: copy the starter documentation or vendor it as a subtree, then promote the content into project-owned artifacts.

Recommended use:

1. adopt the documentation set as the IAM baseline for the project
2. convert feature seeds into backlog items
3. convert ADR seeds into project decisions
4. map the Permission and policy baseline into the chosen runtime architecture
5. preserve architecture agnosticism in shared domain artifacts where possible

## Scope Statement

AGENTIC-IAM is a domain/foundation starter, not a runtime stack starter. Its purpose is to standardize Identity & Access concepts before implementation choices are made.
