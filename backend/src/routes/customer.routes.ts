import express from 'express';
import { getAllCustomers } from '../controllers/customer.controller.js';
import { authMiddleware } from './auth.middleware.js'; // I will create this

const router = express.Router();
router.get('/', authMiddleware, getAllCustomers);

export default router;
