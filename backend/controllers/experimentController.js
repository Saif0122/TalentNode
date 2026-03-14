const Experiment = require('../models/Experiment');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const matcher = require('../services/matcher');

// @desc    Create new experiment
// @route   POST /api/experiments
exports.createExperiment = async (req, res) => {
  try {
    const { name, jobId, candidateIds } = req.body;

    if (!name || !jobId || !candidateIds || candidateIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Name, jobId, and at least one candidate are required' });
    }

    const experiment = await Experiment.create({
      name,
      job: jobId,
      candidates: candidateIds,
      createdBy: req.user.id,
      status: 'Pending'
    });

    const populatedExperiment = await experiment.populate('job', 'title');

    res.status(201).json({
      success: true,
      data: populatedExperiment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all experiments
// @route   GET /api/experiments
exports.getExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find()
      .populate('job', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: experiments
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single experiment
// @route   GET /api/experiments/:id
exports.getExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate('job')
      .populate('candidates')
      .populate('results.candidate');

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    res.status(200).json({
      success: true,
      data: experiment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Run experiment scoring
// @route   POST /api/experiments/:id/run
exports.runExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate('job')
      .populate('candidates');

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    const job = experiment.job;
    const candidates = experiment.candidates;
    const results = [];

    for (const candidate of candidates) {
      const parsedResume = candidate.parsedResume || {};
      
      const resultA = matcher.scoreCandidateA(job, parsedResume);
      const resultB = matcher.scoreCandidateB(job, parsedResume);

      results.push({
        candidate: candidate._id,
        scorerA: resultA,
        scorerB: resultB,
        timestamp: new Date()
      });
    }

    experiment.results = results;
    experiment.status = 'Completed';
    await experiment.save();

    res.status(200).json({
      success: true,
      data: experiment
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Compare results and find winner
// @route   GET /api/experiments/:id/compare
exports.compareExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate('results.candidate');

    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    // Logic to find "winner" - e.g., which scorer had higher confidence or more reasons
    let winA = 0;
    let winB = 0;

    experiment.results.forEach(res => {
      if (res.scorerA.score > res.scorerB.score) winA++;
      else if (res.scorerB.score > res.scorerA.score) winB++;
    });

    const comparison = {
      totalCandidates: experiment.results.length,
      winA,
      winB,
      winner: winA > winB ? 'Scorer A' : winB > winA ? 'Scorer B' : 'Tie',
      averageScoreA: experiment.results.reduce((acc, r) => acc + r.scorerA.score, 0) / experiment.results.length,
      averageScoreB: experiment.results.reduce((acc, r) => acc + r.scorerB.score, 0) / experiment.results.length
    };

    res.status(200).json({
      success: true,
      data: {
        experiment,
        comparison
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
