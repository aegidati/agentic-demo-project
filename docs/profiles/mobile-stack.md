# Authentication Recipe — mobile-stack

Profile: mobile-stack
Stack: React Native Client + Clean Architecture Backend (Node/TypeScript) + PostgreSQL

## Overview

This recipe describes the recommended authentication architecture for projects using the mobile-stack profile. The client is a React Native mobile application running on iOS and/or Android. The backend is a Node/TypeScript Clean Architecture service. Authentication uses a native mobile SDK delegating to the platform identity system.

## Recommended AuthProvider

Auth0 via `react-native-auth0`.

Rationale: Auth0 fornisce un SDK ufficiale per React Native (`react-native-auth0`) con supporto nativo al browser system (ASWebAuthenticationSession su iOS, Chrome Custom Tabs su Android), secure token storage via platform-specific mechanisms, e produce JWT standard compatibili con il backend Node/TypeScript.

## Token Strategy

**IdentityToken (Access Token)**:
- Format: JWT signed by Auth0
- Lifetime: short (configurable, default ~1 hour)
- Audience: backend API application registration URI
- Carried in: `Authorization: Bearer <token>` header on every backend request

**RefreshCredential (Refresh Token)**:
- Lifetime: long
- Storage: platform-specific secure storage (iOS Keychain, Android Keystore)
- Accessed only by `react-native-auth0`, not by application code directly

## Session Model

- AuthSession lives in the `react-native-auth0` SDK-managed secure storage backed by platform storage.
- No HTTP session or server-side session store is required.
- Backend is fully stateless: validates the IdentityToken on every request.
- Token refresh is handled by `react-native-auth0` using the cached RefreshCredential.
- On app restart, `react-native-auth0` restores the AuthSession from secure storage silently.

## Token Storage

Platform-specific secure storage is used by the Auth0 SDK automatically:

- iOS: iOS Keychain
- Android: Android Keystore / Encrypted SharedPreferences

Application code must not attempt to read or write tokens directly to non-secure storage locations.

## Backend Validation Pattern

Identical to web-stack validation. On every protected request:

1. Extract bearer token from `Authorization` header.
2. Fetch or cache the Auth0 JWKS from `https://<tenant>.auth0.com/.well-known/jwks.json` and verify JWT signature.
3. Validate `exp`, `aud`, `iss`.
4. Extract `sub` from TokenClaims.
5. Resolve `User` entity.
6. Resolve tenant context.
7. Evaluate `Permission`.

The backend does not differentiate between a mobile client and a web client at the token validation level.

## Client Scaffolding Hints

```
app/client/
  src/
    auth/
      auth0Config.ts          — Auth0 React Native SDK initialization (domain, clientId, redirectUri)
      authService.ts          — getCredentials (silent), login (interactive), logout
      authState.ts            — AuthSession state model (logged in / logged out / loading)
  services/
      apiClient.ts            — HTTP client injecting bearer token on protected calls
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for mobile-stack:

1. **Browser Method**: use ASWebAuthenticationSession (iOS) / Chrome Custom Tabs (Android), or embedded WebView? `react-native-auth0` defaults to system browser.
2. **Platform Secure Storage**: confirm `react-native-auth0` handles Keychain/Keystore automatically via react-native-secure-storage, or is additional wrapping needed?
3. **Silent Auth Failure**: what is the UX when silent `getCredentials` fails on app foreground? Re-authenticate immediately or show a dismissable prompt?
4. **Logout Behavior**: clear local credentials only, or redirect to Auth0 logout endpoint and clear provider session?
3. **Silent Auth Failure**: what is the UX when silent `getCredentials` fails on app foreground? Re-authenticate immediately or show a dismissable prompt?
4. **Logout Behavior**: clear local credentials only, or redirect to Auth0 logout endpoint and clear provider session?
5. **Device Registration**: should device registration be tracked in the User or TenantMembership model for audit?
6. **Offline Mode**: can the app function with a cached token when offline? What is the expiry tolerance?

## Integration With IDENTITY-ACCESS Domain

After backend validates the IdentityToken:

- `TokenClaims.subject` → resolves `User.id`
- Tenant context resolved per IDENTITY-ACCESS rules
- `TenantMembership.status` must be `Active`
- `TenantMembership.role` determines permission scope

Guardrail: claims/groups from the provider are external verified signals only. They are not authoritative platform-level grants; final privileged resolution remains IAM-owned per [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).

Mobile clients sending tenant-scoped requests should include `X-Tenant-Context: <tenantId>` header when the User belongs to more than one tenant.
