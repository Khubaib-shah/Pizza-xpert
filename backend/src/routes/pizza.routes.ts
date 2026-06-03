import express from 'express';
import { getAllPizzas } from '../controllers/pizza.controller.js';

const router = express.Router();

router.get('/', getAllPizzas);

export default router;
