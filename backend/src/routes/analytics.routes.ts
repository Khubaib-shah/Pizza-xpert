import express from 'express';
import { getDashboardMetrics } from '../controllers/analytics.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();
router.get('/', authMiddleware, getDashboardMetrics);

export default router;
