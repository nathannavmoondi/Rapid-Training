import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL configuration
const config: PoolConfig = {
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase connection
  }
};

// Create a new pool instance
const pool = new Pool(config);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }
  console.log('Successfully connected to PostgreSQL');
  client.release();
});

export default pool;
