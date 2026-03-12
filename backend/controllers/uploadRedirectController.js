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

    if (!file) {
      return res.status(400).json({ 
        status: 'fail', 
        error: 'Resume file is required',
        logs: ['[ERROR] No file received']
      });
    }

    logs.push(`[INFO] Received file: ${file.originalname} (${file.mimetype})`);
    logs.push('[INFO] Starting ingestion service...');

    const buffer = fs.readFileSync(file.path);
    const ingestedData = await ingestionService.ingestResume(buffer, file.mimetype);

    logs.push('[SUCCESS] AI extraction complete');
    logs.push(`[INFO] Detected name: ${ingestedData.name || 'Unknown'}`);
    logs.push(`[INFO] Detected skills: ${ingestedData.skills?.length || 0}`);

    const candidateData = {
      name: ingestedData.name || file.originalname.split('.')[0] || 'Unknown',
      email: ingestedData.email || '',
      phone: ingestedData.phone || '',
      summary: ingestedData.summary || '',
      location: ingestedData.location || '',
      skills: ingestedData.skills || [],
      experienceTimeline: ingestedData.experienceTimeline || [],
      parsedResume: ingestedData,
      resumeUrl: file.path,
      uploadHistory: [{ fileName: file.originalname, parsedData: ingestedData }]
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
