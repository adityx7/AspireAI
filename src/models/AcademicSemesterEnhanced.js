const mongoose = require('mongoose');

// Enhanced Academic Semester Schema with Admin Controls
const academicSemesterSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        index: true 
    },
    usn: { 
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
        required: true 
    },
    
    courses: [{
        courseCode: { type: String, required: true },
        courseName: { type: String, required: true },
        credits: { type: Number, required: true, min: 0, max: 10 },
        
        // Internal Assessment Marks
        ia1: { type: Number, default: 0, min: 0, max: 30 },
        ia2: { type: Number, default: 0, min: 0, max: 30 },
        ia3: { type: Number, default: 0, min: 0, max: 30 },
        labMarks: { type: Number, default: 0, min: 0, max: 50 },
        
        // Computed Internal Total (Best 2 of 3 IAs + Lab)
        internalTotal: { type: Number, default: 0, min: 0, max: 50 },
        
        // External/Semester End Marks
        externalMarks: { type: Number, default: 0, min: 0, max: 100 },
        
        // Total marks (internal + external scaled appropriately)
        total: { type: Number, default: 0, min: 0, max: 100 },
        
        // Grading
        letterGrade: { 
            type: String, 
            enum: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'P', 'NP', ''], 
            default: '' 
        },
        gradePoints: { type: Number, default: 0, min: 0, max: 10 },
        
        // Subject-specific attendance
        attendancePercent: { type: Number, default: 0, min: 0, max: 100 },
        attendedClasses: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 },
        
        // Status
        status: { 
            type: String, 
            enum: ['ongoing', 'completed', 'failed', 'detained'], 
            default: 'ongoing' 
        },
        
        // Admin metadata
        lastModifiedBy: {
            userId: String,
            role: String,
            name: String,
            timestamp: Date
        }
    }],
    
    // Semester-level metrics
    sgpa: { type: Number, default: 0, min: 0, max: 10 },
    totalCreditsEarned: { type: Number, default: 0 },
    overallAttendance: { type: Number, default: 0, min: 0, max: 100 },
    
    // Semester status
    status: { 
        type: String, 
        enum: ['ongoing', 'completed', 'detained'], 
        default: 'ongoing' 
    },
    
    // Admin audit trail
    lastModifiedBy: {
        userId: { type: String },
        role: { type: String },
        name: { type: String },
        timestamp: { type: Date, default: Date.now }
    },
    
    lastModifiedHistory: [{
        changedBy: {
            userId: String,
            role: String,
            name: String
        },
        changes: [{
            fieldPath: String,
            oldValue: mongoose.Schema.Types.Mixed,
            newValue: mongoose.Schema.Types.Mixed,
            courseCode: String // For course-specific changes
        }],
        reason: String,
        timestamp: { type: Date, default: Date.now }
    }],
    
    // Verification status
    verifiedBy: {
        adminId: String,
        adminName: String,
        timestamp: Date
    },
    isVerified: { type: Boolean, default: false },
    
    // Dispute tracking
    hasDispute: { type: Boolean, default: false },
    disputeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound indexes for efficient queries
academicSemesterSchema.index({ userId: 1, semester: 1 });
academicSemesterSchema.index({ usn: 1, semester: 1 });
academicSemesterSchema.index({ academicYear: 1, semester: 1 });

// Pre-save middleware to compute totals
academicSemesterSchema.pre('save', function(next) {
    // Compute internal total, letter grades, and SGPA
    this.computeInternalTotals();
    this.computeLetterGrades();
    this.computeSGPA();
    this.updatedAt = Date.now();
    next();
});

// Methods
academicSemesterSchema.methods.computeInternalTotals = function() {
    this.courses.forEach(course => {
        // Best 2 of 3 IAs
        const iaScores = [course.ia1 || 0, course.ia2 || 0, course.ia3 || 0].sort((a, b) => b - a);
        const bestTwoIA = iaScores[0] + iaScores[1];
        
        // Internal = (Best 2 IAs) / 3 * 20 + Lab marks (scaled if needed)
        // Assuming standard scheme: 20 marks internal from IAs, 30 from lab
        course.internalTotal = Math.round((bestTwoIA / 60) * 20 + (course.labMarks || 0) * 0.6);
        
        // Total = internal + external (scaled to 100)
        course.total = course.internalTotal + (course.externalMarks || 0) * 0.5;
    });
};

academicSemesterSchema.methods.computeLetterGrades = function() {
    this.courses.forEach(course => {
        const percentage = course.total;
        
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
};

academicSemesterSchema.methods.computeSGPA = function() {
    let totalCredits = 0;
    let weightedSum = 0;
    
    this.courses.forEach(course => {
        if (course.gradePoints > 0) {
            totalCredits += course.credits;
            weightedSum += course.gradePoints * course.credits;
        }
    });
    
    this.sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
    this.totalCreditsEarned = totalCredits;
    
    // Compute overall attendance
    const attendanceSum = this.courses.reduce((sum, c) => sum + (c.attendancePercent || 0), 0);
    this.overallAttendance = this.courses.length > 0 
        ? Math.round(attendanceSum / this.courses.length) 
        : 0;
};

// Check if model already exists to avoid OverwriteModelError
const AcademicSemester = mongoose.models.AcademicSemester || mongoose.model('AcademicSemester', academicSemesterSchema);

module.exports = AcademicSemester;
