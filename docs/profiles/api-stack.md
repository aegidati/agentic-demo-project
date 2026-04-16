# Authentication Recipe — api-stack

Profile: api-stack
Stack: Clean Architecture Backend (Node/TypeScript) + PostgreSQL (no frontend)

## Overview

This recipe describes the recommended authentication architecture for projects using the api-stack profile. There is no browser-based client. Authentication is service-to-service or developer-to-API. The backend exposes a protected HTTP API consumed by other services, CLI tools, or external clients.

## Recommended AuthProvider

Auth0 via OAuth 2.0 Client Credentials flow (Machine-to-Machine Application).

Rationale: Auth0 supporta Client Credentials natively tramite le M2M Application registrations. I callers ottengono un JWT standard firmato da Auth0 e il backend lo valida tramite JWKS identico agli altri profili.

## Token Strategy

**IdentityToken (Access Token)**:
- Format: JWT signed by Auth0
- Lifetime: short (configurable, default ~1 hour)
- Audience: this API's registered application URI
- Carried in: `Authorization: Bearer <token>` header

**RefreshCredential**: not used. Callers acquire a new token before expiry using client credentials.

## Session Model

- No AuthSession exists: the flow is fully stateless.
- Each caller acquires a token using its own `client_id` + `client_secret` or certificate.
- Callers cache the token in memory until near expiry, then acquire a new one.
- No browser, no session store, no cookie management required.

## Token Acquisition By Callers

Callers (other services, CLI tools, integration clients) must:

1. Register their own application in Auth0 as a Machine-to-Machine Application with a `client_id` and `client_secret`.
2. Request a token using the Client Credentials grant to `https://<tenant>.auth0.com/oauth/token` targeting this API's audience.
3. Cache the token until the `exp` claim minus a safety margin.
4. Include the token in the `Authorization: Bearer` header on every request to this API.

## Backend Validation Pattern

Identical to web-stack validation. On every protected request:

1. Extract bearer token from `Authorization` header.
2. Fetch or cache the Auth0 JWKS from `https://<tenant>.auth0.com/.well-known/jwks.json`.
3. Verify JWT signature.
4. Validate `exp`, `aud`, `iss`.
5. Extract `sub` or `appid` / `oid` from TokenClaims (service principal tokens use `oid`).
6. Resolve caller identity from claims (may be a service account User entity rather than a human User).
7. Evaluate permissions appropriate to the service-to-service context.

## Tenant Context In api-stack

If the API is multi-tenant:
- Tenant context may be passed explicitly in a request header: `X-Tenant-Context: <tenantId>`.
- Tenant context may be derived from the caller's registered tenant association.
- Document the resolution strategy in a project ADR.

If the API is single-tenant, tenant context resolution may be simplified or constant.

## Backend Scaffolding Hints

```
app/backend/src/
  auth/
    tokenValidator.ts      — JWT validation (same pattern as web-stack)
    authMiddleware.ts      — Middleware applying tokenValidator to all protected routes
    callerResolver.ts      — Resolves caller identity from service principal claims
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for api-stack:

1. **Caller Identity Model**: are callers mapped to User entities, or is there a separate service identity model?
2. **Roles vs Scopes**: use Auth0 custom claims, Auth0 RBAC permissions, or standard OAuth2 scopes?
3. **Tenant Context Resolution**: how is tenant determined for service-to-service calls?
4. **Client Credentials Storage**: how do callers store `client_secret`? Secrets manager recommended.
5. **Token Caching By Callers**: do callers implement a custom in-memory cache, or use a standard OAuth2 client library?

## Integration With IDENTITY-ACCESS Domain

For service-to-service calls the IDENTITY-ACCESS model may be simplified:

- Service principals may bypass per-tenant membership checks if they hold elevated platform-level permissions.
- Any service-to-service call touching tenant-scoped data must still enforce tenant isolation.
- Document the authorization model for machine callers explicitly in a project ADR.
