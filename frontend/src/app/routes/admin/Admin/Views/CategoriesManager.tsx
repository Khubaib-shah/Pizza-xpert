import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '../../../../../services/api';
import Modal from '../../../../../shared/components/ui/Modal';
import Button from '../../../../../shared/components/ui/Button';
import ConfirmModal from '../../../../../shared/components/ui/ConfirmModal';

interface CategoriesManagerProps {
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  editingCategory: any;
  setEditingCategory: React.Dispatch<React.SetStateAction<any>>;
  categoryForm: any;
  setCategoryForm: React.Dispatch<React.SetStateAction<any>>;
  showCategoryModal: boolean;
  setShowCategoryModal: (show: boolean) => void;
}

export default function CategoriesManager({
  categories, setCategories, editingCategory, setEditingCategory, categoryForm, setCategoryForm, showCategoryModal, setShowCategoryModal
}: CategoriesManagerProps) {
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget._id);
      setCategories(prev => prev.filter(c => c._id !== deleteTarget._id));
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
          <h2 className="text-lg font-display font-medium text-white uppercase tracking-widest">Categories</h2>
          <p className="text-xs text-cream/40 mt-1 font-mono">Add, edit, or remove menu categories</p>
        </div>
        <Button
          onClick={() => { setEditingCategory(null); setCategoryForm({ slug: '', name: '', iconName: 'Flame', order: 0 }); setShowCategoryModal(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-charcoal-dark border-b border-charcoal-border text-cream/40 uppercase font-medium text-[10px] tracking-wider">
              <th className="p-4">Order</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Name</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Items</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-border">
            {categories.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-cream/30 font-mono">No categories found.</td></tr>
            )}
            {categories.map((cat: any) => (
              <tr key={cat._id} className="hover:bg-charcoal-dark/50 transition-colors">
                <td className="p-4 font-mono text-cream/50">{cat.order}</td>
                <td className="p-4 font-mono text-cheese font-medium">{cat.slug}</td>
                <td className="p-4 text-white font-medium uppercase">{cat.name}</td>
                <td className="p-4 text-cream/60 font-mono text-[10px]">{cat.iconName}</td>
                <td className="p-4 text-cream/60">{cat.itemCount}</td>
                <td className="p-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium border ${cat.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setEditingCategory(cat); setCategoryForm({ slug: cat.slug, name: cat.name, iconName: cat.iconName, order: cat.order }); setShowCategoryModal(true); }}
                      className="p-1.5 bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 rounded-lg cursor-pointer transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
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
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        maxWidth="md"
      >
        <div className="space-y-4">
          {[
            { label: 'Slug (unique ID)', key: 'slug', placeholder: 'e.g. spicy' },
            { label: 'Display Name', key: 'name', placeholder: 'e.g. SPICY FIRE' },
            { label: 'Lucide Icon Name', key: 'iconName', placeholder: 'e.g. Flame, Leaf, Layers' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">{f.label}</label>
              <input
                type="text"
                value={(categoryForm as any)[f.key]}
                onChange={e => setCategoryForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Display Order</label>
            <input
              type="number"
              value={categoryForm.order}
              onChange={e => setCategoryForm((prev: any) => ({ ...prev, order: Number(e.target.value) }))}
              className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cheese font-mono"
            />
          </div>
          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={async () => {
                if (editingCategory) {
                  const res = await updateCategory(editingCategory._id, categoryForm);
                  setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data : c));
                } else {
                  const res = await createCategory(categoryForm);
                  setCategories(prev => [...prev, res.data]);
                }
                setShowCategoryModal(false);
              }}
            >
              <Save className="w-4 h-4 mr-2" /> {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete the category <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Category"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
