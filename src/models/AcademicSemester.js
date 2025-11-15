const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  slNo: {
    type: Number,
    required: true
  },
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
  attendancePercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  ia1: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  ia2: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  ia3: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  labMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  otherMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalInternal: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  externalMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  total: {
    type: Number,
    default: 0,
    min: 0,
    max: 200
  },
  letterGrade: {
    type: String,
    default: '',
    enum: ['', 'S', 'A', 'B', 'C', 'D', 'E', 'F']
  },
  gradePoints: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  credits: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
}, { _id: false });

const academicSemesterSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
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
    match: /^\d{4}-\d{4}$/,
    default: () => {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${currentYear + 1}`;
    }
  },
  mentorId: {
    type: String,
    default: null
  },
  courses: {
    type: [courseSchema],
    default: []
  },
  sgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  }
}, {
  timestamps: true
});

// Compound index to ensure one document per user per semester
academicSemesterSchema.index({ userId: 1, semester: 1 }, { unique: true });

// Virtual for computed fields
academicSemesterSchema.virtual('courseCount').get(function() {
  return this.courses.length;
});

// Pre-save hook to compute totalInternal, total, letterGrade, and gradePoints for each course
academicSemesterSchema.pre('save', function(next) {
  this.courses.forEach(course => {
    // Compute totalInternal (average of best 2 IAs + lab + other)
    const iaScores = [course.ia1, course.ia2, course.ia3].sort((a, b) => b - a);
    const avgIA = (iaScores[0] + iaScores[1]) / 2;
    course.totalInternal = Math.round(avgIA * 0.4 + course.labMarks * 0.3 + course.otherMarks * 0.3);
    
    // Compute total
    course.total = course.totalInternal + course.externalMarks;
    
    // Compute letter grade based on total percentage
    const percentage = (course.total / 200) * 100;
    if (percentage >= 90) {
      course.letterGrade = 'S';
      course.gradePoints = 10;
    } else if (percentage >= 80) {
      course.letterGrade = 'A';
      course.gradePoints = 9;
    } else if (percentage >= 70) {
      course.letterGrade = 'B';
      course.gradePoints = 8;
    } else if (percentage >= 60) {
      course.letterGrade = 'C';
      course.gradePoints = 7;
    } else if (percentage >= 50) {
      course.letterGrade = 'D';
      course.gradePoints = 6;
    } else if (percentage >= 40) {
      course.letterGrade = 'E';
      course.gradePoints = 5;
    } else {
      course.letterGrade = 'F';
      course.gradePoints = 0;
    }
  });
  next();
});

// Method to compute SGPA for this semester
academicSemesterSchema.methods.computeSGPA = function() {
  if (this.courses.length === 0) {
    this.sgpa = 0;
    return 0;
  }
  
  let totalCredits = 0;
  let weightedSum = 0;
  
  this.courses.forEach(course => {
    totalCredits += course.credits;
    weightedSum += course.gradePoints * course.credits;
  });
  
  this.sgpa = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0;
  return this.sgpa;
};

// Static method to get all semesters for a user
academicSemesterSchema.statics.getAllSemestersForUser = async function(userId) {
  return this.find({ userId }).sort({ semester: 1 });
};

// Static method to get or create a semester document
academicSemesterSchema.statics.getOrCreate = async function(userId, semester, academicYear) {
  let semesterDoc = await this.findOne({ userId, semester });
  if (!semesterDoc) {
    semesterDoc = new this({ userId, semester, academicYear });
    await semesterDoc.save();
  }
  return semesterDoc;
};

const AcademicSemester = mongoose.model('AcademicSemester', academicSemesterSchema);

module.exports = AcademicSemester;
