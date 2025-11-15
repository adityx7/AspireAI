const express = require('express');
const router = express.Router();
const AcademicSemester = require('../models/AcademicSemester');
const {
  getUserAcademics,
  upsertSemester,
  deleteSemester,
  updateCourse,
  deleteCourse,
  validateSemesterData
} = require('../services/academicsService');

// Middleware to check if semester-based academics feature is enabled
const checkFeatureFlag = (req, res, next) => {
  const useSemesterAcademics = process.env.USE_SEMESTER_ACADEMICS === 'true';
  if (!useSemesterAcademics) {
    return res.status(503).json({
      success: false,
      message: 'Semester-based academics feature is not enabled yet'
    });
  }
  next();
};

// Middleware for role-based access control
const checkAccess = (req, res, next) => {
  const { id: studentId } = req.params;
  const { userId, role, mentorId } = req.user || {}; // Assuming auth middleware sets req.user
  
  // Allow if:
  // 1. User is viewing their own data
  // 2. User is a mentor assigned to this student
  // 3. User is an admin
  if (userId === studentId || role === 'admin' || (role === 'mentor' && mentorId === userId)) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
};

/**
 * GET /api/students/:id/academics
 * Get all semesters for a student
 */
router.get('/students/:id/academics', checkFeatureFlag, async (req, res) => {
  try {
    const { id: userId } = req.params;
    const academicsData = await getUserAcademics(userId);
    
    res.json({
      success: true,
      data: academicsData
    });
  } catch (error) {
    console.error('Error fetching academics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch academic records',
      error: error.message
    });
  }
});

/**
 * GET /api/students/:id/academics/:semester
 * Get specific semester data for a student
 */
router.get('/students/:id/academics/:semester', checkFeatureFlag, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const semesterDoc = await AcademicSemester.findOne({
      userId,
      semester: semesterNum
    });
    
    if (!semesterDoc) {
      return res.status(404).json({
        success: false,
        message: 'Semester record not found'
      });
    }
    
    res.json({
      success: true,
      data: semesterDoc.toObject()
    });
  } catch (error) {
    console.error('Error fetching semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch semester record',
      error: error.message
    });
  }
});

/**
 * POST /api/students/:id/academics/:semester
 * Create or overwrite semester document
 */
router.post('/students/:id/academics/:semester', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const semesterData = req.body;
    
    // Validate data
    const validation = validateSemesterData({
      userId,
      semester: semesterNum,
      ...semesterData
    });
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester data',
        errors: validation.errors
      });
    }
    
    const result = await upsertSemester(userId, semesterNum, semesterData);
    
    res.json({
      success: true,
      message: 'Semester data saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error saving semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save semester data',
      error: error.message
    });
  }
});

/**
 * PUT /api/students/:id/academics/:semester
 * Update entire semester document (for SemesterMarksPage)
 */
router.put('/students/:id/academics/:semester', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const semesterData = req.body;
    
    // Use upsertSemester which handles SGPA calculation and CGPA recomputation
    const result = await upsertSemester(userId, semesterNum, semesterData);
    
    res.json({
      success: true,
      message: 'Semester marks updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update semester data',
      error: error.message
    });
  }
});

/**
 * PUT /api/students/:id/academics/:semester/courses/:courseId
 * Update a single course in a semester
 */
router.put('/students/:id/academics/:semester/courses/:courseId', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester, courseId } = req.params;
    const semesterNum = parseInt(semester);
    const courseData = req.body;
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const result = await updateCourse(userId, semesterNum, courseId, courseData);
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course',
      error: error.message
    });
  }
});

/**
 * DELETE /api/students/:id/academics/:semester/courses/:courseId
 * Delete a course from a semester
 */
router.delete('/students/:id/academics/:semester/courses/:courseId', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester, courseId } = req.params;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const result = await deleteCourse(userId, semesterNum, courseId);
    
    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete course',
      error: error.message
    });
  }
});

/**
 * DELETE /api/students/:id/academics/:semester
 * Delete an entire semester record
 */
