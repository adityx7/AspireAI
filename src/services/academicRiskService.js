const mongoose = require('mongoose');

/**
 * Academic Risk Detection Service
 * Analyzes student data to identify academic risks
 */

class AcademicRiskService {
  
  /**
   * Generate comprehensive risk profile for a student
   * @param {Object} student - Student document with all academic data
   * @returns {Object} Risk profile with detailed insights
   */
  async generateRiskProfile(student) {
    const riskProfile = {
      lowAttendance: [],
      weakSubjects: [],
      cgpaDrop: false,
      missingAssignments: [],
      overallRisk: 'low',
      riskFactors: [],
      urgentActions: []
    };

    // Detect low attendance
    const attendanceRisks = await this.detectLowAttendance(student);
    if (attendanceRisks.length > 0) {
      riskProfile.lowAttendance = attendanceRisks;
      riskProfile.riskFactors.push('Low Attendance');
    }

    // Detect weak subjects
    const weakSubjects = await this.detectWeakSubjects(student);
    if (weakSubjects.length > 0) {
      riskProfile.weakSubjects = weakSubjects;
      riskProfile.riskFactors.push('Weak Academic Performance');
    }

    // Detect CGPA drop
    const cgpaDropDetected = await this.detectCGPADrop(student);
    if (cgpaDropDetected) {
      riskProfile.cgpaDrop = true;
      riskProfile.riskFactors.push('CGPA Decline');
    }

    // Detect missing assignments
    const missingAssignments = await this.detectMissingAssignments(student);
    if (missingAssignments.length > 0) {
      riskProfile.missingAssignments = missingAssignments;
      riskProfile.riskFactors.push('Incomplete Assignments');
    }

    // Calculate overall risk level
    riskProfile.overallRisk = this.calculateOverallRisk(riskProfile);

    // Generate urgent actions
    riskProfile.urgentActions = this.generateUrgentActions(riskProfile);

    return riskProfile;
  }

  /**
   * Detect subjects with low attendance (<75%)
   * @param {Object} student - Student document
   * @returns {Array} List of subjects with attendance issues
   */
  async detectLowAttendance(student) {
    const lowAttendanceSubjects = [];
    const ATTENDANCE_THRESHOLD = 75;

    try {
      // Check if student has attendance data
      if (!student.attendance || !Array.isArray(student.attendance)) {
        return lowAttendanceSubjects;
      }

      // Analyze each subject's attendance
      student.attendance.forEach(subject => {
        const attendancePercent = this.calculateAttendancePercent(subject);
        
        if (attendancePercent < ATTENDANCE_THRESHOLD) {
          lowAttendanceSubjects.push({
            subjectName: subject.subjectName || subject.name || 'Unknown Subject',
            subjectCode: subject.subjectCode || '',
            currentAttendance: attendancePercent,
            classesAttended: subject.present || 0,
            totalClasses: subject.total || 0,
            deficit: ATTENDANCE_THRESHOLD - attendancePercent,
            requiredClasses: this.calculateRequiredClasses(subject, ATTENDANCE_THRESHOLD)
          });
        }
      });

    } catch (error) {
      console.error('Error detecting low attendance:', error);
    }

    return lowAttendanceSubjects;
  }

  /**
   * Calculate attendance percentage
   * @param {Object} subject - Subject attendance data
   * @returns {Number} Attendance percentage
   */
  calculateAttendancePercent(subject) {
    const present = subject.present || subject.attended || 0;
    const total = subject.total || subject.totalClasses || 0;
    
    if (total === 0) return 100; // No classes yet
    
    return Math.round((present / total) * 100);
  }

  /**
   * Calculate required classes to reach threshold
   * @param {Object} subject - Subject attendance data
   * @param {Number} targetPercent - Target attendance percentage
   * @returns {Number} Number of consecutive classes needed
   */
  calculateRequiredClasses(subject, targetPercent) {
    const present = subject.present || 0;
    const total = subject.total || 0;
    
    if (total === 0) return 0;
    
    let futureClasses = 0;
    let futurePre = present;
    let futureTotal = total;
    
    while ((futurePre / futureTotal) * 100 < targetPercent && futureClasses < 100) {
      futureClasses++;
      futurePre++;
      futureTotal++;
    }
    
    return futureClasses;
  }

