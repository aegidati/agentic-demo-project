# FEAT-0002 IAM Tenant Membership Baseline - Test Strategy

## Objectives
- Verify tenant-scoped authorization baseline for multi-tenant membership management.
- Prove domain invariants are enforced for membership and role governance.
- Prevent cross-tenant authorization leakage.
- Validate deterministic API behavior and error semantics.
- Validate auditability of privileged membership and role mutations.

## Test Levels
### Unit Tests
- Domain invariant guards.
- Membership lifecycle transition validator.
- Role elevation and last-owner protection checks.
- Error mapping from domain outcome to API contract.

### Integration Tests
- Endpoint-to-domain-to-persistence behavior for membership and role flows.
- Tenant isolation across repositories and handlers.
- Audit event emission and persisted payload integrity.

### End-To-End Tests
- Authenticated user with single tenant performs allowed actions.
- Multi-tenant user switches tenant and sees tenant-specific permissions.
- Admin and Owner workflows for membership management and role updates.
- Forbidden/conflict user experience behavior in web or client surface.

## Critical Test Cases
1. Active membership allows authorized operation in selected tenant.
2. Missing tenant context returns deny-by-default behavior.
3. Non-member user in tenant is denied tenant-scoped action.
4. Suspended or Revoked membership is denied.
5. User can have Owner in tenant A and Viewer in tenant B with no permission bleed.
6. Self role promotion to higher privilege is rejected.
7. Demoting or removing the last active Owner is rejected.
8. Valid ownership transfer path succeeds and preserves at least one active Owner.
9. Membership add/remove/status and role changes create audit events with required fields.
10. API returns deterministic status and error codes for invalid transition, forbidden, not found, and conflict.

## Negative And Security Cases
- Token missing, malformed, expired, wrong audience, or wrong issuer returns 401.
- Authenticated token with valid identity but no tenant membership returns 403.
- Request references tenant outside user scope and returns 403 or 404 per visibility policy ADR.
- Attempted cross-tenant mutation using tenantId tampering is blocked.
- Replay of stale command payload does not bypass invariants.
- Concurrent ownership mutation attempts preserve last-owner invariant.
- Privilege escalation attempt through direct API payload role override is blocked.

## Coverage Targets
- Unit test line coverage: >= 85% for IAM domain and authorization guard modules.
- Branch coverage: >= 80% for membership transition and role/invariant logic.
- Integration coverage: 100% of baseline API endpoints and mutation commands.
- Critical security cases: 100% pass across defined negative/security suite.

## Test Data Strategy
- Deterministic fixtures:
- Users: at least 3 identities (owner, admin/member, outsider).
- Tenants: at least 2 tenants to validate isolation.
- Membership matrix: Active, Invited, Suspended, Revoked per tenant.
- Seeded scenarios for single-owner and multi-owner tenant states.
- Synthetic audit sink for asserting event payload and ordering.
- No production data usage; all datasets generated in isolated test environments.

## Environment And Tooling
- Contract validation tests run on every pull request.
- Backend integration tests run against ephemeral test database.
- End-to-end tests run in CI against composed application profile.
- Security-focused negative suite required in CI quality gate.

## Exit Criteria
1. All acceptance criteria from 00-REQUEST are mapped to at least one automated test.
2. All critical and security test cases pass in CI.
3. Coverage targets are met or exceeded with no unapproved exemptions.
4. No open high-severity defects in IAM baseline scope.
5. Test evidence is attached to feature review artifacts.
