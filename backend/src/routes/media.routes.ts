import { Router } from 'express';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/media.controller.js';
import { upload } from '../utils/cloudinary.js';
import { authMiddleware } from './auth.middleware.js';

const router = Router();

// Only authenticated admins can upload or delete media
router.post('/upload', authMiddleware, upload.single('image'), uploadMedia);
router.delete('/:id', authMiddleware, deleteMedia);

// Anyone (or just admins) can fetch the list. Let's keep it public or protected based on use case.
// Since it's for the admin gallery picker, we can protect it, but some might be used publicly if we dynamically load gallery.
router.get('/', getMedia);

export default router;
