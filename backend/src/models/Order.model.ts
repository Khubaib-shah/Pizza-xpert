import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
  pizzaName: { type: String, required: true },
  quantity: { type: Number, required: true },
  customization: {
    size: { type: String, required: true },
    crust: { type: String, required: true },
    sauce: { type: String, required: true },
    extraCheese: { type: Boolean, default: false },
    extraToppings: [{ type: String }]
  },
  pricePerItem: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  items: [OrderItemSchema],
  paymentMethod: { type: String, default: 'COD' },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  stage: { 
    type: String, 
    enum: ['placed', 'preparing', 'baking', 'quality-check', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  rider: { type: String, default: 'Unassigned' },
  deliveryTimeRemaining: { type: Number, default: 2700 }, // 45 mins in seconds
}, { timestamps: true });

export const Order = mongoose.model('Order', OrderSchema);
