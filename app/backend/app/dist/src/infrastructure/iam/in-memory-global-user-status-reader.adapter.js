"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryGlobalUserStatusReaderAdapter = void 0;
class InMemoryGlobalUserStatusReaderAdapter {
    store = new Map();
    constructor(seed = []) {
        for (const profile of seed) {
            this.store.set(profile.userId, profile);
        }
    }
    async getByUserId(userId) {
        return this.store.get(userId) ?? null;
    }
}
exports.InMemoryGlobalUserStatusReaderAdapter = InMemoryGlobalUserStatusReaderAdapter;
