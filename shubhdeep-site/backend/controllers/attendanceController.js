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

// @route GET /api/attendance/export?month=YYYY-MM&employee=<id (optional)>   (admin)
// Downloads an Excel sheet of that month's attendance, with check-in/check-out times and hours worked.
export const exportAttendanceExcel = async (req, res, next) => {
  try {
    const { month, employee } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ success: false, message: 'Please provide a month in YYYY-MM format' });
    }

    const [year, mon] = month.split('-').map(Number);
    const monthStart = new Date(year, mon - 1, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, mon, 0, 23, 59, 59, 999); // last day of that month

    const filter = { date: { $gte: monthStart, $lte: monthEnd } };
    if (employee) filter.employee = employee;

    const records = await Attendance.find(filter).populate('employee', 'name email position').sort({ date: 1 });

    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const monthLabel = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const sheet = workbook.addWorksheet(monthLabel);

    sheet.columns = [
      { header: 'Employee Name', key: 'name', width: 24 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Position', key: 'position', width: 18 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Check In', key: 'checkIn', width: 14 },
      { header: 'Check Out', key: 'checkOut', width: 14 },
      { header: 'Hours Worked', key: 'hours', width: 14 },
      { header: 'Note', key: 'note', width: 30 }
    ];
    sheet.getRow(1).font = { bold: true };

    records.forEach((r) => {
      let hours = '';
      if (r.checkIn && r.checkOut) {
        hours = ((new Date(r.checkOut) - new Date(r.checkIn)) / 1000 / 60 / 60).toFixed(2);
      }
      sheet.addRow({
        name: r.employee?.name || '—',
        email: r.employee?.email || '—',
        position: r.employee?.position || '—',
        date: new Date(r.date).toLocaleDateString(),
        status: r.status,
        checkIn: r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—',
        checkOut: r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—',
        hours,
        note: r.note || ''
      });
    });

    const fileName = `attendance-${month}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};



// import Attendance from '../models/Attendance.js';

// const dayBounds = (dateStr) => {
//   const start = dateStr ? new Date(dateStr) : new Date();
//   start.setHours(0, 0, 0, 0);
//   const end = new Date(start);
//   end.setHours(23, 59, 59, 999);
//   return { start, end };
// };

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

// export const getMyAttendance = async (req, res, next) => {
//   try {
//     const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 }).limit(60);
//     res.json({ success: true, count: records.length, data: records });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getTodayAttendance = async (req, res, next) => {
//   try {
//     const { start, end } = dayBounds();
//     const record = await Attendance.findOne({ employee: req.user._id, date: { $gte: start, $lte: end } });
//     res.json({ success: true, data: record || null });
//   } catch (err) {
//     next(err);
//   }
// };

// export const checkIn = async (req, res, next) => {
//   try {
//     const { start } = dayBounds();

//     const existing = await Attendance.findOne({ employee: req.user._id, date: start });
//     if (existing && existing.checkIn) {
//       return res.status(400).json({ success: false, message: "You've already checked in today." });
//     }

//     const record = await Attendance.findOneAndUpdate(
//       { employee: req.user._id, date: start },
//       { employee: req.user._id, date: start, status: 'present', checkIn: new Date() },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     res.status(201).json({ success: true, message: 'Checked in successfully', data: record });
//   } catch (err) {
//     next(err);
//   }
// };

// export const checkOut = async (req, res, next) => {
//   try {
//     const { start } = dayBounds();

//     const record = await Attendance.findOne({ employee: req.user._id, date: start });
//     if (!record || !record.checkIn) {
//       return res.status(400).json({ success: false, message: 'Please check in before checking out.' });
//     }
//     if (record.checkOut) {
//       return res.status(400).json({ success: false, message: "You've already checked out today." });
//     }

//     record.checkOut = new Date();
//     await record.save();

//     res.json({ success: true, message: 'Checked out successfully', data: record });
//   } catch (err) {
//     next(err);
//   }
// };