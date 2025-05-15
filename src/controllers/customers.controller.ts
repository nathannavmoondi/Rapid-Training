import { Request, Response } from 'express';
import { DatabaseService } from '../db/database.service';
import { Customer } from '../models/customer.model';

export class CustomersController {
  async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await DatabaseService.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      res.status(500).json({ message: 'Failed to retrieve customers' });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await DatabaseService.getCustomerById(id);
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json(customer);
    } catch (error) {
      console.error('Error in getCustomerById:', error);
      res.status(500).json({ message: 'Failed to retrieve customer' });
    }
  }

  async searchCustomers(req: Request, res: Response) {
    try {
      const { term } = req.query;
      if (!term || typeof term !== 'string') {
        return res.status(400).json({ message: 'Search term is required' });
      }

      const customers = await DatabaseService.searchCustomers(term);
      res.json(customers);
    } catch (error) {
      console.error('Error in searchCustomers:', error);
      res.status(500).json({ message: 'Failed to search customers' });
    }
  }
}
