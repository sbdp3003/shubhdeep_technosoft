import express from 'express';
import { body } from 'express-validator';
import { getServices, getAllServicesAdmin, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', getServices);
router.get('/all', protect, authorize('admin'), getAllServicesAdmin);
router.post(
  '/',
  protect,
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Service name is required'), body('desc').trim().notEmpty().withMessage('Description is required')],
  validateRequest,
  createService
);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;