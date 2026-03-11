const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const candidateController = require('../controllers/candidateController');

// Multer configuration for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 } // Default 50MB
});

// Route for resume upload
router.post('/upload-resume', upload.single('resume'), candidateController.uploadResume);

// New Routes
router.get('/candidates', candidateController.getCandidates);
router.get('/candidates/:id', candidateController.getCandidateById);
router.post('/verify-scoring/:candidateId', candidateController.verifyScoring);

module.exports = router;
