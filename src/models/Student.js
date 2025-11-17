const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    usn: String,
    mobileNumber: String,
    alternateMobileNumber: String,
    email: String,
    collegeEmail: String,
    gender: String,
    dob: String,
    graduationYear: String,
    employeeId: String,
    selectedMajors: [],
    shortBio: String,
    
    academics: {
        semesters: [{
            semesterNumber: { type: Number, required: true },
            cgpa: { type: Number, min: 0, max: 10 },
            semesterCourses: [{
                name: { type: String, required: true },
                grade: { type: String },
                credits: { type: Number, min: 0 },
                performanceGraphData: [{
                    assessment: String,
                    marks: Number,
                    maxMarks: Number,
                    date: Date
                }]
            }],
            reflectionJournal: {
                whatDidWell: String,
                whatToImprove: String,
                goals: String,
                challenges: String,
                reflectionDate: { type: Date, default: Date.now }
            }
        }],
        overallCGPA: { type: Number, min: 0, max: 10 },
        totalCredits: { type: Number, default: 0 }
    },
    
    certifications: [{
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: Date, required: true },
        domainTags: [String],
        verificationLink: String,
        certificateImage: String
    }],
    
    aictActivityPoints: {
        currentPoints: { type: Number, default: 0 },
        targetPoints: { type: Number, default: 100 },
        activities: [{
            name: { type: String, required: true },
            type: { 
                type: String, 
                enum: ['Academic', 'Extracurricular', 'Project', 'Certification', 'Event'], 
                required: true 
            },
            points: { type: Number, required: true },
            status: { 
                type: String, 
                enum: ['Completed', 'In Progress', 'Planned'], 
                default: 'Planned' 
            },
            dateCompleted: Date,
            description: String
        }]
    },
    
    attendance: [{
        subjectName: { type: String, required: true },
        attendedClasses: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 },
        semester: Number,
        attendancePercentage: { type: Number, min: 0, max: 100 }
    }],
    
    swotAnalysis: {
        strengths: [String],
        weaknesses: [String],
        opportunities: [String],
        threats: [String],
        lastUpdated: { type: Date, default: Date.now }
    },
    
    careerInterests: [{
        field: String,
        interestLevel: { type: Number, min: 1, max: 10 },
        skills: [String],
        experience: String
    }],
    
    careerRoadmap: [{
        milestone: { type: String, required: true },
        targetDate: Date,
        status: { 
            type: String, 
            enum: ['Not Started', 'In Progress', 'Completed'], 
            default: 'Not Started' 
        },
        description: String,
        requiredSkills: [String]
    }],
    
    // For notification engine
    lastLoginDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, { strict: false, timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
