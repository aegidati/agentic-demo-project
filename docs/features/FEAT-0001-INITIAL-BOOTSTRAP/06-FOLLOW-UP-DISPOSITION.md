# FEAT-0001 Follow-Up Disposition

**Document Date**: 2026-04-22  
**Review Cycle**: Post-closure tracking

## Summary
This artifact classifies and tracks all follow-up actions identified in FEAT-0001 closure. Follow-ups are categorized as:
- **RESOLVED**: Decision made and documented in project ADRs (via FEAT-0002 implementation).
- **DEFERRED**: Decision point identified but intentionally deferred to future features/phases.

---

## Identity & Access ADR-SEEDS Follow-Up Status

### 1. Global Identity Strategy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Global Identity Strategy
- **Status**: DEFERRED
- **Rationale**: FEAT-0002 focuses on tenant-scoped authorization with implicit User identity validation via token claims. Full global identity strategy (canonical source, identity reconciliation, external identity federation) is out of scope.
- **Deferral Target**: Future authentication/identity feature (FEAT-003 or related).
- **Related ADR**: None (future ADR-008 candidate).
- **Owner**: TBD
- **Due Date**: TBD

### 2. Tenant Context Resolution Strategy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Tenant Context Resolution Strategy
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY.md](../../adr/ADR-002-TENANT-CONTEXT-RESOLUTION-STRATEGY.md) during FEAT-0002.
- **Decision Summary**: Route-first tenant resolution with header validation and conflict detection; explicit user-driven tenant selection in web/client UI.
- **Implementation Evidence**: FEAT-0002 INC-01..INC-04 implement ADR-002 constraints.

### 3. Forbidden Vs Hidden Resource Policy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Forbidden Vs Hidden Resource Policy
- **Status**: DEFERRED
- **Rationale**: FEAT-0002 focuses on membership authorization baseline. Visibility policy for unauthorized resources (reveal existence vs hide) is a future authorization design decision.
- **Deferral Target**: Future feature implementing fine-grained ACL or resource discovery (FEAT-003+).
- **Related ADR**: None (future ADR-009 candidate).
- **Owner**: TBD
- **Due Date**: TBD

### 4. Last-Owner Protection Policy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Last-Owner Protection
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-004-LAST-OWNER-PROTECTION-POLICY.md](../../adr/ADR-004-LAST-OWNER-PROTECTION-POLICY.md) during FEAT-0002.
- **Decision Summary**: Strict last-owner protection; removing or demoting the final active Owner in a tenant is rejected.
- **Implementation Evidence**: FEAT-0002 INC-02 membership invariants enforce this policy.

### 5. Membership Lifecycle Strategy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Membership Lifecycle Strategy
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY.md](../../adr/ADR-003-MEMBERSHIP-LIFECYCLE-STRATEGY.md) during FEAT-0002.
- **Decision Summary**: Four-state lifecycle (Invited, Active, Suspended, Revoked) with explicit transition rules.
- **Implementation Evidence**: FEAT-0002 INC-01 contract baseline defines states; INC-02 enforces transitions.

### 6. Role Model Extensibility Policy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Role Model Extensibility
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md](../../adr/ADR-005-ROLE-MODEL-EXTENSIBILITY-POLICY.md) during FEAT-0002.
- **Decision Summary**: Baseline role set (Owner, Admin, Member, Viewer) defined as extensible via controlled governance.
- **Implementation Evidence**: FEAT-0002 INC-01 OpenAPI contract defines role enum with extensibility note.

### 7. Audit Event Persistence Strategy
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Audit Event Persistence Strategy
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-006-AUDIT-EVENT-PERSISTENCE-AND-RETENTION.md](../../adr/ADR-006-AUDIT-EVENT-PERSISTENCE-AND-RETENTION.md) during FEAT-0002.
- **Decision Summary**: Append-only event store with configurable sink (file/memory) and retention policies (default 90 days).
- **Implementation Evidence**: FEAT-0002 INC-03 implements file-based audit sink with retention pruning.

