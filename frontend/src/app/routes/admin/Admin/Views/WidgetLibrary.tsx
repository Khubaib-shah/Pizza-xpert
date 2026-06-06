import React from 'react';

export default function WidgetLibrary() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Single metric with sparkline & comparison */}
        <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(245,177,9,0.15)] space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-cream/50 font-medium">Variant A: COMPACT WITH PROGRESS BAR</span>
            <h6 className="text-3xl font-display font-medium text-white mt-1">Rs42,890</h6>
          </div>
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-cheese" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-cream/40">
              <span>STABLE COMPILIANCE AT 80%</span>
              <span className="text-cheese">↑ 5%</span>
            </div>
          </div>
        </div>

        {/* Sparkling progress variant */}
        <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.15)] space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-cream/50 font-medium">Variant B: SPARKLING COMPARISON</span>
            <h6 className="text-3xl font-display font-medium text-white mt-1">4.96 Stars</h6>
          </div>
          <div>
            <span className="text-[10px] font-mono font-extrabold text-emerald-400">POS GLOW SHADOW INCLUDED</span>
            <p className="text-[10px] text-cream/40">Highest courier evaluation performance today</p>
          </div>
        </div>

        {/* Flat monochrome status */}
        <div className="bg-charcoal-border/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-[0_4px_20px_rgba(239,68,68,0.15)] space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-cheese font-medium">Variant C: ATTENTION GLOW CARDS</span>
            <h6 className="text-3xl font-display font-medium text-white mt-1">2 Oven Alerts</h6>
          </div>
          <div className="bg-charcoal-black/80 border border-red-500/20 px-2 py-1.5 rounded-lg text-[10px] font-mono text-red-400">
            ⚠️ CONVEYOR HEAT BARRIER OVERRUN
          </div>
        </div>

      </div>
    </div>
  );
}
