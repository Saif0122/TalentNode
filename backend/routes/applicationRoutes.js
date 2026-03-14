const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:jobId/apply', protect, applicationController.applyForJob);
router.get('/job/:jobId', protect, authorize('admin', 'recruiter'), applicationController.getJobApplications);

module.exports = router;
