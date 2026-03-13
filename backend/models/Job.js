const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true,
    default: 'General'
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  salaryRange: {
    type: String, // e.g., "$100k - $120k"
    default: 'Competitive'
  },
  responsibilities: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
