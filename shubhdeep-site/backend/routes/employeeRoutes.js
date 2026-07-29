// import express from 'express';
// import { body } from 'express-validator';
// import { getEmployees, getEmployeeById, addEmployee, updateEmployee, deactivateEmployee } from '../controllers/employeeController.js';
// import { protect, authorize } from '../middleware/auth.js';
// import { validateRequest } from '../middleware/validateRequest.js';

// const router = express.Router();

// router.use(protect);

// router.get('/', authorize('admin'), getEmployees);
// router.post(
//   '/',
//   authorize('admin'),
//   [
//     body('name').trim().notEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('A valid email is required')
//   ],
//   validateRequest,
//   addEmployee
// );
// router.get('/:id', getEmployeeById);
// router.put('/:id', updateEmployee);
// router.delete('/:id', authorize('admin'), deactivateEmployee);

// export default router;



import express from 'express';
import { body } from 'express-validator';
import { getEmployees, getEmployeeById, addEmployee, updateEmployee, deactivateEmployee, reactivateEmployee, deleteEmployeePermanently } from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getEmployees);
router.post(
  '/',
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required')
  ],
  validateRequest,
  addEmployee
);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', authorize('admin'), deactivateEmployee);
router.patch('/:id/reactivate', authorize('admin'), reactivateEmployee);
router.delete('/:id/permanent', authorize('admin'), deleteEmployeePermanently);

export default router;