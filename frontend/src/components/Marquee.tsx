import React, { Component } from 'react';

interface Props {

}

const Marquee: React.FC<Props> = ({ }) => {
    return (
        <div className="relative w-full overflow-hidden bg-burgundy border-y border-[var(--color-tomato)20] py-4 select-none mt-auto flex" >
            <div className="animate-ticker-scroller flex whitespace-nowrap w-max font-display text-lg md:text-2xl text-cream font-medium uppercase tracking-wide">
                {Array.from({ length: 4 }).map((_, rIdx) => (
                    <span key={rIdx} className="flex gap-12 pr-12">
                        <span>HOT & FRESH ✦</span>
                        <span className="text-cheese text-glow-gold">FREE DELIVERY TODAY ✦</span>
                        <span>100% ARTISAN MOZZARELLA ✦</span>
                        <span className="text-tomato">TASTIEST PIZZA IN TOWN ✦</span>
                        <span>WOODFIRE BAKED AT 850°F ✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Marquee;