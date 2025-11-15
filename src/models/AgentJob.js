const mongoose = require('mongoose');

const AgentJobSchema = new mongoose.Schema({
  jobId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: ['mentorAgent', 'careerPlanner', 'adhoc'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['queued', 'processing', 'completed', 'failed', 'retrying'],
    default: 'queued',
    index: true 
  },
  priority: { 
    type: Number, 
    default: 0 
  },
  attempt: { 
    type: Number, 
    default: 1 
  },
  maxAttempts: { 
    type: Number, 
    default: 2 
  },
  startedAt: { type: Date },
  finishedAt: { type: Date },
  durationMs: { type: Number },
  error: { type: String },
  errorStack: { type: String },
  result: { type: mongoose.Schema.Types.Mixed },
  // Metadata
  triggeredBy: { 
    type: String, 
    enum: ['scheduler', 'manual', 'data-change', 'api'],
    default: 'manual' 
  },
  forced: { 
    type: Boolean, 
    default: false 
  },
  inputHash: { type: String },
  outputSuggestionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MentorSuggestion' 
  }
}, {
  timestamps: true
});

// Indexes for monitoring and queries
AgentJobSchema.index({ userId: 1, createdAt: -1 });
AgentJobSchema.index({ status: 1, createdAt: 1 });
AgentJobSchema.index({ type: 1, status: 1 });

// Method to mark job as started
AgentJobSchema.methods.markStarted = function() {
  this.status = 'processing';
  this.startedAt = new Date();
  return this.save();
};

// Method to mark job as completed
AgentJobSchema.methods.markCompleted = function(suggestionId) {
  this.status = 'completed';
  this.finishedAt = new Date();
  this.durationMs = this.finishedAt - this.startedAt;
  this.outputSuggestionId = suggestionId;
  return this.save();
};

// Method to mark job as failed
AgentJobSchema.methods.markFailed = function(error) {
  this.status = 'failed';
  this.finishedAt = new Date();
  this.durationMs = this.finishedAt - this.startedAt;
  this.error = error.message || String(error);
  this.errorStack = error.stack;
  return this.save();
};

// Method to retry job
AgentJobSchema.methods.retry = function() {
  if (this.attempt >= this.maxAttempts) {
    return this.markFailed(new Error('Max retry attempts reached'));
  }
  this.attempt += 1;
  this.status = 'retrying';
  this.error = null;
  this.errorStack = null;
  return this.save();
};

// Static method for metrics
AgentJobSchema.statics.getMetrics = async function(startDate, endDate) {
  const match = { createdAt: { $gte: startDate, $lte: endDate } };
  
  const metrics = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { type: '$type', status: '$status' },
        count: { $sum: 1 },
        avgDuration: { $avg: '$durationMs' }
      }
    }
  ]);

  return metrics;
};

// Static method to find recent jobs for user
AgentJobSchema.statics.findRecentForUser = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-errorStack -result');
};

// Static method to check rate limit
AgentJobSchema.statics.canEnqueueJob = async function(userId, type, hoursWindow = 6) {
  const cutoffTime = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);
  
  const recentJob = await this.findOne({
    userId,
    type,
    createdAt: { $gte: cutoffTime },
    status: { $in: ['queued', 'processing', 'completed'] }
  }).sort({ createdAt: -1 });

  return !recentJob;
};

module.exports = mongoose.model('AgentJob', AgentJobSchema);
