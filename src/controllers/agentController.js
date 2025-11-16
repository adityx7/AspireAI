const mongoose = require('mongoose');
const MentorSuggestion = require('../models/MentorSuggestion');
const StudyPlan = require('../models/StudyPlan');
const agentScheduler = require('../services/agentScheduler');
const academicRiskService = require('../services/academicRiskService');

/**
 * Agent Controller
 * Handles manual agent triggers and data retrieval
 */

/**
 * Manually trigger agent for a student
 * POST /api/agents/run
 */
exports.runAgent = async (req, res) => {
  try {
    const { userId, triggerType } = req.body;
    const requestedBy = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    // Check if user is authorized (mentor or admin)
    const isAuthorized = req.user?.role === 'mentor' || req.user?.role === 'admin' || req.user?._id.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to trigger agent for this user'
      });
    }

    // Trigger agent
    const result = req.user?._id.toString() === userId
      ? await agentScheduler.triggerStudentRequest(userId)
      : await agentScheduler.triggerManual(userId, requestedBy);

    if (!result.success && result.message) {
      return res.status(429).json(result);
    }

    res.json({
      success: true,
      message: 'Agent triggered successfully. Study plan will be generated shortly.',
      userId
    });

  } catch (error) {
    console.error('Error triggering agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger agent',
      error: error.message
    });
  }
};

/**
 * Get all suggestions for a user
 * GET /api/agents/:userId/suggestions
 */
exports.getSuggestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1, active } = req.query;

    // Build query
    const query = { userId };
    if (active !== undefined) {
      query.active = active === 'true';
    }

    // Get suggestions with pagination
    const suggestions = await MentorSuggestion.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Get total count
    const total = await MentorSuggestion.countDocuments(query);

    res.json({
      success: true,
      data: suggestions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: error.message
    });
  }
};

/**
 * Get active study plan for a user
 * GET /api/agents/:userId/active-plan
 */
exports.getActivePlan = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get active suggestion
    const suggestion = await MentorSuggestion.getActivePlan(userId);

    if (!suggestion) {
      return res.json({
        success: true,
        data: null,
        message: 'No active study plan found'
      });
    }

    // Get study plan stats
    const studyPlan = await StudyPlan.findOne({ userId });

    // Calculate progress
    const progress = suggestion.getProgress();
    const todayTasks = suggestion.getTodayTasks();
    const nextTask = suggestion.getNextTask();

    res.json({
      success: true,
      data: {
        suggestion: suggestion.toObject(),
        progress,
        todayTasks,
        nextTask,
        stats: studyPlan ? {
          currentStreak: studyPlan.statistics.currentStreak,
          longestStreak: studyPlan.statistics.longestStreak,
          averageCompletion: studyPlan.statistics.averageCompletion,
          totalPlansGenerated: studyPlan.statistics.totalPlansGenerated,
          totalPlansCompleted: studyPlan.statistics.totalPlansCompleted
        } : null
      }
    });

  } catch (error) {
    console.error('Error fetching active plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active plan',
      error: error.message
    });
  }
};

/**
 * Accept a suggestion
 * PUT /api/agents/:userId/accept/:suggestionId
 */
exports.acceptSuggestion = async (req, res) => {
  try {
    const { userId, suggestionId } = req.params;

    const suggestion = await MentorSuggestion.findById(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    if (suggestion.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this suggestion'
      });
    }

    // Deactivate other plans
    await MentorSuggestion.deactivateOldPlans(userId);

    // Accept this suggestion
    suggestion.accepted = true;
    suggestion.acceptedAt = new Date();
    suggestion.active = true;
    await suggestion.save();

    // Update study plan
    const studyPlan = await StudyPlan.getOrCreate(userId);
    studyPlan.activePlanId = suggestion._id;
    await studyPlan.updateProgress(suggestion);

    res.json({
      success: true,
      message: 'Study plan accepted successfully',
      data: suggestion
    });

  } catch (error) {
    console.error('Error accepting suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept suggestion',
      error: error.message
    });
  }
};

