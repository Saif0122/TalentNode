const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), jobController.createJob);
router.get('/', jobController.getJobs);

module.exports = router;
