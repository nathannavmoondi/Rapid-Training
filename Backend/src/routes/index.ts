import express, { Request, Response } from 'express';
import { CustomersController } from '../controllers/customers.controller';
import { db } from '../services/database.service';
import { connect } from 'http2';

const router = express.Router();
const customersController = new CustomersController();

console.log('routes');

// Test database connection
router.get('/test-db', async (req, res) => {
  
  const cstring = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

  try {

   
    // Test basic connection
    const versionResult = await db.query<{ version: string }>('SELECT version()');
    
    // Test schema access
    const schemaResult = await db.query(
      "SELECT current_schema(), current_database()"
    );
    
    // Test table listing
    const tablesResult = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()"
    );

    res.json({ 
      status: 'Connected',
      postgresVersion: versionResult.rows[0]?.version || 'Unknown',
      currentSchema: schemaResult.rows[0],
      tables: tablesResult.rows
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ 
      status: 'Error!',
      connectionString: cstring,
      message: err.message,
      stack: err.stack
    });
  }
});

// Customer routes
router.get('/sql', (req: Request, res: Response) => customersController.getSqlStatement(req, res));
router.get('/sql/:prompt', (req: Request, res: Response) => customersController.runSqlStatement(req, res));
router.get('/customers', (req: Request, res: Response) => customersController.getAllCustomers(req, res));
router.get('/customers/:id', (req: Request, res: Response) => customersController.getCustomerById(req, res));

// Test route
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
});

export default router;
