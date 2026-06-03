import express from 'express';
import { getAllStaff, createStaff } from '../controllers/staff.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();
router.get('/', authMiddleware, getAllStaff);
router.post('/', authMiddleware, createStaff);

export default router;
