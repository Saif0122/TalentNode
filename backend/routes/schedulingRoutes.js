const express = require('express');
const router = express.Router();
const { 
  createInterview, 
  getInterviews, 
  updateInterview, 
  deleteInterview 
} = require('../controllers/schedulingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to recruiters/admins
router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.route('/create').post(createInterview);
router.route('/events').get(getInterviews);
router.route('/:id')
  .patch(updateInterview)
  .delete(deleteInterview);

module.exports = router;
