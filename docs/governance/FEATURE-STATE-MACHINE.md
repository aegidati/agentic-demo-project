# Feature Lifecycle State Machine

All features follow the lifecycle below:

REQUEST -> PLAN -> TEST STRATEGY -> IMPLEMENTATION -> REVIEW -> DONE

State descriptions:

REQUEST
Initial feature request.

PLAN
Architecture and technical plan.

TEST STRATEGY
Testing strategy and validation plan.

IMPLEMENTATION
Code implementation.

REVIEW
Architecture and code validation.

DONE
Feature completed and verified.

Transition rules:

IMPLEMENTATION requires:

- PLAN
- TEST STRATEGY

REVIEW requires:

- IMPLEMENTATION

DONE requires:

- REVIEW approved
- passing validation evidence
- documentation updated

Enforcement owners:

- `new-feature-agent` initializes canonical lifecycle skeleton for new features.
- `feature-lifecycle-agent` validates stage progression and transition prerequisites.
- `feature-orchestrator` remains the high-level coordinator.

Implementation artifact compatibility:

- Canonical file: `03-IMPLEMENTATION-LOG.md`
- Backward-compatible alias: `03-IMPLEMENTATION.md`
- Validation accepts both, but canonical reporting must prefer `03-IMPLEMENTATION-LOG.md`.

Invalid transitions must be rejected.
