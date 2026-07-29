import Lead from '../models/Lead.js';

// @route POST /api/leads   (employee) — log a new lead
export const createLead = async (req, res, next) => {
  try {
    const { date, time, customerName, organization, contact, address, requirement, followUp, remark } = req.body;

    if (!date || !time || !customerName) {
      return res.status(400).json({ success: false, message: 'Date, time and customer name are required' });
    }

    const lead = await Lead.create({
      employee: req.user._id,
      date,
      time,
      customerName,
      organization,
      contact,
      address,
      requirement,
      followUp: followUp || 'active',
      remark
    });

    res.status(201).json({ success: true, message: 'Lead saved', data: lead });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/leads   (admin) — all leads across employees, with optional filters
// Query params: employee=<userId>, date=YYYY-MM-DD, from=YYYY-MM-DD, to=YYYY-MM-DD, followUp=<status>
export const getAllLeads = async (req, res, next) => {
  try {
    const { employee, date, from, to, followUp } = req.query;
    const filter = {};

    if (employee) filter.employee = employee;
    if (followUp) filter.followUp = followUp;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    } else if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const leads = await Lead.find(filter).populate('employee', 'name email').sort({ date: -1, createdAt: -1 });

    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/leads/mine   (employee) — their own logged leads
export const getMyLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ employee: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/leads/:id   (employee — own lead only, or admin — any lead)
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const isOwner = lead.employee.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lead' });
    }

    const allowed = ['date', 'time', 'customerName', 'organization', 'contact', 'address', 'requirement', 'followUp', 'remark'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) lead[f] = req.body[f];
    });

    await lead.save();
    res.json({ success: true, message: 'Lead updated', data: lead });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/leads/:id   (employee — own lead only, or admin — any lead)
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const isOwner = lead.employee.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};