/**
 * Mark task as completed
 * PUT /api/agents/:userId/task/:taskId/complete
 */
exports.completeTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    // Find active plan
    const suggestion = await MentorSuggestion.getActivePlan(userId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'No active study plan found'
      });
    }

    // Find and mark task as completed
    let taskFound = false;
    suggestion.plan.forEach(day => {
      day.tasks.forEach(task => {
        if (task._id.toString() === taskId) {
          task.completed = true;
          task.completedAt = new Date();
          taskFound = true;
        }
      });
    });

    if (!taskFound) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await suggestion.save();

    // Update study plan progress and streak
    const studyPlan = await StudyPlan.getOrCreate(userId);
    studyPlan.updateStreak();
    studyPlan.lastTaskCompletedAt = new Date();
    await studyPlan.updateProgress(suggestion);

    const progress = suggestion.getProgress();

    res.json({
      success: true,
      message: 'Task marked as completed',
      data: {
        taskId,
        progress,
        streak: studyPlan.statistics.currentStreak
      }
    });

  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete task',
      error: error.message
    });
  }
};

/**
 * Get today's tasks for a user
 * GET /api/agents/:userId/today
 */
exports.getTodayTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    const suggestion = await MentorSuggestion.getActivePlan(userId);

    if (!suggestion) {
      return res.json({
        success: true,
        data: {
          tasks: [],
          message: 'No active study plan. Generate one to get started!'
        }
      });
    }

    const todayTasks = suggestion.getTodayTasks();
    const progress = suggestion.getProgress();

    res.json({
      success: true,
      data: {
        tasks: todayTasks,
        progress,
        planId: suggestion._id,
        planLength: suggestion.planLength,
        riskLevel: suggestion.riskProfile?.overallRisk || 'low'
      }
    });

  } catch (error) {
    console.error('Error fetching today tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s tasks',
      error: error.message
    });
  }
};

/**
 * Get risk profile for a user
 * GET /api/agents/:userId/risk-profile
 */
exports.getRiskProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Load student data
    const User = mongoose.model('User');
    const student = await User.findById(userId)
      .populate('attendance')
      .populate('internalMarks')
      .populate('semesterMarks');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Generate risk profile
    const riskProfile = await academicRiskService.generateRiskProfile(student);

    res.json({
      success: true,
      data: riskProfile
    });

  } catch (error) {
    console.error('Error fetching risk profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch risk profile',
      error: error.message
    });
  }
};

/**
 * Get scheduler status (admin only)
 * GET /api/agents/scheduler/status
 */
exports.getSchedulerStatus = async (req, res) => {
  try {
    // Check if admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const status = agentScheduler.getStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error fetching scheduler status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduler status',
      error: error.message
    });
  }
};

/**
 * Review suggestion (mentor only)
 * PUT /api/agents/review/:suggestionId
 */
exports.reviewSuggestion = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const { reviewNotes, approved } = req.body;

    // Check if mentor
    if (req.user?.role !== 'mentor') {
      return res.status(403).json({
        success: false,
        message: 'Mentor access required'
      });
    }

    const suggestion = await MentorSuggestion.findById(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    // Mark as reviewed
    suggestion.reviewed = true;
    suggestion.reviewedBy = req.user._id;
    suggestion.reviewedAt = new Date();
    
    if (reviewNotes) {
      suggestion.reviewNotes = reviewNotes;
    }

    if (approved !== undefined) {
      suggestion.accepted = approved;
      if (approved) {
        suggestion.acceptedAt = new Date();
      }
    }

    await suggestion.save();

    res.json({
      success: true,
      message: 'Suggestion reviewed successfully',
      data: suggestion
    });

  } catch (error) {
    console.error('Error reviewing suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review suggestion',
      error: error.message
    });
  }
};
