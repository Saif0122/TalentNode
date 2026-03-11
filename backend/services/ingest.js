const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Preprocesses extracted text: trims extra whitespace and removes null characters.
 * @param {string} text - The raw extracted text.
 * @returns {string} Cleaned text.
 */
const preprocessText = (text) => {
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Extracts years of experience using regex.
 * Looks for patterns like "5 years", "10+ years", etc.
 * @param {string} text - The cleaned text.
 * @returns {number} The maximum years found.
 */
const extractYearsOfExperience = (text) => {
  const yearsRegex = /(\d+)(?:\+?)\s*(?:years?|yrs?)/gi;
  let match;
  let maxYears = 0;
  while ((match = yearsRegex.exec(text)) !== null) {
    const years = parseInt(match[1], 10);
    if (years > maxYears) maxYears = years;
  }
  return maxYears;
};

/**
 * Extracts skills based on common separators like commas or pipes.
 * This is a completely deterministic approach that relies on finding a keyword sequence.
 * 
 * TO SWAP TO AN LLM LATER:
 * Simply pass the extracted `rawText` to an LLM prompt (e.g., using LangChain or OpenAI/Gemini SDK directly).
 * Example prompt: "Extract a list of technical skills from this resume: {rawText}. Return as a JSON array of strings: { "skills": [...] }"
 * 
 * @param {string} text - The cleaned text.
 * @returns {string[]} List of unique skills found.
 */
const extractSkills = (text) => {
  // Simple heuristic: look for sections that seem like skill lists
  const skillsContextRegex = /(?:skills|technologies|tools)(?::|\s*\|?)\s*([^.]+)/i;
  const match = text.match(skillsContextRegex);
  
  if (match && match[1]) {
    const list = match[1]
      .split(/[,|]/)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 30);
    return [...new Set(list)];
  }
  
  return [];
};

/**
 * Extracts education information using regex.
 * @param {string} text - The cleaned text.
 * @returns {string[]} Found education keywords/phrases.
 */
const extractEducation = (text) => {
  const educationRegex = /(?:education|degree|university|college)(?::|\s*\|?)\s*([^.]+)/i;
  const match = text.match(educationRegex);
  return match && match[1] ? [match[1].trim()] : [];
};

/**
 * Core ingestion function.
 * @param {Buffer} buffer - File buffer.
 * @param {string} mimetype - File mimetype.
 * @returns {Promise<Object>} The parsed result { rawText, summary, skills, yearsExperience, education }.
 */
const ingestResume = async (buffer, mimetype) => {
  let rawText = '';

  if (mimetype === 'application/pdf') {
    const data = await pdf(buffer);
    rawText = data.text;
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const data = await mammoth.extractRawText({ buffer });
    rawText = data.value;
  } else {
    throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
  }

  const cleanedText = preprocessText(rawText);
  
  return {
    rawText: cleanedText,
    summary: cleanedText.substring(0, 300),
    skills: extractSkills(cleanedText),
    yearsExperience: extractYearsOfExperience(cleanedText),
    education: extractEducation(cleanedText)
  };
};

module.exports = {
  ingestResume
};
