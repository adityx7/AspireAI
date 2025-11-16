const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  activePlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorSuggestion'
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  progressPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  nextTask: {
    day: Number,
    date: Date,
    time: String,
    task: String,
    taskId: mongoose.Schema.Types.ObjectId
  },
  lastTaskCompletedAt: Date,
  planHistory: [{
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MentorSuggestion'
    },
    startedAt: Date,
    completedAt: Date,
    finalProgress: Number
  }],
  statistics: {
    totalPlansGenerated: {
      type: Number,
      default: 0
    },
    totalPlansCompleted: {
      type: Number,
      default: 0
    },
    averageCompletion: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  }
}, {
  timestamps: true
});

// Methods
studyPlanSchema.methods.updateProgress = async function(mentorSuggestion) {
  const progress = mentorSuggestion.getProgress();
  
  this.tasksCompleted = progress.completedTasks;
  this.totalTasks = progress.totalTasks;
  this.progressPercent = progress.progressPercent;
  
  const nextTask = mentorSuggestion.getNextTask();
  if (nextTask) {
    this.nextTask = {
      day: nextTask.day,
      date: nextTask.date,
      time: nextTask.task.time,
      task: nextTask.task.task,
      taskId: nextTask.task._id
    };
  } else {
    this.nextTask = undefined;
  }
  
  await this.save();
  return this;
};

studyPlanSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = this.statistics.lastActiveDate 
    ? new Date(this.statistics.lastActiveDate) 
    : null;
  
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.statistics.currentStreak += 1;
      if (this.statistics.currentStreak > this.statistics.longestStreak) {
        this.statistics.longestStreak = this.statistics.currentStreak;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      this.statistics.currentStreak = 1;
    }
    // If daysDiff === 0, same day - no change
  } else {
    // First task ever
    this.statistics.currentStreak = 1;
    this.statistics.longestStreak = 1;
  }
  
  this.statistics.lastActiveDate = today;
};

studyPlanSchema.methods.completePlan = async function(finalProgress) {
  if (this.activePlanId) {
    this.planHistory.push({
      planId: this.activePlanId,
      completedAt: new Date(),
      finalProgress: finalProgress || this.progressPercent
    });
    
    this.statistics.totalPlansCompleted += 1;
    
    // Recalculate average completion
    const totalProgress = this.planHistory.reduce((sum, h) => sum + h.finalProgress, 0);
    this.statistics.averageCompletion = Math.round(totalProgress / this.planHistory.length);
  }
  
  await this.save();
  return this;
};

studyPlanSchema.statics.getOrCreate = async function(userId) {
  let studyPlan = await this.findOne({ userId });
  
  if (!studyPlan) {
    studyPlan = await this.create({
      userId,
      statistics: {
        totalPlansGenerated: 0,
        totalPlansCompleted: 0,
        averageCompletion: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    });
  }
  
  return studyPlan;
};

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

module.exports = StudyPlan;
