# Architecture Snapshot

> This document is a **template**. In derived projects, populate it after selecting an architecture via a starter pack.

## Current Architecture

**Status**: Template (no architecture selected yet)

### Technology Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| **Language** | _TBD_ | _TBD_ |
| **Framework** | _TBD_ | _TBD_ |
| **Database** | _TBD_ | _TBD_ |
| **Cache** | _TBD_ | _TBD_ |
| **API Style** | _TBD_ | _TBD_ |

### Directory Structure
```
app/
├── (structure defined by chosen starter pack)
└── (see STARTER-PACKS.md for details)
```

### Key Architectural Decisions
- **Primary ADR**: See `docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md`
- **Additional ADRs**: Listed in [ADR-INDEX.md](../adr/ADR-INDEX.md)

### Layering Model
```
(See ARCHITECTURE-REQUIREMENTS.md for standard layering)
```

### Data Model
- **Database type**: _TBD_
- **Schema location**: `app/migrations/` (placeholder)
- **ORM / Query builder**: _TBD_

### API Contracts
- **API style**: _TBD_ (REST, GraphQL, etc.)
- **Documentation**: _TBD_ (OpenAPI, GraphQL schema, etc.)
- **Versioning strategy**: _TBD_

### External Dependencies
| Service | Purpose | Integration |
|---------|---------|-------------|
| (TBD) | (TBD) | (TBD) |

### Deployment Model
- **Platform**: _TBD_ (Cloud, Kubernetes, etc.)
- **Scaling strategy**: _TBD_
- **Configuration**: _TBD_

### Testing Strategy
- **Unit test framework**: _TBD_
- **Integration test framework**: _TBD_
- **Coverage target**: _TBD_

### Observability
- **Logging**: _TBD_
- **Metrics**: _TBD_
- **Tracing**: _TBD_

## Conformance Checklist

✓ Follows [ARCHITECTURE-REQUIREMENTS.md](./ARCHITECTURE-REQUIREMENTS.md)  
✓ All ADRs documented in `docs/adr/`  
✓ Starter pack installed and verified  
✓ Project-specific customizations documented  

---

**Last Updated**: (Update when architecture changes)  
**Approved By**: (Tech Lead signature)
