const mongoose = require('mongoose');

// Schema for individual course internal marks
const courseInternalSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  attendancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  ia1: {
    type: Number,
    min: 0,
    max: 15,
    default: 0
  },
  ia2: {
    type: Number,
    min: 0,
    max: 15,
    default: 0
  },
  ia3: {
    type: Number,
    min: 0,
    max: 15,
    default: 0
  },
  lab: {
    type: Number,
    min: 0,
    max: 25,
    default: 0
  },
  other: {
    type: Number,
    min: 0,
    max: 25,
    default: 0
  },
  totalInternal: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  }
}, { _id: false });

// Main schema for semester internal marks
const internalMarksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  courses: [courseInternalSchema],
  mentorName: {
    type: String,
    trim: true,
    default: ''
  },
  feesToBePaid: {
    type: Number,
    default: 0
  },
  feesPaid: {
    type: Number,
    default: 0
  },
  receiptNo: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Compound unique index to ensure one document per user per semester
internalMarksSchema.index({ userId: 1, semester: 1 }, { unique: true });

// Pre-save hook to calculate total internal marks for each course
internalMarksSchema.pre('save', function(next) {
  if (this.courses && this.courses.length > 0) {
    this.courses.forEach(course => {
      // Calculate total internal: Best 2 of (IA1, IA2, IA3) * 0.4 + Lab * 0.3 + Other * 0.3
      const iaMarks = [course.ia1 || 0, course.ia2 || 0, course.ia3 || 0].sort((a, b) => b - a);
      const best2IAs = iaMarks[0] + iaMarks[1];
      const iaContribution = (best2IAs / 30) * 20; // Best 2 IAs out of 30, scaled to 20 marks
      const labContribution = ((course.lab || 0) / 25) * 15; // Lab out of 25, scaled to 15 marks
      const otherContribution = ((course.other || 0) / 25) * 15; // Other out of 25, scaled to 15 marks
      
      course.totalInternal = Math.round((iaContribution + labContribution + otherContribution) * 100) / 100;
    });
  }
  next();
});

// Static method to get or create semester document
internalMarksSchema.statics.getOrCreate = async function(userId, semester) {
  let doc = await this.findOne({ userId, semester });
  if (!doc) {
    doc = await this.create({
      userId,
      semester,
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      courses: []
    });
  }
  return doc;
};

// Static method to get all semesters for a user
internalMarksSchema.statics.getAllSemestersForUser = async function(userId) {
  return await this.find({ userId }).sort({ semester: 1 });
};

// Instance method to add or update a course
internalMarksSchema.methods.addOrUpdateCourse = function(courseData) {
  const existingIndex = this.courses.findIndex(c => c.courseCode === courseData.courseCode);
  
  if (existingIndex >= 0) {
    // Update existing course
    this.courses[existingIndex] = { ...this.courses[existingIndex].toObject(), ...courseData };
  } else {
    // Add new course
    this.courses.push(courseData);
  }
  
  return this.save();
};

// Instance method to delete a course
internalMarksSchema.methods.deleteCourse = function(courseCode) {
  this.courses = this.courses.filter(c => c.courseCode !== courseCode);
  return this.save();
};

const InternalMarks = mongoose.model('InternalMarks', internalMarksSchema);

module.exports = InternalMarks;
