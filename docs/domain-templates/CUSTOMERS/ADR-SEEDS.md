# ADR Seeds – Customers Domain

This document suggests **Architecture Decision Record (ADR) topics** that typically arise in the Customers domain.

You should create concrete ADRs from these seeds as decisions are made in your project.

## Potential ADRs for Customers Domain

### CUST-ADR-001: Customer Identifier Strategy
**Question**: How do we identify customers uniquely?

**Options to consider**:
- Numeric auto-increment ID (database native)
- UUID (database-agnostic, privacy-friendly)
- Composite key (email + domain)

**Decision point**: Impacts API design, database schema, distributed systems.

### CUST-ADR-002: Email Uniqueness Enforcement
**Question**: Is customer email globally unique? Per domain?

**Options to consider**:
- Global uniqueness (one email per system)
- Domain-scoped uniqueness (one email per organization/domain)
- Non-unique (allow multiple accounts per email)

**Decision point**: Impacts authentication, merge logic, multi-tenancy.

### CUST-ADR-003: Customer Status Lifecycle
**Question**: What are valid customer statuses and allowed transitions?

**Options to consider**:
- Simple: Active / Inactive
- Complex: Active, Inactive, Suspended, Archived, Deleted
- Soft delete: Logical vs. physical deletion

**Decision point**: Impacts audit requirements, data retention, API design.

### CUST-ADR-004: Profile Data Storage
**Question**: Where do profile fields (phone, address) live?

**Options to consider**:
- In main Customer entity
- In separate Profile entity (current template)
- In JSON blob (embedded)
- In separate service (distributed)

**Decision point**: Impacts query performance, normalization, update semantics.

### CUST-ADR-005: Audit & History Tracking
**Question**: How do we track customer changes for compliance?

**Options to consider**:
- Audit table (every change logged)
- Event sourcing (all events immutable)
- Change flags + timestamp
- No tracking (simplest, non-compliant)

**Decision point**: Impacts compliance, debugging, data storage.

### CUST-ADR-006: Communication Preferences
**Question**: How do we represent customer preferences (email, SMS, push)?

**Options to consider**:
- Boolean flags per channel
- Enum/set of enabled channels
- JSON blob
- Separate ChannelPreference entities

**Decision point**: Impacts extensibility, query complexity.

---

## Creating ADRs from Seeds

For each seed:
1. Create a new ADR file: `docs/adr/ADR-XXX-CUST-<TOPIC>.md`
2. Use [ADR-TEMPLATE.md](../../adr/ADR-TEMPLATE.md)
3. Make a decision and document it
4. Reference the ADR in feature docs and DOMAIN-MODEL.md

---

**Status**: Seeds (to be converted to concrete ADRs in derived project)
