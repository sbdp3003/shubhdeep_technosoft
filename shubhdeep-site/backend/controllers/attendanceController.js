// import Attendance from '../models/Attendance.js';

// const dayBounds = (dateStr) => {
//   const start = dateStr ? new Date(dateStr) : new Date();
//   start.setHours(0, 0, 0, 0);
//   const end = new Date(start);
//   end.setHours(23, 59, 59, 999);
//   return { start, end };
// };

// // @route POST /api/attendance   (admin) — mark/update attendance for an employee on a given date
// export const markAttendance = async (req, res, next) => {
//   try {
//     const { employee, date, status, note } = req.body;
//     const { start } = dayBounds(date);

//     const record = await Attendance.findOneAndUpdate(
//       { employee, date: start },
//       { employee, date: start, status, note, markedBy: req.user._id },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     res.status(201).json({ success: true, message: 'Attendance recorded', data: record });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route GET /api/attendance   (admin) — filter by employee and/or date range
// export const getAttendance = async (req, res, next) => {
//   try {
//     const { employee, from, to } = req.query;
//     const filter = {};
//     if (employee) filter.employee = employee;
//     if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };

//     const records = await Attendance.find(filter).populate('employee', 'name email position').sort({ date: -1 });
//     res.json({ success: true, count: records.length, data: records });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route GET /api/attendance/me   (employee) — own attendance history
// export const getMyAttendance = async (req, res, next) => {
//   try {
//     const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 }).limit(60);
//     res.json({ success: true, count: records.length, data: records });
//   } catch (err) {
//     next(err);
//   }
// };




import Attendance from '../models/Attendance.js';

const dayBounds = (dateStr) => {
  const start = dateStr ? new Date(dateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const markAttendance = async (req, res, next) => {
  try {
    const { employee, date, status, note } = req.body;
    const { start } = dayBounds(date);

    const record = await Attendance.findOneAndUpdate(
      { employee, date: start },
      { employee, date: start, status, note, markedBy: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: 'Attendance recorded', data: record });
  } catch (err) {
    next(err);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { employee, from, to } = req.query;
    const filter = {};
    if (employee) filter.employee = employee;
    if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };

    const records = await Attendance.find(filter).populate('employee', 'name email position').sort({ date: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 }).limit(60);
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

export const getTodayAttendance = async (req, res, next) => {
  try {
    const { start, end } = dayBounds();
    const record = await Attendance.findOne({ employee: req.user._id, date: { $gte: start, $lte: end } });
    res.json({ success: true, data: record || null });
  } catch (err) {
    next(err);
  }
};

export const checkIn = async (req, res, next) => {
  try {
    const { start } = dayBounds();

    const existing = await Attendance.findOne({ employee: req.user._id, date: start });
    if (existing && existing.checkIn) {
      return res.status(400).json({ success: false, message: "You've already checked in today." });
    }

    const record = await Attendance.findOneAndUpdate(
      { employee: req.user._id, date: start },
      { employee: req.user._id, date: start, status: 'present', checkIn: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: 'Checked in successfully', data: record });
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const { start } = dayBounds();

    const record = await Attendance.findOne({ employee: req.user._id, date: start });
    if (!record || !record.checkIn) {
      return res.status(400).json({ success: false, message: 'Please check in before checking out.' });
    }
    if (record.checkOut) {
      return res.status(400).json({ success: false, message: "You've already checked out today." });
    }

    record.checkOut = new Date();
    await record.save();

    res.json({ success: true, message: 'Checked out successfully', data: record });
  } catch (err) {
    next(err);
  }
};