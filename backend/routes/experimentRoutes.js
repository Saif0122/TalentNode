const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.post('/', experimentController.createExperiment);
router.get('/', experimentController.getExperiments);
router.get('/:id', experimentController.getExperiment);
router.post('/:id/run', experimentController.runExperiment);
router.get('/:id/compare', experimentController.compareExperiment);

module.exports = router;
