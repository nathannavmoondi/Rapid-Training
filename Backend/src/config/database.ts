import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
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
const redactedUrl = process.env.POSTGRES_URL_NON_POOLING?.replace(/:[^:@]*@/, ':****@') || 'No URL found';
console.log('Connection URL (redacted):', redactedUrl);

export const pool = new Pool(poolConfig);
