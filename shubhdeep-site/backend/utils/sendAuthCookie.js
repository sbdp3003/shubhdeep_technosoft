// Signs a JWT for the user and sets it as an httpOnly cookie on the response.
import generateToken from './generateToken.js';

const COOKIE_DAYS = 7;

export const sendAuthCookie = (res, userId) => {
  const token = generateToken(userId);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: COOKIE_DAYS * 24 * 60 * 60 * 1000,
    path: '/'
  });
  return token;
};

export const clearAuthCookie = (res) => {
  res.clearCookie('token', { path: '/' });
};
