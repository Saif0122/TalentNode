const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

// Avoid duplicate applications from the same candidate to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
