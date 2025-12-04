const express = require('express');
const router = express.Router();
const VideoCall = require('../models/VideoCall');
const { v4: uuidv4 } = require('uuid');

// Middleware to check authentication (basic version)
const checkAuth = (req, res, next) => {
  // In production, verify JWT token here
  next();
};

/**
 * @route   POST /api/video-calls/initiate
 * @desc    Initiate a new video call
 * @access  Private
 */
router.post('/initiate', checkAuth, async (req, res) => {
  try {
    const {
      initiatorId,
      initiatorType,
      initiatorName,
      receiverId,
      receiverType,
      receiverName,
      scheduledTime
    } = req.body;

    // Validate required fields
    if (!initiatorId || !receiverId || !initiatorName || !receiverName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate unique room ID
    const roomId = `room_${uuidv4()}`;

    const videoCall = new VideoCall({
      roomId,
      initiator: {
        userId: initiatorId,
        userType: initiatorType || 'student',
        name: initiatorName
      },
      receiver: {
        userId: receiverId,
        userType: receiverType || 'mentor',
        name: receiverName
      },
      status: scheduledTime ? 'scheduled' : 'waiting',
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null
    });

    await videoCall.save();

    res.status(201).json({
      success: true,
      message: 'Video call initiated successfully',
      data: {
        roomId: videoCall.roomId,
        callId: videoCall._id,
        status: videoCall.status
      }
    });

  } catch (error) {
    console.error('Error initiating video call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate video call',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/video-calls/:roomId/join
 * @desc    Join a video call
 * @access  Private
 */
router.put('/:roomId/join', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, userType } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    // Update join time
    const now = new Date();
    if (videoCall.initiator.userId === userId) {
      videoCall.initiator.joinedAt = now;
    } else if (videoCall.receiver.userId === userId) {
      videoCall.receiver.joinedAt = now;
    }

    // Start call if both participants are present
    if (videoCall.initiator.joinedAt && videoCall.receiver.joinedAt && videoCall.status === 'waiting') {
      videoCall.status = 'ongoing';
      videoCall.startTime = now;
    }

    await videoCall.save();

    res.json({
      success: true,
      message: 'Joined video call successfully',
      data: videoCall
    });

  } catch (error) {
    console.error('Error joining video call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join video call',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/video-calls/:roomId/end
 * @desc    End a video call
 * @access  Private
 */
router.put('/:roomId/end', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    // Update left time
    const now = new Date();
    if (videoCall.initiator.userId === userId) {
      videoCall.initiator.leftAt = now;
    } else if (videoCall.receiver.userId === userId) {
      videoCall.receiver.leftAt = now;
    }

    // End call if both participants have left or one has left
    if (videoCall.initiator.leftAt || videoCall.receiver.leftAt) {
      await videoCall.endCall();
    }

    res.json({
      success: true,
      message: 'Video call ended successfully',
      data: {
        duration: videoCall.duration,
        endTime: videoCall.endTime
      }
    });

  } catch (error) {
    console.error('Error ending video call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end video call',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/video-calls/:roomId/chat
 * @desc    Add chat message during call
 * @access  Private
 */
router.post('/:roomId/chat', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, senderName, message } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    await videoCall.addChatMessage(senderId, senderName, message);

    res.json({
      success: true,
      message: 'Chat message added successfully'
    });

  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add chat message',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/video-calls/:roomId/toggle-feature
 * @desc    Toggle call features (video, audio, screen share, recording)
 * @access  Private
 */
router.put('/:roomId/toggle-feature', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { feature, enabled } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    if (videoCall.features.hasOwnProperty(feature)) {
      videoCall.features[feature] = enabled;
      
      // Handle recording start/stop
      if (feature === 'recordingEnabled') {
        if (enabled) {
          videoCall.recording.enabled = true;
          videoCall.recording.startedAt = new Date();
        } else if (videoCall.recording.enabled) {
          videoCall.recording.stoppedAt = new Date();
          videoCall.recording.duration = Math.floor(
            (videoCall.recording.stoppedAt - videoCall.recording.startedAt) / 1000
          );
        }
      }
      
      await videoCall.save();
    }

    res.json({
      success: true,
      message: `Feature ${feature} updated successfully`,
      data: videoCall.features
    });

  } catch (error) {
    console.error('Error toggling feature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle feature',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/video-calls/history/:userId
 * @desc    Get call history for a user
 * @access  Private
 */
router.get('/history/:userId', checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, limit = 20, status } = req.query;

    let query = {
      $or: [
        { 'initiator.userId': userId },
        { 'receiver.userId': userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const calls = await VideoCall.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: calls.length,
      data: calls
    });

  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call history',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/video-calls/upcoming/:userId
 * @desc    Get upcoming scheduled calls
 * @access  Private
 */
router.get('/upcoming/:userId', checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const calls = await VideoCall.getUpcomingCalls(userId);

    res.json({
      success: true,
      count: calls.length,
      data: calls
    });

  } catch (error) {
    console.error('Error fetching upcoming calls:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming calls',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/video-calls/:roomId
 * @desc    Get call details
 * @access  Private
 */
router.get('/:roomId', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    res.json({
      success: true,
      data: videoCall
    });

  } catch (error) {
    console.error('Error fetching call details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call details',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/video-calls/:roomId/notes
 * @desc    Add meeting notes after call
 * @access  Private
 */
router.post('/:roomId/notes', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { summary, actionItems, addedBy } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    videoCall.meetingNotes = {
      summary,
      actionItems,
      addedBy,
      addedAt: new Date()
    };

    await videoCall.save();

    res.json({
      success: true,
      message: 'Meeting notes added successfully',
      data: videoCall.meetingNotes
    });

  } catch (error) {
    console.error('Error adding meeting notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add meeting notes',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/video-calls/:roomId/cancel
 * @desc    Cancel a scheduled call
 * @access  Private
 */
router.put('/:roomId/cancel', checkAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { cancelledBy, cancelReason } = req.body;

    const videoCall = await VideoCall.findOne({ roomId });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found'
      });
    }

    videoCall.status = 'cancelled';
    videoCall.cancelledBy = cancelledBy;
    videoCall.cancelReason = cancelReason;

    await videoCall.save();

    res.json({
      success: true,
      message: 'Video call cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel call',
      error: error.message
    });
  }
});

module.exports = router;
