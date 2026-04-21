export type TenantRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';

export type MembershipStatus = 'Invited' | 'Active' | 'Suspended' | 'Revoked';

export interface TenantMembership {
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantMembershipIdentity {
  tenantId: string;
  userId: string;
}

export interface TenantMembershipUpdate {
  role?: TenantRole;
  status?: MembershipStatus;
}
