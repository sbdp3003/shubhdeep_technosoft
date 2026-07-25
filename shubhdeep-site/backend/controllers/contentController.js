import SiteContent from '../models/SiteContent.js';

const ALLOWED_KEYS = ['hero', 'about', 'contact'];

export const getAllContent = async (req, res, next) => {
  try {
    const docs = await SiteContent.find({ key: { $in: ALLOWED_KEYS } });
    const result = {};
    ALLOWED_KEYS.forEach((k) => {
      const doc = docs.find((d) => d.key === k);
      result[k] = doc ? doc.data : {};
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: `Invalid content key. Use one of: ${ALLOWED_KEYS.join(', ')}` });
    }
    const doc = await SiteContent.findOne({ key });
    res.json({ success: true, data: doc ? doc.data : {} });
  } catch (err) {
    next(err);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: `Invalid content key. Use one of: ${ALLOWED_KEYS.join(', ')}` });
    }

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { key, data: req.body, updatedBy: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: `${key} content updated`, data: doc.data });
  } catch (err) {
    next(err);
  }
};