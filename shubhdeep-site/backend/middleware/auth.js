import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Reads the JWT from the httpOnly cookie set at login/register
export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, please log in' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Not authorized, account inactive or not found' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
  }
};

// Optional auth: attaches req.user if a valid cookie exists, otherwise continues silently.
export const optionalAuth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    req.user = null;
  }
  next();
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Not permitted to perform this action' });
  }
  next();
};
