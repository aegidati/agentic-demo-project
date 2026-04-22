# Authentication ADR Seeds

These ADR seeds are intended to be promoted into project ADRs by downstream teams. They identify decisions that materially affect authentication behavior but are intentionally left unresolved in this starter. Each seed should be resolved before implementation work begins.

## Identity Provider Selection

Question: Which AuthProvider will the project use to issue and vouch for IdentityTokens?

Options to consider:

- **Auth0** (recommended default for non-Microsoft stacks — OIDC/OAuth 2.0, free tier up to 7.500 MAU, official SDKs for React, React Native, Flutter, Angular, Node, .NET)
- Azure Entra ID (recommended for Microsoft ecosystem, multi-tenant B2B, .NET stacks)
- Self-hosted OIDC provider (e.g. Keycloak)
- LDAP or Active Directory (enterprise federation)
- Internal platform-managed identity store

Decision point: Document the chosen AuthProvider, the protocol used, and the rationale. Record whether provider portability is a concern.

Profile guidance: See the matching profile recipe in docs/profiles/ for the recommended default provider per stack. Auth0 is the default for Node/TypeScript and React/React Native stacks. Microsoft.Identity.Web / Entra ID remains recommended for .NET stacks.

## Token Storage Strategy

Question: Where should the IdentityToken and RefreshCredential be stored on the client?

Options to consider:

- In-memory only (most secure, lost on page refresh)
- Browser sessionStorage (tab-scoped, lost on close)
- Browser localStorage (persistent, accessible to JS)
- HttpOnly cookie managed by a backend session endpoint
- Platform-specific secure storage (iOS Keychain, Android Keystore for mobile)

Decision point: Choose the storage strategy consistent with the client type and threat model. Document the accepted risks. Browser-based apps should avoid storing tokens in localStorage where XSS is a realistic threat.

## Token Refresh Strategy

Question: Should the project implement silent token refresh, and if so, how?

Options to consider:

- Automatic background refresh triggered by the client SDK before expiry
- Explicit refresh endpoint on the backend exchanging RefreshCredential for a new IdentityToken
- No refresh (short-lived tokens, re-authentication on expiry)
- Server-side session model with token managed outside the client

Decision point: Choose the refresh strategy based on security requirements and user experience goals. Document the RefreshCredential rotation policy.

## RefreshCredential Rotation Policy

Question: Should RefreshCredentials rotate on each use?

Options to consider:

- Rotate on every use (more secure, requires client to handle new credential on each refresh)
- Fixed credential until expiry or revocation (simpler, higher risk if credential is leaked)
- Rotation with a short grace period for in-flight requests

Decision point: Choose based on security posture and provider capabilities. Auth0 and Entra ID both support rotation.

## Logout And Token Revocation

Question: When a User logs out, should the project revoke the token at the AuthProvider?

Options to consider:

- Client-only logout: clear local storage and AuthSession, no server call
- Provider-side logout: redirect to AuthProvider termination endpoint, clearing provider session
- Backend revocation: backend marks IdentityToken as revoked in a denylist until expiry
- Combination: client clear + provider logout endpoint

Decision point: Choose based on security requirements. Single-page apps often use client-only logout. Shared devices or high-sensitivity scenarios may require provider-side revocation.

## Token Audience And Scope Configuration

Question: What audience and scopes will the IdentityToken carry for the backend API?

Options to consider:

- Single audience: one backend API per application
- Multi-audience: shared token across multiple backend services
- Scope-based: fine-grained OAuth scopes per endpoint category
- App role-based: Entra ID app roles embedded in token claims

Decision point: Document the audience URI and scope list. Ensure the backend validates audience on every request.

## Authentication Event Persistence

Question: Where and how are authentication events (AuthenticationSucceeded, TokenValidationFailed, SessionTerminated) stored?

Options to consider:

- Application-level structured logs (stdout / log aggregator)
- Dedicated security audit store (append-only)
- Provider-side audit logs only (e.g. Entra ID sign-in logs)
- Combination of application logs and provider audit

Decision point: Ensure at minimum that authentication failures and token validation failures are captured and retainable for security incident analysis.

Security note: include privileged resolution attempts in structured security logs while avoiding raw token persistence or full-claim dumps.

## Tenant Context From Token Claims

Question: Should the IdentityToken carry a tenant hint, and if so, how is it used?

Options to consider:

- Token carries a tenantHint claim used as default tenant context for the request
- Tenant context always resolved explicitly from the IDENTITY-ACCESS domain (TenantMembership lookup)
- Hybrid: tenantHint used only when the User belongs to a single tenant, explicit selection otherwise

Decision point: Align with the Tenant Context Resolution Strategy ADR from the IDENTITY-ACCESS domain (AGENTIC-IAM). Do not duplicate the authorization model inside token claims.

## Platform Superadmin Resolution From Verified Signals

Question: How should verified role/group signals from IdentityToken claims participate in platform-scope privileged resolution?

Options to consider:

- External-signal-only model: normalize verified claims/groups into provider-agnostic signals and delegate final decision to IAM
- Provider-direct grant model: provider claims directly grant privileged roles (not recommended)
- Hybrid model: provider claims suggest privileged candidates, IAM confirms through governance constraints

Decision point: Preserve IAM ownership of final platform-role resolution and align with [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).

## Missing Or Incomplete Privileged Signals

Question: What should happen when privileged role/group signals are missing, malformed, stale, or ambiguous?

Options to consider:

- Fail-closed for privileged actions (recommended baseline)
- Degrade to non-privileged tenant-scoped flow
- Allow temporary privileged fallback (not recommended unless formally governed)

Decision point: Define deterministic failure semantics that prevent implicit elevation and document audit requirements for privileged-resolution failures.

## Security Logging For Privileged Resolution

Question: Which privileged-resolution events should be logged for security operations and audits?

Options to consider:

- Log normalized-signal intake, IAM decision, and denial reason
- Log only success decisions
- Log provider claim payloads in full (not recommended)

Decision point: Ensure auditability of privileged-resolution paths while minimizing sensitive token/claim exposure in logs.
