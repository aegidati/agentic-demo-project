# ADR-004 - Last-Owner Protection Policy

**Title**: Last-Owner Protection Policy for Tenant Governance

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Backend Team, Security Reviewer

---

## Problem Statement

FEAT-0002 requires prevention of tenant ownership lockout.

Without explicit rules, remove/demotion operations may leave a tenant with zero active owners.

## Context

- Owner role is highest baseline authority in tenant scope.
- Membership and role mutations are exposed through API commands.
- Concurrency may cause race conditions during owner updates.

## Decision

We will enforce last-owner protection as an atomic invariant:

1. A tenant must always have at least one `Active` membership with role `Owner`.
2. Commands that would demote or remove the final active Owner are rejected.
3. Rejection semantics: `409 Conflict` with explicit error code.
4. Ownership transfer is valid only if resulting state still includes at least one active Owner.
5. Invariant check must run in the same transaction boundary as mutation.

## Alternatives Considered

### Option A: Soft warning only
- Pro: Minimal implementation effort.
- Con: Does not prevent lockout.
- Impact: High operational/security risk.

### Option B: Hard invariant with atomic enforcement (chosen)
- Pro: Prevents lockout deterministically.
- Con: Requires transaction-safe implementation.
- Impact: Strong tenant governance safety.

### Option C: Scheduled reconciliation job
- Pro: Simplifies write path logic.
- Con: Detects issues after they happen.
- Impact: Temporary lockout window remains.

## Consequences

Positive:
- Eliminates final-owner accidental lockout.
- Clear conflict behavior for clients.

Constraints:
- Repository/handler implementations need atomic checks.
- Concurrent mutation tests are mandatory.

## Rationale

This policy directly enforces FEAT-0002 acceptance criteria and reduces critical tenancy governance failures.

## Validation

Decision is validated when:
- Integration tests reject remove/demote final owner operations.
- Concurrency tests preserve invariant under parallel mutations.
- Audit events capture rejected attempts when applicable.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [FEAT-0002 Request](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/00-REQUEST.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
