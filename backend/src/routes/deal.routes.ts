import express from 'express';
import {
  getAllDeals,
  getAllDealsAdmin,
  createDeal,
  updateDeal,
  deleteDeal,
} from '../controllers/deal.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

router.get('/', getAllDeals);                              // public
router.get('/admin', authMiddleware, getAllDealsAdmin);    // admin
router.post('/', authMiddleware, createDeal);
router.put('/:id', authMiddleware, updateDeal);
router.delete('/:id', authMiddleware, deleteDeal);

export default router;
