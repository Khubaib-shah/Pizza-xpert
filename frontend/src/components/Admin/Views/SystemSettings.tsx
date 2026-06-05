import React from 'react';
import Button from '../../ui/Button';

export default function SystemSettings() {
  return (
    <div className="bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-6">
      <h4 className="text-xs uppercase tracking-widest font-medium text-cheese pb-2 border-b border-charcoal-border">STORE ENGINE PROPERTIES</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-cream/40 uppercase font-mono block">Registered Storefront Title</label>
            <input
              type="text"
              defaultValue="Pizza Xpert Woodfire Gourmet Gurgaon"
              className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-cream/40 uppercase font-mono block">Support Email Coordinates</label>
            <input
              type="text"
              defaultValue="support@pizzaxpert.saas"
              className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-cream/40 uppercase font-mono block">Tax Register Code (GSTIN)</label>
            <input
              type="text"
              defaultValue="06AAAAA0000A1Z5"
              className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono block">Daily Open Timers</label>
              <input
                type="text"
                defaultValue="11:00 AM"
                className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono block">Daily Close Timers</label>
              <input
                type="text"
                defaultValue="03:00 AM"
                className="w-full bg-charcoal-black border border-charcoal-border p-3 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-cheese uppercase font-mono block font-medium">LOGISTICS LIMIT VALUES</label>
            <div className="p-3 bg-zinc-800/20 border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span>Base delivery radius locking limit</span>
                <span className="font-medium text-white">5.0 Kilometers</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span>Surge price multiplier factor</span>
                <span className="font-medium text-cheese">1.5x Multiplier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-charcoal-border flex justify-end">
        <Button
          variant="primary"
          onClick={() => alert('Properties saved locally to local config database.')}
        >
          Apply properties Override
        </Button>
      </div>
    </div>
  );
}
