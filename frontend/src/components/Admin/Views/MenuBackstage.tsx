import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import TextInput from '../../form/TextInput';
import ImagePickerModal from './ImagePickerModal';

interface MenuBackstageProps {
  menuItems: any[];
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
  showAddMenuModal: boolean;
  setShowAddMenuModal: (show: boolean) => void;
  newMenuItem: any;
  setNewMenuItem: React.Dispatch<React.SetStateAction<any>>;
  gallery: any[];
  categories: any[];
}

export default function MenuBackstage({
  menuItems, setMenuItems, showAddMenuModal, setShowAddMenuModal, newMenuItem, setNewMenuItem, gallery, categories
}: MenuBackstageProps) {
  const [showGallery, setShowGallery] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center">
        <span className="text-xs uppercase text-cream/50 tracking-w">Tweak your public recipes metadata</span>
        <Button onClick={() => setShowAddMenuModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Custom Recipe
        </Button>
      </div>

      {/* Grid lists */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden hover:border-cheese/30 transition-all flex flex-col justify-between">
            <div className="relative h-44 w-full bg-charcoal-black">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 right-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-cheese">
                {item.category.toUpperCase()}
              </span>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-medium text-white leading-tight">{item.name}</h4>
                <p className="text-[11px] text-cream/50 mt-1.5 leading-tight">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-charcoal-border flex justify-between items-center">
                <span className="text-sm font-mono font-medium text-cheese">Rs{item.price}</span>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] uppercase font-mono text-cream/40 font-medium">In Stock</label>
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => {
                      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, active: !m.active } : m));
                    }}
                    className="w-4 h-4 rounded text-cheese focus:ring-0 bg-charcoal-800"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD DIALOG MODAL */}
      <Modal 
        isOpen={showAddMenuModal} 
        onClose={() => setShowAddMenuModal(false)}
        title="CREATOR: BACKSTAGE PIZZA BUILDER"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-3 text-xs">
            <TextInput
              label="Pizza Name"
              name="pizzaName"
              placeholder="e.g. Sizzling Goat Cheese Extreme"
              value={newMenuItem.name}
              onChange={val => setNewMenuItem((prev: any) => ({ ...prev, name: val }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Price (INR)"
                name="pizzaPrice"
                type="number"
                placeholder="650"
                value={newMenuItem.price}
                onChange={val => setNewMenuItem((prev: any) => ({ ...prev, price: val }))}
              />
              <div className="space-y-1">
                <label className="text-cream/40 uppercase font-mono tracking-widest text-[11px]">Category</label>
                <select
                  value={newMenuItem.category}
                  onChange={e => setNewMenuItem((prev: any) => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono tracking-widest text-[11px]">Recipe Description</label>
              <textarea
                placeholder="Short tagline ingredients..."
                rows={2}
                value={newMenuItem.desc}
                onChange={e => setNewMenuItem((prev: any) => ({ ...prev, desc: e.target.value }))}
                className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono tracking-widest text-[11px]">Image</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white text-xs truncate">
                  {newMenuItem.image || 'No image selected'}
                </div>
                <Button variant="secondary" onClick={() => setShowGallery(true)}>
                  Select Image
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowAddMenuModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (newMenuItem.name && newMenuItem.price) {
                  setMenuItems(prev => [...prev, {
                    id: String(prev.length + 1),
                    name: newMenuItem.name,
                    category: newMenuItem.category,
                    price: Number(newMenuItem.price),
                    desc: newMenuItem.desc || 'Rich custom oven craft',
                    image: newMenuItem.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                    active: true
                  }]);
                  setShowAddMenuModal(false);
                  setNewMenuItem({ name: '', price: '', category: 'classic', desc: '', image: '' });
                }
              }}
            >
              Save Recipe
            </Button>
          </div>
        </div>
      </Modal>

      <ImagePickerModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        gallery={gallery}
        onSelect={(url) => setNewMenuItem((prev: any) => ({ ...prev, image: url }))}
      />
    </div>
  );
}
