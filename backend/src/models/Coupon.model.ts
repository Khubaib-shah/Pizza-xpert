import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountValue: { type: Number, required: true },
  discountType: { type: String, enum: ['Percentage', 'Flat'], required: true },
  minOrderAmount: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Disabled'], default: 'Active' }
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', CouponSchema);
