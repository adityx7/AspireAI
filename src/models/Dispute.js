const mongoose = require('mongoose');

// Student Dispute Schema
const disputeSchema = new mongoose.Schema({
    studentId: { 
        type: String, 
        required: true,
        index: true 
    },
    studentUsn: { type: String, required: true },
    studentName: { type: String, required: true },
    
    semester: { type: Number, required: true },
    courseCode: String,
    courseName: String,
    
    section: { 
        type: String, 
        required: true,
        enum: ['marks', 'attendance', 'grade', 'credits', 'other']
    },
    
    disputeType: {
        type: String,
        required: true,
        enum: ['incorrect_marks', 'incorrect_attendance', 'missing_marks', 'grade_mismatch', 'other']
    },
    
    message: { type: String, required: true },
    attachments: [String], // URLs to uploaded documents
    
    reportedAt: { type: Date, default: Date.now },
    
    status: { 
        type: String, 
        enum: ['pending', 'under_review', 'resolved', 'rejected'], 
        default: 'pending',
        index: true
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    assignedTo: {
        adminId: String,
        adminName: String,
        assignedAt: Date
    },
    
    resolution: {
        resolvedBy: {
            userId: String,
            name: String,
            role: String
        },
        comment: String,
        action: String, // 'corrected', 'no_action_needed', 'escalated'
        resolvedAt: Date
    },
    
    comments: [{
        userId: String,
        userName: String,
        role: String,
        comment: String,
        timestamp: { type: Date, default: Date.now }
    }],
    
    relatedDocuments: {
        semesterRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSemester' },
        auditLogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdminAction' }]
    },
    
    notificationsSent: [{
        recipientId: String,
        recipientRole: String,
        notificationType: String,
        sentAt: Date
    }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
disputeSchema.index({ studentId: 1, status: 1 });
disputeSchema.index({ semester: 1, status: 1 });
disputeSchema.index({ 'assignedTo.adminId': 1, status: 1 });
disputeSchema.index({ createdAt: -1 });

// Check if model already exists to avoid OverwriteModelError
const Dispute = mongoose.models.Dispute || mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
