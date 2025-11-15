const express = require('express');
const router = express.Router();
const { enqueueMentorAgentJob, enqueueCareerPlannerJob, getJobStatus, getQueueStats } = require('../services/queueService');
const MentorSuggestion = require('../models/MentorSuggestion');
const AgentJob = require('../models/AgentJob');
const Notification = require('../models/Notification');

/**
 * POST /api/agents/trigger
 * Trigger an agent job for a user
 */
router.post('/trigger', async (req, res) => {
  try {
    const { userId, type = 'mentorAgent', force = false } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!['mentorAgent', 'careerPlanner', 'adhoc'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be mentorAgent, careerPlanner, or adhoc'
      });
    }

    // Check rate limit unless forced
    if (!force) {
      const canEnqueue = await AgentJob.canEnqueueJob(userId, type, 6);
      if (!canEnqueue) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. A recent job exists for this user within 6 hours.',
          hint: 'Set force:true to override rate limit'
        });
      }
    }

    let job;
    if (type === 'mentorAgent' || type === 'adhoc') {
      job = await enqueueMentorAgentJob(userId, {
        force,
        triggeredBy: 'api',
        priority: force ? 10 : 0
      });
    } else if (type === 'careerPlanner') {
      job = await enqueueCareerPlannerJob(userId, {
        force,
        triggeredBy: 'api',
        priority: force ? 10 : 0
      });
    }

    res.json({
      success: true,
      message: 'Agent job enqueued successfully',
      data: {
        jobId: job.id,
        userId,
        type,
        status: 'queued'
      }
    });

  } catch (error) {
    console.error('Error triggering agent job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/job/:jobId/status
 * Get status of a specific job
 */
router.get('/job/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobStatus = await getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Also get AgentJob record if exists
    const agentJob = await AgentJob.findOne({ jobId }).lean();

    res.json({
      success: true,
      data: {
        ...jobStatus,
        agentJobRecord: agentJob
      }
    });

  } catch (error) {
    console.error('Error getting job status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/students/:id/mentor-suggestions
 * Get mentor suggestions for a student
 */
router.get('/students/:id/mentor-suggestions', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { 
      status = 'all', // all, pending, reviewed, accepted, dismissed
      limit = 10,
      skip = 0 
    } = req.query;

    let query = { userId };

    if (status === 'pending') {
      query.reviewed = false;
      query.dismissed = false;
    } else if (status === 'reviewed') {
      query.reviewed = true;
    } else if (status === 'accepted') {
      query.accepted = true;
    } else if (status === 'dismissed') {
      query.dismissed = true;
    }

    const suggestions = await MentorSuggestion.find(query)
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await MentorSuggestion.countDocuments(query);

    // Add computed fields
    const enhancedSuggestions = suggestions.map(suggestion => {
      const now = new Date();
      const lastDay = suggestion.plan[suggestion.plan.length - 1];
      const daysRemaining = lastDay ? Math.ceil((new Date(lastDay.date) - now) / (1000 * 60 * 60 * 24)) : 0;
      
      return {
        ...suggestion,
        daysRemaining: Math.max(0, daysRemaining),
        isActive: suggestion.accepted && !suggestion.dismissed && daysRemaining > 0
      };
    });

    res.json({
      success: true,
      data: {
        suggestions: enhancedSuggestions,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });

  } catch (error) {
    console.error('Error fetching mentor suggestions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/students/:id/mentor-suggestions/:sid/review
 * Review a mentor suggestion (mentor action)
 */
router.put('/students/:id/mentor-suggestions/:sid/review', async (req, res) => {
  try {
    const { id: userId, sid: suggestionId } = req.params;
    const { action, notes, reviewedBy } = req.body;

    if (!action || !['accept', 'dismiss'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be accept or dismiss'
      });
    }

    const suggestion = await MentorSuggestion.findOne({
      _id: suggestionId,
      userId
    });

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (suggestion.reviewed) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion has already been reviewed'
      });
    }

    // Update suggestion
    suggestion.reviewed = true;
    suggestion.reviewedAt = new Date();
    suggestion.reviewedBy = reviewedBy || 'UNKNOWN_MENTOR';
    suggestion.reviewNotes = notes || '';

    if (action === 'accept') {
      suggestion.accepted = true;
      suggestion.dismissed = false;
    } else {
      suggestion.accepted = false;
      suggestion.dismissed = true;
      suggestion.dismissReason = notes || 'Dismissed by mentor';
    }

    await suggestion.save();

    // Send notification to student
    if (action === 'accept') {
      await Notification.create({
        userId,
        type: 'mentor_review',
        title: '✅ Study Plan Approved',
        body: 'Your mentor has approved your personalized study plan. You can now apply it to your schedule.',
        priority: 'high',
        payload: { suggestionId: suggestion._id },
        actionUrl: `/dashboard/suggestions/${suggestion._id}`,
        actionLabel: 'Apply Plan'
      });
    } else {
      await Notification.create({
        userId,
        type: 'mentor_review',
        title: 'Study Plan Feedback',
        body: notes || 'Your mentor has provided feedback on your study plan.',
        priority: 'medium',
        payload: { suggestionId: suggestion._id }
      });
    }

    res.json({
      success: true,
      message: `Suggestion ${action}ed successfully`,
      data: {
        suggestionId: suggestion._id,
        reviewed: suggestion.reviewed,
        accepted: suggestion.accepted,
        dismissed: suggestion.dismissed
      }
    });

  } catch (error) {
    console.error('Error reviewing suggestion:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/students/:id/mentor-suggestions/:sid/apply
 * Apply an accepted plan (student action)
 */
router.post('/students/:id/mentor-suggestions/:sid/apply', async (req, res) => {
  try {
    const { id: userId, sid: suggestionId } = req.params;

    const suggestion = await MentorSuggestion.findOne({
      _id: suggestionId,
      userId
    });

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (!suggestion.accepted) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion must be accepted by mentor before applying'
      });
    }

    if (suggestion.applied) {
      return res.status(400).json({
        success: false,
        error: 'Plan has already been applied'
      });
    }

    // Mark as applied
    suggestion.applied = true;
    suggestion.appliedAt = new Date();
    await suggestion.save();

    // TODO: Schedule reminders for each task
    // This would integrate with a notification scheduler
    // For now, we'll create a few sample reminders for the first few days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < Math.min(3, suggestion.plan.length); i++) {
      const dayPlan = suggestion.plan[i];
      const dayDate = new Date(dayPlan.date);
      
      if (dayDate >= today) {
        for (const task of dayPlan.tasks) {
          // Create task reminder notification
          await Notification.createTaskReminder(userId, task, dayPlan);
        }
      }
    }

    // Notify mentor
    if (suggestion.reviewedBy) {
      await Notification.create({
        userId: suggestion.reviewedBy,
        type: 'plan_applied',
        title: '📅 Student Applied Study Plan',
        body: `Student ${userId} has started following the study plan you approved.`,
        priority: 'low',
        payload: { suggestionId: suggestion._id, studentId: userId }
      });
    }

    res.json({
      success: true,
      message: 'Study plan applied successfully',
      data: {
        suggestionId: suggestion._id,
        applied: true,
        appliedAt: suggestion.appliedAt,
        remindersScheduled: Math.min(3, suggestion.plan.length)
      }
    });

  } catch (error) {
    console.error('Error applying suggestion:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/metrics
 * Get agent metrics and statistics
 */
router.get('/metrics', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const endDate = new Date();

    // Job metrics
    const jobMetrics = await AgentJob.getMetrics(startDate, endDate);
    
    // Suggestion metrics
    const suggestionStats = await MentorSuggestion.aggregate([
      {
        $match: {
          generatedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          reviewed: { $sum: { $cond: ['$reviewed', 1, 0] } },
          accepted: { $sum: { $cond: ['$accepted', 1, 0] } },
          dismissed: { $sum: { $cond: ['$dismissed', 1, 0] } },
          applied: { $sum: { $cond: ['$applied', 1, 0] } },
          avgConfidence: { $avg: '$confidence' },
          avgPlanLength: { $avg: '$planLength' }
        }
      }
    ]);

    // Queue stats
    const queueStats = await getQueueStats();

    // Top insights by severity
    const topInsights = await MentorSuggestion.aggregate([
      {
        $match: {
          generatedAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$insights' },
      {
        $group: {
          _id: {
            severity: '$insights.severity',
            title: '$insights.title'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate,
          days: parseInt(days)
        },
        jobs: {
          metrics: jobMetrics,
          queue: queueStats
        },
        suggestions: suggestionStats[0] || {
          total: 0,
          reviewed: 0,
          accepted: 0,
          dismissed: 0,
          applied: 0
        },
        insights: topInsights
      }
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/:userId
 * Get notifications for a user
 */
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      type, 
      read, 
      limit = 20, 
      skip = 0 
    } = req.query;

    let query = { userId, dismissed: false };
    
    if (type) query.type = type;
    if (read !== undefined) query.read = read === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/notifications/:notificationId/read
 * Mark notification as read
 */
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.markRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notificationId: notification._id,
        read: notification.read
      }
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
