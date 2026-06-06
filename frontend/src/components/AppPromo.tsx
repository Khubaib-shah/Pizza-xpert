import { Smartphone, Download, Star, Award, Apple, AppWindow } from 'lucide-react';

export default function AppPromo() {
  const mockupPizza = '/src/assets/images/pizza_hero_1780276120368.png';

  return (
    <section className="relative py-20 px-4 md:px-6 overflow-hidden bg-grain"
      style={{
        background: 'linear-gradient(180deg, var(--color-charcoal) 0%, var(--color-burgundy) 100%)',
      }}
    >
      {/* Decorative Fire embers background overlay */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--color-tomato)05] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Side App Mobile Mock (Rendered entirely inside a custom CSS Phone bezel!) */}
        <div className="lg:col-span-5 flex justify-center order-2 lg:order-1 relative p-4">

          {/* Ambient yellow rim highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-cheese)15] rounded-full blur-3xl pointer-events-none" />

          {/* Core phone bezel */}
          <div className="relative w-[280px] h-[550px] bg-charcoal rounded-[44px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-4 border-white/10 select-none overflow-hidden animate-float-levitate">

            {/* Top Speaker/Notch Ear Piece */}
            <div className="absolute top-4 left-1/3 right-1/3 h-5 bg-charcoal rounded-b-2xl border-x border-b border-white/5 flex items-center justify-center z-30">
              <span className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Simulated Phone Screen Contents */}
            <div className="w-full h-full bg-charcoal-dark rounded-[36px] overflow-hidden flex flex-col justify-between p-4 relative font-sans">

              {/* Phone Status indicators */}
              <div className="flex items-center justify-between text-[9px] text-cream/40 font-mono pt-1">
                <span>9:41 AM</span>
                <span className="flex items-center gap-1">5G 🔋</span>
              </div>

              {/* Inside App Header */}
              <div className="flex items-center justify-between mt-3 text-left">
                <div>
                  <div className="text-[10px] text-cream/40 uppercase font-medium tracking-wider leading-none">ORDERING APP</div>
                  <div className="font-display text-lg font-medium text-cheese leading-tight mt-0.5">PIZZA XPERT</div>
                </div>
                <span className="w-7 h-7 bg-burgundy rounded-full flex items-center justify-center border border-white/5">
                  🍕
                </span>
              </div>

              {/* Hero showcase */}
              <div className="relative flex flex-col items-center my-auto py-4">
                <div className="absolute w-32 h-32 bg-[var(--color-cheese)08] rounded-full blur-xl" />
                <img
                  src={mockupPizza}
                  alt="Pizza mockup showcase"
                  className="w-40 h-auto object-contain filter saturate-1.2 brightness-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-2 text-center">
                  <div className="font-display text-sm font-medium text-white uppercase tracking-wider">
                    PEPPY PEPPERONI
                  </div>
                  <div className="text-yellow-400 text-[10px] font-medium">
                    ★ 4.9 (184 voters)
                  </div>
                </div>
              </div>

              {/* Call out purchase state inside screen mockup */}
              <div className="bg-charcoal-800/90 border border-white/5 rounded-2xl p-3 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-cream/40 uppercase leading-none font-medium">TOTAL SUM</div>
                    <div className="text-base font-medium text-cheese mt-0.5">Rs18.99</div>
                  </div>
                  <span className="text-[8px] bg-tomato text-white font-sans font-medium py-1 px-2 rounded-full uppercase">
                    HOT DISPATCH
                  </span>
                </div>
                <button className="w-full py-2 bg-burgundy hover:bg-tomato text-cheese hover:text-white font-sans text-[10px] font-extrabold uppercase tracking-widest rounded-lg border border-cheese/10 transition-colors">
                  CONFIRM SLICE
                </button>
              </div>

              {/* Bottom Nav overlay simulation */}
              <div className="flex items-center justify-around bg-charcoal-900/80 py-1.5 px-3 border border-white/5 rounded-full mt-2">
                {['🏠', '🍕', '🛒', '⚙️'].map((sim, sIdx) => (
                  <span key={sIdx} className={`text-xs p-1 ${sIdx === 1 ? 'bg-burgundy rounded-full' : ''}`}>
                    {sim}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Right Side Copywriting Badges */}
        <div className="lg:col-span-7 text-left space-y-6 md:space-y-8 my-auto p-4">

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-burgundy/50 text-cheese rounded-full text-xs font-medium uppercase tracking-widest border border-tomato/10">
            📱 PIZZA XPERT MOBILE
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white tracking-wide uppercase leading-none">
              ORDER ON <span className="text-cheese text-glow-gold">THE GO</span>
            </h2>
            <p className="font-sans text-cream/80 text-sm md:text-base max-w-lg leading-tight font-semibold">
              Download the official <b className="text-cheese">Pizza Xpert app</b>. Unlock hyper-interactive customizable pizza generators, secure one-swipe checkout protocols, and live telemetry order tracking from prep-table to front-yard. Fast, easy, cheesy.
            </p>
          </div>

          {/* Social Proof ratings */}
          <div className="flex items-center gap-5">
            <div>
              <div className="text-2xl font-medium text-cheese">4.9★</div>
              <div className="text-[10px] uppercase font-medium text-cream/40 tracking-wider mt-0.5">App Store</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-medium text-cheese">500K+</div>
              <div className="text-[10px] uppercase font-medium text-cream/40 tracking-wider mt-0.5">Downloads</div>
            </div>
          </div>

          {/* 2 Styled App Store vectors */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Apple App Store Mock */}
            <a
              href="#app"
              onClick={(e) => e.preventDefault()}
              className="group bg-black/90 hover:bg-white/5 text-left p-2.5 px-5 rounded-xl border border-white/10 flex items-center gap-3 transition-colors text-white cursor-pointer"
            >
              <Apple className="w-7 h-7 text-cheese transition-transform group-hover:scale-115" />
              <div>
                <div className="text-[9px] uppercase tracking-wider text-cream/40 leading-none">Download on</div>
                <div className="font-sans font-extrabold text-sm text-cream mt-0.5">App Store</div>
              </div>
            </a>

            {/* Google Play Store Mock */}
            <a
              href="#app"
              onClick={(e) => e.preventDefault()}
              className="group bg-black/90 hover:bg-white/5 text-left p-2.5 px-5 rounded-xl border border-white/10 flex items-center gap-3 transition-colors text-white cursor-pointer"
            >
              <AppWindow className="w-7 h-7 text-cheese transition-transform group-hover:scale-115" />
              <div>
                <div className="text-[9px] uppercase tracking-wider text-cream/40 leading-none">Get it on</div>
                <div className="font-sans font-extrabold text-sm text-cream mt-0.5">Google Play</div>
              </div>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