router.delete('/students/:id/academics/:semester', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    await deleteSemester(userId, semesterNum);
    
    res.json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete semester',
      error: error.message
    });
  }
});

/**
 * POST /api/students/:id/academics/:semester/courses
 * Add a new course to a semester
 */
router.post('/students/:id/academics/:semester/courses', checkFeatureFlag, checkAccess, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    const courseData = req.body;
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const semesterDoc = await AcademicSemester.findOne({ userId, semester: semesterNum });
    
    if (!semesterDoc) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found. Create semester first.'
      });
    }
    
    // Assign next slNo
    const maxSlNo = semesterDoc.courses.reduce((max, c) => Math.max(max, c.slNo || 0), 0);
    courseData.slNo = maxSlNo + 1;
    
    semesterDoc.courses.push(courseData);
    await semesterDoc.save();
    
    // Recompute SGPA
    semesterDoc.computeSGPA();
    await semesterDoc.save();
    
    res.json({
      success: true,
      message: 'Course added successfully',
      data: semesterDoc.toObject()
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add course',
      error: error.message
    });
  }
});

/**
 * GET /api/students/:id/academics/:semester/export
 * Export semester as printable HTML/PDF
 */
router.get('/students/:id/academics/:semester/export', checkFeatureFlag, async (req, res) => {
  try {
    const { id: userId, semester } = req.params;
    const semesterNum = parseInt(semester);
    const { format = 'html' } = req.query;
    
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return res.status(400).json({
        success: false,
        message: 'Invalid semester number. Must be between 1 and 8'
      });
    }
    
    const semesterDoc = await AcademicSemester.findOne({ userId, semester: semesterNum });
    
    if (!semesterDoc) {
      return res.status(404).json({
        success: false,
        message: 'Semester record not found'
      });
    }
    
    // Generate HTML for printing
    const html = generateSemesterHTML(semesterDoc);
    
    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      // For PDF generation, you could use puppeteer or similar
      res.json({
        success: true,
        message: 'PDF generation not implemented yet',
        htmlPreview: html
      });
    }
  } catch (error) {
    console.error('Error exporting semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export semester',
      error: error.message
    });
  }
});

/**
 * Helper function to generate printable HTML
 */
function generateSemesterHTML(semesterDoc) {
  const courses = semesterDoc.courses || [];
  const coursesHTML = courses.map(course => `
    <tr>
      <td>${course.slNo}</td>
      <td>${course.courseCode}</td>
      <td>${course.courseName}</td>
      <td>${course.attendancePercent}%</td>
      <td>${course.ia1}</td>
      <td>${course.ia2}</td>
      <td>${course.ia3}</td>
      <td>${course.labMarks}</td>
      <td>${course.otherMarks}</td>
      <td>${course.totalInternal}</td>
      <td>${course.externalMarks}</td>
      <td>${course.total}</td>
      <td>${course.letterGrade}</td>
      <td>${course.gradePoints}</td>
      <td>${course.credits}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Semester ${semesterDoc.semester} - Academic Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #3f51b5; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .summary { margin-top: 20px; font-size: 18px; font-weight: bold; }
        @media print {
          body { margin: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Academic Report - Semester ${semesterDoc.semester}</h1>
      <p><strong>Academic Year:</strong> ${semesterDoc.academicYear}</p>
      <p><strong>User ID:</strong> ${semesterDoc.userId}</p>
      
      <table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Attendance %</th>
            <th>IA1</th>
            <th>IA2</th>
            <th>IA3</th>
            <th>Lab</th>
            <th>Other</th>
            <th>Total Internal</th>
            <th>External</th>
            <th>Total</th>
            <th>Grade</th>
            <th>GP</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          ${coursesHTML}
        </tbody>
      </table>
      
      <div class="summary">
        <p>SGPA: ${semesterDoc.sgpa}</p>
        <p>Total Courses: ${courses.length}</p>
      </div>
      
      <button onclick="window.print()">Print / Save as PDF</button>
    </body>
    </html>
  `;
}

module.exports = router;
