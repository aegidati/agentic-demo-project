# ADR Index

This document indexes all Architecture Decision Records (ADRs) for this project.

## ADRs

| ID | Title | Status | Date | Related Docs |
|----|-------|--------|------|--------------|
| 001 | Architecture Strategy | Accepted | 2026-04-16 | [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md), [ARCHITECTURE-SNAPSHOT.md](../architecture/ARCHITECTURE-SNAPSHOT.md) |
| 002 | Tenant Context Resolution Strategy | Proposed | 2026-04-21 | [ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY.md](./ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |
| 003 | Membership Lifecycle Strategy | Proposed | 2026-04-21 | [ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY.md](./ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |
| 004 | Last-Owner Protection Policy | Proposed | 2026-04-21 | [ADR-004-LAST-OWNER-PROTECTION-POLICY.md](./ADR-004-LAST-OWNER-PROTECTION-POLICY.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |
| 005 | Role Model Extensibility Policy | Proposed | 2026-04-21 | [ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md](./ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |
| 006 | Audit Event Persistence and Retention | Proposed | 2026-04-21 | [ADR-006-AUDIT-EVENT-PERSISTENCE-AND-RETENTION.md](./ADR-006-AUDIT-EVENT-PERSISTENCE-AND-RETENTION.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |
| 007 | Global User Status Precedence | Proposed | 2026-04-21 | [ADR-007-GLOBAL-USER-STATUS-PRECEDENCE.md](./ADR-007-GLOBAL-USER-STATUS-PRECEDENCE.md), [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md) |

---

## How to Add a New ADR

1. Copy [ADR-TEMPLATE.md](./ADR-TEMPLATE.md).
2. Rename to `ADR-XXX-<SHORT-TITLE>.md` (increment XXX).
3. Complete all sections.
4. Add entry to this index.
5. Reference the ADR in relevant feature documents or governance docs.

## For Template Repository

This template does NOT include concrete ADRs, only:
- **ADR-001 template** (for derived projects to customize)
- **ADR-TEMPLATE.md** (standard format)
- **This index** (tracking mechanism)

Derived projects will populate this index as they make architectural decisions.
