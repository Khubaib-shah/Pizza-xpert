import { Request, Response } from 'express';
import { Order } from '../models/Order.model.js';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const newOrder = new Order({
      ...orderData,
      stage: 'placed',
      deliveryTimeRemaining: 45 * 60 // 45 mins in seconds
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { stage } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { stage }, { new: true });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
};
