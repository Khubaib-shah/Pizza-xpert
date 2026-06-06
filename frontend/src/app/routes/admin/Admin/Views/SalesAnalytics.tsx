import React from 'react';

export default function SalesAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-charcoal p-4 border border-charcoal-border rounded-xl flex-wrap gap-3">
        <span className="text-xs uppercase text-cheese font-mono">DASHBOARD TRADING HIGHLIGHTS IN INR</span>
        <div className="flex gap-2 text-xs uppercase font-extrabold font-mono">
          {['Today', 'This Week', 'This Month', 'Custom Ranges'].map(p => (
            <button key={p} className="p-2 bg-charcoal-black hover:bg-cheese hover:text-black rounded transition-all cursor-pointer">
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom area SVG Chart (yellow opacity gradient) */}
        <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5">
          <h4 className="text-xs uppercase tracking-widest font-medium text-white mb-4">REVENUE TRENDS OVER TIME</h4>
          <div className="h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full text-cheese">
              <defs>
                <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-cheese)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-cheese)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 180 C 100 120, 150 160, 250 80 C 350 40, 400 90, 500 20 L 500 200 L 0 200 Z" fill="url(#yellowArea)" />
              <path d="M0 180 C 100 120, 150 160, 250 80 C 350 40, 400 90, 500 20" fill="none" stroke="var(--color-cheese)" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Horizontal bar charts representing Top pizzas */}
        <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-medium text-white">TOP SELLING RECIPES CHART</h4>
          {[
            { name: 'Loaded Pepperoni Explosion', pct: '85%', color: 'bg-cheese' },
            { name: 'Woodfire Marinara Jumbos', pct: '64%', color: 'bg-emerald-500' },
            { name: 'Spicy Garlic Zing Crust', pct: '48%', color: 'bg-blue-500' },
            { name: 'Double Herb Overload', pct: '32%', color: 'bg-red-500' },
          ].map((p, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-white font-medium">
                <span>{p.name}</span>
                <span className="font-mono text-cheese">{p.pct}</span>
              </div>
              <div className="w-full h-2 bg-charcoal-black rounded-full overflow-hidden">
                <div className={`h-full ${p.color}`} style={{ width: p.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
