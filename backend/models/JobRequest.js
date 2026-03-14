const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  message: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  reviewedAt: {
    type: Date,
    required: false
  }
});

// Ensure a candidate can only have one active request per job
jobRequestSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

const JobRequest = mongoose.model('JobRequest', jobRequestSchema);

module.exports = JobRequest;
