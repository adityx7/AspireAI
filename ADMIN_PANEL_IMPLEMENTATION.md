# 🔐 AspireAI Admin Panel - Complete Implementation Guide

## 📋 Overview

This implementation adds a full-featured Admin Panel to AspireAI that allows department admins/HODs to manage student academic records with complete audit trails, notifications, and RBAC.

## 🎯 Features Delivered

### ✅ Phase 1: Core Backend (COMPLETED)
- ✅ Admin, AdminAction, Dispute models with full schema
- ✅ Enhanced AcademicSemester model with audit trails
- ✅ Authentication & RBAC middleware (JWT-based)
- ✅ Permission-based access control
- ✅ Admin controller with CRUD operations
- ✅ Admin routes with role guards
- ✅ Automatic SGPA/CGPA computation
- ✅ Change tracking and audit logging
- ✅ Automatic student notifications

### 🚧 Phase 2: Extended Backend (ARCHITECTURE PROVIDED)
Files created but need integration:
- Bulk upload controller (CSV/Excel support)
- Attendance management endpoints
- Dispute resolution system
- Advanced audit queries
- Migration scripts

### 🚧 Phase 3: Frontend (ARCHITECTURE PROVIDED)
React components architecture defined:
- AdminDashboard, AdminStudentsList, AdminStudentDetail
- SemesterEditor, CourseEditor, AttendanceEditor
- BulkUploadMarks, AdminAuditLog, DisputeManager
- Student read-only views with dispute filing

---

## 🏗️ Database Schema

### 1. Admin Model (`src/models/Admin.js`)
```javascript
{
  fullName: String,
  employeeId: String (unique),
  email: String (unique),
  password: String (hashed),
  role: enum['admin', 'hod', 'coordinator'],
  department: String,
  permissions: [String] // manage_marks, manage_attendance, bulk_upload, etc.
  isActive: Boolean,
  lastLogin: Date
}
```

### 2. AcademicSemesterEnhanced Model (`src/models/AcademicSemesterEnhanced.js`)
```javascript
{
  userId: String,
  usn: String,
  semester: Number (1-8),
  academicYear: String,
  courses: [{
    courseCode, courseName, credits,
    ia1, ia2, ia3, labMarks, // Internal marks
    internalTotal, // Computed (best 2 of 3 IAs)
    externalMarks, // Sem-end marks
    total, letterGrade, gradePoints, // Computed
    attendancePercent, attendedClasses, totalClasses,
    lastModifiedBy: { userId, role, name, timestamp }
  }],
  sgpa, // Computed
  overallAttendance, // Computed
  lastModifiedBy: { userId, role, name, timestamp },
  lastModifiedHistory: [{
    changedBy: { userId, role, name },
    changes: [{ fieldPath, oldValue, newValue, delta }],
    reason: String,
    timestamp: Date
  }],
  verifiedBy: { adminId, adminName, timestamp },
  isVerified: Boolean
}
```

### 3. AdminAction Model (`src/models/AdminAction.js`)
```javascript
{
  adminId, adminName, adminRole,
  studentId, studentUsn, studentName,
  semester: Number,
  actionType: enum[create_semester, update_marks, update_attendance, ...],
  changes: [{ fieldPath, courseCode, oldValue, newValue, delta }],
  reason: String,
  metadata: { ipAddress, userAgent, bulkUploadFile },
  status: enum[success, failed, partial],
  notificationSent: Boolean,
  timestamp: Date
}
```

### 4. Dispute Model (`src/models/Dispute.js`)
```javascript
{
  studentId, studentUsn, studentName,
  semester, courseCode, courseName,
  section: enum[marks, attendance, grade, credits, other],
  disputeType: enum[incorrect_marks, incorrect_attendance, ...],
  message: String,
  status: enum[pending, under_review, resolved, rejected],
  assignedTo: { adminId, adminName },
  resolution: { resolvedBy, comment, action, resolvedAt },
  comments: [{ userId, userName, role, comment, timestamp }]
}
```

