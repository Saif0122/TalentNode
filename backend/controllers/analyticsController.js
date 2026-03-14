const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const mongoose = require('mongoose');

// @desc    Get analytics overview (KPIs)
// @route   GET /api/analytics/overview
exports.getOverview = async (req, res, next) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const hiredCandidates = await Candidate.countDocuments({ status: 'Hired' });
    
    // Calculate Avg Time to Hire
    const hiredList = await Candidate.find({ status: 'Hired', hiredAt: { $exists: true } });
    let totalDays = 0;
    hiredList.forEach(c => {
      const diffTime = Math.abs(c.hiredAt - c.createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
    });
    const avgTimeToHire = hiredList.length > 0 ? Math.round(totalDays / hiredList.length) : 0;

    // Mock trend and cost for now (could be refined later)
    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        hiredCandidates,
        avgTimeToHire,
        offerAcceptanceRate: 85, // Mock
        aiAccuracy: 96, // Mock
        costPerHire: 4200 // Mock
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pipeline conversion (funnel)
// @route   GET /api/analytics/conversion
exports.getConversion = async (req, res, next) => {
  try {
    const funnel = [
      { step: 'Applied', count: await Candidate.countDocuments({ status: 'Applied' }) },
      { step: 'Screening', count: await Candidate.countDocuments({ status: 'Screening' }) },
      { step: 'Interview', count: await Candidate.countDocuments({ status: 'Interview' }) },
      { step: 'Offer', count: await Candidate.countDocuments({ status: 'Offer' }) },
      { step: 'Hired', count: await Candidate.countDocuments({ status: 'Hired' }) }
    ];

    res.status(200).json({
      success: true,
      data: funnel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top skills demand
// @route   GET /api/analytics/top-skills
exports.getTopSkills = async (req, res, next) => {
  try {
    const jobs = await Job.find().select('requiredSkills');
    const skillCounts = {};
    
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: topSkills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get source performance
// @route   GET /api/analytics/sources
exports.getSources = async (req, res, next) => {
  try {
    const sourceData = await Candidate.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          hired: { 
            $sum: { $cond: [{ $eq: ['$status', 'Hired'] }, 1, 0] } 
          }
        }
      },
      {
        $project: {
          source: '$_id',
          count: 1,
          hired: 1,
          hireRate: {
            $cond: [
              { $gt: ['$count', 0] },
              { $multiply: [{ $divide: ['$hired', '$count'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: sourceData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cohort analysis (candidates monthly)
// @route   GET /api/analytics/cohorts
exports.getCohorts = async (req, res, next) => {
  try {
    const cohorts = await Candidate.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'Hired'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: cohorts.map(c => ({
        month: `${c._id.year}-${String(c._id.month).padStart(2, '0')}`,
        count: c.count,
        hired: c.hired
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get role performance breakdown
// @route   GET /api/analytics/role-performance
exports.getRolePerformance = async (req, res, next) => {
  try {
    // This is more complex as we need to join with Jobs or use departments
    // For simplicity, let's group by department in Jobs
    const roleStats = await Job.aggregate([
      {
        $group: {
          _id: '$department',
          jobCount: { $sum: 1 },
          totalDepartmentHires: { $sum: 0 } // Mock/Placeholder
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: roleStats
    });
  } catch (error) {
    next(error);
  }
};
