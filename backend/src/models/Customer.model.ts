import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  ordersCount: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  tier: { type: String, enum: ['New', 'Standard', 'Returning', 'VIP'], default: 'New' },
  status: { type: String, enum: ['Active', 'Inactive', 'Banned'], default: 'Active' }
}, { timestamps: true });

export const Customer = mongoose.model('Customer', CustomerSchema);
