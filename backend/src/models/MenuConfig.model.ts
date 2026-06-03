import mongoose from 'mongoose';

// Stores all customization options for the pizza order flow
const MenuConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'default' },

  toppings: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
  }],

  sizes: [{
    name: { type: String, required: true },   // e.g. 'Personal (8")'
    priceModifier: { type: Number, default: 0 }, // negative = cheaper, positive = more expensive
    isAvailable: { type: Boolean, default: true },
  }],

  crusts: [{
    name: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  }],

  sauces: [{
    name: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  }],

  extraCheesePrice: { type: Number, default: 2.00 },

}, { timestamps: true });

export const MenuConfig = mongoose.model('MenuConfig', MenuConfigSchema);
