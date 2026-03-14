const candidateService = require('../services/candidateService');
const ingestionService = require('../services/ingest.js');
const matcherService = require('../services/matcher.js');
const { createNotification } = require('./notificationController');
const { diffWords, compareSkills, compareExperience } = require('../utils/diffViewer');
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

    const candidateName = name || ingestedData.name || (file ? file.originalname.split('.')[0] : 'Unknown');
    const candidateEmail = ingestedData.email || '';

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ 
      $or: [
        { email: candidateEmail && candidateEmail !== '' ? candidateEmail : undefined },
        { name: candidateName }
      ].filter(q => Object.values(q)[0] !== undefined)
    });

    const parsedData = {
      ...(ingestedData || {}),
      ...(typeof parsedResume === 'string' ? JSON.parse(parsedResume) : (parsedResume || {}))
    };

    if (candidate) {
      // Add as a new version
      candidate.uploadHistory.push({
        fileName: file ? file.originalname : 'Manual Upload',
        parsedData: parsedData,
        resumeUrl: file ? file.path : candidate.resumeUrl
      });
      
      // Update top-level fields with latest data
      candidate.name = candidateName;
      if (candidateEmail) candidate.email = candidateEmail;
      candidate.summary = ingestedData.summary || candidate.summary;
      candidate.location = location || ingestedData.location || candidate.location;
      candidate.skills = skills 
        ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) 
        : (ingestedData.skills || candidate.skills);
      candidate.experienceTimeline = ingestedData.experienceTimeline || candidate.experienceTimeline;
      candidate.parsedResume = parsedData;
      if (file) candidate.resumeUrl = file.path;

      await candidate.save();
    } else {
      // Create new candidate
      const candidateData = {
        name: candidateName,
        email: candidateEmail,
        phone: ingestedData.phone || '',
        summary: ingestedData.summary || '',
        location: location || ingestedData.location || '',
        skills: skills 
          ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) 
          : (ingestedData.skills || []),
        experienceTimeline: ingestedData.experienceTimeline || [],
        parsedResume: parsedData,
        resumeUrl: file ? file.path : null,
        uploadHistory: [{ 
          fileName: file ? file.originalname : 'Initial Upload', 
          parsedData: parsedData,
          resumeUrl: file ? file.path : null
        }]
      };
      candidate = await candidateService.saveCandidate(candidateData);
    }

    // Broadcast a notification
    if (file) {
      await createNotification({
        title: candidate.uploadHistory.length > 1 ? 'Resume Version Added' : 'Resume Parsed',
        message: `Successfully extracted profile for ${candidate.name}.`,
        type: 'success',
        link: `/report/${candidate._id}`
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        id: candidate._id,
        parsedResume: candidate.parsedResume,
        versionCount: candidate.uploadHistory.length
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

const getVersions = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ status: 'fail', error: 'Candidate not found' });

    res.status(200).json({
      status: 'success',
      data: candidate.uploadHistory.map((h, idx) => ({
        versionId: h._id,
        versionNumber: idx + 1,
        fileName: h.fileName,
        timestamp: h.timestamp
      }))
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

const getVersionById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ status: 'fail', error: 'Candidate not found' });

    const version = candidate.uploadHistory.id(req.params.versionId);
    if (!version) return res.status(404).json({ status: 'fail', error: 'Version not found' });

    res.status(200).json({
      status: 'success',
      data: version
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

const compareVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const { versionA, versionB } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ status: 'fail', error: 'Candidate not found' });

    const vA = candidate.uploadHistory.id(versionA);
    const vB = candidate.uploadHistory.id(versionB);

    if (!vA || !vB) return res.status(404).json({ status: 'fail', error: 'One or both versions not found' });

    const result = {
      summary: diffWords(vA.parsedData.summary, vB.parsedData.summary),
      skills: compareSkills(vA.parsedData.skills, vB.parsedData.skills),
      experience: compareExperience(vA.parsedData.experienceTimeline, vB.parsedData.experienceTimeline)
    };

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

module.exports = {
  uploadResume,
  getCandidates,
  getCandidateById,
  getVersions,
  getVersionById,
  compareVersions,
  verifyScoring
};