---

## 🔐 Authentication & Authorization

### Role Hierarchy
1. **student**: Read-only access to own records, can file disputes
2. **mentor**: Read access to mentees (future enhancement)
3. **admin/hod/coordinator**: Full access to manage marks, attendance, disputes

### Middleware Usage

```javascript
// Protect route - require authentication
router.use(authenticate);

// Require admin role
router.use(adminOnly);

// Require specific permission
router.put('/marks', requirePermission('manage_marks'), controller.updateMarks);

// Log admin action
router.post('/bulk', logAdminAction('bulk_upload'), controller.bulkUpload);
```

### JWT Token Structure
```javascript
{
  userId: "EMP001" or "1BG21CS091",
  role: "admin" or "student",
  email: "admin@bnmit.in",
  name: "Dr. Admin",
  exp: <expiration>
}
```

---

## 🚀 API Endpoints

### Admin Authentication
```bash
POST /api/admin/login
Body: { employeeId, password }
Response: { success, token, admin: { fullName, role, permissions } }
```

### Student Management
```bash
# Get students list (paginated)
GET /api/admin/students?page=1&limit=20&branch=CSE&semester=5&search=aditya
Response: { success, data: { students: [...], pagination: {...} } }

# Get student's all semester records
GET /api/admin/students/:id/academics
Response: { success, data: { semesters: [...], summary: { cgpa, totalCredits } } }

# Get specific semester
GET /api/admin/students/:id/academics/:semester
Response: { success, data: { semester record } }
```

### Marks Management
```bash
# Update entire semester
PUT /api/admin/students/:id/academics/:semester
Headers: Authorization: Bearer <token>
Body: {
  courses: [{
    courseCode: "18CS51",
    ia1: 25, ia2: 28, ia3: 27,
    labMarks: 45,
    externalMarks: 85,
    attendancePercent: 92
  }],
  reason: "Marks entry for Mid-sem exams"
}
Response: { success, message, data, audit: { changesCount, notificationSent } }

# Update single course
PATCH /api/admin/students/:id/academics/:semester/courses/:courseId
Body: {
  ia1: 25,
  ia2: 28,
  attendancePercent: 90,
  reason: "IA1 and IA2 correction"
}
Response: { success, message, data, changes: [...] }
```

### Effects of Update:
1. ✅ Marks validated and saved
2. ✅ Internal total computed (best 2 of 3 IAs)
3. ✅ Letter grade computed
4. ✅ SGPA recomputed
5. ✅ CGPA recomputed (across all semesters)
6. ✅ Audit log created in AdminAction
7. ✅ Notification sent to student
8. ✅ Change history appended

---

## 📊 Automatic Computations

### Internal Marks Formula
```javascript
// Best 2 of 3 IAs (each out of 30) scaled to 20 marks
const iaScores = [ia1, ia2, ia3].sort((a,b) => b-a);
const bestTwoIA = iaScores[0] + iaScores[1];
const iaMarks = (bestTwoIA / 60) * 20; // Out of 20

// Lab marks scaled to 30
const labScaled = (labMarks / 50) * 30;

// Total internal = 50
internalTotal = iaMarks + labScaled;
```

### Letter Grade & Grade Points
```javascript
const percentage = internalTotal + (externalMarks * 0.5);

if (percentage >= 90) { grade = 'S', points = 10 }
else if (percentage >= 80) { grade = 'A', points = 9 }
else if (percentage >= 70) { grade = 'B', points = 8 }
else if (percentage >= 60) { grade = 'C', points = 7 }
else if (percentage >= 50) { grade = 'D', points = 6 }
else if (percentage >= 40) { grade = 'E', points = 5 }
else { grade = 'F', points = 0 }
```

### SGPA Calculation
```javascript
SGPA = Σ(gradePoints × credits) / Σ(credits)
```

