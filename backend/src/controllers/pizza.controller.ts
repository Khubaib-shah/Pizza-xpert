import { Request, Response } from 'express';
import { Pizza } from '../models/Pizza.model.js';

export const getAllPizzas = async (req: Request, res: Response) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pizzas' });
  }
};
