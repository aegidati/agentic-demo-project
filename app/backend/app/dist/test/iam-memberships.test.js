"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const main_1 = require("../src/main");
(0, vitest_1.describe)('iam memberships routes', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        app = await (0, main_1.buildApp)();
        await app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.it)('denies list when actor header is missing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/tenants/tenant-001/memberships'
        });
        (0, vitest_1.expect)(response.statusCode).toBe(401);
        (0, vitest_1.expect)(response.json().errorCode).toBe('auth.missing_actor');
    });
    (0, vitest_1.it)('denies tenant context conflict when route and header mismatch', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/tenants/tenant-001/memberships',
            headers: {
                'x-actor-user-id': 'owner-001',
                'x-tenant-id': 'tenant-002'
            }
        });
        (0, vitest_1.expect)(response.statusCode).toBe(409);
        (0, vitest_1.expect)(response.json().errorCode).toBe('auth.tenant_context_conflict');
    });
    (0, vitest_1.it)('enforces tenant isolation by denying outsider actor from another tenant', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/tenants/tenant-001/memberships',
            headers: {
                'x-actor-user-id': 'owner-002'
            }
        });
        (0, vitest_1.expect)(response.statusCode).toBe(403);
        (0, vitest_1.expect)(response.json().errorCode).toBe('auth.forbidden');
    });
    (0, vitest_1.it)('denies globally disabled user even with active tenant membership', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/tenants/tenant-001/memberships',
            headers: {
                'x-actor-user-id': 'disabled-001'
            }
        });
        (0, vitest_1.expect)(response.statusCode).toBe(403);
        (0, vitest_1.expect)(response.json().errorCode).toBe('auth.global_user_blocked');
    });
    (0, vitest_1.it)('allows globally active user with active membership', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/tenants/tenant-001/memberships',
            headers: {
                'x-actor-user-id': 'owner-001'
            }
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        (0, vitest_1.expect)(response.json().total).toBeGreaterThanOrEqual(2);
    });
    (0, vitest_1.it)('rejects self-elevation on role update', async () => {
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
        (0, vitest_1.expect)(response.statusCode).toBe(403);
        (0, vitest_1.expect)(response.json().errorCode).toBe('auth.forbidden');
    });
    (0, vitest_1.it)('rejects invalid membership lifecycle transition', async () => {
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
        (0, vitest_1.expect)(response.statusCode).toBe(409);
        (0, vitest_1.expect)(response.json().errorCode).toBe('membership.invalid_transition');
    });
    (0, vitest_1.it)('enforces last-owner protection on delete', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/tenants/tenant-001/memberships/owner-001',
            headers: {
                'x-actor-user-id': 'owner-001'
            }
        });
        (0, vitest_1.expect)(response.statusCode).toBe(409);
        (0, vitest_1.expect)(response.json().errorCode).toBe('membership.last_owner_protection');
    });
    (0, vitest_1.it)('allows owner to create membership with deterministic response', async () => {
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
        (0, vitest_1.expect)(response.statusCode).toBe(201);
        (0, vitest_1.expect)(response.json()).toMatchObject({
            tenantId: 'tenant-001',
            userId: 'viewer-001',
            role: 'Viewer',
            status: 'Invited'
        });
    });
});
