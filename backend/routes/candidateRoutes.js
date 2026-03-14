const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const candidateController = require('../controllers/candidateController');
const uploadRedirectController = require('../controllers/uploadRedirectController');


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

// Allowed MIME types for resume uploads
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 }, // Default 50MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, DOCX, and TXT are allowed.`), false);
    }
  }
});

const { protect, authorize } = require('../middleware/authMiddleware');

// Route for resume upload
router.post('/upload-resume', upload.single('resume'), uploadRedirectController.uploadResume);

// ---- Static routes MUST come before dynamic /:id routes ----
router.get('/', candidateController.getCandidates);

// Static sub-resource routes (before /:id to avoid param collision)
router.post('/save-search', protect, authorize('recruiter', 'admin'), candidateController.saveSearch);
router.get('/saved-searches', protect, authorize('recruiter', 'admin'), candidateController.getSavedSearches);
router.post('/bulk-message', protect, authorize('recruiter', 'admin'), candidateController.bulkMessage);
router.post('/verify-scoring/:candidateId', candidateController.verifyScoring);

// ---- Dynamic routes ----
router.get('/:id', candidateController.getCandidateById);
router.get('/:id/versions', candidateController.getVersions);
router.get('/:id/versions/:versionId', candidateController.getVersionById);
router.post('/:id/compare', candidateController.compareVersions);
router.patch('/:id/toggle-status', protect, authorize('recruiter', 'admin'), candidateController.toggleStatus);

module.exports = router;
