# Definition of Done

A feature is **Done** when ALL of the following criteria are met:

## Documentation
- ✓ REQUEST document completed ([00-REQUEST.md](../features/README.md))
- ✓ PLAN document completed ([01-PLAN.md](../features/README.md))
- ✓ TEST-STRATEGY document completed ([02-TEST-STRATEGY.md](../features/README.md))
- ✓ IMPLEMENTATION-LOG document completed ([03-IMPLEMENTATION-LOG.md](../features/README.md))
- ✓ REVIEW document prepared and signed off ([04-REVIEW.md](../features/README.md))
- ✓ DONE document completed ([05-DONE.md](../features/README.md))

## Code Quality
- ✓ Code follows naming conventions (English, consistent)
- ✓ Code is reviewed by at least one peer
- ✓ No breaking changes to existing APIs/contracts
- ✓ If breaking changes are unavoidable, documented in MOD-XX

## Testing
- ✓ All unit tests pass
- ✓ All integration tests pass
- ✓ Test coverage meets acceptance criteria
- ✓ Edge cases identified in TEST-STRATEGY are covered

## Architecture Compliance
- ✓ Design respects all existing ADRs
- ✓ New ADRs created (if required) and documented
- ✓ No governance violations

## Deployment Readiness
- ✓ Feature is backward compatible (or MOD document justifies breaking change)
- ✓ No hardcoded values; configuration is externalized
- ✓ Performance impact assessed (if applicable)

## Sign-Off
- ✓ Feature Lead/PO approves REQUEST
- ✓ Tech Lead approves PLAN and ADR alignment
- ✓ QA approves TEST-STRATEGY execution
- ✓ Tech Lead signs REVIEW document
- ✓ Product/Tech Lead confirms DONE status

## Notes
- Each project may refine this list, but these baseline criteria must be respected.
- Modifications to existing features must follow [CHANGE-MANAGEMENT.md](./CHANGE-MANAGEMENT.md) before REVIEW and DONE.
