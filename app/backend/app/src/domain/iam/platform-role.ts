export type PlatformRole = 'Superadmin';

export type PlatformMembershipStatus = 'Active' | 'Revoked';

export interface PlatformMembership {
  userId: string;
  role: PlatformRole;
  status: PlatformMembershipStatus;
  assignedAt: Date;
  updatedAt: Date;
}
