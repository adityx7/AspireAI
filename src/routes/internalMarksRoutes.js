const express = require('express');
const router = express.Router();
const InternalMarks = require('../models/InternalMarks');

// Middleware to check user authentication (you may need to adjust based on your auth setup)
const checkAuth = (req, res, next) => {
  // Add your authentication check here
  // For now, assuming userId is passed or available
  next();
};

// GET all semesters for a student
router.get('/students/:userId/internal-marks', checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const semesters = await InternalMarks.getAllSemestersForUser(userId);
    
    res.json({
      success: true,
      data: semesters
    });
  } catch (error) {
    console.error('Error fetching internal marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internal marks',
      error: error.message
    });
  }
});

// GET specific semester internal marks
router.get('/students/:userId/internal-marks/:semester', checkAuth, async (req, res) => {
  try {
    const { userId, semester } = req.params;
    const semesterData = await InternalMarks.findOne({ 
      userId, 
      semester: parseInt(semester) 
    });
    
    if (!semesterData) {
      return res.status(404).json({
        success: false,
        message: 'Semester data not found'
      });
    }
    
    res.json({
      success: true,
      data: semesterData
    });
  } catch (error) {
    console.error('Error fetching semester internal marks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch semester internal marks',
      error: error.message
    });
  }
});

// POST/PUT - Create or update semester internal marks
router.post('/students/:userId/internal-marks/:semester', checkAuth, async (req, res) => {
  try {
    const { userId, semester } = req.params;
    const updateData = req.body;
    
    console.log('📝 Saving internal marks:', { userId, semester, dataKeys: Object.keys(updateData) });
    
    // Validate required fields
    if (!updateData.academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Academic year is required'
      });
    }
    
    let semesterDoc = await InternalMarks.findOne({ 
      userId, 
      semester: parseInt(semester) 
    });
    
    if (semesterDoc) {
      // Update existing document
      console.log('✅ Updating existing document');
      semesterDoc.academicYear = updateData.academicYear;
      semesterDoc.mentorName = updateData.mentorName || '';
      semesterDoc.feesToBePaid = updateData.feesToBePaid || 0;
      semesterDoc.feesPaid = updateData.feesPaid || 0;
      semesterDoc.receiptNo = updateData.receiptNo || '';
      semesterDoc.courses = updateData.courses || [];
      await semesterDoc.save();
    } else {
      // Create new document
      console.log('✅ Creating new document');
      semesterDoc = await InternalMarks.create({
        userId,
        semester: parseInt(semester),
        academicYear: updateData.academicYear,
        mentorName: updateData.mentorName || '',
        feesToBePaid: updateData.feesToBePaid || 0,
        feesPaid: updateData.feesPaid || 0,
        receiptNo: updateData.receiptNo || '',
        courses: updateData.courses || []
      });
    }
    
    console.log('✅ Saved successfully:', semesterDoc._id);
    
    res.json({
      success: true,
      message: 'Internal marks saved successfully',
      data: semesterDoc
    });
  } catch (error) {
    console.error('❌ Error saving internal marks:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to save internal marks',
      error: error.message
    });
  }
});

// PUT - Update a specific course in a semester
router.put('/students/:userId/internal-marks/:semester/courses/:courseCode', checkAuth, async (req, res) => {
  try {
    const { userId, semester, courseCode } = req.params;
    const courseData = req.body;
    
    let semesterDoc = await InternalMarks.findOne({ 
      userId, 
      semester: parseInt(semester) 
    });
    
    if (!semesterDoc) {
      semesterDoc = await InternalMarks.create({
        userId,
        semester: parseInt(semester),
        academicYear: courseData.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        courses: []
      });
    }
    
    await semesterDoc.addOrUpdateCourse({ courseCode, ...courseData });
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      data: semesterDoc
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
});

// POST - Add a new course to a semester
router.post('/students/:userId/internal-marks/:semester/courses', checkAuth, async (req, res) => {
  try {
    const { userId, semester } = req.params;
    const courseData = req.body;
    
    let semesterDoc = await InternalMarks.getOrCreate(userId, parseInt(semester));
    await semesterDoc.addOrUpdateCourse(courseData);
    
    res.json({
      success: true,
      message: 'Course added successfully',
      data: semesterDoc
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

// DELETE - Remove a course from a semester
router.delete('/students/:userId/internal-marks/:semester/courses/:courseCode', checkAuth, async (req, res) => {
  try {
    const { userId, semester, courseCode } = req.params;
    
    const semesterDoc = await InternalMarks.findOne({ 
      userId, 
      semester: parseInt(semester) 
    });
    
    if (!semesterDoc) {
      return res.status(404).json({
        success: false,
        message: 'Semester data not found'
      });
    }
    
    await semesterDoc.deleteCourse(courseCode);
    
    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: semesterDoc
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
});

// DELETE - Remove entire semester data
router.delete('/students/:userId/internal-marks/:semester', checkAuth, async (req, res) => {
  try {
    const { userId, semester } = req.params;
    
    const result = await InternalMarks.findOneAndDelete({ 
      userId, 
      semester: parseInt(semester) 
    });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Semester data not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Semester data deleted successfully'
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

module.exports = router;
