"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTenantMembershipRepositoryAdapter = void 0;
class InMemoryTenantMembershipRepositoryAdapter {
    store = new Map();
    tenantLocks = new Map();
    constructor(seed = []) {
        for (const item of seed) {
            this.store.set(this.buildKey(item.tenantId, item.userId), item);
        }
    }
    async withTenantLock(tenantId, operation) {
        const previous = this.tenantLocks.get(tenantId) ?? Promise.resolve();
        let releaseCurrent;
        const current = new Promise((resolve) => {
            releaseCurrent = resolve;
        });
        const queue = previous.then(() => current);
        this.tenantLocks.set(tenantId, queue);
        await previous;
        try {
            return await operation();
        }
        finally {
            releaseCurrent();
            if (this.tenantLocks.get(tenantId) === queue) {
                this.tenantLocks.delete(tenantId);
            }
        }
    }
    async listByTenantId(tenantId) {
        return [...this.store.values()].filter((m) => m.tenantId === tenantId);
    }
    async findByIdentity(identity) {
        return this.store.get(this.buildKey(identity.tenantId, identity.userId)) ?? null;
    }
    async create(input) {
        const now = new Date();
        const created = {
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
    async update(identity, update) {
        const current = this.store.get(this.buildKey(identity.tenantId, identity.userId));
        if (!current) {
            throw new Error('Membership not found for update');
        }
        const next = {
            ...current,
            ...update,
            updatedAt: new Date()
        };
        this.store.set(this.buildKey(identity.tenantId, identity.userId), next);
        return next;
    }
    async delete(identity) {
        this.store.delete(this.buildKey(identity.tenantId, identity.userId));
    }
    buildKey(tenantId, userId) {
        return `${tenantId}::${userId}`;
    }
}
exports.InMemoryTenantMembershipRepositoryAdapter = InMemoryTenantMembershipRepositoryAdapter;
