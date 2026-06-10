import { Request, Response } from 'express';
import { Media } from '../models/Media.model.js';
import { cloudinary } from '../utils/cloudinary.js';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file as any;
    console.log('Uploaded File:', file);
    
    // Create Media record
    const media = await Media.create({
      url: file.path,
      publicId: file.filename,
      folder: req.body.folder || 'pizza-xpert/general',
      filename: file.originalname,
      format: file.mimetype,
      bytes: file.size || 0, // Fallback in case size is undefined
    });

    res.status(201).json(media);
  } catch (error: any) {
    console.error('Upload Error Details:', error);
    res.status(500).json({ message: 'Error uploading media: ' + (error.message || JSON.stringify(error)) });
  }
};

export const getMedia = async (req: Request, res: Response) => {
  try {
    const folder = req.query.folder as string | undefined;
    const filter = folder ? { folder } : {};
    
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media' });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    
    if (!media) {
      res.status(404).json({ message: 'Media not found' });
      return;
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);
    
    // Delete from DB
    await Media.findByIdAndDelete(id);

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media' });
  }
};
