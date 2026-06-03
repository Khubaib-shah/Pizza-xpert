import { Request, Response } from 'express';
import { Order } from '../models/Order.model.js';
import { Customer } from '../models/Customer.model.js';
import { Staff } from '../models/Staff.model.js';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // Basic aggregation
    const ordersCount = await Order.countDocuments();
    
    // Sum total amounts from all orders
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    
    const activeRiders = await Staff.countDocuments({ role: /Rider/i, status: 'On Duty' });
    const customersCount = await Customer.countDocuments();

    res.json({
      revenue: totalRevenue,
      ordersHandled: ordersCount,
      activeCouriers: activeRiders,
      newSignups: customersCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
