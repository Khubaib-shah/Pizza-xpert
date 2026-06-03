import express from 'express';
import jwt from 'jsonwebtoken';
import { validate, loginSchema } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/login', validate(loginSchema), (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin for demonstration, you can move this to DB later
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { id: 'admin1', role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
