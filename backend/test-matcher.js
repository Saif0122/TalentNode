const matcher = require('./services/matcher');

const testMatching = () => {
  console.log('--- Testing Candidate Matching Logic ---');

  const mockJobDescription = `
    Looking for a Senior Software Engineer with 5+ years of experience.
    Must be proficient in React, Node.js, and TypeScript.
    Knowledge of AWS and Docker is a plus.
  `;

  const mockParsedResume = {
    rawText: `
      Senior Developer with 7 years of exp.
      Proficient in React, Node.js, and Python.
      Built scalable apps using Docker.
    `,
    skills: ['React', 'Node.js', 'Docker', 'Python'],
    yearsExperience: 7
  };

  const result = matcher.scoreCandidate(mockJobDescription, mockParsedResume);

  console.log('Calculated Score:', result.score);
  console.log('Reasons:', result.reasons);

  if (result.score > 0 && result.reasons.length > 0) {
    console.log('MATCH TEST SUCCESS');
  } else {
    console.log('MATCH TEST FAILED');
  }
};

testMatching();
