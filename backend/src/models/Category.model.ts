import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconName: { type: String, required: true },
  itemCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.model('Category', CategorySchema);
