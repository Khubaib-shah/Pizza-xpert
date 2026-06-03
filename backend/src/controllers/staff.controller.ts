import { Request, Response } from 'express';
import { Staff } from '../models/Staff.model.js';

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff' });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff' });
  }
};
