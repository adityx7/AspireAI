const mongoose = require('mongoose');

// Video Call Session Schema
const videoCallSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Participants
  initiator: {
    userId: { type: String, required: true },
    userType: { type: String, enum: ['student', 'mentor'], required: true },
    name: { type: String, required: true },
    joinedAt: Date,
    leftAt: Date
  },
  
  receiver: {
    userId: { type: String, required: true },
    userType: { type: String, enum: ['student', 'mentor'], required: true },
    name: { type: String, required: true },
    joinedAt: Date,
    leftAt: Date
  },
  
  // Call details
  status: {
    type: String,
    enum: ['scheduled', 'waiting', 'ongoing', 'ended', 'cancelled', 'missed'],
    default: 'waiting'
  },
  
  scheduledTime: Date,
  startTime: Date,
  endTime: Date,
  duration: Number, // in seconds
  
  // Features used during call
  features: {
    videoEnabled: { type: Boolean, default: true },
    audioEnabled: { type: Boolean, default: true },
    screenShared: { type: Boolean, default: false },
    chatUsed: { type: Boolean, default: false },
    recordingEnabled: { type: Boolean, default: false }
  },
  
  // Chat messages during call
  chatMessages: [{
    senderId: String,
    senderName: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Recording details
  recording: {
    enabled: { type: Boolean, default: false },
    startedAt: Date,
    stoppedAt: Date,
    fileUrl: String,
    fileSize: Number, // in bytes
    duration: Number // in seconds
  },
  
  // Meeting notes (can be added after call)
  meetingNotes: {
    summary: String,
    actionItems: [String],
    addedBy: String,
    addedAt: Date
  },
  
  // Quality metrics
  qualityMetrics: {
    initiatorConnectionQuality: String, // 'excellent', 'good', 'fair', 'poor'
    receiverConnectionQuality: String,
    averageLatency: Number, // in ms
    issuesReported: [String]
  },
  
  // Metadata
  cancelledBy: String,
  cancelReason: String,
  metadata: mongoose.Schema.Types.Mixed
  
}, {
  timestamps: true,
  collection: 'video_calls'
});

// Indexes for efficient queries
videoCallSchema.index({ 'initiator.userId': 1, createdAt: -1 });
videoCallSchema.index({ 'receiver.userId': 1, createdAt: -1 });
videoCallSchema.index({ status: 1, scheduledTime: 1 });
videoCallSchema.index({ createdAt: -1 });

// Methods
videoCallSchema.methods.startCall = function() {
  this.status = 'ongoing';
  this.startTime = new Date();
  return this.save();
};

videoCallSchema.methods.endCall = function() {
  this.status = 'ended';
  this.endTime = new Date();
  if (this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  return this.save();
};

videoCallSchema.methods.addChatMessage = function(senderId, senderName, message) {
  this.chatMessages.push({
    senderId,
    senderName,
    message,
    timestamp: new Date()
  });
  this.features.chatUsed = true;
  return this.save();
};

// Static methods
videoCallSchema.statics.getCallHistory = function(userId, userType) {
  const query = userType === 'student' 
    ? { 'initiator.userId': userId }
    : { 'receiver.userId': userId };
  
  return this.find({
    $or: [
      { 'initiator.userId': userId },
      { 'receiver.userId': userId }
    ],
    status: { $in: ['ended', 'missed'] }
  })
  .sort({ createdAt: -1 })
  .limit(50);
};

videoCallSchema.statics.getUpcomingCalls = function(userId) {
  return this.find({
    $or: [
      { 'initiator.userId': userId },
      { 'receiver.userId': userId }
    ],
    status: 'scheduled',
    scheduledTime: { $gte: new Date() }
  })
  .sort({ scheduledTime: 1 });
};

const VideoCall = mongoose.model('VideoCall', videoCallSchema);

module.exports = VideoCall;
