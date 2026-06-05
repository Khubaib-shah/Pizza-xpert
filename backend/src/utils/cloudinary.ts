import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder from request body, default to "pizza-xpert"
    const folderName = req.body.folder || 'pizza-xpert/general';
    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };
