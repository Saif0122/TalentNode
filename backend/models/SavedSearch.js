const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  criteria: {
    search: String,
    skills: [String],
    experience: String,
    location: String,
    scoreMin: Number
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);
