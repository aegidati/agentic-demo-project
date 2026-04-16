# Identity & Access Features Catalog

This catalog provides reusable IAM feature seeds for derived projects. Status values describe the maturity of the template content in this starter, not implementation completeness in any specific system.

## IAM-001 Tenant Membership And Authorization Baseline

Status: Recommended baseline

Defines the minimum multi-tenant authorization model based on User, Tenant, TenantMembership, TenantRole, and Permission. Derived projects should treat this as the default starting point unless they have documented reasons to diverge.

## IAM-002 Authentication Foundation

Status: Seeded for project design

Defines the need for a stable authentication foundation that can establish User identity before authorization occurs. This starter does not choose protocols, providers, tokens, or session strategies. Derived projects must convert this feature into project-specific authentication decisions.

## IAM-003 Tenant Context Resolution And Switching

Status: Seeded for ADR

Defines the requirement to resolve an active Tenant for authorization and to support switching when a User belongs to multiple Tenants. Derived projects should formalize how Tenant context is selected, stored, validated, and changed.

## IAM-004 Ownership Transfer And Last-Owner Protection

Status: Seeded with governance dependency

Defines the business need for controlled ownership transfer and protection against accidentally leaving a Tenant without valid ownership. Derived projects must decide whether last-owner protection is mandatory and how exceptional flows are handled.

## IAM-005 Audit Trail For Membership And Role Changes

Status: Recommended baseline

Defines the expectation that membership changes, role changes, removals, and ownership transitions produce traceable AuditEvent records. Derived projects should implement persistence and access patterns appropriate to their compliance needs.

## IAM-006 Identity Suspension And Recovery

Status: Proposed extension

Defines a reusable pattern for temporarily restricting a User or TenantMembership and supporting controlled recovery. Derived projects should decide whether suspension is global, tenant-scoped, or both.

## IAM-007 External Identity Provider Integration

Status: Optional integration seed

Defines the boundary where an external identity source may supply authentication or identity attributes while the platform still owns tenant-scoped authorization decisions. Derived projects should treat this as an integration boundary, not as a replacement for the local domain model.
