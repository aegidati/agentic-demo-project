# ADR-001 - Architecture Strategy

**Title**: Architecture Strategy for DemoProject Bootstrap Baseline

**Status**: Accepted

**Date**: 2026-04-16

**Stakeholders**: Project Maintainer, Architecture Guardian, Starter Installer, Documentation Guardian

---

## Problem Statement

The project must formalize a deterministic architecture baseline after bootstrap so that:

- selected runtime starters are explicit and mapped to canonical paths
- optional foundation starters are explicit and do not contaminate runtime slots
- constraints and initial design decisions are documented before feature implementation
- subsequent steps (snapshot, validation, feature lifecycle) can validate against a stable source of truth

This is a significant decision because the repository follows governance-first development and requires architecture traceability before starting real feature work.

## Context

- `PROJECT-BOOTSTRAP.yaml` is configured with profile `fullstack-stack-react-native`.
- Runtime starter installation has already populated canonical runtime paths under `app/`.
- Optional foundation adoption has been executed in documentation mode:
  - IAM foundation adopted under `docs/domain-templates/IDENTITY-ACCESS/`, `docs/policies/`, and `docs/starter/`.
  - Authentication foundation adopted under `docs/domain-templates/AUTHENTICATION/` and `docs/profiles/`.
- Foundation adoption follows manual copy/subtree-vendor posture and must not use runtime canonical paths.
- Authentication profile recipe for `fullstack-stack-react-native` is not available as an exact file in `docs/profiles/`; current reference uses closest available profile recipe (`fullstack-stack`) with explicit partial deferral.

Related governance and architecture sources:

- `docs/architecture/ARCHITECTURE-REQUIREMENTS.md`
- `docs/platform/BOOTSTRAP-RUNBOOK.md`
- `docs/governance/AGENTIC-WORKFLOW.md`

## Decision

We adopt the following initial architecture strategy.

### 1. Runtime architecture modules

Use the selected profile (`fullstack-stack-react-native`) as authoritative for runtime composition:

- Backend: `agentic-clean-backend` at `app/backend`
- Web: `agentic-react-spa` at `app/web`
- Client (mobile): `agentic-react-native` at `app/client`
- Contracts: `agentic-api-contracts-api` at `app/contracts`
- Infra: `agentic-postgres-dev` at `app/infra`
- Composition: `agentic-fullstack-composition` at `app/composition`

Runtime modules remain confined to canonical `app/*` targets.

### 2. Optional foundation modules

Adopt documentation-first foundations without runtime installation:

- `agentic-iam` adopted as optional IAM domain/governance baseline.
- `agentic-auth-foundation` adopted as optional authentication domain/profile baseline.

Foundation assets stay in documentation and governance locations (for example `docs/domain-templates/`, `docs/policies/`, `docs/profiles/`, `docs/starter/`) and are not installed into runtime canonical slots.

### 3. Initial cross-cutting architecture decisions

- Layering follows architecture requirements: presentation -> application -> domain -> infrastructure, with framework-agnostic domain.
- Authentication and authorization are separated concerns:
  - authentication baseline from AUTHENTICATION foundation
  - authorization and tenant-scoped permissions from IDENTITY-ACCESS foundation
- Tenant-scoped authorization remains deny-by-default when tenant context or valid membership is missing.
- Runtime implementation details (provider SDK wiring, persistence details, enforcement middleware specifics) are deferred to feature lifecycle artifacts and follow-up ADRs.

### 4. Deliberate exclusions at bootstrap stage

- No provider-specific production integration is finalized yet (for example concrete IdP registration details).
- No final token/session implementation strategy is committed yet.
- No direct code-level coupling to foundation starter structures is introduced at this stage.

## Alternatives Considered

### Option A: Runtime-only baseline, no foundation adoption
- Pro: lower documentation surface at bootstrap time.
- Con: loses IAM/auth domain alignment and ADR seeds that reduce ambiguity.
- Impact: higher risk of inconsistent identity and authentication decisions across modules.

### Option B: Install foundation assets into `app/*` runtime slots
- Pro: apparently centralized placement.
- Con: violates platform boundaries; foundations are documentation-first, not runtime starters.
- Impact: boundary drift and governance non-compliance.

### Option C: Defer ADR-001 until after first feature
- Pro: less upfront documentation effort.
- Con: contradicts governance-first bootstrap sequence and removes stable architectural reference for steps 04-06.
- Impact: weaker traceability and more rework risk.

## Consequences

Positive outcomes:

- deterministic, auditable architecture baseline aligned to canonical paths
- explicit separation between runtime modules and foundation guidance
- improved clarity for upcoming snapshot, validation, and feature planning

Trade-offs and constraints:

- partial deferral remains on profile-specific auth recipe exact match (`fullstack-stack-react-native`)
- additional ADRs are required to resolve authentication and IAM seeds before implementation hardening
- teams must maintain consistency between foundations and runtime implementation choices

## Rationale

This decision aligns with `docs/architecture/ARCHITECTURE-REQUIREMENTS.md` by preserving separation of concerns, explicit boundaries, and documentation traceability.

It also aligns with runbook governance by:

- using canonical runtime paths for runtime starters
- keeping foundation adoption manual/documentation-first
- recording unresolved decisions explicitly instead of hiding them

## Validation

The decision is considered valid when:

- runtime modules are present only in canonical `app/*` slots
- no foundation starter assets are forced into runtime slots
- architecture snapshot reflects this ADR without contradiction
- post-install checks pass with unresolved items explicitly documented as deferred where applicable
- follow-up ADRs are created for promoted authentication and IAM seed decisions

## References

- [ARCHITECTURE-REQUIREMENTS.md](../architecture/ARCHITECTURE-REQUIREMENTS.md)
- [ARCHITECTURE-SNAPSHOT.md](../architecture/ARCHITECTURE-SNAPSHOT.md)
- [BOOTSTRAP-RUNBOOK.md](../platform/BOOTSTRAP-RUNBOOK.md)
- [AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md)
- [PROJECT-BOOTSTRAP.yaml](../../PROJECT-BOOTSTRAP.yaml)
- [IDENTITY-ACCESS Domain Model](../domain-templates/IDENTITY-ACCESS/DOMAIN-MODEL.md)
- [AUTHENTICATION Domain Model](../domain-templates/AUTHENTICATION/DOMAIN-MODEL.md)

---

**Decision Made By**: Project Bootstrap Workflow (Architecture Guardian)
**Reviewed By**: Repository Maintainer
**Approved On**: 2026-04-16
