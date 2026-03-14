const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * @desc    Protect routes - Verify JWT in cookie or header
 * Optimization: embeds role in token so we skip DB lookup unless role is missing.
 */
const protect = async (req, res, next) => {
  let token;

  if (isDev) console.log(`[Auth] Incoming Request: ${req.method} ${req.originalUrl}`);
  
  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (isDev) console.log('[Auth] Token found in Authorization header');
  }
  // 2. Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    if (isDev) console.log('[Auth] Token found in cookies');
  }

  if (!token) {
    if (isDev) console.warn('[Auth] No token provided');
    return res.status(401).json({
      status: 'fail',
      error: 'Not authorized, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (isDev) console.log(`[Auth] Token verified for User ID: ${decoded.id}`);

    // Fast path: if role is embedded in token, skip DB lookup
    if (decoded.role && decoded.id) {
      req.user = { _id: decoded.id, id: decoded.id, role: decoded.role, email: decoded.email };
      if (isDev) console.log(`[Auth] User authenticated (fast): ${decoded.email} (Role: ${decoded.role})`);
      return next();
    }

    // Slow path: fetch from DB if role not in token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      if (isDev) console.warn(`[Auth] User no longer exists for ID: ${decoded.id}`);
      return res.status(401).json({
        status: 'fail',
        error: 'The user belonging to this token no longer exists.'
      });
    }

    if (isDev) console.log(`[Auth] User authenticated: ${req.user.email} (Role: ${req.user.role})`);
    next();
  } catch (error) {
    if (isDev) console.error(`[Auth] JWT Verification Failed: ${error.message}`);
    return res.status(401).json({
      status: 'fail',
      error: 'Not authorized, token failed'
    });
  }
};

/**
 * @desc    Authorize specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (isDev) console.warn('[Auth] Authorization failed: No user attached to request');
      return res.status(403).json({
        status: 'fail',
        error: 'Forbidden: User identity missing'
      });
    }

    if (!roles.includes(req.user.role)) {
      if (isDev) console.warn(`[Auth] Access Denied: User role '${req.user.role}' not in permitted roles [${roles.join(', ')}]`);
      return res.status(403).json({
        status: 'fail',
        error: `Forbidden: Role '${req.user.role}' does not have permission to perform this action`
      });
    }

    if (isDev) console.log(`[Auth] Access Granted: Role '${req.user.role}' matches requirements`);
    next();
  };
};

module.exports = { protect, authorize };
