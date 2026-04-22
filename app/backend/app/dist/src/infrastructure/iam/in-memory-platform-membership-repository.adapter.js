"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlatformMembershipRepositoryAdapter = void 0;
class InMemoryPlatformMembershipRepositoryAdapter {
    store = new Map();
    constructor(seed = []) {
        for (const item of seed) {
            this.store.set(item.userId, item);
        }
    }
    async listAll() {
        return [...this.store.values()];
    }
    async findByUserId(userId) {
        return this.store.get(userId) ?? null;
    }
    async create(input) {
        const now = new Date();
        const created = {
            userId: input.userId,
            role: input.role,
            status: input.status,
            assignedAt: now,
            updatedAt: now
        };
        this.store.set(input.userId, created);
        return created;
    }
    async update(userId, update) {
        const current = this.store.get(userId);
        if (!current) {
            throw new Error(`PlatformMembership not found for userId: ${userId}`);
        }
        const next = {
            ...current,
            ...update,
            updatedAt: new Date()
        };
        this.store.set(userId, next);
        return next;
    }
    async delete(userId) {
        this.store.delete(userId);
    }
}
exports.InMemoryPlatformMembershipRepositoryAdapter = InMemoryPlatformMembershipRepositoryAdapter;
