const AcademicSemester = require('../models/AcademicSemester');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const academicSemesterSchema = require('../schemas/academicSemester.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateSemester = ajv.compile(academicSemesterSchema);

/**
 * Compute SGPA for a given semester's courses
 * @param {Array} courses - Array of course objects with credits and gradePoints
 * @returns {Number} - Calculated SGPA (0-10)
 */
function computeSemesterSGPA(courses) {
  if (!courses || courses.length === 0) {
    return 0;
  }

  let totalCredits = 0;
  let weightedSum = 0;

  courses.forEach(course => {
    if (course.credits && course.gradePoints !== undefined) {
      totalCredits += course.credits;
      weightedSum += course.gradePoints * course.credits;
    }
  });

  if (totalCredits === 0) {
    return 0;
  }

  return parseFloat((weightedSum / totalCredits).toFixed(2));
}

/**
 * Compute cumulative CGPA from all semester documents for a user
 * @param {String} userId - User identifier
 * @returns {Promise<Number>} - Calculated CGPA (0-10)
 */
async function recomputeCGPA(userId) {
  try {
    const semesters = await AcademicSemester.find({ userId }).sort({ semester: 1 });
    
    if (semesters.length === 0) {
      return 0;
    }

    let totalCredits = 0;
    let weightedSum = 0;

    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.credits && course.gradePoints !== undefined) {
          totalCredits += course.credits;
          weightedSum += course.gradePoints * course.credits;
        }
      });
    });

    const cgpa = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0;
    
    // Update student profile with new CGPA (assuming StudentProfile model exists)
    // This would require importing the StudentProfile model
    // await StudentProfile.updateOne({ userId }, { cgpa });
    
    return cgpa;
  } catch (error) {
    console.error('Error computing CGPA:', error);
    throw error;
  }
}

/**
 * Compute course totals and grades
 * @param {Object} course - Course object with marks
 * @returns {Object} - Course with computed fields
 */
function computeCourseGrades(course) {
  // Compute totalInternal (average of best 2 IAs + lab + other)
  const iaScores = [
    course.ia1 || 0,
    course.ia2 || 0,
    course.ia3 || 0
  ].sort((a, b) => b - a);
  
  const avgIA = (iaScores[0] + iaScores[1]) / 2;
  course.totalInternal = Math.round(
    avgIA * 0.4 + 
    (course.labMarks || 0) * 0.3 + 
    (course.otherMarks || 0) * 0.3
  );
  
  // Compute total
  course.total = course.totalInternal + (course.externalMarks || 0);
  
  // Compute letter grade based on total percentage
  const percentage = (course.total / 200) * 100;
  
  if (percentage >= 90) {
    course.letterGrade = 'S';
    course.gradePoints = 10;
  } else if (percentage >= 80) {
    course.letterGrade = 'A';
    course.gradePoints = 9;
  } else if (percentage >= 70) {
    course.letterGrade = 'B';
    course.gradePoints = 8;
  } else if (percentage >= 60) {
    course.letterGrade = 'C';
    course.gradePoints = 7;
  } else if (percentage >= 50) {
    course.letterGrade = 'D';
    course.gradePoints = 6;
  } else if (percentage >= 40) {
    course.letterGrade = 'E';
    course.gradePoints = 5;
  } else {
    course.letterGrade = 'F';
    course.gradePoints = 0;
  }
  
  return course;
}

/**
 * Validate semester document against schema
 * @param {Object} semesterData - Semester document to validate
 * @returns {Object} - { valid: boolean, errors: array }
 */
function validateSemesterData(semesterData) {
  const valid = validateSemester(semesterData);
  return {
    valid,
    errors: valid ? [] : validateSemester.errors
  };
}

/**
 * Get all semesters for a user with computed CGPA
 * @param {String} userId - User identifier
 * @returns {Promise<Object>} - { semesters: array, cgpa: number }
 */
async function getUserAcademics(userId) {
  try {
    const semesters = await AcademicSemester.find({ userId }).sort({ semester: 1 });
    const cgpa = await recomputeCGPA(userId);
    
    return {
      semesters: semesters.map(sem => sem.toObject()),
      cgpa,
      totalSemesters: semesters.length
    };
  } catch (error) {
    console.error('Error fetching user academics:', error);
    throw error;
  }
}

