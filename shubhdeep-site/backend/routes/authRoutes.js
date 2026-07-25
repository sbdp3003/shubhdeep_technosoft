import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Please enter your full name'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Please enter a valid email address'), body('password').notEmpty().withMessage('Password is required')],
  validateRequest,
  login
);

router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
