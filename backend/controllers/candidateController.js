const candidateService = require('../services/candidateService');
const ingestionService = require('../services/ingest.js');
const matcherService = require('../services/matcher.js');
const { createNotification } = require('./notificationController');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const fs = require('fs');

/**
 * @openapi
 * /api/upload-resume:
 *   post:
 *     summary: Upload and parse resume
 *     responses:
 *       201:
 *         description: Created
 */
const uploadResume = async (req, res) => {
  try {
    const { name, skills, parsedResume, location } = req.body;
    const file = req.file;

    if (!name && !file) {
      return res.status(400).json({ status: 'fail', error: 'Name or file is required' });
    }

    let ingestedData = {};
    if (file) {
      const buffer = fs.readFileSync(file.path);
      ingestedData = await ingestionService.ingestResume(buffer, file.mimetype);
    }

    const candidateData = {
      name: name || ingestedData.name || (file ? file.originalname.split('.')[0] : 'Unknown'),
      email: ingestedData.email || '',
      phone: ingestedData.phone || '',
      summary: ingestedData.summary || '',
      location: location || ingestedData.location || '',
      skills: skills 
        ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) 
        : (ingestedData.skills || []),
      experienceTimeline: ingestedData.experienceTimeline || [],
      parsedResume: {
        ...(ingestedData || {}),
        ...(typeof parsedResume === 'string' ? JSON.parse(parsedResume) : (parsedResume || {}))
      },
      resumeUrl: file ? file.path : null,
      uploadHistory: file ? [{ fileName: file.originalname, parsedData: ingestedData }] : []
    };

    const savedCandidate = await candidateService.saveCandidate(candidateData);

    // Broadcast a notification that a new candidate profile was imported
    if (file) {
      await createNotification({
        title: 'Resume Parsed',
        message: `Successfully extracted profile for ${savedCandidate.name}.`,
        type: 'success',
        link: `/candidates/${savedCandidate._id}`
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        id: savedCandidate._id,
        parsedResume: savedCandidate.parsedResume,
        score: 0 // Mock score for initial upload
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @openapi
 * /api/candidates:
 *   get:
 *     summary: List candidates with filters and pagination
 */
const getCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 10, scoreMin, skill, location } = req.query;
    const query = {};

    if (scoreMin) query['parsedResume.score'] = { $gte: parseInt(scoreMin) };
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (location) query.location = new RegExp(location, 'i');

    const candidates = await Candidate.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Candidate.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        candidates,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @openapi
 * /api/candidates/{id}:
 *   get:
 *     summary: Get candidate profile
 */
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ status: 'fail', error: 'Candidate not found' });

    res.status(200).json({
      status: 'success',
      data: {
        profile: candidate,
        timeline: candidate.uploadHistory
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @openapi
 * /api/verify-scoring/{candidateId}:
 *   post:
 *     summary: Re-run scoring against a job
 */
const verifyScoring = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { jobId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    const job = await Job.findById(jobId);

    if (!candidate || !job) {
      return res.status(404).json({ status: 'fail', error: 'Candidate or Job not found' });
    }

    const scoringResult = await matcherService.scoreCandidate(job.description, candidate.parsedResume);
    
    // Update candidate's current score
    candidate.parsedResume.score = scoringResult.score;
    candidate.parsedResume.aiAnalysis = scoringResult.analysis;
    candidate.parsedResume.aiConfidence = scoringResult.confidence;
    candidate.markModified('parsedResume');
    await candidate.save();

    res.status(200).json({
      status: 'success',
      data: scoringResult
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

module.exports = {
  uploadResume,
  getCandidates,
  getCandidateById,
  verifyScoring
};
