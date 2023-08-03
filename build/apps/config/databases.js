"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASES = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASES = {
    users: {
        db_name: process.env.DB_NAME_USER || "dapil",
        db_host: process.env.DB_HOST || "127.0.0.1",
        db_port: process.env.DB_PORT || 3306,
        db_username: process.env.DB_USERNAME || "root",
        db_password: process.env.DB_PASSWORD || "toor",
        db_log: process.env.DB_LOG == "true",
    },
};
