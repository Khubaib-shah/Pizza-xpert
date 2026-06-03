import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountBadge: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  dealPrice: { type: Number, required: true },
  endsInSeconds: { type: Number, required: true },
  isLimited: { type: Boolean, default: false }
}, { timestamps: true });

export const Deal = mongoose.model('Deal', DealSchema);
