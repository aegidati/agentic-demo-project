# FEAT-0002 MOD-02 - Authentication Docs ADR-008 Harmonization

## Change Description

Harmonize local Authentication domain and profile documentation with ADR-008 and the Superadmin baseline introduced in FEAT-0002 MOD-01.

This modification is documentation-only and clarifies the boundary between Authentication signals and IAM-owned privileged resolution.

## Impact Analysis

Affected surfaces:
- `docs/domain-templates/AUTHENTICATION/DOMAIN-MODEL.md`
- `docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md`
- `docs/profiles/README.md`
- `docs/profiles/api-stack.md`
- `docs/profiles/flutter-standalone.md`

Behavioral impact:
- no runtime behavior, APIs, schema, or transport changes
- claims/groups are documented as verified external signals only
- final platform-scope privileged resolution remains owned by IAM

Governance impact:
- reduces ambiguity that previously allowed provider claims to be interpreted as direct privileged grants
- aligns auth documentation with [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md)

## Backward Compatibility

Backward compatible.

No code paths, contracts, or runtime architecture are modified.

## Test Strategy

Documentation validation only:
1. No remaining wording states provider claims/groups can directly override tenant roles or directly grant Superadmin.
2. Domain model explicitly states privileged resolution is IAM-owned.
3. Profiles include guardrails against client-side authoritative privileged decisions.
4. Scope remains limited to requested documentation directories and MOD artifact.

## Rollback Plan

1. Revert this MOD document.
2. Revert the authentication domain-template/profile wording changes.
3. Restore previous documentation baseline and record rationale in FEAT-0002 review history.

## Sign-Off Gate

- Feature Orchestrator: confirm lifecycle and scope control
- Architecture Guardian: confirm ADR-008 boundary consistency
- Documentation Guardian: confirm wording coherence and non-prescriptive runtime posture

## Residual Follow-Up

Additional profile files can be aligned in a subsequent documentation-only increment to maximize consistency across all profile variants without broadening this MOD scope.