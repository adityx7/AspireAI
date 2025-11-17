const mongoose = require('mongoose');

// Admin Action Audit Log Schema
const adminActionSchema = new mongoose.Schema({
    adminId: { 
        type: String, 
        required: true,
        index: true 
    },
    adminName: { type: String, required: true },
    adminRole: { type: String, required: true },
    
    studentId: { 
        type: String, 
        required: true,
        index: true 
    },
    studentUsn: { type: String, required: true },
    studentName: { type: String },
    
    semester: { type: Number },
    
    actionType: { 
        type: String, 
        required: true,
        enum: [
            'create_semester',
            'update_marks',
            'update_attendance',
            'update_course',
            'bulk_upload',
            'verify_semester',
            'resolve_dispute',
            'delete_record'
        ]
    },
    
    changes: [{
        fieldPath: { type: String, required: true },
        courseCode: String,
        courseName: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        delta: mongoose.Schema.Types.Mixed // For numeric fields
    }],
    
    reason: { type: String },
    
    metadata: {
        ipAddress: String,
        userAgent: String,
        bulkUploadFile: String,
        affectedStudentsCount: Number,
        errors: [String]
    },
    
    status: { 
        type: String, 
        enum: ['success', 'failed', 'partial'], 
        default: 'success' 
    },
    
    notificationSent: { type: Boolean, default: false },
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
    
    timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Compound indexes
adminActionSchema.index({ adminId: 1, timestamp: -1 });
adminActionSchema.index({ studentId: 1, timestamp: -1 });
adminActionSchema.index({ actionType: 1, timestamp: -1 });
adminActionSchema.index({ semester: 1, timestamp: -1 });

// TTL index - keep audit logs for 2 years
adminActionSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

// Check if model already exists to avoid OverwriteModelError
const AdminAction = mongoose.models.AdminAction || mongoose.model('AdminAction', adminActionSchema);

module.exports = AdminAction;
