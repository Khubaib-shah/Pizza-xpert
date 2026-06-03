import mongoose from 'mongoose';

const PizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true }, // 'signature' | 'loaded' | 'spicy' | 'veg' | 'classic'
  isVeg: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  cookingTime: { type: String, default: '15-20 min' },
  tags: [{ type: String }],
});

export const Pizza = mongoose.model('Pizza', PizzaSchema);
