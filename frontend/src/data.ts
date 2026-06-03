import { Pizza, Deal, Category, Testimonial, StepInfo } from './types';

// Let's import or map our high-fidelity generated images
export const IMAGE_MAP = {
  hero: '/src/assets/images/pizza_hero_1780276120368.png',
  cheesePull: '/src/assets/images/pizza_cheese_pull_1780276144554.png',
  pepperoni: '/src/assets/images/pizza_pepperoni_1780276165703.png',
  ovenBaked: '/src/assets/images/pizza_oven_1780276189628.png',
  bbq: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  veggie: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
  spicy: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80'
};

export const SIGNATURE_PIZZAS: Pizza[] = [
  {
    id: 'p1',
    name: 'XTREME PEPPERONI CROWN',
    tagline: 'BOLD FLAVOR. PREMIUM PIZZA.',
    description: 'Double layer of premium artisanal pork-infused dry-aged pepperoni, toasted crisp, curled in cups, swimming on sheets of creamy hand-pulled whole milk mozzarella over our slow-cooked Roma marinara sauce.',
    price: 18.99,
    image: IMAGE_MAP.pepperoni,
    category: 'spicy',
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 184,
    cookingTime: '12-14 min',
    tags: ['BESTSELLER', 'HOT & CRISPY']
  },
  {
    id: 'p2',
    name: 'GOLDEN TRIPLE-CHEESE BURST',
    tagline: 'CHEESY PERFECTION IN EVERY SLICE',
    description: 'An architectural marvel of stretch. Crafted with premium buffalo mozzarella, sharp yellow cheddar, and heavy Swiss Emmental. Infused with fresh oregano oil and baked on a crust injected with warm cheese sauce.',
    price: 16.99,
    image: IMAGE_MAP.cheesePull,
    category: 'cheesy',
    isVeg: true,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 312,
    cookingTime: '10-12 min',
    tags: ['CHEESE PULL', 'VEGETARIAN']
  },
  {
    id: 'p3',
    name: 'FIRE-BAKED RUSTIC CARNIVORE',
    tagline: 'TASTE THE FIRE',
    description: 'A heavyweight champion of taste. Sizzling Italian fennel sausage, slow-smoked pulled beef strips, caramelized sweet bell peppers, red onion shards, and wood-grilled chicken on an extra-charred stone hearth crust.',
    price: 21.49,
    image: IMAGE_MAP.ovenBaked,
    category: 'loaded',
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 145,
    cookingTime: '15-18 min',
    tags: ['SMOKE GROWN', 'MEAT LOVER']
  },
  {
    id: 'p4',
    name: 'SMOKY MOUNTAIN CHICKEN BBQ',
    tagline: 'PIZZA THAT HITS DIFFERENT',
    description: 'Charbroiled chicken chunks tossed in premium hickory smoked bourbon maple glaze, sweet charred red onions, mild banana peppers, fresh olive oil, layered with gooey aged fontina and fresh cilantro crowns.',
    price: 19.49,
    image: IMAGE_MAP.bbq,
    category: 'bbq',
    isVeg: false,
    isSpicy: false,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 92,
    cookingTime: '12-15 min',
    tags: ['SMOKY SWEET']
  },
  {
    id: 'p5',
    name: 'MEDITERRANEAN CHARRED BASIL',
    tagline: 'CRAFTED FOR REAL PIZZA LOVERS',
    description: 'A pristine light option. Sweet roasted cherry vine tomatoes, dark black kalamata olive halves, salted Greek feta chunks, fresh sweet basil crowns, drizzled on extra virgin Tuscany olive oil and sea salt flakes.',
    price: 15.99,
    image: IMAGE_MAP.veggie,
    category: 'veg',
    isVeg: true,
    isSpicy: false,
    isPopular: false,
    rating: 4.6,
    reviewsCount: 74,
    cookingTime: '10-12 min',
    tags: ['FRESH / VEG', 'LIGHT & URBAN']
  },
  {
    id: 'p6',
    name: 'DIABLO SWEET & SPICY CHILI',
    tagline: 'LOADED WITH FLAVOR',
    description: 'Hot calabrian chili paste swirl, sweet candied jalapeño disks, artisan spicy sausage crumbles, charred pineapple cubes for sweet relief, heavy buffalo mozzarella, finished with hot bee local organic honey.',
    price: 19.99,
    image: IMAGE_MAP.spicy,
    category: 'spicy',
    isVeg: false,
    isSpicy: true,
    isPopular: false,
    rating: 4.9,
    reviewsCount: 120,
    cookingTime: '14-16 min',
    tags: ['SPICY SWEET', 'FIRE BLAST']
  }
];

