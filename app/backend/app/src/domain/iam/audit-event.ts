export type GovernanceAction =
  | 'membership.created'
  | 'membership.status.updated'
  | 'membership.deleted'
  | 'membership.role.updated'
  | 'platform.superadmin.assigned'
  | 'platform.superadmin.revoked';

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
