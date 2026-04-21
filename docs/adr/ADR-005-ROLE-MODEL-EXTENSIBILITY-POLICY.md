# ADR-005 - Role Model Extensibility Policy

**Title**: Role Model Extensibility Policy for Tenant Authorization

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Contracts Team, Backend Team, Product Lead

---

## Problem Statement

FEAT-0002 defines baseline roles (Owner, Admin, Member, Viewer), but future role evolution must remain deterministic and backward compatible.

Without a policy, role additions may break contracts or create inconsistent permission semantics.

## Context

- Role enum is part of API contracts and domain logic.
- Frontend/client behavior depends on deterministic role semantics.
- Security model must remain tenant-scoped and deny-by-default.

## Decision

We will adopt a controlled extensibility model:

1. Baseline roles are fixed in current release: Owner, Admin, Member, Viewer.
2. Any new role requires ADR approval before contract change.
3. Role changes must preserve backward compatibility for existing role values.
4. Authorization checks must map roles through explicit permission matrix, not implicit ordinal comparison.
5. Self-elevation remains forbidden regardless of role additions.

## Alternatives Considered

### Option A: Free-form dynamic roles at runtime
- Pro: Maximum flexibility.
- Con: Complex governance, testing, and migration semantics.
- Impact: Increased drift risk.

### Option B: Controlled enum evolution via ADR (chosen)
- Pro: Predictable contracts and reviewable security impact.
- Con: Slower role evolution process.
- Impact: Stable cross-module behavior.

### Option C: Role ordinal hierarchy only
- Pro: Simplified comparisons.
- Con: Fragile when new roles are inserted.
- Impact: Hidden authorization bugs risk.

## Consequences

Positive:
- Deterministic role behavior across modules.
- Safer contract evolution path.

Constraints:
- New roles require ADR + contract migration.
- Permission matrix maintenance becomes mandatory.

## Rationale

The chosen model balances governance and extensibility, matching FEAT-0002 goals for deterministic and testable authorization behavior.

## Validation

Decision is validated when:
- Contract tests enforce allowed baseline role values.
- Authorization tests use explicit role-to-permission mapping.
- Any role change PR includes ADR and compatibility evidence.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)
- [FEAT-0002 Test Strategy](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/02-TEST-STRATEGY.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
