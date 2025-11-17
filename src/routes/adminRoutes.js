const express = require('express');
const router = express.Router();
const { authenticate, adminOnly, requirePermission, logAdminAction } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// ==================== STUDENT MANAGEMENT ====================

/**
 * GET /api/admin/students
 * Get paginated list of students
 * Query params: page, limit, branch, semester, search, sortBy, sortOrder
 */
router.get('/students', adminController.getStudents);

/**
 * GET /api/admin/students/:id/academics
 * Get all semester records for a student
 */
router.get('/students/:id/academics', adminController.getStudentAcademics);

/**
 * GET /api/admin/students/:id/academics/:semester
 * Get specific semester record
 */
router.get('/students/:id/academics/:semester', adminController.getSemesterRecord);

/**
 * PUT /api/admin/students/:id/academics/:semester
 * Update entire semester record
 * Requires: manage_marks permission
 * Body: { courses: [...], reason: string }
 */
router.put(
    '/students/:id/academics/:semester',
    requirePermission('manage_marks'),
    logAdminAction('update_marks'),
    adminController.updateSemesterRecord
);

/**
 * PATCH /api/admin/students/:id/academics/:semester/courses/:courseId
 * Update a single course
 * Requires: manage_marks permission
 * Body: { ia1?, ia2?, ia3?, labMarks?, externalMarks?, attendancePercent?, reason: string }
 */
router.patch(
    '/students/:id/academics/:semester/courses/:courseId',
    requirePermission('manage_marks'),
    logAdminAction('update_course'),
    adminController.updateCourseMarks
);

module.exports = router;
