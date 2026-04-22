# FEAT-0003 — Platform Superadmin Governance: Implementation Plan

## Feature Reference
`docs/features/FEAT-0003-PLATFORM-SUPERADMIN-GOVERNANCE/00-REQUEST.md`

## ADR References
- ADR-008: Platform Superadmin Boundary (Accepted)
- ADR-005: Role Model Extensibility Policy (Amended — rules 6/7/8 added)

## Architecture Layer Map

```
presentation/http/routes/
  iam-platform.routes.ts              ← INC-05

application/use-cases/iam/
  platform-governance.use-case.ts     ← INC-04

application/ports/iam/
  platform-membership-repository.port.ts  ← INC-02

infrastructure/iam/
  in-memory-platform-membership-repository.adapter.ts  ← INC-03

domain/iam/
  platform-role.ts                    ← INC-01
  audit-event.ts (extend)             ← INC-01

main.ts (wiring)                      ← INC-06
test/platform-governance.use-case.test.ts  ← INC-07
```

## Increments

### INC-01 — Domain Types
**Files**:
- `src/domain/iam/platform-role.ts` (new)
- `src/domain/iam/audit-event.ts` (extend)

**Scope**:
- Introduce `PlatformRole = 'Superadmin'`
- Introduce `PlatformMembershipStatus = 'Active' | 'Revoked'`
- Introduce `PlatformMembership` interface: `{ userId, role, status, assignedAt, updatedAt }`
- Extend `GovernanceAction` with `'platform.superadmin.assigned' | 'platform.superadmin.revoked'`
- Extend `AuditEvent` to accept a `tenantId` of `null` for platform-scope events (or use `'platform'` as a convention)

**ADR-008 constraint**: `PlatformRole` must never reference `TenantRole` type.

**Rollback**: delete `platform-role.ts`, revert `audit-event.ts`.

---

### INC-02 — Application Port
**Files**:
- `src/application/ports/iam/platform-membership-repository.port.ts` (new)

**Scope**:
- `CreatePlatformMembershipInput`: `{ userId, role: PlatformRole, status: PlatformMembershipStatus }`
- `PlatformMembershipRepositoryPort` interface:
  - `listAll(): Promise<PlatformMembership[]>`
  - `findByUserId(userId: string): Promise<PlatformMembership | null>`
  - `create(input: CreatePlatformMembershipInput): Promise<PlatformMembership>`
  - `update(userId: string, update: Partial<Pick<PlatformMembership, 'status'>>): Promise<PlatformMembership>`
  - `delete(userId: string): Promise<void>`

**Rollback**: delete file.

---

### INC-03 — Infrastructure Adapter
**Files**:
- `src/infrastructure/iam/in-memory-platform-membership-repository.adapter.ts` (new)

**Scope**:
- Implement `PlatformMembershipRepositoryPort` with an in-memory `Map<string, PlatformMembership>`
- Constructor accepts seed `PlatformMembership[]`
- Seed in `main.ts` will include `superadmin-001` with `role: 'Superadmin'`, `status: 'Active'`

**Rollback**: delete file.

---

### INC-04 — Use-Case
**Files**:
- `src/application/use-cases/iam/platform-governance.use-case.ts` (new)

**Scope**:
- Constructor dependencies: `PlatformMembershipRepositoryPort`, `TenantMembershipRepositoryPort`, `AuditEventWriterPort`, `AuthorizationDecisionLoggerPort`
- Methods:
  - `listTenants(actorUserId)` — calls `tenantMembershipRepository.listAllTenantIds()` (new method on port, or derives unique tenantIds from list); AC-01
  - `listPlatformMembers(actorUserId)` — lists all `PlatformMembership`; AC-02
  - `assignSuperadmin(actorUserId, targetUserId)` — creates or activates a `PlatformMembership`; emits `platform.superadmin.assigned` audit; AC-03
  - `revokeSuperadmin(actorUserId, targetUserId)` — updates status to `Revoked`; emits `platform.superadmin.revoked` audit; self-revoke protection; AC-04 / AC-07
- Private `ensureActorIsSuperadmin(actorUserId)` — reads from `PlatformMembershipRepository` only; throws `platform.access.denied` if absent or not Active; AC-05 / ADR-008

**Important**: `TenantMembershipRepositoryPort` must expose a method to list all unique tenant IDs. Extend the port in INC-02 or add a dedicated `listAllTenantIds` method. Chosen approach: add `listAllTenantIds(): Promise<string[]>` to `TenantMembershipRepositoryPort` and implement in the in-memory adapter.

**ADR-008 constraints**:
- `ensureActorIsSuperadmin` reads platform repo only
- No `TenantRole` references in this use-case
- Audit mandatory on assign/revoke

**Rollback**: delete file; revert port extension.

---

### INC-05 — Routes
**Files**:
- `src/presentation/http/routes/iam-platform.routes.ts` (new)

**Scope**:
- `GET /platform/memberships` → `listPlatformMembers`
- `POST /platform/memberships` body: `{ userId: string }` → `assignSuperadmin`
- `DELETE /platform/memberships/:userId` → `revokeSuperadmin`
- `GET /platform/tenants` → `listTenants`
- Identity resolved from `x-actor-user-id` header (same pattern as `iam-memberships.routes.ts`)
- Error handling reuses `handleError` and `buildProblem` pattern
- New `AuthorizationErrorCode`: `'platform.access.denied'` added to `authorization-errors.ts`

**Rollback**: delete file; revert `authorization-errors.ts`.

---

### INC-06 — Wiring
**Files**:
- `src/main.ts` (modify)

**Scope**:
- Add `superadmin-001` to `globalUserSeed`
- Instantiate `InMemoryPlatformMembershipRepositoryAdapter` with seed `[{ userId: 'superadmin-001', role: 'Superadmin', status: 'Active', assignedAt: ..., updatedAt: ... }]`
- Extend `InMemoryTenantMembershipRepositoryAdapter` with `listAllTenantIds` (or implement in adapter)
- Instantiate `PlatformGovernanceUseCase`
- Call `registerIamPlatformRoutes`

**Rollback**: revert `main.ts`.

---

### INC-07 — Tests
**Files**:
- `test/platform-governance.use-case.test.ts` (new)

**Scope**:
- Test cases from `02-TEST-STRATEGY.md`
- Use vitest (same framework as existing tests)

**Rollback**: delete file.

---

## Dependencies

| Increment | Depends On |
|-----------|-----------|
| INC-02 | INC-01 |
| INC-03 | INC-01, INC-02 |
| INC-04 | INC-01, INC-02, INC-03 |
| INC-05 | INC-01, INC-04 |
| INC-06 | INC-03, INC-04, INC-05 |
| INC-07 | INC-04 |

## Risk Notes

- `TenantMembershipRepositoryPort` must be extended with `listAllTenantIds()` — this is a minimal, backward-compatible addition.
- `AuthorizationErrorCode` must be extended with `'platform.access.denied'` — additive, backward-compatible.
- `AuditEvent.tenantId` is typed as `string` in the existing model; platform events will use `'platform'` as the `tenantId` value to avoid a breaking type change.

## Rollback Strategy
Increments can be independently reverted in reverse order (INC-07 → INC-01).
No existing files are deleted; only additive changes except for:
- `authorization-errors.ts` (extend union type)
- `audit-event.ts` (extend union type)
- `tenant-membership-repository.port.ts` (add `listAllTenantIds`)
- `in-memory-tenant-membership-repository.adapter.ts` (implement `listAllTenantIds`)
- `main.ts` (wiring)
