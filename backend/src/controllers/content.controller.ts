import { Request, Response } from 'express';
import { Deal } from '../models/Deal.model.js';
import { Category } from '../models/Category.model.js';
import { Testimonial } from '../models/Testimonial.model.js';
import { HeroSlide } from '../models/HeroSlide.model.js';
import { MenuConfig } from '../models/MenuConfig.model.js';

export const getLandingContent = async (req: Request, res: Response) => {
  try {
    const [deals, categories, testimonials, heroSlides, menuConfig] = await Promise.all([
      Deal.find({ isActive: true }),
      Category.find({ isActive: true }).sort({ order: 1 }),
      Testimonial.find(),
      HeroSlide.find({ isActive: true }).sort({ order: 1 }),
      MenuConfig.findOne({ key: 'default' }),
    ]);

    res.json({
      deals,
      categories,
      testimonials,
      heroSlides,
      menuConfig,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
};
