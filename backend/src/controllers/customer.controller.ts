import { Request, Response } from 'express';
import { Customer } from '../models/Customer.model.js';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
};
