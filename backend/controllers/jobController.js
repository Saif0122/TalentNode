const Job = require('../models/Job');
const { createNotification } = require('./notificationController');

/**
 * @openapi
 * /api/jobs:
 *   post:
 *     summary: Create a new job post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               requiredSkills: { type: array, items: { type: string } }
 *               location: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: 'fail',
        error: 'Title and description are required'
      });
    }

    const job = new Job({ title, description, requiredSkills, location });
    await job.save();

    // Broadcast notification that a new job was posted
    await createNotification({
      title: 'New Job Posted',
      message: `The role "${title}" was successfully created.`,
      type: 'success',
      link: '/jobs'
    });

    res.status(201).json({
      status: 'success',
      data: job
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     summary: List all jobs
 *     responses:
 *       200:
 *         description: OK
 */
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs
};
