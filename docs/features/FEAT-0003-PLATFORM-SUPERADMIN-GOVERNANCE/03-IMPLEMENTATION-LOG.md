# FEAT-0003 — Implementation Log

Feature: Platform Superadmin Governance  
Status: **COMPLETE**  
Gate 4: **PASSED** — build clean, 41/41 tests passing

---

## Summary

Full implementation of platform-level governance for Superadmin role assignment and revocation, following the documentation-first lifecycle defined in AGENTIC-WORKFLOW.

All 7 increments delivered. ADR-008 constraints satisfied. 8 acceptance criteria verified via automated test suite.

---

## Lifecycle Artifacts

| Artifact | Path | Status |
|---|---|---|
| REQUEST | docs/features/FEAT-0003-PLATFORM-SUPERADMIN-GOVERNANCE/00-REQUEST.md | ✓ |
| PLAN | docs/features/FEAT-0003-PLATFORM-SUPERADMIN-GOVERNANCE/01-PLAN.md | ✓ |
| TEST-STRATEGY | docs/features/FEAT-0003-PLATFORM-SUPERADMIN-GOVERNANCE/02-TEST-STRATEGY.md | ✓ |
| IMPLEMENTATION-LOG | docs/features/FEAT-0003-PLATFORM-SUPERADMIN-GOVERNANCE/03-IMPLEMENTATION-LOG.md | ✓ |

---

## Increments

### INC-01 — Domain Types

**Files touched:**
- `app/backend/app/src/domain/iam/platform-role.ts` — new file
- `app/backend/app/src/domain/iam/audit-event.ts` — extended `GovernanceAction` union
- `app/backend/app/src/domain/iam/authorization-errors.ts` — extended `AuthorizationErrorCode` union

**Notes:**
- `PlatformMembership` has no `tenantId` field — enforces PlatformRole/TenantRole isolation (ADR-008, TC-19)
- New `GovernanceAction` values: `'platform.superadmin.assigned'` and `'platform.superadmin.revoked'`
- New `AuthorizationErrorCode` values: `'platform.access.denied'` and `'platform.self_revoke_forbidden'`

---

### INC-02 — Ports

**Files touched:**
- `app/backend/app/src/application/ports/iam/platform-membership-repository.port.ts` — new file
- `app/backend/app/src/application/ports/iam/tenant-membership-repository.port.ts` — added `listAllTenantIds(): Promise<string[]>`

**Notes:**
- Port follows existing naming conventions (`listAll`, `findByUserId`, `create`, `update`, `delete`)
- `listAllTenantIds` added to `TenantMembershipRepositoryPort` as an additive extension

---

### INC-03 — Infrastructure Adapters

**Files touched:**
- `app/backend/app/src/infrastructure/iam/in-memory-platform-membership-repository.adapter.ts` — new file
- `app/backend/app/src/infrastructure/iam/in-memory-tenant-membership-repository.adapter.ts` — added `listAllTenantIds()` implementation

**Notes:**
- `InMemoryPlatformMembershipRepositoryAdapter` accepts a seed array in its constructor for test and dev injection
- `listAllTenantIds()` uses `Set` for deduplication: `[...new Set([...this.store.values()].map((m) => m.tenantId))]`

---

### INC-04 — Use Case

**Files touched:**
- `app/backend/app/src/application/use-cases/iam/platform-governance.use-case.ts` — new file

**Key design decisions:**
- `ensureActorIsSuperadmin(actorUserId)` reads exclusively from `platformRepository.findByUserId` — satisfies ADR-008 (never reads from header or JWT claims)
- Self-revoke protection: throws `platform.self_revoke_forbidden` before any repository call
- `assignSuperadmin` is idempotent: re-activates an existing Revoked membership instead of duplicating
- `withDecisionLogging(context, fn)` wraps all use-case methods; uses `decisionLogger.record(...)` with `tenantId: 'platform'` (string convention, not breaking domain type)
- `static mapErrorToHttpStatus(code)`: 401 for `missing_actor`, 403 for platform errors, 404 for `membership.not_found`

---

### INC-05 — HTTP Routes

**Files touched:**
- `app/backend/app/src/presentation/http/routes/iam-platform.routes.ts` — new file

