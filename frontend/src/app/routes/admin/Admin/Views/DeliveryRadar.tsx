import React from 'react';
import { Truck } from 'lucide-react';

export default function DeliveryRadar() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 space-y-0">
      {/* Left Courier List */}
      <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-4 overflow-y-auto h-[480px] space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-medium text-white pb-2 border-b border-charcoal-border">ACTIVE DISPATCH RIDERS</h4>
        {[
          { name: 'Rider Vicky', activeJob: 'XP-7800', eta: '4 mins', phone: '+91 99012 34567', pulse: 'bg-emerald-500' },
          { name: 'Rider Rahul', activeJob: 'XP-7796', eta: '9 mins', phone: '+91 91234 56711', pulse: 'bg-emerald-500' },
          { name: 'Rider Amit', activeJob: 'Resting', eta: '--', phone: '+91 98765 43210', pulse: 'bg-amber-500' },
        ].map((rider, idx) => (
          <div key={idx} className="bg-charcoal-black p-3 border border-white/5 rounded-xl hover:border-cheese/30 transition-all select-none flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-white block">{rider.name}</span>
              <span className="text-[10px] text-cream/50 block mt-0.5">{rider.phone}</span>
              <span className="text-[9px] text-cheese font-mono block mt-1">LATEST ASSIGNED: {rider.activeJob}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-medium text-white">{rider.eta}</span>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <span className={`w-2 h-2 rounded-full ${rider.pulse} animate-pulse`} />
                <span className="text-[9px] uppercase font-mono text-cream/40">ONLINE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Radar Area HUD screen */}
      <div className="lg:col-span-8 bg-charcoal-black border border-charcoal-border rounded-2xl p-5 flex flex-col justify-between h-[480px] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-radar opacity-15 pointer-events-none" />
        <div className="z-10 flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest font-extrabold text-cheese">GPS BACKPLANE RADAR SCREEN (MOCK DESIGN)</span>
          <span className="text-[10px] bg-burgundy px-2 py-0.5 border border-cheese/20 font-mono rounded text-white font-extrabold uppercase select-none">GRID LOCK: LIVE</span>
        </div>

        {/* Simulated Radar Map Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cheese/10 rounded-full flex items-center justify-center">
          <div className="w-56 h-56 border border-cheese/15 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 border border-cheese/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-cheese rounded-full animate-ping" />
            </div>
          </div>

          {/* Pizza Express Marker Pins */}
          <div className="absolute right-12 top-24 z-10 animate-float-levitate">
            <div className="relative group cursor-pointer">
              <div className="bg-burgundy text-cheese border border-cheese font-medium text-[10px] px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                <Truck className="w-3 h-3 text-cheese" fill="currentColor" />
                <span>Vicky</span>
              </div>
              <div className="w-2.5 h-2.5 bg-cheese rounded-full mx-auto mt-0.5 border border-charcoal-black" />
            </div>
          </div>

          <div className="absolute left-16 bottom-20 z-10 animate-pulse">
            <div className="relative group cursor-pointer">
              <div className="bg-zinc-800 text-white border border-white/20 font-medium text-[10px] px-2 py-1 rounded-xl shadow-lg flex items-center gap-1">
                <Truck className="w-3 h-3 text-cheese" />
                <span>Rahul</span>
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mx-auto mt-0.5 border border-charcoal-black" />
            </div>
          </div>
        </div>

        <div className="z-10 flex justify-between items-center text-[10px] font-mono text-cream/40 select-none">
          <span>ANTENNA: DUPLEX_WAVE_990HZ</span>
          <span>RIDER ASSISTANCE RADIUS: 5.0 KM LOCK</span>
        </div>
      </div>
    </div>
  );
}
