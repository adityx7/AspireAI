const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  task: {
    type: String,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 15,
    max: 180
  },
  resourceUrl: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date
});

const planDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 28
  },
  date: {
    type: Date,
    required: true
  },
  tasks: [taskSchema]
});

const insightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  }
});

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const mentorSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  insights: [insightSchema],
  planLength: {
    type: Number,
    enum: [7, 14, 28],
    required: true
  },
  plan: [planDaySchema],
  resources: [resourceSchema],
  mentorActions: [{
    type: String
  }],
  riskProfile: {
    lowAttendance: [String],
    weakSubjects: [String],
    cgpaDrop: Boolean,
    overallRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  accepted: {
    type: Boolean,
    default: false
  },
  acceptedAt: Date,
  active: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorSuggestion'
  },
  generatedBy: {
    type: String,
    enum: ['auto', 'manual', 'student-request'],
    default: 'auto'
  }
}, {
  timestamps: true
});

// Indexes for performance
mentorSuggestionSchema.index({ userId: 1, active: 1 });
mentorSuggestionSchema.index({ createdAt: -1 });
mentorSuggestionSchema.index({ reviewed: 1, accepted: 1 });

// Methods
mentorSuggestionSchema.methods.getProgress = function() {
  let totalTasks = 0;
  let completedTasks = 0;

  this.plan.forEach(day => {
    totalTasks += day.tasks.length;
    completedTasks += day.tasks.filter(t => t.completed).length;
  });

  return {
    totalTasks,
    completedTasks,
    progressPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
};

mentorSuggestionSchema.methods.getTodayTasks = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayPlan = this.plan.find(day => {
    const planDate = new Date(day.date);
    planDate.setHours(0, 0, 0, 0);
    return planDate.getTime() === today.getTime();
  });

  return todayPlan ? todayPlan.tasks : [];
};

mentorSuggestionSchema.methods.getNextTask = function() {
  const now = new Date();
  
  for (const dayPlan of this.plan) {
    const planDate = new Date(dayPlan.date);
    if (planDate >= now) {
      for (const task of dayPlan.tasks) {
        if (!task.completed) {
          return {
            day: dayPlan.day,
            date: dayPlan.date,
            task: task
          };
        }
      }
    }
  }
  
  return null;
};

mentorSuggestionSchema.statics.getActivePlan = async function(userId) {
  return this.findOne({ 
    userId, 
    active: true,
    accepted: true 
  }).sort({ createdAt: -1 });
};

mentorSuggestionSchema.statics.deactivateOldPlans = async function(userId) {
  return this.updateMany(
    { userId, active: true },
    { $set: { active: false } }
  );
};

// Static method to find pending suggestions for a user
mentorSuggestionSchema.statics.findPendingForUser = function(userId) {
  return this.find({
    userId,
    reviewed: false,
    dismissed: false
  }).sort({ generatedAt: -1 });
};

// Static method to find active plans
mentorSuggestionSchema.statics.findActivePlans = function(userId) {
  return this.find({
    userId,
    accepted: true,
    dismissed: false,
    applied: true
  }).sort({ generatedAt: -1 });
};

const MentorSuggestion = mongoose.model('MentorSuggestion', mentorSuggestionSchema);

module.exports = MentorSuggestion;