/**
 * Create or update a semester document
 * @param {String} userId - User identifier
 * @param {Number} semester - Semester number (1-8)
 * @param {Object} data - Semester data including courses
 * @returns {Promise<Object>} - Created/updated semester document
 */
async function upsertSemester(userId, semester, data) {
  try {
    console.log('🔄 upsertSemester called');
    console.log('   userId:', userId);
    console.log('   semester:', semester);
    console.log('   data:', JSON.stringify(data, null, 2));
    
    // Compute grades for all courses
    if (data.courses) {
      console.log('   Computing grades for', data.courses.length, 'courses');
      data.courses = data.courses.map(course => computeCourseGrades(course));
    }
    
    // Find and update or create new
    let semesterDoc = await AcademicSemester.findOne({ userId, semester });
    
    if (semesterDoc) {
      console.log('   Updating existing semester document');
      // Update existing
      Object.assign(semesterDoc, data);
      await semesterDoc.save();
    } else {
      console.log('   Creating new semester document');
      // Create new
      semesterDoc = new AcademicSemester({
        userId,
        semester,
        ...data
      });
      await semesterDoc.save();
    }
    
    // Compute SGPA
    console.log('   Computing SGPA');
    semesterDoc.computeSGPA();
    await semesterDoc.save();
    
    // Trigger CGPA recomputation
    console.log('   Recomputing CGPA');
    await recomputeCGPA(userId);
    
    console.log('✅ upsertSemester completed successfully');
    return semesterDoc.toObject();
  } catch (error) {
    console.error('❌ Error upserting semester:', error);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    throw error;
  }
}

/**
 * Delete a semester document
 * @param {String} userId - User identifier
 * @param {Number} semester - Semester number to delete
 * @returns {Promise<Boolean>} - Success status
 */
async function deleteSemester(userId, semester) {
  try {
    await AcademicSemester.deleteOne({ userId, semester });
    
    // Trigger CGPA recomputation
    await recomputeCGPA(userId);
    
    return true;
  } catch (error) {
    console.error('Error deleting semester:', error);
    throw error;
  }
}

/**
 * Update a single course in a semester
 * @param {String} userId - User identifier
 * @param {Number} semester - Semester number
 * @param {String} courseId - Course identifier (courseCode or slNo)
 * @param {Object} courseData - Updated course data
 * @returns {Promise<Object>} - Updated semester document
 */
async function updateCourse(userId, semester, courseId, courseData) {
  try {
    const semesterDoc = await AcademicSemester.findOne({ userId, semester });
    
    if (!semesterDoc) {
      throw new Error('Semester not found');
    }
    
    // Find course by courseCode or slNo
    const courseIndex = semesterDoc.courses.findIndex(
      c => c.courseCode === courseId || c.slNo === parseInt(courseId)
    );
    
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }
    
    // Update course
    Object.assign(semesterDoc.courses[courseIndex], courseData);
    
    // Recompute grades for this course
    semesterDoc.courses[courseIndex] = computeCourseGrades(semesterDoc.courses[courseIndex]);
    
    await semesterDoc.save();
    
    // Compute SGPA
    semesterDoc.computeSGPA();
    await semesterDoc.save();
    
    // Trigger CGPA recomputation
    await recomputeCGPA(userId);
    
    return semesterDoc.toObject();
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

/**
 * Delete a course from a semester
 * @param {String} userId - User identifier
 * @param {Number} semester - Semester number
 * @param {String} courseId - Course identifier (courseCode or slNo)
 * @returns {Promise<Object>} - Updated semester document
 */
async function deleteCourse(userId, semester, courseId) {
  try {
    const semesterDoc = await AcademicSemester.findOne({ userId, semester });
    
    if (!semesterDoc) {
      throw new Error('Semester not found');
    }
    
    // Remove course
    semesterDoc.courses = semesterDoc.courses.filter(
      c => c.courseCode !== courseId && c.slNo !== parseInt(courseId)
    );
    
    await semesterDoc.save();
    
    // Compute SGPA
    semesterDoc.computeSGPA();
    await semesterDoc.save();
    
    // Trigger CGPA recomputation
    await recomputeCGPA(userId);
    
    return semesterDoc.toObject();
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}

module.exports = {
  computeSemesterSGPA,
  recomputeCGPA,
  computeCourseGrades,
  validateSemesterData,
  getUserAcademics,
  upsertSemester,
  deleteSemester,
  updateCourse,
  deleteCourse
};
