#!/usr/bin/env node

/**
 * Create Admin Account Script
 * Usage: node scripts/create_admin.js
 */

const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mentorship_platform';

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Parse command line arguments
        const args = process.argv.slice(2);
        const getArg = (flag) => {
            const index = args.indexOf(flag);
            return index !== -1 ? args[index + 1] : null;
        };

        const employeeId = getArg('--employeeId') || 'ADMIN001';
        const name = getArg('--name') || 'System Admin';
        const email = getArg('--email') || 'admin@aspireai.com';
        const password = getArg('--password') || 'admin123';
        const department = getArg('--department') || 'CSE';
        const role = getArg('--role') || 'admin';
        const permissions = getArg('--permissions')?.split(',') || [
            'manage_marks',
            'manage_attendance',
            'view_reports',
            'manage_disputes',
            'bulk_upload'
        ];

        // Check if admin already exists
        const existing = await Admin.findOne({ 
            $or: [{ employeeId }, { email }] 
        });

        if (existing) {
            console.log('⚠️  Admin already exists:');
            console.log('   Employee ID:', existing.employeeId);
            console.log('   Email:', existing.email);
            console.log('\nUpdate admin? (This will reset password)');
            
            // Update existing admin
            existing.fullName = name;
            existing.password = await bcrypt.hash(password, 10);
            existing.role = role;
            existing.department = department;
            existing.permissions = permissions;
            existing.isActive = true;
            await existing.save();
            
            console.log('✅ Admin updated successfully!');
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const admin = new Admin({
                fullName: name,
                employeeId,
                email,
                password: hashedPassword,
                role,
                department,
                permissions,
                isActive: true
            });

            await admin.save();
            console.log('✅ Admin created successfully!');
        }

        console.log('\n📋 Admin Details:');
        console.log('   Employee ID:', employeeId);
        console.log('   Name:', name);
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('   Role:', role);
        console.log('   Department:', department);
        console.log('   Permissions:', permissions.join(', '));
        
        console.log('\n🔐 Login Command:');
        console.log(`curl -X POST http://localhost:5002/api/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{"employeeId":"${employeeId}","password":"${password}"}'`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
