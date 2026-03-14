const Application = require('../models/Application');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/:jobId/apply
 * @access  Private (Candidate)
 */
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { candidateId } = req.body; // In a real scenario, this would come from the auth user/candidate profile

    if (!candidateId) {
      return res.status(400).json({
        status: 'fail',
        error: 'Candidate ID is required'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'fail',
        error: 'Job not found'
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        status: 'fail',
        error: 'Candidate profile not found'
      });
    }

    // Check for existing application
    const existing = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        error: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: candidateId
    });

    res.status(201).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};

/**
 * @desc    Get all applications for a job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Admin/Recruiter)
 */
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId }).populate('candidate');

    res.status(200).json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};
