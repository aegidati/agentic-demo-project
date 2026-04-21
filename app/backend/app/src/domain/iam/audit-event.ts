export type GovernanceAction =
  | 'membership.created'
  | 'membership.status.updated'
  | 'membership.deleted'
  | 'membership.role.updated';

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorUserId: string;
  targetUserId: string;
  action: GovernanceAction;
  metadata: Record<string, unknown>;
  occurredAt: Date;
  correlationId: string;
}
