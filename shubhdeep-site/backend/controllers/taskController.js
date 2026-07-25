import Task from '../models/Task.js';
import User from '../models/User.js';

const dayBounds = (dateStr) => {
  const start = dateStr ? new Date(dateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @route POST /api/tasks   (admin) — assign a task / daily goal to an employee
export const createTask = async (req, res, next) => {
  try {
    const { title, dailyGoal, description, assignedTo, date, dueDate, priority } = req.body;

    const employee = await User.findOne({ _id: assignedTo, role: 'employee' });
    if (!employee) return res.status(404).json({ success: false, message: 'Assigned employee not found' });

    const task = await Task.create({
      title,
      dailyGoal,
      description,
      assignedTo,
      assignedBy: req.user._id,
      date: date || new Date(),
      dueDate,
      priority: priority || 'medium'
    });

    res.status(201).json({ success: true, message: 'Task assigned', data: task });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/tasks   (admin: all/filterable · employee: own only)
export const getTasks = async (req, res, next) => {
  try {
    const { employeeId, status, date, from, to } = req.query;
    const filter = {};

    if (req.user.role === 'employee') {
      filter.assignedTo = req.user._id;
    } else if (employeeId) {
      filter.assignedTo = employeeId;
    }

    if (status) filter.status = status;

    if (date) {
      const { start, end } = dayBounds(date);
      filter.date = { $gte: start, $lte: end };
    } else if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email position')
      .populate('assignedBy', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/tasks/today   (employee) — convenience: today's tasks for the logged-in employee
export const getTodayTasks = async (req, res, next) => {
  try {
    const { start, end } = dayBounds();
    const tasks = await Task.find({ assignedTo: req.user._id, date: { $gte: start, $lte: end } }).sort({ priority: -1, createdAt: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/tasks/:id   (admin) — edit task details
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    ['title', 'dailyGoal', 'description', 'date', 'dueDate', 'priority', 'assignedTo'].forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    await task.save();
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/tasks/:id/status   (employee updates own · admin can update any)
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const isOwner = task.assignedTo.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    task.status = status;
    if (remarks !== undefined) task.remarks = remarks;
    await task.save();

    res.json({ success: true, message: 'Task status updated', data: task });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/tasks/:id   (admin)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
