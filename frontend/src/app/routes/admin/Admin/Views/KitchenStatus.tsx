import React from 'react';
import { Clock, Layers, Flame } from 'lucide-react';

export default function KitchenStatus() {
  return (
    <div className="space-y-6">
      {/* KPIs Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-cream/40 font-mono uppercase">AVERAGE RECIPE PREPARATION TIME</span>
            <h5 className="text-2xl font-medium font-display text-white mt-1">11.4 Minutes</h5>
          </div>
          <Clock className="w-8 h-8 text-cheese" />
        </div>
        <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-cream/40 font-mono uppercase">CONVEYOR QUEUE METADATA LOAD</span>
            <h5 className="text-2xl font-medium font-display text-cheese mt-1">3 Active Jigs</h5>
          </div>
          <Layers className="w-8 h-8 text-cheese" />
        </div>
        <div className="bg-charcoal p-4 border border-charcoal-border rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-cream/40 font-mono uppercase">HEAT BACKPLANE OVERALL THERMAL</span>
            <h5 className="text-2xl font-medium font-display text-emerald-400 mt-1">850°F (STABLE)</h5>
          </div>
          <Flame className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Station Control grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'STATION 1: DECK WOODFIRE OVEN 2', status: 'Active (green pulse)', pulseColor: 'bg-green-500', load: 'HIGH LOAD (27 Pizzas)', temp: '852°F' },
          { name: 'STATION 2: CONVEYOR BARBECUE SLIDER 1', status: 'Idle (no queue)', pulseColor: 'bg-amber-400', load: 'NO QUEUE LOGGED', temp: '422°F' },
          { name: 'STATION 3: GARNISH COLD VEGGIE DEPOT', status: 'Active (green pulse)', pulseColor: 'bg-green-500', load: '12 active tickets', temp: '38°F' },
        ].map((station, idx) => (
          <div key={idx} className="bg-charcoal-black border border-charcoal-800 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-mono tracking-wider font-medium text-cheese block truncate max-w-[180px]">{station.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${station.pulseColor} animate-pulse`} />
                <span className="text-[9px] font-mono text-cream/30">ONLINE STATUS</span>
              </div>
            </div>

            <div className="bg-charcoal p-3 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
              <p className="text-white"><strong>Oven Temp Core:</strong> <span className="text-yellow-400 font-medium">{station.temp}</span></p>
              <p className="text-cream/80"><strong>Payload Capacity:</strong> {station.load}</p>
              <p className="text-cream/50"><strong>System status flags:</strong> OK_SYSTEM_NORMAL_FIBER</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