### CGPA Calculation
```javascript
CGPA = Σ(SGPA × semesterCredits) / Σ(semesterCredits)
```

---

## 🔔 Notification System Integration

### When Admin Updates Marks:
```javascript
// Automatic notification created
{
  userId: "1BG21CS091",
  type: "semester_performance",
  title: "📊 Academic Record Updated",
  body: "Your semester 5 marks have been updated by admin. Please review.",
  priority: "high", // if changes > 5 or CGPA delta > 0.2
  payload: {
    semester: 5,
    changesCount: 8,
    actionUrl: "/academics/semester/5",
    actionLabel: "View Details"
  }
}
```

### Notification shows in:
- Bell icon dropdown
- Notification center page
- Email (if student opted in)

---

## 🛡️ Security & Data Integrity

### Input Validation
```javascript
// All marks validated
ia1, ia2, ia3: min 0, max 30
labMarks: min 0, max 50
externalMarks: min 0, max 100
attendancePercent: min 0, max 100
```

### Transaction Support
```javascript
// Multiple documents updated atomically
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Update semester
  // Recompute CGPA
  // Create audit log
  // Send notification
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

### Rate Limiting
```javascript
// Prevent bulk endpoint abuse
const rateLimit = require('express-rate-limit');

const bulkUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // 10 uploads per 15 min
});

router.post('/bulk-upload', bulkUploadLimiter, controller.bulkUpload);
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
```javascript
// test/computations.test.js
describe('SGPA Computation', () => {
  test('should compute SGPA correctly', () => {
    const semester = {
      courses: [
        { gradePoints: 9, credits: 4 },
        { gradePoints: 8, credits: 3 },
        { gradePoints: 10, credits: 4 }
      ]
    };
    semester.computeSGPA();
    expect(semester.sgpa).toBe('9.09');
  });
});
```

### Integration Tests
```javascript
// test/admin.integration.test.js
describe('Admin Updates Marks', () => {
  test('should update, compute, log, and notify', async () => {
    const response = await request(app)
      .put('/api/admin/students/1BG21CS091/academics/5')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ courses: [...], reason: 'Test update' });
    
    expect(response.status).toBe(200);
    expect(response.body.audit.notificationSent).toBe(true);
    
    // Verify audit log created
    const audit = await AdminAction.findOne({ 
      studentUsn: '1BG21CS091' 
    });
    expect(audit).toBeTruthy();
    
    // Verify notification created
    const notification = await Notification.findOne({
      userId: '1BG21CS091'
    });
    expect(notification).toBeTruthy();
  });
});
```

### Authorization Tests
```javascript
describe('RBAC Tests', () => {
  test('student cannot call admin endpoint', async () => {
    const response = await request(app)
      .put('/api/admin/students/1BG21CS091/academics/5')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courses: [] });
    
    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Access denied');
  });
});
```

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install jsonwebtoken bcryptjs express-rate-limit
```

### 2. Environment Variables
Add to `.env`:
```bash
JWT_SECRET=your-secret-key-here
ADMIN_MARKS_ENABLED=true
NODE_ENV=development
```

### 3. Create Admin Account
```bash
node scripts/create_admin.js --employeeId EMP001 --name "Dr. Admin" --email admin@bnmit.in --password admin123 --department CSE --permissions manage_marks,manage_attendance,bulk_upload
```

### 4. Run Migration (if needed)
```bash
# Dry run first
node scripts/migrate_to_enhanced_schema.js --dry-run

# Apply migration
node scripts/migrate_to_enhanced_schema.js --apply
```

### 5. Start Server
```bash
npm start
```

### 6. Test Admin Login
```bash
curl -X POST http://localhost:5002/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","password":"admin123"}'
```

---

## 🎨 Frontend Integration (Next Steps)

### Student View (Read-Only)
```jsx
// SemesterMarksPage.jsx - Student view
const isAdmin = user.role === 'admin';

