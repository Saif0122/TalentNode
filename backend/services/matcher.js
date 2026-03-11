/**
 * Tokenizes a string by splitting on non-word characters and converting to lowercase.
 * @param {string} text
 * @returns {Set<string>}
 */
const tokenize = (text) => {
  if (!text) return new Set();
  const tokens = text.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  return new Set(tokens);
};

/**
 * Clamps a number between a minimum and maximum value.
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Calculates a match score between a job description and a parsed resume.
 * 
 * TO SWAP TO AN LLM LATER (e.g., LangChain + Gemini):
 * 1. Remove this heuristic function.
 * 2. Create a prompt template: 
 *    "You are an expert technical recruiter. Evaluate this candidate against this job description.
 *     Job: {jobDescription} 
 *     Candidate: {parsedResume}
 *     Return a JSON object with a score (0-100) and an array of reason strings."
 * 3. Call your LLM model (e.g., `model.generateContent(prompt)`) and parse the JSON output.
 * 4. Return the parsed object `{ score, reasons }`.
 * 
 * @param {Object} job - The job object, e.g., { description, requiredSkills: [] }
 * @param {Object} parsedResume - The parsed resume object, e.g., { rawText, skills: [], yearsExperience }
 * @returns {Object} { score: number, reasons: string[] }
 */
const scoreCandidate = (job, parsedResume) => {
  const reasons = [];
  
  // 1. Tokenize job description and resume raw text
  const jobDescriptionText = job.description || '';
  const jobTokens = tokenize(jobDescriptionText);
  const resumeTokens = tokenize(parsedResume.rawText || '');
  
  // 2. Keyword Match Ratio (General text overlap)
  let overlapCount = 0;
  resumeTokens.forEach(token => {
    if (jobTokens.has(token)) {
      overlapCount++;
    }
  });
  
  const keywordMatchRatio = jobTokens.size > 0 ? overlapCount / jobTokens.size : 0;
  if (keywordMatchRatio > 0.3) {
    reasons.push("Good general keyword alignment with the job description.");
  }

  // 3. Skills Overlap
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const candidateSkills = new Set((parsedResume.skills || []).map(s => s.toLowerCase()));
  
  let skillOverlapCount = 0;
  requiredSkills.forEach(skill => {
    if (candidateSkills.has(skill.toLowerCase())) {
      skillOverlapCount++;
    }
  });

  const skillScoreRatio = requiredSkills.length > 0 ? skillOverlapCount / requiredSkills.length : 0;
  if (skillScoreRatio >= 0.5) {
    reasons.push(`Matches ${skillOverlapCount} out of ${requiredSkills.length} required skills.`);
  } else if (requiredSkills.length > 0) {
    reasons.push(`Missing some core required skills (matched ${skillOverlapCount}/${requiredSkills.length}).`);
  }

  // 4. Years of Experience
  const exp = parsedResume.yearsExperience || 0;
  const expRatio = Math.min(exp / 10, 1); // Cap at 10 years for heuristic purposes
  if (exp >= 5) {
    reasons.push(`Solid experience level (${exp} years).`);
  } else {
    reasons.push(`Junior to mid-level experience (${exp} years).`);
  }

  // 5. Compute Final Score
  // Formula: 50 * (skillOverlap/requiredSkills) + 30 * (yearsExperience/10) + 20 * (keywordMatchRatio)
  let rawScore = (50 * skillScoreRatio) + (30 * expRatio) + (20 * keywordMatchRatio);
  
  // Ensure score is between 0 and 100
  const finalScore = Math.round(clamp(rawScore, 0, 100));

  if (finalScore >= 80) {
    reasons.unshift("Excellent overall match for this position.");
  } else if (finalScore >= 50) {
    reasons.unshift("Moderate match, may require training in some areas.");
  } else {
    reasons.unshift("Low match against core requirements.");
  }

  return {
    score: finalScore,
    reasons
  };
};

module.exports = {
  scoreCandidate
};
