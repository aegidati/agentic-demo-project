"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const main_1 = require("../src/main");
const in_memory_audit_event_writer_adapter_1 = require("../src/infrastructure/iam/in-memory-audit-event-writer.adapter");
(0, vitest_1.describe)('iam audit events', () => {
    let app;
    let auditWriter;
    (0, vitest_1.beforeAll)(async () => {
        auditWriter = new in_memory_audit_event_writer_adapter_1.InMemoryAuditEventWriterAdapter();
        app = (0, main_1.buildApp)({ auditEventWriter: auditWriter });
        await app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.it)('emits append-only audit events with required fields for role/status/delete mutations', async () => {
        const roleResponse = await app.inject({
            method: 'PATCH',
            url: '/tenants/tenant-001/memberships/member-001/role',
            headers: {
                'x-actor-user-id': 'owner-001'
            },
            payload: {
                role: 'Viewer'
            }
        });
        (0, vitest_1.expect)(roleResponse.statusCode).toBe(200);
        const statusResponse = await app.inject({
            method: 'PATCH',
            url: '/tenants/tenant-001/memberships/member-001/status',
            headers: {
                'x-actor-user-id': 'owner-001'
            },
            payload: {
                status: 'Suspended'
            }
        });
        (0, vitest_1.expect)(statusResponse.statusCode).toBe(200);
        const createResponse = await app.inject({
            method: 'POST',
            url: '/tenants/tenant-001/memberships',
            headers: {
                'x-actor-user-id': 'owner-001'
            },
            payload: {
                userId: 'temp-001',
                role: 'Member',
                status: 'Invited'
            }
        });
        (0, vitest_1.expect)(createResponse.statusCode).toBe(201);
        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: '/tenants/tenant-001/memberships/temp-001',
            headers: {
                'x-actor-user-id': 'owner-001'
            }
        });
        (0, vitest_1.expect)(deleteResponse.statusCode).toBe(204);
        const events = auditWriter.list();
        (0, vitest_1.expect)(events).toHaveLength(4);
        (0, vitest_1.expect)(events.map((event) => event.action)).toEqual([
            'membership.role.updated',
            'membership.status.updated',
            'membership.created',
            'membership.deleted'
        ]);
        for (const event of events) {
            (0, vitest_1.expect)(event.id).toBeTruthy();
            (0, vitest_1.expect)(event.tenantId).toBe('tenant-001');
            (0, vitest_1.expect)(event.actorUserId).toBe('owner-001');
            (0, vitest_1.expect)(event.targetUserId).toBeTruthy();
            (0, vitest_1.expect)(event.occurredAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(event.correlationId).toBeTruthy();
            (0, vitest_1.expect)(typeof event.metadata).toBe('object');
            (0, vitest_1.expect)(event.metadata).not.toBeNull();
        }
        // Append-only behavior: no update/delete operation on stored events, only growth by append.
        const beforeAppendCount = events.length;
        await auditWriter.append({
            id: 'manual-event',
            tenantId: 'tenant-001',
            actorUserId: 'owner-001',
            targetUserId: 'owner-001',
            action: 'membership.role.updated',
            metadata: {},
            occurredAt: new Date(),
            correlationId: 'manual-correlation'
        });
        (0, vitest_1.expect)(auditWriter.list()).toHaveLength(beforeAppendCount + 1);
    });
});
