export interface AuthorizationDecisionLogEntry {
  tenantId: string;
  actorUserId: string;
  operation: string;
  decision: 'allow' | 'deny';
  reasonCode?: string;
  occurredAt: Date;
}

export interface AuthorizationDecisionLoggerPort {
  record(entry: AuthorizationDecisionLogEntry): Promise<void>;
}
