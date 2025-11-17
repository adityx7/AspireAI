const mongoose = require('mongoose');

// Schema for individual section verification
const sectionVerificationSchema = new mongoose.Schema({
  verified: {
    type: Boolean,
    default: false
  },
  remark: {
    type: String,
    default: '',
    trim: true
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String, // Mentor name
    default: ''
  }
}, { _id: false });

// Main schema for student verification status
const studentVerificationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  mentorId: {
    type: String,
    required: true,
    trim: true
  },
  mentorName: {
    type: String,
    default: ''
  },
  sections: {
    personal: sectionVerificationSchema,
    academics: sectionVerificationSchema,
    attendance: sectionVerificationSchema,
    internalAssessments: sectionVerificationSchema,
    selfAssessmentStart: sectionVerificationSchema,
    selfAssessmentEnd: sectionVerificationSchema,
    personalityDevelopment: sectionVerificationSchema,
    aictePoints: sectionVerificationSchema,
    certificates: sectionVerificationSchema,
    achievements: sectionVerificationSchema,
    meetings: sectionVerificationSchema,
    career: sectionVerificationSchema
  },
  overallStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  locked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one verification document per student-mentor pair
studentVerificationSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

// Method to calculate verification progress
studentVerificationSchema.methods.calculateProgress = function() {
  const sections = Object.keys(this.sections);
  const verifiedCount = sections.filter(key => this.sections[key].verified).length;
  const totalCount = sections.length;
  
  return {
    verified: verifiedCount,
    total: totalCount,
    percentage: Math.round((verifiedCount / totalCount) * 100)
  };
};

// Method to update overall status based on section verifications
studentVerificationSchema.methods.updateOverallStatus = function() {
  const progress = this.calculateProgress();
  
  if (progress.verified === 0) {
    this.overallStatus = 'pending';
  } else if (progress.verified === progress.total) {
    this.overallStatus = 'completed';
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.overallStatus = 'partial';
  }
};

// Static method to get or create verification document
studentVerificationSchema.statics.getOrCreate = async function(studentId, mentorId, mentorName = '') {
  let verification = await this.findOne({ studentId, mentorId });
  
  if (!verification) {
    verification = await this.create({
      studentId,
      mentorId,
      mentorName,
      sections: {
        personal: { verified: false },
        academics: { verified: false },
        attendance: { verified: false },
        internalAssessments: { verified: false },
        selfAssessmentStart: { verified: false },
        selfAssessmentEnd: { verified: false },
        personalityDevelopment: { verified: false },
        aictePoints: { verified: false },
        certificates: { verified: false },
        achievements: { verified: false },
        meetings: { verified: false },
        career: { verified: false }
      }
    });
  }
  
  return verification;
};

const StudentVerification = mongoose.model('StudentVerification', studentVerificationSchema);

module.exports = StudentVerification;
