const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const User = require('../models/User');
const calendarService = require('../services/calendarService');
const { createNotification } = require('./notificationController');

/**
 * @desc    Create a new interview and schedule on Google Calendar
 * @route   POST /api/scheduling/create
 * @access  Private (Recruiter/Admin)
 */
exports.createInterview = async (req, res) => {
  try {
    const { candidateId, jobId, startTime, endTime, duration, description } = req.body;

    const candidate = await Candidate.findById(candidateId);
    const job = await Job.findById(jobId);

    if (!candidate || !job) {
      return res.status(404).json({ status: 'fail', error: 'Candidate or Job not found' });
    }

    // Initialize interview record
    let interview = new Interview({
      candidate: candidateId,
      job: jobId,
      recruiter: req.user._id,
      startTime,
      endTime,
      duration,
      description,
      status: 'scheduled'
    });

    // Check if user has Google tokens
    const recruiter = await User.findById(req.user._id).select('+googleAccessToken +googleRefreshToken +googleTokenExpiry');
    
    if (recruiter.googleRefreshToken) {
      try {
        // Refresh token if needed or just set credentials
        calendarService.setCredentials({
          access_token: recruiter.googleAccessToken,
          refresh_token: recruiter.googleRefreshToken,
          expiry_date: recruiter.googleTokenExpiry?.getTime()
        });

        // Create Google Calendar event
        const googleEvent = await calendarService.createEvent({
          summary: `Interview: ${candidate.name} for ${job.title}`,
          description: description || `Interview scheduled via TalentNode for ${job.title}`,
          start: startTime,
          end: endTime,
          attendees: [
            { email: candidate.email },
            { email: recruiter.email }
          ]
        });

        interview.googleEventId = googleEvent.id;
        interview.meetingLink = googleEvent.hangoutLink || googleEvent.htmlLink;
      } catch (calendarError) {
        console.error('Google Calendar Error:', calendarError.message);
        // We still create the interview in our DB even if Google fails, but log it
      }
    }

    await interview.save();

    // Create Notification for the candidate (if they are a user)
    await createNotification({
      recipient: recruiter._id, // Notifying the recruiter themselves as a confirmation
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Interview with ${candidate.name} for ${job.title} is confirmed for ${new Date(startTime).toLocaleString()}.`,
      link: `/interviews`
    });

    res.status(201).json({
      status: 'success',
      data: interview
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', error: err.message });
  }
};

/**
 * @desc    Get all interviews for the logged-in recruiter
 * @route   GET /api/scheduling/events
 * @access  Private (Recruiter/Admin)
 */
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user._id })
      .populate('candidate', 'name email avatar')
      .populate('job', 'title location')
      .sort({ startTime: 1 });

    res.status(200).json({
      status: 'success',
      results: interviews.length,
      data: interviews
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', error: err.message });
  }
};

/**
 * @desc    Update interview details or status
 * @route   PATCH /api/scheduling/:id
 * @access  Private (Recruiter/Admin)
 */
exports.updateInterview = async (req, res) => {
  try {
    const { status, startTime, endTime, description } = req.body;
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ status: 'fail', error: 'Interview not found' });
    }

    // Check ownership
    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }

    const oldStatus = interview.status;
    interview.status = status || interview.status;
    interview.startTime = startTime || interview.startTime;
    interview.endTime = endTime || interview.endTime;
    interview.description = description || interview.description;

    // Update Google Calendar if linked
    if (interview.googleEventId) {
      const recruiter = await User.findById(req.user._id).select('+googleAccessToken +googleRefreshToken +googleTokenExpiry');
      try {
        calendarService.setCredentials({
          access_token: recruiter.googleAccessToken,
          refresh_token: recruiter.googleRefreshToken,
          expiry_date: recruiter.googleTokenExpiry?.getTime()
        });

        if (status === 'canceled') {
          await calendarService.deleteEvent(interview.googleEventId);
          interview.googleEventId = '';
        } else {
          await calendarService.updateEvent(interview.googleEventId, {
            summary: `INTERVIEW UPDATED: ${interview.status.toUpperCase()}`,
            start: { dateTime: interview.startTime },
            end: { dateTime: interview.endTime },
            description: interview.description
          });
        }
      } catch (calendarError) {
        console.error('Google Calendar Sync Error:', calendarError.message);
      }
    }

    await interview.save();

    res.status(200).json({
      status: 'success',
      data: interview
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', error: err.message });
  }
};

/**
 * @desc    Delete an interview
 * @route   DELETE /api/scheduling/:id
 * @access  Private (Recruiter/Admin)
 */
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ status: 'fail', error: 'Interview not found' });
    }

    // Check ownership
    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }

    // Delete from Google Calendar if linked
    if (interview.googleEventId) {
      const recruiter = await User.findById(req.user._id).select('+googleAccessToken +googleRefreshToken +googleTokenExpiry');
      try {
        calendarService.setCredentials({
          access_token: recruiter.googleAccessToken,
          refresh_token: recruiter.googleRefreshToken,
          expiry_date: recruiter.googleTokenExpiry?.getTime()
        });
        await calendarService.deleteEvent(interview.googleEventId);
      } catch (calendarError) {
        console.error('Google Calendar Deletion Error:', calendarError.message);
      }
    }

    await interview.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', error: err.message });
  }
};
