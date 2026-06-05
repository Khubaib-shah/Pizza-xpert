const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(__dirname, 'src', 'seed.ts');
let seedContent = fs.readFileSync(seedFilePath, 'utf8');

// Pizzas
const newPizzas = `await Pizza.insertMany([
  // SPICY
  { name: "Tikka Supreme", tagline: "Authentic Karachi BBQ flavor", description: "Loaded with spicy chicken tikka chunks.", price: 1850, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "spicy", isVeg: false, isSpicy: true, isPopular: true, rating: 4.8, reviewsCount: 1540, tags: ["DESI", "SPICY"] },
  { name: "Spicy Sriracha Chicken", tagline: "For the heat lovers", description: "Grilled chicken topped with fiery sriracha.", price: 1950, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "spicy", isVeg: false, isSpicy: true, isPopular: false, rating: 4.6, reviewsCount: 420, tags: ["HOT", "CHICKEN"] },
  { name: "Lahori Chapli Kabab", tagline: "Desi fusion at its best", description: "Crushed chapli kababs with green chilies.", price: 2100, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "spicy", isVeg: false, isSpicy: true, isPopular: true, rating: 4.9, reviewsCount: 2100, tags: ["DESI", "HOT"] },

  // CHEESY
  { name: "Malai Boti Delight", tagline: "Creamy and rich", description: "Tender chicken malai boti with creamy garlic sauce.", price: 2100, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "cheesy", isVeg: false, isSpicy: false, isPopular: true, rating: 4.9, reviewsCount: 1200, tags: ["CREAMY", "BESTSELLER"] },
  { name: "Four Cheese Margherita", tagline: "Classic cheesy goodness", description: "Mozzarella, Cheddar, Parmesan, and Feta.", price: 1800, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "cheesy", isVeg: true, isSpicy: false, isPopular: true, rating: 4.7, reviewsCount: 950, tags: ["CHEESE", "CLASSIC"] },
  { name: "Mac & Cheese Pizza", tagline: "The ultimate comfort food", description: "Macaroni covered in gooey cheese sauce on a pizza base.", price: 2000, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "cheesy", isVeg: true, isSpicy: false, isPopular: false, rating: 4.3, reviewsCount: 120, tags: ["COMFORT"] },

  // VEG
  { name: "Vegetarian Feast", tagline: "Fresh veggies straight from the farm", description: "Mushrooms, olives, bell peppers, tomatoes.", price: 1500, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "veg", isVeg: true, isSpicy: false, isPopular: false, rating: 4.5, reviewsCount: 300, tags: ["VEGETARIAN"] },
  { name: "Paneer Tikka Pizza", tagline: "Spicy cottage cheese", description: "Marinated paneer chunks with spicy onions.", price: 1750, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "veg", isVeg: true, isSpicy: true, isPopular: true, rating: 4.8, reviewsCount: 500, tags: ["DESI", "PANEER"] },
  { name: "Mushroom Magic", tagline: "Earthy and delicious", description: "Double mushrooms with a garlic butter base.", price: 1600, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "veg", isVeg: true, isSpicy: false, isPopular: false, rating: 4.4, reviewsCount: 220, tags: ["MUSHROOM"] },

  // NON-VEG
  { name: "Meat Lover's Supreme", tagline: "Loaded with all the meats", description: "Pepperoni, sausages, beef chunks, and turkey strips.", price: 2500, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "non-veg", isVeg: false, isSpicy: false, isPopular: true, rating: 4.9, reviewsCount: 1800, tags: ["MEATY", "HEAVY"] },
  { name: "Chicken Fajita", tagline: "Tex-Mex flavors", description: "Fajita seasoned chicken with bell peppers and onions.", price: 1900, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "non-veg", isVeg: false, isSpicy: true, isPopular: true, rating: 4.7, reviewsCount: 1100, tags: ["FAJITA"] },
  { name: "Beef Pepperoni", tagline: "The absolute classic", description: "Premium beef pepperoni slices covering the entire pizza.", price: 1950, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "non-veg", isVeg: false, isSpicy: false, isPopular: true, rating: 4.8, reviewsCount: 1600, tags: ["CLASSIC", "PEPPERONI"] },

  // BBQ
  { name: "Smoked BBQ Chicken", tagline: "Sweet and smoky", description: "BBQ sauce base with smoked chicken and caramelized onions.", price: 2000, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "bbq", isVeg: false, isSpicy: false, isPopular: true, rating: 4.7, reviewsCount: 890, tags: ["BBQ", "SWEET"] },
  { name: "BBQ Beef Brisket", tagline: "Slow-cooked perfection", description: "Tender beef brisket drizzled with honey BBQ sauce.", price: 2400, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "bbq", isVeg: false, isSpicy: false, isPopular: false, rating: 4.8, reviewsCount: 340, tags: ["PREMIUM", "BEEF"] },
  { name: "Spicy BBQ Wings Pizza", tagline: "Wings but on a pizza", description: "Boneless spicy BBQ wings on a cheesy crust.", price: 2150, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "bbq", isVeg: false, isSpicy: true, isPopular: false, rating: 4.5, reviewsCount: 200, tags: ["SPICY", "BBQ"] },

  // CLASSIC
  { name: "Classic Margherita", tagline: "Simple and authentic", description: "Tomato sauce, fresh mozzarella, and basil leaves.", price: 1400, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "classic", isVeg: true, isSpicy: false, isPopular: true, rating: 4.6, reviewsCount: 750, tags: ["CLASSIC", "VEG"] },
  { name: "Hawaiian Dream", tagline: "Sweet and savory", description: "Turkey bacon strips and fresh pineapple chunks.", price: 1750, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "classic", isVeg: false, isSpicy: false, isPopular: false, rating: 4.2, reviewsCount: 400, tags: ["SWEET"] },
  { name: "Italian Sausage", tagline: "Rustic Italian flavors", description: "Ground Italian sausage with roasted red peppers.", price: 1850, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "classic", isVeg: false, isSpicy: false, isPopular: false, rating: 4.5, reviewsCount: 300, tags: ["ITALIAN"] },

  // LOADED
  { name: "Crown Crust Kabab", tagline: "A feast for royalty", description: "Crust stuffed with seekh kababs, topped with extra meat.", price: 2800, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "loaded", isVeg: false, isSpicy: true, isPopular: true, rating: 4.9, reviewsCount: 2500, tags: ["STUFFED", "PREMIUM"] },
  { name: "Super Supreme Loaded", tagline: "Everything on it", description: "Every topping available in the kitchen, double cheese.", price: 3000, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "loaded", isVeg: false, isSpicy: false, isPopular: false, rating: 4.7, reviewsCount: 800, tags: ["HEAVY", "LOADED"] },
  { name: "Lava Cheese Burst", tagline: "Liquid cheese center", description: "A mountain of cheese that oozes out when you bite.", price: 2600, image: "/src/assets/images/pizza_pepperoni_1780276165703.png", category: "loaded", isVeg: true, isSpicy: false, isPopular: true, rating: 4.8, reviewsCount: 1400, tags: ["CHEESE", "BURST"] }
]);`;

