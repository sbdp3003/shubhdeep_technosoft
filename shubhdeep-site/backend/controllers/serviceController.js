import Service from '../models/Service.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { icon, name, desc, feats, order, isActive } = req.body;
    const service = await Service.create({
      icon,
      name,
      desc,
      feats: Array.isArray(feats) ? feats : String(feats || '').split(',').map((s) => s.trim()).filter(Boolean),
      order: order ?? 0,
      isActive: isActive ?? true
    });
    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { icon, name, desc, feats, order, isActive } = req.body;
    const update = { icon, name, desc, order, isActive };
    if (feats !== undefined) {
      update.feats = Array.isArray(feats) ? feats : String(feats).split(',').map((s) => s.trim()).filter(Boolean);
    }
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service updated', data: service });
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
};