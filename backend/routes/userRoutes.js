const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateUserNotifications
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes hit by users themselves require authentication

router.route('/me')
  .get(getUserProfile)
  .patch(updateUserProfile);

router.route('/password')
  .patch(updateUserPassword);

router.route('/notifications')
  .patch(updateUserNotifications);

module.exports = router;