const newCoupons = `await Coupon.insertMany([
      { code: "KARACHI500", discountValue: 500, discountType: "Flat", minOrderAmount: 2000, uses: 120, expiryDate: new Date("2026-12-31"), status: "Active" },
      { code: "AZADI14", discountValue: 14, discountType: "Percentage", minOrderAmount: 1500, uses: 85, expiryDate: new Date("2026-08-14"), status: "Active" },
      { code: "DEFENCE20", discountValue: 20, discountType: "Percentage", minOrderAmount: 3000, uses: 45, expiryDate: new Date("2026-10-01"), status: "Active" },
      { code: "TEST500", discountValue: 500, discountType: "Flat", minOrderAmount: 1000, uses: 999, expiryDate: new Date("2027-12-31"), status: "Active" }
    ]);`;

const newDeals = `await Deal.insertMany([
      { title: "COZY DEAL", discountBadge: "BEST VALUE", description: "2 Jumbo Pizzas + Free Chilled Soda + 3 Garlic Dips.", originalPrice: 3500, dealPrice: 1650, validUntil: new Date(Date.now() + 4 * 86400 * 1000), isLimited: true, isActive: true },
      { title: "MID-WEEK MADNESS", discountBadge: "30% OFF", description: "Get 30% off on all large Malai Boti pizzas.", originalPrice: 2800, dealPrice: 1960, validUntil: new Date(Date.now() + 5 * 86400 * 1000), isLimited: true, isActive: true },
      { title: "FAMILY FIESTA", discountBadge: "SAVE RS.1000", description: "2 Large Pizzas + 1.5L Drink + Garlic Bread.", originalPrice: 5000, dealPrice: 4000, validUntil: new Date(Date.now() + 7 * 86400 * 1000), isLimited: true, isActive: true }
    ]);`;

seedContent = seedContent.replace(/await Pizza\.insertMany\(\[[\s\S]*?\]\);/, newPizzas);
seedContent = seedContent.replace(/await Coupon\.insertMany\(\[[\s\S]*?\]\);/, newCoupons);
seedContent = seedContent.replace(/await Deal\.insertMany\(\[[\s\S]*?\]\);/, newDeals);

fs.writeFileSync(seedFilePath, seedContent);
console.log('Seed file updated successfully');
