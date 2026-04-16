# FEAT-0002 IAM Tenant Membership Baseline - Plan

## Scope
### In Scope
- Implement a baseline multi-tenant IAM membership model for tenant-scoped authorization.
- Deliver deterministic API contracts and backend behavior for membership and role governance actions.
- Establish role and membership invariants required by Identity & Access domain seeds.
- Provide test-ready implementation tasks split by module.

### Out Of Scope
- Provider-specific authentication UX and federation configuration.
- Advanced policy engine, ABAC, or custom role authoring UI.
- Non-IAM domain workflows (billing, provisioning, customer CRM).

## Technical Approach
1. Resolve authenticated identity via validated token subject and map to User.
2. Resolve active tenant context per request and load TenantMembership(User, Tenant).
3. Apply deny-by-default if tenant context is absent or membership is not authorization-eligible.
4. Evaluate role-based permissions only in current tenant scope.
5. Execute membership/role commands with invariant checks:
- no self-elevation
- no cross-tenant authorization inheritance
- last-owner protection
- valid state transitions
6. Emit governance audit events for each mutation command.
7. Expose deterministic API error semantics for forbidden, invalid transition, conflict, and not found.

## Architecture Alignment
- Authentication remains identity proof boundary; authorization logic stays in Identity & Access domain.
- Token validation is backend responsibility; frontend does not decide authorization.
- Tenant-scoped authorization is evaluated only after token validation.
- Domain boundaries remain aligned with repository structure:
- app/contracts defines API and schema contracts
- app/backend enforces domain rules and persistence orchestration
- app/web or app/client consumes contracts and handles tenant context UX selection
- app/composition wires runtime dependencies

## Domain Rules
- User identity is global.
- One User can belong to many Tenants via TenantMembership.
- Authorization requires explicit (User, Tenant) pair.
- TenantRole baseline values: Owner, Admin, Member, Viewer.
- MembershipStatus baseline values: Invited, Active, Suspended, Revoked.
- Only Active membership authorizes tenant-scoped actions.
- Missing/invalid membership returns deny-by-default.
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
- User
- id
- globalStatus
- Tenant
- id
- TenantMembership
- tenantId
- userId
- role
- status
- createdAt
- updatedAt
- AuditEvent
- id
- tenantId
- actorUserId
- targetUserId
- action
- metadata
- occurredAt

Uniqueness and integrity constraints:
- TenantMembership uniqueness on (tenantId, userId).
- Referential integrity from TenantMembership to User and Tenant.
- AuditEvent immutable append-only record.

## Implementation Tasks By Module
### app/contracts
- Define request and response schemas for membership and role endpoints.
- Define enum contracts for TenantRole and MembershipStatus.
- Define shared error contract and deterministic error codes.

### app/backend
- Implement tenant context resolver contract.
- Implement membership repository interfaces and command handlers.
- Implement invariant guards: deny-by-default, self-elevation, cross-tenant isolation, last-owner protection.
- Implement audit event emission on mutation commands.
- Add structured authorization decision logging hooks.

### app/web
- Implement active tenant context selection persistence and switching behavior.
- Integrate membership APIs for baseline admin flows.
- Render deterministic forbidden/conflict error states from contract error codes.

### app/client
- Mirror web tenant context behavior for native client if enabled in this feature scope.
- Consume shared contract models only; avoid client-side authorization decisions.

### app/composition
- Wire backend services, repositories, and event publisher bindings.
- Register environment configuration for IAM baseline feature toggles if required.

### app/infra
- Prepare migration seeds for membership and audit tables if infra changes are part of this increment.

## ADR Impact
The following ADRs must be created or updated before implementation is considered stable:
- Tenant Context Resolution Strategy.
- Membership Lifecycle Strategy.
- Last-Owner Protection Policy.
- Role Model Extensibility Policy.
- Audit Event Persistence and Retention Strategy.
- Global User Status precedence over tenant membership authorization.

## Risks And Mitigations
1. Risk: Ambiguous tenant context selection may create inconsistent authorization behavior.
Mitigation: Define and enforce a single context resolution ADR and shared backend middleware contract.
2. Risk: Cross-tenant data leakage through repository query mistakes.
Mitigation: Require tenantId in all tenant-scoped queries and enforce integration tests for isolation.
3. Risk: Ownership lockout due to incorrect last-owner checks.
Mitigation: Add atomic invariant checks and conflict tests around remove/demote operations.
4. Risk: Drift between contract and implementation across modules.
Mitigation: Contract-first workflow with schema validation tests in CI.
5. Risk: Missing audit traceability for privileged actions.
Mitigation: Treat audit emission as mandatory side effect and assert in tests.
