# Identity & Access ADR Seeds

These ADR seeds are intended to be promoted into project ADRs by downstream teams. They identify decisions that materially affect IAM behavior but are intentionally left unresolved in this starter.

## Global Identity Strategy

Question: How is a global User identified consistently across the platform?

Options to consider:

- platform-managed global identity record
- external identity mapped into local User identity
- hybrid model with local canonical User and external identity links

Decision point: Choose the canonical source of User identity and define how identity changes are reconciled.

## Tenant Context Resolution Strategy

Question: How is the active Tenant context selected and validated for a User who belongs to multiple Tenants?

Options to consider:

- explicit user-driven Tenant selection
- context derived from resource navigation
- context resolved from invitation or onboarding flow
- policy requiring explicit confirmation on each sensitive workflow

Decision point: Define how Tenant context is resolved, switched, persisted, and invalidated.

## Forbidden Vs Hidden Resource Policy

Question: When a User lacks access, should the platform reveal resource existence or hide it?

Options to consider:

- always return forbidden when the resource exists in the active Tenant
- hide resource existence unless a minimal discovery Permission exists
- contextual policy based on resource sensitivity

Decision point: Select the visibility model for unauthorized access and document the rationale.

## Last-Owner Protection

Question: Must a Tenant always retain at least one valid Owner?

Options to consider:

- strict last-owner protection with no exceptions
- protection with controlled administrative override
- no mandatory protection, handled operationally

Decision point: Define whether last-owner protection is required and how emergency cases are resolved.

## Membership Lifecycle Strategy

Question: What lifecycle states can a TenantMembership move through, and what business transitions are allowed?

Options to consider:

- simple active or revoked lifecycle
- invited, active, suspended, revoked lifecycle
- lifecycle enriched with pending verification or approval states

Decision point: Select the MembershipStatus model and its allowed transitions.

## Role Model Extensibility

Question: Are TenantRole values fixed to the baseline set or extensible?

Options to consider:

- fixed Owner, Admin, Member, Viewer set
- controlled extension through governance approval
- project-specific role extensions with baseline compatibility rules

Decision point: Decide whether and how TenantRole can be extended without breaking consistency.

## Audit Event Persistence Strategy

Question: Where and how are AuditEvent records stored and retained?

Options to consider:

- application-owned audit store
- platform-wide audit service
- append-only event store
- operational logs supplemented by durable audit records

Decision point: Choose the persistence and retention approach for AuditEvent records.

## Global User Status Vs Tenant Membership

Question: How should global User status interact with tenant-scoped TenantMembership decisions?

Options to consider:

- global User status always overrides tenant-scoped access
- global User status restricts only selected capabilities
- tenant-scoped access remains primary unless compliance policy intervenes

Decision point: Define the precedence model between global identity state and tenant-scoped membership state.

## External Identity Provider Boundary

Question: What remains inside the local IAM domain when authentication is delegated to an external identity provider?

Options to consider:

- external provider handles identity proof only
- external provider supplies identity attributes but local domain owns authorization
- external provider influences lifecycle signals while TenantMembership remains local

Decision point: Define the boundary between external identity concerns and local domain ownership.

## Ownership Transfer Flow

Question: What business flow is required to transfer ownership from one User to another within a Tenant?

Options to consider:

- direct transfer by current Owner
- transfer requiring confirmation by target User
- transfer with dual approval or operational oversight

Decision point: Select the minimum safe ownership transfer flow and audit expectations.
