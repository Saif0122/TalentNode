const User = require('../models/User');

// @desc    Get user profile (All fields including extended ones)
// @route   GET /api/users/me
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile data
// @route   PATCH /api/users/me
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { 
      name, phone, company, jobTitle, location, 
      bio, avatar, preferredLanguage, timezone 
    } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
    if (timezone !== undefined) user.timezone = timezone;

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PATCH /api/users/password
// @access  Private
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // Select password since it's hidden by default in the schema
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.provider !== 'credentials') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot change password. Account uses a 3rd party login provider.' 
      });
    }

    if (!await user.matchPassword(oldPassword)) {
      return res.status(401).json({ success: false, error: 'Incorrect old password.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user notification preferences
// @route   PATCH /api/users/notifications
// @access  Private
exports.updateUserNotifications = async (req, res, next) => {
  try {
    const { notificationPreferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    await user.save();

    res.status(200).json({ success: true, data: user.notificationPreferences });
  } catch (error) {
    next(error);
  }
};
