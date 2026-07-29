
// import express from 'express';
// import { markAttendance, getAttendance, getMyAttendance, getTodayAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';
// import { protect, authorize } from '../middleware/auth.js';

// const router = express.Router();

// router.use(protect);

// router.get('/today', getTodayAttendance);
// router.get('/me', getMyAttendance);
// router.post('/checkin', checkIn);
// router.post('/checkout', checkOut);

// router.get('/', authorize('admin'), getAttendance);
// router.post('/', authorize('admin'), markAttendance);

// export default router;


// import express from 'express';
// import { markAttendance, getAttendance, getMyAttendance } from '../controllers/attendanceController.js';
// import { protect, authorize } from '../middleware/auth.js';

// const router = express.Router();

// router.use(protect);

// router.get('/me', getMyAttendance);
// router.get('/', authorize('admin'), getAttendance);
// router.post('/', authorize('admin'), markAttendance);

// export default router;



import express from 'express';
import { markAttendance, getAttendance, getMyAttendance, getTodayAttendance, checkIn, checkOut, exportAttendanceExcel } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/today', getTodayAttendance);
router.get('/me', getMyAttendance);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

router.get('/export', authorize('admin'), exportAttendanceExcel);
router.get('/', authorize('admin'), getAttendance);
router.post('/', authorize('admin'), markAttendance);

export default router;