# ADR-002 - Tenant Context Resolution Strategy

**Title**: Tenant Context Resolution Strategy for FEAT-0002

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Feature Orchestrator, Backend Team, Contracts Team

---

## Problem Statement

Tenant-scoped authorization in FEAT-0002 requires deterministic resolution of the active tenant context per request.

Without a single strategy, services may infer tenant context differently, creating inconsistent authorization decisions and potential cross-tenant leakage.

## Context

- FEAT-0002 requires deny-by-default when tenant context is missing.
- Authorization decisions are backend-owned and must not rely on client assumptions.
- Existing architecture requires clear module boundaries between contracts, backend, and clients.
- ADR-001 is accepted and defines architecture baseline and governance-first execution.

## Decision

We will resolve tenant context in backend using an explicit, deterministic precedence model:

1. Required primary source: route tenant identifier (`/tenants/{tenantId}`) for tenant-scoped endpoints.
2. Optional secondary source: authenticated session tenant selection only for endpoints that do not carry route tenant explicitly.
3. If both sources are present and differ, request is rejected with conflict semantics.
4. If tenant context cannot be resolved, authorization returns deny-by-default (`403`).
5. All tenant-scoped repository queries must include resolved `tenantId` as mandatory predicate.

## Alternatives Considered

### Option A: Client-driven tenant context only
- Pro: Simple for frontend implementation.
- Con: Trust boundary violation; backend would accept unverifiable context assumptions.
- Impact: High risk of authorization inconsistency.

### Option B: Token-embedded tenant context only
- Pro: Reduces per-request context parameters.
- Con: Poor support for user switching across multiple tenants in one session.
- Impact: Reduced usability and complex token refresh strategy.

### Option C: Route-first deterministic backend resolution (chosen)
- Pro: Explicit, auditable, and endpoint-consistent.
- Con: Requires strict API contract and handler discipline.
- Impact: Strong isolation and predictable authorization behavior.

## Consequences

Positive:
- Deterministic authorization inputs.
- Easier cross-tenant isolation testing.
- Clear error semantics for missing/conflicting context.

Constraints:
- All tenant-scoped endpoints must include or resolve tenant context explicitly.
- Handlers and repositories must enforce tenant predicate invariants.

## Rationale

This decision aligns with architecture requirements for explicit boundaries and backend-enforced security decisions, while reducing ambiguity in FEAT-0002 critical authorization paths.

## Validation

Decision is validated when:
- Integration tests prove no tenant-scoped operation runs without resolved tenant context.
- Conflict tests verify mismatched contexts are rejected.
- Static review confirms all tenant-scoped repository methods require `tenantId`.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [ARCHITECTURE-REQUIREMENTS.md](../architecture/ARCHITECTURE-REQUIREMENTS.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)
- [FEAT-0002 Test Strategy](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/02-TEST-STRATEGY.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
