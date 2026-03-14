const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/request', connectionController.requestConnection);
router.post('/accept', connectionController.acceptConnection);
router.get('/', connectionController.getConnections);

module.exports = router;
