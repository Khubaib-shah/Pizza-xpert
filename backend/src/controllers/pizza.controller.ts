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

export const createPizza = async (req: Request, res: Response) => {
  try {
    const pizza = new Pizza(req.body);
    await pizza.save();
    res.status(201).json(pizza);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating pizza' });
  }
};

export const updatePizza = async (req: Request, res: Response) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating pizza' });
  }
};

export const deletePizza = async (req: Request, res: Response) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pizza' });
  }
};
