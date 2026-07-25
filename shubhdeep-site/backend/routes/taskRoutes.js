import express from 'express';
import { body } from 'express-validator';
import { createTask, getTasks, getTodayTasks, updateTask, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/today', getTodayTasks);
router.get('/', getTasks);
router.post(
  '/',
  authorize('admin'),
  [body('title').trim().notEmpty().withMessage('Task title is required'), body('assignedTo').notEmpty().withMessage('Please select an employee')],
  validateRequest,
  createTask
);
router.put('/:id', authorize('admin'), updateTask);
router.patch(
  '/:id/status',
  [body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')],
  validateRequest,
  updateTaskStatus
);
router.delete('/:id', authorize('admin'), deleteTask);

export default router;
