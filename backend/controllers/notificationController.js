const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    // Fetch notifications targeted at the user OR global notifications (user = null)
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { user: null }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    // Optional: add authorization check here to ensure req.user._id matches notification.user

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user's notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { 
        $or: [{ user: req.user._id }, { user: null }],
        read: false 
      },
      { read: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Helper function to be called internally by other controllers
exports.createNotification = async ({ userId, title, message, type = 'info', link = null }) => {
  try {
    const notification = await Notification.create({
      user: userId || null,
      title,
      message,
      type,
      link
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
