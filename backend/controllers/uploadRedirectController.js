const candidateService = require('../services/candidateService');
const ingestionService = require('../services/ingest.js');
const Candidate = require('../models/Candidate');
const fs = require('fs');

/**
 * Enhanced upload controller for immediate redirection.
 * Responds with candidateId and parsing logs.
 */
const uploadResume = async (req, res) => {
  const logs = [];
  try {
    const file = req.file;
    const rawText = req.body.rawText;

    if (!file && !rawText) {
      return res.status(400).json({ 
        status: 'fail', 
        error: 'Resume file or raw pasted text is required',
        logs: ['[ERROR] No data received']
      });
    }

    if (file) {
      logs.push(`[INFO] Received file: ${file.originalname} (${file.mimetype})`);
    } else {
      logs.push(`[INFO] Received raw text paste (${rawText.length} characters)`);
    }
    
    logs.push('[INFO] Starting ingestion service...');

    let buffer = null;
    let mimetype = null;
    let fallbackName = 'Unknown';

    if (file) {
      buffer = fs.readFileSync(file.path);
      mimetype = file.mimetype;
      fallbackName = file.originalname.split('.')[0] || 'Unknown';
    } else {
      fallbackName = 'Pasted Resume';
    }

    const ingestedData = await ingestionService.ingestResume(buffer, mimetype, rawText);

    logs.push('[SUCCESS] AI extraction complete');
    logs.push(`[INFO] Detected name: ${ingestedData.name || fallbackName}`);
    logs.push(`[INFO] Detected skills: ${ingestedData.skills?.length || 0}`);

    const candidateName = ingestedData.name || fallbackName;
    const candidateEmail = ingestedData.email || '';

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ 
      $or: [
        { email: candidateEmail && candidateEmail !== '' ? candidateEmail : undefined },
        { name: candidateName }
      ].filter(q => Object.values(q)[0] !== undefined)
    });

    if (candidate) {
      logs.push(`[INFO] Found existing candidate: ${candidate.name}. Adding new version...`);
      candidate.uploadHistory.push({
        fileName: file ? file.originalname : 'text-paste',
        parsedData: ingestedData,
        resumeUrl: file ? file.path : 'text-paste'
      });
      
      // Update top-level fields with latest data
      candidate.name = candidateName;
      if (candidateEmail) candidate.email = candidateEmail;
      candidate.summary = ingestedData.summary || candidate.summary;
      candidate.location = ingestedData.location || candidate.location;
      candidate.skills = ingestedData.skills || candidate.skills;
      candidate.experienceTimeline = ingestedData.experienceTimeline || candidate.experienceTimeline;
      candidate.parsedResume = ingestedData;
      if (file) candidate.resumeUrl = file.path;

      await candidate.save();
      logs.push('[SUCCESS] Resume version added and candidate profile updated');
    } else {
      logs.push('[INFO] Creating new candidate profile...');
      const candidateData = {
        name: candidateName,
        email: candidateEmail,
        phone: ingestedData.phone || '',
        summary: ingestedData.summary || '',
        location: ingestedData.location || '',
        skills: ingestedData.skills || [],
        experienceTimeline: ingestedData.experienceTimeline || [],
        parsedResume: ingestedData,
        resumeUrl: file ? file.path : 'text-paste',
        uploadHistory: [{ 
          fileName: file ? file.originalname : 'text-paste', 
          parsedData: ingestedData,
          resumeUrl: file ? file.path : 'text-paste'
        }]
      };
      candidate = await candidateService.saveCandidate(candidateData);
      logs.push('[SUCCESS] Candidate record created');
    }

    res.status(201).json({
      status: 'success',
      candidateId: candidate._id,
      data: {
        id: candidate._id,
        candidate: candidate,
        parsedResume: ingestedData
      },
      logs
    });

  } catch (error) {
    console.error('Upload Error:', error);
    logs.push(`[ERROR] ${error.message}`);
    res.status(500).json({ 
      status: 'fail', 
      error: error.message,
      logs
    });
  }
};

module.exports = {
  uploadResume
};
