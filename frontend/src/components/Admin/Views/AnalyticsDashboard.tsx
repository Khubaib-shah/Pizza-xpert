import React from 'react';
import Badge from '../../ui/Badge';
import { useNavigate } from 'react-router-dom';

interface AnalyticsDashboardProps {
  orders: any[];
  analytics?: any;
}

export default function AnalyticsDashboard({ orders, analytics = {} }: AnalyticsDashboardProps) {
  const navigate = useNavigate();
  
  const revenue = analytics.revenue || 0;
  const ordersHandled = analytics.ordersHandled || 0;
  const activeCouriers = analytics.activeCouriers || 0;
  const newSignups = analytics.newSignups || 0;

  const avgOrderValue = ordersHandled > 0 ? Math.round(revenue / ordersHandled) : 0;

  // Calculate Donut Categories
  const totalItems = orders.length || 1;
  const loadedCount = orders.filter(o => o.items.toLowerCase().match(/loaded|spicy|bbq/)).length;
  const classicCount = orders.filter(o => o.items.toLowerCase().match(/classic|margherita|pepperoni/)).length;
  const cheesyCount = Math.max(0, orders.length - loadedCount - classicCount);

  const pLoaded = Math.round((loadedCount / totalItems) * 100);
  const pClassic = Math.round((classicCount / totalItems) * 100);
  const pCheesy = Math.max(0, 100 - pLoaded - pClassic);

  // Dynamic Revenue Timeline (6 buckets for last 30 days)
  const buckets = Array(6).fill(0);
  const now = new Date().getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const bucketSizeMs = thirtyDaysMs / 5;

  orders.forEach(o => {
    if (o.createdAt) {
      const time = new Date(o.createdAt).getTime();
      const diff = now - time;
      if (diff >= 0 && diff <= thirtyDaysMs) {
        const bucketIdx = 5 - Math.floor(diff / bucketSizeMs);
        if (bucketIdx >= 0 && bucketIdx <= 5) {
          buckets[bucketIdx] += o.total || 0;
        }
      }
    }
  });

  const maxRevenueGraph = Math.max(...buckets, 1);
  const Y = buckets.map(v => 160 - ((v / maxRevenueGraph) * 120));
  const pathD = `M 0 ${Y[0]} C 50 ${Y[0]}, 50 ${Y[1]}, 100 ${Y[1]} S 150 ${Y[2]}, 200 ${Y[2]} S 250 ${Y[3]}, 300 ${Y[3]} S 350 ${Y[4]}, 400 ${Y[4]} S 450 ${Y[5]}, 500 ${Y[5]}`;
  const fillD = `${pathD} L 500 200 L 0 200 Z`;

  const timelineLabels = [];
  for(let i=0; i<4; i++) {
    const d = new Date(now - thirtyDaysMs + (i * thirtyDaysMs / 3));
    timelineLabels.push(d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }));
  }

  // Dynamic Heatmap Data
  const heatmapCounts = Array.from({ length: 7 }, () => Array(24).fill(0));
  let maxHeat = 0;
  orders.forEach(o => {
    if (o.createdAt) {
      const d = new Date(o.createdAt);
      const dayIdx = (d.getDay() + 6) % 7; // 0=Mon, 6=Sun
      const h = d.getHours();
      heatmapCounts[dayIdx][h]++;
      if (heatmapCounts[dayIdx][h] > maxHeat) {
        maxHeat = heatmapCounts[dayIdx][h];
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Glassmorphism Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "KARACHI TOTAL REVENUE", value: `Rs. ${revenue.toLocaleString()}`, change: "Live Sync", glow: "shadow-[0_4px_20px_rgba(245,177,9,0.15)]", barGlow: "bg-cheese" },
          { title: "TOTAL ORDERS HANDLED", value: ordersHandled.toString(), change: "Live Sync", glow: "shadow-[0_4px_20px_rgba(34,197,94,0.15)]", barGlow: "bg-emerald-500" },
          { title: "ACTIVE COURIERS", value: `${activeCouriers} Riders`, change: "GPS Tracking Active", glow: "shadow-[0_4px_20px_rgba(59,130,246,0.15)]", barGlow: "bg-blue-500" },
          { title: "NEW LOGGED VISITORS", value: `${newSignups} Signups`, change: "Live Sync", glow: "shadow-[0_4px_20px_rgba(239,68,68,0.15)]", barGlow: "bg-red-500" }
        ].map((card, idx) => (
          <div key={idx} className={`bg-charcoal-border/70 backdrop-blur-md rounded-2xl p-4 border border-white/5 relative overflow-hidden flex flex-col justify-between h-28 hover:border-cheese/30 transition-all ${card.glow}`}>
            <div className="absolute top-0 left-0 w-1 h-full col-scale" />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-cream/60 font-medium">{card.title}</span>
              <h3 className="text-3xl font-display font-medium text-white mt-1">{card.value}</h3>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-cheese font-mono">{card.change}</span>
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full w-2/3 ${card.barGlow}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue line chart + Orders donut container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Custom revenue SVG line graph */}
        <div className="lg:col-span-8 bg-charcoal border border-charcoal-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs uppercase tracking-widest font-medium text-white">KARACHI REVENUE TIMELINE (LAST 30 DAYS)</h4>
            <span className="text-xs text-cheese font-mono font-medium">AVG VALUE: Rs. {avgOrderValue.toLocaleString()}/order</span>
          </div>
          {/* SVG graph */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full text-cheese" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-cheese)" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="var(--color-cheese)" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="var(--color-charcoal-muted)" strokeDasharray="3" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="var(--color-charcoal-muted)" strokeDasharray="3" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="var(--color-charcoal-muted)" strokeDasharray="3" vectorEffect="non-scaling-stroke" />
              {/* Area Fill */}
              <path
                d={fillD}
                fill="url(#areaGrad)"
              />
              {/* Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-cheese)"
                strokeWidth="3.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Floating Indicator Circles */}
              <circle cx="200" cy={Y[2]} r="5" fill="var(--color-charcoal-black)" stroke="var(--color-cheese)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="400" cy={Y[4]} r="5" fill="var(--color-charcoal-black)" stroke="var(--color-cheese)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end p-2 text-[9px] font-mono text-cream/40">
              <span>{timelineLabels[0]}</span>
              <span>{timelineLabels[1]}</span>
              <span>{timelineLabels[2]}</span>
              <span>{timelineLabels[3]}</span>
            </div>
          </div>
        </div>

        {/* Categories Donut Visualizer */}
        <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium text-white mb-4">ORDERS BY CATEGORY</h4>
            {/* Fake Donut SVG */}
            <div className="flex items-center justify-center h-40">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full circular-chart">
                  <path className="circle-bg"
                    stroke="var(--color-charcoal-muted)"
                    strokeWidth="4"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment Red */}
                  <path className="circle"
                    stroke="var(--color-burgundy)"
                    strokeWidth="4.5"
                    strokeDasharray={`${pLoaded}, 100`}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment Yellow */}
                  <path className="circle"
                    stroke="var(--color-cheese)"
                    strokeWidth="4.5"
                    strokeDasharray={`${pClassic}, 100`}
                    strokeDashoffset={`-${pLoaded}`}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment Green */}
                  <path className="circle"
                    stroke="#10B981"
                    strokeWidth="4.5"
                    strokeDasharray={`${pCheesy}, 100`}
                    strokeDashoffset={`-${pLoaded + pClassic}`}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="text-xs font-mono font-medium text-white">{ordersHandled}</span>
                  <span className="text-[8px] text-cream/40 uppercase font-medium">ORDERS</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-cream/80">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-burgundy" /> Solid Loaded</span>
              <span className="font-mono font-medium">{pLoaded}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cheese" /> Woodfire Classics</span>
              <span className="font-mono font-medium">{pClassic}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Cheesy Herbals</span>
              <span className="font-mono font-medium">{pCheesy}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Peak hours heatmap grid */}
      <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5">
        <h4 className="text-xs uppercase tracking-widest font-medium text-white mb-3">KARACHI PEAK ORDERING HEATMAP (7 DAYS × 24 HOURS GRID)</h4>
        <div className="space-y-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="w-8 text-[10px] font-mono text-cream/40">{day}</span>
              <div className="flex-1 grid grid-cols-24 gap-0.5">
                {Array.from({ length: 24 }).map((_, h) => {
                  const heat = heatmapCounts[idx][h];
                  const opacityLevel = maxHeat > 0 ? heat / maxHeat : 0;
                  const opacityClass = opacityLevel > 0.7 ? 'bg-cheese' : opacityLevel > 0.3 ? 'bg-cheese/50' : opacityLevel > 0 ? 'bg-cheese/20' : 'bg-charcoal-800';
                  return (
                    <div
                      key={h}
                      className={`h-3 rounded-sm ${opacityClass}`}
                      title={`${day} @ ${h}:00 - ${heat} orders`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-cream/30 mt-2">
          <span>00:00 AM (MIDNIGHT)</span>
          <span>01:00 PM (LUNCH RUSH)</span>
          <span>08:00 PM (LATE DINNER PEAK)</span>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-charcoal-border flex justify-between items-center">
          <h4 className="text-xs uppercase tracking-widest font-medium text-white">RECENT ORDERS DESPATCH TRAIL</h4>
          <button onClick={() => navigate('/admin/orders')} className="text-xs text-cheese font-medium uppercase hover:underline">Full Registry →</button>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-charcoal-dark border-b border-charcoal-800 text-cream/40 uppercase font-medium text-[10px] tracking-wider">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items Pizza details</th>
              <th className="p-3">Total Cost</th>
              <th className="p-3">Workflow State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800">
            {orders.slice(0, 3).map(o => (
              <tr key={o.id} className="hover:bg-charcoal-800/30 transition-colors font-mono">
                <td className="p-3 font-medium text-cheese">{o.id}</td>
                <td className="p-3 text-white font-sans font-medium">{o.customer}</td>
                <td className="p-3 text-cream/70 font-sans">{o.items}</td>
                <td className="p-3 text-white">Rs. {o.total}</td>
                <td className="p-3">
                  <Badge variant={
                    o.status === 'Pending' ? 'warning' :
                    o.status === 'Preparing' ? 'info' :
                    o.status === 'Ready' ? 'neutral' :
                    o.status === 'Delivered' ? 'success' : 'error'
                  }>
                    {o.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
