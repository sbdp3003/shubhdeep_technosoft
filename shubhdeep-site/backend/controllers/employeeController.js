// import User from '../models/User.js';
// import Task from '../models/Task.js';
// import Attendance from '../models/Attendance.js';

// const startOfToday = () => {
//   const d = new Date();
//   d.setHours(0, 0, 0, 0);
//   return d;
// };
// const endOfToday = () => {
//   const d = new Date();
//   d.setHours(23, 59, 59, 999);
//   return d;
// };

// // @route GET /api/employees   (admin) — list with today's attendance + task snapshot
// export const getEmployees = async (req, res, next) => {
//   try {
//     const { search, position, status } = req.query;
//     const filter = { role: 'employee', isActive: true };
//     if (status) filter.isActive = status === 'active';

//     let employees = await User.find(filter).sort({ createdAt: -1 });

//     if (search) {
//       const q = search.toLowerCase();
//       employees = employees.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone?.includes(q));
//     }
//     if (position) {
//       employees = employees.filter((e) => e.position?.toLowerCase() === position.toLowerCase());
//     }

//     const todayStart = startOfToday();
//     const todayEnd = endOfToday();

//     const enriched = await Promise.all(
//       employees.map(async (emp) => {
//         const [todayAttendance, todayTasks] = await Promise.all([
//           Attendance.findOne({ employee: emp._id, date: { $gte: todayStart, $lte: todayEnd } }),
//           Task.find({ assignedTo: emp._id, date: { $gte: todayStart, $lte: todayEnd } })
//         ]);
//         const completed = todayTasks.filter((t) => t.status === 'completed').length;
//         return {
//           ...emp.toObject(),
//           todayAttendance: todayAttendance?.status || 'unmarked',
//           todayTaskCount: todayTasks.length,
//           todayTaskCompleted: completed
//         };
//       })
//     );

//     res.json({ success: true, count: enriched.length, data: enriched });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route GET /api/employees/:id   (admin, or the employee viewing their own record)
// export const getEmployeeById = async (req, res, next) => {
//   try {
//     if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
//     }
//     const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
//     if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
//     res.json({ success: true, data: employee });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route POST /api/employees   (admin) — admin directly creates an employee account
// export const addEmployee = async (req, res, next) => {
//   try {
//     const { name, email, password, phone, position, department } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists' });

//     const employee = await User.create({
//       name,
//       email,
//       password: password || 'Welcome@123', // temporary password if none given; employee should change it later
//       phone,
//       position,
//       department: department || 'General',
//       role: 'employee'
//     });

//     res.status(201).json({ success: true, message: 'Employee added', data: employee });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route PUT /api/employees/:id   (admin, or the employee themselves for limited fields)
// export const updateEmployee = async (req, res, next) => {
//   try {
//     const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
//     if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

//     const isSelf = employee._id.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === 'admin';
//     if (!isSelf && !isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' });

//     if (req.body.email && req.body.email !== employee.email) {
//       const existingEmail = await User.findOne({ email: req.body.email.toLowerCase() });
//       if (existingEmail) return res.status(400).json({ success: false, message: 'An account with this email already exists' });
//     }

//     const allowed = isAdmin ? ['name', 'email', 'phone', 'position', 'department', 'isActive', 'password'] : ['phone'];
//     allowed.forEach((f) => {
//       if (req.body[f] !== undefined) employee[f] = req.body[f];
//     });

//     await employee.save();
//     res.json({ success: true, message: 'Employee updated', data: employee });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route DELETE /api/employees/:id   (admin) — deactivate, not hard delete
// export const deactivateEmployee = async (req, res, next) => {
//   try {
//     const employee = await User.findOneAndUpdate({ _id: req.params.id, role: 'employee' }, { isActive: false }, { new: true });
//     if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
//     res.json({ success: true, message: 'Employee deactivated' });
//   } catch (err) {
//     next(err);
//   }
// };



import User from '../models/User.js';
import Task from '../models/Task.js';
import Attendance from '../models/Attendance.js';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

// @route GET /api/employees   (admin) — list with today's attendance + task snapshot
export const getEmployees = async (req, res, next) => {
  try {
    const { search, position, status } = req.query;
    const filter = { role: 'employee' };
    if (status) filter.isActive = status === 'active';

    let employees = await User.find(filter).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone?.includes(q));
    }
    if (position) {
      employees = employees.filter((e) => e.position?.toLowerCase() === position.toLowerCase());
    }

    const todayStart = startOfToday();
    const todayEnd = endOfToday();

    const enriched = await Promise.all(
      employees.map(async (emp) => {
        const [todayAttendance, todayTasks] = await Promise.all([
          Attendance.findOne({ employee: emp._id, date: { $gte: todayStart, $lte: todayEnd } }),
          Task.find({ assignedTo: emp._id, date: { $gte: todayStart, $lte: todayEnd } })
        ]);
        const completed = todayTasks.filter((t) => t.status === 'completed').length;
        return {
          ...emp.toObject(),
          todayAttendance: todayAttendance?.status || 'unmarked',
          todayTaskCount: todayTasks.length,
          todayTaskCompleted: completed
        };
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/employees/:id   (admin, or the employee viewing their own record)
export const getEmployeeById = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }
    const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/employees   (admin) — admin directly creates an employee account
export const addEmployee = async (req, res, next) => {
  try {
    const { name, email, password, phone, position, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists' });

    const employee = await User.create({
      name,
      email,
      password: password || 'Welcome@123', // temporary password if none given; employee should change it later
      phone,
      position,
      department: department || 'General',
      role: 'employee'
    });

    res.status(201).json({ success: true, message: 'Employee added', data: employee });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/employees/:id   (admin, or the employee themselves for limited fields)
export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    const isSelf = employee._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isSelf && !isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' });

    if (req.body.email && req.body.email !== employee.email) {
      const existingEmail = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existingEmail) return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const allowed = isAdmin ? ['name', 'email', 'phone', 'position', 'department', 'isActive', 'password'] : ['phone'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) employee[f] = req.body[f];
    });

    await employee.save();
    res.json({ success: true, message: 'Employee updated', data: employee });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/employees/:id   (admin) — deactivate, not hard delete
export const deactivateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findOneAndUpdate({ _id: req.params.id, role: 'employee' }, { isActive: false }, { new: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee deactivated' });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/employees/:id/reactivate   (admin) — undo a deactivation, lets them log in again
export const reactivateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findOneAndUpdate({ _id: req.params.id, role: 'employee' }, { isActive: true }, { new: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee reactivated', data: employee });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/employees/:id/permanent   (admin) — permanently removes the account
// (frees up their email for reuse) and cleans up their tasks/attendance history.
export const deleteEmployeePermanently = async (req, res, next) => {
  try {
    const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    await Promise.all([
      Task.deleteMany({ assignedTo: employee._id }),
      Attendance.deleteMany({ employee: employee._id }),
      employee.deleteOne()
    ]);

    res.json({ success: true, message: 'Employee permanently deleted' });
  } catch (err) {
    next(err);
  }
};