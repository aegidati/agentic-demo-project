"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const main_1 = require("../src/main");
(0, vitest_1.describe)('health endpoint', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        app = await (0, main_1.buildApp)();
        await app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.it)('returns status ok for GET /health', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health'
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        (0, vitest_1.expect)(response.json()).toEqual({ status: 'ok' });
    });
});
