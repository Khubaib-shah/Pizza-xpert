import express from 'express';
import { getLandingContent } from '../controllers/content.controller.js';

const router = express.Router();
router.get('/', getLandingContent);

export default router;
