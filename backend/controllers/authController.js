const User = require('../models/User');
const generateTokenAndSetCookie = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        error: 'Please provide name, email, and password'
      });
    }

    const emailLower = email.toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({
        status: 'fail',
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: emailLower,
      password,
      role: role || 'candidate',
      provider: 'credentials'
    });

    if (user) {
      generateTokenAndSetCookie(res, user);
      
      return res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    return res.status(400).json({
      status: 'fail',
      error: 'Invalid user data'
    });
  } catch (error) {
    console.error(`[Auth Error] Registration Failed: ${error.message}`);
    return res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        error: 'Please provide email and password'
      });
    }

    const emailLower = email.toLowerCase();

    // Find user & include password
    const user = await User.findOne({ email: emailLower }).select('+password');
    if (!user || user.provider !== 'credentials') {
      return res.status(401).json({
        status: 'fail',
        error: 'Invalid email or password'
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn(`[Auth] Failed login attempt for user: ${emailLower}`);
      return res.status(401).json({
        status: 'fail',
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn(`[Auth] Inactive user login attempt: ${emailLower}`);
      return res.status(403).json({
        status: 'fail',
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLoginAt = Date.now();
    await user.save();

    generateTokenAndSetCookie(res, user);

    return res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};

/**
 * @desc    Google OAuth login/register
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleAccessToken, googleRefreshToken, googleTokenExpiry } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        error: 'Google authentication failed: Email missing'
      });
    }

    const emailLower = email.toLowerCase();
    let user = await User.findOne({ email: emailLower });

    if (user) {
      // Check if user is active
      if (!user.isActive) {
        console.warn(`[Auth] Inactive user Google login attempt: ${emailLower}`);
        return res.status(403).json({
          status: 'fail',
          error: 'Account is deactivated. Please contact support.'
        });
      }

      user.provider = 'google';
      user.name = name || user.name;
      user.lastLoginAt = Date.now();
      
      // Update Google tokens if provided
      if (googleAccessToken) user.googleAccessToken = googleAccessToken;
      if (googleRefreshToken) user.googleRefreshToken = googleRefreshToken;
      if (googleTokenExpiry) user.googleTokenExpiry = googleTokenExpiry;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: emailLower,
        role: 'candidate',
        provider: 'google',
        isActive: true,
        lastLoginAt: Date.now(),
        googleAccessToken,
        googleRefreshToken,
        googleTokenExpiry
      });
      console.log(`[Auth] New Google user registered: ${user.email}`);
    }

    generateTokenAndSetCookie(res, user);

    return res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: req.user
  });
};

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};
