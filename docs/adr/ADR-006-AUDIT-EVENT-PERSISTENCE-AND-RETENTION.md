# ADR-006 - Audit Event Persistence and Retention

**Title**: Audit Event Persistence and Retention Strategy for IAM Governance Actions

**Status**: Proposed

**Date**: 2026-04-21

**Stakeholders**: Architecture Guardian, Backend Team, Infra Team, Compliance Stakeholders

---

## Problem Statement

FEAT-0002 requires governance-grade audit events for membership and role mutations.

Without persistence and retention policy, auditability may be incomplete, mutable, or inconsistent across environments.

## Context

- Membership and role mutations are privileged operations.
- Test strategy requires audit event presence and payload integrity.
- Architecture baseline favors deterministic, traceable behavior.

## Decision

We will persist IAM governance audit events with append-only semantics:

1. Every membership/role mutation command emits an audit event record.
2. Audit records are immutable after write (append-only).
3. Minimum payload fields: actorUserId, tenantId, targetUserId, action, occurredAt, correlationId.
4. Writes happen in the same operation boundary as successful mutations.
5. Retention baseline: keep events for at least 365 days; archival policy may extend retention.

## Alternatives Considered

### Option A: Log-only (application logs)
- Pro: Fast implementation.
- Con: Poor queryability and retention guarantees.
- Impact: Weak governance evidence.

### Option B: Dedicated append-only audit store (chosen)
- Pro: Strong traceability and deterministic access.
- Con: Requires explicit schema and storage strategy.
- Impact: Better compliance readiness.

### Option C: Best-effort asynchronous audit write
- Pro: Lower write latency.
- Con: Event loss risk on failures.
- Impact: Incomplete audit trails.

## Consequences

Positive:
- Reliable governance evidence.
- Easier incident and compliance investigation.

Constraints:
- Mutation path must include reliable event emission guarantees.
- Infra retention and archival policy must be maintained.

## Rationale

Append-only persisted auditing aligns with FEAT-0002 acceptance criteria and security posture expectations.

## Validation

Decision is validated when:
- Integration tests assert event creation for each mutation type.
- Data checks confirm required payload fields and immutability.
- Retention policy is configured and verifiable in runtime environment.

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [FEAT-0002 Request](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/00-REQUEST.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-21
