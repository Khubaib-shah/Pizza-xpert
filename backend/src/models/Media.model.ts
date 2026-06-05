import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true, unique: true },
  folder: { type: String, default: 'general' }, // e.g. 'products', 'deals', 'hero'
  filename: { type: String },
  format: { type: String },
  bytes: { type: Number },
}, { timestamps: true });

export const Media = mongoose.model('Media', MediaSchema);
