import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { authMiddleware } from './auth.middleware.js';
import { validate, orderSchema } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/', validate(orderSchema), createOrder);
router.get('/', authMiddleware, getAllOrders);
router.patch('/:id/stage', authMiddleware, updateOrderStatus);

export default router;
