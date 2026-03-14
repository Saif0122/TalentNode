const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const JobRequest = require('../models/JobRequest');
const Interview = require('../models/Interview');

/**
 * @desc    Unified global search across all models
 * @route   GET /api/search
 * @access  Private
 */
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ status: 'fail', error: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i');

    // 1. Search Candidates
    const candidates = await Candidate.find({
      $or: [
        { name: regex },
        { email: regex },
        { summary: regex },
        { skills: { $in: [regex] } }
      ]
    }).limit(5);

    // 2. Search Jobs
    const jobs = await Job.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(5);

    // 3. Search Job Requests (Populated)
    const requests = await JobRequest.find()
      .populate({
        path: 'candidateId',
        match: { name: regex }
      })
      .populate({
        path: 'jobId',
        match: { title: regex }
      })
      .limit(10);

    // Filter out requests where both candidate and job don't match (since match populate returns null)
    const filteredRequests = requests.filter(r => r.candidateId || r.jobId);

    // 4. Search Interviews
    const interviews = await Interview.find({
      description: regex
    })
    .populate('candidate recruiter job')
    .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        candidates,
        jobs,
        requests: filteredRequests,
        interviews
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};
