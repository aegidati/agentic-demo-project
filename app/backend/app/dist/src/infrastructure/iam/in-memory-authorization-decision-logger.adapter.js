"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryAuthorizationDecisionLoggerAdapter = void 0;
class InMemoryAuthorizationDecisionLoggerAdapter {
    entries = [];
    async record(entry) {
        this.entries.push({
            ...entry,
            occurredAt: new Date(entry.occurredAt)
        });
    }
    list() {
        return this.entries.map((entry) => ({
            ...entry,
            occurredAt: new Date(entry.occurredAt)
        }));
    }
}
exports.InMemoryAuthorizationDecisionLoggerAdapter = InMemoryAuthorizationDecisionLoggerAdapter;
