# Change Management

## Purpose
Define rules for safely modifying existing features, ensuring minimal ripple effects and maintaining system coherence.

## Change Classification

| Type | Impact | Process |
|------|--------|---------|
| **Bug Fix** | Existing behavior is corrected to spec | MOD-XX (lightweight) |
| **Refactor** | Internal implementation changes, no API change | MOD-XX (lightweight) |
| **Enhancement** | New capability within existing feature | MOD-XX (standard) |
| **API Breaking Change** | Changes to contracts, signatures, or serialization | MOD-XX (heavy) + ADR review |
| **Major Rewrite** | Significant redesign or behavior change | Consider new feature instead |

## Change Process

### Step 1: Prepare MOD Document
**File**: `docs/features/<FEATURE>/MOD-XX-<SHORT-TITLE>.md`

**Required Sections**:
- **Change Description**: What is changing and why?
- **Impact Analysis**: What systems/features are affected?
- **Backward Compatibility**: Are we breaking any contracts?
- **Test Strategy**: Which tests must pass?
- **Rollback Plan**: How to revert if needed?
- **Sign-Off Gate**: Who approves this change?

### Step 2: Implement
- Follow AGENTIC-WORKFLOW for implementation.
- Update original feature docs as needed.
- Log deviations in IMPLEMENTATION-LOG.

### Step 3: Validate
- Run all original feature tests + new tests.
- Deploy to staging (if applicable).
- Monitor for side effects.

### Step 4: Review and Done
- Update original feature's 04-REVIEW.md with MOD reference.
- Confirm feature completion in 05-DONE.md.
- Document lessons learned.

## Safety Rules

1. **Never silently change behavior**: Always document in MOD-XX.
2. **ADR violations require review**: If change contradicts an ADR, initiate ADR amendment.
3. **Dependent features must be notified**: Check ROUTING-MAP for downstream impact.
4. **Gradual migration for breaking changes**: Provide deprecation period, if possible.
5. **Test coverage must not decrease**: New changes must maintain or improve test coverage.

## Lightweight vs. Standard vs. Heavy Changes

### Lightweight (Bug Fix / Minor Refactor)
- Single system, no breaking changes.
- MOD-XX has minimal sections.
- Single approval gate.

### Standard (Feature Enhancement)
- May touch multiple systems.
- Backward compatible.
- Designer + Tech Lead approval.

### Heavy (API Breaking Change)
- Affects contracts or serialization.
- Requires ADR alignment review.
- Steering committee approval (if applicable).

## Escalation

If a change is unclear:
- Consult [PROJECT-CONSTITUTION.md](./PROJECT-CONSTITUTION.md).
- Escalate to Tech Lead / Steering Committee.
- Create an ADR to formalize the decision.
