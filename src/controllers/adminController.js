const AcademicSemester = require('../models/AcademicSemesterEnhanced');
const AdminAction = require('../models/AdminAction');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const Dispute = require('../models/Dispute');

/**
 * GET /api/admin/students
 * Get paginated list of students with filters
 */
const getStudents = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            branch, 
            semester, 
            search,
            sortBy = 'usn',
            sortOrder = 'asc'
        } = req.query;

        const query = {};
        
        if (branch) query['selectedMajors'] = branch;
        if (semester) query['academics.semesters.semesterNumber'] = parseInt(semester);
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { usn: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [students, total] = await Promise.all([
            Student.find(query)
                .select('name usn email selectedMajors graduationYear academics.overallCGPA')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Student.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                students,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalStudents: total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching students',
            error: error.message 
        });
    }
};

/**
 * GET /api/admin/students/:id/academics
 * Get all semester records for a student
 */
const getStudentAcademics = async (req, res) => {
    try {
        const { id } = req.params;

        const semesters = await AcademicSemester.find({ 
            $or: [{ userId: id }, { usn: id }]
        })
        .sort({ semester: 1 })
        .lean();

        if (!semesters || semesters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No academic records found for this student'
            });
        }

        // Calculate CGPA
        const totalCredits = semesters.reduce((sum, sem) => sum + (sem.totalCreditsEarned || 0), 0);
        const weightedSum = semesters.reduce((sum, sem) => 
            sum + (sem.sgpa * (sem.totalCreditsEarned || 0)), 0
        );
        const cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                semesters,
                summary: {
                    cgpa,
                    totalCredits,
                    completedSemesters: semesters.filter(s => s.status === 'completed').length
                }
            }
        });
    } catch (error) {
        console.error('Error fetching academics:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching academic records',
            error: error.message 
        });
    }
};

/**
 * GET /api/admin/students/:id/academics/:semester
 * Get specific semester record
 */
const getSemesterRecord = async (req, res) => {
    try {
        const { id, semester } = req.params;

        const semesterRecord = await AcademicSemester.findOne({
            $or: [{ userId: id }, { usn: id }],
            semester: parseInt(semester)
        }).lean();

        if (!semesterRecord) {
            return res.status(404).json({
                success: false,
                message: 'Semester record not found'
            });
        }

        res.json({
            success: true,
            data: semesterRecord
        });
    } catch (error) {
        console.error('Error fetching semester record:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching semester record',
            error: error.message 
        });
    }
};

/**
 * PUT /api/admin/students/:id/academics/:semester
 * Update entire semester record (admin only)
 */
const updateSemesterRecord = async (req, res) => {
    try {
        const { id, semester } = req.params;
        const updateData = req.body;
        const { reason } = req.body;

        // Find existing record
        const existingRecord = await AcademicSemester.findOne({
            $or: [{ userId: id }, { usn: id }],
            semester: parseInt(semester)
        });

        if (!existingRecord) {
            return res.status(404).json({
                success: false,
                message: 'Semester record not found'
            });
        }

        // Track changes for audit
        const changes = [];
        
        // Compare courses
        if (updateData.courses) {
            updateData.courses.forEach((newCourse, index) => {
                const oldCourse = existingRecord.courses[index];
                if (oldCourse) {
                    ['ia1', 'ia2', 'ia3', 'labMarks', 'externalMarks', 'attendancePercent'].forEach(field => {
                        if (newCourse[field] !== undefined && newCourse[field] !== oldCourse[field]) {
                            changes.push({
                                fieldPath: `courses[${index}].${field}`,
                                courseCode: oldCourse.courseCode,
                                courseName: oldCourse.courseName,
                                oldValue: oldCourse[field],
                                newValue: newCourse[field],
                                delta: newCourse[field] - (oldCourse[field] || 0)
                            });
                        }
                    });
                }
            });
        }

        // Update the record
        Object.assign(existingRecord, updateData);
        
        // Set admin metadata
        existingRecord.lastModifiedBy = {
            userId: req.user.userId,
            role: req.user.role,
            name: req.user.name,
            timestamp: new Date()
        };

        // Add to history
        existingRecord.lastModifiedHistory.push({
            changedBy: {
                userId: req.user.userId,
                role: req.user.role,
                name: req.user.name
            },
            changes,
            reason: reason || 'Administrative update',
            timestamp: new Date()
        });

        // Trigger computation
        existingRecord.computeInternalTotals();
        existingRecord.computeLetterGrades();
        existingRecord.computeSGPA();

        await existingRecord.save();

        // Log admin action
        const auditLog = await AdminAction.create({
            adminId: req.user.userId,
            adminName: req.user.name,
            adminRole: req.user.role,
            studentId: existingRecord.userId,
            studentUsn: existingRecord.usn,
            semester: existingRecord.semester,
            actionType: 'update_marks',
            changes,
            reason: reason || 'Administrative update',
            status: 'success'
        });

        // Create notification for student
        const notification = await Notification.create({
            userId: existingRecord.userId,
            type: 'semester_performance',
            title: '📊 Academic Record Updated',
            body: `Your semester ${semester} marks have been updated by admin. Please review the changes.`,
            priority: changes.length > 5 ? 'high' : 'medium',
            payload: {
                semester,
                changesCount: changes.length,
                actionUrl: `/academics/semester/${semester}`,
                actionLabel: 'View Details'
            }
        });

        // Update audit log with notification
        auditLog.notificationSent = true;
        auditLog.notificationId = notification._id;
        await auditLog.save();

        res.json({
            success: true,
            message: 'Semester record updated successfully',
            data: existingRecord,
            audit: {
                changesCount: changes.length,
                notificationSent: true
            }
        });
    } catch (error) {
        console.error('Error updating semester record:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating semester record',
            error: error.message 
        });
    }
};

