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
import Navbar from './shared/components/layout/Navbar';
import Hero from './modules/content/components/Hero';
import FeaturedPizzas from './modules/menu/components/FeaturedPizzas';
import PopularDeals from './modules/menu/components/PopularDeals';
import PremiumHorizontalMenu from './modules/menu/components/PremiumHorizontalMenu';
import Categories from './modules/menu/components/Categories';
import WhyChooseUs from './modules/content/components/WhyChooseUs';
import Testimonials from './modules/content/components/Testimonials';
import DeliveryProcess from './modules/content/components/DeliveryProcess';
import AppPromo from './modules/content/components/AppPromo';
import CTABanner from './modules/content/components/CTABanner';
import Footer from './shared/components/layout/Footer';
import CartSidebar from './modules/cart/components/CartSidebar';
import OrderTracker from './modules/orders/components/OrderTracker';
import Preloader from './shared/components/ui/Preloader';
import WaveDivider from './shared/components/ui/WaveDivider';
import FloatingMenu from './shared/components/layout/FloatingMenu';
import useDebounce from './shared/hooks/useDebounce';

// Lazy load AdminPanel for code splitting
const AdminPanel = lazy(() => import("./app/routes/admin/AdminPanel"));
import useImagePreloader from './shared/hooks/useImagePreloader';
import heroBgMain from './assets/images/1.png';
import heroBgOven from './assets/images/2.png';
import heroBgPepperoni from './assets/images/1.png';
import { Deal, OrderStage, CartItem, SimulatedOrder } from './types';
import Marquee from './modules/content/components/Marquee';
import { useCartStore } from './modules/cart/store/cart.store';
import { useOrderStore } from './modules/orders/store/order.store';
import { useToastStore } from './shared/hooks/useToastStore';

export default function App() {
  const navigate = useNavigate();
  // Zustand Stores
  const { items: cart, addToCart: handleAddToCartRaw, updateQuantity: handleUpdateQuantity, removeItem: handleRemoveItem, clearCart } = useCartStore();
  const { activeOrder, trackerOpen, setActiveOrder, setTrackerOpen, advanceStage: handleAdvanceStage } = useOrderStore();
  const { toast, showNotification } = useToastStore();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms debounce
  const [selectedCategory, setSelectedCategory] = useState("veg");
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Add Item to cart (recalculated and stacked with hash match)
  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    handleAddToCartRaw(item);
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

  const handleRemoveItemWithToast = (id: string) => {
    handleRemoveItem(id);
    showNotification("🗑️ Item removed from platter.");
  };

  // On Checkout Completion
  const handleCheckoutComplete = (order: SimulatedOrder) => {
    setActiveOrder(order);
    clearCart(); // Clear cart basket database
    setTrackerOpen(true); // Automatically trigger live monitoring radar
    showNotification("🚀 TRANSFERRED! Pizza oven fired up!");
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
              onRemoveItem={handleRemoveItemWithToast}
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
