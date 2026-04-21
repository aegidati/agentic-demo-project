import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/main';
import { InMemoryAuditEventWriterAdapter } from '../src/infrastructure/iam/in-memory-audit-event-writer.adapter';

describe('iam audit events', () => {
  let app: FastifyInstance;
  let auditWriter: InMemoryAuditEventWriterAdapter;

  beforeAll(async () => {
    auditWriter = new InMemoryAuditEventWriterAdapter();
    app = buildApp({ auditEventWriter: auditWriter });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('emits append-only audit events with required fields for role/status/delete mutations', async () => {
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

    expect(roleResponse.statusCode).toBe(200);

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

    expect(statusResponse.statusCode).toBe(200);

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

    expect(createResponse.statusCode).toBe(201);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: '/tenants/tenant-001/memberships/temp-001',
      headers: {
        'x-actor-user-id': 'owner-001'
      }
    });

    expect(deleteResponse.statusCode).toBe(204);

    const events = auditWriter.list();
    expect(events).toHaveLength(4);
    expect(events.map((event) => event.action)).toEqual([
      'membership.role.updated',
      'membership.status.updated',
      'membership.created',
      'membership.deleted'
    ]);

    for (const event of events) {
      expect(event.id).toBeTruthy();
      expect(event.tenantId).toBe('tenant-001');
      expect(event.actorUserId).toBe('owner-001');
      expect(event.targetUserId).toBeTruthy();
      expect(event.occurredAt).toBeInstanceOf(Date);
      expect(event.correlationId).toBeTruthy();
      expect(typeof event.metadata).toBe('object');
      expect(event.metadata).not.toBeNull();
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
    expect(auditWriter.list()).toHaveLength(beforeAppendCount + 1);
  });
});
