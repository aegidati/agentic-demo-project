# Architecture Snapshot

## Current Architecture

**Status**: Bootstrap baseline established

**Profile Source**: `fullstack-stack-react-native` from `PROJECT-BOOTSTRAP.yaml`

## Runtime Modules (Canonical Paths)

Installed runtime modules are aligned to canonical paths and no alternative runtime paths are used.

| Slot | Starter | Canonical Path |
|------|---------|----------------|
| backend | agentic-clean-backend | `app/backend` |
| web | agentic-react-spa | `app/web` |
| client | agentic-react-native | `app/client` |
| contracts | agentic-api-contracts-api | `app/contracts` |
| infra | agentic-postgres-dev | `app/infra` |
| composition | agentic-fullstack-composition | `app/composition` |

## Optional Foundation Modules (Documentation-First)

Foundation adoption is manual (copy/subtree-vendor model) and does not use runtime canonical `app/*` slots.

| Foundation | Status | Locations |
|------------|--------|-----------|
| AGENTIC-IAM (`agentic-iam`) | adopted | `docs/domain-templates/IDENTITY-ACCESS/`, `docs/policies/`, `docs/starter/` |
| AGENTIC-AUTH-FOUNDATION (`agentic-auth-foundation`) | adopted (with partial deferral) | `docs/domain-templates/AUTHENTICATION/`, `docs/profiles/` |

Partial deferral currently tracked:

- missing exact profile recipe file `docs/profiles/fullstack-stack-react-native.md`
- temporary closest reference: `docs/profiles/fullstack-stack.md`

## Architecture Decisions Baseline

Primary decision source:

- [ADR-001-ARCHITECTURE-STRATEGY.md](../adr/ADR-001-ARCHITECTURE-STRATEGY.md)

Baseline decisions applied:

- runtime composition follows the selected profile and canonical paths only
- layering follows architecture requirements (presentation -> application -> domain -> infrastructure)
- authentication and authorization are separated concerns
- tenant-scoped authorization remains deny-by-default without valid tenant context and membership
- unresolved authentication and IAM seed decisions are tracked for follow-up ADR promotion

## Layering Model

The project applies the standard layering model from [ARCHITECTURE-REQUIREMENTS.md](./ARCHITECTURE-REQUIREMENTS.md):

1. Presentation/UI layer
2. Application/Agent layer
3. Domain/Business layer
4. Persistence/Infrastructure layer

## Data and Contracts (Bootstrap State)

- contracts module is installed at `app/contracts`
- infra module for development database baseline is installed at `app/infra`
- concrete runtime schema and migration conventions are deferred to module implementation and feature lifecycle artifacts

## Constraints and Deliberate Exclusions

- no foundation assets may be moved into runtime canonical slots
- no provider-specific production authentication wiring is finalized at bootstrap stage
- no architecture deviations from canonical path mapping are allowed without a new ADR

## Conformance Checklist

✓ Aligned with [ARCHITECTURE-REQUIREMENTS.md](./ARCHITECTURE-REQUIREMENTS.md)
✓ Aligned with [ADR-001-ARCHITECTURE-STRATEGY.md](../adr/ADR-001-ARCHITECTURE-STRATEGY.md)
✓ Runtime modules mapped only to canonical paths
✓ Optional foundations adopted in documentation-first mode (outside runtime slots)

---

**Last Updated**: 2026-04-16
**Approved By**: Bootstrap workflow baseline (pending final gate confirmation)
