import React from 'react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

interface LiveOperationsProps {
  orders: any[];
  elapsedTimers: Record<string, number>;
  formatTimer: (secs: number) => string;
  handleCancelKanban: (id: string) => void;
  handleAdvanceKanban: (id: string) => void;
}

export default function LiveOperations({
  orders, elapsedTimers, formatTimer, handleCancelKanban, handleAdvanceKanban
}: LiveOperationsProps) {
  return (
    <div className="space-y-6">
      {/* Kanban description row with live pulsating dot */}
      <div className="flex items-center justify-between bg-charcoal p-4 border border-charcoal-border rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-mono text-white">LIVE SAAS TRANSACTION STREAM ACTIVATED</span>
        </div>
        <div className="text-[10px] text-cream/40 font-mono text-right">AUTOMATIC RETRIES: ENABLED | TICK INTERVAL: 1000ms</div>
      </div>

      {/* Columns container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'New Orders', status: 'Pending', countColor: 'bg-amber-500' },
          { title: 'Preparing', status: 'Preparing', countColor: 'bg-blue-500' },
          { title: 'Ready for Dispatch', status: 'Ready', countColor: 'bg-yellow-500' },
          { title: 'Out for Delivery', status: 'Delivered', countColor: 'bg-emerald-500' },
        ].map(col => {
          const items = orders.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 flex flex-col space-y-3 min-h-[460px]">
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-charcoal-border">
                <span className="text-xs uppercase tracking-widest font-medium text-white">{col.title}</span>
                <span className={`text-[10px] text-black ${col.countColor} font-mono font-medium rounded-full px-2 py-0.5`}>
                  {items.length}
                </span>
              </div>

              {/* Stack of Cards */}
              <div className="space-y-3 overflow-y-auto flex-1">
                {items.length === 0 ? (
                  <div className="text-center py-10 text-xs text-cream/20 font-mono">No active jobs in queue.</div>
                ) : (
                  items.map(card => {
                    const secs = elapsedTimers[card.id] || 0;
                    const isDelayed = secs > 600; // RED state if legacy exceeds 10 mins
                    return (
                      <div key={card.id} className="bg-charcoal border border-white/5 rounded-xl p-3 hover:border-cheese/30 transition-all shadow-lg space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-cheese font-mono">{card.id}</span>
                          <Badge variant={isDelayed ? 'error' : 'neutral'} className={isDelayed ? '' : 'bg-white/5 text-emerald-400'}>
                            ⌛ {formatTimer(secs)}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white block">{card.customer}</span>
                          <span className="text-[11px] text-cream/60 block mt-0.5">{card.items}</span>
                        </div>
                        <div className="pt-2 border-t border-charcoal-border flex justify-between items-center text-[10px]">
                          <button
                            onClick={() => handleCancelKanban(card.id)}
                            className="text-red-400 hover:text-red-300 font-medium uppercase transition-colors"
                          >
                            Cancel
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdvanceKanban(card.id)}
                          >
                            Advance →
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
