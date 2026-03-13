# API Conventions

This document outlines the conventions and standards for building APIs that conform to the `api-contracts-openapi` specification.

## Routing & Versioning

### Base Path

- Default: `/api/v1` for versioned endpoints
- Infrastructure (health, metrics, etc.): `/health`, `/metrics` (no version prefix) for operation tooling

### URL Naming

- Use **kebab-case** for path segments: `/api/v1/user-profiles`, `/api/v1/health-checks`
- Use **lowercase** exclusively
- Nouns only (resources), no verbs: `/api/v1/posts` not `/api/v1/getPosts`

### Methods

| Operation | Method | Path |
|-----------|--------|------|
| Fetch all | GET | `/api/v1/resource` |
| Fetch one | GET | `/api/v1/resource/{id}` |
| Create | POST | `/api/v1/resource` |
| Update | PUT | `/api/v1/resource/{id}` (full replace) |
| Patch | PATCH | `/api/v1/resource/{id}` (partial update) |
| Delete | DELETE | `/api/v1/resource/{id}` |

## Versioning Strategy

- API versioning via URL path: `/api/v1`, `/api/v2`, etc.
- Backward-incompatible changes require a new major version.
- Minor feature additions do NOT require a version bump (additive only).
- Deprecation warnings via response headers: `Deprecation: true`, `Sunset: <date>`

## Error Response Format

Use **RFC 7807 Problem Details** format:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Field 'email' is required"
}
```

### Standard Status Codes

| Code | Meaning | Use case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH, PUT |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful, no response body |
| 400 | Bad Request | Invalid input/validation failure |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Request conflicts with current state (e.g., duplicate) |
| 500 | Internal Server Error | Server-side error |

## Authentication

Placeholder for your authentication scheme. Choose one:

### Option 1: Bearer Token (JWT)

```
Authorization: Bearer <token>
```

Add to OpenAPI spec:

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

### Option 2: API Key

```
X-API-Key: <key>
```

### Option 3: OAuth 2.0

```yaml
components:
  securitySchemes:
    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.example.com/authorize
          tokenUrl: https://auth.example.com/token
          scopes:
            read: Read access
            write: Write access
```

## Pagination

### Query Parameters

- `limit` — max items per page (default: 20, max: 100)
- `offset` — starting index (default: 0)

### Response Format

```json
{
  "data": [...],
  "meta": {
    "total": 1000,
    "offset": 0,
    "limit": 20
  }
}
```

Alternative (cursor-based):

```json
{
  "data": [...],
  "meta": {
    "cursor": "abc123",
    "hasMore": true
  }
}
```

## Filtering & Searching

- Use query parameters: `?status=active&limit=10`
- Prefix partial-match filters with `_like`: `?name_like=john`
- Prefix range filters: `?created_gte=2026-01-01&created_lte=2026-12-31`

## Request/Response Headers

### Standard Request Headers

- `Content-Type: application/json`
- `Accept: application/json`
- `User-Agent: <client>/<version>`

### Standard Response Headers

- `Content-Type: application/json`
- `X-Request-ID: <uuid>` — correlate logs across services
- `X-Response-Time: <ms>` — optional performance metric

## Content Negotiation

- Default: `application/json`
- Support `Accept: application/json` explicitly
- Consider `application/problem+json` for error responses (RFC 7807)

## Changelog & Documentation

When extending this contract:
1. Update `openapi.yaml` with new paths and schemas
2. Update `API-CONVENTIONS.md` if conventions change
3. Commit both with a clear message: `feat: add /api/v1/posts endpoint`
4. Increment the version in `openapi.yaml` info.version

## Reference

- [RFC 7807 Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [REST API Best Practices](https://restfulapi.net/)
