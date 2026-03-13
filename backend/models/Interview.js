const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: [true, 'Please add a candidate']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Please add a job']
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a recruiter']
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add a duration']
  },
  status: {
    type: String,
    enum: ['scheduled', 'rescheduled', 'canceled', 'completed'],
    default: 'scheduled'
  },
  googleEventId: {
    type: String,
    default: ''
  },
  meetingLink: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Google Meet'
  }
}, {
  timestamps: true
});

// Indexing for faster queries on recruiter and status
interviewSchema.index({ recruiter: 1, startTime: -1 });
interviewSchema.index({ candidate: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
