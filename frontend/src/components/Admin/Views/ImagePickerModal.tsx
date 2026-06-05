import React, { useState, useRef } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { Image as ImageIcon, Folder, Upload, Plus, Loader2 } from 'lucide-react';
import { uploadMedia } from '../../../services/api';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: any[];
  onSelect: (url: string) => void;
  title?: string;
  onUploadSuccess?: (img: any) => void;
}

export default function ImagePickerModal({ isOpen, onClose, gallery, onSelect, title = 'Select Image from Gallery', onUploadSuccess }: ImagePickerModalProps) {
  const [selectedFolder, setSelectedFolder] = useState('pizza-xpert/general');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseFolders = [
    'pizza-xpert/general',
    'pizza-xpert/products',
    'pizza-xpert/deals',
    'pizza-xpert/hero',
  ];

  const galleryFolders = Array.from(new Set(gallery.map(img => img.folder).filter(Boolean)));
  const folders = Array.from(new Set([...baseFolders, ...galleryFolders, ...customFolders]));

  const filteredGallery = gallery.filter(img => img.folder === selectedFolder);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const folderPath = newFolderName.trim().includes('/') ? newFolderName.trim() : `pizza-xpert/${newFolderName.trim()}`;
      setCustomFolders(prev => [...prev, folderPath]);
      setSelectedFolder(folderPath);
    }
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', selectedFolder);

    setUploading(true);
    try {
      const res = await uploadMedia(formData);
      if (onUploadSuccess) onUploadSuccess(res.data);
      // Auto-select the newly uploaded image!
      onSelect(res.data.url);
      onClose();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="2xl">
      <div className="flex flex-col h-[60vh]">
        {/* Folders */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar flex-shrink-0">
          {folders.map(folder => (
            <Button 
              key={folder}
              variant={selectedFolder === folder ? 'primary' : 'secondary'} 
              onClick={() => setSelectedFolder(folder)}
              className='text-xs'
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.split('/').pop()}
            </Button>
          ))}
          {isAddingFolder ? (
            <div className="flex items-center gap-2 bg-charcoal-dark border border-cheese/50 rounded-lg px-2 min-w-[150px]">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
                onBlur={handleAddFolder}
                placeholder="Folder name..."
                className="w-full bg-transparent text-xs text-white placeholder-cream/40 focus:outline-none"
              />
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setIsAddingFolder(true)} className="border-dashed border-white/20 text-cream/60 hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-charcoal rounded-xl border border-charcoal-border p-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {filteredGallery.map(img => (
              <div 
                key={img._id} 
                onClick={() => {
                  onSelect(img.url);
                  onClose();
                }}
                className="group relative bg-charcoal-black border border-charcoal-border rounded-xl overflow-hidden hover:border-cheese cursor-pointer transition-all aspect-square"
              >
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-cheese text-black text-[10px] font-medium px-2 py-1 rounded uppercase">Select</span>
                </div>
              </div>
            ))}

            {filteredGallery.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-cream/40">
                <ImageIcon className="w-12 h-12 mb-3" />
                <p className="text-sm">No images found in this folder.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 flex justify-between items-center flex-shrink-0">
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload to {selectedFolder === 'all' ? 'general' : selectedFolder.split('/').pop()}
            </Button>
          </div>
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