### 8. Global User Status Vs Tenant Membership
- **Seed Reference**: docs/domain-templates/IDENTITY-ACCESS/ADR-SEEDS.md - Global User Status Vs Tenant Membership
- **Status**: RESOLVED
- **Resolution**: Decision made and documented in [ADR-007-GLOBAL-USER-STATUS-PRECEDENCE.md](../../adr/ADR-007-GLOBAL-USER-STATUS-PRECEDENCE.md) during FEAT-0002.
- **Decision Summary**: Global User status (e.g., suspend) overrides tenant-scoped membership authorization; denied at authentication layer with deterministic 403.
- **Implementation Evidence**: FEAT-0002 INC-02 global-user-status port and use-case integration.

---

## Authentication ADR-SEEDS Follow-Up Status

### 1. Identity Provider Selection
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Identity Provider Selection
- **Status**: DEFERRED
- **Rationale**: Authentication provider choice (Auth0, Entra ID, self-hosted OIDC, etc.) is not in FEAT-0002 scope.
- **Deferral Target**: Future authentication implementation feature (FEAT-003 or dedicated auth feature).
- **Related ADR**: None (future ADR-008 or ADR-AUTHENTICATION-* candidate).
- **Recommendation**: Review profile guidance for fullstack-react-native stack; Auth0 recommended for Node/TypeScript backend and React/React Native clients.
- **Owner**: TBD
- **Due Date**: TBD

### 2. Token Storage Strategy
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Token Storage Strategy
- **Status**: DEFERRED
- **Rationale**: Token storage (in-memory, sessionStorage, localStorage, HttpOnly cookie, platform-specific storage) depends on chosen auth provider and security requirements.
- **Deferral Target**: Future authentication implementation feature.
- **Related ADR**: None.
- **Owner**: TBD
- **Due Date**: TBD

### 3. Token Refresh Strategy
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Token Refresh Strategy
- **Status**: DEFERRED
- **Rationale**: Silent refresh, explicit endpoint, or no-refresh strategy is provider-dependent and not in FEAT-0002 scope.
- **Deferral Target**: Future authentication implementation feature.
- **Related ADR**: None.
- **Owner**: TBD
- **Due Date**: TBD

### 4. RefreshCredential Rotation Policy
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - RefreshCredential Rotation Policy
- **Status**: DEFERRED
- **Rationale**: Rotation policy (on each use, fixed, grace period) is a security hardening decision for authentication feature.
- **Deferral Target**: Future authentication implementation feature.
- **Related ADR**: None.
- **Owner**: TBD
- **Due Date**: TBD

### 5. Logout And Token Revocation
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Logout And Token Revocation
- **Status**: DEFERRED
- **Rationale**: Logout strategy (client-only, provider-side, backend revocation, combination) depends on provider capabilities and security posture.
- **Deferral Target**: Future authentication implementation feature.
- **Related ADR**: None.
- **Owner**: TBD
- **Due Date**: TBD

### 6. Token Audience And Scope Configuration
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Token Audience And Scope Configuration
- **Status**: DEFERRED
- **Rationale**: Audience/scope configuration (single audience, multi-audience, scopes, app roles) is backend-specific and deferred.
- **Deferral Target**: Future authentication implementation feature.
- **Related ADR**: None.
- **Owner**: TBD
- **Due Date**: TBD

### 7. Authentication Event Persistence
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Authentication Event Persistence
- **Status**: DEFERRED
- **Rationale**: Authentication event storage (structured logs, dedicated audit store, provider logs) is implementation-specific and deferred.
- **Deferral Target**: Future authentication implementation feature; may integrate with ADR-006 audit persistence.
- **Related ADR**: ADR-006 (audit persistence) — future coordination.
- **Owner**: TBD
- **Due Date**: TBD

### 8. Tenant Context From Token Claims
- **Seed Reference**: docs/domain-templates/AUTHENTICATION/ADR-SEEDS.md - Tenant Context From Token Claims
- **Status**: DEFERRED
- **Rationale**: Whether tenant context is carried in token claims vs resolved at request-time is tied to authentication provider choice and token design.
- **Deferral Target**: Future authentication implementation feature; must align with ADR-002 (tenant context resolution).
- **Related ADR**: ADR-002 (tenant resolution) — future coordination.
- **Owner**: TBD
- **Due Date**: TBD

---

## Other Follow-Up Items

