"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONFIG = {
    app_version: process.env.APP_VERSION || '1.0.0',
    app_semantic: process.env.APP_SEMANTIC || '0',
    env: process.env.APP_ENV || 'development',
    port: process.env.APP_PORT ?? 8000,
    log: process.env.LOG == 'true',
    secret: {
        key_encryption: process.env.SECRET_KEY_ENCRYPTION || '',
        password_encryption: process.env.SECRET_PASSWORD_ENCRYPTION || 'qwerty'
    },
    authorization: {
        username: process.env.AUTHORIZATION_USERNAME || 'd4p1l',
        passsword: process.env.AUTHORIZATION_PASSWORD || 'd4p1l2023'
    },
    waBlasToken: process.env.WA_BLAS_TOKEN,
    waBlasBaseUrl: process.env.WA_BLAS_BASE_URL,
    base_url: process.env.BASE_URL || `http://localhost:${process.env.APP_PORT}`
};
