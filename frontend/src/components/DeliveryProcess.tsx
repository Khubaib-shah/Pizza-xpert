import { ShoppingBag, Sliders, CreditCard, Bike } from 'lucide-react';
import { DELIVERY_STEPS } from '../data';

export default function DeliveryProcess() {

  // Lucide helper maps dynamically
  const renderStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-charcoal" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-charcoal" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-charcoal" />;
      case 'Bike':
        return <Bike className="w-6 h-6 text-charcoal" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-charcoal" />;
    }
  };

  return (
    <section className="relative bg-charcoal bg-grain py-20 px-4 md:px-6 overflow-hidden">

      {/* Decorative Warm Red Backglow */}
      <div className="absolute top-1/2 left-0 w-36 h-36 bg-burgundy/10 rounded-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Header section titles */}
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/50 text-cheese rounded-full text-xs font-black uppercase tracking-widest border border-white/5">
            ⚡ WARP DISPATCH LOGISTICS
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
            OUR <span className="text-cheese text-glow-gold">DELIVERY</span> PROCESS
          </h2>
          <div className="w-16 h-1 bg-[#E63946] mx-auto rounded-full" />
          <p className="font-sans text-cream/70 text-xs md:text-sm max-w-sm mx-auto font-medium uppercase tracking-wider">
            Chronological blueprint mapping our high-converting speed tunnel from oven peel to front porch.
          </p>
        </div>

        {/* 4-Step Process with adaptive connecting lines */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Horizontal connecting dashed line on desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#F5B109]/30 -z-0" />

          {DELIVERY_STEPS.map((step) => {
            return (
              <div
                key={step.step}
                className="group relative flex flex-col items-center text-center space-y-4 select-none z-10"
              >

                {/* Yellow Icon Circle with Mini Black Step Badge inside */}
                <div className="relative w-14 h-14 rounded-full bg-[#F5B109] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-[5deg]">
                  {renderStepIcon(step.iconName)}

                  {/* Absolute dark counter circle */}
                  <span className="absolute -bottom-1 -right-1 bg-charcoal text-[#F5B109] font-mono text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-[#F5B109]/40">
                    {step.step}
                  </span>
                </div>

                {/* Steps Descriptions */}
                <div className="space-y-1.5 max-w-xs text-center">
                  <h3 className="font-display text-xl font-bold tracking-wide text-white group-hover:text-cheese transition-colors uppercase leading-none">
                    {step.title}
                  </h3>
                  <p className="font-sans text-cream/70 text-[11px] md:text-xs leading-tight font-semibold">
                    {step.description}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
