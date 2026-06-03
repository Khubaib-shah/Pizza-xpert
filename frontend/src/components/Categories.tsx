import { useState, useEffect, useRef } from "react";
import {
  UtensilsCrossed,
  Leaf,
  Flame,
  Layers,
  Sparkles,
  Award,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Category } from "../types";
import { CATEGORIES } from "../data";

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onScrollToElement: (id: string) => void;
}

export default function Categories({
  selectedCategory,
  onSelectCategory,
  onScrollToElement,
}: CategoriesProps) {
  const [isSticky, setIsSticky] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        // Trigger sticky when the placeholder reaches the bottom of the Navbar (approx 65px)
        setIsSticky(rect.top <= 65);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll the active pill into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activePill = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activePill) {
        const container = scrollContainerRef.current;
        const scrollLeft = activePill.offsetLeft - container.offsetWidth / 2 + activePill.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedCategory]);

  return (
    <section
      id="categories"
      className="relative bg-charcoal bg-grain py-12 px-4 md:px-6 border-b border-white/5"
    >
      {/* Sauce Splash Watermark decorative layer */}
      <div className="absolute bottom-5 left-0 w-32 h-32 bg-[var(--color-tomato)20] rounded-full blur-xl pointer-events-none rotate-45" />

      <div className="max-w-7xl mx-auto">
        {/* Title elements */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/50 text-cheese rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">
            💭 WHAT IS YOUR FLAVOR VIBE?
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-white tracking-wide uppercase">
            WHAT ARE YOU{" "}
            <span className="text-cheese text-glow-gold">CRAVING</span>?
          </h2>
          <div className="w-16 h-1 bg-tomato mx-auto rounded-full" />
          <p className="font-sans text-cream/70 text-xs md:text-sm max-w-sm mx-auto font-medium uppercase tracking-wider">
            Toggle categories to find your perfect artisan woodfire creation.
          </p>
        </div>

        {/* Categories Pills Container - Sticky Behavior when active */}
        <div ref={placeholderRef} className="h-[60px]">
          <div
            ref={scrollContainerRef}
            className={`z-30 w-full flex flex-nowrap overflow-x-auto hide-scrollbar items-center justify-start md:justify-center gap-2.5 select-none transition-colors duration-200 px-4 py-2 ${isSticky
                ? "fixed top-[52px] md:top-[64px] left-0 right-0 bg-charcoal/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
                : "relative"
              }`}
          >
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-active={isSelected}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onScrollToElement(`category-${cat.id}`);
                  }}
                  className={`flex-shrink-0 py-2.5 px-5 rounded-full text-xs font-sans font-bold uppercase tracking-wide border transition-all duration-300 transform active:scale-95 flex items-center gap-2 cursor-pointer ${isSelected
                      ? "bg-burgundy text-cheese border-cheese shadow-[0_4px_15px_rgba(93,17,19,0.5)]"
                      : "bg-charcoal-light text-cream/70 border-white/5 hover:border-white/15"
                    }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-cheese" : "bg-cream/30"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
