import React from 'react';
import { Save, RefreshCw, Plus, X } from 'lucide-react';
import { updateMenuConfig } from '../../../../../services/api';
import Button from '../../../../../shared/components/ui/Button';
import { useToastStore } from '../../../../../shared/hooks/useToastStore';

interface MenuConfigManagerProps {
  menuConfigDraft: any;
  setMenuConfigDraft: React.Dispatch<React.SetStateAction<any>>;
  setMenuConfig: React.Dispatch<React.SetStateAction<any>>;
  savingMenuConfig: boolean;
  setSavingMenuConfig: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuConfigManager({
  menuConfigDraft, setMenuConfigDraft, setMenuConfig, savingMenuConfig, setSavingMenuConfig
}: MenuConfigManagerProps) {
  const showNotification = useToastStore(state => state.showNotification);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-medium text-white uppercase tracking-widest">Toppings & Menu Config</h2>
          <p className="text-xs text-cream/40 mt-1 font-mono">Manage toppings, sizes, crusts, sauces & pricing</p>
        </div>
        <Button
          onClick={async () => {
            if (!menuConfigDraft) return;
            setSavingMenuConfig(true);
            const res = await updateMenuConfig(menuConfigDraft);
            setMenuConfig(res.data);
            setMenuConfigDraft(res.data);
            setSavingMenuConfig(false);
            showNotification('Menu config saved!');
          }}
          disabled={savingMenuConfig}
          variant="primary"
        >
          <Save className="w-4 h-4 mr-2" /> {savingMenuConfig ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {!menuConfigDraft ? (
        <div className="bg-charcoal border border-charcoal-border rounded-2xl p-10 text-center">
          <RefreshCw className="w-8 h-8 text-cream/20 mx-auto mb-3 animate-spin" />
          <p className="text-cream/40 font-mono text-sm">Loading config...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Toppings */}
          <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-medium text-cream/60 uppercase tracking-widest">Toppings ({menuConfigDraft.toppings?.length || 0})</h3>
              <button
                onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, toppings: [...(prev.toppings || []), { name: 'New Topping', price: 100, isAvailable: true }] }))}
                className="text-[10px] bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 px-2 py-1 rounded-lg font-medium uppercase cursor-pointer"
              >
                <Plus className="w-3 h-3 inline" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(menuConfigDraft.toppings || []).map((topping: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-charcoal-dark border border-white/5 rounded-xl p-2.5">
                  <input
                    type="text"
                    value={topping.name}
                    onChange={e => {
                      const t = [...menuConfigDraft.toppings];
                      t[i] = { ...t[i], name: e.target.value };
                      setMenuConfigDraft((prev: any) => ({ ...prev, toppings: t }));
                    }}
                    className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none min-w-0"
                  />
                  <span className="text-cream/30 font-mono text-[10px]">Rs.</span>
                  <input
                    type="number"
                    value={topping.price}
                    onChange={e => {
                      const t = [...menuConfigDraft.toppings];
                      t[i] = { ...t[i], price: Number(e.target.value) };
                      setMenuConfigDraft((prev: any) => ({ ...prev, toppings: t }));
                    }}
                    className="w-16 bg-transparent text-xs text-cheese font-mono text-right focus:outline-none"
                  />
                  <button
                    onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, toppings: prev.toppings.filter((_: any, idx: number) => idx !== i) }))}
                    className="text-red-400/50 hover:text-red-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-cream/40 font-mono">Extra Cheese (base price)</span>
              <div className="flex items-center gap-1">
                <span className="text-cream/30 font-mono">Rs.</span>
                <input
                  type="number"
                  value={menuConfigDraft.extraCheesePrice || 200}
                  onChange={e => setMenuConfigDraft((prev: any) => ({ ...prev, extraCheesePrice: Number(e.target.value) }))}
                  className="w-16 bg-charcoal-dark border border-white/5 rounded-lg px-2 py-1 text-cheese font-mono text-xs text-right focus:outline-none focus:border-cheese"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-medium text-cream/60 uppercase tracking-widest">Sizes</h3>
            <div className="space-y-2">
              {(menuConfigDraft.sizes || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-charcoal-dark border border-white/5 rounded-xl p-2.5">
                  <input
                    type="text"
                    value={s.name}
                    onChange={e => { const arr = [...menuConfigDraft.sizes]; arr[i] = { ...arr[i], name: e.target.value }; setMenuConfigDraft((prev: any) => ({ ...prev, sizes: arr })); }}
                    className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                  <span className="text-cream/30 font-mono text-[10px]">±Rs.</span>
                  <input
                    type="number"
                    value={s.priceModifier}
                    onChange={e => { const arr = [...menuConfigDraft.sizes]; arr[i] = { ...arr[i], priceModifier: Number(e.target.value) }; setMenuConfigDraft((prev: any) => ({ ...prev, sizes: arr })); }}
                    className="w-20 bg-transparent text-xs text-cheese font-mono text-right focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Crusts */}
          <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-medium text-cream/60 uppercase tracking-widest">Crusts</h3>
              <button
                onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, crusts: [...(prev.crusts || []), { name: 'New Crust', priceModifier: 0, isPremium: false, isRecommended: false, isAvailable: true }] }))}
                className="text-[10px] bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 px-2 py-1 rounded-lg font-medium uppercase cursor-pointer"
              >
                <Plus className="w-3 h-3 inline" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(menuConfigDraft.crusts || []).map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-charcoal-dark border border-white/5 rounded-xl p-2.5">
                  <input
                    type="text"
                    value={c.name}
                    onChange={e => { const arr = [...menuConfigDraft.crusts]; arr[i] = { ...arr[i], name: e.target.value }; setMenuConfigDraft((prev: any) => ({ ...prev, crusts: arr })); }}
                    className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                  <span className="text-[9px] text-cream/30">±Rs.</span>
                  <input
                    type="number"
                    value={c.priceModifier}
                    onChange={e => { const arr = [...menuConfigDraft.crusts]; arr[i] = { ...arr[i], priceModifier: Number(e.target.value) }; setMenuConfigDraft((prev: any) => ({ ...prev, crusts: arr })); }}
                    className="w-16 bg-transparent text-xs text-cheese font-mono text-right focus:outline-none"
                  />
                  <button onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, crusts: prev.crusts.filter((_: any, idx: number) => idx !== i) }))} className="text-red-400/50 hover:text-red-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Sauces */}
          <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-medium text-cream/60 uppercase tracking-widest">Sauces</h3>
              <button
                onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, sauces: [...(prev.sauces || []), { name: 'New Sauce', isAvailable: true }] }))}
                className="text-[10px] bg-charcoal-dark border border-white/5 text-cheese hover:border-cheese/40 px-2 py-1 rounded-lg font-medium uppercase cursor-pointer"
              >
                <Plus className="w-3 h-3 inline" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(menuConfigDraft.sauces || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-charcoal-dark border border-white/5 rounded-xl p-2.5">
                  <input
                    type="text"
                    value={s.name}
                    onChange={e => { const arr = [...menuConfigDraft.sauces]; arr[i] = { ...arr[i], name: e.target.value }; setMenuConfigDraft((prev: any) => ({ ...prev, sauces: arr })); }}
                    className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                  <button onClick={() => setMenuConfigDraft((prev: any) => ({ ...prev, sauces: prev.sauces.filter((_: any, idx: number) => idx !== i) }))} className="text-red-400/50 hover:text-red-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
