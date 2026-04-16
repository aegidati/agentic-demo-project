# Authentication Recipe — flutter-standalone

Profile: flutter-standalone
Stack: Flutter Mobile Client (standalone, no backend)

## Overview

This recipe describes the recommended authentication architecture for projects using the flutter-standalone profile. The application is a Flutter mobile application running on iOS and/or Android with no backend service dependency. Authentication uses a native mobile SDK with local state management only.

## Recommended AuthProvider

Auth0 via Auth0 Flutter SDK (`auth0_flutter`).

Rationale: Auth0 fornisce un SDK ufficiale per Flutter (`auth0_flutter`) con supporto nativo al browser system (ASWebAuthenticationSession su iOS, Chrome Custom Tabs su Android), secure token storage via platform-specific mechanisms. No backend is required; token validation and authorization logic runs on the client.

## Token Strategy

**IdentityToken (ID Token)**:
- Format: JWT signed by Auth0
- Lifetime: short (configurable, default ~1 hour)
- Audience: Flutter app's Auth0 Application ID
- Contains: user profile claims (sub, name, email, custom claims)
- Usage: identify the authenticated user, extract user profile information

**AccessToken (optional)**:
- Issued if the app needs to call external APIs (e.g., Auth0 Management API for user profile updates)
- Format: JWT signed by Auth0
- Carried in: `Authorization: Bearer <token>` header on external API calls

**RefreshCredential (Refresh Token)**:
- Lifetime: long (configurable)
- Storage: platform-specific secure storage (iOS Keychain, Android Keystore)
- Accessed only by the Auth0 Flutter SDK, not by application code directly

## Session Model

- AuthSession lives in the Auth0 SDK-managed secure storage backed by platform storage.
- No HTTP session or server-side session store is required.
- Application is fully stateless from a server perspective.
- Token refresh is handled by Auth0 Flutter SDK using the cached RefreshCredential.
- On app restart, the Auth0 SDK restores the AuthSession from secure storage silently.

## Token Storage

Platform-specific secure storage is used by the Auth0 SDK automatically:

- iOS: iOS Keychain
- Android: Android Keystore / Encrypted SharedPreferences

Application code must not attempt to read or write tokens directly to non-secure storage locations. The `auth0_flutter` SDK manages all token lifecycle.

## Client-Side Authorization Pattern

Since there is no backend:

1. Extract `sub` (subject) or custom claims from the ID token obtained after login.
2. Load authorization rules/permissions locally (e.g., from a bundled JSON file, local SQLite database, or fetched on app startup from a public endpoint).
3. Evaluate client-side permissions based on the user's claims and the locally stored rules.
4. Control feature visibility and UI interactions based on client-side evaluation.

Example:
```
User logs in → Auth0 returns ID token + custom claims (e.g., `roles`: [admin, editor])
→ App extracts roles from ID token claims
→ App checks local permission matrix for [admin, editor] roles
→ Feature gates unlock based on local evaluation
```

## Client Scaffolding Hints

```
app/
  lib/
    auth/
      auth0_config.dart           — Auth0 Flutter SDK initialization (domain, clientId, redirectUri)
      auth_service.dart           — login, logout, getCredentials, getUserProfile
      auth_state.dart             — AuthSession state model (logged in / logged out / loading)
    models/
      user.dart                   — User model extracted from ID token claims
      permission.dart             — Permission enum / constants for feature gates
    authorization/
      permission_checker.dart     — client-side permission evaluation logic
      local_rules.dart            — bundled or fetched permission rules (JSON or constant map)
    features/
      home_screen.dart            — example using feature gates
      profile_screen.dart         — profile data from token claims
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for flutter-standalone:

1. **Browser Method**: use ASWebAuthenticationSession (iOS) / Chrome Custom Tabs (Android), or embedded WebView? Auth0 Flutter SDK defaults to system browser.
2. **Platform Secure Storage**: confirm Auth0 Flutter SDK handles Keychain/Keystore automatically, or is additional wrapping needed?
3. **Custom Claims**: does the app need to request custom claims in the ID token (e.g., roles, permissions, metadata)? Configure Auth0 app to emit them.
4. **Authorization Rules Source**: load permission rules locally from a bundled file, a remote public endpoint, or from claims embedded in the token? Each has trade-offs for offline availability and freshness.
5. **Silent Auth Failure**: what is the UX when `getCredentials` fails on app foreground? Re-authenticate immediately or show a dismissable prompt?
6. **Logout Behavior**: clear local credentials only, or redirect to Auth0 logout endpoint and clear provider session?
7. **Token Refresh**: how often should `getCredentials` check for token expiry and refresh? On app foreground, on every API call, or periodic background?
8. **Offline Mode**: can the app function with a cached ID token when offline? What is the expiry tolerance before forcing re-authentication?
9. **User Profile Updates**: if the app allows users to update their profile, where is the source of truth? Local device only, or sync back to Auth0 Management API (requires access token with appropriate scope)?

## Integration With IDENTITY-ACCESS Domain

No backend integration required. All identity and authorization logic is local:

- `TokenClaims.subject` — user's unique identifier from the ID token
- Custom claims (if configured in Auth0) — roles, permissions, metadata
- Local permission matrix — feature gates, feature flags, UI state

The standalone app is fully responsible for:
- Keeping authorization rules fresh (if they come from a remote source)
- Validating token expiry before displaying sensitive features (optional: can be lenient for UX)
- Handling token refresh gracefully
- Implementing proper logout to clear local state
