const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'hod', 'coordinator'], 
        default: 'admin' 
    },
    department: { type: String, required: true },
    designation: { type: String },
    permissions: [{
        type: String,
        enum: ['manage_marks', 'view_students', 'manage_attendance', 'manage_disputes', 'bulk_upload', 'view_reports', 'manage_admins']
    }],
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
adminSchema.index({ employeeId: 1 }, { unique: true });
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ department: 1 });

// Check if model already exists to avoid OverwriteModelError
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

module.exports = Admin;
