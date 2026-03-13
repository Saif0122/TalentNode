const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Protect routes - Verify JWT in cookie or header
 */
const protect = async (req, res, next) => {
  let token;

  console.log(`[Auth] Incoming Request: ${req.method} ${req.originalUrl}`);
  
  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('[Auth] Token found in Authorization header');
  }
  // 2. Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('[Auth] Token found in cookies');
  }

  if (!token) {
    console.warn('[Auth] No token provided');
    return res.status(401).json({
      status: 'fail',
      error: 'Not authorized, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[Auth] Token verified for User ID: ${decoded.id}`);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.warn(`[Auth] User no longer exists for ID: ${decoded.id}`);
      return res.status(401).json({
        status: 'fail',
        error: 'The user belonging to this token no longer exists.'
      });
    }

    console.log(`[Auth] User authenticated: ${req.user.email} (Role: ${req.user.role})`);
    next();
  } catch (error) {
    console.error(`[Auth] JWT Verification Failed: ${error.message}`);
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
      console.warn('[Auth] Authorization failed: No user attached to request');
      return res.status(403).json({
        status: 'fail',
        error: 'Forbidden: User identity missing'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.warn(`[Auth] Access Denied: User role '${req.user.role}' not in permitted roles [${roles.join(', ')}]`);
      return res.status(403).json({
        status: 'fail',
        error: `Forbidden: Role '${req.user.role}' does not have permission to perform this action`
      });
    }

    console.log(`[Auth] Access Granted: Role '${req.user.role}' matches requirements`);
    next();
  };
};

module.exports = { protect, authorize };
