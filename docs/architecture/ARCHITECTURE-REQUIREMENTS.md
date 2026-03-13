# Architecture Requirements

## Non-Stack Requirements

Even though this template is **stack-agnostic**, all architectures must satisfy these requirements:

## 1. Layering & Separation of Concerns

### Recommended Layer Model
```
┌─────────────────────────────────┐
│     Presentation / UI Layer      │  (Controllers, Views, Pages)
├─────────────────────────────────┤
│     Application / Agent Layer    │  (Use Cases, Orchestration)
├─────────────────────────────────┤
│     Domain / Business Logic      │  (Entities, Value Objects)
├─────────────────────────────────┤
│     Persistence / Infrastructure │  (DB, Cache, External APIs)
└─────────────────────────────────┘
```

**Rules**:
- Higher layers **may depend on** lower layers.
- Lower layers **must NOT depend on** higher layers (unidirectional dependency).
- Domain layer must be **framework-agnostic**.

## 2. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Entities** | PascalCase, singular | `Customer`, `Order` |
| **Value Objects** | PascalCase, descriptive | `Email`, `Address` |
| **Use Cases** | PascalCase, VerbNoun | `CreateCustomerUseCase` |
| **Repositories** | Interface `I<Domain>Repository`, Implementation `<Domain>Repository` | `ICustomerRepository`, `PostgresCustomerRepository` |
| **Services** | PascalCase, Verb or Domain | `EmailService`, `AuthenticationService` |
| **Configuration** | snake_case (files), UPPER_CASE (env vars) | `app.config.yml`, `DATABASE_URL` |

## 3. Dependency Injection

**Expectation**:
- All framework-agnostic dependencies must be injectable.
- Constructors should accept interfaces, not concrete classes.
- Configuration must be externalized (via config files or environment variables).

## 4. Testing Strategy

**Mandatory Levels**:
- **Unit tests**: Test domain logic in isolation (no DB, no HTTP).
- **Integration tests**: Test with infrastructure (DB, cache).
- **End-to-end tests**: Test user workflows (optional, based on starter pack).

**Coverage targets**:
- Domain logic: ≥ 80%
- Use cases: ≥ 70%
- Infrastructure: ≥ 50%

## 5. API Contracts

**If exposing APIs** (REST, GraphQL, RPC):
- Document contracts explicitly (OpenAPI, GraphQL schema, Protobuf).
- Use semantic versioning for breaking changes.
- Provide deprecation warnings before removing endpoints.

## 6. Data Model

**Expectations**:
- **Database-agnostic domain model**: Domain entities must not be database ORM objects.
- **Mapping layer**: Use a repository layer to map between domain entities and database records.
- **Schema migrations**: Document all schema changes in a migrations folder.

## 7. Configuration Management

**Rules**:
- No hardcoded values in code.
- Configuration layering: (defaults) → (config files) → (environment variables)
- Secrets: Never commit to version control; use Key Vault or secrets manager.

## 8. Logging & Observability

**Requirements**:
- Structured logging (JSON or equivalent).
- Log levels: DEBUG, INFO, WARN, ERROR.
- Correlation IDs for tracing requests across services.

## 9. Security Baseline

**Mandatory checks**:
- Input validation on all boundaries.
- Output encoding for injection attack prevention.
- Authentication and authorization on all protected endpoints.
- Secrets never logged.

## 10. Documentation Requirements

- **README.md**: How to run the project locally.
- **CONTRIBUTING.md**: How to contribute (once needed).
- **API documentation**: OpenAPI or equivalent (if applicable).
- **Architecture decision records** (ADRs): In `docs/adr/`.

## Validation

Use these ADRs and ARCHITECTURE-SNAPSHOT.md to validate conformance:
- If your starter pack deviates from these requirements, document it in an ADR.
- Agents will check conformance during code review.
