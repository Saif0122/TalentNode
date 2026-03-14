const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

// JSON structured report (for in-app preview)
router.get('/:candidateId', reportController.getCandidateReport);

// PDF export
router.get('/:candidateId/pdf', reportController.exportCandidatePDF);

module.exports = router;
