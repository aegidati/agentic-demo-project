import type {
  MembershipStatus,
  TenantMembership,
  TenantRole
} from './tenant-membership';

const allowedTransitions: Record<MembershipStatus, MembershipStatus[]> = {
  Invited: ['Active', 'Revoked'],
  Active: ['Suspended', 'Revoked'],
  Suspended: ['Active'],
  Revoked: []
};

const roleRank: Record<TenantRole, number> = {
  Viewer: 1,
  Member: 2,
  Admin: 3,
  Owner: 4
};

export function isAllowedMembershipTransition(
  from: MembershipStatus,
  to: MembershipStatus
): boolean {
  return allowedTransitions[from].includes(to);
}

export function isSelfElevation(
  actorUserId: string,
  targetUserId: string,
  currentRole: TenantRole | null,
  requestedRole: TenantRole
): boolean {
  if (actorUserId !== targetUserId) {
    return false;
  }

  if (!currentRole) {
    return roleRank[requestedRole] > roleRank.Viewer;
  }

  return roleRank[requestedRole] > roleRank[currentRole];
}

export function countActiveOwners(memberships: TenantMembership[]): number {
  return memberships.filter((m) => m.status === 'Active' && m.role === 'Owner').length;
}
