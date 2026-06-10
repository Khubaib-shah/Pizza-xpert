import mongoose from "mongoose";
import dotenv from "dotenv";
import { Pizza } from "./models/Pizza.model.js";
import { Customer } from "./models/Customer.model.js";
import { Staff } from "./models/Staff.model.js";
import { Coupon } from "./models/Coupon.model.js";
import { Deal } from "./models/Deal.model.js";
import { Category } from "./models/Category.model.js";
import { Testimonial } from "./models/Testimonial.model.js";
import { HeroSlide } from "./models/HeroSlide.model.js";
import { MenuConfig } from "./models/MenuConfig.model.js";
import { Media } from "./models/Media.model.js";
import { Admin } from "./models/Admin.model.js";
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pizzaxpert";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding");

    // Clear existing data
    await Promise.all([
      Pizza.deleteMany(),
      Customer.deleteMany(),
      Staff.deleteMany(),
      Coupon.deleteMany(),
      Deal.deleteMany(),
      Category.deleteMany(),
      Testimonial.deleteMany(),
      HeroSlide.deleteMany(),
      MenuConfig.deleteMany(),
      Media.deleteMany(),
      Admin.deleteMany(),
    ]);
    console.log("Cleared existing collections");

    // ─── Media Gallery ────────────────────────────────────────────────
    await Media.insertMany([
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
        publicId: "pizza_placeholder_1",
        folder: "pizza-xpert/products",
        filename: "pizza1.jpg",
      },
      {
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
        publicId: "pizza_placeholder_2",
        folder: "pizza-xpert/products",
        filename: "pizza2.jpg",
      },
      {
        url: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80",
        publicId: "pizza_placeholder_3",
        folder: "pizza-xpert/products",
        filename: "pizza3.jpg",
      },
      {
        url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
        publicId: "deal_placeholder_1",
        folder: "pizza-xpert/deals",
        filename: "deal1.jpg",
      },
      {
        url: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
        publicId: "hero_placeholder_1",
        folder: "pizza-xpert/hero",
        filename: "hero1.jpg",
      },
    ]);

    // ─── Pizzas ──────────────────────────────────────────────────────
    await Pizza.insertMany([
      // SPICY
      {
        name: "Tikka Supreme",
        tagline: "Authentic Karachi BBQ flavor",
        description: "Loaded with spicy chicken tikka chunks.",
        price: 1850,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "spicy",
        isVeg: false,
        isSpicy: true,
        isPopular: true,
        rating: 4.8,
        reviewsCount: 1540,
        tags: ["DESI", "SPICY"],
      },
      {
        name: "Spicy Sriracha Chicken",
        tagline: "For the heat lovers",
        description: "Grilled chicken topped with fiery sriracha.",
        price: 1950,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "spicy",
        isVeg: false,
        isSpicy: true,
        isPopular: false,
        rating: 4.6,
        reviewsCount: 420,
        tags: ["HOT", "CHICKEN"],
      },
      {
        name: "Lahori Chapli Kabab",
        tagline: "Desi fusion at its best",
        description: "Crushed chapli kababs with green chilies.",
        price: 2100,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "spicy",
        isVeg: false,
        isSpicy: true,
        isPopular: true,
        rating: 4.9,
        reviewsCount: 2100,
        tags: ["DESI", "HOT"],
      },

      // CHEESY
      {
        name: "Malai Boti Delight",
        tagline: "Creamy and rich",
        description: "Tender chicken malai boti with creamy garlic sauce.",
        price: 2100,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "cheesy",
        isVeg: false,
        isSpicy: false,
        isPopular: true,
        rating: 4.9,
        reviewsCount: 1200,
        tags: ["CREAMY", "BESTSELLER"],
      },
      {
        name: "Four Cheese Margherita",
        tagline: "Classic cheesy goodness",
        description: "Mozzarella, Cheddar, Parmesan, and Feta.",
        price: 1800,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "cheesy",
        isVeg: true,
        isSpicy: false,
        isPopular: true,
        rating: 4.7,
        reviewsCount: 950,
        tags: ["CHEESE", "CLASSIC"],
      },
      {
        name: "Mac & Cheese Pizza",
        tagline: "The ultimate comfort food",
        description: "Macaroni covered in gooey cheese sauce on a pizza base.",
        price: 2000,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "cheesy",
        isVeg: true,
        isSpicy: false,
        isPopular: false,
        rating: 4.3,
        reviewsCount: 120,
        tags: ["COMFORT"],
      },

      // VEG
      {
        name: "Vegetarian Feast",
        tagline: "Fresh veggies straight from the farm",
        description: "Mushrooms, olives, bell peppers, tomatoes.",
        price: 1500,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "veg",
        isVeg: true,
        isSpicy: false,
        isPopular: false,
        rating: 4.5,
        reviewsCount: 300,
        tags: ["VEGETARIAN"],
      },
      {
        name: "Paneer Tikka Pizza",
        tagline: "Spicy cottage cheese",
        description: "Marinated paneer chunks with spicy onions.",
        price: 1750,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "veg",
        isVeg: true,
        isSpicy: true,
        isPopular: true,
        rating: 4.8,
        reviewsCount: 500,
        tags: ["DESI", "PANEER"],
      },
      {
        name: "Mushroom Magic",
        tagline: "Earthy and delicious",
        description: "Double mushrooms with a garlic butter base.",
        price: 1600,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "veg",
        isVeg: true,
        isSpicy: false,
        isPopular: false,
        rating: 4.4,
        reviewsCount: 220,
        tags: ["MUSHROOM"],
      },

      // NON-VEG
      {
        name: "Meat Lover's Supreme",
        tagline: "Loaded with all the meats",
        description: "Pepperoni, sausages, beef chunks, and turkey strips.",
        price: 2500,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "non-veg",
        isVeg: false,
        isSpicy: false,
        isPopular: true,
        rating: 4.9,
        reviewsCount: 1800,
        tags: ["MEATY", "HEAVY"],
      },
      {
        name: "Chicken Fajita",
        tagline: "Tex-Mex flavors",
        description: "Fajita seasoned chicken with bell peppers and onions.",
        price: 1900,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "non-veg",
        isVeg: false,
        isSpicy: true,
        isPopular: true,
        rating: 4.7,
        reviewsCount: 1100,
        tags: ["FAJITA"],
      },
      {
        name: "Beef Pepperoni",
        tagline: "The absolute classic",
        description: "Premium beef pepperoni slices covering the entire pizza.",
        price: 1950,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "non-veg",
        isVeg: false,
        isSpicy: false,
        isPopular: true,
        rating: 4.8,
        reviewsCount: 1600,
        tags: ["CLASSIC", "PEPPERONI"],
      },

      // BBQ
      {
        name: "Smoked BBQ Chicken",
        tagline: "Sweet and smoky",
        description:
          "BBQ sauce base with smoked chicken and caramelized onions.",
        price: 2000,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "bbq",
        isVeg: false,
        isSpicy: false,
        isPopular: true,
        rating: 4.7,
        reviewsCount: 890,
        tags: ["BBQ", "SWEET"],
      },
      {
        name: "BBQ Beef Brisket",
        tagline: "Slow-cooked perfection",
        description: "Tender beef brisket drizzled with honey BBQ sauce.",
        price: 2400,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "bbq",
        isVeg: false,
        isSpicy: false,
        isPopular: false,
        rating: 4.8,
        reviewsCount: 340,
        tags: ["PREMIUM", "BEEF"],
      },
      {
        name: "Spicy BBQ Wings Pizza",
        tagline: "Wings but on a pizza",
        description: "Boneless spicy BBQ wings on a cheesy crust.",
        price: 2150,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "bbq",
        isVeg: false,
        isSpicy: true,
        isPopular: false,
        rating: 4.5,
        reviewsCount: 200,
        tags: ["SPICY", "BBQ"],
      },

      // CLASSIC
      {
        name: "Classic Margherita",
        tagline: "Simple and authentic",
        description: "Tomato sauce, fresh mozzarella, and basil leaves.",
        price: 1400,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "classic",
        isVeg: true,
        isSpicy: false,
        isPopular: true,
        rating: 4.6,
        reviewsCount: 750,
        tags: ["CLASSIC", "VEG"],
      },
      {
        name: "Hawaiian Dream",
        tagline: "Sweet and savory",
        description: "Turkey bacon strips and fresh pineapple chunks.",
        price: 1750,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "classic",
        isVeg: false,
        isSpicy: false,
        isPopular: false,
        rating: 4.2,
        reviewsCount: 400,
        tags: ["SWEET"],
      },
      {
        name: "Italian Sausage",
        tagline: "Rustic Italian flavors",
        description: "Ground Italian sausage with roasted red peppers.",
        price: 1850,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "classic",
        isVeg: false,
        isSpicy: false,
        isPopular: false,
        rating: 4.5,
        reviewsCount: 300,
        tags: ["ITALIAN"],
      },

      // LOADED
      {
        name: "Crown Crust Kabab",
        tagline: "A feast for royalty",
        description: "Crust stuffed with seekh kababs, topped with extra meat.",
        price: 2800,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "loaded",
        isVeg: false,
        isSpicy: true,
        isPopular: true,
        rating: 4.9,
        reviewsCount: 2500,
        tags: ["STUFFED", "PREMIUM"],
      },
      {
        name: "Super Supreme Loaded",
        tagline: "Everything on it",
        description: "Every topping available in the kitchen, double cheese.",
        price: 3000,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "loaded",
        isVeg: false,
        isSpicy: false,
        isPopular: false,
        rating: 4.7,
        reviewsCount: 800,
        tags: ["HEAVY", "LOADED"],
      },
      {
        name: "Lava Cheese Burst",
        tagline: "Liquid cheese center",
        description: "A mountain of cheese that oozes out when you bite.",
        price: 2600,
        image:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        category: "loaded",
        isVeg: true,
        isSpicy: false,
        isPopular: true,
        rating: 4.8,
        reviewsCount: 1400,
        tags: ["CHEESE", "BURST"],
      },
    ]);

    // ─── Customers ───────────────────────────────────────────────────
    await Customer.insertMany([
      {
        name: "Ahmed Ali",
        phone: "+92 300 1234567",
        ordersCount: 12,
        totalSpend: 24000,
        tier: "VIP",
        status: "Active",
      },
      {
        name: "Fatima Tariq",
        phone: "+92 321 7654321",
        ordersCount: 3,
        totalSpend: 5500,
        tier: "Standard",
        status: "Active",
      },
      {
        name: "Bilal Khan",
        phone: "+92 333 9876543",
        ordersCount: 8,
        totalSpend: 15000,
        tier: "Returning",
        status: "Active",
      },
      {
        name: "Zara Sheikh",
        phone: "+92 345 1112223",
        ordersCount: 0,
        totalSpend: 0,
        tier: "New",
        status: "Inactive",
      },
    ]);

    // ─── Staff ───────────────────────────────────────────────────────
    await Staff.insertMany([
      {
        name: "Rizwan (Rider - DHA)",
        role: "Delivery Rider",
        status: "On Duty",
        ordersHandledToday: 14,
        rating: 4.8,
      },
      {
        name: "Kamran (Rider - Clifton)",
        role: "Delivery Rider",
        status: "On Duty",
        ordersHandledToday: 9,
        rating: 4.5,
      },
      {
        name: "Chef Usman",
        role: "Head Chef",
        status: "On Duty",
        ordersHandledToday: 45,
        rating: 5.0,
      },
      {
        name: "Sara (Cashier)",
        role: "Front Desk",
        status: "Off Duty",
        ordersHandledToday: 0,
        rating: 4.2,
      },
    ]);

    // ─── Coupons ─────────────────────────────────────────────────────
    await Coupon.insertMany([
      {
        code: "KARACHI500",
        discountValue: 500,
        discountType: "Flat",
        minOrderAmount: 2000,
        uses: 120,
        expiryDate: new Date("2026-12-31"),
        status: "Active",
      },
      {
        code: "AZADI14",
        discountValue: 14,
        discountType: "Percentage",
        minOrderAmount: 1500,
        uses: 85,
        expiryDate: new Date("2026-08-14"),
        status: "Active",
      },
      {
        code: "DEFENCE20",
        discountValue: 20,
        discountType: "Percentage",
        minOrderAmount: 3000,
        uses: 45,
        expiryDate: new Date("2026-10-01"),
        status: "Active",
      },
      {
        code: "TEST500",
        discountValue: 500,
        discountType: "Flat",
        minOrderAmount: 1000,
        uses: 999,
        expiryDate: new Date("2027-12-31"),
        status: "Active",
      },
    ]);

    // ─── Deals ───────────────────────────────────────────────────────
    await Deal.insertMany([
      {
        title: "COZY DEAL",
        discountBadge: "BEST VALUE",
        description: "2 Jumbo Pizzas + Free Chilled Soda + 3 Garlic Dips.",
        originalPrice: 3500,
        dealPrice: 1650,
        validUntil: new Date(Date.now() + 4 * 86400 * 1000),
        isLimited: true,
        isActive: true,
      },
      {
        title: "MID-WEEK MADNESS",
        discountBadge: "30% OFF",
        description: "Get 30% off on all large Malai Boti pizzas.",
        originalPrice: 2800,
        dealPrice: 1960,
        validUntil: new Date(Date.now() + 5 * 86400 * 1000),
        isLimited: true,
        isActive: true,
      },
      {
        title: "FAMILY FIESTA",
        discountBadge: "SAVE RS.1000",
        description: "2 Large Pizzas + 1.5L Drink + Garlic Bread.",
        originalPrice: 5000,
        dealPrice: 4000,
        validUntil: new Date(Date.now() + 7 * 86400 * 1000),
        isLimited: true,
        isActive: true,
      },
    ]);

    // ─── Categories ──────────────────────────────────────────────────
    await Category.insertMany([
      {
        slug: "all",
        name: "ALL",
        iconName: "UtensilsCrossed",
        itemCount: 6,
        order: 0,
        isActive: true,
      },
      {
        slug: "veg",
        name: "VEG DECOR",
        iconName: "Leaf",
        itemCount: 2,
        order: 1,
        isActive: true,
      },
      {
        slug: "non-veg",
        name: "MEAT CROWN",
        iconName: "FlameKindling",
        itemCount: 4,
        order: 2,
        isActive: true,
      },
      {
        slug: "cheesy",
        name: "CHEESE DRIP",
        iconName: "Layers",
        itemCount: 1,
        order: 3,
        isActive: true,
      },
      {
        slug: "bbq",
        name: "SWEET BBQ",
        iconName: "Sparkles",
        itemCount: 1,
        order: 4,
        isActive: true,
      },
      {
        slug: "spicy",
        name: "SPICY FIRE",
        iconName: "Flame",
        itemCount: 2,
        order: 5,
        isActive: true,
      },
      {
        slug: "classic",
        name: "CLASSIC HERB",
        iconName: "Award",
        itemCount: 2,
        order: 6,
        isActive: true,
      },
      {
        slug: "loaded",
        name: "LAVA LOADED",
        iconName: "Zap",
        itemCount: 1,
        order: 7,
        isActive: true,
      },
    ]);

    // ─── Testimonials ─────────────────────────────────────────────────
    await Testimonial.insertMany([
      {
        name: "Saad M.",
        location: "DHA Phase 6, Karachi",
        avatarInitials: "SM",
        avatarColor: "bg-blue-500",
        rating: 5,
        quote:
          "Ordered the Tikka Pizza for a family dinner and everyone loved it. The chicken was flavorful, the crust had a nice crunch, and the pizza arrived hot despite it being a busy weekend evening. Definitely one of the better pizza experiences.",
      },
      {
        name: "Ayesha R.",
        location: "Clifton Block 4, Karachi",
        avatarInitials: "AR",
        avatarColor: "bg-pink-500",
        rating: 5,
        quote:
          "I usually order Malai Boti pizzas and this one really stood out. The cheese was perfectly melted, the toppings were generous, and every bite was full of flavor. It arrived fresh and warm, which made the whole experience even better.",
      },
      {
        name: "Omer F.",
        location: "Gulshan-e-Iqbal, Karachi",
        avatarInitials: "OF",
        avatarColor: "bg-green-500",
        rating: 5,
        quote:
          "I have ordered from Pizza Xpert several times and the quality has always been consistent. The pizzas are fresh, loaded with toppings, and delivered on time. It is one of the few places in Karachi that gets both taste and service right.",
      },
    ]);

    // ─── Hero Slides ─────────────────────────────────────────────────
    await HeroSlide.insertMany([
      {
        id: "deal-8-pizza",
        backgroundImg:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        badgeText: "🔥 TOP SELLING DEAL",
        titleNumber: "8",
        titleTextLines: ["LARGE", "PIZZAS"],
        items: ["1 x JUMBO DRINK", "8 x DIP SAUCES"],
        price: "3850",
        pricePrefix: "Rs.",
        primaryCtaText: "ORDER NOW",
        secondaryCtaText: "VIEW MENU",
        isActive: true,
        order: 0,
      },
      {
        id: "deal-4-pizza",
        backgroundImg:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        badgeText: "⚡ FAMILY SPECIAL",
        titleNumber: "4",
        titleTextLines: ["MEDIUM", "PIZZAS"],
        items: ["1 x LITER DRINK", "4 x DIP SAUCES"],
        price: "2150",
        pricePrefix: "Rs.",
        primaryCtaText: "GET THIS DEAL",
        secondaryCtaText: "SEE ALL DEALS",
        isActive: true,
        order: 1,
      },
      {
        id: "deal-2-pizza",
        backgroundImg:
          "https://res.cloudinary.com/dvyhnxnpq/image/upload/v1780688285/pizza-xpert/general/p9w9sjpyxvjir2zj52vd.png",
        badgeText: "🏆 CHEESY LOVERS",
        titleNumber: "2",
        titleTextLines: ["JUMBO", "PIZZAS"],
        items: ["1 x CHILLED DRINK", "3 x GARLIC DIPS"],
        price: "1650",
        pricePrefix: "Rs.",
        primaryCtaText: "ORDER NOW",
        secondaryCtaText: "MORE DEALS",
        isActive: true,
        order: 2,
      },
    ]);

    // ─── Menu Config ─────────────────────────────────────────────────
    await MenuConfig.create({
      key: "default",
      toppings: [
        { name: "Sizzling Pepperoni", price: 200, isAvailable: true },
        { name: "Artisan Sausage", price: 225, isAvailable: true },
        { name: "Smoked Pulled Beef", price: 250, isAvailable: true },
        { name: "Grilled Herb Chicken", price: 200, isAvailable: true },
        { name: "Sautéed Mushrooms", price: 125, isAvailable: true },
        { name: "Kalamata Olives", price: 100, isAvailable: true },
        { name: "Fresh Sweet Basil", price: 75, isAvailable: true },
        { name: "Candied Jalapeños", price: 125, isAvailable: true },
        { name: "Caramelized Red Onions", price: 100, isAvailable: true },
        { name: "Greek Feta Chunks", price: 150, isAvailable: true },
      ],
      sizes: [
        { name: 'Personal (8")', priceModifier: -300, isAvailable: true },
        { name: 'Medium (12")', priceModifier: 0, isAvailable: true },
        { name: 'Monster (16")', priceModifier: 500, isAvailable: true },
      ],
      crusts: [
        {
          name: "Classic Hand-Tossed",
          priceModifier: 0,
          isPremium: false,
          isRecommended: true,
          isAvailable: true,
        },
        {
          name: "Crispy Thin Crust",
          priceModifier: 0,
          isPremium: false,
          isRecommended: false,
          isAvailable: true,
        },
        {
          name: "Stuffed Cheese Crust",
          priceModifier: 350,
          isPremium: true,
          isRecommended: false,
          isAvailable: true,
        },
        {
          name: "Gluten-Free Pan",
          priceModifier: 200,
          isPremium: false,
          isRecommended: false,
          isAvailable: true,
        },
      ],
      sauces: [
        { name: "Deep Tomato Marinara", isAvailable: true },
        { name: "Spicy Garlic Chili", isAvailable: true },
        { name: "Zesty Smoky BBQ", isAvailable: true },
        { name: "Creamy White Alfredo", isAvailable: true },
      ],
      extraCheesePrice: 200,
    });

    // ─── Admin User ──────────────────────────────────────────────────
    await Admin.create({
      email: "admin@pizzaxpert.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Database seeded successfully with full dynamic content!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
