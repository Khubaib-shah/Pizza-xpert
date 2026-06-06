import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';

interface CTABannerProps {
  onScrollToElement: (id: string) => void;
}

export default function CTABanner({ onScrollToElement }: CTABannerProps) {
  return (
    <section className="relative bg-burgundy bg-grain py-24 px-4 md:px-6 overflow-hidden">
      
      {/* CHEESE DRIP SVG TOP BORDER PANEL (Transitions from dark grey into the deep burgundy) */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 select-none">
        <svg
          viewBox="0 0 1440 110"
          className="relative block w-full h-[60px] md:h-[90px]"
          preserveAspectRatio="none"
        >
          {/* Main Cheese Drip Path */}
          <path
            d="M0,0 C150,90 280,110 420,50 C550,0 670,100 810,60 C980,10 1110,120 1250,40 C1380,-20 1440,40 1440,40 L1440,0 L0,0 Z"
            fill="var(--color-cheese)"
          />
          {/* Underlying orange sauce shadow depth path */}
          <path
            d="M0,0 C150,110 280,120 420,65 C550,10 670,115 810,75 C980,25 1110,135 1250,55 C1380,-10 1440,55 1440,55 L1440,0 L0,0 Z"
            fill="var(--color-cheese-dark)"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Decorative fire embers glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cheese/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-20 pt-10">
        
        {/* Spark decoration */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/35 rounded-full text-cheese font-sans text-xs font-medium uppercase tracking-widest border border-cheese/10">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          INSTANT RELIEF AWAITS
        </div>

        {/* Content Heading */}
        <h2 className="font-display text-5xl sm:text-6xl md:text-8xl font-medium text-white tracking-wide uppercase leading-none select-none">
          HUNGRY? <br className="sm:hidden" />
          LET'S <span className="text-cheese text-glow-gold">FIX THAT</span>.
        </h2>

        {/* Subtext */}
        <p className="font-sans text-cream/80 text-sm md:text-lg max-w-lg mx-auto font-medium">
          Dough is rolled, brick oven is fired to 850°F, and our speed dispatch messengers are strapped on their helmets. Click below to secure hot, bubbling cheesiness at your front gate in 30 minutes flat.
        </p>

        {/* Big Yellow CTA Button */}
        <div className="pt-2">
          <button
            onClick={() => onScrollToElement('menu')}
            className="group bg-cheese text-charcoal hover:bg-white hover:text-burgundy font-sans font-medium text-base md:text-lg uppercase tracking-[3px] py-4.5 px-10 rounded-xl transition-all duration-300 transform hover:-translate-y-1 btn-cheese-shadow inline-flex items-center gap-3 cursor-pointer"
          >
            ORDER NOW
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
