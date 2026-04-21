import type {
  AuthorizationDecisionLogEntry,
  AuthorizationDecisionLoggerPort
} from '../../application/ports/iam/authorization-decision-logger.port';

export class InMemoryAuthorizationDecisionLoggerAdapter
  implements AuthorizationDecisionLoggerPort
{
  private readonly entries: AuthorizationDecisionLogEntry[] = [];

  async record(entry: AuthorizationDecisionLogEntry): Promise<void> {
    this.entries.push({
      ...entry,
      occurredAt: new Date(entry.occurredAt)
    });
  }

  list(): AuthorizationDecisionLogEntry[] {
    return this.entries.map((entry) => ({
      ...entry,
      occurredAt: new Date(entry.occurredAt)
    }));
  }
}
