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

// Job Requests
router.post('/:jobId/request', protect, jobController.submitJobRequest);
router.get('/:jobId/requests', protect, authorize('admin', 'recruiter'), jobController.getJobRequests);
router.patch('/request/:requestId/review', protect, authorize('admin', 'recruiter'), jobController.reviewJobRequest);

module.exports = router;
