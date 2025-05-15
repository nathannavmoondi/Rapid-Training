import { Pool, QueryResult, QueryResultRow } from 'pg';
import { pool } from '../config/database';

class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query<{ value: number }>('SELECT 1 as value');
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }

  async query<T extends QueryResultRow>(queryText: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      console.log('Executing query:', queryText, params);
      const result = await this.pool.query<T>(queryText, params);
      return result;
    } catch (error) {
      const err = error as Error;
      console.error('Query error:', {
        message: err.message,
        query: queryText,
        params
      });
      throw error;
    }
  }
}

export const db = DatabaseService.getInstance();
