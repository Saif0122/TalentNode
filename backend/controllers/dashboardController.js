const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const User = require('../models/User'); 
const JobRequest = require('../models/JobRequest');
const Interview = require('../models/Interview');

// @desc    Get dashboard metrics & stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'published' }); 
    const pendingJobRequests = await JobRequest.countDocuments({ status: 'Pending' });
    
    const totalApplications = await Interview.countDocuments();

    // Resumes parsed total
    const candidatesWithResumes = await Candidate.countDocuments({ parsedResume: { $exists: true, $ne: {} } });
    
    // High-match candidates (>= 85% match score)
    const highMatchCandidates = await Candidate.countDocuments({
      'parsedResume.score': { $gte: 85 }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        totalJobs,
        activeJobs,
        totalApplications,
        resumesParsed: candidatesWithResumes,
        highMatchCandidates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent dashboard activity
// @route   GET /api/dashboard/activity
// @access  Private
exports.getActivity = async (req, res, next) => {
  try {
    // Recent Candidates (last 5)
    const recentCandidates = await Candidate.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name location parsedResume createdAt');

    // Recent Jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title requiredSkills createdAt');

    // Mingle and sort them to form a unified activity timeline if needed, 
    // or just return both lists for the UI to consume.
    res.status(200).json({
      success: true,
      data: {
        recentCandidates,
        recentJobs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top skills requested/found
// @route   GET /api/dashboard/top-skills
// @access  Private
exports.getTopSkills = async (req, res, next) => {
  try {
    // Aggregate skills from Jobs
    const jobs = await Job.find().select('requiredSkills');
    const skillCounts = {};
    
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    // Sort by frequency
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

// @desc    Get conversion metrics
// @route   GET /api/dashboard/conversion
// @access  Private
exports.getConversion = async (req, res, next) => {
  try {
    const [applied, screened, interviewed, offered, hired] = await Promise.all([
      Candidate.countDocuments({ status: 'Applied' }),
      Candidate.countDocuments({ status: 'Screening' }),
      Candidate.countDocuments({ status: 'Interview' }),
      Candidate.countDocuments({ status: 'Offer' }),
      Candidate.countDocuments({ status: 'Hired' })
    ]);

    const totalCandidates = applied + screened + interviewed + offered + hired;

    res.status(200).json({
      success: true,
      data: {
        applied,
        screened,
        interviewed,
        offered,
        hired,
        conversionRate: totalCandidates > 0 ? ((hired / totalCandidates) * 100).toFixed(1) : '0.0'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed database with dummy data if empty
// @route   POST /api/dashboard/seed
// @access  Private (Admin only in reality, but accessible for demo)
exports.seedDashboardData = async (req, res, next) => {
  try {
    const jobCount = await Job.countDocuments();
    const candidateCount = await Candidate.countDocuments();

    if (jobCount > 0 || candidateCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Database already has data. Skipping seed.'
      });
    }

    // Seed Jobs
    const sampleJobs = [
      { title: 'Senior React Developer', description: 'Looking for a seasoned React pro.', requiredSkills: ['React', 'TypeScript', 'Next.js'], location: 'Remote' },
      { title: 'Backend Node.js Engineer', description: 'Strong API design skills needed.', requiredSkills: ['Node.js', 'Express', 'MongoDB'], location: 'New York, NY' },
      { title: 'Full Stack Engineer', description: 'Capable across the stack.', requiredSkills: ['React', 'Node.js', 'AWS'], location: 'San Francisco, CA' },
    ];
    await Job.insertMany(sampleJobs);

    // Seed Candidates
    const sampleCandidates = [
      { 
        name: 'Alice Johnson', 
        email: 'alice@example.com', 
        location: 'Remote',
        skills: ['React', 'TypeScript', 'Node.js'],
        parsedResume: { score: 96, skills: ['React', 'TypeScript', 'Node.js'], experience: 5 }
      },
      { 
        name: 'Bob Smith', 
        email: 'bob@example.com', 
        location: 'New York, NY',
        skills: ['Java', 'Spring Boot', 'SQL'],
        parsedResume: { score: 75, skills: ['Java', 'Spring Boot', 'SQL'], experience: 3 }
      },
      { 
        name: 'Charlie Davis', 
        email: 'charlie@example.com', 
        location: 'Austin, TX',
        skills: ['Python', 'Django', 'React'],
        parsedResume: { score: 88, skills: ['Python', 'Django', 'React'], experience: 4 }
      },
      { 
        name: 'Diana Prince', 
        email: 'diana@example.com', 
        location: 'Seattle, WA',
        skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
        parsedResume: { score: 98, skills: ['Node.js', 'Express', 'MongoDB', 'AWS'], experience: 7 }
      },
      { 
        name: 'Evan Wright', 
        email: 'evan@example.com', 
        location: 'Remote',
        skills: ['React', 'Next.js', 'TailwindCSS'],
        parsedResume: { score: 92, skills: ['React', 'Next.js', 'TailwindCSS'], experience: 4 }
      }
    ];
    await Candidate.insertMany(sampleCandidates);

    res.status(201).json({
      success: true,
      message: 'Database seeded successfully with demo records.'
    });

  } catch (error) {
    next(error);
  }
};
