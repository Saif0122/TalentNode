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
  rawResumeText: {
    type: String
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  education: {
    type: [String],
    default: []
  },
  resumeUrl: {
    type: String
  },
  uploadedFiles: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  matchedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }
  ],
  analysisHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      score: Number,
      summary: String,
      reasons: [String],
      matchDetails: mongoose.Schema.Types.Mixed
    }
  ],
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
  recruitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  department: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  hiredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Full-text search index
candidateSchema.index({ name: 'text', summary: 'text', skills: 'text' });
// Performance indexes for common queries
candidateSchema.index({ status: 1 });
candidateSchema.index({ createdAt: -1 });
candidateSchema.index({ skills: 1 });
candidateSchema.index({ recruitedBy: 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
