"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryHealthCheckAdapter = void 0;
class InMemoryHealthCheckAdapter {
    async getStatus() {
        return { status: 'ok' };
    }
}
exports.InMemoryHealthCheckAdapter = InMemoryHealthCheckAdapter;
