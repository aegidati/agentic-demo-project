# FEAT-0003 — Platform Superadmin Governance

## Status
`In Progress`

## Summary
Introduce runtime governance capabilities for the `Superadmin` platform role. A Superadmin is the platform owner: a principal with platform-scoped privileges that are entirely separate from any tenant-scoped `TenantRole`.

## Rationale
ADR-008 accepted the `PlatformRole / Superadmin` boundary as a documented architectural constraint. MOD-01 on FEAT-0002 adopted that boundary as a governance-only baseline. This feature translates the documented design into runtime behavior: the backend must be able to store, resolve, assign, revoke, and audit platform-scope memberships.

Authoritative sources:
- `docs/adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md`
- `docs/policies/PERMISSION-MATRIX.md` — Platform Authorization Baseline section
- `docs/policies/AUTHORIZATION-PRINCIPLES.md`

## Scope

### In Scope
- Domain types: `PlatformRole`, `PlatformMembership`, `PlatformMembershipStatus`
- Application port: `PlatformMembershipRepositoryPort`
- Infrastructure adapter: `InMemoryPlatformMembershipRepositoryAdapter` with seed data
- Use-case: `PlatformGovernanceUseCase` covering list tenants, list platform members, assign/revoke Superadmin
- REST routes: `GET /platform/memberships`, `POST /platform/memberships`, `DELETE /platform/memberships/:userId`, `GET /platform/tenants`
- Audit events for assign and revoke
- Unit tests for all use-case behaviours

### Out of Scope
- Real authentication / JWT validation (remains demo mode via `x-actor-user-id` header)
- UI flows (web / client layers)
- PostgreSQL persistence (in-memory only for this increment)
- Cross-tenant governance operations beyond list

## Constraints
From ADR-008:
1. `PlatformRole` is never stored as or converted to a `TenantRole`.
2. Platform privilege does not implicitly grant `Owner`, `Admin`, `Member`, or `Viewer` in any tenant.
3. `ensureActorIsSuperadmin` must read from the IAM-owned `PlatformMembershipRepository` — not from request headers, claims, or JWT groups.
4. Assignment and revocation of `Superadmin` are auditable actions.
5. Deny-by-default: absent platform membership → `platform.access.denied`.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-01 | A Superadmin can retrieve the full list of tenants across the platform. |
| AC-02 | A Superadmin can retrieve the list of platform members (all principals with a `PlatformMembership`). |
| AC-03 | A Superadmin can assign the `Superadmin` role to another user, producing an audit event. |
| AC-04 | A Superadmin can revoke the `Superadmin` role from another user, producing an audit event. |
| AC-05 | A non-Superadmin calling any platform endpoint receives a `platform.access.denied` error (deny-by-default). |
| AC-06 | `PlatformRole` is never persisted or referenced as a `TenantRole`. |
| AC-07 | A Superadmin cannot revoke their own role (self-revoke protection). |
| AC-08 | All platform governance actions are logged via the existing `AuditEventWriterPort`. |

## Planned Increments
- INC-01: Domain types (`platform-role.ts`, extend `audit-event.ts`)
- INC-02: Port (`platform-membership-repository.port.ts`)
- INC-03: Infra adapter (`in-memory-platform-membership-repository.adapter.ts`, seed `superadmin-001`)
- INC-04: Use-case (`platform-governance.use-case.ts`)
- INC-05: Routes (`iam-platform.routes.ts`)
- INC-06: Wiring (`main.ts`)
- INC-07: Tests (`test/platform-governance.use-case.test.ts`)
