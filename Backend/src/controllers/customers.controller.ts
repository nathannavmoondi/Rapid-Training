import { Request, Response } from 'express';
import { db } from '../services/database.service';
import { Customer } from '../models/customer.model';
import { requestSqlStatement} from '../services/aiDbService'; // Assuming you have a service to handle SQL requests
export class CustomersController {
    getSqlStatement = async(req: Request, res: Response): Promise<void> => {
    
    var sql = await requestSqlStatement("give me all the customers", "customer");
    res.json(sql);
  };
  runSqlStatement = async(req: Request, res: Response): Promise<void> => {
    try {
      const { prompt  } = req.params; //eg: give me all the customers
      console.log('text is >>', prompt);
      const sql = await requestSqlStatement(prompt, "customers");
      console.log('sql is >>', sql);
      const result = await db.query<Customer>(sql);
      res.json({
        sql: sql,
        results: result.rows
      });
    } catch (error) {
      console.error('Error executing SQL statement:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: `Internal server error: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      });
    }
  };
  
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

