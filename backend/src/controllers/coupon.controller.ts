import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.model.js';

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon' });
  }
};
