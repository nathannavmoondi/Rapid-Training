import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use connection URL for Vercel deployment compatibility
const poolConfig: PoolConfig = process.env.POSTGRES_URL
  ? {
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    };

// Log the connection string (without sensitive data) for debugging
console.log('Attempting to connect to database...');
const redactedUrl = process.env.POSTGRES_URL_NON_POOLING?.replace(/:[^:@]*@/, ':****@') || 'No URL found';
console.log('Connection URL (redacted):', redactedUrl);

export const pool = new Pool(poolConfig);
