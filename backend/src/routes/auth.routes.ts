import express from 'express';
import jwt from 'jsonwebtoken';
import { validate, loginSchema } from '../middlewares/validation.middleware.js';
import { Admin } from '../models/Admin.model.js';


const router = express.Router();

router.post('/login', validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  try {
    // Note: Assuming 'username' in the login form acts as the 'email' for the Admin model.
    const admin = await Admin.findOne({ email: username });

    if (admin && (await (admin as any).comparePassword(password))) {
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
