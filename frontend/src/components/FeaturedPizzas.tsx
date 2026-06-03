import { useState, useEffect } from 'react';
import { Star, Clock, Flame, Sliders, Check, Plus, Minus, X, Info, Loader2 } from 'lucide-react';
import { Pizza, PizzaCustomization, CartItem } from '../types';
import { fetchPizzas, fetchMenuConfig, fetchCategories } from '../services/api';

interface FeaturedPizzasProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  searchQuery: string;
  selectedCategory: string;
  onCategoryVisible?: (id: string) => void;
}

export default function FeaturedPizzas({
  onAddToCart,
  searchQuery,
  selectedCategory,
  onCategoryVisible
}: FeaturedPizzasProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customizingPizza, setCustomizingPizza] = useState<Pizza | null>(null);

  // Dynamic menu config from backend
  const [menuConfig, setMenuConfig] = useState<any>(null);
  // API categories
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchPizzas()
      .then((res) => {
        const mapped = res.data.map((p: any) => ({ ...p, id: p._id }));
        setPizzas(mapped);
      })
      .catch(() => setError('Failed to load pizzas. Please try again.'))
      .finally(() => setLoading(false));

    fetchMenuConfig()
      .then((res) => setMenuConfig(res.data))
      .catch(() => console.warn('Menu config not available, using defaults'));

    fetchCategories()
      .then((res) => setApiCategories(res.data))
      .catch(() => console.warn('Categories not available, falling back'));
  }, []);

  useEffect(() => {
    if (!onCategoryVisible) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          onCategoryVisible(visibleEntries[0].target.id.replace('category-', ''));
        }
      },
      { rootMargin: '-20% 0px -75% 0px', threshold: 0 }
    );

    const sections = document.querySelectorAll('.menu-category-section');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [onCategoryVisible, pizzas]);

  // Derive menu options: use API data if available, else fall back to defaults
  const availableSizes = menuConfig?.sizes?.filter((s: any) => s.isAvailable).map((s: any) => s.name) ||
    ['Personal (8")', 'Medium (12")', 'Monster (16")'];
  const availableCrusts = menuConfig?.crusts?.filter((c: any) => c.isAvailable).map((c: any) => c.name) ||
    ['Classic Hand-Tossed', 'Crispy Thin Crust', 'Stuffed Cheese Crust', 'Gluten-Free Pan'];
  const availableSauces = menuConfig?.sauces?.filter((s: any) => s.isAvailable).map((s: any) => s.name) ||
    ['Deep Tomato Marinara', 'Spicy Garlic Chili', 'Zesty Smoky BBQ', 'Creamy White Alfredo'];
  const availableToppings: Record<string, number> = menuConfig?.toppings
    ? Object.fromEntries(menuConfig.toppings.filter((t: any) => t.isAvailable).map((t: any) => [t.name, t.price]))
    : { 'Sizzling Pepperoni': 200, 'Artisan Sausage': 225, 'Grilled Herb Chicken': 200, 'Sautéed Mushrooms': 125, 'Greek Feta Chunks': 150 };
  const extraCheesePrice = menuConfig?.extraCheesePrice ?? 200;

  // Customization Form States
  const [size, setSize] = useState<string>(availableSizes[1] || 'Medium (12")');
  const [crust, setCrust] = useState<string>(availableCrusts[0] || 'Classic Hand-Tossed');
  const [sauce, setSauce] = useState<string>(availableSauces[0] || 'Deep Tomato Marinara');
  const [extraCheese, setExtraCheese] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  // Open Customizer Modal with defaults
  const handleOpenCustomizer = (pizza: Pizza) => {
    setCustomizingPizza(pizza);
    setSize('Medium (12")');
    setCrust('Classic Hand-Tossed');
    setSauce('Deep Tomato Marinara');
    setExtraCheese(false);
    setSelectedToppings([]);
    setActiveStep(1);
  };

  // Quick Direct Add (Chef's Standard Setup)
  const handleQuickAdd = (pizza: Pizza) => {
    const defaultCustomization: PizzaCustomization = {
      size: 'Medium (12")',
      crust: 'Classic Hand-Tossed',
      sauce: 'Deep Tomato Marinara',
      extraCheese: false,
      extraToppings: []
    };

    onAddToCart({
      pizza,
      quantity: 1,
      customization: defaultCustomization,
      pricePerItem: pizza.price
    });
  };

  // Toggle Toppings
  const handleToggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Calculate current customized cost dynamically using API config
  const calculateCustomizedPrice = () => {
    if (!customizingPizza) return 0;
    let price = customizingPizza.price;

    // Size pricing adjustment (from menuConfig)
    if (menuConfig?.sizes) {
      const sizeConfig = menuConfig.sizes.find((s: any) => s.name === size);
      if (sizeConfig) price += sizeConfig.priceModifier;
    } else {
      if (size === 'Personal (8")') price -= 300;
      if (size === 'Monster (16")') price += 500;
    }

    // Crust pricing adjustment (from menuConfig)
    if (menuConfig?.crusts) {
      const crustConfig = menuConfig.crusts.find((c: any) => c.name === crust);
      if (crustConfig) price += crustConfig.priceModifier;
    } else {
      if (crust === 'Stuffed Cheese Crust') price += 350;
    }

    // Extra Cheese
    if (extraCheese) price += extraCheesePrice;

    // Premium Toppings sum
    selectedToppings.forEach((topping) => {
      price += availableToppings[topping] || 0;
    });

    return Math.round(price);
  };

  // Save customize and Add to cart
  const handleSaveCustomization = () => {
    if (!customizingPizza) return;

    const customization: PizzaCustomization = {
      size,
      crust,
      sauce,
      extraCheese,
      extraToppings: selectedToppings
    };

    onAddToCart({
      pizza: customizingPizza,
      quantity: 1,
      customization,
      pricePerItem: calculateCustomizedPrice()
    });

    setCustomizingPizza(null);
  };

  // Filter conditions based on Search only (Category is now grouped)
  const searchMatchedPizzas = pizzas.filter((pizza) => {
    return pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <section id="menu" className="relative bg-charcoal bg-grain py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 text-cheese animate-spin" />
          <p className="text-cream/60 font-sans font-bold uppercase tracking-widest text-xs">Loading Menu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="relative bg-charcoal bg-grain py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
          <Info className="w-12 h-12 text-tomato" />
          <p className="text-cream/60 font-sans font-bold uppercase tracking-widest text-xs">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="relative bg-charcoal bg-grain py-20 px-4 md:px-6">

      {/* Decorative Sauce Splash Accent top-right */}
      <div className="absolute top-10 right-0 w-44 h-44 bg-burgundy/10 rounded-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Section Headings */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-burgundy/50 text-cheese hover:bg-tomato hover:text-cream rounded-full text-xs font-bold uppercase tracking-wide border border-tomato/10">
            🥇 OUR SPECIALTIES
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-cream tracking-wide uppercase leading-none">
            OUR <span className="text-cheese text-glow-gold">SIGNATURE</span> PIZZAS
          </h2>
          <div className="w-24 h-1.5 bg-cheese mx-auto rounded-full mt-2" />
          <p className="font-sans text-cream/70 text-sm md:text-base max-w-xl mx-auto font-medium">
            Meticulously engineered recipes carrying real craft history. Fully customizable with authentic Italian dough crust extensions.
          </p>
        </div>

        {/* Menu Sections by Category */}
        {searchMatchedPizzas.length > 0 ? (
          <div className="space-y-20">
            {(apiCategories.length > 0 ? apiCategories : [
              { slug: 'veg', name: 'Veg Decor' },
              { slug: 'non-veg', name: 'Meat Crown' },
              { slug: 'cheesy', name: 'Cheese Drip' },
              { slug: 'bbq', name: 'Sweet BBQ' },
              { slug: 'spicy', name: 'Spicy Fire' },
              { slug: 'classic', name: 'Classic Herb' },
              { slug: 'loaded', name: 'Lava Loaded' },
            ]).filter(c => c.slug !== 'all').map((category) => {
              const categoryPizzas = searchMatchedPizzas.filter((pizza) => {
                if (category.slug === 'veg') return pizza.isVeg === true;
                if (category.slug === 'non-veg') return pizza.isVeg === false;
                if (category.slug === 'spicy') return pizza.isSpicy === true;
                if (category.slug === 'cheesy') return pizza.category === 'cheesy';
                if (category.slug === 'bbq') return pizza.category === 'bbq';
                if (category.slug === 'loaded') return pizza.category === 'loaded';
                if (category.slug === 'classic') return pizza.category === 'classic' || pizza.tags?.includes('CLASSIC HERB');
                return false;
              });

              if (categoryPizzas.length === 0) return null;

              return (
                <div key={category.slug || category._id} id={`category-${category.slug}`} className="menu-category-section scroll-mt-32">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-cheese uppercase mb-8 border-b border-white/10 pb-3 flex items-center gap-3">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryPizzas.map((pizza) => (
                      <div
                        key={pizza.id}
                        className="group relative bg-charcoal-light/80 rounded-[24px] border border-white/5 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 card-pizza-shadow card-pizza-shadow-hover hover:border-burgundy/50 flex flex-col justify-between"
                      >

                {/* Image Wrap */}
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  {/* Subtle vignette layer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-transparent to-black/20 z-10" />

                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0 filter saturate(1.15) brightness-[1.02] contrast(1.08)"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges in visual header */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    {pizza.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-sans font-black text-[9px] tracking-widest text-charcoal bg-cheese py-1 px-2.5 rounded-full uppercase shadow-md pointer-events-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Cooking time badge */}
                  <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-charcoal/90 text-cream/90 rounded-full text-[10px] font-bold border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-cheese" />
                    <span>{pizza.cookingTime}</span>
                  </div>
                </div>

                {/* Info and Purchase Elements */}
                <div className="p-6 md:p-7 flex flex-col flex-grow justify-between space-y-4">

                  {/* Card Title & Taglines */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[11px] font-black text-tomato tracking-widest uppercase">
                        {pizza.tagline}
                      </span>
                      {/* Veg Indicator Badge */}
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${pizza.isVeg ? 'border-olive bg-olive/20' : 'border-tomato bg-tomato/20'
                          }`}
                        title={pizza.isVeg ? 'Vegetarian' : 'Contains Meat'}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${pizza.isVeg ? 'bg-olive' : 'bg-tomato'}`} />
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-[26px] font-medium tracking-wide leading-tight text-white group-hover:text-cheese transition-colors uppercase">
                      {pizza.name}
                    </h3>

                    <p className="font-sans text-xs text-cream/70 line-clamp-3 leading-tight font-medium">
                      {pizza.description}
                    </p>
                  </div>

                  {/* Rating / Metadata Reviewers Row */}
                  <div className="flex items-center justify-between py-2 border-y border-white/5 font-sans">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-cheese text-cheese" />
                      <span className="text-sm font-black text-cream">{pizza.rating}</span>
                      <span className="text-[11px] text-cream/50">({pizza.reviewsCount} reviews)</span>
                    </div>
                    <div>
                      {pizza.isSpicy && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-tomato/20 text-tomato text-[9px] font-extrabold rounded-md uppercase">
                          <Flame className="w-3 h-3 fill-tomato" /> SPICY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Purchase footer block */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div>
                      <div className="font-sans text-[10px] font-bold text-cream/40 uppercase tracking-widest leading-none">
                        CRUST INCLUDED
                      </div>
                      <div className="font-display text-3xl font-medium text-cheese text-glow-gold mt-1">
                        Rs {pizza.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenCustomizer(pizza)}
                        className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cheese/35 text-cream rounded-xl transition-all cursor-pointer"
                        title="Customize toppings and sizes"
                      >
                        <Sliders className="w-4.5 h-4.5" />
                      </button>

                      <button
                        onClick={() => handleQuickAdd(pizza)}
                        className="btn-primary-anim bg-burgundy text-cheese hover:bg-tomato hover:text-cream font-sans font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 border border-tomato/20 active:scale-95 cursor-pointer"
                      >
                        Add Basic
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-charcoal-light/40 rounded-3xl border border-dashed border-white/10 max-w-lg mx-auto">
            <Info className="w-12 h-12 text-cheese mx-auto mb-4 opacity-70 animate-pulse" />
            <h3 className="font-display text-2xl font-black text-cream mb-2 uppercase">NO PIZZAS FOUND MATCHING FILTER</h3>
            <p className="font-sans text-xs text-cream/60 px-6">
              Our master pizzaiolo hasn't cataloged details under those keyword specifications. Swipe back to another selection chip!
            </p>
          </div>
        )}

      </div>

      {/* PIZZA CUSTOMIZATION DRAWER MODAL OVERLAY */}
      {customizingPizza && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-end md:items-center justify-center md:p-6 backdrop-blur-md animate-fade-in">
          <div className="relative bg-charcoal-gray rounded-t-[32px] md:rounded-[24px] border-t md:border border-white/10 max-w-5xl w-full max-h-[90vh] md:max-h-[95vh] overflow-hidden card-pizza-shadow flex flex-col text-left animate-slide-up md:animate-none pb-safe">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:px-8 border-b border-white/5 bg-charcoal-gray z-20">
              <h2 className="font-display text-xl !font-normal text-cream uppercase tracking-wide">Customize Order</h2>
              <button
                onClick={() => setCustomizingPizza(null)}
                className="p-2 bg-white/5 rounded-full text-cream/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">

              {/* Left Column - Preview (Sticky on Desktop) */}
              <div className="w-full lg:w-5/12 bg-charcoal-800 border-r border-white/5 p-4 md:p-6 lg:p-8 flex flex-col shrink-0">
                <div className="relative aspect-square w-full max-w-[140px] md:max-w-[200px] lg:max-w-none mx-auto mb-2 lg:mb-6">
                  {/* Subtle dynamic glow based on selections */}
                  <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${extraCheese ? 'bg-cheese' : 'bg-tomato'}`} />
                  <img
                    src={customizingPizza.image}
                    alt={customizingPizza.name}
                    className="w-full h-full object-cover rounded-full border-4 border-charcoal shadow-2xl relative z-10 filter transition-all duration-500"
                    style={{
                      transform: `scale(${size === 'Monster (16")' ? 1.05 : size === 'Personal (8")' ? 0.95 : 1})`,
                      filter: `saturate(${extraCheese ? 1.3 : 1.1}) brightness(${extraCheese ? 1.1 : 1})`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Visual Ingredient floating texts */}
                  {selectedToppings.length > 0 && (
                    <div className="absolute -right-4 top-1/4 z-20 space-y-2 animate-fade-in pointer-events-none">
                      {selectedToppings.slice(0, 3).map((top, i) => (
                        <div key={top} className="bg-charcoal/90 border border-white/10 text-cheese font-sans font-bold text-[9px] uppercase px-2 py-1 rounded-md shadow-lg" style={{ animationDelay: `${i * 100}ms` }}>
                          + {top}
                        </div>
                      ))}
                      {selectedToppings.length > 3 && <div className="text-xs text-cream/50 ml-2">...and more</div>}
                    </div>
                  )}
                </div>

                <div className="text-center lg:text-left mt-auto">
                  <span className="font-sans text-[9px] lg:text-[11px] font-black text-tomato uppercase tracking-widest">{customizingPizza.tagline}</span>
                  <h3 className="font-display text-xl lg:text-3xl font-normal text-white uppercase mt-0.5 lg:mt-1">{customizingPizza.name}</h3>
                  <p className="font-sans text-xs text-cream/70 mt-2 font-medium leading-relaxed hidden lg:block">{customizingPizza.description}</p>

                  <div className="mt-3 lg:mt-6 pt-3 lg:pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="font-sans text-[10px] lg:text-xs font-bold text-cream/50 uppercase">Total</span>
                    <span className="font-display text-2xl lg:text-4xl font-black text-cheese">Rs.{calculateCustomizedPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Accordion Customizer */}
              <div className="w-full lg:w-7/12 p-4 md:p-6 lg:p-8 space-y-3 lg:space-y-4 overflow-y-auto lg:max-h-[calc(95vh-80px)]">

                {/* STEP 1: SIZE */}
                <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 1 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                  <button onClick={() => setActiveStep(1)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 1 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>1</span>
                      <h4 className="font-sans font-bold text-sm uppercase text-cream tracking-wide">Choose Pizza Size</h4>
                    </div>
                    {activeStep !== 1 && <span className="font-sans text-xs font-bold text-cheese">{size}</span>}
                  </button>

                  {activeStep === 1 && (
                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                      {availableSizes.map((s: string) => (
                        <button
                          key={s}
                          onClick={() => { setSize(s); setActiveStep(2); }}
                          className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${size === s ? 'bg-burgundy/20 border-cheese ring-1 ring-cheese/50' : 'bg-charcoal border-white/5 hover:border-white/20'
                            }`}
                        >
                          {size === s && <Check className="absolute top-2 right-2 w-4 h-4 text-cheese" />}
                          <div className={`font-sans font-bold text-xs uppercase ${size === s ? 'text-cheese' : 'text-cream/90'}`}>{s.split(' ')[0]}</div>
                          <div className="font-sans text-[10px] text-cream/50 mt-1">{s.split(' ')[1] || 'Standard'}</div>
                          <div className="font-mono text-[10px] font-bold text-cream/40 mt-2">
                            {(() => {
                              const sc = menuConfig?.sizes?.find((x: any) => x.name === s);
                              if (!sc || sc.priceModifier === 0) return 'Included';
                              return (sc.priceModifier > 0 ? '+' : '') + 'Rs.' + sc.priceModifier;
                            })()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* STEP 2: CRUST */}
                <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 2 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                  <button onClick={() => setActiveStep(2)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 2 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>2</span>
                      <h4 className="font-sans font-bold text-sm uppercase text-cream tracking-wide">Select Crust Style</h4>
                    </div>
                    {activeStep !== 2 && <span className="font-sans text-xs font-bold text-cheese">{crust}</span>}
                  </button>

                  {activeStep === 2 && (
                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                      {availableCrusts.map((c: string) => {
                        const crustConfig = menuConfig?.crusts?.find((x: any) => x.name === c);
                        const isPremium = crustConfig?.isPremium || false;
                        const isRecommended = crustConfig?.isRecommended || false;
                        return (
                          <button
                            key={c}
                            onClick={() => { setCrust(c); setActiveStep(3); }}
                            className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${crust === c ? 'bg-burgundy/20 border-cheese ring-1 ring-cheese/50' : 'bg-charcoal border-white/5 hover:border-white/20'
                              }`}
                          >
                            {crust === c && <Check className="absolute top-3 right-3 w-4 h-4 text-cheese" />}
                            {isRecommended && <span className="inline-block px-2 py-0.5 bg-olive/20 text-olive text-[9px] font-black uppercase rounded-md mb-2">Recommended</span>}
                            {isPremium && crustConfig?.priceModifier > 0 && <span className="inline-block px-2 py-0.5 bg-cheese/20 text-cheese text-[9px] font-black uppercase rounded-md mb-2">Premium +Rs.{crustConfig.priceModifier}</span>}

                            <div className={`font-sans font-bold text-xs uppercase ${crust === c ? 'text-cheese' : 'text-cream/90'}`}>{c}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* STEP 3: SAUCE */}
                <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 3 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                  <button onClick={() => setActiveStep(3)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 3 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>3</span>
                      <h4 className="font-sans font-bold text-sm uppercase text-cream tracking-wide">Premium Sauce Swirl</h4>
                    </div>
                    {activeStep !== 3 && <span className="font-sans text-xs font-bold text-cheese">{sauce}</span>}
                  </button>

                  {activeStep === 3 && (
                    <div className="p-4 pt-0 grid grid-cols-2 gap-3 animate-fade-in">
                      {availableSauces.map((sa: string) => (
                        <button
                          key={sa}
                          onClick={() => { setSauce(sa); setActiveStep(4); }}
                          className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${sauce === sa ? 'bg-burgundy/20 border-cheese ring-1 ring-cheese/50' : 'bg-charcoal border-white/5 hover:border-white/20'
                            }`}
                        >
                          {sauce === sa && <Check className="absolute top-3 right-3 w-4 h-4 text-cheese" />}
                          <div className={`font-sans font-bold text-[11px] uppercase pr-6 ${sauce === sa ? 'text-cheese' : 'text-cream/90'}`}>{sa}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* STEP 4: EXTRAS & TOPPINGS */}
                <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 4 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                  <button onClick={() => setActiveStep(4)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${activeStep === 4 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>4</span>
                      <h4 className="font-sans font-bold text-sm uppercase text-cream tracking-wide">Extras & Toppings</h4>
                    </div>
                  </button>

                  {activeStep === 4 && (
                    <div className="p-4 pt-0 space-y-6 animate-fade-in">

                      {/* Premium Upgrade Switch */}
                      <div>
                        <h5 className="font-sans text-[10px] font-black text-cream/50 uppercase tracking-widest mb-3">Premium Base Upgrade</h5>
                        <label className="flex items-center justify-between p-4 bg-charcoal border border-white/5 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`relative w-12 h-6 rounded-full transition-colors ${extraCheese ? 'bg-cheese' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${extraCheese ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <div>
                              <div className={`font-sans font-bold text-xs uppercase ${extraCheese ? 'text-cheese' : 'text-cream'}`}>Double Mozzarella Drip</div>
                              <div className="font-sans text-[10px] text-cream/50 mt-0.5">Extra heavy layer of Wisconsin whole milk cheese</div>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-normal text-cheese">+Rs.{extraCheesePrice}</span>
                        </label>
                      </div>

                      {/* Add-on Toppings */}
                      <div>
                        <h5 className="font-sans text-[10px] font-black text-cream/50 uppercase tracking-widest mb-3">Additional Toppings</h5>
                        <div className="flex flex-col gap-2">
                          {Object.entries(availableToppings).map(([top, topPrice]) => {
                            const isSelected = selectedToppings.includes(top);
                            return (
                              <button
                                key={top}
                                onClick={() => handleToggleTopping(top)}
                                className={`relative p-3.5 px-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-burgundy/20 border-cheese ring-1 ring-cheese/50' : 'bg-charcoal border-white/5 hover:border-white/20'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  {isSelected ? (
                                    <Minus className="w-4 h-4 text-cheese" />
                                  ) : (
                                    <Plus className="w-4 h-4 text-cream/30" />
                                  )}
                                  <div className={`font-sans font-bold text-[11px] uppercase ${isSelected ? 'text-cheese' : 'text-cream/90'}`}>{top}</div>
                                </div>
                                <div className="font-mono text-[10px] font-normal text-cream/40">
                                  +Rs.{topPrice}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Main Add to Cart CTA */}
                      <div className="pt-6 border-t border-white/5 mt-4">
                        <button
                          onClick={handleSaveCustomization}
                          className="btn-primary-anim w-full py-4 bg-burgundy text-white font-sans font-black text-sm uppercase tracking-widest rounded-xl transition-all btn-burgundy-shadow flex items-center justify-center gap-3 cursor-pointer"
                        >
                          Add to Cart - Rs.{calculateCustomizedPrice().toFixed(2)}
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
