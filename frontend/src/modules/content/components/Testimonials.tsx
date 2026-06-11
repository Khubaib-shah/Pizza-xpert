import { useState } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { Testimonial } from "../../../types";
import { useLandingContent } from "../../content/hooks/useContentQueries";
import { IMAGE_MAP } from "../../../shared/data/data";
import { CloudinaryImage } from "../../../shared/components/ui/CloudinaryImage";
import TestiTempImage from "../../../assets/images/pizza_oven_1780276189628.png";

const PIZZA_IMAGES = [
  IMAGE_MAP.pepperoni,
  IMAGE_MAP.cheesePull,
  IMAGE_MAP.ovenBaked,
  IMAGE_MAP.bbq,
  IMAGE_MAP.veggie,
  IMAGE_MAP.spicy,
];

export default function Testimonials() {
  const { data: landingContent } = useLandingContent();
  const testimonials = landingContent?.testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section
      className="relative pt-10 pb-24 md:pt-20 md:pb-64 overflow-hidden"
      style={gridStyle}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Carousel Card */}
        <div className="max-w-5xl mx-auto bg-tomato rounded-[24px] md:rounded-[48px] p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(235,87,87,0.4)] transition-all duration-500 flex flex-row items-center gap-4 sm:gap-6 md:gap-12 relative overflow-hidden">
          {/* Subtle background glow or element in the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          {/* Left: Image */}
          <div className="w-1/3 sm:w-2/5 md:w-2/5 flex-shrink-0 relative z-10">
            <CloudinaryImage
              src={TestiTempImage}
              alt="Customer enjoyment"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 rounded-[16px] md:rounded-[32px] shadow-xl border-2 md:border-4 border-white/10 aspect-square"
              sizes="(max-width: 768px) 33vw, 50vw"
            />
          </div>

          {/* Right: Content */}
          <div className="w-2/3 sm:w-3/5 md:w-3/5 text-white relative z-10 flex flex-col h-full justify-center">
            <h3 className="font-sans text-[10px] sm:text-base md:text-xl lg:text-3xl font-medium leading-tight md:leading-wide mb-3 md:mb-8">
              "{currentTestimonial.quote}"
            </h3>

            <div className="flex sm:items-end justify-between mt-auto gap-3 md:gap-6">
              {/* Author & Stars */}
              <div>
                <p className="font-sans text-[8px] md:text-lg font-normal tracking-wide mb-1 md:mb-2">
                  - {currentTestimonial.name}
                </p>
                <div className="flex items-center gap-px md:gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-2 md:w-5 md:h-5 ${i < currentTestimonial.rating ? "fill-white text-white" : "fill-white/30 text-white/30"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-2 md:gap-4 bg-white/10 px-2 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md self-start sm:self-auto">
                <button
                  onClick={handlePrev}
                  className="size-5 md:size-8 rounded-full flex items-center justify-center bg-white text-tomato hover:bg-cream transition-colors shadow-md"
                >
                  <ArrowLeft className="w-3 h-3 md:w-5 md:h-5" />
                </button>
                <span className="font-sans font-bold text-[8px] md:text-lg tracking-widest min-w-[2rem] md:min-w-[3rem] text-center">
                  {currentIndex + 1}/{testimonials.length}
                </span>
                <button
                  onClick={handleNext}
                  className="size-5 md:size-8 rounded-full flex items-center justify-center bg-white text-tomato hover:bg-cream transition-colors shadow-md"
                >
                  <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
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
