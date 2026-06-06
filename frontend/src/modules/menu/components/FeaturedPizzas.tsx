import { useState, useEffect } from 'react';
import { Clock, Flame, Check, Plus, Minus, X, Info, Loader2 } from 'lucide-react';
import { Pizza, PizzaCustomization, CartItem } from '../../../types';
import { usePizzas, useCategories, useMenuConfig } from '../hooks/useMenuQueries';

interface FeaturedPizzasProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  searchQuery: string;
  selectedCategory: string;
  onCategoryVisible?: (id: string) => void;
}

export default function FeaturedPizzas({
  onAddToCart,
  searchQuery,
  onCategoryVisible
}: FeaturedPizzasProps) {
  const { data: pizzasRaw, isLoading: loading, isError } = usePizzas();
  const { data: apiCategories = [] } = useCategories();
  const { data: menuConfig } = useMenuConfig();

  const pizzas = pizzasRaw ? pizzasRaw.map((p: any) => ({ ...p, id: p._id || p.id })) : [];
  const error = isError ? 'Failed to load pizzas. Please try again.' : '';

  const [customizingPizza, setCustomizingPizza] = useState<Pizza | null>(null);

  useEffect(() => {
    if (!onCategoryVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          onCategoryVisible(visibleEntries[0].target.id.replace('category-', ''));
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    const sections = document.querySelectorAll('.menu-category-section');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [onCategoryVisible, pizzas, apiCategories, searchQuery]);

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
          <p className="text-cream/60 font-sans font-medium uppercase tracking-widest text-xs">Loading Menu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="relative bg-charcoal bg-grain py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
          <Info className="w-12 h-12 text-tomato" />
          <p className="text-cream/60 font-sans font-medium uppercase tracking-widest text-xs">{error}</p>
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-burgundy/50 text-cheese hover:bg-tomato hover:text-cream rounded-full text-xs font-medium uppercase tracking-wide border border-tomato/10">
            🥇 OUR SPECIALTIES
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-cream tracking-wide uppercase leading-none">
            OUR <span className="text-cheese text-glow-gold">SIGNATURE</span> PIZZAS
          </h2>
          <div className="w-24 h-1.5 bg-cheese mx-auto rounded-full mt-2" />
          <p className="font-sans text-cream/80 text-sm md:text-base max-w-xl mx-auto font-medium">
            Meticulously engineered recipes carrying real craft history. Fully customizable with authentic Italian dough crust extensions.
          </p>
        </div>

        {/* Menu Sections by Category */}
        {searchMatchedPizzas.length > 0 ? (
          <div className="space-y-20">
            {/* If API categories loaded: group by slug. Otherwise fall back to grouping by pizza.category field */}
            {apiCategories.length > 0
              ? apiCategories
                  .filter(c => c.slug !== 'all' && c.id !== 'all')
                  .map((category) => {
                    // category.slug (e.g. "spicy") must match pizza.category (e.g. "spicy")
                    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
                    const categoryPizzas = searchMatchedPizzas.filter(pizza => pizza.category === slug);
                    if (categoryPizzas.length === 0) return null;
                    return (
                      <div
                        key={slug || (category._id as string)}
                        id={`category-${slug}`}
                        className="menu-category-section scroll-mt-32"
                      >
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-cheese uppercase mb-8 border-b border-white/10 pb-3 flex items-center gap-3">
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
                                className="font-sans font-medium text-[9px] tracking-widest text-charcoal bg-cheese py-1 px-2.5 rounded-full uppercase shadow-md pointer-events-none"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {pizza.isSpicy && (
                            <span
                              className="absolute top-2 right-0 z-30 bg-burgundy text-cheese font-display text-xs inline-flex items-center gap-1 py-1 pr-2 pl-6 uppercase tracking-wider"
                              style={{
                                clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)'
                              }}
                            >
                              <Flame className="w-3 h-3 fill-tomato" />
                              SPICY
                            </span>
                          )}

                          {/* Cooking time badge */}
                          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-charcoal/90 text-cream/90 rounded-full text-[10px] font-medium border border-white/5">
                            <Clock className="w-3.5 h-3.5 text-cheese" />
                            <span>{pizza.cookingTime}</span>
                          </div>
                        </div>

                        {/* Info and Purchase Elements */}
                        <div className="p-2 md:p-4 flex flex-col flex-grow justify-between space-y-4">

                          {/* Card Title & Taglines */}
                          <div className="space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-sans text-[11px] font-medium text-tomato tracking-widest uppercase">
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

                            <p className="font-sans text-xs text-cream/80 line-clamp-3 leading-snug">
                              {pizza.description}
                            </p>
                          </div>


                          {/* Action Purchase footer block */}
                          <div className="flex items-center justify-between gap-3 pt-2">

                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => handleOpenCustomizer(pizza)}
                                className="text-xs p-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cheese/35 text-cream rounded-xl transition-all cursor-pointer"
                                title="Customize toppings and sizes"
                              >
                                customize                              </button>

                              <button
                                onClick={() => handleQuickAdd(pizza)}
                                className="flex-1 w-full btn-primary-anim bg-burgundy inline-flex justify-center text-cheese hover:bg-tomato hover:text-cream font-sans font-medium text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 border border-tomato/20 active:scale-95 cursor-pointer"
                              >
                                Rs {pizza.price.toFixed(2)} <Plus className="w-4 h-4 ml-2" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
              : /* Fallback: no categories from API — render all pizzas in one flat grid */
                (() => {
                  const uniqueCategories = [...new Set(searchMatchedPizzas.map(p => p.category))];
                  return uniqueCategories.map(cat => {
                    const catPizzas = searchMatchedPizzas.filter(p => p.category === cat);
                    return (
                      <div key={cat} id={`category-${cat}`} className="menu-category-section scroll-mt-32">
                        <h3 className="font-display text-2xl md:text-3xl font-medium text-cheese uppercase mb-8 border-b border-white/10 pb-3">
                          {cat.replace(/-/g, ' ')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {catPizzas.map((pizza) => (
                            <div
                              key={pizza.id}
                              className="group relative bg-charcoal-light/80 rounded-[24px] border border-white/5 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 card-pizza-shadow card-pizza-shadow-hover hover:border-burgundy/50 flex flex-col justify-between"
                            >
                              <div className="relative aspect-video overflow-hidden bg-black/40">
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-transparent to-black/20 z-10" />
                                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" referrerPolicy="no-referrer" />
                                {pizza.isSpicy && (
                                  <span className="absolute top-2 right-0 z-30 bg-burgundy text-cheese font-display text-xs inline-flex items-center gap-1 py-1 pr-2 pl-6 uppercase" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)' }}>
                                    <Flame className="w-3 h-3 fill-tomato" /> SPICY
                                  </span>
                                )}
                                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-charcoal/90 text-cream/90 rounded-full text-[10px] font-medium border border-white/5">
                                  <Clock className="w-3.5 h-3.5 text-cheese" /><span>{pizza.cookingTime}</span>
                                </div>
                              </div>
                              <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                                <div className="space-y-1.5">
                                  <h3 className="font-display text-2xl font-medium text-white group-hover:text-cheese transition-colors uppercase">{pizza.name}</h3>
                                  <p className="font-sans text-xs text-cream/80 line-clamp-3">{pizza.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleOpenCustomizer(pizza)} className="text-xs p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-cream rounded-xl transition-all cursor-pointer">customize</button>
                                  <button onClick={() => handleQuickAdd(pizza)} className="flex-1 btn-primary-anim bg-burgundy inline-flex justify-center text-cheese hover:bg-tomato hover:text-cream font-sans font-medium text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all border border-tomato/20 cursor-pointer">
                                    Rs {pizza.price.toFixed(2)} <Plus className="w-4 h-4 ml-2" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()
            }
          </div>
        ) : (
          <div className="text-center py-16 bg-charcoal-light/40 rounded-3xl border border-dashed border-white/10 max-w-lg mx-auto">
            <Info className="w-12 h-12 text-cheese mx-auto mb-4 opacity-70 animate-pulse" />
            <h3 className="font-display text-2xl font-medium text-cream mb-2 uppercase">NO PIZZAS FOUND MATCHING FILTER</h3>
            <p className="font-sans text-xs text-cream/60 px-6">
              Our master pizzaiolo hasn't cataloged details under those keyword specifications. Swipe back to another selection chip!
            </p>
          </div>
        )}

      </div>

      {/* PIZZA CUSTOMIZATION DRAWER MODAL OVERLAY */}
      {
        customizingPizza && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-end md:items-center justify-center md:p-6 backdrop-blur-md animate-fade-in">
            <div className="relative bg-charcoal-gray rounded-t-[32px] md:rounded-[24px] border-t md:border border-white/10 max-w-5xl w-full max-h-[90vh] md:max-h-[95vh] overflow-hidden card-pizza-shadow flex flex-col text-left animate-slide-up md:animate-none pb-safe">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 md:px-8 border-b border-white/5 bg-charcoal-gray z-20">
                <h2 className="font-display text-xl !font-normal text-cream uppercase tracking-wide">Customize Order</h2>
                <button
                  onClick={() => setCustomizingPizza(null)}
                  className="p-2 bg-white/5 rounded-full text-cream/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                          <div key={top} className="bg-charcoal/90 border border-white/10 text-cheese font-sans font-medium text-[9px] uppercase px-2 py-1 rounded-md shadow-lg" style={{ animationDelay: `${i * 100}ms` }}>
                            + {top}
                          </div>
                        ))}
                        {selectedToppings.length > 3 && <div className="text-xs text-cream/50 ml-2">...and more</div>}
                      </div>
                    )}
                  </div>

                  <div className="text-center lg:text-left mt-auto">
                    <span className="font-sans text-[9px] lg:text-[11px] font-medium text-tomato uppercase tracking-widest">{customizingPizza.tagline}</span>
                    <h3 className="font-display text-xl lg:text-3xl font-normal text-white uppercase mt-0.5 lg:mt-1">{customizingPizza.name}</h3>
                    <p className="font-sans text-xs text-cream/80 mt-2 font-medium leading-relaxed hidden lg:block">{customizingPizza.description}</p>

                    <div className="mt-3 lg:mt-6 pt-3 lg:pt-6 border-t border-white/10 flex items-center justify-between">
                      <span className="font-sans text-[10px] lg:text-xs font-medium text-cream/50 uppercase">Total</span>
                      <span className="font-display text-2xl lg:text-4xl font-medium text-cheese">Rs.{calculateCustomizedPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Accordion Customizer */}
                <div className="w-full lg:w-7/12 p-4 md:p-6 lg:p-8 space-y-3 lg:space-y-4 overflow-y-auto lg:max-h-[calc(95vh-80px)]">

                  {/* STEP 1: SIZE */}
                  <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 1 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                    <button onClick={() => setActiveStep(1)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${activeStep === 1 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>1</span>
                        <h4 className="font-sans font-medium text-sm uppercase text-cream tracking-wide">Choose Pizza Size</h4>
                      </div>
                      {activeStep !== 1 && <span className="font-sans text-xs font-medium text-cheese">{size}</span>}
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
                            <div className={`font-sans font-medium text-xs uppercase ${size === s ? 'text-cheese' : 'text-cream/90'}`}>{s.split(' ')[0]}</div>
                            <div className="font-sans text-[10px] text-cream/50 mt-1">{s.split(' ')[1] || 'Standard'}</div>
                            <div className="font-mono text-[10px] font-medium text-cream/40 mt-2">
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
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${activeStep === 2 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>2</span>
                        <h4 className="font-sans font-medium text-sm uppercase text-cream tracking-wide">Select Crust Style</h4>
                      </div>
                      {activeStep !== 2 && <span className="font-sans text-xs font-medium text-cheese">{crust}</span>}
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
                              {isRecommended && <span className="inline-block px-2 py-0.5 bg-olive/20 text-olive text-[9px] font-medium uppercase rounded-md mb-2">Recommended</span>}
                              {isPremium && crustConfig?.priceModifier > 0 && <span className="inline-block px-2 py-0.5 bg-cheese/20 text-cheese text-[9px] font-medium uppercase rounded-md mb-2">Premium +Rs.{crustConfig.priceModifier}</span>}

                              <div className={`font-sans font-medium text-xs uppercase ${crust === c ? 'text-cheese' : 'text-cream/90'}`}>{c}</div>
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
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${activeStep === 3 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>3</span>
                        <h4 className="font-sans font-medium text-sm uppercase text-cream tracking-wide">Premium Sauce Swirl</h4>
                      </div>
                      {activeStep !== 3 && <span className="font-sans text-xs font-medium text-cheese">{sauce}</span>}
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
                            <div className={`font-sans font-medium text-[11px] uppercase pr-6 ${sauce === sa ? 'text-cheese' : 'text-cream/90'}`}>{sa}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* STEP 4: EXTRAS & TOPPINGS */}
                  <div className={`border rounded-2xl overflow-hidden transition-colors ${activeStep === 4 ? 'border-cheese/50 bg-charcoal-light/40' : 'border-white/5 bg-charcoal-light/20'}`}>
                    <button onClick={() => setActiveStep(4)} className="w-full p-4 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${activeStep === 4 ? 'bg-cheese text-charcoal' : 'bg-charcoal text-cream/50'}`}>4</span>
                        <h4 className="font-sans font-medium text-sm uppercase text-cream tracking-wide">Extras & Toppings</h4>
                      </div>
                    </button>

                    {activeStep === 4 && (
                      <div className="p-4 pt-0 space-y-6 animate-fade-in">

                        {/* Premium Upgrade Switch */}
                        <div>
                          <h5 className="font-sans text-[10px] font-medium text-cream/50 uppercase tracking-widest mb-3">Premium Base Upgrade</h5>
                          <label className="flex items-center justify-between p-4 bg-charcoal border border-white/5 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`relative w-12 h-6 rounded-full transition-colors ${extraCheese ? 'bg-cheese' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${extraCheese ? 'translate-x-6' : 'translate-x-0'}`} />
                              </div>
                              <div>
                                <div className={`font-sans font-medium text-xs uppercase ${extraCheese ? 'text-cheese' : 'text-cream'}`}>Double Mozzarella Drip</div>
                                <div className="font-sans text-[10px] text-cream/50 mt-0.5">Extra heavy layer of Wisconsin whole milk cheese</div>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-normal text-cheese">+Rs.{extraCheesePrice}</span>
                          </label>
                        </div>

                        {/* Add-on Toppings */}
                        <div>
                          <h5 className="font-sans text-[10px] font-medium text-cream/50 uppercase tracking-widest mb-3">Additional Toppings</h5>
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
                                    <div className={`font-sans font-medium text-[11px] uppercase ${isSelected ? 'text-cheese' : 'text-cream/90'}`}>{top}</div>
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
                            className="btn-primary-anim w-full py-4 bg-burgundy text-white font-sans font-medium text-sm uppercase tracking-widest rounded-xl transition-all btn-burgundy-shadow flex items-center justify-center gap-3 cursor-pointer"
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
        )
      }

    </section >
  );
}
