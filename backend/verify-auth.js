const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';
const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'Password123!';

async function runTests() {
  console.log('--- Starting Backend Auth Verification ---\n');

  try {
    // 1. Health Check
    const health = await axios.get('http://localhost:5001/health');
    console.log('✅ Health Check:', health.data.status);

    // 2. Register
    console.log('\nTesting Registration...');
    const registerRes = await axios.post(`${API_URL}/register`, {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      role: 'candidate'
    }, { timeout: 15000 });
    console.log('✅ Registration Success:', registerRes.data.status);

    // 3. Duplicate Registration
    console.log('\nTesting Duplicate Registration...');
    try {
      await axios.post(`${API_URL}/register`, {
        name: 'Test User',
        email: testEmail,
        password: testPassword
      });
    } catch (error) {
      console.log('✅ Duplicate Prevents Successfully:', error.response.data.error);
    }

    // 4. Login
    console.log('\nTesting Login...');
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: testEmail,
      password: testPassword
    });
    console.log('✅ Login Success:', loginRes.data.status);
    const token = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : null;

    // 5. Protected Route (Me)
    console.log('\nTesting Protected Route (/me)...');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: {
        Cookie: token
      }
    });
    console.log('✅ Protected Route Success:', meRes.data.data.email === testEmail.toLowerCase() ? 'Verified' : 'Failed');

    // 6. Logout
    console.log('\nTesting Logout...');
    const logoutRes = await axios.get(`${API_URL}/logout`, {
      headers: {
        Cookie: token
      }
    });
    console.log('✅ Logout Success:', logoutRes.data.status);

    console.log('\n--- Verification Complete ---');
  } catch (error) {
    console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
  }
}

runTests();
