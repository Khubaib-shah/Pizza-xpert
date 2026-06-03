import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  avatarInitials: { type: String, required: true },
  avatarColor: { type: String, required: true },
  rating: { type: Number, required: true },
  quote: { type: String, required: true }
}, { timestamps: true });

export const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
