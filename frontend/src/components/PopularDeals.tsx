import { useState, useEffect } from 'react';
import { Sparkles, Timer, CheckCircle, Tag } from 'lucide-react';
import { Deal, CartItem } from '../types';
import { fetchLandingContent } from '../services/api';

interface PopularDealsProps {
  onAddSpecialDealToCart: (deal: Deal) => void;
}

export default function PopularDeals({ onAddSpecialDealToCart }: PopularDealsProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  // Initialize timer values
  const [dealTimes, setDealTimes] = useState<Record<string, number>>({});
  const [claimedDeals, setClaimedDeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchLandingContent().then((res) => {
      const fetchedDeals: Deal[] = (res.data.deals || []).map((d: any) => ({ ...d, id: d._id }));
      setDeals(fetchedDeals);
      const times: Record<string, number> = {};
      fetchedDeals.forEach((deal) => { times[deal.id] = deal.endsInSeconds; });
      setDealTimes(times);
    }).catch(() => { });
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDealTimes((prev) => {
        const next = { ...prev };
        let updated = false;
        Object.keys(next).forEach((id) => {
          if (next[id] > 0) {
            next[id] -= 1;
            updated = true;
          } else {
            const deal = deals.find((d) => d.id === id);
            next[id] = deal?.endsInSeconds || 3600;
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deals]);

  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGrabDeal = (deal: Deal) => {
    onAddSpecialDealToCart(deal);
    setClaimedDeals((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setClaimedDeals((prev) => ({ ...prev, [deal.id]: false }));
    }, 2500);
  };

  return (
    <section id="deals" className="relative bg-[#5D1113] bg-grain py-20 px-4 md:px-6 overflow-hidden">

      {/* Decorative Cheese Drips top border */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-cheese/10 border-b border-cheese/10 overflow-hidden pointer-events-none" />

      {/* Decorative Warm Backglow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cheese/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header content */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-charcoal/40 text-cheese rounded-full text-xs font-bold uppercase tracking-wide border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-cheese animate-pulse" />
            LOCKED BARGAIN DEALS
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-wide uppercase">
            POPULAR <span className="text-cheese text-glow-gold">OFFERS</span> & DEALS
          </h2>
          <div className="w-16 h-1 bg-cheese mx-auto rounded-full" />
          <p className="font-sans text-cream/70 text-xs md:text-sm max-w-lg mx-auto font-medium uppercase tracking-wider">
            Tick-down combos formulated for ultimate group cheesiness or lone gamers. Claim instantly before timers freeze!
          </p>
        </div>

        {/* 4-Column Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, idx) => {
            const timeRemaining = dealTimes[deal.id] || 0;
            const isLimited = deal.isLimited;
            const isClaimed = claimedDeals[deal.id];

            return (
              <div
                key={deal.id}
                className="group relative bg-[#F5B109] rounded-[24px] p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(245,177,9,0.3)] text-charcoal border border-[#E6890A]/35"
              >
                {/* LIMITED TIME CORNER TAG */}
                {isLimited && (
                  <div className="absolute -top-3 -right-2 z-20 bg-tomato text-white text-[9px] font-black tracking-widest py-1.5 px-3 rounded-full uppercase shadow-md flex items-center gap-1 border border-white/20 rotate-[5deg]">
                    <Tag className="w-3 h-3" /> LIMIT PIECE
                  </div>
                )}

                {/* Card Header Stamp */}
                <div className="space-y-3 text-left">
                  <div className="inline-block bg-charcoal text-[#F5B109] font-display text-[22px] font-black px-4.5 py-1 rounded-xl shadow-md uppercase tracking-wider">
                    {deal.discountBadge}
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-black text-charcoal leading-none uppercase tracking-tight">
                    {deal.title}
                  </h3>

                  <p className="font-sans text-xs text-charcoal/80 font-bold leading-tight line-clamp-3">
                    {deal.description}
                  </p>
                </div>

                {/* Card pricing and timer logic */}
                <div className="mt-6 pt-5 border-t border-charcoal/10 space-y-4">

                  {/* Countdown Timer with interactive glowing block */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-charcoal/10 rounded-xl border border-charcoal/5 justify-center">
                    <Timer className="w-4 h-4 text-burgundy animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="font-mono text-xs font-black tracking-widest text-burgundy uppercase">
                      ENDS: {formatTime(timeRemaining)}
                    </span>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-sans text-xs font-bold line-through text-charcoal/50">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                    <span className="font-display text-4xl font-extrabold text-burgundy">
                      ${deal.dealPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={() => handleGrabDeal(deal)}
                    disabled={isClaimed}
                    className={`w-full py-3.5 px-4 rounded-xl font-sans font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${isClaimed
                      ? 'bg-olive text-white'
                      : 'bg-charcoal text-[#F5B109] hover:bg-burgundy hover:text-white'
                      }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-white" />
                        CLAIMED VALUE!
                      </>
                    ) : (
                      'GRAB DEAL'
                    )}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
