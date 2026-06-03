import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { Testimonial } from '../types';
import { fetchLandingContent } from '../services/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchLandingContent().then((res) => {
      setTestimonials(res.data.testimonials || []);
    }).catch(() => { });
  }, []);
  return (
    <section className="relative bg-cream bg-grain py-20 px-4 md:px-6 overflow-hidden text-charcoal">

      {/* Decorative Warm Backglowing element */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-tomato/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Title sections */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-burgundy text-cheese rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
            💬 FEAST REVIEWS
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-charcoal tracking-wide uppercase leading-none">
            CRAFTED FOR REAL <span className="text-burgundy text-glow-red">PIZZA</span> LOVERS
          </h2>
          <div className="w-16 h-1 bg-burgundy mx-auto rounded-full" />
          <p className="font-sans text-charcoal/75 text-xs md:text-sm max-w-sm mx-auto font-bold uppercase tracking-wider">
            Verified ratings uploaded directly from metropolitan food forums and gourmet tables.
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={String(test.id || (test as any)._id)}
              className="group relative bg-white/90 rounded-[24px] p-7 md:p-8 border border-cream/20 hover:border-burgundy/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between shadow-xl shadow-cream/30/50 hover:shadow-2xl"
            >
              {/* Massive quotation marks behind content */}
              <div className="absolute top-4 right-6 font-display text-7xl md:text-8xl text-cheese/20 group-hover:text-cheese/45 transition-colors select-none pointer-events-none z-0">
                “
              </div>

              <div className="space-y-5 relative z-10 text-left">
                {/* Stars and rating block */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: test.rating }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-4.5 h-4.5 fill-cheese text-cheese" />
                  ))}
                  <span className="font-sans text-xs font-black text-charcoal/50 ml-1">5.0 SCORE</span>
                </div>

                {/* Review quote cursive-style italic blend */}
                <p className="font-sans text-xs md:text-sm font-semibold italic text-charcoal/80 leading-tight">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Footer block */}
              <div className="flex items-center gap-4.5 pt-5 mt-6 border-t border-cream/40 relative z-10 text-left">
                {/* Initials circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-black text-white shadow-md ${test.avatarColor}`}>
                  {test.avatarInitials}
                </div>

                <div>
                  <h3 className="font-display text-lg font-black text-charcoal uppercase leading-none tracking-wide">
                    {test.name}
                  </h3>
                  <p className="font-mono text-[10px] text-tomato/70 uppercase tracking-widest font-black mt-0.5 leading-none">
                    📍 {test.location}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
