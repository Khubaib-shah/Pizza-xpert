import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation Error', errors: error.issues });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(5, "Password must be at least 5 characters"),
  }),
});

export const orderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z.string().min(10, "Valid phone number is required"),
    items: z.array(z.any()).min(1, "Order must have at least one item"),
    subtotal: z.number().positive(),
    tax: z.number().min(0),
    deliveryFee: z.number().min(0),
    total: z.number().positive(),
  })
});
