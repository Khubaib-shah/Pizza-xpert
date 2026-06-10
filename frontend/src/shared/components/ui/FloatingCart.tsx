import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface FloatingCartProps {
  cartCount: number;
  onCartToggle: () => void;
}

export default function FloatingCart({ cartCount, onCartToggle }: FloatingCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Show the floating cart after a short delay for a smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Pulse animation when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <button
      onClick={onCartToggle}
      className={`
        fixed right-0 top-1/2 -translate-y-1/2 z-40
        flex items-center gap-2
        bg-gradient-to-l from-[var(--color-burgundy)] to-[#7a1517]
        text-white
        pl-3.5 pr-3 py-3.5
        rounded-l-2xl
        shadow-[−8px_4px_24px_rgba(93,17,19,0.6)]
        border border-r-0 border-white/10
        cursor-pointer
        group
        transition-all duration-500 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        hover:pl-5 hover:shadow-[−12px_6px_32px_rgba(245,177,9,0.4)]
      `}
      title="Open Cart"
      aria-label="Open shopping cart"
    >
      {/* Bag icon with subtle scale on hover */}
      <div className={`
        relative transition-transform duration-300
        ${isPulsing ? 'scale-125' : 'scale-100'}
        group-hover:scale-110
      `}>
        <ShoppingBag className="w-5 h-5 text-cheese" />

        {/* Badge */}
        {cartCount > 0 && (
          <span
            className={`
              absolute -top-2.5 -right-2.5
              min-w-[20px] h-5 px-1
              bg-cheese text-charcoal
              text-[10px] font-bold font-sans
              rounded-full
              flex items-center justify-center
              border-2 border-[var(--color-burgundy)]
              transition-transform duration-300
              ${isPulsing ? 'scale-125' : 'scale-100'}
            `}
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>

      {/* Label — slides in on hover */}
      <span className="
        max-w-0 overflow-hidden whitespace-nowrap
        group-hover:max-w-[80px]
        transition-all duration-300 ease-out
        text-[10px] font-sans font-medium uppercase tracking-wider text-cheese/90
      ">
        Cart
      </span>

      {/* Glowing edge accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-gradient-to-b from-transparent via-cheese/60 to-transparent rounded-full" />
    </button>
  );
}
