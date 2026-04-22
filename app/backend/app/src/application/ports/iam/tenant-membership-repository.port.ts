import type {
  MembershipStatus,
  TenantMembership,
  TenantMembershipIdentity,
  TenantMembershipUpdate,
  TenantRole
} from '../../../domain/iam/tenant-membership';

export interface CreateTenantMembershipInput {
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
}

export interface TenantMembershipRepositoryPort {
  withTenantLock<T>(tenantId: string, operation: () => Promise<T>): Promise<T>;
  listByTenantId(tenantId: string): Promise<TenantMembership[]>;
  listAllTenantIds(): Promise<string[]>;
  findByIdentity(identity: TenantMembershipIdentity): Promise<TenantMembership | null>;
  create(input: CreateTenantMembershipInput): Promise<TenantMembership>;
  update(identity: TenantMembershipIdentity, update: TenantMembershipUpdate): Promise<TenantMembership>;
  delete(identity: TenantMembershipIdentity): Promise<void>;
}
