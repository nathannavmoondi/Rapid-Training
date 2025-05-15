"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const poolConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: process.env.POSTGRES_DATABASE,
    ssl: {
        rejectUnauthorized: false // Required for Supabase connections
    }
};
// Log the connection string (without sensitive data) for debugging
console.log('Attempting to connect to database...');
const redactedUrl = ((_a = process.env.POSTGRES_URL_NON_POOLING) === null || _a === void 0 ? void 0 : _a.replace(/:[^:@]*@/, ':****@')) || 'No URL found';
console.log('Connection URL (redacted):', redactedUrl);
exports.pool = new pg_1.Pool(poolConfig);
