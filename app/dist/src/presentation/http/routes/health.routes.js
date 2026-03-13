"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = registerHealthRoutes;
function registerHealthRoutes(app, dependencies) {
    app.get('/health', async () => dependencies.getHealthStatusUseCase.execute());
}
