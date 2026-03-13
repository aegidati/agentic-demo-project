# Features Lifecycle Directory

This directory contains the **documentation lifecycle** for all features in the project.

## Structure

Each feature gets its own subfolder with the standardized lifecycle:

```
docs/features/
├── <FEATURE-NAME>/
│   ├── 00-REQUEST.md              # User story & acceptance criteria
│   ├── 01-PLAN.md                 # Technical design & approach
│   ├── 02-TEST-STRATEGY.md        # Test cases & coverage
│   ├── 03-IMPLEMENTATION-LOG.md   # Execution progress & decisions
│   ├── 04-REVIEW.md               # Validation, sign-off, lessons learned
│   ├── 05-DONE.md                 # Final completion & release readiness
│   └── MOD-XX-<CHANGE>.md         # (Optional) Modifications to existing feature
```

## Lifecycle Phases

### Phase 0: REQUEST
**Owner**: Product / Feature Lead

Document the **what** and **why**, not the how:
- User story / problem statement
- Acceptance criteria
- Constraints and dependencies
- Success metrics

### Phase 1: PLAN
**Owner**: Tech Lead / Architect

Document the **how**:
- Technical approach
- Architecture / design decisions
- Dependencies and integration points
- Implementation tasks

### Phase 2: TEST-STRATEGY
**Owner**: QA / Lead Developer

Define **verification**:
- Test scope and levels (unit, integration, e2e)
- Test cases (happy path, error cases, edge cases)
- Coverage targets
- Test environment needs

### Phase 3: IMPLEMENTATION-LOG
**Owner**: Developer

Document **execution**:
- Progress on implementation tasks
- Key decisions and blockers
- Test execution results
- Lessons learned

### Phase 4: REVIEW
**Owner**: Tech Lead / Project Lead

Validate and sign-off when **Definition of Done** is met:
- Verify all acceptance criteria addressed
- Confirm test evidence collected
- Document deviations from plan
- Lessons learned for future features

### Phase 5: DONE
**Owner**: Product / Tech Lead

Finalize feature completion:
- Confirm all Definition of Done criteria are satisfied
- Ensure documentation is complete and current
- Mark feature ready for release

### Modifications (MOD documents)
**For changes to existing features**:

Create `MOD-XX-<SHORT-TITLE>.md` documenting:
- What changed and why
- Impact analysis
- Test evidence
- Sign-off

See: [docs/governance/CHANGE-MANAGEMENT.md](../governance/CHANGE-MANAGEMENT.md)

## Guidelines

1. **Complete each phase before starting the next**
   - No implementation without REQUEST + PLAN
   - No code review without TEST-STRATEGY
   - No work without approval

2. **Use clear, enforceable language**
   - No vague requirements
   - Acceptance criteria must be testable
   - Designs must be implementable

3. **Cross-reference related documents**
   - Link to ADRs that constrain the feature
   - Reference related features (dependencies)
   - Document architectural decisions

4. **Keep documents synchronized**
   - If PLAN changes, update IMPLEMENTATION-LOG
   - If features affect each other, update both
   - Maintain ROUTING-MAP and ARCHITECTURE-SNAPSHOT

## Epic Features

For larger features, create an **epic** folder:

```
docs/features/<EPIC-NAME>/
├── <EPIC-NAME>-EPIC-00-REQUEST.md       # Epic-level requirements
├── <EPIC-NAME>-EPIC-ROADMAP.md          # Breakdown into stories
└── <STORY-1>/
    ├── 00-REQUEST.md
    ├── 01-PLAN.md
    ...
```

Each story within an epic follows the same lifecycle.

## Definition of Done

A feature is **Done** when it meets all criteria in [docs/governance/DEFINITION-OF-DONE.md](../governance/DEFINITION-OF-DONE.md).

## Custom Agents

These agents enforce the feature lifecycle:
- **feature-orchestrator**: Ensures REQUEST → PLAN → TEST → IMPL → REVIEW → DONE order
- **documentation-guardian**: Validates completeness and quality
- **test-designer**: Reviews TEST-STRATEGY and validates evidence
- **architecture-guardian**: Checks ADR alignment

---

**Template Status**: Ready for use in derived projects

See: [docs/governance/AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md) for details
