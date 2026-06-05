import React, { useState, useRef } from 'react';
import { Upload, Trash2, Folder, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from '../../ui/Button';
import ConfirmModal from '../../ui/ConfirmModal';
import { uploadMedia, deleteMedia, fetchGallery } from '../../../services/api';

interface GalleryManagerProps {
  gallery: any[];
  setGallery: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function GalleryManager({ gallery, setGallery }: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('pizza-xpert/general');
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = [
    'pizza-xpert/general',
    'pizza-xpert/products',
    'pizza-xpert/deals',
    'pizza-xpert/hero',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setErrorModal({ title: 'Too Many Files', message: 'You can only upload up to 10 images at once.' });
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', selectedFolder);
        return uploadMedia(formData);
      });

      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map(res => res.data);
      setGallery(prev => [...newImages, ...prev]);
    } catch (error) {
      console.error('Upload failed', error);
      setErrorModal({ title: 'Upload Failed', message: 'There was a problem uploading your images. Please try again.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    setDeleting(true);
    try {
      await deleteMedia(imageToDelete);
      setGallery(prev => prev.filter(img => img._id !== imageToDelete));
      setImageToDelete(null);
    } catch (error) {
      console.error('Delete failed', error);
      setErrorModal({ title: 'Delete Failed', message: 'There was a problem deleting this image. Please try again.' });
    } finally {
      setDeleting(false);
    }
  };

  // Group images by folder for display
  const filteredGallery = selectedFolder === 'all' 
    ? gallery 
    : gallery.filter(img => img.folder === selectedFolder);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-charcoal p-4 rounded-2xl border border-charcoal-border">
        <div className="flex gap-2">
          <Button 
            variant={selectedFolder === 'all' ? 'primary' : 'secondary'} 
            onClick={() => setSelectedFolder('all')}
          >
            All Media
          </Button>
          {folders.map(folder => (
            <Button 
              key={folder}
              variant={selectedFolder === folder ? 'primary' : 'secondary'} 
              onClick={() => setSelectedFolder(folder)}
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.split('/')[1]}
            </Button>
          ))}
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
            multiple
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload to {selectedFolder === 'all' ? 'general' : selectedFolder.split('/')[1]}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredGallery.map(img => (
          <div key={img._id} className="group relative bg-charcoal border border-charcoal-border rounded-xl overflow-hidden hover:border-cheese transition-all">
            <div className="aspect-square bg-charcoal-black flex items-center justify-center relative">
              {img.url ? (
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-cream/20" />
              )}
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => window.open(img.url, '_blank')}
                  className="bg-charcoal p-2 rounded-full hover:bg-cheese text-cream hover:text-black transition-colors"
                  title="View Original"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setImageToDelete(img._id)}
                  className="bg-charcoal p-2 rounded-full hover:bg-tomato text-cream transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[10px] font-mono text-cream/70 truncate">{img.filename}</p>
              <p className="text-[9px] text-cream/40 mt-1 uppercase">{img.folder}</p>
            </div>
          </div>
        ))}

        {filteredGallery.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-cream/40 border border-dashed border-charcoal-border rounded-2xl">
            <ImageIcon className="w-12 h-12 mb-3" />
            <p className="text-sm">No images found in this folder.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? It will be permanently removed from Cloudinary."
        confirmText="Yes, delete it"
        cancelText="Keep it"
        type="danger"
        isLoading={deleting}
      />

      <ConfirmModal
        isOpen={!!errorModal}
        onClose={() => setErrorModal(null)}
        onConfirm={() => setErrorModal(null)}
        title={errorModal?.title || 'Error'}
        message={errorModal?.message || ''}
        confirmText="Okay"
        type="warning"
      />
    </div>
  );
}
