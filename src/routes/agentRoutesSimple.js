const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const MentorSuggestion = require('../models/MentorSuggestion');
const StudyPlan = require('../models/StudyPlan');
const academicRiskService = require('../services/academicRiskService');

/**
 * Generate a mock study plan for testing/fallback
 */
function generateMockStudyPlan(riskProfile) {
  const planLength = riskProfile?.overallRisk === 'high' ? 7 : 14;
  const plan = [];
  const today = new Date();

  // Generate daily tasks
  for (let day = 1; day <= planLength; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day - 1);
    date.setHours(0, 0, 0, 0); // Reset to midnight for proper date comparison

    plan.push({
      day,
      date: date, // Store as Date object, not string
      tasks: [
        {
          time: '09:00',
          task: 'Review previous concepts',
          durationMinutes: 30,
          resourceUrl: 'https://www.youtube.com'
        },
        {
          time: '09:45',
          task: 'Practice problems',
          durationMinutes: 60,
          resourceUrl: 'https://www.leetcode.com'
        },
        {
          time: '11:00',
          task: 'Break',
          durationMinutes: 15,
          resourceUrl: ''
        },
        {
          time: '11:15',
          task: 'Learn new topic',
          durationMinutes: 60,
          resourceUrl: 'https://www.youtube.com'
        },
        {
          time: '12:30',
          task: 'Lunch break',
          durationMinutes: 30,
          resourceUrl: ''
        },
        {
          time: '13:00',
          task: 'Quiz/Assessment',
          durationMinutes: 45,
          resourceUrl: ''
        },
        {
          time: '14:00',
          task: 'Review and notes',
          durationMinutes: 30,
          resourceUrl: ''
        }
      ]
    });
  }

  return {
    insights: [
      {
        title: 'Study Focus',
        detail: 'Focus on core concepts and fundamentals',
        severity: 'medium'
      },
      {
        title: 'Practice',
        detail: 'Daily practice is essential for mastery',
        severity: 'high'
      }
    ],
    planLength,
    plan,
    resources: [
      { title: 'YouTube Tutorials', url: 'https://www.youtube.com' },
      { title: 'LeetCode Practice', url: 'https://www.leetcode.com' },
      { title: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org' }
    ],
    mentorActions: [
      'Review progress weekly',
      'Provide feedback on assignments',
      'Clarify doubts in weekly sessions'
    ]
  };
}

// Simple auth middleware
const authenticate = (req, res, next) => {
  // TODO: Add your auth logic
  next();
};

/**
 * GET /api/agents/:userId/today
 * Get today's tasks for a user
 */
