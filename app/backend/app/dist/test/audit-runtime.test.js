"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const vitest_1 = require("vitest");
const main_1 = require("../src/main");
const file_audit_event_writer_adapter_1 = require("../src/infrastructure/iam/file-audit-event-writer.adapter");
(0, vitest_1.describe)('audit runtime wiring', () => {
    const previousSink = process.env.IAM_AUDIT_SINK;
    const previousPath = process.env.IAM_AUDIT_FILE_PATH;
    const previousRetention = process.env.IAM_AUDIT_RETENTION_DAYS;
    (0, vitest_1.afterEach)(() => {
        process.env.IAM_AUDIT_SINK = previousSink;
        process.env.IAM_AUDIT_FILE_PATH = previousPath;
        process.env.IAM_AUDIT_RETENTION_DAYS = previousRetention;
    });
    (0, vitest_1.it)('selects file sink when IAM_AUDIT_SINK=file', () => {
        process.env.IAM_AUDIT_SINK = 'file';
        process.env.IAM_AUDIT_FILE_PATH = './var/test-audit.ndjson';
        process.env.IAM_AUDIT_RETENTION_DAYS = '365';
        const writer = (0, main_1.resolveAuditEventWriterFromEnv)();
        (0, vitest_1.expect)(writer).toBeInstanceOf(file_audit_event_writer_adapter_1.FileAuditEventWriterAdapter);
    });
    (0, vitest_1.it)('enforces retention while appending file-backed events', async () => {
        const tempDir = await (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'audit-events-'));
        const filePath = (0, node_path_1.join)(tempDir, 'events.ndjson');
        const oldDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        await (0, promises_1.writeFile)(filePath, `${JSON.stringify({
            id: 'old-event',
            tenantId: 'tenant-001',
            actorUserId: 'owner-001',
            targetUserId: 'member-001',
            action: 'membership.created',
            metadata: {},
            occurredAt: oldDate,
            correlationId: 'old-correlation'
        })}\n`, 'utf8');
        const writer = new file_audit_event_writer_adapter_1.FileAuditEventWriterAdapter({
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
        (0, vitest_1.expect)(events).toHaveLength(1);
        (0, vitest_1.expect)(events[0].id).toBe('new-event');
    });
});
