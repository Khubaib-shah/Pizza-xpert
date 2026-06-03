import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['On Duty', 'Off Duty', 'On Leave'], default: 'On Duty' },
  ordersHandledToday: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export const Staff = mongoose.model('Staff', StaffSchema);
