import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Parse the connection URL to ensure SSL mode is properly set
const parseConnectionString = (url: string | undefined) => {
  if (!url) return url;
  return url.includes('sslmode=require') ? url : `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
};

// For Vercel deployment, prefer the pooled connection URL
const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Database connection URL is not provided');
}

const poolConfig: PoolConfig = {
  connectionString: parseConnectionString(connectionString),
  ssl: {
    rejectUnauthorized: false
  }
};

// Log the connection string (without sensitive data) for debugging
console.log('Attempting to connect to database...');
const redactedUrl = connectionString.replace(/:[^:@]*@/, ':****@');
console.log('Connection URL (redacted):', redactedUrl);

export const pool = new Pool(poolConfig);
