import { Request, Response } from 'express';
import { HeroSlide } from '../models/HeroSlide.model.js';

// GET all active slides (sorted by order)
export const getAllSlides = async (req: Request, res: Response) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hero slides' });
  }
};

// GET all slides for admin (including inactive)
export const getAllSlidesAdmin = async (req: Request, res: Response) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hero slides' });
  }
};

// POST create a new slide
export const createSlide = async (req: Request, res: Response) => {
  try {
    const slide = new HeroSlide(req.body);
    await slide.save();
    res.status(201).json(slide);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating slide' });
  }
};

// PUT update a slide
export const updateSlide = async (req: Request, res: Response) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json(slide);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating slide' });
  }
};

// DELETE a slide
export const deleteSlide = async (req: Request, res: Response) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slide' });
  }
};