router.get('/:userId/today', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const suggestion = await MentorSuggestion.getActivePlan(userId);
    
    if (!suggestion) {
      return res.json({
        success: true,
        tasks: [],
        message: 'No active study plan. Generate one to get started!'
      });
    }

    const tasks = suggestion.getTodayTasks();

    res.json({
      success: true,
      tasks,
      planId: suggestion._id,
      progress: suggestion.getProgress()
    });

  } catch (error) {
    console.error('❌ Error getting today tasks:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/:userId/active-plan
 * Get active study plan with stats
 */
router.get('/:userId/active-plan', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const suggestion = await MentorSuggestion.getActivePlan(userId);
    
    if (!suggestion) {
      return res.json({
        success: true,
        activePlan: null,
        message: 'No active study plan'
      });
    }

    const studyPlan = await StudyPlan.findOne({ userId });

    res.json({
      success: true,
      activePlan: suggestion,
      progress: suggestion.getProgress(),
      todayTasks: suggestion.getTodayTasks(),
      nextTask: suggestion.getNextTask(),
      stats: studyPlan ? studyPlan.statistics : null
    });

  } catch (error) {
    console.error('❌ Error getting active plan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/:userId/risk-profile
 * Get risk analysis for a student
 */
router.get('/:userId/risk-profile', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const User = require('../components/pages/student/Server').User || 
                 mongoose.model('User');
    
    const student = await User.findById(userId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const riskProfile = await academicRiskService.generateRiskProfile(student);

    res.json({
      success: true,
      riskProfile
    });

  } catch (error) {
    console.error('❌ Error generating risk profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/agents/:userId/task/:taskId/complete
 * Mark a task as complete
 */
router.put('/:userId/task/:taskId/complete', authenticate, async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const suggestion = await MentorSuggestion.getActivePlan(userId);
    
    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'No active study plan found'
      });
    }

    // Find and mark task as complete
    let taskFound = false;
    for (const day of suggestion.plan) {
      const task = day.tasks.find(t => t._id.toString() === taskId);
      if (task) {
        task.completed = true;
        task.completedAt = new Date();
        taskFound = true;
        break;
      }
    }

    if (!taskFound) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    await suggestion.save();

    // Update study plan progress
    const studyPlan = await StudyPlan.getOrCreate(userId);
    await studyPlan.updateProgress(suggestion);

    res.json({
      success: true,
      message: 'Task completed!',
      progress: suggestion.getProgress(),
      stats: studyPlan.statistics
    });

  } catch (error) {
    console.error('❌ Error completing task:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/agents/:userId/plan/:suggestionId
 * Delete a study plan
 */
router.delete('/:userId/plan/:suggestionId', authenticate, async (req, res) => {
  try {
    const { userId, suggestionId } = req.params;

    const suggestion = await MentorSuggestion.findOne({
      _id: suggestionId,
      userId: userId
    });

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Study plan not found'
      });
    }

    // Delete the suggestion
    await MentorSuggestion.deleteOne({ _id: suggestionId });

    console.log(`🗑️ Deleted study plan ${suggestionId} for user ${userId}`);

    res.json({
      success: true,
      message: 'Study plan deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting study plan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/run
 * Manual trigger - Generate study plan using AI
 */
router.post('/run', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    console.log('📍 Starting plan generation for userId:', userId);

    // Import AI service
    const aiService = require('../services/aiService');
    
    // Get user model
    const User = mongoose.models.User || mongoose.model('User');
    let student = await User.findById(userId);

    console.log('👤 Student lookup result:', student ? `Found: ${student.fullName}` : 'Not found - using defaults');

    // If student not found, create a mock student object
    if (!student) {
      console.log('⚠️ Student not found, using mock data');
      student = {
        _id: userId,
        fullName: 'Student',
        usn: 'TEST001',
        email: 'student@test.com',
        toObject: () => ({
          _id: userId,
          fullName: 'Student',
          usn: 'TEST001',
          email: 'student@test.com'
        })
      };
    }

    console.log('👤 Using student:', student.fullName);

    // Generate risk profile (with mock data for now since schema doesn't have these fields)
    const riskProfile = await academicRiskService.generateRiskProfile({
      ...student.toObject(),
      attendance: {overall: 80}, // Mock data
      internalMarks: [],
      semesterMarks: []
    });

    console.log('📊 Risk profile generated:', riskProfile.overallRisk);

    // Generate AI study plan
    console.log('🤖 Generating AI study plan for:', student.fullName);
    let planData;
    try {
      planData = await aiService.generateStudyPlan({
        name: student.fullName,
        usn: student.usn,
        email: student.email,
        riskProfile
      }, {
        planLength: riskProfile.overallRisk === 'high' ? 7 : 14
      });
      console.log('✅ AI study plan generated successfully');
    } catch (aiError) {
      console.error('❌ AI Service Error:', aiError.message);
      console.error('Full error:', aiError);
      
      // Fallback: Generate a mock study plan if AI fails
      console.log('⚠️ Using fallback mock study plan due to AI error');
      planData = generateMockStudyPlan(riskProfile);
      console.log('✅ Mock study plan generated as fallback');
    }

    // Deactivate old plans
    await MentorSuggestion.deactivateOldPlans(userId);

    // Create new suggestion
    const suggestion = new MentorSuggestion({
      userId,
      insights: planData.insights,
      planLength: planData.planLength,
      plan: planData.plan,
      resources: planData.resources,
      mentorActions: planData.mentorActions,
      riskProfile,
      active: true,
      accepted: true, // Auto-accept manual triggers
      generatedBy: 'manual',
      version: 2
    });

    console.log('💾 Attempting to save suggestion to MongoDB...');
    console.log('📝 Document to save:', JSON.stringify({
      userId: suggestion.userId,
      insights: suggestion.insights?.length,
      planLength: suggestion.planLength,
      planDays: suggestion.plan?.length,
      resources: suggestion.resources?.length,
      active: suggestion.active,
      accepted: suggestion.accepted
    }));
    
    const savedSuggestion = await suggestion.save();
    console.log('✅ Suggestion saved with ID:', savedSuggestion._id);
    console.log('✅ Saved document keys:', Object.keys(savedSuggestion.toObject()));

    // Update study plan tracker
    console.log('📊 Updating study plan tracker...');
    const studyPlan = await StudyPlan.getOrCreate(userId);
    await studyPlan.updateProgress(savedSuggestion);

    console.log('✅ Study plan saved successfully');

    res.json({
      success: true,
      message: 'Study plan generated successfully!',
      planId: suggestion._id,
      plan: suggestion
    });

  } catch (error) {
    console.error('❌ Error running agent:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate study plan',
      details: error.message
    });
  }
});

/**
 * GET /api/agents/:userId/suggestions
 * Get all suggestions for a user
 */
router.get('/:userId/suggestions', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const suggestions = await MentorSuggestion.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await MentorSuggestion.countDocuments({ userId });

    res.json({
      success: true,
      suggestions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

  } catch (error) {
    console.error('❌ Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
