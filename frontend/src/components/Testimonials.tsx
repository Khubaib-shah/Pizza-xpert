import { useState, useEffect } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Testimonial } from "../types";
import { fetchLandingContent } from "../services/api";
import { IMAGE_MAP } from "../data";

const PIZZA_IMAGES = [
  IMAGE_MAP.pepperoni,
  IMAGE_MAP.cheesePull,
  IMAGE_MAP.ovenBaked,
  IMAGE_MAP.bbq,
  IMAGE_MAP.veggie,
  IMAGE_MAP.spicy,
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchLandingContent()
      .then((res) => {
        setTestimonials(res.data.testimonials || []);
      })
      .catch(() => {});
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const gridStyle = {
    backgroundImage: `linear-gradient(rgba(235, 87, 87, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(235, 87, 87, 0.15) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
    backgroundColor: "#FDF8F2",
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];
  // Assign a consistent pizza image to each testimonial index
  const assignedImage = PIZZA_IMAGES[currentIndex % PIZZA_IMAGES.length];

  return (
    <section className="relative pt-20 pb-64 overflow-hidden" style={gridStyle}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Carousel Card */}
        <div className="max-w-5xl mx-auto bg-tomato rounded-[48px] p-8 md:p-4 shadow-[0_20px_50px_rgba(235,87,87,0.4)] transition-all duration-500 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          {/* Subtle background glow or element in the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          {/* Left: Image */}
          <div className="w-full md:w-2/5  flex-shrink-0 relative z-10">
            <img
              src={assignedImage}
              alt="Customer enjoyment"
              className="w-full aspect-square object-cover rounded-[32px] shadow-xl border-4 border-white/10"
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-3/5 text-white relative z-10 flex flex-col h-full justify-center">
            <h3 className="font-display text-3xl md:text-4xl lg:text-2xl font-medium leading-wide mb-8">
              "{currentTestimonial.quote}"
            </h3>

            <div className="flex flex-col md:flex-row md:items-end justify-between mt-auto gap-6">
              {/* Author & Stars */}
              <div>
                <p className="font-sans text-lg font-bold tracking-wide mb-2">
                  - {currentTestimonial.name}
                </p>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < currentTestimonial.rating ? "fill-white text-white" : "fill-white/30 text-white/30"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <button
                  onClick={handlePrev}
                  className="size-8 rounded-full flex items-center justify-center bg-white text-tomato hover:bg-cream transition-colors shadow-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="font-sans font-bold text-lg tracking-widest min-w-[3rem] text-center">
                  {currentIndex + 1}/{testimonials.length}
                </span>
                <button
                  onClick={handleNext}
                  className="size-8 rounded-full flex items-center justify-center bg-white text-tomato hover:bg-cream transition-colors shadow-md"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stacked Pizzas Overlapping the bottom */}
      <div className="absolute -bottom-30 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[500px] md:w-[700px] lg:w-[800px]">
        <img
          src="/assets/stacked_pizzas.png"
          alt="Stacked Pizzas"
          className="w-full h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.4)] scale-150"
        />
      </div>
    </section>
  );
}
