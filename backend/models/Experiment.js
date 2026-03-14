const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  results: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
      },
      scorerA: {
        score: Number,
        reasons: [String],
        confidence: Number,
        summary: String
      },
      scorerB: {
        score: Number,
        reasons: [String],
        confidence: Number,
        summary: String
      },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;
