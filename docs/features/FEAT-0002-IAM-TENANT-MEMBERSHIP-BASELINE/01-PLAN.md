# FEAT-0002 IAM Tenant Membership Baseline - Plan

## Scope
### In Scope
- Implement a baseline multi-tenant IAM membership model for tenant-scoped authorization.
- Deliver deterministic API contracts and backend behavior for membership and role governance actions.
- Establish role and membership invariants required by Identity & Access domain seeds.
- Provide test-ready implementation increments with explicit owners and dependencies.

### Out Of Scope
- Provider-specific authentication UX and federation configuration.
- Advanced policy engine, ABAC, or custom role authoring UI.
- Non-IAM domain workflows (billing, provisioning, customer CRM).

## Technical Approach
1. Resolve authenticated identity via validated token subject and map to User.
2. Resolve active tenant context per request and load TenantMembership(User, Tenant).
3. Apply deny-by-default if tenant context is absent or membership is not authorization-eligible.
4. Evaluate role-based permissions only in current tenant scope.
5. Execute membership and role commands with invariant checks:
- no self-elevation
- no cross-tenant authorization inheritance
- last-owner protection
- valid state transitions
6. Emit governance audit events for each mutation command.
7. Expose deterministic API error semantics for forbidden, invalid transition, conflict, and not found.

## Architecture Alignment
- Authentication remains identity proof boundary; authorization logic stays in Identity & Access domain.
- Token validation is backend responsibility; frontend/client does not decide authorization.
- Tenant-scoped authorization is evaluated only after token validation.
- Domain boundaries remain aligned with repository structure:
- app/contracts defines API and schema contracts
- app/backend enforces domain rules and persistence orchestration
- app/web and app/client consume contracts and handle tenant context UX selection
- app/composition wires runtime dependencies

## Domain Rules
- User identity is global.
- One User can belong to many Tenants via TenantMembership.
- Authorization requires explicit (User, Tenant) pair.
- TenantRole baseline values: Owner, Admin, Member, Viewer.
- MembershipStatus baseline values: Invited, Active, Suspended, Revoked.
- Only Active membership authorizes tenant-scoped actions.
- Missing or invalid membership returns deny-by-default.
- User rights never propagate across tenants.
- Self-elevation to higher role is forbidden.
- Last active Owner cannot be removed or demoted.

## Initial API Surface
### Membership Queries
- GET /tenants/{tenantId}/memberships
- GET /tenants/{tenantId}/memberships/{userId}

### Membership Commands
- POST /tenants/{tenantId}/memberships
- PATCH /tenants/{tenantId}/memberships/{userId}/status
- DELETE /tenants/{tenantId}/memberships/{userId}

### Role Commands
- PATCH /tenants/{tenantId}/memberships/{userId}/role

### Error Semantics
- 401 when authentication token is missing or invalid.
- 403 when tenant context or permissions are insufficient.
- 404 when tenant or membership target does not exist in accessible scope.
- 409 for invariant conflicts (for example last-owner protection or invalid transition).
- 422 for syntactically valid but semantically invalid command payload.

## Conceptual Data Model
- User: id, globalStatus
- Tenant: id
- TenantMembership: tenantId, userId, role, status, createdAt, updatedAt
- AuditEvent: id, tenantId, actorUserId, targetUserId, action, metadata, occurredAt

Uniqueness and integrity constraints:
- TenantMembership uniqueness on (tenantId, userId).
- Referential integrity from TenantMembership to User and Tenant.
- AuditEvent immutable append-only record.

## Increment Plan (Execution Baseline)

### INC-01 - Contracts and Domain Baseline
Owner: Contracts Lead

Scope:
- Define request and response schemas for membership and role endpoints in app/contracts.
- Define enum contracts for TenantRole and MembershipStatus.
- Define deterministic error contract and error codes.
- Define baseline domain model interfaces required by backend.

Dependencies:
- 00-REQUEST.md acceptance criteria.
- ADR-003, ADR-005.

ADR References:
- ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY
- ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY

Completion Criteria:
- Contract schema validation tests pass.
- Error semantics match plan definitions (401/403/404/409/422).
- No backward-incompatible changes introduced to existing contract consumers.

Rollback Strategy:
- Revert new/changed contract schema files.
- Restore previous contract version and regenerate stubs.
- Mark INC-01 as NOT READY in implementation log with mismatch details.

