const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { callGeminiJSON } = require('./ai');

/**
 * Preprocesses extracted text: trims extra whitespace and removes null characters.
 * @param {string} text - The raw extracted text.
 * @returns {string} Cleaned text.
 */
const preprocessText = (text) => {
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Core ingestion function.
 * @param {Buffer} buffer - File buffer.
 * @param {string} mimetype - File mimetype.
 * @returns {Promise<Object>} The parsed result { name, email, phone, rawText, summary, skills, yearsExperience, experienceTimeline, education }.
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
      const parser = typeof pdfParse === 'function' ? pdfParse : (pdfParse.PDFParse || pdfParse.default || pdfParse);
      if (typeof parser !== 'function') {
        throw new Error('PDF parser error');
      }
      const data = await parser(buffer);
      rawText = data.text;
    } catch (pdfErr) {
      console.error('PDF Parsing failed:', pdfErr.message);
      rawText = buffer.toString('ascii').replace(/[^\x20-\x7E\n]/g, ' ');
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    mimetype === 'application/msword'
  ) {
    try {
      const data = await mammoth.extractRawText({ buffer });
      rawText = data.value;
    } catch (e) {
      rawText = buffer.toString('ascii').replace(/[^\x20-\x7E\n]/g, ' ');
    }
  } else {
    rawText = buffer.toString('utf8');
  }

  const cleanedText = preprocessText(rawText);

  // Call Gemini for structured extraction
  const prompt = `
    You are an expert resume parser. Extract the following details from the provided resume text.
    Return ONLY a JSON object with these keys: 
    "name", "email", "phone", "summary", "skills" (array of strings), "yearsExperience" (number), 
    "experienceTimeline" (array of objects with keys: role, company, duration, description), 
    "education" (array of strings).

    Resume Text:
    ${cleanedText}
  `;

  try {
    const aiData = await callGeminiJSON(prompt);
    return {
      rawText: cleanedText,
      ...aiData
    };
  } catch (err) {
    console.error('AI Parsing failed, falling back to basic extraction:', err.message);
    return {
      rawText: cleanedText,
      name: 'Unextracted',
      summary: cleanedText.substring(0, 300),
      skills: [],
      yearsExperience: 0,
      experienceTimeline: [],
      education: []
    };
  }
};

module.exports = {
  ingestResume
};
