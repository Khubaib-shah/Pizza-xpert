import { useState, useEffect } from 'react';
import { Star, Flame, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import dealBgMain from '../assets/images/2.png';
import dealBgOven from '../assets/images/1.png';
import dealBgPepperoni from '../assets/images/1.png';

interface HeroProps {
  onScrollToElement: (id: string) => void;
}

interface Slide {
  id: string;
  backgroundImg: string;
  badgeText: string;
  titleNumber: string;
  titleTextLines: string[];
  items: string[];
  price: string;
  pricePrefix: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

// Math formula to generate raw SVG path string for a beautiful symmetrical scalloped circle seal badge
const renderScallopPath = (points: number, innerRadius: number, outerRadius: number) => {
  let path = "";
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const nextAngle = ((i + 1) * 2 * Math.PI) / points;
    const midAngle = (angle + nextAngle) / 2;

    const x1 = 50 + outerRadius * Math.cos(angle);
    const y1 = 50 + outerRadius * Math.sin(angle);
    const xm = 50 + innerRadius * Math.cos(midAngle);
    const ym = 50 + innerRadius * Math.sin(midAngle);
    const x2 = 50 + outerRadius * Math.cos(nextAngle);
    const y2 = 50 + outerRadius * Math.sin(nextAngle);

    if (i === 0) {
      path += `M ${x1} ${y1} Q ${xm} ${ym} ${x2} ${y2}`;
    } else {
      path += ` Q ${xm} ${ym} ${x2} ${y2}`;
    }
  }
  path += " Z";
  return path;
};

import { fetchLandingContent } from '../services/api';

export default function Hero({ onScrollToElement }: HeroProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    fetchLandingContent().then((res) => {
      setSlides(res.data.heroSlides || []);
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Auto-slide transition timing loop logic
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading || slides.length === 0) {
    return (
      <section id="home" className="min-h-[50vh] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-cheese border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  const activeSlide = slides[currentSlide];

  return (

    <section
      id="home"
      className="relative hero-section min-h-screen flex flex-col  justify-between pt-24 md:pt-28 overflow-hidden select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.backgroundImg}
          className="absolute inset-0 bg-contain bg-no-repeat bg-[position:center_70px] md:bg-[right_center]"
          style={{
            backgroundImage: `url(${activeSlide.backgroundImg})`,

          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Subtle Grain Overlay on the Backdrop */}
      < div className="absolute inset-0 z-0 w-full h-full bg-grain pointer-events-none opacity-25" />

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center my-auto py-10 md:!mt-auto md:!pt-10 md:mb-0 md:pb-0 relative z-10">

        {/* LEFT COMPOSITION COLUMN WITH HERO CARD INFO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 md:space-y-8 z-10 order-2 lg:order-1"
          >


            {/* Main Display Heading */}
            <div className="relative space-y-2">
              <div className="flex items-end gap-4 select-none">
                {/* Big Number Display */}
                <span className="!text-8xl self-end sm:text-[130px] md:text-[160px] font-medium text-white leading-none tracking-wide filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                  {activeSlide.titleNumber}
                </span>

                {/* Text Lines */}
                <div className="flex items-end gap-3 sm:gap-5">
                  <div className="flex flex-col justify-center">
                    {activeSlide.titleTextLines.map((line, idx) => (
                      <span
                        key={idx}
                        className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-wide text-cheese leading-[0.85] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] uppercase"
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Animated Badge Indicator (Hidden on md and up) */}
                  <div className="md:hidden flex flex-col justify-end items-center pb-1 pl-12 ">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: -5 }}
                        exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
                        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.15 }}
                      >
                        <div className="relative w-32 h-32 flex items-center justify-center" style={{ willChange: 'transform' }}>
                          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                            <path fill="var(--color-burgundy)" stroke="var(--color-cheese)" strokeWidth="1.5" strokeLinejoin="round" d={renderScallopPath(28, 43, 47)} />
                            <path fill="transparent" stroke="white" strokeWidth="0.8" strokeDasharray="1.5,1.5" strokeLinejoin="round" d={renderScallopPath(28, 39, 41)} />
                          </svg>
                          <div className="relative z-10 text-center flex flex-col justify-center items-center select-none font-display">
                            <span className="text-[10px] !font-normal text-cheese tracking-wide leading-none filter drop-shadow">
                              {activeSlide.pricePrefix}
                            </span>
                            <span className="text-[22px] font-medium text-white tracking-wide leading-none mt-0.5 shadow-text filter drop-shadow-md">
                              {activeSlide.price}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Combo Bullet Items List */}
            <div className="space-y-3 select-none border-l-4 border-cheese pl-5 py-1">
              {activeSlide.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-cheese flex-shrink-0" />
                  <span className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-cream uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:gap-4 pt-2 w-full max-w-[480px]">
              <button
                onClick={() => onScrollToElement('menu')}
                className="flex-1 btn-primary-anim bg-[var(--color-burgundy)] text-white font-sans font-medium text-[10px] sm:text-xs uppercase tracking-wider py-3.5 px-2 sm:px-4 rounded-xl border border-white/10 btn-burgundy-shadow flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
              >
                <span className="truncate">{activeSlide.primaryCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              </button>
              <button
                onClick={() => onScrollToElement('menu')}
                className="flex-1 btn-secondary-anim font-sans font-medium text-[10px] sm:text-xs uppercase tracking-wider py-3.5 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
              >
                <span className="btn-secondary-text flex items-center justify-center gap-1.5 sm:gap-2 truncate">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  {activeSlide.secondaryCtaText}
                </span>
              </button>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* RIGHT COLUMN PLACEHOLDER TO ALLOW THE PICTURE BACKGROUND ON RIGHT TO SHINE */}
        <div className="order-1 lg:order-2 lg:col-span-5 relative flex items-center justify-center p-4 min-h-[180px] md:min-h-[220px] lg:min-h-0 select-none">

          {/* Active slide pricing sticker overlay positioned precisely on top of the design circles */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.15 }}
              className="hidden md:flex absolute right-[22%] top-[45%] md:right-[23%] md:top-[42%] lg:right-[35%] lg:top-[44%] -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center" style={{ willChange: 'transform' }}>
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
                  {/* Outer Scalloped Border with Glow */}
                  <path
                    fill="var(--color-burgundy)"
                    stroke="var(--color-cheese)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    d={renderScallopPath(28, 43, 47)}
                  />
                  {/* Inner White Scallop Accent */}
                  <path
                    fill="transparent"
                    stroke="white"
                    strokeWidth="0.8"
                    strokeDasharray="1.5,1.5"
                    strokeLinejoin="round"
                    d={renderScallopPath(28, 39, 41)}
                  />
                </svg>
                {/* Content */}
                <div className="relative z-10 text-center flex flex-col justify-center items-center select-none font-display">
                  <span className="text-[10px] md:text-xs !font-normal text-cheese tracking-wide leading-none filter drop-shadow">
                    {activeSlide.pricePrefix}
                  </span>
                  <span className="text-2xl md:text-3xl font-medium text-white tracking-wide leading-none mt-1 shadow-text filter drop-shadow-md">
                    {activeSlide.price}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Manual Slide Navigation Arrow Overlays (visible on medium & up) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex w-12 h-12 rounded-full bg-black/60 hover:bg-tomato border border-white/10 text-white items-center justify-center transition-all z-30 cursor-pointer hover:scale-110"
        title="Previous combo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex w-12 h-12 rounded-full bg-black/60 hover:bg-tomato border border-white/10 text-white items-center justify-center transition-all z-30 cursor-pointer hover:scale-110"
        title="Next combo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Manual Interactive Dot Bar Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 select-none">
        {slides.map((slide, sIdx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(sIdx)}
            className={`transition-all duration-300 h-2 rounded-full ${sIdx === currentSlide ? 'w-8 bg-cheese' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            title={`Slide ${sIdx + 1}`}
          />
        ))}
      </div>

      {/* BOTTOM TICKER PANEL */}
      <div className="relative w-full overflow-hidden bg-burgundy border-y border-[var(--color-tomato)20] py-4 select-none mt-auto flex">
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
    </section >
  );
}
