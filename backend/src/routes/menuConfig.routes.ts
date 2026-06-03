import express from 'express';
import { getMenuConfig, updateMenuConfig } from '../controllers/menuConfig.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

router.get('/', getMenuConfig);                              // public
router.put('/', authMiddleware, updateMenuConfig);           // admin only

export default router;
