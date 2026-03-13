"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
exports.startServer = startServer;
const fastify_1 = __importDefault(require("fastify"));
const get_health_status_use_case_1 = require("./application/use-cases/get-health-status.use-case");
const in_memory_health_check_adapter_1 = require("./infrastructure/health/in-memory-health-check.adapter");
const health_routes_1 = require("./presentation/http/routes/health.routes");
function buildApp() {
    const app = (0, fastify_1.default)({ logger: true });
    const healthCheckAdapter = new in_memory_health_check_adapter_1.InMemoryHealthCheckAdapter();
    const getHealthStatusUseCase = new get_health_status_use_case_1.GetHealthStatusUseCase(healthCheckAdapter);
    (0, health_routes_1.registerHealthRoutes)(app, { getHealthStatusUseCase });
    return app;
}
async function startServer() {
    const app = buildApp();
    const host = process.env.HOST ?? '0.0.0.0';
    const port = Number(process.env.PORT ?? 3000);
    await app.listen({ host, port });
}
if (require.main === module) {
    startServer().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
