const mongoose = require('mongoose');
const AcademicSemester = require('../models/AcademicSemester');
const InternalMarks = require('../models/InternalMarks');
const StudentVerification = require('../models/StudentVerification');

/**
 * Service to aggregate all student data for mentor verification
 */
class StudentVerificationService {
  
  /**
   * Get complete student overview with all data
   * @param {String} studentId - Student USN or ID
   * @returns {Object} - Aggregated student data
   */
  async getFullStudentOverview(studentId) {
    try {
      // Get student basic info from students collection
      const Student = mongoose.connection.collection('students');
      const student = await Student.findOne({ 
        $or: [
          { _id: studentId },
          { usn: studentId },
          { email: studentId }
        ]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Fetch all academic semesters
      const academicRecords = await AcademicSemester.find({ 
        userId: studentId 
      }).sort({ semester: 1 });

      // Fetch all internal marks
      const internalMarks = await InternalMarks.find({ 
        userId: studentId 
      }).sort({ semester: 1 });

      // Get self assessments (if they exist)
      const SelfAssessment = mongoose.connection.collection('selfassessments');
      const selfAssessments = await SelfAssessment.find({ 
        studentId: studentId 
      }).toArray();

      // Get personality development forms
      const PersonalityDev = mongoose.connection.collection('personalitydevelopments');
      const personalityForms = await PersonalityDev.find({ 
        studentId: studentId 
      }).toArray();

      // Get AICTE points
      const AICTEPoints = mongoose.connection.collection('aictepoints');
      const aictePoints = await AICTEPoints.find({ 
        studentId: studentId 
      }).toArray();

      // Get certificates
      const Certificates = mongoose.connection.collection('certificates');
      const certificates = await Certificates.find({ 
        studentId: studentId 
      }).toArray();

      // Get achievements
      const Achievements = mongoose.connection.collection('achievements');
      const achievements = await Achievements.find({ 
        studentId: studentId 
      }).toArray();

      // Get mentor meetings
      const Meetings = mongoose.connection.collection('mentormeetings');
      const meetings = await Meetings.find({ 
        studentId: studentId 
      }).sort({ meetingDate: -1 }).toArray();

      // Get mentor suggestions (AI career roadmap)
      const MentorSuggestions = mongoose.connection.collection('mentorsuggestions');
      const careerPlans = await MentorSuggestions.find({ 
        userId: new mongoose.Types.ObjectId(student._id) 
      }).sort({ createdAt: -1 }).limit(1).toArray();

      // Calculate overall statistics
      const stats = this.calculateStudentStats(academicRecords, internalMarks);

      // Return aggregated data
      return {
        studentInfo: {
          _id: student._id,
          usn: student.usn,
          name: student.name,
          email: student.email,
          phone: student.phone,
          branch: student.branch,
          year: student.year,
          semester: student.semester,
          section: student.section,
          mentorName: student.mentorName || student.mentor,
          dateOfBirth: student.dateOfBirth,
          address: student.address,
          parentContact: student.parentContact,
          bloodGroup: student.bloodGroup
        },
        academics: {
          semesters: academicRecords.map(sem => ({
            semester: sem.semester,
            academicYear: sem.academicYear,
            courses: sem.courses,
            sgpa: sem.sgpa,
            totalCredits: sem.courses.reduce((sum, c) => sum + (c.credits || 0), 0)
          })),
          cgpa: stats.cgpa,
          totalCredits: stats.totalCredits
        },
        internalAssessments: internalMarks.map(sem => ({
          semester: sem.semester,
          academicYear: sem.academicYear,
          mentorName: sem.mentorName,
          courses: sem.courses,
          averageAttendance: this.calculateAverageAttendance(sem.courses),
          feesToBePaid: sem.feesToBePaid,
          feesPaid: sem.feesPaid,
          receiptNo: sem.receiptNo
        })),
        attendance: {
          overall: stats.overallAttendance,
          semesterWise: this.getAttendanceBySemester(internalMarks)
        },
        selfAssessments: {
          start: selfAssessments.filter(sa => sa.type === 'start'),
          end: selfAssessments.filter(sa => sa.type === 'end')
        },
        personalityDevelopment: personalityForms,
        aictePoints: {
          records: aictePoints,
          totalPoints: aictePoints.reduce((sum, ap) => sum + (ap.points || 0), 0)
        },
        certificates: certificates,
        achievements: achievements,
        meetings: meetings.map(m => ({
          _id: m._id,
          date: m.meetingDate || m.date,
          topic: m.topic,
          notes: m.notes,
          mentorName: m.mentorName,
          status: m.status
        })),
        career: {
          latestPlan: careerPlans[0] || null,
          aiSuggestions: careerPlans[0]?.plan || []
        },
        statistics: stats
      };

    } catch (error) {
      console.error('Error in getFullStudentOverview:', error);
      throw error;
    }
  }

  /**
   * Calculate student statistics from academic records
   */
  calculateStudentStats(academicRecords, internalMarks) {
    let totalSGPA = 0;
    let totalCredits = 0;
    let semesterCount = 0;

    academicRecords.forEach(sem => {
      if (sem.sgpa && sem.sgpa > 0) {
        totalSGPA += parseFloat(sem.sgpa);
        semesterCount++;
      }
      sem.courses.forEach(course => {
        totalCredits += parseFloat(course.credits) || 0;
      });
    });

    const cgpa = semesterCount > 0 ? (totalSGPA / semesterCount).toFixed(2) : 0;

    // Calculate overall attendance
    let totalAttendance = 0;
    let attendanceCount = 0;

    internalMarks.forEach(sem => {
      sem.courses.forEach(course => {
        if (course.attendancePercentage) {
          totalAttendance += course.attendancePercentage;
          attendanceCount++;
        }
      });
    });

    const overallAttendance = attendanceCount > 0 
      ? (totalAttendance / attendanceCount).toFixed(2) 
      : 0;

    return {
      cgpa: parseFloat(cgpa),
      totalCredits,
      overallAttendance: parseFloat(overallAttendance),
      completedSemesters: academicRecords.length
    };
  }

  /**
   * Calculate average attendance for courses
   */
  calculateAverageAttendance(courses) {
    if (!courses || courses.length === 0) return 0;
    const total = courses.reduce((sum, c) => sum + (c.attendancePercentage || 0), 0);
    return (total / courses.length).toFixed(2);
  }

  /**
   * Get attendance by semester
   */
  getAttendanceBySemester(internalMarks) {
    return internalMarks.map(sem => ({
      semester: sem.semester,
      average: this.calculateAverageAttendance(sem.courses),
      courses: sem.courses.map(c => ({
        code: c.courseCode,
        name: c.courseName,
        attendance: c.attendancePercentage
      }))
    }));
  }
}

module.exports = new StudentVerificationService();
