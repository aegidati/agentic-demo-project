"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = void 0;
class AuthorizationError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
