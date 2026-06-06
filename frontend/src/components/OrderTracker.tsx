import { useState, useEffect } from "react";
import {
  X,
  Flame,
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Loader,
  ClipboardList,
  ChefHat
} from "lucide-react";
import { SimulatedOrder, OrderStage } from "../types";

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  order: SimulatedOrder | null;
  onAdvanceStage?: (orderId: string, nextStage: OrderStage) => void;
}

export default function OrderTracker({
  isOpen,
  onClose,
  order,
  onAdvanceStage,
}: OrderTrackerProps) {
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes starting
  const [demoSpeedUp, setDemoSpeedUp] = useState(true); // Default to fast demo tracking speeds
  const [currentStage, setCurrentStage] = useState<OrderStage>("placed");

  useEffect(() => {
    if (order) {
      setTimeRemaining(order.deliveryTimeRemaining);
      setCurrentStage(order.stage);
    }
  }, [order]);

  // Handle countdown and stage transitions
  useEffect(() => {
    if (!isOpen || !order) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const step = demoSpeedUp ? 15 : 1; // 15x faster in demo accelerator mode!
        const nextTime = prev - step;

        if (nextTime <= 0) {
          clearInterval(interval);
          setCurrentStage("delivered");
          if (onAdvanceStage) onAdvanceStage(order.id, "delivered");
          return 0;
        }

        // Auto Advance culinary stages in Demo mode for beautiful visualization!
        if (demoSpeedUp) {
          if (
            nextTime > 1350 &&
            nextTime <= 1650 &&
            currentStage === "placed"
          ) {
            setCurrentStage("preparing");
            if (onAdvanceStage) onAdvanceStage(order.id, "preparing");
          } else if (
            nextTime > 900 &&
            nextTime <= 1350 &&
            currentStage === "preparing"
          ) {
            setCurrentStage("baking");
            if (onAdvanceStage) onAdvanceStage(order.id, "baking");
          } else if (
            nextTime > 0 &&
            nextTime <= 900 &&
            currentStage === "baking"
          ) {
            setCurrentStage("delivering");
            if (onAdvanceStage) onAdvanceStage(order.id, "delivering");
          }
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, order, demoSpeedUp, currentStage]);

  if (!isOpen || !order) return null;

  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  const timeFormatted = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  const stages: {
    stage: OrderStage;
    label: string;
    text: string;
    icon: string;
  }[] = [
      {
        stage: "placed",
        label: "1. ORDER RECEIVED",
        text: "Order mapped on terminal. Oak hearth activated.",
        icon: "📝",
      },
      {
        stage: "preparing",
        label: "2. DOUGH STRETCH",
        text: "Stretching sourdough. Infusing oregano oil.",
        icon: "🥣",
      },
      {
        stage: "baking",
        label: "3. BRICK OVEN FIRE",
        text: "Baking at 850°F on stone hearth. Bubbly cheese curls.",
        icon: "🔥",
      },
      {
        stage: "delivering",
        label: "4. SPEED DISPATCH",
        text: "Dispatched in induction-heated cases via moto-rider.",
        icon: "🛵",
      },
      {
        stage: "delivered",
        label: "5. HANDED OVER",
        text: "Scorchingly hot boxes handed over to recipient. Enjoy!",
        icon: "📦",
      },
    ];

  const getStageIndex = (stage: OrderStage) => {
    switch (stage) {
      case "placed":
        return 0;
      case "preparing":
        return 1;
      case "baking":
        return 2;
      case "delivering":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none flex items-end md:items-center justify-center md:p-4">
      {/* Dark modal overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet / Modal Container */}
      <div className="relative bg-charcoal bg-grain rounded-t-[32px] md:rounded-[28px] border-t md:border border-white/10 max-w-xl w-full p-6 md:p-8 card-pizza-shadow text-left max-h-[90vh] overflow-y-auto transform transition-transform duration-300 translate-y-0 pb-12 md:pb-8">
        {/* Mobile Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden" />

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
            <Clock
              className="w-4 h-4 text-cheese animate-spin"
              style={{ animationDuration: "6s" }}
            />
            <span className="font-mono text-sm font-medium text-cheese">
              EST: {timeFormatted}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-black/60 rounded-full text-cream hover:text-cheese transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Row */}
          <div className="border-b border-white/5 pb-4.5 flex flex-wrap items-center justify-between gap-3 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/80 text-cheese font-sans text-[10px] font-medium tracking-widest rounded-full uppercase border border-tomato/10">
                <span className="w-2 h-2 rounded-full bg-cheese animate-ping" />
                LIVE RADAR DETECTOR
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-white uppercase tracking-wide mt-1.5">
                TRACKING ORDER #{order.id}
              </h3>
            </div>

          </div>

          {/* DEMO Mode Toggle Warning for Sandbox representation */}
          <div className="bg-burgundy/30 border border-[var(--color-tomato)25] p-3 rounded-xl flex items-center justify-between text-xs font-sans text-cream/80">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-4 h-4 text-cheese animate-bounce" />
              Demo Speed Courier Mode (x15 Accelerated)
            </span>
            <button
              onClick={() => setDemoSpeedUp(!demoSpeedUp)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-medium uppercase tracking-wider select-none ${demoSpeedUp
                  ? "bg-cheese text-charcoal"
                  : "bg-charcoal text-cream border border-white/10"
                }`}
            >
              {demoSpeedUp ? "ON" : "OFF"}
            </button>
          </div>

          {/* Delivery Details cards in glass style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-charcoal-light/40 rounded-xl p-3.5 border border-white/5 text-xs text-cream/80 font-medium">
              <div className="text-cream/40 uppercase tracking-widest text-[9px] font-medium">
                RECIPIENT GUEST
              </div>
              <div className="text-white font-medium uppercase text-sm mt-1">
                {order.customerDetails.name}
              </div>
              <div className="text-[11px] text-cream/50 font-mono mt-0.5">
                {order.customerDetails.phone}
              </div>
            </div>

            <div className="bg-charcoal-light/40 rounded-xl p-3.5 border border-white/5 text-xs text-cream/80 font-medium">
              <div className="text-cream/40 uppercase tracking-widest text-[9px] font-medium">
                DISPATCHED ADDRESS
              </div>
              <div className="text-white font-medium uppercase text-sm mt-1 truncate">
                {order.customerDetails.address}
              </div>
              <div className="text-[11px] text-cheese font-sans font-medium mt-0.5">
                🛵 RIDER DISPATCHED OUT
              </div>
            </div>
          </div>

          {/* Step Timeline Graphic Tracker */}
          <div className="space-y-4 pt-2">
            <h4 className="font-sans font-medium text-xs uppercase text-cream tracking-wider">
              ORDER STYLES HISTORY PROGRESSION
            </h4>

            <div className="space-y-4 relative pl-3.5">
              {/* Vertical connecting line indicator */}
              <div className="absolute left-[21px] top-3.5 bottom-3.5 w-0.5 bg-white/5" />
              <div
                className="absolute left-[21px] top-3.5 w-0.5 bg-cheese transition-all duration-300"
                style={{ height: `${currentIndex * 24.5}%` }}
              />

              {stages.map((st, sIdx) => {
                const isCompleted = sIdx < currentIndex;
                const isActive = sIdx === currentIndex;

                return (
                  <div
                    key={st.stage}
                    className="flex gap-4 items-start text-xs font-sans relative z-10 select-none"
                  >
                    {/* Circle icon bullet */}
                    <div
                      className={`w-4 h-4 rounded-full border-4 flex items-center justify-center flex-shrink-0 relative ${isCompleted
                          ? "border-cheese bg-cheese"
                          : isActive
                            ? "border-cheese bg-charcoal"
                            : "border-charcoal-light bg-charcoal-gray"
                        }`}
                    >
                      {isActive && (
                        <span className="absolute w-1.5 h-1.5 bg-tomato rounded-full animate-ping" />
                      )}
                    </div>

                    <div className="flex-grow flex gap-3 text-left">
                      <span className="text-base leading-none select-none">
                        {st.icon}
                      </span>
                      <div className="leading-tight">
                        <div
                          className={`font-medium uppercase tracking-wider ${isActive
                              ? "text-cheese font-medium"
                              : isCompleted
                                ? "text-white/80 font-medium"
                                : "text-cream/35"
                            }`}
                        >
                          {st.label}
                        </div>
                        <p
                          className={`text-[10px] font-medium leading-tight mt-0.5 ${isActive
                              ? "text-cream/90"
                              : isCompleted
                                ? "text-cream/50"
                                : "text-cream/20"
                            }`}
                        >
                          {st.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive visual state display */}
          <div className="bg-charcoal-light/80 p-4.5 rounded-2xl flex items-center gap-4 border border-white/5 relative overflow-hidden text-left">
            {/* Display active status visuals */}
            {currentStage === "placed" && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-burgundy/50 text-cheese flex items-center justify-center animate-pulse">
                <ClipboardList className="w-6 h-6 text-cheese" />
              </div>
            )}
            {currentStage === "preparing" && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-burgundy/50 text-cheese flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-cheese" />
              </div>
            )}
            {currentStage === "baking" && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tomato/20 text-tomato flex items-center justify-center animate-bounce">
                <Flame className="w-6 h-6 text-tomato" />
              </div>
            )}
            {currentStage === "delivering" && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cheese/10 text-cheese flex items-center justify-center animate-bounce">
                <Bike className="w-6 h-6 text-cheese" />
              </div>
            )}
            {currentStage === "delivered" && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-olive/20 text-olive flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-olive" />
              </div>
            )}

            <div className="flex-grow z-10">
              <p className="font-sans text-[13px] font-bold text-white tracking-wide uppercase">
                {currentStage === "placed" && "PROCESSING TRANSACTION"}
                {currentStage === "preparing" && "PREPARING YOUR PIZZA"}
                {currentStage === "baking" && "BAKING PIZZA"}
                {currentStage === "delivering" && "DELIVERING YOUR PIZZA"}
                {currentStage === "delivered" && "PIZZA DELIVERED"}
              </p>
              <p className="font-sans text-[11px] font-medium text-cream/60 uppercase tracking-widest mt-0.5 leading-tight">
                {currentStage === "placed" &&
                  "Processing transaction and queuing into chefs baking ledger..."}
                {currentStage === "preparing" &&
                  "Kneading gourmet sourdough base and adding selected dressings..."}
                {currentStage === "baking" &&
                  "Cooking at extreme temperature (850 degrees) in wood fired brick oven..."}
                {currentStage === "delivering" &&
                  "Moto Courier speeding through grid lock. Pizza kept extremely cozy..."}
                {currentStage === "delivered" &&
                  "Cargo delivered. Slices unlocked. Grab plates immediately!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
