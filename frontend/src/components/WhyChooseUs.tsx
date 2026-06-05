import { Flame, Star, Zap, ShoppingBag } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Flame className="w-8 h-8 text-cheese" />,
      title: 'FRESH DAILY',
      description: 'Dough fermented 48 hours for premium bubbles, made fresh every single morning by our certified master bakers.',
      stat: '48H DOUGH'
    },
    {
      icon: <Zap className="w-8 h-8 text-cheese" />,
      title: '30 MIN DELIVERY',
      description: 'Dispatched in special induction pre-heated cases. Sizzling hot at your doorstep in under 30 minutes or it\'s free.',
      stat: '🏎 SECURE DISPATCH'
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-cheese" />,
      title: 'REAL CHEESE ONLY',
      description: '100% premium local Wisconsin whole-milk mozzarella. No starch, no substitutes, no compromise on stretchability.',
      stat: '🥇 WISCONSIN A++'
    },
    {
      icon: <Star className="w-8 h-8 text-cheese" />,
      title: '5-STAR RATING',
      description: 'Verified with Behance-grade food ratings. Over 12,000+ happy fast-food connoisseurs in the metropolitan zone.',
      stat: '12K+ HAPPY'
    }
  ];

  return (
    <section id="about" className="relative bg-charcoal-gray py-20 px-4 md:px-6">

      {/* Decorative side vignetting shadow border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/5" />

      <div className="max-w-7xl mx-auto">

        {/* Title sections */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/50 text-cheese rounded-full text-xs font-medium uppercase tracking-wide border border-white/5">
            🛡 THE PIZZA XPERT GUARANTEE
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-white tracking-wide uppercase leading-none">
            WHY PIZZA <span className="text-cheese">XPERT</span> RULES
          </h2>
          <div className="w-16 h-1 bg-tomato mx-auto rounded-full" />
          <p className="font-sans text-cream/70 text-xs md:text-sm max-w-sm mx-auto font-medium uppercase tracking-wider">
            Our strict culinary bylaws guarantee gold-plated speed without sacrificial taste degradation.
          </p>
        </div>

        {/* 4 Feature Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              style={{ willChange: 'transform' }}
              className="group relative bg-charcoal-light/40 hover:bg-charcoal-light/80 rounded-[24px] p-6 md:p-8 border border-white/5 hover:border-burgundy/30 transition-colors duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >

              {/* Corner Small Stat Badge watermark */}
              <div className="absolute top-4 right-4 font-mono text-[9px] font-medium text-cheese/20 group-hover:text-cheese/50 transition-colors duration-200 uppercase tracking-widest">
                {feat.stat}
              </div>

              <div className="space-y-4">
                {/* Yellow Icon Wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-charcoal text-cheese flex items-center justify-center border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110">
                  {feat.icon}
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="font-display text-[22px] font-medium text-white group-hover:text-cheese tracking-wide uppercase transition-colors duration-200">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-cream/70 text-xs font-medium leading-tight">
                    {feat.description}
                  </p>
                </div>
              </div>

              {/* Accent active line at bottom */}
              <div className="w-0 group-hover:w-full h-1 bg-cheese transition-[width] duration-300 rounded-full mt-6" />

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