  /**
   * Detect subjects with weak performance (IA < 15/30)
   * @param {Object} student - Student document
   * @returns {Array} List of weak subjects with details
   */
  async detectWeakSubjects(student) {
    const weakSubjects = [];
    const IA_THRESHOLD = 15; // Out of 30
    const PERCENTAGE_THRESHOLD = 50; // 50%

    try {
      // Check internal marks/IA marks
      if (student.internalMarks && Array.isArray(student.internalMarks)) {
        student.internalMarks.forEach(subject => {
          const average = this.calculateIAAverage(subject);
          const percentage = this.calculatePercentage(average, 30);
          
          if (average < IA_THRESHOLD || percentage < PERCENTAGE_THRESHOLD) {
            weakSubjects.push({
              subjectName: subject.subjectName || subject.name || 'Unknown',
              subjectCode: subject.subjectCode || '',
              averageMarks: average,
              maxMarks: 30,
              percentage: percentage,
              deficit: IA_THRESHOLD - average,
              ia1: subject.ia1 || 0,
              ia2: subject.ia2 || 0,
              ia3: subject.ia3 || 0,
              trend: this.calculateTrend(subject)
            });
          }
        });
      }

      // Check semester marks if available
      if (student.semesterMarks && Array.isArray(student.semesterMarks)) {
        const currentSemester = this.getCurrentSemester(student);
        if (currentSemester && currentSemester.subjects) {
          currentSemester.subjects.forEach(subject => {
            if (subject.percentage < PERCENTAGE_THRESHOLD) {
              // Check if not already added from IA marks
              const exists = weakSubjects.find(s => 
                s.subjectCode === subject.subjectCode
              );
              
              if (!exists) {
                weakSubjects.push({
                  subjectName: subject.subjectName || subject.name,
                  subjectCode: subject.subjectCode || '',
                  percentage: subject.percentage || 0,
                  totalMarks: subject.totalMarks || 0,
                  obtainedMarks: subject.obtainedMarks || 0
                });
              }
            }
          });
        }
      }

    } catch (error) {
      console.error('Error detecting weak subjects:', error);
    }

    return weakSubjects;
  }

  /**
   * Calculate average IA marks
   * @param {Object} subject - Subject with IA marks
   * @returns {Number} Average marks
   */
  calculateIAAverage(subject) {
    const marks = [];
    
    if (subject.ia1 !== undefined && subject.ia1 !== null) marks.push(subject.ia1);
    if (subject.ia2 !== undefined && subject.ia2 !== null) marks.push(subject.ia2);
    if (subject.ia3 !== undefined && subject.ia3 !== null) marks.push(subject.ia3);
    
    if (marks.length === 0) return 0;
    
    const sum = marks.reduce((a, b) => a + b, 0);
    return Math.round((sum / marks.length) * 100) / 100;
  }

  /**
   * Calculate percentage
   * @param {Number} obtained - Obtained marks
   * @param {Number} total - Total marks
   * @returns {Number} Percentage
   */
  calculatePercentage(obtained, total) {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
  }

  /**
   * Calculate performance trend
   * @param {Object} subject - Subject with IA marks
   * @returns {String} 'improving' | 'declining' | 'stable'
   */
  calculateTrend(subject) {
    const marks = [];
    
    if (subject.ia1 !== undefined) marks.push(subject.ia1);
    if (subject.ia2 !== undefined) marks.push(subject.ia2);
    if (subject.ia3 !== undefined) marks.push(subject.ia3);
    
    if (marks.length < 2) return 'stable';
    
    const first = marks[0];
    const last = marks[marks.length - 1];
    const diff = last - first;
    
    if (diff > 2) return 'improving';
    if (diff < -2) return 'declining';
    return 'stable';
  }

  /**
   * Detect CGPA drop from previous semester
   * @param {Object} student - Student document
   * @returns {Boolean} True if significant CGPA drop detected
   */
  async detectCGPADrop(student) {
    const DROP_THRESHOLD = 0.4;

    try {
      if (!student.cgpa || !student.semesterMarks || student.semesterMarks.length < 2) {
        return false;
      }

      // Sort semesters by semester number
      const sortedSemesters = [...student.semesterMarks].sort((a, b) => 
        (b.semesterNumber || 0) - (a.semesterNumber || 0)
      );

      if (sortedSemesters.length < 2) return false;

      const currentSemester = sortedSemesters[0];
      const previousSemester = sortedSemesters[1];

      const currentCGPA = currentSemester.sgpa || currentSemester.cgpa || 0;
      const previousCGPA = previousSemester.sgpa || previousSemester.cgpa || 0;

      const drop = previousCGPA - currentCGPA;

      return drop >= DROP_THRESHOLD;

    } catch (error) {
      console.error('Error detecting CGPA drop:', error);
      return false;
    }
  }

