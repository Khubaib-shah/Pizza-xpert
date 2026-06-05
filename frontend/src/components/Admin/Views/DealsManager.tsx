import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, DollarSign, Save, ToggleRight, ToggleLeft, Image as ImageIcon } from 'lucide-react';
import { createDeal, updateDeal, deleteDeal } from '../../../services/api';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import ConfirmModal from '../../ui/ConfirmModal';
import ImagePickerModal from './ImagePickerModal';

interface DealsManagerProps {
  adminDeals: any[];
  setAdminDeals: React.Dispatch<React.SetStateAction<any[]>>;
  dealForm: any;
  setDealForm: React.Dispatch<React.SetStateAction<any>>;
  editingDeal: any;
  setEditingDeal: React.Dispatch<React.SetStateAction<any>>;
  showDealModal: boolean;
  setShowDealModal: (show: boolean) => void;
  gallery: any[];
  onUploadSuccess: (img: any) => void;
}

export default function DealsManager({
  adminDeals, setAdminDeals, dealForm, setDealForm, editingDeal, setEditingDeal, showDealModal, setShowDealModal, gallery, onUploadSuccess
}: DealsManagerProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDeal(deleteTarget._id);
      setAdminDeals(prev => prev.filter(d => d._id !== deleteTarget._id));
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
          <h2 className="text-lg font-display font-medium text-white uppercase tracking-widest">Popular Deals</h2>
          <p className="text-xs text-cream/40 mt-1 font-mono">Manage the deals shown on the homepage</p>
        </div>
        <Button
          onClick={() => { setEditingDeal(null); setDealForm({ title: '', discountBadge: '', description: '', originalPrice: '', dealPrice: '', validUntil: '', isLimited: false, isActive: true, image: '' }); setShowDealModal(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {adminDeals.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-charcoal border border-charcoal-border rounded-2xl">
            <DollarSign className="w-8 h-8 text-cream/20 mx-auto mb-3" />
            <p className="text-cream/40 font-mono text-sm">No deals yet. Create your first deal!</p>
          </div>
        )}
        {adminDeals.map((deal: any) => (
          <div key={deal._id} className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden hover:border-cheese/40 transition-all flex flex-col">
            {deal.image && (
              <div className="h-32 w-full bg-charcoal-dark overflow-hidden">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono font-medium bg-burgundy/30 text-cheese px-2 py-0.5 rounded-full border border-cheese/20">{deal.discountBadge}</span>
                  <h3 className="font-display font-medium text-white uppercase text-sm mt-2">{deal.title}</h3>
                </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium border shrink-0 ${deal.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {deal.isActive ? 'Active' : 'Off'}
              </span>
            </div>
            <p className="text-xs text-cream/50 font-sans leading-relaxed">{deal.description}</p>
            <div className="flex items-center gap-3 pt-1">
              <div className="text-cream/30 text-xs line-through font-mono">Rs.{deal.originalPrice}</div>
              <div className="text-cheese font-display text-xl font-medium">Rs.{deal.dealPrice}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setEditingDeal(deal); setDealForm({ title: deal.title, discountBadge: deal.discountBadge, description: deal.description, originalPrice: String(deal.originalPrice), dealPrice: String(deal.dealPrice), validUntil: deal.validUntil ? new Date(deal.validUntil).toISOString().slice(0, 16) : '', isLimited: deal.isLimited, isActive: deal.isActive, image: deal.image || '' }); setShowDealModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 text-[10px] font-medium uppercase py-2 rounded-lg transition-all cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => setDeleteTarget(deal)}
                className="p-2 bg-charcoal-dark border border-white/5 text-red-400 hover:border-red-400/40 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        title={editingDeal ? 'Edit Deal' : 'Create Deal'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {[
            { label: 'Deal Title', key: 'title', placeholder: 'e.g. COZY DEAL' },
            { label: 'Discount Badge', key: 'discountBadge', placeholder: 'e.g. 50% OFF or BEST VALUE' },
            { label: 'Description', key: 'description', placeholder: 'What does this deal include? (New lines will be preserved)', type: 'textarea' },
            { label: 'Original Price (Rs.)', key: 'originalPrice', placeholder: '3500', type: 'number' },
            { label: 'Deal Price (Rs.)', key: 'dealPrice', placeholder: '1650', type: 'number' },
            { label: 'Valid Until', key: 'validUntil', placeholder: '', type: 'datetime-local' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={(dealForm as any)[f.key]}
                  onChange={e => setDealForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono"
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={(dealForm as any)[f.key]}
                  onChange={e => setDealForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono"
                />
              )}
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Deal Image</label>
            {dealForm.image ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-charcoal-border group bg-charcoal-dark">
                <img src={dealForm.image} alt="Deal" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button type="button" variant="primary" onClick={() => setShowGallery(true)}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Replace Image
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setDealForm((prev: any) => ({ ...prev, image: '' }))}>
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
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Active</label>
            <button onClick={() => setDealForm((prev: any) => ({ ...prev, isActive: !prev.isActive }))} className={`text-xs font-medium cursor-pointer ${dealForm.isActive ? 'text-emerald-400' : 'text-cream/30'}`}>
              {dealForm.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
          </div>
          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDealModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={async () => {
                const payload = { ...dealForm, originalPrice: Number(dealForm.originalPrice), dealPrice: Number(dealForm.dealPrice) };
                if (editingDeal) {
                  const res = await updateDeal(editingDeal._id, payload);
                  setAdminDeals(prev => prev.map(d => d._id === editingDeal._id ? res.data : d));
                } else {
                  const res = await createDeal(payload);
                  setAdminDeals(prev => [...prev, res.data]);
                }
                setShowDealModal(false);
              }}
            >
              <Save className="w-4 h-4 mr-2" /> {editingDeal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </div>
      </Modal>

      <ImagePickerModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        gallery={gallery}
        onSelect={(url) => setDealForm((prev: any) => ({ ...prev, image: url }))}
        onUploadSuccess={onUploadSuccess}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message={
          <>
            Are you sure you want to delete the deal <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Deal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
