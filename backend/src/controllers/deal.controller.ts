import { Request, Response } from 'express';
import { Deal } from '../models/Deal.model.js';

export const getAllDeals = async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find({ isActive: true });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals' });
  }
};

export const getAllDealsAdmin = async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals' });
  }
};

export const createDeal = async (req: Request, res: Response) => {
  try {
    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating deal' });
  }
};

export const updateDeal = async (req: Request, res: Response) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating deal' });
  }
};

export const deleteDeal = async (req: Request, res: Response) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting deal' });
  }
};
