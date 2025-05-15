"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// PostgreSQL configuration
const config = {
    connectionString: process.env.POSTGRES_URL_NON_POOLING, // Using non-pooling URL for direct connection
    ssl: {
        rejectUnauthorized: true // Enforce SSL for Supabase
    }
};
// Create a new pool instance with optimized settings
const pool = new pg_1.Pool({
    ...config,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000 // How long to wait for a connection
});
// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
        return;
    }
    if (client) {
        console.log('Successfully connected to PostgreSQL');
        client.release();
    }
});
exports.default = pool;
