import express from 'express';
import { body } from 'express-validator';
import { createLead, getAllLeads, getMyLeads, updateLead, deleteLead } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getAllLeads);
router.get('/mine', getMyLeads);

router.post(
  '/',
  [
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('customerName').trim().notEmpty().withMessage('Customer name is required')
  ],
  validateRequest,
  createLead
);

router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;