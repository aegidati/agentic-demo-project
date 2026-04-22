import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/main';

describe('iam memberships routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('denies list when actor header is missing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tenants/tenant-001/memberships'
    });

    expect(response.statusCode).toBe(401);
    expect(response.json().errorCode).toBe('auth.missing_actor');
  });

  it('denies tenant context conflict when route and header mismatch', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tenants/tenant-001/memberships',
      headers: {
        'x-actor-user-id': 'owner-001',
        'x-tenant-id': 'tenant-002'
      }
    });

    expect(response.statusCode).toBe(409);
    expect(response.json().errorCode).toBe('auth.tenant_context_conflict');
  });

  it('enforces tenant isolation by denying outsider actor from another tenant', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tenants/tenant-001/memberships',
      headers: {
        'x-actor-user-id': 'owner-002'
      }
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().errorCode).toBe('auth.forbidden');
  });

  it('denies globally disabled user even with active tenant membership', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tenants/tenant-001/memberships',
      headers: {
        'x-actor-user-id': 'disabled-001'
      }
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().errorCode).toBe('auth.global_user_blocked');
  });

  it('allows globally active user with active membership', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tenants/tenant-001/memberships',
      headers: {
        'x-actor-user-id': 'owner-001'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().total).toBeGreaterThanOrEqual(2);
  });

  it('rejects self-elevation on role update', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/tenants/tenant-001/memberships/member-001/role',
      headers: {
        'x-actor-user-id': 'member-001'
      },
      payload: {
        role: 'Admin'
      }
    });

    expect(response.statusCode).toBe(403);
    expect(response.json().errorCode).toBe('auth.forbidden');
  });

  it('rejects invalid membership lifecycle transition', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/tenants/tenant-001/memberships/member-001/status',
      headers: {
        'x-actor-user-id': 'owner-001'
      },
      payload: {
        status: 'Invited'
      }
    });

    expect(response.statusCode).toBe(409);
    expect(response.json().errorCode).toBe('membership.invalid_transition');
  });

  it('enforces last-owner protection on delete', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/tenants/tenant-001/memberships/owner-001',
      headers: {
        'x-actor-user-id': 'owner-001'
      }
    });

    expect(response.statusCode).toBe(409);
    expect(response.json().errorCode).toBe('membership.last_owner_protection');
  });

  it('allows owner to create membership with deterministic response', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tenants/tenant-001/memberships',
      headers: {
        'x-actor-user-id': 'owner-001'
      },
      payload: {
        userId: 'viewer-001',
        role: 'Viewer',
        status: 'Invited'
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      tenantId: 'tenant-001',
      userId: 'viewer-001',
      role: 'Viewer',
      status: 'Invited'
    });
  });
});
