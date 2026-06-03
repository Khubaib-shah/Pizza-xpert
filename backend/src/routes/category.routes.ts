import express from 'express';
import {
  getAllCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

router.get('/', getAllCategories);                                // public
router.get('/admin', authMiddleware, getAllCategoriesAdmin);      // admin
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
