# Authentication Domain Events

This document describes architecture-agnostic, business-oriented event sequences for the Authentication domain. The sequences describe what happens in the domain, not how messages are transported or stored.

## User Login Flow

1. User initiates the login action in the client application.
2. The client redirects or delegates to the chosen AuthProvider.
3. AuthProvider authenticates the User through its credential verification mechanism.
4. On success, AuthProvider issues an IdentityToken (and optionally a RefreshCredential) and returns them to the client.
5. The client stores the IdentityToken according to the chosen token storage strategy.
6. An AuthSession is established on the client.

Common events:

- AuthenticationInitiated
- AuthenticationSucceeded
- AuthSessionEstablished

## Backend Token Validation

1. Client presents the IdentityToken to the backend on a protected request.
2. Backend middleware extracts the IdentityToken from the request.
3. Backend verifies the token signature against the AuthProvider's public key or discovery document.
4. Backend checks token expiry, audience, and issuer claims.
5. On success, backend extracts TokenClaims.subject and resolves the User entity.
6. Backend initiates tenant context resolution using the IDENTITY-ACCESS domain.

Common events:

- TokenValidated
- TokenValidationFailed (expired, invalid signature, wrong audience, unknown subject)

## Silent Token Refresh

1. Client detects that the current IdentityToken is near expiry.
2. Client sends the RefreshCredential to the refresh endpoint (backend or AuthProvider).
3. Refresh endpoint validates the RefreshCredential.
4. A new IdentityToken is issued and returned to the client.
5. The client replaces the old IdentityToken with the new one in the AuthSession.
6. If RefreshCredential rotation is active, the new RefreshCredential replaces the old one.

Common events:

- TokenRefreshed
- RefreshCredentialRotated (when rotation policy is active)
- AuthSessionRenewed

## Token Refresh Failure

1. Client attempts silent token refresh.
2. The RefreshCredential is expired, invalid, or revoked.
3. Refresh endpoint rejects the request.
4. The AuthSession is terminated on the client.
5. User is redirected to the login flow.

Common events:

- TokenRefreshFailed
- AuthSessionTerminated
- AuthenticationInitiated (re-login)

## Logout

1. User initiates logout in the client application.
2. Client clears the IdentityToken and RefreshCredential from local storage.
3. Client terminates the AuthSession.
4. Optionally, client redirects to the AuthProvider's logout endpoint to clear the provider session.
5. Optionally, backend marks the IdentityToken as revoked if a server-side denylist is in use.

Common events:

- LogoutInitiated
- AuthSessionTerminated
- TokenRevoked (optional, when server-side revocation is in use)

## Authentication Failure

1. User initiates login.
2. AuthProvider rejects the authentication attempt (wrong credentials, locked account, MFA failure, etc.).
3. AuthProvider returns an error response.
4. No IdentityToken is issued.
5. No AuthSession is established.
6. The failure is recorded as an audit-relevant event.

Common events:

- AuthenticationInitiated
- AuthenticationFailed
- AuditEventRecorded
