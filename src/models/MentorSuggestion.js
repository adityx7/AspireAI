const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  time: { type: String, required: true }, // "09:00"
  task: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  resource: { type: String, default: '' },
  resourceUrl: { type: String, default: '' },
  practiceProblemIds: [{ type: String }],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { _id: false });

const DayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date, required: true },
  tasks: [TaskSchema]
}, { _id: false });

const InsightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    required: true 
  }
}, { _id: false });

const MicroSupportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  estimatedMinutes: { type: Number, required: true },
  resourceUrl: { type: String, default: '' },
  exampleProblem: { type: String, default: '' }
}, { _id: false });

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'article', 'course', 'notes', 'practice', 'other'],
    default: 'other'
  }
}, { _id: false });

const MentorSuggestionSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  agent: { 
    type: String, 
    enum: ['mentorAgent', 'careerPlanner', 'adhoc'],
    default: 'mentorAgent',
    required: true 
  },
  insights: [InsightSchema],
  planLength: { 
    type: Number, 
    enum: [7, 14, 28],
    required: true 
  },
  plan: [DayPlanSchema],
  microSupport: [MicroSupportSchema],
  resources: [ResourceSchema],
  suggestedMentorActions: [{ type: String }],
  confidence: { 
    type: Number, 
    min: 0, 
    max: 1,
    default: 0.5 
  },
  generatedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  reviewed: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  reviewedAt: { type: Date },
  reviewedBy: { type: String }, // mentor userId
  accepted: { 
    type: Boolean, 
    default: false 
  },
  dismissed: { type: Boolean, default: false },
  dismissReason: { type: String },
  reviewNotes: { type: String },
  applied: { 
    type: Boolean, 
    default: false 
  },
  appliedAt: { type: Date },
  // Metadata
  studentSnapshot: { type: mongoose.Schema.Types.Mixed }, // Snapshot of student data at generation time
  promptHash: { type: String },
  modelUsed: { type: String },
  tokenCostEstimate: { type: Number },
  outputHash: { type: String }
}, {
  timestamps: true
});

// Indexes for efficient queries
MentorSuggestionSchema.index({ userId: 1, generatedAt: -1 });
MentorSuggestionSchema.index({ userId: 1, reviewed: 1 });
MentorSuggestionSchema.index({ userId: 1, accepted: 1, applied: 1 });

// Virtual for days remaining
MentorSuggestionSchema.virtual('daysRemaining').get(function() {
  if (!this.plan || this.plan.length === 0) return 0;
  const lastDay = this.plan[this.plan.length - 1];
  const now = new Date();
  const daysLeft = Math.ceil((lastDay.date - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
});

// Method to check if suggestion is still active
MentorSuggestionSchema.methods.isActive = function() {
  if (this.dismissed) return false;
  if (!this.accepted) return false;
  return this.daysRemaining > 0;
};

// Static method to find pending suggestions for a user
MentorSuggestionSchema.statics.findPendingForUser = function(userId) {
  return this.find({
    userId,
    reviewed: false,
    dismissed: false
  }).sort({ generatedAt: -1 });
};

// Static method to find active plans
MentorSuggestionSchema.statics.findActivePlans = function(userId) {
  return this.find({
    userId,
    accepted: true,
    dismissed: false,
    applied: true
  }).sort({ generatedAt: -1 });
};

module.exports = mongoose.model('MentorSuggestion', MentorSuggestionSchema);