export const POPULAR_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'THE BEAST COMBO',
    discountBadge: '50% OFF',
    description: 'Any 2 Monster 16" Loaded or BBQ pizzas, paired with 4 bottles of dynamic herb coolers and garlic bread rolls.',
    originalPrice: 59.98,
    dealPrice: 29.99,
    endsInSeconds: 3240, // 54 mins
    isLimited: true
  },
  {
    id: 'd2',
    title: 'THE CHEESY MIDNIGHTER',
    discountBadge: 'BUY 1 GET 1',
    description: 'Get one Medium Triple-Cheese Burst free with any premium pizza order. Valid for deliveries after 9PM only.',
    originalPrice: 33.98,
    dealPrice: 16.99,
    endsInSeconds: 7200, // 2 hours
    isLimited: true
  },
  {
    id: 'd3',
    title: 'PEPPERONI SUPREME PASS',
    discountBadge: 'CHEESY DEAL',
    description: 'One Personal Pepperoni Crown + Golden Herb Wedges + Dynamic Dippers. Crafted for a solitary gamer fuel.',
    originalPrice: 24.99,
    dealPrice: 14.49,
    endsInSeconds: 1540,
    isLimited: false
  },
  {
    id: 'd4',
    title: 'THE WOODFIRE SPREAD',
    discountBadge: '30% REDUCTION',
    description: 'An absolute feast: Any 3 Artisan Pizzas of your choice with charred crust edges, plus custom lava desserts.',
    originalPrice: 62.97,
    dealPrice: 44.00,
    endsInSeconds: 4800,
    isLimited: true
  }
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'ALL', iconName: 'UtensilsCrossed', itemCount: 6 },
  { id: 'veg', name: 'VEG DECOR', iconName: 'Leaf', itemCount: 2 },
  { id: 'non-veg', name: 'MEAT CROWN', iconName: 'FlameKindling', itemCount: 4 },
  { id: 'cheesy', name: 'CHEESE DRIP', iconName: 'Layers', itemCount: 1 },
  { id: 'bbq', name: 'SWEET BBQ', iconName: 'Sparkles', itemCount: 1 },
  { id: 'spicy', name: 'SPICY FIRE', iconName: 'Flame', itemCount: 2 },
  { id: 'classic', name: 'CLASSIC HERB', iconName: 'Award', itemCount: 2 },
  { id: 'loaded', name: 'LAVA LOADED', iconName: 'Zap', itemCount: 1 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'MARLON V.',
    location: 'BROOKLYN, NY',
    avatarInitials: 'MV',
    avatarColor: 'bg-emerald-600',
    rating: 5,
    quote: "The Pepperoni Crown literally hits different. The curl on the meat is immaculate and that warm honey finish on crust has made me a customer for life. Genuine Apple level speed too. Highly recommend!"
  },
  {
    id: 't2',
    name: 'ZACK K.',
    location: 'DOWNTOWN CHICAGO',
    avatarInitials: 'ZK',
    avatarColor: 'bg-amber-600',
    rating: 5,
    quote: "I watched the status tracker change in real-time from Raw Dough to Fresh Bake in 8 minutes flat, and it was at my door 15 minutes later, scorching hot. The golden triple-cheese string stretches up to my light fixtures."
  },
  {
    id: 't3',
    name: 'REBECCA S.',
    location: 'AUSTIN, TX',
    avatarInitials: 'RS',
    avatarColor: 'bg-rose-600',
    rating: 5,
    quote: "Hands down the best crust char I have experienced in five years of foodie tasting. The woodfire smoky chicken BBQ has this amazing smoky honey depth that lingers. Pizza Xpert stands alone."
  }
];

export const DELIVERY_STEPS: StepInfo[] = [
  {
    step: 1,
    title: 'CHOOSE PIZZA',
    description: 'Select from our catalog of curated deep charcoal-baked masterpieces.',
    iconName: 'ShoppingBag'
  },
  {
    step: 2,
    title: 'CUSTOMIZE',
    description: 'Infect the crust with liquid gold cheese, choose elite sauces and toppers.',
    iconName: 'Sliders'
  },
  {
    step: 3,
    title: 'PLACE ORDER',
    description: 'Quick payment simulation with real-time feedback processing.',
    iconName: 'CreditCard'
  },
  {
    step: 4,
    title: 'FAST DELIVERY',
    description: 'Baked at 850°F, packaged, and transported via high-speed moto-messenger.',
    iconName: 'Bike'
  }
];

export const AVAILABLE_SIZES = ['Personal (8")', 'Medium (12")', 'Monster (16")'] as const;
export const AVAILABLE_CRUSTS = [
  'Classic Hand-Tossed',
  'Crispy Thin Crust',
  'Stuffed Cheese Crust',
  'Gluten-Free Pan'
] as const;

export const AVAILABLE_SAUCES = [
  'Deep Tomato Marinara',
  'Spicy Garlic Chili',
  'Zesty Smoky BBQ',
  'Creamy White Alfredo'
] as const;

export const TOPPAN_UPGRADE_COSTS: Record<string, number> = {
  'Sizzling Pepperoni': 2.00,
  'Artisan Sausage': 2.25,
  'Smoked Pulled Beef': 2.50,
  'Grilled Herb Chicken': 2.00,
  'Sautéed Mushrooms': 1.25,
  'Kalamata Olives': 1.00,
  'Fresh Sweet Basil': 0.75,
  'Candied Jalapeños': 1.25,
  'Caramelized Red Onions': 1.00,
  'Greek Feta Chunks': 1.50
};