<TextField
  value={course.ia1}
  disabled={!isAdmin} // Students cannot edit
  InputProps={{
    readOnly: !isAdmin
  }}
/>

{!isAdmin && (
  <Button onClick={openDisputeModal}>
    Report Discrepancy
  </Button>
)}
```

### Admin View (Editable)
```jsx
// AdminSemesterEditor.jsx
const [courses, setCourses] = useState(semester.courses);
const [hasChanges, setHasChanges] = useState(false);

const handleCourseChange = (index, field, value) => {
  const updated = [...courses];
  updated[index][field] = value;
  setCourses(updated);
  setHasChanges(true);
};

const handleSave = async () => {
  const response = await axios.put(
    `/api/admin/students/${studentId}/academics/${semester}`,
    {
      courses,
      reason: reasonInput
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  if (response.data.success) {
    toast.success('Marks updated successfully!');
    // Show audit summary
  }
};
```

---

## 📝 Usage Examples

### Example 1: Admin Updates IA Marks
```bash
# Admin logs in
curl -X POST http://localhost:5002/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","password":"admin123"}'

# Response: { token: "eyJhbG..." }

# Update marks
curl -X PATCH http://localhost:5002/api/admin/students/1BG21CS091/academics/5/courses/18CS51 \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "ia1": 28,
    "ia2": 27,
    "reason": "IA1 and IA2 marks entry"
  }'

# Student receives notification automatically
# Audit log created
# SGPA recomputed
```

### Example 2: Student Files Dispute
```bash
curl -X POST http://localhost:5002/api/students/1BG21CS091/report-discrepancy \
  -H "Authorization: Bearer <student-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "semester": 5,
    "courseCode": "18CS51",
    "section": "marks",
    "disputeType": "incorrect_marks",
    "message": "My IA2 marks shown as 20 but I scored 25"
  }'

# Admin receives notification
# Dispute appears in admin dashboard
```

---

## 🔄 Migration from Old Schema

If you have existing marks data in a different format:

```bash
# Run migration script
node scripts/migrate_marks_to_semester_docs.js

# Script will:
# 1. Backup existing data to backups/ folder
# 2. Transform to new schema
# 3. Validate all records
# 4. Create semester documents
# 5. Generate migration report
```

---

## 🚨 Rollback Procedure

If something goes wrong:

```bash
# Restore from backup
node scripts/rollback_migration.js --backup-id <timestamp>

# Or restore specific student
node scripts/rollback_student.js --usn 1BG21CS091 --backup-id <timestamp>
```

---

## 📊 Monitoring & Audit

### View Recent Admin Actions
```bash
curl http://localhost:5002/api/admin/audit-log?limit=50&actionType=update_marks
```

### View Specific Student's Change History
```bash
curl http://localhost:5002/api/admin/students/1BG21CS091/audit-history
```

### Generate Report
```bash
curl http://localhost:5002/api/admin/reports/monthly?month=11&year=2024
```

---

## 🎯 Implementation Status

### ✅ Completed (Backend Core)
- Models with full validation
- Authentication & RBAC middleware
- Core CRUD endpoints
- Auto-computation logic
- Audit logging
- Notification integration

### 🚧 In Progress (Additional Files Created)
- Bulk upload controller
- Dispute resolution system
- Advanced queries
- Migration scripts
- Comprehensive tests

### 📋 TODO (Frontend)
- Admin dashboard UI
- Semester editor component
- Student read-only views
- Dispute filing UI
- Bulk upload interface
- Audit log viewer

---

## 📞 Support

For issues or questions:
- Check server logs: `tail -f server.log`
- Check MongoDB: `mongosh` → `use mentorship_platform`
- Run diagnostics: `npm run diagnose`

---

**Implementation Date**: November 17, 2025  
**Version**: 1.0.0  
**Status**: Core Backend Complete, Frontend Architecture Defined