### INC-02 - Authorization Core and Invariants
Owner: Backend Lead

Scope:
- Implement tenant context resolver in backend.
- Implement membership authorization checks (active membership only, deny-by-default).
- Implement invariant guards: self-elevation block, cross-tenant isolation, lifecycle transitions, last-owner protection.
- Implement deterministic error mapping from domain outcomes.

Dependencies:
- INC-01 completed.
- ADR-002, ADR-003, ADR-004, ADR-007.

ADR References:
- ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY
- ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY
- ADR-004-LAST-OWNER-PROTECTION-POLICY
- ADR-007-GLOBAL-USER-STATUS-PRECEDENCE

Completion Criteria:
- Unit tests for invariant guards pass.
- Integration tests confirm no cross-tenant authorization leakage.
- Last-owner and invalid transition cases return deterministic conflicts.

Rollback Strategy:
- Disable new authorization path behind feature flag (if configured).
- Revert backend handlers and guard implementations for this increment.
- Preserve contract changes from INC-01 while marking backend path as incomplete.

### INC-03 - Governance Audit and Composition Wiring
Owner: Platform Lead

Scope:
- Implement audit event emission and append-only persistence for membership/role mutations.
- Wire runtime dependencies in app/composition.
- Add infra migration seeds for membership and audit persistence if required.
- Add structured authorization decision logging hooks.

Dependencies:
- INC-02 completed.
- ADR-006.

ADR References:
- ADR-006-AUDIT-EVENT-PERSISTENCE-AND-RETENTION

Completion Criteria:
- Integration tests confirm audit event creation and required fields.
- Composition wiring resolves dependencies in local and CI execution paths.
- Migration scripts apply and rollback cleanly in test environment.

Rollback Strategy:
- Revert audit persistence migrations and composition wiring.
- Keep authorization behavior active with temporary non-persistent audit stub only if explicitly approved.
- Record operational impact and remediation actions in implementation log.

### INC-04 - Web and Client Integration Baseline
Owner: Frontend Lead

Scope:
- Implement tenant context selection persistence and switching behavior in app/web.
- Mirror tenant context behavior in app/client where enabled.
- Integrate membership APIs for baseline admin flows.
- Render deterministic forbidden/conflict states from contract error codes.

Dependencies:
- INC-01 and INC-02 completed.

ADR References:
- ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY
- ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY
- ADR-007-GLOBAL-USER-STATUS-PRECEDENCE

Completion Criteria:
- End-to-end tests validate tenant switching and scope isolation behavior.
- UI/client error states map correctly to 403/409 contract errors.
- No client-side authorization bypass logic introduced.

Rollback Strategy:
- Revert UI/client tenant-context integration commits.
- Restore previous tenant navigation behavior.
- Keep backend and contract increments active while marking UX integration pending.

## Cross-Increment Dependency Graph
1. INC-01 -> INC-02 -> INC-03
2. INC-01 and INC-02 -> INC-04
3. Review (step 15) requires all increments marked complete in 03-IMPLEMENTATION-LOG with test evidence.

## ADR Impact
The following ADRs are required and are now available for implementation stability:
- ADR-002 Tenant Context Resolution Strategy.
- ADR-003 Membership Lifecycle Strategy.
- ADR-004 Last-Owner Protection Policy.
- ADR-005 Role Model Extensibility Policy.
- ADR-006 Audit Event Persistence and Retention.
- ADR-007 Global User Status precedence over tenant membership authorization.

## Risks And Mitigations
1. Risk: Ambiguous tenant context selection may create inconsistent authorization behavior.
Mitigation: Enforce ADR-002 resolver contract and integration tests before INC-02 closure.

2. Risk: Cross-tenant data leakage through repository query mistakes.
Mitigation: Require tenantId in all tenant-scoped queries and enforce isolation tests in INC-02.

3. Risk: Ownership lockout due to incorrect last-owner checks.
Mitigation: Add atomic invariant checks and conflict tests in INC-02.

4. Risk: Drift between contract and implementation across modules.
Mitigation: Contract-first workflow in INC-01 and compatibility validation before INC-04.

5. Risk: Missing audit traceability for privileged actions.
Mitigation: Treat audit emission as mandatory in INC-03 and verify via integration tests.
