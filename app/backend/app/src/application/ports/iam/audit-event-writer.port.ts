import type { AuditEvent } from '../../../domain/iam/audit-event';

export interface AuditEventWriterPort {
  append(event: AuditEvent): Promise<void>;
}
