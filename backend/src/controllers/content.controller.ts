import { Request, Response } from 'express';
import { Deal } from '../models/Deal.model.js';
import { Category } from '../models/Category.model.js';
import { Testimonial } from '../models/Testimonial.model.js';

export const getLandingContent = async (req: Request, res: Response) => {
  try {
    const [deals, categories, testimonials] = await Promise.all([
      Deal.find(),
      Category.find(),
      Testimonial.find()
    ]);

    res.json({
      deals,
      categories,
      testimonials
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
};
