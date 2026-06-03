import { Request, Response } from 'express';
import { Category } from '../models/Category.model.js';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const getAllCategoriesAdmin = async (req: Request, res: Response) => {
  try {
    const cats = await Category.find().sort({ order: 1 });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};
