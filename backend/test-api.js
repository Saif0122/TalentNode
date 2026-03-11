const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('--- Testing TalentNode API Expansion ---');

  try {
    // 1. Create a Job
    console.log('1. Creating a Job...');
    const jobRes = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Full Stack Developer',
      description: 'We need a React and Node.js expert.',
      requiredSkills: ['React', 'Node.js', 'TypeScript'],
      location: 'Remote'
    });
    const jobId = jobRes.data.data._id;
    console.log('Job Created:', jobId);

    // 2. List Jobs
    console.log('2. Listing Jobs...');
    const jobsList = await axios.get(`${BASE_URL}/jobs`);
    console.log('Jobs Found:', jobsList.data.data.length);

    // 3. List Candidates (paginated)
    console.log('3. Listing Candidates...');
    const candidatesRes = await axios.get(`${BASE_URL}/candidates?page=1&limit=5`);
    console.log('Candidates found:', candidatesRes.data.data.candidates.length);

    // 4. Test detail/score if candidates exist
    if (candidatesRes.data.data.candidates.length > 0) {
        const candidateId = candidatesRes.data.data.candidates[0]._id;
        console.log('4. Getting Candidate Detail for:', candidateId);
        const detailRes = await axios.get(`${BASE_URL}/candidates/${candidateId}`);
        console.log('Candidate Name:', detailRes.data.data.profile.name);

        console.log('5. Verifying Scoring against Job...');
        const scoreRes = await axios.post(`${BASE_URL}/verify-scoring/${candidateId}`, {
            jobId: jobId
        });
        console.log('Score Result:', scoreRes.data.data.score);
    }

    console.log('API TEST SUCCESS');
    process.exit(0);
  } catch (error) {
    console.error('API TEST FAILED:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

// Note: Ensure server is running before executing this
testAPI();
