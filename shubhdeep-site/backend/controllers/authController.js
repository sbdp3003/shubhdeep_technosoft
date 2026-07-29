// import User from '../models/User.js';
// import { sendAuthCookie, clearAuthCookie } from '../utils/sendAuthCookie.js';

// // @route POST /api/auth/register  (public — self-signup, always creates an "employee" account)
// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ success: false, message: 'An account with this email already exists. Try logging in instead.' });
//     }

//     const user = await User.create({ name, email, password, role: 'employee' });
//     sendAuthCookie(res, user._id);

//     res.status(201).json({
//       success: true,
//       message: 'Account created successfully',
//       user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route POST /api/auth/login  (admin or employee — role comes back so the client can route accordingly)
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ success: false, message: 'Incorrect email or password. Please try again.' });
//     }
//     if (!user.isActive) {
//       return res.status(403).json({ success: false, message: 'This account has been deactivated. Contact your admin.' });
//     }

//     sendAuthCookie(res, user._id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @route POST /api/auth/logout
// export const logout = (req, res) => {
//   clearAuthCookie(res);
//   res.json({ success: true, message: 'Logged out' });
// };

// // @route GET /api/auth/me  (used by the navbar to show the logged-in user's name)
// export const getMe = async (req, res) => {
//   res.json({ success: true, user: req.user });
// };



import User from '../models/User.js';
import { sendAuthCookie, clearAuthCookie } from '../utils/sendAuthCookie.js';

// @route POST /api/auth/register  (public — self-signup, always creates an "employee" account)
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Try logging in instead.' });
    }

    const user = await User.create({ name, email, password, role: 'employee' });
    const token = sendAuthCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login  (admin or employee — role comes back so the client can route accordingly)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password. Please try again.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Contact your admin.' });
    }

    const token = sendAuthCookie(res, user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/logout
export const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out' });
};

// @route GET /api/auth/me  (used by the navbar to show the logged-in user's name)
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};