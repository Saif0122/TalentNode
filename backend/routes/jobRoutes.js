const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(jobController.getJobs)
  .post(protect, authorize('admin', 'recruiter'), jobController.createJob);

router.route('/:id')
  .get(jobController.getJobById)
  .patch(protect, authorize('admin', 'recruiter'), jobController.updateJob)
  .delete(protect, authorize('admin', 'recruiter'), jobController.deleteJob);

router.patch('/:id/publish', protect, authorize('admin', 'recruiter'), jobController.publishJob);
router.patch('/:id/archive', protect, authorize('admin', 'recruiter'), jobController.archiveJob);

module.exports = router;
