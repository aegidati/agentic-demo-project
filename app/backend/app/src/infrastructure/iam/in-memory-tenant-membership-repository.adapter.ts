import type {
  CreateTenantMembershipInput,
  TenantMembershipRepositoryPort
} from '../../application/ports/iam/tenant-membership-repository.port';
import type {
  TenantMembership,
  TenantMembershipIdentity,
  TenantMembershipUpdate
} from '../../domain/iam/tenant-membership';

export class InMemoryTenantMembershipRepositoryAdapter
  implements TenantMembershipRepositoryPort
{
  private readonly store = new Map<string, TenantMembership>();
  private readonly tenantLocks = new Map<string, Promise<void>>();

  constructor(seed: TenantMembership[] = []) {
    for (const item of seed) {
      this.store.set(this.buildKey(item.tenantId, item.userId), item);
    }
  }

  async withTenantLock<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.tenantLocks.get(tenantId) ?? Promise.resolve();
    let releaseCurrent!: () => void;
    const current = new Promise<void>((resolve) => {
      releaseCurrent = resolve;
    });

    const queue = previous.then(() => current);
    this.tenantLocks.set(tenantId, queue);

    await previous;

    try {
      return await operation();
    } finally {
      releaseCurrent();

      if (this.tenantLocks.get(tenantId) === queue) {
        this.tenantLocks.delete(tenantId);
      }
    }
  }

  async listByTenantId(tenantId: string): Promise<TenantMembership[]> {
    return [...this.store.values()].filter((m) => m.tenantId === tenantId);
  }

  async findByIdentity(
    identity: TenantMembershipIdentity
  ): Promise<TenantMembership | null> {
    return this.store.get(this.buildKey(identity.tenantId, identity.userId)) ?? null;
  }

  async create(input: CreateTenantMembershipInput): Promise<TenantMembership> {
    const now = new Date();
    const created: TenantMembership = {
      tenantId: input.tenantId,
      userId: input.userId,
      role: input.role,
      status: input.status,
      createdAt: now,
      updatedAt: now
    };

    this.store.set(this.buildKey(input.tenantId, input.userId), created);
    return created;
  }

  async update(
    identity: TenantMembershipIdentity,
    update: TenantMembershipUpdate
  ): Promise<TenantMembership> {
    const current = this.store.get(this.buildKey(identity.tenantId, identity.userId));
    if (!current) {
      throw new Error('Membership not found for update');
    }

    const next: TenantMembership = {
      ...current,
      ...update,
      updatedAt: new Date()
    };

    this.store.set(this.buildKey(identity.tenantId, identity.userId), next);
    return next;
  }

  async delete(identity: TenantMembershipIdentity): Promise<void> {
    this.store.delete(this.buildKey(identity.tenantId, identity.userId));
  }

  private buildKey(tenantId: string, userId: string): string {
    return `${tenantId}::${userId}`;
  }
}
