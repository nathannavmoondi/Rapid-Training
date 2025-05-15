import { Request, Response } from 'express';
import { db } from '../services/database.service';
import { Customer } from '../models/customer.model';

export class CustomersController {
  getAllCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
      // First check if the table exists
      const tableCheck = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers')"
        
      );
      
      if (!tableCheck.rows[0].exists) {
        res.status(404).json({ 
          error: 'Customers table does not exist',
          message: 'Please run the database initialization script'
        });
        return;
      }

      console.log('Fetching all customers...');
      const result = await db.query<Customer>(
        'SELECT * FROM customers LIMIT 10'
      );
      console.log('Query result:', result);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching customers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: `Internal server error: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      });
    }
  };

  getCustomerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await db.query<Customer>(
        'SELECT * FROM customers WHERE CustomerID = $1',
        [id]
      );
      
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching customer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: `Internal server error: ${errorMessage}` });
    }
  };
}
