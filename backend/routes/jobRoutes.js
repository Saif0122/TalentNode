const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), jobController.createJob);
router.get('/', jobController.getJobs);

module.exports = router;
