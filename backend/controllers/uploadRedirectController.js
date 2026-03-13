const candidateService = require('../services/candidateService');
const ingestionService = require('../services/ingest.js');
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

    const candidateData = {
      name: ingestedData.name || fallbackName,
      email: ingestedData.email || '',
      phone: ingestedData.phone || '',
      summary: ingestedData.summary || '',
      location: ingestedData.location || '',
      skills: ingestedData.skills || [],
      experienceTimeline: ingestedData.experienceTimeline || [],
      parsedResume: ingestedData,
      resumeUrl: file ? file.path : 'text-paste',
      uploadHistory: [{ fileName: file ? file.originalname : 'text-paste', parsedData: ingestedData }]
    };

    logs.push('[INFO] Saving candidate to database...');
    const savedCandidate = await candidateService.saveCandidate(candidateData);
    
    logs.push('[SUCCESS] Candidate record created');

    res.status(201).json({
      status: 'success',
      candidateId: savedCandidate._id,
      data: {
        id: savedCandidate._id,
        candidate: savedCandidate,
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
