import { Request, Response } from 'express';
import { MenuConfig } from '../models/MenuConfig.model.js';

// GET the single menu config document
export const getMenuConfig = async (req: Request, res: Response) => {
  try {
    let config = await MenuConfig.findOne({ key: 'default' });
    if (!config) {
      return res.status(404).json({ message: 'Menu config not found. Please seed the database.' });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu config' });
  }
};

// PUT update the menu config (upsert)
export const updateMenuConfig = async (req: Request, res: Response) => {
  try {
    const config = await MenuConfig.findOneAndUpdate(
      { key: 'default' },
      { ...req.body, key: 'default' },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating menu config' });
  }
};
