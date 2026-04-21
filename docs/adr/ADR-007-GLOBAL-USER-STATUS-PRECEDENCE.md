# ADR-007 - Global User Status Precedence

**Title**: Global User Status Precedence Over Tenant Membership Authorization

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Backend Team, Security Reviewer, Product Lead

---

## Problem Statement

FEAT-0002 includes both global User identity status and tenant-scoped membership status.

Without a precedence policy, services may authorize a globally-disabled user if tenant membership is Active.

## Context

- Conceptual model includes `User.globalStatus` and `TenantMembership.status`.
- Authorization requires explicit `(User, Tenant)` resolution.
- Security posture requires deny-by-default on invalid security state.

## Decision

We will enforce precedence as follows:

1. Global user status is evaluated before tenant membership authorization.
2. If global status is not authorization-eligible (for example disabled/locked), access is denied regardless of tenant membership status.
3. Tenant membership checks run only after global status passes eligibility.
4. Denial reason is returned with deterministic forbidden semantics (`403`) and traceable error code.
5. Audit decision logs must include precedence path (global-block vs tenant-block).

## Alternatives Considered

### Option A: Tenant membership only
- Pro: Simpler authorization path.
- Con: Globally disabled users may still be authorized in tenant scope.
- Impact: Security policy violation risk.

### Option B: Global-first precedence (chosen)
- Pro: Stronger security baseline and deterministic semantics.
- Con: Requires clear error and observability mapping.
- Impact: Consistent enforcement across modules.

### Option C: Tenant-first then global override
- Pro: Reuses existing tenant logic first.
- Con: Harder to reason about and audit.
- Impact: Ambiguous denial causality.

## Consequences

Positive:
- Prevents global-status bypass.
- Clear and auditable authorization path.

Constraints:
- Authorization middleware must include global user lookup.
- Tests must cover global-disabled + active-membership combinations.

## Rationale

Global-first precedence aligns with least-privilege and deny-by-default principles required by FEAT-0002.

## Validation

Decision is validated when:
- Integration tests confirm global-disabled users are always denied.
- Error semantics are consistent and deterministic.
- Audit decision logs include reason categorization.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)
- [FEAT-0002 Test Strategy](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/02-TEST-STRATEGY.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
