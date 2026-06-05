import React, { useState, useEffect } from 'react';
import { Deal } from '../types';
import { fetchLandingContent } from '../services/api';

interface PremiumHorizontalMenuProps {
  onAddSpecialDealToCart: (deal: Deal) => void;
}

export default function PremiumHorizontalMenu({ onAddSpecialDealToCart }: PremiumHorizontalMenuProps) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchLandingContent().then((res) => {
      const fetchedDeals: Deal[] = (res.data.deals || []).map((d: any) => ({ ...d, id: d._id }));
      setDeals(fetchedDeals);
    }).catch(console.error);
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="bg-charcoal py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tomato/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cheese/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white tracking-wide uppercase">
            PREMIUM <span className="text-cheese">SELECTIONS</span>
          </h2>
          <div className="w-16 h-1 bg-tomato mx-auto rounded-full" />
          <p className="font-sans text-cream/70 text-sm max-w-lg mx-auto font-medium tracking-wider">
            Explore our chef's curated horizontal menu of the finest dishes, crafted for the ultimate dining experience.
          </p>
        </div>

        <div className="space-y-12">
          {deals.map((deal, idx) => {
            const isReverse = idx % 2 !== 0;
            
            // Auto-split the description by periods or linebreaks for bullet points
            const bulletPoints = deal.description
              .split(/(?:\.|\n)+/)
              .map(line => line.trim())
              .filter(line => line.length > 0);

            return (
              <div 
                key={deal.id}
                className={`overflow-hidden relative bg-cream rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-2xl transition-transform hover:-translate-y-1 duration-300 ${isReverse ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Grab Deal Button Absolute Positioning */}
                <button 
                  onClick={() => onAddSpecialDealToCart(deal)}
                  className={`absolute top-6 ${isReverse ? 'left-8' : 'right-8'} z-20 bg-tomato hover:bg-tomato-dark text-white font-sans font-bold text-xs uppercase tracking-widest py-2.5 px-6 rounded-full shadow-[0_4px_10px_rgba(235,87,87,0.3)] hover:shadow-[0_6px_15px_rgba(235,87,87,0.4)] transition-all`}
                >
                  Grab Deal
                </button>

                {/* Column 1: Spacer for Image */}
                <div className="hidden md:block w-48 md:w-56 lg:w-64 flex-shrink-0" />

                {/* Absolute Image placed bottom left/right -30px */}
                <div className={`w-48 md:w-72  lg:w-80  absolute bottom-0 ${isReverse ? 'right-0' : 'left-0'} z-10`}>
                  {deal.image ? (
                    <img 
                      src={deal.image} 
                      alt={deal.title} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[32px] bg-charcoal/10 border-4 border-cream flex items-center justify-center text-charcoal/30 shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
                      <span className="font-display">NO IMAGE</span>
                    </div>
                  )}
                </div>

                {/* Column 2: Content (Title + Grid Bullets) */}
                <div className={`flex-1 pt-8 md:pt-0 ${isReverse ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div className="flex flex-col items-start w-full">
                    {deal.discountBadge && (
                      <div className="inline-block bg-tomato text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-2">
                        {deal.discountBadge}
                      </div>
                    )}
                    <h3 className="font-display text-3xl md:text-5xl text-nowrap text-tomato uppercase font-black tracking-wide leading-none mb-6">
                      {deal.title}
                    </h3>
                    {/* Bullet Points in 2 Columns */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-charcoal/80 font-medium text-sm w-full">
                      {bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-left">
                          <span className="text-tomato mt-1 flex-shrink-0">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Stacked Pricing */}
                <div className="flex flex-col flex-shrink-0 justify-center items-end mt-4 md:mt-0 pt-10 md:pt-0">
                  <div className="flex flex-col items-end">
                    {deal.originalPrice > deal.dealPrice && (
                      <span className="text-charcoal/50 font-sans font-semibold line-through text-base mb-[-5px]">
                        Rs.{deal.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-display text-5xl text-charcoal font-black">
                      <span className="text-2xl mr-1">Rs.</span>{deal.dealPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
