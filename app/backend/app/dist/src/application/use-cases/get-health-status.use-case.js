"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHealthStatusUseCase = void 0;
class GetHealthStatusUseCase {
    healthCheckPort;
    constructor(healthCheckPort) {
        this.healthCheckPort = healthCheckPort;
    }
    execute() {
        return this.healthCheckPort.getStatus();
    }
}
exports.GetHealthStatusUseCase = GetHealthStatusUseCase;
