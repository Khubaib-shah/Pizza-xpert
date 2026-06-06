export interface Pizza {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  category: string; // 'veg' | 'non-veg' | 'cheesy' | 'bbq' | 'spicy' | 'classic' | 'loaded'
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  rating: number;
  reviewsCount: number;
  cookingTime: string; // e.g. "12-15 min"
  tags: string[];
}

export interface PizzaCustomization {
  size: string;
  crust: string;
  sauce: string;
  extraCheese: boolean;
  extraToppings: string[];
}

export interface CartItem {
  id: string; // unique item id including custom configuration
  pizza: Pizza;
  quantity: number;
  customization: PizzaCustomization;
  pricePerItem: number;
}

export interface Deal {
  id: string;
  title: string;
  discountBadge: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  validUntil: string;
  isLimited: boolean;
  image?: string;
}

export interface Category {
  id: string;
  _id?: string; // MongoDB id alias
  slug?: string; // URL-friendly category slug from API
  name: string;
  iconName: string; // references lucide icons
  itemCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatarInitials: string;
  avatarColor: string;
  rating: number;
  quote: string;
}

export interface StepInfo {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export type OrderStage = 'placed' | 'preparing' | 'baking' | 'delivering' | 'delivered';

export interface SimulatedOrder {
  id: string;
  items: CartItem[];
  paymentMethod: string;
  createdAt: string;
  stage: OrderStage;
  deliveryTimeRemaining: number; // countdown in seconds
  totalAmount: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
}
