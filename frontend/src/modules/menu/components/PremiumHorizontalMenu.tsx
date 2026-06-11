import React, { useState, useEffect } from "react";
import { Deal, CartItem } from "../../../types";
import { useLandingContent } from "../../content/hooks/useContentQueries";
import { CloudinaryImage } from "../../../shared/components/ui/CloudinaryImage";
import { flyToCart } from "../../../shared/utils/flyToCart";

interface PremiumHorizontalMenuProps {
  onAddSpecialDealToCart: (deal: Deal) => void;
}

export default function PremiumHorizontalMenu({
  onAddSpecialDealToCart,
}: PremiumHorizontalMenuProps) {
  const { data: landingContent } = useLandingContent();
  const deals: Deal[] = (landingContent?.deals || []).map((d: any) => ({
    ...d,
    id: d._id || d.id,
  }));

  if (deals.length === 0) return null;

  return (
    <section className="bg-charcoal py-12 md:py-24 px-2 sm:px-4 md:px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tomato/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cheese/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white tracking-wide uppercase">
            PREMIUM <span className="text-cheese">SELECTIONS</span>
          </h2>
          <div className="w-16 h-1 bg-tomato mx-auto rounded-full" />
          <p className="font-sans text-cream/90 text-sm max-w-lg mx-auto tracking-wider">
            Explore our chef's curated horizontal menu of the finest dishes,
            crafted for the ultimate dining experience.
          </p>
        </div>

        <div className="space-y-4  md:space-y-12">
          {deals.map((deal, idx) => {
            const isReverse = idx % 2 !== 0;

            // Auto-split the description by periods or linebreaks for bullet points
            const bulletPoints = deal.description
              .split(/(?:\.|\n)+/)
              .map((line) => line.trim())
              .filter((line) => line.length > 0);

            return (
              <div
                key={deal.id}
                className={`overflow-hidden relative bg-cream rounded-[24px] md:rounded-[40px] flex flex-row items-stretch shadow-2xl ${isReverse ? "flex-row-reverse" : ""}`}
              >
                {/* Image Column */}
                <div className="w-1/3 sm:w-2/5 md:w-5/12 flex-shrink-0 relative bg-charcoal">
                  {deal.image ? (
                    <>
                      <CloudinaryImage
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover absolute inset-0"
                        sizes="(max-width: 768px) 33vw, 40vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-${isReverse ? "l" : "r"} from-cream/30 to-transparent pointer-events-none`}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full border-4 border-cream flex items-center justify-center text-charcoal/30 shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
                      <span className="font-display">NO IMAGE</span>
                    </div>
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 p-2 sm:p-6 md:p-8 flex flex-col justify-center min-w-0">
                  <div className="flex flex-col items-start w-full">
                    {deal.discountBadge && (
                      <div className="inline-block bg-tomato text-white text-[8px] md:text-[10px] font-bold tracking-widest px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase mb-1 md:mb-2">
                        {deal.discountBadge}
                      </div>
                    )}
                    <h3 className="font-display text-base sm:text-2xl md:text-5xl text-tomato uppercase font-black tracking-wide leading-tight mb-1 md:mb-4 break-words hyphens-auto">
                      {deal.title}
                    </h3>
                    {/* Bullet Points in 2 Columns */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-4 gap-y-0.5 md:gap-y-3 text-charcoal/80 font-medium text-[8px] sm:text-[10px] md:text-sm w-full">
                      {bulletPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 md:gap-2 text-left"
                        >
                          <span className="text-tomato mt-1 flex-shrink-0">
                            •
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-charcoal/10 my-1.5 md:my-5" />

                  {/* Pricing & Button Stack */}
                  <div className="flex flex-row items-end justify-between w-full gap-2 md:gap-4">
                    <div className="flex flex-col items-start">
                      {deal.originalPrice > deal.dealPrice && (
                        <span className="text-charcoal/50 font-sans font-semibold line-through text-[8px] sm:text-[10px] md:text-base mb-[-2px] md:mb-[-5px]">
                          Rs.{deal.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="font-display text-lg sm:text-2xl md:text-5xl text-charcoal font-black whitespace-nowrap">
                        <span className="text-[8px] sm:text-[10px] md:text-2xl mr-0.5 md:mr-1">
                          Rs.
                        </span>
                        {deal.dealPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Grab Deal Button */}
                    <button
                      onClick={(e) => {
                        onAddSpecialDealToCart(deal);
                        const imgElement = e.currentTarget
                          .closest(".relative")
                          ?.querySelector("img");
                        if (imgElement) flyToCart(imgElement as HTMLElement);
                      }}
                      className="btn-primary-anim bg-tomato text-white font-sans font-bold text-[8px] md:text-xs uppercase tracking-widest py-1.5 md:py-2.5 px-2 md:px-6 rounded-md md:rounded-xl border border-tomato/20 shadow-[0_4px_10px_rgba(235,87,87,0.3)] transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
                    >
                      Grab Deal
                    </button>
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
