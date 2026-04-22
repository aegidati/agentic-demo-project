# FEAT-0001 MOD-01 - Superadmin Bootstrap Alignment

## Change Description

Update bootstrap-facing governance documents so optional IAM and Authentication foundation adoption explicitly checks Superadmin baseline coherence.

This modification aligns the derived project's bootstrap guidance with the upstream template baseline without changing starter installation behavior or runtime canonical paths.

## Impact Analysis

Affected surfaces:
- `docs/platform/BOOTSTRAP-RUNBOOK.md`
- `docs/architecture/ARCHITECTURE-SNAPSHOT.md`

Bootstrap impact:
- optional step `02b` must verify that `Superadmin` is documented as a platform-scope baseline separate from `TenantRole`
- optional step `02c` must verify that claims and groups are treated as provider-agnostic verified signals and not direct privileged grants
- final gate must treat Superadmin baseline coherence as a documentation blocker when IAM/Auth foundation adoption is in scope

Runtime impact:
- none

## Backward Compatibility

Backward compatible.

This change does not alter starter selection, canonical runtime slots, installation order, or post-install validation mechanics.

## Test Strategy

Documentation validation only:
1. Confirm `BOOTSTRAP-RUNBOOK.md` adds done/stop criteria for Superadmin coherence in `02b` and `02c`.
2. Confirm the final gate text includes Superadmin baseline coherence checks.
3. Confirm canonical runtime paths remain unchanged.

## Rollback Plan

1. Revert this MOD document.
2. Revert bootstrap runbook and snapshot changes.
3. Restore the previous bootstrap guidance baseline.

## Sign-Off Gate

- Feature Orchestrator: confirm bootstrap lifecycle alignment
- Architecture Guardian: confirm no runtime architectural deviation is introduced
- Documentation Guardian: confirm the runbook remains deterministic and safe

## Residual Follow-Up

If local authentication documentation remains stale after this bootstrap alignment, track that work as a dedicated follow-up feature or MOD rather than broadening FEAT-0001 scope into runtime or provider-specific design.