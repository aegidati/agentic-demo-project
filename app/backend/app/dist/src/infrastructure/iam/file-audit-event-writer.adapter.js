"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAuditEventWriterAdapter = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
function serialize(event) {
    return JSON.stringify({
        ...event,
        occurredAt: event.occurredAt.toISOString()
    });
}
function deserialize(line) {
    const raw = JSON.parse(line);
    return {
        ...raw,
        occurredAt: new Date(raw.occurredAt)
    };
}
class FileAuditEventWriterAdapter {
    filePath;
    retentionDays;
    constructor(options) {
        this.filePath = options.filePath;
        this.retentionDays = options.retentionDays;
    }
    async append(event) {
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(this.filePath), { recursive: true });
        const cutoff = Date.now() - this.retentionDays * 24 * 60 * 60 * 1000;
        const current = await this.readAll();
        const retained = current.filter((item) => item.occurredAt.getTime() >= cutoff);
        const next = [...retained, event];
        await (0, promises_1.writeFile)(this.filePath, `${next.map(serialize).join('\n')}\n`, 'utf8');
    }
    async list() {
        return this.readAll();
    }
    async readAll() {
        try {
            const content = await (0, promises_1.readFile)(this.filePath, 'utf8');
            if (!content.trim()) {
                return [];
            }
            return content
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map(deserialize);
        }
        catch {
            return [];
        }
    }
}
exports.FileAuditEventWriterAdapter = FileAuditEventWriterAdapter;
