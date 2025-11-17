const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: [
      'mentor_suggestion',
      'plan_reminder',
      'task_reminder',
      'mentor_review',
      'plan_applied',
      'agent_alert',
      'system',
      'attendance',
      'internal_marks',
      'semester_performance',
      'assignment',
      'exam_reminder',
      'aicte_points',
      'inactivity',
      'wellbeing',
      'career_development',
      'mentor_alert',
      'deadline'
    ],
    required: true,
    index: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  },
  payload: { 
    type: mongoose.Schema.Types.Mixed,
    default: {} 
  },
  read: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  readAt: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium' 
  },
  actionUrl: { type: String },
  actionLabel: { type: String },
  expiresAt: { type: Date },
  dismissed: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { sparse: true });

// Method to mark as read
NotificationSchema.methods.markRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create mentor suggestion notification
NotificationSchema.statics.createMentorSuggestionNotification = async function(userId, suggestionId, role = 'student') {
  const notification = {
    userId,
    type: 'mentor_suggestion',
    priority: 'high',
    payload: { suggestionId: suggestionId.toString() }
  };

  if (role === 'student') {
    notification.title = '📚 New Personalized Study Plan Available';
    notification.body = 'Your AI mentor has generated a personalized study timetable based on your academic performance. Review it now!';
    notification.actionUrl = `/dashboard/suggestions/${suggestionId}`;
    notification.actionLabel = 'View Plan';
  } else {
    notification.title = '👨‍🏫 Mentor Action Required';
    notification.body = 'A new AI-generated study plan needs your review before being shared with the student.';
    notification.actionUrl = `/mentor/suggestions/${suggestionId}`;
    notification.actionLabel = 'Review Now';
  }

  return this.create(notification);
};

// Static method to create task reminder
NotificationSchema.statics.createTaskReminder = async function(userId, task, dayPlan) {
  return this.create({
    userId,
    type: 'task_reminder',
    title: '⏰ Study Task Reminder',
    body: `Time for: ${task.task} (${task.durationMinutes} min)`,
    priority: 'medium',
    payload: {
      task: task.task,
      time: task.time,
      durationMinutes: task.durationMinutes,
      resourceUrl: task.resourceUrl
    },
    actionUrl: task.resourceUrl || '/dashboard/study-plan',
    actionLabel: task.resourceUrl ? 'Start Learning' : 'View Task'
  });
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false, dismissed: false });
};

// Static method to mark all as read
NotificationSchema.statics.markAllReadForUser = function(userId) {
  return this.updateMany(
    { userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
};

// Static method to cleanup expired notifications
NotificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Notification', NotificationSchema);
