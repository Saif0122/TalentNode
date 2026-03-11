const Candidate = require('../models/Candidate');

/**
 * Save candidate data to the database.
 * @param {Object} candidateData - Data of the candidate to be saved.
 * @returns {Promise<Object>} The saved candidate document.
 */
const saveCandidate = async (candidateData) => {
  try {
    const candidate = new Candidate(candidateData);
    return await candidate.save();
  } catch (error) {
    console.error('Error saving candidate:', error);
    throw error;
  }
};

module.exports = {
  saveCandidate
};
