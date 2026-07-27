import express from 'express';
import { body } from 'express-validator';
import { submitContact, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  validateRequest,
  submitContact
);

router.get('/', protect, authorize('admin'), getContacts);
router.patch('/:id/status', protect, authorize('admin'), updateContactStatus);

export default router;