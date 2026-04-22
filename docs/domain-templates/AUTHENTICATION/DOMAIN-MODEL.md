# Authentication Domain Model

Status: Seed template for derived projects

## Overview

This document defines the architecture-agnostic domain baseline for Authentication in Agentic-aligned projects. It standardizes the business model, core terminology, and invariants without prescribing runtime implementation, identity providers, transport mechanisms, token formats, or session persistence strategies.

The baseline assumes:

- Authentication is the act of establishing and proving User identity, separate from authorization.
- An AuthSession exists only after a successful authentication interaction with an AuthProvider.
- A valid AuthSession carries an IdentityToken whose claims can be verified by the backend.
- Token validation is the responsibility of the backend, not the frontend.
- Tenant context resolution (as defined in AGENTIC-IAM) occurs after successful token validation.
- Authentication events must be observable for audit purposes.

This model integrates with AGENTIC-IAM. Authentication establishes identity; AGENTIC-IAM governs what that identity is authorized to do.

## Core Entities

### AuthProvider

AuthProvider represents the external or internal system that vouches for User identity.

Expected responsibilities:

- issues IdentityTokens after a successful authentication interaction
- maintains its own user directory or federates to an upstream source
- communicates with clients through a defined protocol (e.g. OAuth 2.0, OIDC, SAML)

AuthProvider is a boundary concept. Its internals are outside the scope of this domain model. Derived projects choose a concrete AuthProvider and document that choice in an ADR.

### IdentityToken

IdentityToken is the portable artifact produced by an AuthProvider that carries verifiable claims about an authenticated User.

Expected responsibilities:

- carries subject identifier (the canonical user_id used to locate the User entity)
- carries audience and issuer claims allowing backends to validate authenticity
- carries expiration claims to enforce token lifetime
- may carry additional claims (roles, groups, tenant hints) depending on provider configuration

IdentityToken is issued once per successful authentication interaction. It must not be trusted without signature verification against the AuthProvider's public key or discovery document.

### AuthSession

AuthSession represents the active state of an authenticated User within a client context.

Expected responsibilities:

- exists after AuthProvider issues a valid IdentityToken
- provides access to the current IdentityToken and its claims
- may support silent renewal when a refresh mechanism is available
- terminates upon logout, expiration without renewal, or explicit revocation

AuthSession placement (browser memory, secure storage, session store) is a profile-specific decision documented in the appropriate profile recipe.

## Value Objects

### TokenClaims

TokenClaims is the immutable set of verified assertions extracted from a valid IdentityToken.

Expected fields:

- `subject`: canonical user identifier, used to resolve the User entity in the domain
- `issuer`: identifies the AuthProvider that issued the token
- `audience`: identifies the resource or backend that should accept this token
- `expiry`: timestamp after which the token must not be accepted
- `issuedAt`: timestamp when the token was issued

Optional fields (provider-dependent):

- `tenantHint`: suggested tenant context, may be used during tenant context resolution
- `roles`: provider-assigned roles or groups, treated only as verified external signals for downstream authorization mapping
- `email`: user email, informational only

TokenClaims must be extracted only after signature verification. Raw claims must never be trusted before verification.
Verified external signals may be forwarded to the IDENTITY-ACCESS domain as inputs to privileged role resolution.
They must not be interpreted in the Authentication domain as direct grants of TenantRole, Permission, or PlatformRole.

### RefreshCredential

RefreshCredential is the artifact that allows a client to acquire a new IdentityToken without requiring the User to re-authenticate.

Expected responsibilities:

- issued alongside the IdentityToken when the AuthProvider supports refresh
- stored in a secure location appropriate to the client type (profile-specific)
- exchanged at a refresh endpoint for a new IdentityToken
- invalidated upon logout or revocation

Whether RefreshCredential is used is a profile-specific decision. API-only profiles typically do not use it.

## Domain Events

Significant state changes in the Authentication domain:

- `AuthenticationInitiated`: User or service began the authentication flow with an AuthProvider.
- `AuthenticationSucceeded`: AuthProvider confirmed identity and issued an IdentityToken.
- `AuthenticationFailed`: AuthProvider rejected the authentication attempt.
- `TokenValidated`: Backend verified an incoming IdentityToken successfully.
- `TokenValidationFailed`: Backend rejected an IdentityToken (expired, invalid signature, wrong audience).
- `TokenRefreshed`: A RefreshCredential was exchanged for a new IdentityToken.
- `SessionTerminated`: AuthSession ended due to logout, expiration, or revocation.
- `AuthorizationDenied`: Token was valid but User lacked required Permission in tenant context (links to IDENTITY-ACCESS domain).
- `PrivilegedSignalNormalized`: Verified provider role/group claims were normalized into provider-agnostic external signals for IAM evaluation.

## Use Cases

Primary workflows in the Authentication domain:

- User initiates login and is redirected to AuthProvider
- AuthProvider returns IdentityToken to client
- Client presents IdentityToken to backend on each request
- Backend validates IdentityToken claims and resolves User identity
- Backend resolves tenant context using IDENTITY-ACCESS domain rules
- Client silently refreshes IdentityToken before expiry (where applicable)
- User initiates logout, AuthSession is terminated on client and optionally server-side

## Integration With IDENTITY-ACCESS Domain

| Authentication Domain | Integration Point | IDENTITY-ACCESS Domain |
|---|---|---|
| TokenClaims.subject | Resolves to | User.id |
| TokenClaims.tenantHint | May inform | Tenant context resolution |
| Verified external role/group signals | Input to | Platform-role resolution under IAM governance |
| TokenValidated | Precondition for | TenantMembership evaluation |
| AuthorizationDenied | Produced by | Permission evaluation |

The subject claim in a valid IdentityToken is the bridge between the Authentication domain and the IDENTITY-ACCESS domain. Backend implementations must use this claim to load the User entity before evaluating TenantMembership and Permission.

For platform-scope privilege (including Superadmin baseline), claims or groups alone are never sufficient as direct grants. Final privileged resolution remains IAM-owned and must align with [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).

---

**Status**: Seed template for derived projects
