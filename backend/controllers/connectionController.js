const Connection = require('../models/Connection');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

/**
 * @desc    Request a connection
 * @route   POST /api/connections/request
 * @access  Private
 */
exports.requestConnection = async (req, res) => {
  try {
    const { recipientId, source } = req.body;
    const requesterId = req.user._id;

    if (recipientId === requesterId.toString()) {
      return res.status(400).json({ status: 'fail', error: 'You cannot connect with yourself' });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      return res.status(400).json({ status: 'fail', error: 'Connection or request already exists' });
    }

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      source: source || 'Platform',
      status: 'Pending'
    });

    // Notify recipient
    await createNotification({
      user: recipientId,
      title: 'New Connection Request',
      message: `${req.user.name} wants to connect with you via ${source || 'Platform'}.`,
      type: 'info',
      link: `/settings/connections`
    });

    res.status(201).json({ status: 'success', data: connection });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @desc    Accept a connection request
 * @route   POST /api/connections/accept
 * @access  Private
 */
exports.acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ status: 'fail', error: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', error: 'Not authorized to accept this request' });
    }

    connection.status = 'Accepted';
    await connection.save();

    // Notify requester
    await createNotification({
      user: connection.requester,
      title: 'Connection Accepted',
      message: `${req.user.name} accepted your connection request.`,
      type: 'success',
      link: `/settings/connections`
    });

    res.status(200).json({ status: 'success', data: connection });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};

/**
 * @desc    Get all user connections
 * @route   GET /api/connections
 * @access  Private
 */
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'Accepted'
    }).populate('requester recipient', 'name email role avatar');

    res.status(200).json({ status: 'success', data: connections });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};
