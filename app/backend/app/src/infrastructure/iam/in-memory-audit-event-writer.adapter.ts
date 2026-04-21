import type { AuditEventWriterPort } from '../../application/ports/iam/audit-event-writer.port';
import type { AuditEvent } from '../../domain/iam/audit-event';

export class InMemoryAuditEventWriterAdapter implements AuditEventWriterPort {
  private readonly events: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<void> {
    // Append-only semantics: keep immutable snapshots of records.
    this.events.push({
      ...event,
      occurredAt: new Date(event.occurredAt),
      metadata: { ...event.metadata }
    });
  }

  list(): AuditEvent[] {
    return this.events.map((event) => ({
      ...event,
      occurredAt: new Date(event.occurredAt),
      metadata: { ...event.metadata }
    }));
  }
}
