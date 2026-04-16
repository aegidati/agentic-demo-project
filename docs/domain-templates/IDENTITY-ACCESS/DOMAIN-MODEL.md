# Identity & Access Domain Model

Status: Seed template for derived projects

## Overview

This document defines the architecture-agnostic domain baseline for
Identity & Access in Agentic-aligned projects. It standardizes the business
model, core terminology, and invariants without prescribing runtime implementation,
transport mechanisms, persistence models, or enforcement technology.

The baseline assumes:

- User identity is global across the platform.
- One User may belong to multiple Tenants.
- Authorization is always evaluated per User-Tenant pair.
- TenantRole values are tenant-scoped and may differ across Tenants.
- Deny-by-default applies when tenant context is missing or TenantMembership is invalid.
- No cross-tenant authorization inheritance is allowed.

## Core Entities

### User

User represents a globally recognizable identity in the platform.

Expected responsibilities:

- can exist independently from any single Tenant
- may hold multiple TenantMembership relationships
- may have a global lifecycle state relevant to platform-wide access decisions

User does not directly authorize actions. Authorization depends on the current Tenant context and the relevant TenantMembership.

### Tenant

Tenant represents an authorization boundary and business ownership boundary.

Expected responsibilities:

- defines the scope in which TenantRole and Permission evaluation occurs
- owns the membership roster for that boundary
- may contain settings and resources whose access is governed by tenant-scoped rules

### TenantMembership

TenantMembership represents the relationship between one User and one Tenant.

Expected responsibilities:

- binds a User to a Tenant
- carries TenantRole information for that Tenant
- carries MembershipStatus for authorization eligibility
- acts as the primary business fact used during tenant-scoped authorization evaluation

## Value Objects

### TenantRole

Baseline TenantRole values:

- Owner
- Admin
- Member
- Viewer

TenantRole is scoped to a single Tenant. The same User may hold different TenantRole values across different Tenants.

### MembershipStatus

MembershipStatus expresses whether a TenantMembership is valid for authorization. Derived projects may refine the status set, but it should support at least a distinction between valid membership and membership that must not authorize actions.

Illustrative statuses:

- Active
- Invited
- Suspended
- Revoked

### Permission

Permission is the business capability evaluated within a User-Tenant context.

Baseline Permission actions:

- membership:list
- membership:add
- membership:remove
- role:assign
- role:revoke
- resource:read
- resource:write
- resource:delete
- tenant:settings

### AuditEvent

AuditEvent is a first-class governance record in the domain. It captures that a business-relevant Identity & Access change occurred and preserves enough business context for traceability without prescribing storage, transport, or audit tooling.

Expected characteristics:

- identifies the business action that occurred
- links the action to the relevant Tenant when tenant-scoped governance applies
- captures the acting User or originating authority where meaningful
- references the affected User, TenantMembership, TenantRole, Permission, or ownership change when relevant
- supports downstream review of membership, role, and ownership history

## Aggregates And Invariants

Conceptual aggregates may vary by implementation, but the following invariants should remain stable.

### User Aggregate Invariants

- A User identity is global, not duplicated per Tenant.
- A global User status may restrict access platform-wide, but it must not replace tenant-scoped authorization.

### Tenant Aggregate Invariants

- Tenant authorization decisions are local to that Tenant.
- No authorization rights are inherited from one Tenant into another.
- Tenant operations that change membership or ownership must preserve explicit governance rules.

### TenantMembership Aggregate Invariants

- A TenantMembership must bind exactly one User to exactly one Tenant.
- Authorization requires a valid TenantMembership for the active Tenant context.
- Invalid or missing TenantMembership leads to deny-by-default.
- Self-elevation to a higher TenantRole is forbidden.
- Cross-tenant authorization inheritance is forbidden.
- Last-owner protection, if adopted, must be enforced consistently once decided.
- Business-relevant membership and role changes should produce an AuditEvent.

## Repository Contracts

Repository contracts are described conceptually only.

Expected repository responsibilities may include:

- loading a User by global identity
- loading a Tenant by business identifier
- loading TenantMembership for a specific User-Tenant pair
- listing TenantMembership records for a Tenant
- persisting membership and role changes as business state transitions
- retrieving AuditEvent records relevant to membership and role governance

This template does not prescribe repository interfaces, query languages, database technology, or transaction models.

## Domain Events

Common business events in this domain include:

- UserAddedToTenant
- TenantMembershipActivated
- TenantRoleAssigned
- TenantRoleRevoked
- TenantMembershipRemoved
- TenantOwnershipTransferred
- UserSuspendedGlobally
- TenantMembershipSuspended
- AuditEventRecorded

The exact event catalog may evolve in derived projects, but the business meaning should remain explicit and tenant-aware.

AuditEvent should be treated as part of the domain contract for governance-sensitive changes even when the persistence strategy is delegated to project-specific decisions.

## Authorization Rules

- Authorization must be evaluated against an explicit User-Tenant pair.
- Missing Tenant context results in deny-by-default.
- Invalid TenantMembership results in deny-by-default.
- TenantRole is evaluated only within the current Tenant.
- A User's rights in one Tenant must never imply rights in another Tenant.
- Authentication proves identity; authorization determines allowed actions within a Tenant.

## Example Use Cases

### Invite Or Add A User To A Tenant

A privileged actor associates a User with a Tenant through a new TenantMembership, assigns an initial TenantRole, and produces an AuditEvent.

### Switch Tenant Context

A User with multiple TenantMembership records selects a different Tenant. The platform reevaluates authorization using the TenantMembership for the newly active Tenant.

### Revoke A TenantRole

A privileged actor removes a TenantRole from a TenantMembership. The resulting authorization surface for that User within that Tenant is reduced accordingly.

### Transfer Ownership

Ownership is moved from one TenantMembership to another according to explicit governance rules, including any adopted last-owner protection policy.

## Open Questions

- Should global User suspension always override an otherwise valid TenantMembership?
- How should invited but not yet active membership be represented across projects?
- Should TenantRole remain fixed to the baseline set or allow controlled extension?
- What business visibility policy should apply when access is denied: forbidden, hidden, or contextual?
- Is last-owner protection mandatory at the platform level or delegated to each project ADR?
- What minimum AuditEvent retention expectations should be established for starter consumers?
