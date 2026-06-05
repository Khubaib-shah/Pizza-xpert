import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. 'deal-8-pizza'
  backgroundImg: { type: String, required: true },
  badgeText: { type: String, required: true },
  titleNumber: { type: String, required: true },
  titleTextLines: [{ type: String }],
  items: [{ type: String }],           // combo bullet items shown under title
  price: { type: String, required: true },
  pricePrefix: { type: String, default: 'Rs.' },
  primaryCtaText: { type: String, default: 'ORDER NOW' },
  secondaryCtaText: { type: String, default: 'VIEW MENU' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const HeroSlide = mongoose.model('HeroSlide', HeroSlideSchema);
