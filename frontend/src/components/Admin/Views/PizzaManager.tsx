import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { createPizza, updatePizza, deletePizza } from '../../../services/api';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import ConfirmModal from '../../ui/ConfirmModal';
import ImagePickerModal from './ImagePickerModal';

interface PizzaManagerProps {
  adminPizzas: any[];
  setAdminPizzas: React.Dispatch<React.SetStateAction<any[]>>;
  pizzaForm: any;
  setPizzaForm: React.Dispatch<React.SetStateAction<any>>;
  editingPizza: any;
  setEditingPizza: React.Dispatch<React.SetStateAction<any>>;
  showPizzaModal: boolean;
  setShowPizzaModal: (show: boolean) => void;
  categories: any[];
  gallery: any[];
  onUploadSuccess: (img: any) => void;
}

export default function PizzaManager({
  adminPizzas, setAdminPizzas, pizzaForm, setPizzaForm, editingPizza, setEditingPizza, showPizzaModal, setShowPizzaModal, categories, gallery, onUploadSuccess
}: PizzaManagerProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deletePizza(deleteTarget._id);
      setAdminPizzas(prev => prev.filter(p => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-medium text-white uppercase tracking-widest">Pizza Manager</h2>
          <p className="text-xs text-cream/40 mt-1 font-mono">Add, edit, or deactivate menu pizzas</p>
        </div>
        <Button
          onClick={() => { setEditingPizza(null); setPizzaForm({ name: '', tagline: '', description: '', price: '', category: 'spicy', isVeg: false, isSpicy: false, isPopular: false, image: '' }); setShowPizzaModal(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Pizza
        </Button>
      </div>

      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-charcoal-dark border-b border-charcoal-border text-cream/40 uppercase font-medium text-[10px] tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Flags</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-border">
            {adminPizzas.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-cream/30 font-mono">No pizzas found. Seed the database or add one!</td></tr>
            )}
            {adminPizzas.map((pizza: any) => (
              <tr key={pizza._id} className="hover:bg-charcoal-dark/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{pizza.name}</div>
                  <div className="text-cream/40 text-[10px] font-mono mt-0.5">{pizza.tagline}</div>
                </td>
                <td className="p-4">
                  <span className="text-[9px] bg-charcoal-dark border border-white/5 text-cream/60 px-2 py-0.5 rounded-full font-mono uppercase">{pizza.category}</span>
                </td>
                <td className="p-4 text-cheese font-mono font-medium">Rs.{pizza.price}</td>
                <td className="p-4 text-cream/60 font-mono">⭐ {pizza.rating}</td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {pizza.isSpicy && <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-400/20 px-1.5 py-0.5 rounded-full">Spicy</span>}
                    {pizza.isVeg && <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-400/20 px-1.5 py-0.5 rounded-full">Veg</span>}
                    {pizza.isPopular && <span className="text-[8px] bg-cheese/10 text-cheese border border-cheese/20 px-1.5 py-0.5 rounded-full">Popular</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setEditingPizza(pizza); setPizzaForm({ name: pizza.name, tagline: pizza.tagline, description: pizza.description, price: String(pizza.price), category: pizza.category, isVeg: pizza.isVeg, isSpicy: pizza.isSpicy, isPopular: pizza.isPopular, image: pizza.image }); setShowPizzaModal(true); }}
                      className="p-1.5 bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 rounded-lg cursor-pointer transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(pizza)}
                      className="p-1.5 bg-charcoal-dark border border-white/5 text-red-400 hover:border-red-400/40 rounded-lg cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showPizzaModal}
        onClose={() => setShowPizzaModal(false)}
        title={editingPizza ? 'Edit Pizza' : 'Add Pizza'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {[
            { label: 'Pizza Name', key: 'name', placeholder: 'e.g. Tikka Supreme' },
            { label: 'Tagline', key: 'tagline', placeholder: 'e.g. Authentic Karachi flavor' },
            { label: 'Description', key: 'description', placeholder: 'Full description of the pizza' },
            { label: 'Price (Rs.)', key: 'price', placeholder: '1850', type: 'number' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={(pizzaForm as any)[f.key]}
                onChange={e => setPizzaForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Pizza Image</label>
            {pizzaForm.image ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-charcoal-border group bg-charcoal-dark">
                <img src={pizzaForm.image} alt="Pizza" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button type="button" variant="primary" onClick={() => setShowGallery(true)}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Replace Image
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setPizzaForm((prev: any) => ({ ...prev, image: '' }))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-32 rounded-xl border border-dashed border-charcoal-border bg-charcoal-dark flex flex-col items-center justify-center text-cream/40 gap-2 hover:border-cheese hover:text-cheese transition-colors cursor-pointer" 
                onClick={() => setShowGallery(true)}
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs font-mono uppercase tracking-widest mt-1">Select or Upload Image</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Category</label>
            <select
              value={pizzaForm.category}
              onChange={e => setPizzaForm((prev: any) => ({ ...prev, category: e.target.value }))}
              className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cheese font-mono"
            >
              <option value="" disabled>Select Category</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            {[{ label: 'Veg', key: 'isVeg' }, { label: 'Spicy', key: 'isSpicy' }, { label: 'Popular', key: 'isPopular' }].map(f => (
              <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(pizzaForm as any)[f.key]}
                  onChange={e => setPizzaForm((prev: any) => ({ ...prev, [f.key]: e.target.checked }))}
                  className="rounded text-cheese"
                />
                <span className="text-xs text-cream/60 font-mono">{f.label}</span>
              </label>
            ))}
          </div>
          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowPizzaModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={async () => {
                const payload = { ...pizzaForm, price: Number(pizzaForm.price) };
                if (editingPizza) {
                  const res = await updatePizza(editingPizza._id, payload);
                  setAdminPizzas(prev => prev.map(p => p._id === editingPizza._id ? res.data : p));
                } else {
                  const res = await createPizza(payload);
                  setAdminPizzas(prev => [...prev, res.data]);
                }
                setShowPizzaModal(false);
              }}
            >
              <Save className="w-4 h-4 mr-2" /> {editingPizza ? 'Update Pizza' : 'Add Pizza'}
            </Button>
          </div>
        </div>
      </Modal>

      <ImagePickerModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        gallery={gallery}
        onSelect={(url) => setPizzaForm((prev: any) => ({ ...prev, image: url }))}
        onUploadSuccess={onUploadSuccess}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Pizza"
        message={
          <>
            Are you sure you want to delete the pizza <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Pizza"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
