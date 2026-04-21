import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { AuditEventWriterPort } from '../../application/ports/iam/audit-event-writer.port';
import type { AuditEvent } from '../../domain/iam/audit-event';

interface FileAuditEventWriterOptions {
  filePath: string;
  retentionDays: number;
}

function serialize(event: AuditEvent): string {
  return JSON.stringify({
    ...event,
    occurredAt: event.occurredAt.toISOString()
  });
}

function deserialize(line: string): AuditEvent {
  const raw = JSON.parse(line) as Omit<AuditEvent, 'occurredAt'> & { occurredAt: string };
  return {
    ...raw,
    occurredAt: new Date(raw.occurredAt)
  };
}

export class FileAuditEventWriterAdapter implements AuditEventWriterPort {
  private readonly filePath: string;
  private readonly retentionDays: number;

  constructor(options: FileAuditEventWriterOptions) {
    this.filePath = options.filePath;
    this.retentionDays = options.retentionDays;
  }

  async append(event: AuditEvent): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });

    const cutoff = Date.now() - this.retentionDays * 24 * 60 * 60 * 1000;
    const current = await this.readAll();
    const retained = current.filter((item) => item.occurredAt.getTime() >= cutoff);
    const next = [...retained, event];

    await writeFile(this.filePath, `${next.map(serialize).join('\n')}\n`, 'utf8');
  }

  async list(): Promise<AuditEvent[]> {
    return this.readAll();
  }

  private async readAll(): Promise<AuditEvent[]> {
    try {
      const content = await readFile(this.filePath, 'utf8');
      if (!content.trim()) {
        return [];
      }

      return content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map(deserialize);
    } catch {
      return [];
    }
  }
}
