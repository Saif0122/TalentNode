const express = require('express');
const router = express.Router();
const {
  getStats,
  getActivity,
  getTopSkills,
  getConversion,
  seedDashboardData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// We apply protect middleware to all dashboard routes
router.use(protect);

router.route('/stats').get(getStats);
router.route('/activity').get(getActivity);
router.route('/top-skills').get(getTopSkills);
router.route('/conversion').get(getConversion);

// Exposing seed endpoint
router.route('/seed').post(seedDashboardData);

module.exports = router;
