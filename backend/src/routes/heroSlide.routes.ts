import express from 'express';
import { getAllSlides, getAllSlidesAdmin, createSlide, updateSlide, deleteSlide } from '../controllers/heroSlide.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

router.get('/', getAllSlides);                                     // public
router.get('/admin', authMiddleware, getAllSlidesAdmin);            // admin
router.post('/', authMiddleware, createSlide);
router.put('/:id', authMiddleware, updateSlide);
router.delete('/:id', authMiddleware, deleteSlide);

export default router;
