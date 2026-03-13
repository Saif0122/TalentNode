const Job = require('../models/Job');
const { createNotification } = require('./notificationController');

exports.createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, location, department, employmentType, salaryRange, responsibilities, benefits } = req.body;

    if (!title || !description) {
      return res.status(400).json({ status: 'fail', error: 'Title and description are required' });
    }

    const job = new Job({ 
      title, description, requiredSkills, location, 
      department, employmentType, salaryRange, responsibilities, benefits,
      postedBy: req.user ? req.user._id : null
    });
    await job.save();

    res.status(201).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: jobs });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ status: 'fail', error: 'Job not found' });
    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ status: 'fail', error: 'Job not found' });
    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ status: 'fail', error: 'Job not found' });
    res.status(200).json({ status: 'success', data: {} });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.publishJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ status: 'fail', error: 'Job not found' });
    
    job.status = 'published';
    await job.save();

    await createNotification({
      title: 'Job Published',
      message: `The role "${job.title}" is now active.`,
      type: 'success',
      link: `/jobs/${job._id}`
    });

    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

exports.archiveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ status: 'fail', error: 'Job not found' });
    
    job.status = 'archived';
    await job.save();

    res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};
