import express from 'express';
import { getAllContent, getContentByKey, updateContent } from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:key', getContentByKey);
router.put('/:key', protect, authorize('admin'), updateContent);

export default router;