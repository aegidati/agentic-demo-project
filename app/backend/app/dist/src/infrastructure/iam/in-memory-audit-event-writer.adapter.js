"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryAuditEventWriterAdapter = void 0;
class InMemoryAuditEventWriterAdapter {
    events = [];
    async append(event) {
        // Append-only semantics: keep immutable snapshots of records.
        this.events.push({
            ...event,
            occurredAt: new Date(event.occurredAt),
            metadata: { ...event.metadata }
        });
    }
    list() {
        return this.events.map((event) => ({
            ...event,
            occurredAt: new Date(event.occurredAt),
            metadata: { ...event.metadata }
        }));
    }
}
exports.InMemoryAuditEventWriterAdapter = InMemoryAuditEventWriterAdapter;
