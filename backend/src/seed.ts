import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pizza } from './models/Pizza.model.js';
import { Customer } from './models/Customer.model.js';
import { Staff } from './models/Staff.model.js';
import { Coupon } from './models/Coupon.model.js';
import { Deal } from './models/Deal.model.js';
import { Category } from './models/Category.model.js';
import { Testimonial } from './models/Testimonial.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzaxpert';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Seeding');

    // Clear existing data
    await Promise.all([
      Pizza.deleteMany(), Customer.deleteMany(), Staff.deleteMany(),
      Coupon.deleteMany(), Deal.deleteMany(), Category.deleteMany(), Testimonial.deleteMany()
    ]);
    console.log('Cleared existing collections');

    // Pizzas
    const pizzas = await Pizza.insertMany([
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

    // Customers
    await Customer.insertMany([
      { name: 'Ahmed Ali', phone: '+92 300 1234567', ordersCount: 12, totalSpend: 24000, tier: 'VIP', status: 'Active' },
      { name: 'Fatima Tariq', phone: '+92 321 7654321', ordersCount: 3, totalSpend: 5500, tier: 'Standard', status: 'Active' },
      { name: 'Bilal Khan', phone: '+92 333 9876543', ordersCount: 8, totalSpend: 15000, tier: 'Returning', status: 'Active' },
      { name: 'Zara Sheikh', phone: '+92 345 1112223', ordersCount: 0, totalSpend: 0, tier: 'New', status: 'Inactive' }
    ]);

    // Staff
    await Staff.insertMany([
      { name: 'Rizwan (Rider - DHA)', role: 'Delivery Rider', status: 'On Duty', ordersHandledToday: 14, rating: 4.8 },
      { name: 'Kamran (Rider - Clifton)', role: 'Delivery Rider', status: 'On Duty', ordersHandledToday: 9, rating: 4.5 },
      { name: 'Chef Usman', role: 'Head Chef', status: 'On Duty', ordersHandledToday: 45, rating: 5.0 },
      { name: 'Sara (Cashier)', role: 'Front Desk', status: 'Off Duty', ordersHandledToday: 0, rating: 4.2 }
    ]);

    // Coupons
    await Coupon.insertMany([
      { code: 'KARACHI500', discountValue: 500, discountType: 'Flat', minOrderAmount: 2000, uses: 120, expiryDate: new Date('2026-12-31'), status: 'Active' },
      { code: 'AZADI14', discountValue: 14, discountType: 'Percentage', minOrderAmount: 1500, uses: 85, expiryDate: new Date('2026-08-14'), status: 'Active' },
      { code: 'DEFENCE20', discountValue: 20, discountType: 'Percentage', minOrderAmount: 3000, uses: 45, expiryDate: new Date('2026-10-01'), status: 'Active' }
    ]);

    // Deals
    await Deal.insertMany([
      { title: 'Mid-Week Madness', discountBadge: '30% OFF', description: 'Get 30% off on all large Malai Boti pizzas.', originalPrice: 2800, dealPrice: 1960, endsInSeconds: 86400, isLimited: true },
      { title: 'Family Fiesta', discountBadge: 'SAVE 1000', description: '2 Large Pizzas + 1.5L Drink + Garlic Bread', originalPrice: 5000, dealPrice: 4000, endsInSeconds: 172800, isLimited: false }
    ]);

    // Categories
    await Category.insertMany([
      { name: 'Desi Flavors', iconName: 'Flame', itemCount: 12 },
      { name: 'Classic', iconName: 'Pizza', itemCount: 8 },
      { name: 'Sides', iconName: 'Coffee', itemCount: 6 }
    ]);

    // Testimonials
    await Testimonial.insertMany([
      { name: 'Saad M.', location: 'DHA Phase 6, Karachi', avatarInitials: 'SM', avatarColor: 'bg-blue-500', rating: 5, quote: 'Best Tikka pizza in town! Delivery was super fast even during rush hour.' },
      { name: 'Ayesha R.', location: 'Clifton Block 4', avatarInitials: 'AR', avatarColor: 'bg-pink-500', rating: 4, quote: 'The Malai Boti pizza is so creamy and delicious. Highly recommend!' },
      { name: 'Omer F.', location: 'Gulshan-e-Iqbal', avatarInitials: 'OF', avatarColor: 'bg-green-500', rating: 5, quote: 'Pizza Xpert never disappoints. Always hot and fresh.' }
    ]);

    console.log('Database seeded successfully in Karachi context!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
