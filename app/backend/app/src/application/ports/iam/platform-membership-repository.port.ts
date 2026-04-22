import type {
  PlatformMembership,
  PlatformMembershipStatus,
  PlatformRole
} from '../../../domain/iam/platform-role';

export interface CreatePlatformMembershipInput {
  userId: string;
  role: PlatformRole;
  status: PlatformMembershipStatus;
}

export interface PlatformMembershipRepositoryPort {
  listAll(): Promise<PlatformMembership[]>;
  findByUserId(userId: string): Promise<PlatformMembership | null>;
  create(input: CreatePlatformMembershipInput): Promise<PlatformMembership>;
  update(userId: string, update: Pick<PlatformMembership, 'status'>): Promise<PlatformMembership>;
  delete(userId: string): Promise<void>;
}