### 1. Authentication Profile Recipe for fullstack-stack-react-native
- **Reference**: FEAT-0001 03-IMPLEMENTATION-LOG.md - Partial deferral
- **Status**: DEFERRED
- **Rationale**: Exact authentication profile recipe for the fullstack-react-native stack (backend: clean-backend, web: react-spa, client: react-native) is not yet specified in docs/profiles/.
- **Current State**: Closest reference recipes used during bootstrap; full recipe pending authentication provider decision.
- **Deferral Target**: Future authentication feature implementation or profile documentation update.
- **Owner**: TBD
- **Due Date**: TBD

### 2. Explicit Sign-Off Records In Governance Cycle
- **Reference**: FEAT-0001 05-DONE.md - Low priority follow-up
- **Status**: RESOLVED (via AI-Verified convention)
- **Resolution**: FEAT-0002 implementation establishes AI-Verified sign-off model in agentic-demo-project context, per PROJECT-CONSTITUTION agent-assisted workflow principle.
- **Policy Update**: Update docs/governance/DEFINITION-OF-DONE.md and docs/governance/PROJECT-CONSTITUTION.md to explicitly document AI-Verified as valid sign-off mechanism in agentic development context.
- **Implementation Evidence**: FEAT-0002 04-REVIEW.md and 05-DONE.md use AI-Verified sign-offs with explicit rationale.
- **Owner**: Documentation Guardian
- **Due Date**: Before FEAT-0003 closure

---

## Summary Table

| Follow-Up Category | Item | Status | Deferred To | Owner | Due |
|---|---|---|---|---|---|
| IAM ADR-SEEDS | Global Identity Strategy | DEFERRED | FEAT-003+ | TBD | TBD |
| IAM ADR-SEEDS | Tenant Context Resolution | RESOLVED | ADR-002 | N/A | N/A |
| IAM ADR-SEEDS | Forbidden Vs Hidden Policy | DEFERRED | FEAT-003+ | TBD | TBD |
| IAM ADR-SEEDS | Last-Owner Protection | RESOLVED | ADR-004 | N/A | N/A |
| IAM ADR-SEEDS | Membership Lifecycle | RESOLVED | ADR-003 | N/A | N/A |
| IAM ADR-SEEDS | Role Extensibility | RESOLVED | ADR-005 | N/A | N/A |
| IAM ADR-SEEDS | Audit Persistence | RESOLVED | ADR-006 | N/A | N/A |
| IAM ADR-SEEDS | Global User Status | RESOLVED | ADR-007 | N/A | N/A |
| AUTH ADR-SEEDS | Identity Provider | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Token Storage | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Token Refresh | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Credential Rotation | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Logout/Revocation | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Audience/Scope | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Auth Event Persistence | DEFERRED | FEAT-AUTH | TBD | TBD |
| AUTH ADR-SEEDS | Token Claims Tenant | DEFERRED | FEAT-AUTH | TBD | TBD |
| Other | Auth Profile Recipe (fullstack-react-native) | DEFERRED | FEAT-AUTH | TBD | TBD |
| Governance | Sign-Off Records | RESOLVED | Policy Update | Doc Guardian | 2026-04-30 |

**Resolved**: 6/6 IAM decisions + 1 governance policy = 7 items  
**Deferred**: 2 IAM decisions + 8 AUTH decisions + 1 profile = 11 items  
**Total**: 18 follow-up items tracked and classified

---

## Recommendations

1. **Next feature (FEAT-0003)**: Consider prioritizing authentication implementation to resolve 8 deferred AUTH ADR-SEEDS.
2. **Profile documentation**: Add fullstack-react-native authentication recipe to docs/profiles/ during FEAT-0003 or dedicated profile-update feature.
3. **Policy update**: Update DEFINITION-OF-DONE.md and PROJECT-CONSTITUTION.md to document AI-Verified sign-off mechanism before FEAT-0003 closure.
4. **Coordination**: Future authorization features (fine-grained ACL, resource visibility) should reference Forbidden Vs Hidden Policy deferred decision.

---

**Status**: All follow-up items from FEAT-0001 closure are now classified and tracked in this artifact. FEAT-0001 closure is COMPLETE with follow-ups formally dispositioned.
