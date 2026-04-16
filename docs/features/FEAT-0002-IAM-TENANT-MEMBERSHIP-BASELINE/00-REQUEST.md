# FEAT-0002 IAM Tenant Membership Baseline - Request

## Status
Draft

## User Story
As a platform user who belongs to one or more tenants,
I want authorization to be evaluated from my membership inside the active tenant,
so that access is isolated per tenant and cannot leak across tenant boundaries.

## Problem Statement
The platform needs a deterministic IAM baseline for multi-tenant user management. Without a shared baseline, teams can implement inconsistent membership and role rules, causing security drift, cross-tenant risk, and unclear ownership governance.

## Scope
- Define baseline tenant-scoped membership model for User-Tenant authorization.
- Establish baseline tenant roles: Owner, Admin, Member, Viewer.
- Define membership lifecycle baseline with authorization eligibility rules.
- Define deny-by-default behavior when tenant context or valid membership is missing.
- Define baseline governance events for membership and role changes.
- Define initial API contract scope for membership listing and role/membership mutations.

## Out Of Scope
- External identity provider setup and federation implementation.
- UI visual design and onboarding flows.
- Fine-grained resource ACL model beyond baseline permission categories.
- Full production audit retention architecture and storage technology choice.
- Billing, tenant provisioning, and non-IAM domain workflows.

## Acceptance Criteria
1. Authorization is evaluated using explicit User-Tenant context; missing tenant context is denied by default.
2. A user without an Active TenantMembership in the selected tenant cannot access tenant-scoped APIs.
3. Tenant roles are evaluated only within the active tenant; rights in tenant A do not authorize actions in tenant B.
4. Membership state transitions enforce business validity (Invited -> Active -> Suspended/Revoked); invalid states deny authorization.
5. Self-elevation is blocked: a user cannot assign or promote own membership to a higher role.
6. Last-owner protection is enforced: removing or demoting the final active Owner in a tenant is rejected.
7. Membership and role governance actions emit audit events with actor, tenant, target user, action, and timestamp.
8. API contracts for membership list/add/remove and role assign/revoke are defined with deterministic error semantics.
9. All technical documentation produced for this feature is in English.

## Constraints
- Must align with domain seeds in docs/domain-templates/IDENTITY-ACCESS and docs/domain-templates/AUTHENTICATION.
- Must respect existing architecture and module boundaries in app/contracts, app/backend, app/web, and app/composition.
- Must keep behavior deterministic and testable before implementation starts.
- Must preserve deny-by-default and no cross-tenant inheritance invariants.

## Dependencies
- Identity subject from validated authentication token (TokenClaims.subject) to resolve User identity.
- Tenant context resolution strategy (requires ADR decision).
- Role model extensibility policy (requires ADR decision).
- Membership lifecycle strategy and transition policy (requires ADR decision).
- Last-owner protection policy and exception model (requires ADR decision).
- Audit event persistence strategy (requires ADR decision).

## Success Metrics
- 100% of tenant-scoped authorization checks use User-Tenant context from membership data.
- 0 known cross-tenant authorization leaks in integration and end-to-end tests.
- 100% pass rate on critical IAM baseline test suite (positive + negative + security cases).
- 100% of membership/role mutations generate auditable governance events.
- 0 open high-severity defects related to tenant membership authorization at review gate.
