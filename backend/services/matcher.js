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
/**
 * SCORER A: Standard Heuristic
 * Formula: 50% Skills, 30% Experience, 20% Keywords
 */
const scoreCandidateA = (job, parsedResume) => {
  const reasons = [];
  
  const jobTokens = tokenize(job.description || '');
  const resumeTokens = tokenize(parsedResume.rawText || '');
  
  let overlapCount = 0;
  resumeTokens.forEach(token => {
    if (jobTokens.has(token)) overlapCount++;
  });
  
  const keywordMatchRatio = jobTokens.size > 0 ? overlapCount / jobTokens.size : 0;
  if (keywordMatchRatio > 0.3) reasons.push("Good general keyword alignment.");

  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const candidateSkills = new Set((parsedResume.skills || []).map(s => s.toLowerCase()));
  
  let skillOverlapCount = 0;
  requiredSkills.forEach(skill => {
    if (candidateSkills.has(skill.toLowerCase())) skillOverlapCount++;
  });

  const skillScoreRatio = requiredSkills.length > 0 ? skillOverlapCount / requiredSkills.length : 0;
  if (skillScoreRatio >= 0.5) {
    reasons.push(`Matches ${skillOverlapCount}/${requiredSkills.length} required skills.`);
  }

  const exp = parsedResume.yearsExperience || 0;
  const expRatio = Math.min(exp / 10, 1);
  reasons.push(`${exp} years of relevant experience.`);

  let rawScore = (50 * skillScoreRatio) + (30 * expRatio) + (20 * keywordMatchRatio);
  const finalScore = Math.round(clamp(rawScore, 0, 100));

  return {
    score: finalScore,
    reasons,
    confidence: 85,
    summary: `Scorer A suggests a ${finalScore}% match based on standard heuristic.`
  };
};

/**
 * SCORER B: Skill-Focused Heuristic
 * Formula: 70% Skills, 20% Experience, 10% Keywords
 */
const scoreCandidateB = (job, parsedResume) => {
  const reasons = [];
  
  const jobTokens = tokenize(job.description || '');
  const resumeTokens = tokenize(parsedResume.rawText || '');
  
  let overlapCount = 0;
  resumeTokens.forEach(token => {
    if (jobTokens.has(token)) overlapCount++;
  });
  
  const keywordMatchRatio = jobTokens.size > 0 ? overlapCount / jobTokens.size : 0;

  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const candidateSkills = new Set((parsedResume.skills || []).map(s => s.toLowerCase()));
  
  let skillOverlapCount = 0;
  const matched = [];
  requiredSkills.forEach(skill => {
    if (candidateSkills.has(skill.toLowerCase())) {
      skillOverlapCount++;
      matched.push(skill);
    }
  });

  const skillScoreRatio = requiredSkills.length > 0 ? skillOverlapCount / requiredSkills.length : 0;
  if (matched.length > 0) {
    reasons.push(`Direct skill match for: ${matched.join(', ')}.`);
  }

  const exp = parsedResume.yearsExperience || 0;
  const expRatio = Math.min(exp / 5, 1); // Focused on first 5 years
  reasons.push(`Experience depth: ${exp} years.`);

  // Shifted weights for Scorer B
  let rawScore = (70 * skillScoreRatio) + (20 * expRatio) + (10 * keywordMatchRatio);
  const finalScore = Math.round(clamp(rawScore, 0, 100));

  return {
    score: finalScore,
    reasons,
    confidence: 90,
    summary: `Scorer B (Skill-Focused) emphasizes candidate's specific technical toolkit with a ${finalScore}% score.`
  };
};

module.exports = {
  scoreCandidate: scoreCandidateA, // Default to Scorer A for backward compatibility
  scoreCandidateA,
  scoreCandidateB
};
