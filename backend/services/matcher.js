const { callGeminiJSON } = require('./ai');

/**
 * Calculates a match score between a job description and a parsed resume using Gemini AI.
 * 
 * @param {Object} job - The job object, e.g., { title, description, requiredSkills: [] }
 * @param {Object} parsedResume - The parsed resume object, e.g., { name, rawText, skills: [], yearsExperience, experienceTimeline: [] }
 * @returns {Object} { score: number, reasons: string[], confidence: number, summary: string }
 */
const scoreCandidateWithAI = async (job, parsedResume) => {
  const prompt = `
    You are an expert technical recruiter. Evaluate the following candidate against the job description.
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    Required Skills: ${job.requiredSkills?.join(', ')}

    Candidate Name: ${parsedResume.name}
    Skills: ${parsedResume.skills?.join(', ')}
    Experience: ${parsedResume.yearsExperience} years
    Experience Timeline: ${JSON.stringify(parsedResume.experienceTimeline)}

    Return ONLY a JSON object with:
    "score" (0-100),
    "reasons" (array of strings highlighting key matches or gaps),
    "confidence" (percentage 0-100),
    "summary" (one or two sentence overall recommendation).
  `;

  try {
    return await callGeminiJSON(prompt);
  } catch (err) {
    console.error('AI Matching failed, falling back to heuristic:', err.message);
    // Simple fallback logic if AI fails
    return {
      score: 50,
      reasons: ["AI matching service unavailable. Basic heuristic match used."],
      confidence: 50,
      summary: "Evaluated using fallback logic due to AI service error."
    };
  }
};

module.exports = {
  scoreCandidate: scoreCandidateWithAI,
  scoreCandidateA: scoreCandidateWithAI,
  scoreCandidateB: scoreCandidateWithAI
};
