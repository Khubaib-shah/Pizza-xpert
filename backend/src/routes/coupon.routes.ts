import express from 'express';
import { getAllCoupons, createCoupon } from '../controllers/coupon.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();
router.get('/', authMiddleware, getAllCoupons);
router.post('/', authMiddleware, createCoupon);

export default router;
