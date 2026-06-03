import express from 'express';
import { getAllPizzas, createPizza, updatePizza, deletePizza } from '../controllers/pizza.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

router.get('/', getAllPizzas);                              // public
router.post('/', authMiddleware, createPizza);
router.put('/:id', authMiddleware, updatePizza);
router.delete('/:id', authMiddleware, deletePizza);

export default router;
