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

// REST-compliant routes
router.route('/')
  .post(createInterview)  // POST /api/scheduling
  .get(getInterviews);    // GET /api/scheduling

router.route('/:id')
  .patch(updateInterview)   // PATCH /api/scheduling/:id
  .delete(deleteInterview); // DELETE /api/scheduling/:id

// Legacy aliases kept for backward compatibility during transition
router.post('/create', createInterview);
router.get('/events', getInterviews);

module.exports = router;
