import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. 'cozy-deal', 'family-feast'
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  tagline: { type: String, default: '' },
  items: [{ type: String }],           // combo bullet items shown under title
  backgroundImg: { type: String, required: true },
  badgeTopLine: { type: String, default: '' },
  badgePriceLine: { type: String, default: '' },
  badgeBottomLine: { type: String, default: '' },
  ctaLabel: { type: String, default: 'Order Now' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const HeroSlide = mongoose.model('HeroSlide', HeroSlideSchema);
