import { useState, useEffect } from 'react';
import { ChefHat, Search, ShoppingBag, Menu, X, Trash2, Sliders } from 'lucide-react';
import { CartItem } from '../types';
import Logo from './Logo';

export function PizzaXpertLogo() {
  return <Logo variant="light" />;
}

interface NavbarProps {
  cart: CartItem[];
  cartCount: number;
  onCartToggle: () => void;
  onTrackOrderToggle: () => void;
  onScrollToElement: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleAdmin: () => void;
}

export default function Navbar({
  cart,
  cartCount,
  onCartToggle,
  onTrackOrderToggle,
  onScrollToElement,
  searchQuery,
  onSearchChange,
  onToggleAdmin
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Menu', id: 'menu' },
    { label: 'Deals', id: 'deals' },
    { label: 'Track Order', action: onTrackOrderToggle },
    { label: 'About', id: 'about' }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (item.id) {
      onScrollToElement(item.id);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${isScrolled
            ? 'nav-blur py-2 md:py-2.5 shadow-2xl border-white/5 bg-charcoal/85'
            : 'bg-charcoal/50 backdrop-blur-sm py-4 md:py-4.5 border-white/5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

          {/* Logo Brand Locked */}
          <div className="cursor-pointer" onClick={() => onScrollToElement('home')}>
            <PizzaXpertLogo />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className="font-sans font-bold text-sm tracking-wide text-cream/80 hover:text-cheese transition-colors uppercase cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Area Tools */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Search Input Toggle */}
            <div className="relative">
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search craft pizzas..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (e.target.value) {
                      onScrollToElement('menu');
                    }
                  }}
                  className="bg-charcoal/95 border border-cream/10 rounded-lg py-1.5 pl-3 pr-8 text-xs text-cream focus:outline-none focus:border-cheese w-36 md:w-52 transition-all font-sans"
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-white/5 rounded-full text-cream/90 hover:text-cheese transition-colors"
                title="Search menu"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Widget Trigger */}
            <button
              onClick={onCartToggle}
              className="relative p-2 hover:bg-white/5 rounded-full text-cream/90 hover:text-cheese transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-tomato text-white font-sans text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-charcoal">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Backstage Portal Trigger */}
            <button
              onClick={onToggleAdmin}
              className="bg-[#111111]/90 hover:bg-[#F5B109] text-[#F5B109] hover:text-black border border-[#F5B109]/30 rounded-xl py-2.5 px-4 font-sans font-bold text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              title="Enter Admin backplane"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin Deck</span>
            </button>

            {/* CTA Order Button */}
            <button
              onClick={() => onScrollToElement('menu')}
              className="hidden sm:block bg-burgundy text-cheese hover:bg-tomato hover:text-white font-sans font-bold text-xs uppercase tracking-wide py-2.5 px-5 rounded-xl border border-cheese/20 transition-all duration-300 cursor-pointer"
            >
              Order Now
            </button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-cream hover:text-cheese transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Nav slide-in Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-charcoal/98 flex flex-col justify-between pt-24 pb-8 px-6 animate-fade-in">

          {/* Header row in mobile overlay */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-white/5 rounded-full text-cream"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-center">
            <div className="mb-4 flex justify-center">
              <PizzaXpertLogo />
            </div>

            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className="font-sans font-bold text-2xl tracking-wide text-[#F8F3E7] hover:text-cheese transition-colors py-2 uppercase border-b border-white/5"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToElement('menu');
              }}
              className="w-full bg-burgundy hover:bg-tomato text-cheese hover:text-white font-sans font-bold text-sm tracking-wide py-4 rounded-xl transition-all uppercase"
            >
              Instant Cheesiness
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleAdmin();
              }}
              className="w-full bg-[#111111] border border-[#F5B109]/30 text-[#F5B109] font-sans font-bold text-sm tracking-wide py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#F5B109]" />
              <span>Admin Deck</span>
            </button>
            <div className="text-center text-[11px] text-cream/40 font-mono">
              SUPPORT: 1-800-PIZZA-XPERT
            </div>
          </div>
        </div>
      )}
    </>
  );
}
