const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and for recruiters/admins
router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/overview', analyticsController.getOverview);
router.get('/conversion', analyticsController.getConversion);
router.get('/top-skills', analyticsController.getTopSkills);
router.get('/sources', analyticsController.getSources);
router.get('/cohorts', analyticsController.getCohorts);
router.get('/role-performance', analyticsController.getRolePerformance);

module.exports = router;
