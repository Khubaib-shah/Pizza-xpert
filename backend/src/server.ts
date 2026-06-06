import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import pizzaRoutes from './routes/pizza.routes.js';
import orderRoutes from './routes/order.routes.js';
import customerRoutes from './routes/customer.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import staffRoutes from './routes/staff.routes.js';
import contentRoutes from './routes/content.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import heroSlideRoutes from './routes/heroSlide.routes.js';
import menuConfigRoutes from './routes/menuConfig.routes.js';
import categoryRoutes from './routes/category.routes.js';
import dealRoutes from './routes/deal.routes.js';
import mediaRoutes from './routes/media.routes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middlewares
app.use((helmet as any)());

// Configure CORS for production domains (add local for dev)
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Limit body size

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/menu-config', menuConfigRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/gallery', mediaRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pizza Xpert API is running securely' });
});

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port http://localhost:${PORT}`);
});
