import pool from './config';
import { QueryResult } from 'pg';

export class DatabaseService {
  static async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(query, params);
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  static async getCustomers() {
    const query = 'SELECT * FROM customers';
    try {
      const result = await this.executeQuery(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  static async getCustomerById(id: string) {
    const query = 'SELECT * FROM customers WHERE customer_id = $1';
    try {
      const result = await this.executeQuery(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  static async searchCustomers(searchTerm: string) {
    const query = `
      SELECT * FROM customers 
      WHERE LOWER(company_name) LIKE LOWER($1) 
      OR LOWER(contact_name) LIKE LOWER($1)
    `;
    try {
      const result = await this.executeQuery(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
}