**Routes registered:**
| Method | Path | Use-Case Method | Response |
|---|---|---|---|
| GET | /platform/memberships | listPlatformMembers | 200 |
| POST | /platform/memberships | assignSuperadmin | 201 |
| DELETE | /platform/memberships/:userId | revokeSuperadmin | 200 |
| GET | /platform/tenants | listTenants | 200 |

**Pattern:** consistent with `iam-memberships.routes.ts` — uses `getActorUserId`, `buildProblem`, `handleError`, and `PlatformGovernanceUseCase.mapErrorToHttpStatus`.

---

### INC-06 — Composition Root (Wiring)

**Files touched:**
- `app/backend/app/src/main.ts` — extended with:
  - New imports: `InMemoryPlatformMembershipRepositoryAdapter`, `PlatformMembership`, `PlatformGovernanceUseCase`, `registerIamPlatformRoutes`
  - `globalUserSeed` extended: added `superadmin-001` user
  - `platformMembershipSeed`: seeds `superadmin-001` as `Superadmin/Active` (assignedAt 2026-04-22)
  - Instantiation of `platformMembershipRepository` and `platformGovernanceUseCase`
  - `registerIamPlatformRoutes(app, { platformGovernanceUseCase })` called after existing route registrations

---

### INC-07 — Tests

**Files touched:**
- `app/backend/app/test/platform-governance.use-case.test.ts` — new file

**Coverage:** 19 test cases across 6 describe suites:

| Suite | TC range | AC covered |
|---|---|---|
| deny-by-default | TC-01 – TC-05 | AC-01, AC-02 |
| listTenants | TC-06 – TC-07 | AC-03, AC-08 |
| listPlatformMembers | TC-08 – TC-09 | AC-04 |
| assignSuperadmin | TC-10 – TC-13 | AC-05, AC-07 |
| revokeSuperadmin | TC-14 – TC-18 | AC-06, AC-07, AC-08 |
| PlatformRole isolation | TC-19 | ADR-008 structural constraint |

---

## Gate Outcomes

| Gate | Description | Result |
|---|---|---|
| Gate 1 | REQUEST artifact present | PASSED |
| Gate 2 | PLAN artifact present | PASSED |
| Gate 3 | TEST-STRATEGY artifact present | PASSED |
| Gate 4 | `npm run build` — no TypeScript errors | PASSED |
| Gate 4 | `npm test` — 41/41 tests passing (7 files) | PASSED |

---

## ADR-008 Alignment Evidence

| Constraint | Evidence |
|---|---|
| PlatformRole and TenantRole must be separate types | `platform-role.ts` is a distinct file; `PlatformMembership` has no `tenantId` |
| `ensureActorIsSuperadmin` must read from IAM repository only | Implementation reads `platformRepository.findByUserId(actorUserId)` exclusively |
| Platform audit events must use `tenantId: 'platform'` | `withDecisionLogging` passes `tenantId: 'platform'` string to `decisionLogger.record()` |
| Superadmin cannot revoke themselves | Self-revoke guard is the first check in `revokeSuperadmin`, before any I/O |

---

## Acceptance Criteria Verification

| AC | Description | Test |
|---|---|---|
| AC-01 | Non-superadmin cannot list platform members | TC-01 |
| AC-02 | Non-superadmin cannot list tenants | TC-02 |
| AC-03 | Superadmin can list all tenants | TC-06 |
| AC-04 | Superadmin can list all platform members | TC-08 |
| AC-05 | Superadmin can assign Superadmin role | TC-10 |
| AC-06 | Superadmin can revoke another Superadmin | TC-14 |
| AC-07 | Audit events emitted for assign and revoke | TC-11, TC-12, TC-15, TC-16 |
| AC-08 | Self-revoke is forbidden | TC-17 |

---

## Risk Notes

- **`auditWriter.list()` vs `readAll()`**: Test file was authored using `readAll()` (expected pattern), but `InMemoryAuditEventWriterAdapter` exposes `list()`. Corrected before Gate 4 run.
- **HTTP integration tests**: INC-07 covers unit tests only. HTTP-layer integration tests for `iam-platform.routes.ts` are deferred to a future increment.
