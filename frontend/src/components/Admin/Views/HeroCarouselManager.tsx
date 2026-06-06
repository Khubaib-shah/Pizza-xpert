import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Edit2, Trash2, X, ToggleRight, ToggleLeft, Save } from 'lucide-react';
import { createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../../../services/api';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import ConfirmModal from '../../ui/ConfirmModal';
import ImagePickerModal from './ImagePickerModal';

interface HeroCarouselManagerProps {
  heroSlides: any[];
  setHeroSlides: React.Dispatch<React.SetStateAction<any[]>>;
  editingSlide: any;
  setEditingSlide: React.Dispatch<React.SetStateAction<any>>;
  slideForm: any;
  setSlideForm: React.Dispatch<React.SetStateAction<any>>;
  showSlideModal: boolean;
  setShowSlideModal: (show: boolean) => void;
  gallery: any[];
  onUploadSuccess: (img: any) => void;
}

export default function HeroCarouselManager({
  heroSlides, setHeroSlides, editingSlide, setEditingSlide, slideForm, setSlideForm, showSlideModal, setShowSlideModal, gallery, onUploadSuccess
}: HeroCarouselManagerProps) {
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteHeroSlide(deleteTarget._id);
      setHeroSlides(prev => prev.filter(s => s._id !== deleteTarget._id));
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
          <h2 className="text-lg font-display font-medium text-white uppercase tracking-widest">Hero Carousel Slides</h2>
          <p className="text-xs text-cream/40 mt-1 font-mono">Manage the slides shown on the homepage hero section</p>
        </div>
        <Button
          onClick={() => {
            setEditingSlide(null);
            setSlideForm({ id: '', title: '', subtitle: '', tagline: '', items: '', backgroundImg: '', ctaLabel: 'Order Now', isActive: true, order: 0, badgeTopLine: '', badgePriceLine: '', badgeBottomLine: '' });
            setShowSlideModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {heroSlides.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-charcoal border border-charcoal-border rounded-2xl">
            <ImageIcon className="w-8 h-8 text-cream/20 mx-auto mb-3" />
            <p className="text-cream/40 font-mono text-sm">No slides yet. Add your first hero slide!</p>
          </div>
        )}
        {heroSlides.map((slide: any) => (
          <div key={slide._id} className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden group hover:border-cheese/40 transition-all">
            <div className="relative h-36 bg-charcoal-dark">
              {slide.backgroundImg ? (
                <img src={slide.backgroundImg} alt={slide.title} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-cream/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <div className="text-[9px] font-mono text-cheese uppercase font-medium">{slide.tagline}</div>
                <div className="text-sm font-display font-medium text-white uppercase">{slide.title}</div>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium ${slide.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {slide.isActive ? 'LIVE' : 'HIDDEN'}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs text-cream/50 font-mono">{slide.subtitle}</div>
              <div className="flex flex-wrap gap-1">
                {(slide.items || []).slice(0, 3).map((item: string, i: number) => (
                  <span key={i} className="text-[9px] bg-charcoal-dark text-cream/60 px-2 py-0.5 rounded-full border border-white/5">{item}</span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setEditingSlide(slide);
                    setSlideForm({ ...slide, items: (slide.items || []).join(', ') });
                    setShowSlideModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 text-[10px] font-medium uppercase py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(slide)}
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
        isOpen={showSlideModal}
        onClose={() => setShowSlideModal(false)}
        title={editingSlide ? 'Edit Slide' : 'Add New Slide'}
        maxWidth="xl"
      >
        <div className="space-y-4">
          {[
            { label: 'Slide ID (slug)', key: 'id', placeholder: 'e.g. cozy-deal' },
            { label: 'Main Title', key: 'title', placeholder: 'e.g. 2 Jumbo Pizzas' },
            { label: 'Subtitle', key: 'subtitle', placeholder: 'e.g. Cozy Night Deal' },
            { label: 'Top Tagline', key: 'tagline', placeholder: 'e.g. 🔥 LIMITED OFFER' },
            { label: 'CTA Button Label', key: 'ctaLabel', placeholder: 'e.g. Order Now' },
            { label: 'Badge Top Line', key: 'badgeTopLine', placeholder: 'e.g. TOP SELLING' },
            { label: 'Badge Price', key: 'badgePriceLine', placeholder: 'e.g. Rs.1650' },
            { label: 'Badge Bottom Line', key: 'badgeBottomLine', placeholder: 'e.g. DEAL' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">{f.label}</label>
              <input
                type="text"
                value={(slideForm as any)[f.key]}
                onChange={e => setSlideForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Background Image</label>
            {slideForm.backgroundImg ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-charcoal-border group bg-charcoal-dark">
                <img src={slideForm.backgroundImg} alt="Slide" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button type="button" variant="primary" onClick={() => setShowGallery(true)}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Replace Image
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setSlideForm((prev: any) => ({ ...prev, backgroundImg: '' }))}>
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
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Combo Items (comma-separated)</label>
            <textarea
              value={slideForm.items}
              onChange={e => setSlideForm((prev: any) => ({ ...prev, items: e.target.value }))}
              placeholder="2 Jumbo Pizzas, Free Chilled Soda, 3 Garlic Dips"
              rows={2}
              className="w-full bg-charcoal-dark border border-charcoal-border rounded-lg px-3 py-2.5 text-xs text-white placeholder-cream/20 focus:outline-none focus:border-cheese font-mono resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-medium text-cream/40 uppercase">Active / Visible</label>
            <button
              onClick={() => setSlideForm((prev: any) => ({ ...prev, isActive: !prev.isActive }))}
              className={`flex items-center gap-2 text-xs font-medium cursor-pointer ${slideForm.isActive ? 'text-emerald-400' : 'text-cream/30'}`}
            >
              {slideForm.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              {slideForm.isActive ? 'Live' : 'Hidden'}
            </button>
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowSlideModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={async () => {
                const payload = { ...slideForm, items: slideForm.items.split(',').map((s: string) => s.trim()).filter(Boolean) };
                if (editingSlide) {
                  const res = await updateHeroSlide(editingSlide._id, payload);
                  setHeroSlides(prev => prev.map(s => s._id === editingSlide._id ? res.data : s));
                } else {
                  const res = await createHeroSlide(payload);
                  setHeroSlides(prev => [...prev, res.data]);
                }
                setShowSlideModal(false);
              }}
            >
              <Save className="w-4 h-4 mr-2" /> {editingSlide ? 'Update Slide' : 'Add Slide'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Slide"
        message={
          <>
            Are you sure you want to delete the slide <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Slide"
        type="danger"
        isLoading={isDeleting}
      />

      <ImagePickerModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        gallery={gallery}
        onSelect={(url) => setSlideForm((prev: any) => ({ ...prev, backgroundImg: url }))}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
}
