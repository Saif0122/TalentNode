require('dotenv').config();
const mongoose = require('mongoose');
const Experiment = require('../models/Experiment');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const connectDB = require('../config/db');

const seedExperiments = async () => {
  try {
    await connectDB();

    const job = await Job.findOne();
    const candidates = await Candidate.find().limit(2);

    if (!job || candidates.length < 2) {
      console.log('Not enough data to seed experiments. Please create a job and upload at least 2 resumes first.');
      process.exit(1);
    }

    await Experiment.deleteMany();

    const exp1 = await Experiment.create({
      name: 'Initial AI Benchmark',
      job: job._id,
      candidates: candidates.map(c => c._id),
      status: 'Pending'
    });

    console.log('✅ Experiments seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding experiments:', error);
    process.exit(1);
  }
};

seedExperiments();
