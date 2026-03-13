const pdfParse = require('pdf-parse');
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
const ingestResume = async (buffer, mimetype, rawTextOverride = null) => {
  let rawText = '';

  if (rawTextOverride) {
    // If text was pasted directly from the frontend, bypass buffers
    rawText = rawTextOverride;
  } else if (!buffer) {
    throw new Error('No file buffer or raw text provided');
  } else if (mimetype === 'application/pdf') {
    try {
      // Handle cases where pdf-parse might be an object instead of a function
      const parser = typeof pdfParse === 'function' ? pdfParse : (pdfParse.PDFParse || pdfParse.default || pdfParse);
      
      if (typeof parser !== 'function') {
        throw new Error('PDF parser is not a function. Check pdf-parse installation.');
      }

      const data = await parser(buffer);
      rawText = data.text;
    } catch (pdfErr) {
      console.error('PDF Parsing failed:', pdfErr.message);
      // Fallback to ASCII scraping if the library fails
      rawText = buffer.toString('ascii').replace(/[^\x20-\x7E\n]/g, ' ');
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    mimetype === 'application/msword'
  ) {
    // mammoth handles docx very well. For older .doc it might struggle but we attempt it anyway
    try {
      const data = await mammoth.extractRawText({ buffer });
      rawText = data.value;
    } catch (e) {
      // Fallback for older .doc binary formats if mammoth fails
      console.warn('Mammoth extraction failed, falling back to ASCII scraping:', e.message);
      rawText = buffer.toString('ascii').replace(/[^\x20-\x7E\n]/g, ' ');
    }
  } else if (mimetype === 'text/plain' || mimetype === 'text/rtf') {
    // direct string decoding
    rawText = buffer.toString('utf8');
    // Strip RTF markup headers if it's explicitly RTF
    if (mimetype === 'text/rtf' || rawText.startsWith('{\\rtf')) {
      // Basic heuristic to strip structural RTF brackets
      rawText = rawText.replace(/\\([a-z]+)[0-9]* ?/gi, ' ').replace(/[{}]/g, '');
    }
  } else {
    // Brute force fallback scraper for unrecognized formats
    console.warn(`Unsupported exact mimetype: ${mimetype}. Attempting brute force ASCII extraction.`);
    rawText = buffer.toString('ascii').replace(/[^\x20-\x7E\n]/g, ' ');
    if (rawText.trim().length < 50) {
      throw new Error(`Unsupported file type (${mimetype}). Please upload PDF, DOCX, or paste the text directly.`);
    }
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
