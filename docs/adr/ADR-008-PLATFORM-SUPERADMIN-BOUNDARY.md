# ADR-008 - Platform Superadmin Boundary

**Title**: Platform Superadmin Boundary

**Status**: Accepted

**Date**: 2026-04-22

**Stakeholders**: Architecture Guardian, Feature Orchestrator, Product Lead, Documentation Guardian

---

## Problem Statement

The project has adopted AGENTIC-IAM and AGENTIC-AUTH-FOUNDATION as documentation-first foundations.

The upstream baseline now distinguishes platform-scoped governance from tenant-scoped authorization by introducing `PlatformRole` with a baseline value `Superadmin`.

Without a local ADR, this derived project risks modeling `Superadmin` as an extra `TenantRole`, or treating authentication claims/groups as direct privileged grants.

## Context

- FEAT-0002 established tenant-scoped authorization around `TenantMembership`, `TenantRole`, and explicit tenant context.
- ADR-005 already constrains tenant-role evolution, but does not explicitly distinguish platform roles from tenant roles.
- Upstream foundation baseline now requires:
  - `Superadmin` to be platform-scoped
  - no implicit tenant-wide `Owner`/`Admin` inheritance
  - authentication claims/groups to remain external verified signals only
  - final privileged resolution to remain IAM-owned

## Decision

We adopt the following boundary:

1. `Superadmin` is modeled only as a platform-scope `PlatformRole` baseline.
2. `Superadmin` is not a `TenantRole` and does not extend the tenant-role enum.
3. `Superadmin` does not implicitly grant `Owner`, `Admin`, `Member`, or `Viewer` in any Tenant.
4. Tenant-scoped authorization remains deny-by-default and still requires explicit tenant context and applicable membership/permission checks unless a separately documented platform governance flow applies.
5. Authentication claims, groups, or app roles may be normalized as verified external signals, but they do not directly grant `Superadmin`.
6. Final privileged resolution for platform-scope access remains owned by IAM governance, not by client-side logic or provider-specific claim mapping alone.
7. Assignment, revocation, and use of `Superadmin` capabilities must be auditable.

## Alternatives Considered

### Option A: Add Superadmin as a fifth TenantRole
- Pro: Simpler enum surface.
- Con: Breaks tenant-scoped semantics and creates implicit cross-tenant inheritance pressure.
- Impact: Rejected because it conflicts with FEAT-0002 baseline and upstream guidance.

### Option B: Treat claims/groups as direct privileged grants
- Pro: Faster implementation path for provider-integrated authentication.
- Con: Couples authorization to provider-specific token semantics and weakens governance.
- Impact: Rejected because privileged resolution must remain IAM-owned.

### Option C: Separate PlatformRole boundary (chosen)
- Pro: Preserves tenant baseline and keeps privileged governance explicit.
- Con: Requires additional governance documentation and future runtime design work.
- Impact: Chosen for clarity and alignment with upstream foundations.

## Consequences

Positive:
- tenant-scoped authorization baseline remains intact
- future platform governance work has an explicit architectural boundary
- bootstrap and policy reviews can detect invalid role modeling early

Constraints:
- future runtime implementation must not encode `Superadmin` as tenant enum expansion
- local authentication guidance must eventually be harmonized with the external-signal rule across all auth templates/profiles
- platform authorization permissions must remain documented separately from tenant permission matrix semantics

## Rationale

This boundary preserves FEAT-0002 guarantees while allowing the project to adopt the upstream Superadmin baseline without introducing undocumented runtime deviations.

## Validation

Decision is validated when:
- `docs/policies/AUTHORIZATION-PRINCIPLES.md` documents a platform authorization section
- `docs/policies/PERMISSION-MATRIX.md` keeps tenant roles unchanged and adds a separate platform baseline
- `docs/platform/BOOTSTRAP-RUNBOOK.md` checks Superadmin coherence in optional foundation adoption and final gate
- no local governance document describes `Superadmin` as implicit tenant-wide ownership

## References

- [ADR-001-ARCHITECTURE-STRATEGY.md](./ADR-001-ARCHITECTURE-STRATEGY.md)
- [ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md](./ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md)
- [FEAT-0002 Plan](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/01-PLAN.md)
- [FEAT-0002 MOD-01](../features/FEAT-0002-IAM-TENANT-MEMBERSHIP-BASELINE/MOD-01-PLATFORM-SUPERADMIN-BASELINE.md)
- [FEAT-0001 MOD-01](../features/FEAT-0001-INITIAL-BOOTSTRAP/MOD-01-SUPERADMIN-BOOTSTRAP-ALIGNMENT.md)

---

**Decision Made By**: Architecture Guardian
**Reviewed By**: Feature Orchestrator
**Approved On**: 2026-04-22