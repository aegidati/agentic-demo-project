# Authentication Recipe — web-stack-angular

Profile: web-stack-angular
Stack: Angular SPA + Clean Architecture Backend (Node/TypeScript) + PostgreSQL

## Overview

This recipe describes the recommended authentication architecture for projects using the web-stack-angular profile. The client is an Angular single-page application. The backend is a Node/TypeScript Clean Architecture service. Authentication uses `@auth0/auth0-angular`, which provides an HTTP interceptor for automatic token injection and route guards for protecting navigation.

## Recommended AuthProvider

Auth0 via `@auth0/auth0-angular`.

Rationale: Auth0 fornisce un SDK Angular ufficiale con supporto OIDC/OAuth 2.0, HTTP interceptor per token injection automatico (`AuthHttpInterceptor`), e funzionamento identico al profilo web-stack con un SDK dedicato Angular.

## Token Strategy

**IdentityToken (Access Token)**:
- Format: JWT signed by Auth0
- Lifetime: short (configurable, default ~1 hour)
- Audience: Auth0 API identifier configurato nella dashboard Auth0
- Injected automatically by `AuthHttpInterceptor` on configured routes

**RefreshCredential (Refresh Token)**:
- Stored in Auth0 SDK cache (memory by default, or `localstorage` if configured)
- Renewed transparently by `@auth0/auth0-angular` via `getAccessTokenSilently`

## Session Model

- AuthSession lives in the Auth0 SDK cache.
- `AuthService` from `@auth0/auth0-angular` provides an observable stream of authentication state changes (`isAuthenticated$`, `user$`).
- No server-side session store required.
- Backend is fully stateless.

## Angular-Specific Integration Points

**HTTP Interceptor**: `AuthHttpInterceptor` from `@auth0/auth0-angular` intercepts outbound HTTP requests matching configured URL patterns and adds the `Authorization: Bearer` header automatically.

**Route Guard**: `AuthGuard` from `@auth0/auth0-angular` can be applied to Angular routes to redirect unauthenticated users to the Auth0 login page.

**Token Acquisition**: Token acquisition uses `getAccessTokenSilently` first; falls back to interactive login if the silent attempt fails.

## Backend Validation Pattern

Identical to web-stack:

1. Extract bearer token from `Authorization` header.
2. Fetch or cache the Auth0 JWKS from `https://<tenant>.auth0.com/.well-known/jwks.json` and verify JWT signature.
3. Validate `exp`, `aud`, `iss`.
4. Extract `sub` from TokenClaims.
5. Resolve `User` entity.
6. Resolve tenant context.
7. Evaluate `Permission`.

## Client Scaffolding Hints

```
app/web/src/
  app.config.ts              — provideAuth0(), AuthHttpInterceptor, AuthGuard configuration
  auth/
    auth0.config.ts          — Auth0 SDK configuration (domain, clientId, audience)
    auth.service.ts          — wrapper service for login, logout, isAuthenticated$ state
  guards/
    auth.guard.ts            — AuthGuard from @auth0/auth0-angular or custom canActivate
  interceptors/
    (handled by AuthHttpInterceptor via app.config.ts)
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for web-stack-angular:

1. **Auth0 Application Registration**: SPA redirect URI must be registered in Auth0 dashboard. What callback URL?
2. **AuthHttpInterceptor URL Allowlist**: which API base URLs should the interceptor protect? Document audience mapping per URL.
3. **Interactive Flow**: popup or redirect for interactive login? Redirect is recommended for mobile-responsive Angular apps.
4. **AuthGuard Behavior**: redirect to login silently or show a loading state before redirect?
5. **Token Storage**: `memory` (default, secure) vs `localstorage` — same considerations as web-stack. Document in ADR.
6. **Logout**: `authService.logout({ logoutParams: { returnTo: window.location.origin } })`? Clear Auth0 session?

## Integration With IDENTITY-ACCESS Domain

After backend validates the IdentityToken:

- `TokenClaims.subject` → resolves `User.id`
- Tenant context resolved per IDENTITY-ACCESS rules
- `TenantMembership.status` must be `Active`
- `TenantMembership.role` determines permission scope

Guardrail: provider claims/groups are verified external signals only. They do not directly grant platform-scope privilege, and final privileged resolution remains IAM-owned per [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).
