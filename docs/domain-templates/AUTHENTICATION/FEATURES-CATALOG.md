# Authentication Features Catalog

This catalog provides reusable authentication feature seeds for derived projects. Status values describe the maturity of the template content in this starter, not implementation completeness in any specific system.

## AUTH-001 Authentication Entry Point

Status: Recommended baseline

Defines the requirement for a stable, profile-appropriate authentication entry point that initiates the interaction with the chosen AuthProvider. Derived projects must decide the authentication protocol, the entry point location, and the redirect behavior. The entry point must not perform authorization; it only establishes identity.

## AUTH-002 Token Validation Middleware

Status: Recommended baseline

Defines the backend requirement to validate every incoming IdentityToken before processing a protected request. Validation must include signature verification, expiry check, audience check, and issuer check. Derived projects must implement this as a cross-cutting concern (middleware or interceptor) applicable to all protected routes. The validation algorithm is identical across all profiles; only the token source differs.

## AUTH-003 Session Management

Status: Seeded for project design

Defines the client-side requirement to maintain an AuthSession after successful authentication. Session management includes IdentityToken storage, RefreshCredential storage (where applicable), and AuthSession lifecycle tracking. Storage strategy is profile-specific and must be documented in an ADR. Derived projects must choose between in-memory, browser storage, HttpOnly cookie, and platform-specific secure storage.

## AUTH-004 Token Refresh Flow

Status: Seeded for project design

Defines the requirement to renew an expiring IdentityToken using a RefreshCredential without requiring the User to re-authenticate. Relevant for browser-based and mobile profiles. API-only profiles typically do not require this capability. Derived projects must decide the refresh trigger point, the refresh endpoint ownership, and the rotation policy for RefreshCredentials.

## AUTH-005 Logout And Session Termination

Status: Recommended baseline

Defines the requirement to reliably terminate an AuthSession on both the client side and, where appropriate, the server side. Logout must clear the IdentityToken, the RefreshCredential, and any cached tenant context. Derived projects must decide whether logout includes a server-side token revocation call to the AuthProvider.

## AUTH-006 Provider-Specific Integration Wiring

Status: Seeded for ADR

Defines the boundary where a concrete AuthProvider (e.g. Entra ID, Auth0, LDAP) is configured and integrated into the authentication entry point and token validation flow. This feature seed is resolved by following the appropriate profile recipe and documenting the provider choice in a project ADR. Derived projects must not embed provider-specific configuration directly into domain logic.

## AUTH-007 Authentication Audit Trail

Status: Recommended baseline

Defines the expectation that significant authentication events (AuthenticationSucceeded, AuthenticationFailed, TokenValidationFailed, SessionTerminated) are recorded as observable events. Derived projects should decide whether these events are written to application logs, a structured audit store, or both. At minimum, failed authentication and token validation failures must be logged with enough context to support security incident analysis without logging secret values.
