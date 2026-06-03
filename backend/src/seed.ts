import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pizza } from './models/Pizza.model.js';
import { Customer } from './models/Customer.model.js';
import { Staff } from './models/Staff.model.js';
import { Coupon } from './models/Coupon.model.js';
import { Deal } from './models/Deal.model.js';
import { Category } from './models/Category.model.js';
import { Testimonial } from './models/Testimonial.model.js';
import { HeroSlide } from './models/HeroSlide.model.js';
import { MenuConfig } from './models/MenuConfig.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzaxpert';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding');

    // Clear existing data
    await Promise.all([
      Pizza.deleteMany(), Customer.deleteMany(), Staff.deleteMany(),
      Coupon.deleteMany(), Deal.deleteMany(), Category.deleteMany(),
      Testimonial.deleteMany(), HeroSlide.deleteMany(), MenuConfig.deleteMany()
    ]);
    console.log('Cleared existing collections');

    // ─── Pizzas ──────────────────────────────────────────────────────
    await Pizza.insertMany([
      {
        name: 'Tikka Supreme',
        tagline: 'Authentic Karachi BBQ flavor',
        description: 'Loaded with spicy chicken tikka chunks, green chilies, onions, and lots of mozzarella cheese.',
        price: 1850,
        image: '/src/assets/images/pizza_pepperoni_1780276165703.png',
        category: 'spicy',
        isVeg: false,
        isSpicy: true,
        isPopular: true,
        rating: 4.8,
        reviewsCount: 1540,
        tags: ['DESI', 'SPICY']
      },
      {
        name: 'Malai Boti Delight',
        tagline: 'Creamy and rich',
        description: 'Tender chicken malai boti with our special creamy garlic sauce and fresh bell peppers.',
        price: 2100,
        image: '/src/assets/images/pizza_pepperoni_1780276165703.png',
        category: 'cheesy',
        isVeg: false,
        isSpicy: false,
        isPopular: true,
        rating: 4.9,
        reviewsCount: 1200,
        tags: ['CREAMY', 'BESTSELLER']
      },
      {
        name: 'Vegetarian Feast',
        tagline: 'Fresh veggies straight from the farm',
        description: 'Mushrooms, olives, bell peppers, tomatoes, and sweet corn on a thin crust.',
        price: 1500,
        image: '/src/assets/images/pizza_pepperoni_1780276165703.png',
        category: 'veg',
        isVeg: true,
        isSpicy: false,
        isPopular: false,
        rating: 4.5,
        reviewsCount: 300,
        tags: ['VEGETARIAN']
      }
    ]);

    // ─── Customers ───────────────────────────────────────────────────
    await Customer.insertMany([
      { name: 'Ahmed Ali', phone: '+92 300 1234567', ordersCount: 12, totalSpend: 24000, tier: 'VIP', status: 'Active' },
      { name: 'Fatima Tariq', phone: '+92 321 7654321', ordersCount: 3, totalSpend: 5500, tier: 'Standard', status: 'Active' },
      { name: 'Bilal Khan', phone: '+92 333 9876543', ordersCount: 8, totalSpend: 15000, tier: 'Returning', status: 'Active' },
      { name: 'Zara Sheikh', phone: '+92 345 1112223', ordersCount: 0, totalSpend: 0, tier: 'New', status: 'Inactive' }
    ]);

    // ─── Staff ───────────────────────────────────────────────────────
    await Staff.insertMany([
      { name: 'Rizwan (Rider - DHA)', role: 'Delivery Rider', status: 'On Duty', ordersHandledToday: 14, rating: 4.8 },
      { name: 'Kamran (Rider - Clifton)', role: 'Delivery Rider', status: 'On Duty', ordersHandledToday: 9, rating: 4.5 },
      { name: 'Chef Usman', role: 'Head Chef', status: 'On Duty', ordersHandledToday: 45, rating: 5.0 },
      { name: 'Sara (Cashier)', role: 'Front Desk', status: 'Off Duty', ordersHandledToday: 0, rating: 4.2 }
    ]);

    // ─── Coupons ─────────────────────────────────────────────────────
    await Coupon.insertMany([
      { code: 'KARACHI500', discountValue: 500, discountType: 'Flat', minOrderAmount: 2000, uses: 120, expiryDate: new Date('2026-12-31'), status: 'Active' },
      { code: 'AZADI14', discountValue: 14, discountType: 'Percentage', minOrderAmount: 1500, uses: 85, expiryDate: new Date('2026-08-14'), status: 'Active' },
      { code: 'DEFENCE20', discountValue: 20, discountType: 'Percentage', minOrderAmount: 3000, uses: 45, expiryDate: new Date('2026-10-01'), status: 'Active' }
    ]);

    // ─── Deals ───────────────────────────────────────────────────────
    await Deal.insertMany([
      {
        title: 'COZY DEAL',
        discountBadge: 'BEST VALUE',
        description: '2 Jumbo Pizzas + Free Chilled Soda + 3 Garlic Dips. Perfect for a family night in.',
        originalPrice: 3500,
        dealPrice: 1650,
        endsInSeconds: 86400,
        isLimited: true,
        isActive: true,
      },
      {
        title: 'MID-WEEK MADNESS',
        discountBadge: '30% OFF',
        description: 'Get 30% off on all large Malai Boti pizzas. Mid-week treat for Rs. less.',
        originalPrice: 2800,
        dealPrice: 1960,
        endsInSeconds: 86400,
        isLimited: true,
        isActive: true,
      },
      {
        title: 'FAMILY FIESTA',
        discountBadge: 'SAVE RS.1000',
        description: '2 Large Pizzas + 1.5L Drink + Garlic Bread. Feed the whole family.',
        originalPrice: 5000,
        dealPrice: 4000,
        endsInSeconds: 172800,
        isLimited: false,
        isActive: true,
      }
    ]);

    // ─── Categories ──────────────────────────────────────────────────
    await Category.insertMany([
      { slug: 'all', name: 'ALL', iconName: 'UtensilsCrossed', itemCount: 6, order: 0, isActive: true },
      { slug: 'veg', name: 'VEG DECOR', iconName: 'Leaf', itemCount: 2, order: 1, isActive: true },
      { slug: 'non-veg', name: 'MEAT CROWN', iconName: 'FlameKindling', itemCount: 4, order: 2, isActive: true },
      { slug: 'cheesy', name: 'CHEESE DRIP', iconName: 'Layers', itemCount: 1, order: 3, isActive: true },
      { slug: 'bbq', name: 'SWEET BBQ', iconName: 'Sparkles', itemCount: 1, order: 4, isActive: true },
      { slug: 'spicy', name: 'SPICY FIRE', iconName: 'Flame', itemCount: 2, order: 5, isActive: true },
      { slug: 'classic', name: 'CLASSIC HERB', iconName: 'Award', itemCount: 2, order: 6, isActive: true },
      { slug: 'loaded', name: 'LAVA LOADED', iconName: 'Zap', itemCount: 1, order: 7, isActive: true },
    ]);

    // ─── Testimonials ─────────────────────────────────────────────────
    await Testimonial.insertMany([
      { name: 'Saad M.', location: 'DHA Phase 6, Karachi', avatarInitials: 'SM', avatarColor: 'bg-blue-500', rating: 5, quote: 'Best Tikka pizza in town! Delivery was super fast even during rush hour.' },
      { name: 'Ayesha R.', location: 'Clifton Block 4', avatarInitials: 'AR', avatarColor: 'bg-pink-500', rating: 4, quote: 'The Malai Boti pizza is so creamy and delicious. Highly recommend!' },
      { name: 'Omer F.', location: 'Gulshan-e-Iqbal', avatarInitials: 'OF', avatarColor: 'bg-green-500', rating: 5, quote: 'Pizza Xpert never disappoints. Always hot and fresh.' }
    ]);

    // ─── Hero Slides ─────────────────────────────────────────────────
    await HeroSlide.insertMany([
      {
        id: 'cozy-deal',
        title: '2 Jumbo Pizzas',
        subtitle: 'Cozy Night Deal',
        tagline: '🔥 LIMITED OFFER',
        items: ['2 Jumbo Pizzas', 'Free Chilled Soda', '3 Garlic Dips'],
        backgroundImg: '/src/assets/images/1.png',
        badgeTopLine: 'TOP SELLING',
        badgePriceLine: 'Rs.1650',
        badgeBottomLine: 'DEAL',
        ctaLabel: 'Order Now',
        isActive: true,
        order: 0,
      },
      {
        id: 'family-feast',
        title: 'Family Feast',
        subtitle: 'The Ultimate Spread',
        tagline: '🍕 WEEKEND SPECIAL',
        items: ['2 Large Pizzas', '1.5L Cold Drink', 'Garlic Bread'],
        backgroundImg: '/src/assets/images/2.png',
        badgeTopLine: 'FAMILY',
        badgePriceLine: 'Rs.4000',
        badgeBottomLine: 'BUNDLE',
        ctaLabel: 'Get This Deal',
        isActive: true,
        order: 1,
      },
      {
        id: 'xtreme-pepperoni',
        title: 'Pepperoni Blast',
        subtitle: 'Crispy. Spicy. Perfect.',
        tagline: '⚡ NEW ARRIVAL',
        items: ['Double Layer Pepperoni', 'Extra Mozzarella', 'Crispy Thin Crust'],
        backgroundImg: '/src/assets/images/1.png',
        badgeTopLine: 'CHEF\'S',
        badgePriceLine: 'Rs.1850',
        badgeBottomLine: 'PICK',
        ctaLabel: 'Try It Now',
        isActive: true,
        order: 2,
      }
    ]);

    // ─── Menu Config ─────────────────────────────────────────────────
    await MenuConfig.create({
      key: 'default',
      toppings: [
        { name: 'Sizzling Pepperoni', price: 200, isAvailable: true },
        { name: 'Artisan Sausage', price: 225, isAvailable: true },
        { name: 'Smoked Pulled Beef', price: 250, isAvailable: true },
        { name: 'Grilled Herb Chicken', price: 200, isAvailable: true },
        { name: 'Sautéed Mushrooms', price: 125, isAvailable: true },
        { name: 'Kalamata Olives', price: 100, isAvailable: true },
        { name: 'Fresh Sweet Basil', price: 75, isAvailable: true },
        { name: 'Candied Jalapeños', price: 125, isAvailable: true },
        { name: 'Caramelized Red Onions', price: 100, isAvailable: true },
        { name: 'Greek Feta Chunks', price: 150, isAvailable: true },
      ],
      sizes: [
        { name: 'Personal (8")', priceModifier: -300, isAvailable: true },
        { name: 'Medium (12")', priceModifier: 0, isAvailable: true },
        { name: 'Monster (16")', priceModifier: 500, isAvailable: true },
      ],
      crusts: [
        { name: 'Classic Hand-Tossed', priceModifier: 0, isPremium: false, isRecommended: true, isAvailable: true },
        { name: 'Crispy Thin Crust', priceModifier: 0, isPremium: false, isRecommended: false, isAvailable: true },
        { name: 'Stuffed Cheese Crust', priceModifier: 350, isPremium: true, isRecommended: false, isAvailable: true },
        { name: 'Gluten-Free Pan', priceModifier: 200, isPremium: false, isRecommended: false, isAvailable: true },
      ],
      sauces: [
        { name: 'Deep Tomato Marinara', isAvailable: true },
        { name: 'Spicy Garlic Chili', isAvailable: true },
        { name: 'Zesty Smoky BBQ', isAvailable: true },
        { name: 'Creamy White Alfredo', isAvailable: true },
      ],
      extraCheesePrice: 200,
    });

    console.log('✅ Database seeded successfully with full dynamic content!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
