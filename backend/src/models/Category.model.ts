import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g. 'all', 'veg', 'spicy'
  name: { type: String, required: true },
  iconName: { type: String, required: true },
  itemCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = mongoose.model('Category', CategorySchema);
