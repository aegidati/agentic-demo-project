import type {
  CreatePlatformMembershipInput,
  PlatformMembershipRepositoryPort
} from '../../application/ports/iam/platform-membership-repository.port';
import type { PlatformMembership } from '../../domain/iam/platform-role';

export class InMemoryPlatformMembershipRepositoryAdapter
  implements PlatformMembershipRepositoryPort
{
  private readonly store = new Map<string, PlatformMembership>();

  constructor(seed: PlatformMembership[] = []) {
    for (const item of seed) {
      this.store.set(item.userId, item);
    }
  }

  async listAll(): Promise<PlatformMembership[]> {
    return [...this.store.values()];
  }

  async findByUserId(userId: string): Promise<PlatformMembership | null> {
    return this.store.get(userId) ?? null;
  }

  async create(input: CreatePlatformMembershipInput): Promise<PlatformMembership> {
    const now = new Date();
    const created: PlatformMembership = {
      userId: input.userId,
      role: input.role,
      status: input.status,
      assignedAt: now,
      updatedAt: now
    };

    this.store.set(input.userId, created);
    return created;
  }

  async update(
    userId: string,
    update: Pick<PlatformMembership, 'status'>
  ): Promise<PlatformMembership> {
    const current = this.store.get(userId);
    if (!current) {
      throw new Error(`PlatformMembership not found for userId: ${userId}`);
    }

    const next: PlatformMembership = {
      ...current,
      ...update,
      updatedAt: new Date()
    };

    this.store.set(userId, next);
    return next;
  }

  async delete(userId: string): Promise<void> {
    this.store.delete(userId);
  }
}
