# ADR-003 - Membership Lifecycle Strategy

**Title**: Membership Lifecycle Strategy for TenantMembership Authorization

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Domain Team, Backend Team, QA

---

## Problem Statement

FEAT-0002 requires deterministic membership state transitions and clear authorization eligibility rules.

Without a formal lifecycle decision, teams may implement inconsistent transition rules and authorization checks.

## Context

- FEAT-0002 baseline statuses: Invited, Active, Suspended, Revoked.
- Only valid membership states should authorize tenant-scoped operations.
- Transition validity must be enforced in domain layer.
- Test strategy requires explicit negative and security cases for invalid transitions.

## Decision

We will adopt the following membership lifecycle policy:

1. Allowed baseline transitions:
- Invited -> Active
- Active -> Suspended
- Suspended -> Active
- Active -> Revoked
- Invited -> Revoked

2. Revoked is terminal in baseline policy (no reactivation in-place).
3. Only `Active` membership authorizes tenant-scoped actions.
4. Missing membership or non-active status returns deny-by-default (`403`).
5. Transition commands violating the matrix return conflict semantics (`409`).

## Alternatives Considered

### Option A: Free-form transition model
- Pro: Flexible for edge business cases.
- Con: Hard to reason about and test deterministically.
- Impact: High policy drift risk.

### Option B: Strict finite-state machine (chosen)
- Pro: Deterministic, testable, and auditable.
- Con: Requires explicit exceptions through future ADRs.
- Impact: Strong baseline governance and predictable behavior.

### Option C: Terminal suspension and revocation
- Pro: Simpler implementation.
- Con: Poor operational flexibility.
- Impact: Increased support burden for legitimate reactivation scenarios.

## Consequences

Positive:
- Clear transition invariants.
- Simpler API error semantics.
- Better negative test coverage.

Constraints:
- Any new transition requires ADR update.
- Reactivation after revocation requires new membership creation flow.

## Rationale

A strict lifecycle strategy aligns with deterministic architecture and security requirements for tenant-scoped IAM behavior.

## Validation

Decision is validated when:
- Domain tests enforce transition matrix.
- Integration tests verify invalid transitions return `409`.
- Authorization tests confirm only Active status grants access.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [FEAT-0002 Request](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/00-REQUEST.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)
- [FEAT-0002 Test Strategy](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/02-TEST-STRATEGY.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
