# Domain Templates

This directory contains **domain model templates** for the application.

Each domain represents a cohesive area of business logic with consistent terminology, entities, and rules.

## Purpose

Domain templates serve to:
- Define the **ubiquitous language** (domain terminology)
- Document **entities, value objects, and aggregates**
- Catalog **features** belonging to each domain
- Propose **domain-specific architectural decisions (ADR seeds)**
- Enable **domain-driven design** across the project

## Structure

```
docs/domain-templates/
├── README.md                          # This file
├── <DOMAIN-NAME>/
│   ├── DOMAIN-MODEL.md                # Entities, value objects, aggregates, repositories
│   ├── FEATURES-CATALOG.md            # Features in this domain (with feature lifecycle links)
│   ├── ADR-SEEDS.md                   # Suggested ADRs for domain-specific decisions
│   └── (optional) EVENTS.md           # Domain events and event sequences
```

## Available Domains

| Domain | Status | Model | Features | ADRs |
|--------|--------|-------|----------|------|
| **CUSTOMERS** | Template | [DOMAIN-MODEL.md](./CUSTOMERS/DOMAIN-MODEL.md) | [FEATURES-CATALOG.md](./CUSTOMERS/FEATURES-CATALOG.md) | [ADR-SEEDS.md](./CUSTOMERS/ADR-SEEDS.md) |

---

## Creating a New Domain

### Step 1: Plan the Domain
Answer these questions:
- **What business area does this domain cover?**
- **What are the core entities and concepts?**
- **What are the clear boundaries?** (Where does this domain end and another begin?)
- **What is the ubiquitous language?** (What terms do domain experts use?)

### Step 2: Create Domain Folder
```bash
mkdir -p docs/domain-templates/<DOMAIN-NAME>
```

### Step 3: Define Domain Model
Create `DOMAIN-MODEL.md`:

**Sections to include**:
1. **Overview**: What does this domain do?
2. **Core Entities**: Key entities with attributes, lifecycle, business rules
3. **Value Objects**: Immutable domain concepts (Email, Money, Address, etc.)
4. **Aggregates**: Groupings of entities/value objects with consistency rules
5. **Repository Contracts**: Interfaces for persistence
6. **Domain Events**: Significant state changes in this domain
7. **Use Cases**: Primary workflows in this domain

**Template**:
```markdown
# Domain Model – <DOMAIN-NAME>

## Overview
[Brief description of what this domain manages]

## Core Entities
### <Entity-Name>
**Purpose**: [What is this entity?]

**Attributes**:
- `id`: [description]
- `field1`: [description]

**Business Rules**:
- [Rule 1]
- [Rule 2]

## Value Objects
### <ValueObject-Name>
[Description, validation rules, immutability]

## Aggregates
[Describe root entities and their boundaries]

## Repository Contracts
[Interface definitions for persistence]

## Domain Events
- `<EventName>`: [Triggered when?]

## Use Cases (Examples)
- [Use case 1]
- [Use case 2]

---
**Status**: [Template | Active | Deprecated]
```

### Step 4: Catalog Features
Create `FEATURES-CATALOG.md`:

List all features belonging to this domain with links to feature lifecycle documents.

**Template**:
```markdown
# Features Catalog – <DOMAIN-NAME>

| Feature ID | Name | Status | Link |
|------------|------|--------|------|
| <ID-001> | [Feature] | Planned | [docs/features/...] |

---
**Integration Points**:
- [Other domains this domain depends on]
```

### Step 5: Define ADR Seeds
Create `ADR-SEEDS.md`:

Propose architecture decisions likely to arise in this domain.

**Template**:
```markdown
# ADR Seeds – <DOMAIN-NAME>

## Potential ADRs

### <DOMAIN>-ADR-001: [Title]
**Question**: [What are we deciding?]

**Options**: [Option A, Option B, Option C]

**Decision Point**: [Why is this significant?]

---
[Repeat for each seed]
```

### Step 6: (Optional) Define Domain Events
Create `EVENTS.md`:

For domains with complex event flows, document event sequences and interactions.

**Template**:
```markdown
# Domain Events – <DOMAIN-NAME>

## Event Sequence: [Use Case]
```
[UseCase Start]
  ↓
[Event 1] → [Listener in Domain X]
  ↓
[Event 2] → [Listener in Domain Y]
  ↓
[UseCase End]
```

## Dependencies
- [Event 1 triggers Event 2 in Domain X]
```

---

## Using Domain Templates

### For Feature Development
When planning a feature:
1. Identify which domain(s) it belongs to
2. Review the domain's DOMAIN-MODEL.md
3. Ensure feature respects domain boundaries
4. Use ubiquitous language (domain terminology) consistently
5. Document new entities/events if needed

### For Architecture Decisions
1. Check ADR-SEEDS.md in relevant domains
2. Convert seeds to concrete ADRs if needed (using `docs/adr/ADR-TEMPLATE.md`)
3. Link ADR to domain template
4. Update DOMAIN-MODEL.md if architecture changes

### For Domain Evolution
When a domain changes:
1. Update DOMAIN-MODEL.md
2. Check if FEATURES-CATALOG.md needs updating
3. Create ADRs for significant decisions
4. Document lessons learned

---

## Ubiquitous Language

**Golden Rule**: Code, docs, and conversation must use the same domain terminology.

**Examples**:
- ✓ "Customer" (don't use "User", "Account", "Party")
- ✓ "Order" (don't use "Purchase", "Sale", "Transaction")
- ✓ "Email" (value object, not just "string")

**Enforcement**:
- Code reviews check terminology consistency
- `@domain-template-agent` agent validates ubiquitous language
- Domain experts review new domain models

---

## Best Practices

1. **Start Simple**: Begin with core entities; add complexity as needed
2. **Boundary Clarity**: Make domain boundaries explicit
3. **Language Consistency**: Invest in ubiquitous language early
4. **Event-Driven Integration**: Use domain events for cross-domain communication
5. **ADR Linkage**: Connect domain decisions to ADRs

---

## Resources

- **Domain-Driven Design**: Eric Evans
- **Implementing DDD**: Vaughn Vernon
- **Domain Events**: See events section in DOMAIN-MODEL.md examples
- **ADR Seeds**: Basis for architectural decisions in this domain

---

## Custom Agent Support

`@domain-template-agent` agent assists with:
- Domain model validation
- Ubiquitous language consistency
- Cross-domain dependency analysis
- Domain event identification
- Domain-specific ADR suggestions

See: [.github/agents/domain-template.agent.md](../../.github/agents/domain-template.agent.md)

---

**Status**: Ready for use in derived projects
