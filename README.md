# 🍕 Pizza Xpert

> Expertise In Every Slice! A cinematic, high-converting premium digital pizza ordering product.

![Pizza Xpert Banner](https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop) *(Placeholder Image)*

Pizza Xpert is a full-stack, modern pizza ordering application built with a massive focus on **user experience, micro-interactions, and premium design**. It features a stunning, dynamic frontend for customers and a robust, secure backend for restaurant administration.

## 🚀 Features

### Customer Storefront
*   **Cinematic UI/UX:** Premium dark mode aesthetic with custom CSS micro-animations, glassmorphism, and responsive design.
*   **Progressive Customization Flow:** A step-by-step accordion modal for customizing pizzas (Size → Crust → Sauce → Extras) to eliminate decision fatigue.
*   **Visual Ingredient Feedback:** Real-time visual updates to the pizza preview when toppings and extras are selected.
*   **Dynamic Pricing:** Live-calculating sticky totals that update as users build their custom orders.
*   **API Caching:** In-memory request caching to prevent redundant backend calls and ensure butter-smooth scrolling.

### Admin Panel
*   **Secure Dashboard:** JWT-authenticated portal for staff and managers.
*   **Live Order Tracking:** Kanban-style board to manage order statuses (New → Preparing → Out for Delivery → Delivered).
*   **Menu Management:** Create, update, and manage pizza inventory.

## 🛠 Tech Stack

**Frontend:**
*   React 18
*   Vite
*   Tailwind CSS (with custom utility classes and animations)
*   Lucide React (Icons)
*   React Router DOM

**Backend:**
*   Node.js & Express
*   MongoDB & Mongoose
*   JWT Authentication
*   Bcrypt (Password Hashing)

## 📦 Project Structure

The project is organized into a modular monorepo-style structure:

```text
pizza-xpert/
├── frontend/             # React/Vite web application
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Hero, Customizer, Admin Panel)
│   │   ├── services/     # API request logic (with caching)
│   │   └── index.css     # Global styles and custom animation utilities
│   └── package.json
└── backend/              # Node/Express server
    ├── src/
    │   ├── controllers/  # Route logic and business rules
    │   ├── models/       # MongoDB Mongoose schemas
    │   ├── routes/       # Express API endpoints
    │   └── server.ts     # Main application entry point
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Database (Local or Atlas URI)

### 1. Setup Backend
```bash
cd backend
npm install

# Create a .env file and add your MongoDB connection string
echo "MONGODB_URI=your_connection_string" > .env
echo "JWT_SECRET=super_secret_key" >> .env

# Start the server (Runs on port 5000 by default)
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Start the Vite development server (Runs on port 5173 by default)
npm run dev
```

## 🎨 Design System

The application relies heavily on a curated color palette defined in `index.css`:
*   **Charcoal:** `#1a1a1a` (Primary Background)
*   **Burgundy:** `#8B0000` (Accent Background)
*   **Cheese:** `#F5B109` (Primary Accent/Highlights)
*   **Tomato:** `#E63946` (Secondary Accent/Alerts)
*   **Cream:** `#FDFBF7` (Primary Text)

All buttons utilize custom CSS animations (`.btn-primary-anim` and `.btn-secondary-anim`) to maintain a premium feel.

---
*Built with passion for the perfect slice.*
