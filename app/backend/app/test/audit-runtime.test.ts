import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveAuditEventWriterFromEnv } from '../src/main';
import { FileAuditEventWriterAdapter } from '../src/infrastructure/iam/file-audit-event-writer.adapter';

describe('audit runtime wiring', () => {
  const previousSink = process.env.IAM_AUDIT_SINK;
  const previousPath = process.env.IAM_AUDIT_FILE_PATH;
  const previousRetention = process.env.IAM_AUDIT_RETENTION_DAYS;

  afterEach(() => {
    process.env.IAM_AUDIT_SINK = previousSink;
    process.env.IAM_AUDIT_FILE_PATH = previousPath;
    process.env.IAM_AUDIT_RETENTION_DAYS = previousRetention;
  });

  it('selects file sink when IAM_AUDIT_SINK=file', () => {
    process.env.IAM_AUDIT_SINK = 'file';
    process.env.IAM_AUDIT_FILE_PATH = './var/test-audit.ndjson';
    process.env.IAM_AUDIT_RETENTION_DAYS = '365';

    const writer = resolveAuditEventWriterFromEnv();
    expect(writer).toBeInstanceOf(FileAuditEventWriterAdapter);
  });

  it('enforces retention while appending file-backed events', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'audit-events-'));
    const filePath = join(tempDir, 'events.ndjson');

    const oldDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    await writeFile(
      filePath,
      `${JSON.stringify({
        id: 'old-event',
        tenantId: 'tenant-001',
        actorUserId: 'owner-001',
        targetUserId: 'member-001',
        action: 'membership.created',
        metadata: {},
        occurredAt: oldDate,
        correlationId: 'old-correlation'
      })}\n`,
      'utf8'
    );

    const writer = new FileAuditEventWriterAdapter({
      filePath,
      retentionDays: 1
    });

    await writer.append({
      id: 'new-event',
      tenantId: 'tenant-001',
      actorUserId: 'owner-001',
      targetUserId: 'member-001',
      action: 'membership.role.updated',
      metadata: {},
      occurredAt: new Date(),
      correlationId: 'new-correlation'
    });

    const events = await writer.list();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('new-event');
  });
});
