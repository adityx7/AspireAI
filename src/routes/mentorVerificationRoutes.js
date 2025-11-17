const express = require('express');
const router = express.Router();
const StudentVerification = require('../models/StudentVerification');
const studentVerificationService = require('../services/studentVerificationService');

// Middleware to check authentication (adjust based on your auth setup)
const checkAuth = (req, res, next) => {
  // Add your authentication check here
  next();
};

/**
 * GET /api/mentor/:mentorId/student/:studentId/overview
 * Get complete student data for verification
 */
router.get('/mentor/:mentorId/student/:studentId/overview', checkAuth, async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    
    console.log(`📊 Fetching overview for student ${studentId} by mentor ${mentorId}`);
    
    // Get aggregated student data
    const studentData = await studentVerificationService.getFullStudentOverview(studentId);
    
    // Get or create verification status
    const verification = await StudentVerification.getOrCreate(studentId, mentorId);
    
    // Calculate progress
    const progress = verification.calculateProgress();
    
    res.json({
      success: true,
      data: {
        student: studentData,
        verification: {
          sections: verification.sections,
          overallStatus: verification.overallStatus,
          progress: progress,
          completedAt: verification.completedAt,
          locked: verification.locked
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching student overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student overview',
      error: error.message
    });
  }
});

/**
 * GET /api/mentor/:mentorId/student/:studentId/verification-status
 * Get verification status only
 */
router.get('/mentor/:mentorId/student/:studentId/verification-status', checkAuth, async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    
    const verification = await StudentVerification.getOrCreate(studentId, mentorId);
    const progress = verification.calculateProgress();
    
    res.json({
      success: true,
      data: {
        sections: verification.sections,
        overallStatus: verification.overallStatus,
        progress: progress,
        completedAt: verification.completedAt,
        locked: verification.locked
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification status',
      error: error.message
    });
  }
});

/**
 * POST /api/mentor/:mentorId/student/:studentId/verify-section
 * Verify a specific section
 */
router.post('/mentor/:mentorId/student/:studentId/verify-section', checkAuth, async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    const { section, verified, remark, mentorName } = req.body;
    
    console.log(`✅ Verifying section "${section}" for student ${studentId}`);
    
    // Validate section name
    const validSections = [
      'personal', 'academics', 'attendance', 'internalAssessments',
      'selfAssessmentStart', 'selfAssessmentEnd', 'personalityDevelopment',
      'aictePoints', 'certificates', 'achievements', 'meetings', 'career'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section name. Must be one of: ${validSections.join(', ')}`
      });
    }
    
    // Get verification document
    const verification = await StudentVerification.getOrCreate(studentId, mentorId, mentorName);
    
    // Check if locked
    if (verification.locked) {
      return res.status(403).json({
        success: false,
        message: 'Student verification is locked. Contact admin to unlock.'
      });
    }
    
    // Update section
    verification.sections[section] = {
      verified: verified,
      remark: remark || '',
      verifiedAt: verified ? new Date() : null,
      verifiedBy: verified ? mentorName || mentorId : ''
    };
    
    // Update overall status
    verification.updateOverallStatus();
    
    await verification.save();
    
    const progress = verification.calculateProgress();
    
    res.json({
      success: true,
      message: `Section "${section}" ${verified ? 'verified' : 'unverified'} successfully`,
      data: {
        section: verification.sections[section],
        overallStatus: verification.overallStatus,
        progress: progress
      }
    });
    
  } catch (error) {
    console.error('❌ Error verifying section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify section',
      error: error.message
    });
  }
});

/**
 * POST /api/mentor/:mentorId/student/:studentId/complete-verification
 * Complete final verification (only if all sections verified)
 */
router.post('/mentor/:mentorId/student/:studentId/complete-verification', checkAuth, async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    const { lockData } = req.body;
    
    console.log(`🔒 Completing verification for student ${studentId}`);
    
    const verification = await StudentVerification.findOne({ studentId, mentorId });
    
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found'
      });
    }
    
    // Check if all sections are verified
    const progress = verification.calculateProgress();
    
    if (progress.verified < progress.total) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete verification. Only ${progress.verified} out of ${progress.total} sections verified.`,
        data: { progress }
      });
    }
    
    // Mark as completed and lock if requested
    verification.overallStatus = 'completed';
    verification.completedAt = new Date();
    verification.locked = lockData === true;
    
    await verification.save();
    
    res.json({
      success: true,
      message: 'Student verification completed successfully!',
      data: {
        completedAt: verification.completedAt,
        locked: verification.locked,
        progress: progress
      }
    });
    
  } catch (error) {
    console.error('❌ Error completing verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete verification',
      error: error.message
    });
  }
});

/**
 * GET /api/mentor/:mentorId/students/verification-summary
 * Get verification summary for all students under a mentor
 */
router.get('/mentor/:mentorId/students/verification-summary', checkAuth, async (req, res) => {
  try {
    const { mentorId } = req.params;
    
    const verifications = await StudentVerification.find({ mentorId });
    
    const summary = verifications.map(v => {
      const progress = v.calculateProgress();
      return {
        studentId: v.studentId,
        overallStatus: v.overallStatus,
        progress: progress,
        completedAt: v.completedAt,
        locked: v.locked
      };
    });
    
    res.json({
      success: true,
      data: summary
    });
    
  } catch (error) {
    console.error('❌ Error fetching verification summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification summary',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/unlock-verification/:studentId/:mentorId
 * Admin endpoint to unlock a completed verification
 */
router.post('/admin/unlock-verification/:studentId/:mentorId', checkAuth, async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;
    
    const verification = await StudentVerification.findOne({ studentId, mentorId });
    
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification record not found'
      });
    }
    
    verification.locked = false;
    await verification.save();
    
    res.json({
      success: true,
      message: 'Verification unlocked successfully'
    });
    
  } catch (error) {
    console.error('❌ Error unlocking verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlock verification',
      error: error.message
    });
  }
});

module.exports = router;
