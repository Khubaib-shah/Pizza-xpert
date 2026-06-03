import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ variant = 'light', className = '', iconOnly = false }: LogoProps) {
  // Brand colors: Burgundy (#5D1113) for structure, Yellow (#F5B109) for highlights & details
  const textColor1 = variant === 'light' ? 'text-white' : 'text-[#5D1113]';
  const textColor2 = variant === 'light' ? 'text-[#F5B109]' : 'text-[#F5B109]';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* 🍕 SHARP X CONCEPT CUSTOM VECTOR ICON 🍕 */}
      <svg
        viewBox="0 0 40 40"
        className="w-10 h-10 md:w-11 md:h-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Symmetrical sharp backdrop */}
        <circle cx="20" cy="20" r="17" fill="#5D1113" className="opacity-40" />

        {/* Diagonal Line 1: Structural Clean White Bar (Left-Top to Right-Bottom) */}
        <line
          x1="10"
          y1="10"
          x2="30"
          y2="30"
          stroke="#5D1113"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="10"
          x2="30"
          y2="30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Diagonal Line 2: Pizza Slice Cross-Section (Left-Bottom to Right-Top) */}
        {/* Formed by a tapered triangle pointing from bottom-left to top-right with thick golden crust at top-right */}
        <path
          d="M 11 29 
             L 25 15 
             C 27.5 13, 31 13, 32.5 14.5 
             C 34 16, 34 19.5, 32 22 
             L 11 29 
             Z"
          fill="#5D1113"
          stroke="#F5B109"
          strokeWidth="2"
          strokeLinejoin="bevel"
        />

        {/* Melted Cheese drip shaped along the downdiagonal */}
        <path
          d="M 19 21
             C 17.5 24, 18 25.5, 17 27 
             C 16 28.5, 14 27.5, 15 26 
             C 16 24.5, 17.5 24, 19 21
             Z"
          fill="#F5B109"
        />

        {/* Classic golden crust outline curve at the top-right cap */}
        <path
          d="M 25.5 14.5
             C 28 12.5, 31.5 12.5, 33 14
             C 34.5 15.5, 34.5 19, 32.5 21.5"
          stroke="#F5B109"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Tiny gourmet pepperoni circles placed precisely on the slice cross-section */}
        <circle cx="28.5" cy="18" r="2.2" fill="#E63946" stroke="#F5B109" strokeWidth="0.5" />
        <circle cx="21" cy="22" r="1.8" fill="#E63946" stroke="#F5B109" strokeWidth="0.5" />
        <circle cx="25" cy="23.5" r="1.4" fill="#E63946" stroke="#F5B109" strokeWidth="0.4" />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col select-none">
          <div className="flex items-baseline leading-none font-sans">
            <span className={`${textColor1} font-bold text-xl uppercase tracking-wide`}>
              Pizza
            </span>
            <span className={`${textColor2} font-extrabold text-xl uppercase tracking-wide pl-1.5`}>
              Xpert
            </span>
          </div>
          <span className="text-[8px] md:text-[9px] font-sans font-bold text-[#F5B109] tracking-[1.2px] uppercase mt-0.5 leading-none">
            Expertise In Every Slice
          </span>
        </div>
      )}
    </div>
  );
}
