import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckSquare,
  Bell,
  ArrowUp,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedPizzas from "./components/FeaturedPizzas";
import PopularDeals from "./components/PopularDeals";
import PremiumHorizontalMenu from "./components/PremiumHorizontalMenu";
import Categories from "./components/Categories";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import DeliveryProcess from "./components/DeliveryProcess";
import AppPromo from "./components/AppPromo";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import OrderTracker from "./components/OrderTracker";
import Preloader from "./components/Preloader";
import WaveDivider from "./components/WaveDivider";
import FloatingMenu from "./components/FloatingMenu";
import useDebounce from "./hooks/useDebounce";

// Lazy load AdminPanel for code splitting
const AdminPanel = lazy(() => import("./components/AdminPanel"));
import useImagePreloader from "./hooks/useImagePreloader";
import heroBgMain from "./assets/images/1.png";
import heroBgOven from "./assets/images/2.png";
import heroBgPepperoni from "./assets/images/1.png";
import { CartItem, SimulatedOrder, Deal, OrderStage } from "./types";
import Marquee from "./components/Marquee";

export default function App() {
  const navigate = useNavigate();
  // State definitions
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("pizzaxpert_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeOrder, setActiveOrder] = useState<SimulatedOrder | null>(() => {
    const saved = localStorage.getItem("pizzaxpert_active_order");
    return saved ? JSON.parse(saved) : null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms debounce
  const [selectedCategory, setSelectedCategory] = useState("veg");
  const [cartOpen, setCartOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Success Toast system state
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    visible: boolean;
  } | null>(null);
  const [appReady, setAppReady] = useState(false);

  const assetsReady = useImagePreloader([
    heroBgMain,
    heroBgOven,
    heroBgPepperoni,
  ]);

  useEffect(() => {
    if (assetsReady) {
      const timeout = window.setTimeout(() => setAppReady(true), 150);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [assetsReady]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("pizzaxpert_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem(
        "pizzaxpert_active_order",
        JSON.stringify(activeOrder),
      );
    } else {
      localStorage.removeItem("pizzaxpert_active_order");
    }
  }, [activeOrder]);

  // Monitor screen scroll to display floating "Back to top" anchors
  useEffect(() => {
    document.title = "Pizza Xpert | The Best Authentic Woodfire Pizza Delivery Deals";
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Toast notifier trigger
  const showNotification = (message: string) => {
    const id = Date.now();
    setToast({ id, message, visible: true });
    setTimeout(() => {
      setToast((prev) =>
        prev?.id === id ? { ...prev, visible: false } : prev,
      );
    }, 3000);
  };

  // Add Item to cart (recalculated and stacked with hash match)
  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    // Generate unique identification signature based on full ingredient customizations
    const customHash = `${item.pizza.id}-${item.customization.size}-${item.customization.crust}-${item.customization.sauce}-${item.customization.extraCheese ? "ex-ch" : "no-ch"}-${item.customization.extraToppings.sort().join(",")}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((c) => c.id === customHash);
      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx].quantity += item.quantity;
        return nextCart;
      } else {
        return [...prevCart, { ...item, id: customHash }];
      }
    });

    showNotification(`🔥 Loaded: ${item.pizza.name} in Cart!`);
  };

  // Special bundle compiler and loader to shopping basket
  const handleAddSpecialDealToCart = (deal: Deal) => {
    // Map deals to custom Pizza models so orders checkout cleanly
    const mockPizzaSpecial = {
      id: `special-deal-${deal.id}`,
      name: deal.title,
      tagline: "PREMIUM BUNDLE DEAL",
      description: deal.description,
      price: deal.dealPrice,
      image: "/src/assets/images/pizza_hero_1780276120368.png", // hero design
      category: "loaded",
      isVeg: false,
      isSpicy: false,
      isPopular: true,
      rating: 5.0,
      reviewsCount: 999,
      cookingTime: "15-20 min",
      tags: ["BARGAIN BUNDLE", deal.discountBadge],
    };

    const defaultCustomization = {
      size: 'Monster (16")' as any,
      crust: "Classic Hand-Tossed" as any,
      sauce: "Deep Tomato Marinara" as any,
      extraCheese: true,
      extraToppings: ["Sizzling Pepperoni", "Double Herb Cheese"],
    };

    handleAddToCart({
      pizza: mockPizzaSpecial,
      quantity: 1,
      customization: defaultCustomization,
      pricePerItem: deal.dealPrice,
    });

    showNotification(`⚡ Claimed: ${deal.title} Promo Basket!`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.id === id) {
              const nextQty = item.quantity + delta;
              return nextQty > 0 ? { ...item, quantity: nextQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showNotification("🗑️ Item removed from platter.");
  };

  // On Checkout Completion
  const handleCheckoutComplete = (order: SimulatedOrder) => {
    setActiveOrder(order);
    setCart([]); // Clear cart basket database
    setTrackerOpen(true); // Automatically trigger live monitoring radar
    showNotification("🚀 TRANSFERRED! Pizza oven fired up!");
  };

  // Handle live tracking stage increments from simulated dispatchers
  const handleAdvanceStage = (orderId: string, nextStage: OrderStage) => {
    setActiveOrder((prev) => {
      if (prev && prev.id === orderId) {
        return { ...prev, stage: nextStage };
      }
      return prev;
    });
  };

  // Smooth-scroll anchor helper
  const handleScrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Quick total quantity display
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!appReady) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="relative min-h-screen bg-charcoal bg-grain text-cream select-none antialiased">
            {/* ━━ NAVBAR SECTION (1) ━━ */}
            <Navbar
              cart={cart}
              cartCount={cartCount}
              onCartToggle={() => setCartOpen(!cartOpen)}
              onTrackOrderToggle={() => {
                if (activeOrder) {
                  setTrackerOpen(true);
                } else {
                  showNotification(
                    "🤔 You don’t have an active dispatch order to track. Grab pizza first!",
                  );
                }
              }}
              onScrollToElement={handleScrollToElement}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onToggleAdmin={() => navigate("/admin")}
            />

            {/* ━━ HERO SECTION (2) ━━ */}
            <Hero onScrollToElement={handleScrollToElement} />
            <Marquee />

            <WaveDivider className="mt-[-1px] relative z-20" />

            {/* ━━ CATEGORIES SECTION (5) ━━ */}
            <Categories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onScrollToElement={handleScrollToElement}
            />

            {/* ━━ FEATURED SIGNATURE MENU (3) ━━ */}
            <FeaturedPizzas
              onAddToCart={handleAddToCart}
              searchQuery={debouncedSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryVisible={setSelectedCategory}
            />

            {/* ━━ POPULAR COUPON DEALS (4) ━━ */}
            <PopularDeals onAddSpecialDealToCart={handleAddSpecialDealToCart} />

            {/* ━━ PREMIUM HORIZONTAL DEALS (4.5) ━━ */}
            <PremiumHorizontalMenu onAddSpecialDealToCart={handleAddSpecialDealToCart} />

            {/* ━━ WHY CHOOSE US (6) ━━ */}
            <WhyChooseUs />

            {/* ━━ TESTIMONIALS REVIEWS (7) ━━ */}
            <Testimonials />

            {/* ━━ LOGISTICS COURIER STEPS (8) ━━ */}
            <DeliveryProcess />

            {/* ━━ MOBILE PROMOTIONS (9) ━━ */}
            <AppPromo />

            {/* ━━ CTA CONVERSION BANNER (10) ━━ */}
            <CTABanner onScrollToElement={handleScrollToElement} />

            {/* ━━ FOOTER INDEX (11) ━━ */}
            <Footer
              onScrollToElement={handleScrollToElement}
              onTrackOrderToggle={() => {
                if (activeOrder) {
                  setTrackerOpen(true);
                } else {
                  showNotification(
                    "🤔 Please place an order first to track live!",
                  );
                }
              }}
            />

            {/* ━━ SHOPPING BASKET DRAWER OVERLAY ━━ */}
            <CartSidebar
              isOpen={cartOpen}
              onClose={() => setCartOpen(false)}
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckoutComplete}
            />

            {/* ━━ LIVE PIZZA DISPATCH RADAR RADAR ━━ */}
            <OrderTracker
              isOpen={trackerOpen}
              onClose={() => setTrackerOpen(false)}
              order={activeOrder}
              onAdvanceStage={handleAdvanceStage}
            />

            {/* ━━ INTERACTIVE SUCCESS FLOATING ALERTS ━━ */}
            {toast && toast.visible && (
              <div className="fixed bottom-6 left-6 z-50 bg-charcoal border-2 border-cheese rounded-2xl p-4 shadow-[0_12px_40px_rgba(245,177,9,0.5)] max-w-sm animate-fade-in flex items-center gap-3 select-none">
                <div className="w-9 h-9 bg-burgundy rounded-xl flex items-center justify-center border border-tomato/30 flex-shrink-0 animate-bounce">
                  <Bell className="w-5 h-5 text-cheese" />
                </div>
                <div>
                  <div className="font-display text-sm font-medium text-white uppercase select-none">
                    PIZZA XPERT RADAR
                  </div>
                  <p className="font-sans text-[11px] font-medium text-cheese uppercase tracking-wider mt-0.5 leading-tight">
                    {toast.message}
                  </p>
                </div>
              </div>
            )}

            {/* ━━ BACK TO TOP CORNER FLOATER ━━ */}
            {showScrollTop && (
              <FloatingMenu
                onTrackOrder={() => {
                  if (activeOrder) {
                    setTrackerOpen(true);
                  } else {
                    showNotification(
                      "🤔 Please place an order first to track live!",
                    );
                  }
                }}
              />
            )}
          </div>
        }
      />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<Preloader />}>
            <AdminPanel onBackToStore={() => navigate("/")} />
          </Suspense>
        }
      />
    </Routes>
  );
}