  /**
   * Detect missing or incomplete assignments
   * @param {Object} student - Student document
   * @returns {Array} List of missing assignments
   */
  async detectMissingAssignments(student) {
    const missingAssignments = [];

    try {
      // If your schema tracks assignments
      if (student.assignments && Array.isArray(student.assignments)) {
        student.assignments.forEach(assignment => {
          if (!assignment.submitted || assignment.status === 'pending') {
            missingAssignments.push({
              title: assignment.title || 'Assignment',
              subject: assignment.subject || 'Unknown',
              dueDate: assignment.dueDate,
              status: assignment.status || 'pending'
            });
          }
        });
      }

      // Alternative: Check if IA marks are missing (null or 0)
      if (student.internalMarks && Array.isArray(student.internalMarks)) {
        student.internalMarks.forEach(subject => {
          if (subject.ia1 === 0 || subject.ia1 === null) {
            missingAssignments.push({
              title: `IA1 - ${subject.subjectName}`,
              subject: subject.subjectName,
              status: 'not_submitted'
            });
          }
          if (subject.ia2 === 0 || subject.ia2 === null) {
            missingAssignments.push({
              title: `IA2 - ${subject.subjectName}`,
              subject: subject.subjectName,
              status: 'not_submitted'
            });
          }
        });
      }

    } catch (error) {
      console.error('Error detecting missing assignments:', error);
    }

    return missingAssignments;
  }

  /**
   * Calculate overall risk level based on all factors
   * @param {Object} riskProfile - Risk profile object
   * @returns {String} 'low' | 'medium' | 'high'
   */
  calculateOverallRisk(riskProfile) {
    let riskScore = 0;

    // Weight different risk factors
    if (riskProfile.lowAttendance.length > 0) {
      riskScore += riskProfile.lowAttendance.length * 2;
    }

    if (riskProfile.weakSubjects.length > 0) {
      riskScore += riskProfile.weakSubjects.length * 3;
    }

    if (riskProfile.cgpaDrop) {
      riskScore += 5;
    }

    if (riskProfile.missingAssignments.length > 0) {
      riskScore += riskProfile.missingAssignments.length * 1;
    }

    // Determine risk level
    if (riskScore >= 10) return 'high';
    if (riskScore >= 5) return 'medium';
    return 'low';
  }

  /**
   * Generate urgent actions based on risk profile
   * @param {Object} riskProfile - Risk profile
   * @returns {Array} List of urgent actions
   */
  generateUrgentActions(riskProfile) {
    const actions = [];

    if (riskProfile.lowAttendance.length > 0) {
      actions.push('Attend all upcoming classes without fail');
      riskProfile.lowAttendance.forEach(subject => {
        if (subject.deficit > 10) {
          actions.push(`Priority: Improve ${subject.subjectName} attendance (currently ${subject.currentAttendance}%)`);
        }
      });
    }

    if (riskProfile.weakSubjects.length > 0) {
      riskProfile.weakSubjects.forEach(subject => {
        if (subject.percentage < 40) {
          actions.push(`Urgent: Focus on ${subject.subjectName} - schedule daily 1-hour revision`);
        }
      });
    }

    if (riskProfile.cgpaDrop) {
      actions.push('Meet with mentor to discuss academic strategy');
      actions.push('Review study methods and time management');
    }

    if (riskProfile.missingAssignments.length > 0) {
      actions.push(`Complete ${riskProfile.missingAssignments.length} pending assignments immediately`);
    }

    return actions;
  }

  /**
   * Get current semester data
   * @param {Object} student - Student document
   * @returns {Object} Current semester data
   */
  getCurrentSemester(student) {
    if (!student.semesterMarks || student.semesterMarks.length === 0) {
      return null;
    }

    // Return the most recent semester
    const sortedSemesters = [...student.semesterMarks].sort((a, b) => 
      (b.semesterNumber || 0) - (a.semesterNumber || 0)
    );

    return sortedSemesters[0];
  }

  /**
   * Check if student needs immediate intervention
   * @param {Object} riskProfile - Risk profile
   * @returns {Boolean} True if intervention needed
   */
  needsImmediateIntervention(riskProfile) {
    if (riskProfile.overallRisk === 'high') return true;
    
    // Check critical attendance
    const criticalAttendance = riskProfile.lowAttendance.some(
      subject => subject.currentAttendance < 65
    );
    
    // Check critical performance
    const criticalPerformance = riskProfile.weakSubjects.some(
      subject => subject.percentage < 35
    );
    
    return criticalAttendance || criticalPerformance;
  }

  /**
   * Generate detailed student snapshot for AI analysis
   * @param {Object} student - Student document
   * @param {Object} riskProfile - Risk profile
   * @returns {Object} Formatted student data for AI
   */
  generateStudentSnapshot(student, riskProfile) {
    return {
      basicInfo: {
        name: student.name || 'Student',
        usn: student.usn || '',
        semester: student.semester || 0,
        branch: student.branch || '',
        cgpa: student.cgpa || 0
      },
      riskProfile: riskProfile,
      attendance: student.attendance || [],
      internalMarks: student.internalMarks || [],
      semesterMarks: student.semesterMarks || [],
      timestamp: new Date()
    };
  }
}

module.exports = new AcademicRiskService();
