const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  summary: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    trim: true
  },
  experienceTimeline: [
    {
      role: String,
      company: String,
      duration: String,
      description: String
    }
  ],
  parsedResume: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  resumeUrl: {
    type: String
  },
  uploadHistory: [
    {
      fileName: String,
      timestamp: { type: Date, default: Date.now },
      parsedData: mongoose.Schema.Types.Mixed,
      resumeUrl: String
    }
  ],
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  source: {
    type: String,
    enum: ['LinkedIn', 'Referral', 'Indeed', 'Career Page', 'Other'],
    default: 'Other'
  },
  hiredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index on name, summary and skills for full-text search
candidateSchema.index({ name: 'text', summary: 'text', skills: 'text' });

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