/**
 * PATCH /api/admin/students/:id/academics/:semester/courses/:courseId
 * Update a single course
 */
const updateCourseMarks = async (req, res) => {
    try {
        const { id, semester, courseId } = req.params;
        const updateData = req.body;
        const { reason } = req.body;

        const semesterRecord = await AcademicSemester.findOne({
            $or: [{ userId: id }, { usn: id }],
            semester: parseInt(semester)
        });

        if (!semesterRecord) {
            return res.status(404).json({
                success: false,
                message: 'Semester record not found'
            });
        }

        // Find course by ID or courseCode
        const courseIndex = semesterRecord.courses.findIndex(c => 
            c._id.toString() === courseId || c.courseCode === courseId
        );

        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const oldCourse = { ...semesterRecord.courses[courseIndex].toObject() };
        
        // Track changes
        const changes = [];
        ['ia1', 'ia2', 'ia3', 'labMarks', 'externalMarks', 'attendancePercent'].forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== oldCourse[field]) {
                changes.push({
                    fieldPath: `courses[${courseIndex}].${field}`,
                    courseCode: oldCourse.courseCode,
                    courseName: oldCourse.courseName,
                    oldValue: oldCourse[field],
                    newValue: updateData[field],
                    delta: updateData[field] - (oldCourse[field] || 0)
                });
            }
        });

        // Update course
        Object.assign(semesterRecord.courses[courseIndex], updateData);
        semesterRecord.courses[courseIndex].lastModifiedBy = {
            userId: req.user.userId,
            role: req.user.role,
            name: req.user.name,
            timestamp: new Date()
        };

        // Recompute
        semesterRecord.computeInternalTotals();
        semesterRecord.computeLetterGrades();
        semesterRecord.computeSGPA();

        // Add to history
        semesterRecord.lastModifiedHistory.push({
            changedBy: {
                userId: req.user.userId,
                role: req.user.role,
                name: req.user.name
            },
            changes,
            reason: reason || 'Course marks update',
            timestamp: new Date()
        });

        await semesterRecord.save();

        // Log action
        await AdminAction.create({
            adminId: req.user.userId,
            adminName: req.user.name,
            adminRole: req.user.role,
            studentId: semesterRecord.userId,
            studentUsn: semesterRecord.usn,
            semester: semesterRecord.semester,
            actionType: 'update_course',
            changes,
            reason: reason || 'Course marks update',
            status: 'success'
        });

        // Notify student
        await Notification.create({
            userId: semesterRecord.userId,
            type: 'internal_marks',
            title: '✏️ Course Marks Updated',
            body: `Marks updated for ${oldCourse.courseName} (Sem ${semester})`,
            priority: 'medium',
            payload: {
                semester,
                courseCode: oldCourse.courseCode,
                actionUrl: `/academics/semester/${semester}`,
                actionLabel: 'View Course'
            }
        });

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: semesterRecord.courses[courseIndex],
            changes
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating course',
            error: error.message 
        });
    }
};

module.exports = {
    getStudents,
    getStudentAcademics,
    getSemesterRecord,
    updateSemesterRecord,
    updateCourseMarks
};
