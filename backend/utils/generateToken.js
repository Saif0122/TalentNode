const jwt = require('jsonwebtoken');

/**
 * Generates a JWT with embedded role and email for fast-path auth verification,
 * sets it as an HttpOnly cookie, and returns the token string.
 * 
 * @param {Object} res - Express response
 * @param {Object} user - User document with _id, role, and email
 */
const generateTokenAndSetCookie = (res, user) => {
  // Embed role and email so authMiddleware can authorize without a DB lookup
  const payload = {
    id: user._id || user.id,
    role: user.role,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10);
  
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  res.cookie('token', token, cookieOptions);
  
  return token;
};

module.exports = generateTokenAndSetCookie;
