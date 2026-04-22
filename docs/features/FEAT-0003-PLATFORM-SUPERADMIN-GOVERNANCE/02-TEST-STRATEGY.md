# FEAT-0003 — Platform Superadmin Governance: Test Strategy

## Scope
Unit tests for `PlatformGovernanceUseCase` covering all acceptance criteria from `00-REQUEST.md`.

## Test File
`test/platform-governance.use-case.test.ts`

## Framework
Vitest (consistent with existing test suite)

## Test Setup Pattern
Mirror the `createUseCase` factory pattern from `membership-governance.use-case.test.ts`:
- Instantiate `InMemoryPlatformMembershipRepositoryAdapter` with configurable seed
- Instantiate `InMemoryTenantMembershipRepositoryAdapter` with configurable seed (for `listTenants`)
- Instantiate `InMemoryAuditEventWriterAdapter` to capture events
- Instantiate `InMemoryAuthorizationDecisionLoggerAdapter`
- Return `{ useCase, platformRepo, auditWriter }`

---

## Test Cases

### Suite: `platform governance — deny-by-default`

| ID | Description | AC |
|----|-----------|----|
| TC-01 | Actor with no PlatformMembership calling `listPlatformMembers` throws `platform.access.denied` | AC-05 |
| TC-02 | Actor with no PlatformMembership calling `listTenants` throws `platform.access.denied` | AC-05 |
| TC-03 | Actor with no PlatformMembership calling `assignSuperadmin` throws `platform.access.denied` | AC-05 |
| TC-04 | Actor with no PlatformMembership calling `revokeSuperadmin` throws `platform.access.denied` | AC-05 |
| TC-05 | Actor with PlatformMembership status `Revoked` calling any method throws `platform.access.denied` | AC-05 |

---

### Suite: `platform governance — listTenants`

| ID | Description | AC |
|----|-----------|----|
| TC-06 | Superadmin can list all unique tenant IDs across all memberships | AC-01 |
| TC-07 | Result contains tenants from multiple membership records, deduplicated | AC-01 |

---

### Suite: `platform governance — listPlatformMembers`

| ID | Description | AC |
|----|-----------|----|
| TC-08 | Superadmin can list all platform members | AC-02 |
| TC-09 | Returns empty array when no other platform members exist (actor is the only one) | AC-02 |

---

### Suite: `platform governance — assignSuperadmin`

| ID | Description | AC |
|----|-----------|----|
| TC-10 | Superadmin can assign Superadmin to a new user; result has `role: 'Superadmin'` and `status: 'Active'` | AC-03 |
| TC-11 | After assign, an audit event with `action: 'platform.superadmin.assigned'` is emitted | AC-08 |
| TC-12 | Audit event contains `actorUserId`, `targetUserId`, and metadata with `role: 'Superadmin'` | AC-08 |
| TC-13 | Assigning to an already-Active Superadmin is idempotent (no error, re-activates or is a no-op) | AC-03 |

---

### Suite: `platform governance — revokeSuperadmin`

| ID | Description | AC |
|----|-----------|----|
| TC-14 | Superadmin can revoke Superadmin from another user; result has `status: 'Revoked'` | AC-04 |
| TC-15 | After revoke, an audit event with `action: 'platform.superadmin.revoked'` is emitted | AC-08 |
| TC-16 | Audit event contains `actorUserId`, `targetUserId`, and metadata with previous status | AC-08 |
| TC-17 | Self-revoke: actor attempting to revoke their own Superadmin throws `platform.self_revoke_forbidden` | AC-07 |
| TC-18 | Revoking a non-existent platform member throws `membership.not_found` or equivalent | AC-04 |

---

### Suite: `platform governance — PlatformRole isolation`

| ID | Description | AC |
|----|-----------|----|
| TC-19 | `PlatformMembership` has no `tenantId` field | AC-06 |
| TC-20 | `PlatformRole` ('Superadmin') value is not assignable to `TenantRole` type (compile-time, verified by TypeScript) | AC-06 |

---

## Coverage Targets
- All 8 acceptance criteria must be covered by at least one test case.
- Deny-by-default: every public use-case method must have a TC-0x negative test.
- Audit: every mutating operation (assign, revoke) must have an explicit audit event assertion.

## Edge Cases Not In Scope
- Concurrent assign + revoke (lock not required for platform repo in demo mode)
- Pagination of `listPlatformMembers` or `listTenants`
- Network/persistence failures (in-memory adapter does not throw)
