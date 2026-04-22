# FEAT-0002 MOD-01 - Platform Superadmin Baseline

## Change Description

Adopt the upstream AGENTIC-IAM and AGENTIC-AUTH-FOUNDATION Superadmin baseline in this derived project as a documentation and governance-only enhancement.

The change introduces a platform-scope `PlatformRole` baseline with value `Superadmin`, explicitly separated from tenant-scoped `TenantRole` values.

This modification does not add runtime behavior, contract changes, new UI, or implicit tenant-wide ownership semantics.

## Impact Analysis

Affected surfaces:
- `docs/adr/`
- `docs/architecture/ARCHITECTURE-SNAPSHOT.md`
- `docs/policies/AUTHORIZATION-PRINCIPLES.md`
- `docs/policies/PERMISSION-MATRIX.md`
- `docs/platform/BOOTSTRAP-RUNBOOK.md`

Architectural impact:
- tenant-scoped authorization semantics remain unchanged
- `TenantRole` baseline remains `Owner`, `Admin`, `Member`, `Viewer`
- `Superadmin` is not introduced as a fifth `TenantRole`
- claims and groups from authentication remain external verified signals only; final privileged resolution remains owned by IAM governance

Process impact:
- FEAT-0002 remains the owning feature for IAM authorization baseline evolution
- local ADR set must explicitly document the platform-vs-tenant boundary

## Backward Compatibility

Backward compatible.

No runtime contracts, storage schemas, API payloads, or route semantics are changed by this modification.

Existing tenant-scoped authorization rules remain valid and unchanged.

## Test Strategy

Documentation validation only:
1. ADR index includes the new platform boundary ADR.
2. Authorization policy keeps tenant matrix unchanged while introducing a separate platform baseline.
3. Bootstrap guidance validates Superadmin coherence only as a foundation-adoption governance check.
4. No documentation text describes `Superadmin` as implicit `Owner` or `Admin` across all tenants.

## Rollback Plan

If governance alignment proves incorrect:
1. Revert this MOD document.
2. Revert ADR updates related to `PlatformRole` and Superadmin boundary.
3. Restore tenant-only authorization policy wording.
4. Record the rollback rationale in FEAT-0002 review history.

## Sign-Off Gate

- Architecture Guardian: confirm `PlatformRole` stays separate from `TenantRole`
- Feature Orchestrator: confirm lifecycle alignment and impact containment
- Documentation Guardian: confirm governance and policy coherence

## Residual Follow-Up

Local authentication domain-template and profile documents still require a dedicated documentation-only follow-up so all auth guidance consistently reflects the upstream rule that claims/groups are external signals and not direct privileged grants.