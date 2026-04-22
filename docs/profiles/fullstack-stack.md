# Authentication Recipe — fullstack-stack

Profile: fullstack-stack
Stack: React SPA + React Native Client + Clean Architecture Backend (Node/TypeScript) + PostgreSQL + Composition Layer

## Overview

This recipe describes the recommended authentication architecture for projects using the fullstack-stack profile. Both a React web client and a React Native mobile client exist, sharing the same backend and the same AuthProvider. Authentication architecture must be unified so both clients use the same IdentityToken format and the same backend validation path.

## Recommended AuthProvider

Unified Auth0 via `@auth0/auth0-react` (web) e `react-native-auth0` (mobile).

Rationale: Un singolo tenant Auth0 con una singola API registration consente a entrambi i client (React web e React Native mobile) di produrre JWT con identico audience e issuer. Il backend Node/TypeScript esegue la stessa validazione indipendentemente dal client.

## Token Strategy

**Common to both clients**:
- IdentityToken: JWT signed by Auth0, same audience, same issuer
- Backend validation: identical path for web and mobile requests
- Tenant context: carried in request header `X-Tenant-Context: <tenantId>`

**Web client (React)**:
- RefreshCredential stored in Auth0 SDK cache (memory by default, or `localstorage` if configured)
- Token refresh via `getAccessTokenSilently`

**Mobile client (React Native)**:
- RefreshCredential stored in platform-specific secure storage (Keychain/Keystore)
- Token refresh via `react-native-auth0`

## Session Model

- Two independent AuthSessions exist: one per client type.
- Sessions are not synchronized: logging out on web does not terminate the mobile session unless explicit cross-session logout is implemented (see ADR).
- Backend is fully stateless and does not distinguish client type.

## Backend Validation Pattern

Identical to web-stack validation. The backend validates the bearer token on every protected request regardless of whether the caller is the React SPA or the Flutter app.

## Tenant Context Across Clients

Both clients must implement consistent tenant context handling:

- React SPA: store active tenant in memory or sessionStorage, send in `X-Tenant-Context` header.
- React Native app: store active tenant in memory, send in `X-Tenant-Context` header.

Tenant switching is available on both clients. When a User switches tenant on web, the mobile session retains the previous tenant context until the user explicitly switches there too (unless cross-client sync is implemented — see ADR).

## Client Scaffolding Hints

Web (React) — same as web-stack profile:
```
app/web/src/auth/           — auth0Config, Auth0ProviderWithNavigate, useAuth, ProtectedRoute
app/web/src/services/       — apiClient with token injection
```

Mobile (React Native) — same as mobile-stack profile:
```
app/client/src/auth/        — auth0Config, authService, authState
app/client/src/services/    — apiClient with token injection
```

Backend (shared):
```
app/backend/src/auth/       — tokenValidator, authMiddleware, permissionChecker
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for fullstack-stack:

1. **Unified Auth0 API Registration**: one Auth0 API registration with a single audience for both clients, or separate Auth0 applications per client (both targeting the same API)?
2. **Cross-Client Logout Synchronization**: if User logs out on web, should the mobile session also be invalidated? Requires server-side token revocation or push notification.
3. **Tenant Context Consistency**: can web and mobile sessions be active in different tenants simultaneously? Document the business rule.
4. **Composition Layer Auth**: if a composition layer (e.g. API gateway) sits in front of the backend, where does token validation occur? At the gateway or at each service?
5. **Device Registration For Audit**: should mobile devices be registered as known devices in the User model for cross-client audit visibility?

Both clients resolve identity and tenant context through the same backend:

- `TokenClaims.subject` → `User.id`
- `X-Tenant-Context` header → tenant context candidate
- Backend validates `TenantMembership.status === Active` before evaluating permissions
- Same `Permission` evaluation logic regardless of client origin

Guardrail: verified claims/groups from either client may inform IAM evaluation as external signals, but neither client path grants platform-scope privilege directly. Final privileged resolution remains IAM-owned per [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).
