const Candidate = require('./models/Candidate');
const mongoose = require('mongoose');
require('dotenv').config();

async function testModel() {
  try {
    console.log('Testing model indexes and creation...');
    console.log('Indexes:', Candidate.schema.indexes());
    
    // Check if we can instantiate it
    const candidate = new Candidate({
      name: 'John Doe',
      skills: ['Node.js', 'Express', 'MongoDB'],
      parsedResume: { experience: '5 years' }
    });
    
    console.log('Model instantiation success:', candidate.name);
    process.exit(0);
  } catch (error) {
    console.error('Model test failed:', error);
    process.exit(1);
  }
}

testModel();
