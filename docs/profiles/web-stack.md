# Authentication Recipe — web-stack

Profile: web-stack
Stack: React SPA + Clean Architecture Backend (Node/TypeScript) + PostgreSQL

## Overview

This recipe describes the recommended authentication architecture for projects using the web-stack profile. The client is a React single-page application. The backend is a Node/TypeScript Clean Architecture service. Both communicate over HTTPS using bearer token authentication.

## Recommended AuthProvider

Auth0 via `@auth0/auth0-react` e `@auth0/auth0-spa-js`.

Rationale: Auth0 fornisce un SDK React di prima parte con supporto OIDC/OAuth 2.0 completo, free tier generoso (7.500 MAU), login social nativo (Google, GitHub, Apple), e produce JWT standard validabili con JWKS identico a qualsiasi altro OIDC provider. Non richiede dipendenze dall'ecosistema Microsoft.

## Token Strategy

**IdentityToken (Access Token)**:
- Format: JWT signed by Auth0
- Lifetime: short (configurable, default ~1 hour)
- Audience: Auth0 API identifier configurato nella dashboard Auth0
- Carried in: `Authorization: Bearer <token>` header on every backend request

**RefreshCredential (Refresh Token)**:
- Lifetime: long (configurable, default ~90 days)
- Storage: Auth0 SDK cache (memory by default, or `localstorage` if configured — see ADR)
- Rotation: configurable at provider level

## Session Model

- AuthSession lives in the Auth0 SDK cache (managed by `@auth0/auth0-react`).
- No server-side session store is required.
- Backend is fully stateless: it validates the IdentityToken on every request, no session lookup.
- Token refresh is handled transparently by `@auth0/auth0-react` using `getAccessTokenSilently`.

## Token Storage Decision

`@auth0/auth0-react` uses in-memory storage by default (`cacheLocation: 'memory'`). Projects should document their choice in an ADR.

Options:
- `sessionStorage`: token lost on tab close, suitable for most applications
- `localStorage`: token persists across sessions, increased XSS risk, document rationale
- `memoryStorage`: most secure, user re-authenticates on page refresh

## Backend Validation Pattern

On every protected request the backend must:

1. Extract the bearer token from the `Authorization` header.
2. Fetch or cache the Auth0 JWKS from `https://<tenant>.auth0.com/.well-known/jwks.json`.
3. Verify the JWT signature using the appropriate public key.
4. Validate `exp` (expiry), `aud` (audience matches backend API URI), `iss` (issuer matches tenant).
5. Extract `sub` (subject) from TokenClaims.
6. Resolve `User` entity using `sub`.
7. Resolve tenant context per IDENTITY-ACCESS domain rules.
8. Evaluate `Permission` for the `User`-`Tenant` pair.

Libraries to consider (not prescribed): `jsonwebtoken`, `jose`.

## Client Scaffolding Hints

Folder structure to plan as backlog tasks (no implementation prescribed):

```
app/web/src/
  auth/
    auth0Config.ts         — Auth0 SDK configuration (domain, clientId, audience)
    Auth0ProviderWithNavigate.tsx — Auth0Provider wrapper con redirect handling
    useAuth.ts             — custom hook wrapping useAuth0 from @auth0/auth0-react
    ProtectedRoute.tsx     — route guard using withAuthenticationRequired or isAuthenticated
  services/
    apiClient.ts           — HTTP client with getAccessTokenSilently + Authorization header injection
```

## Backend Scaffolding Hints

```
app/backend/src/
  auth/
    tokenValidator.ts      — JWT signature and claims validation
    authMiddleware.ts      — Express/Fastify middleware applying tokenValidator
    permissionChecker.ts   — Permission evaluation using IDENTITY-ACCESS domain
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for web-stack:

1. **Auth0 Application Type**: SPA with PKCE. What callback URL and logout URL to register?
2. **Token Storage**: `memory` (default, secure) vs `localstorage` (persistent, higher XSS risk)? Document in ADR.
3. **Cache Location**: align `cacheLocation` choice with organization security policy.
4. **Refresh Token Rotation**: enable Refresh Token Rotation in Auth0 dashboard? Rotate on every use?
5. **Silent Authentication Timeout**: what happens when `getAccessTokenSilently` fails? Redirect or show error?
6. **Logout Type**: `logout({ returnTo: window.location.origin })`? Clear Auth0 session?

## Integration With IDENTITY-ACCESS Domain

After backend validates the IdentityToken:

- `TokenClaims.subject` → resolves `User.id`
- `User.id` + tenant context → resolves `TenantMembership`
- `TenantMembership.status` must be `Active` to proceed
- `TenantMembership.role` determines permission scope
