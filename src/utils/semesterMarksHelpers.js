/**
 * Semester Marks Computation Helpers
 * Used by SemesterMarksPage.jsx
 */

/**
 * Compute letter grade and grade points from total marks
 * @param {number} total - Total marks out of 100
 * @returns {{letter: string, points: number}}
 */
const computeGrade = (total) => {
  if (total >= 90) return { letter: 'S', points: 10 };
  if (total >= 80) return { letter: 'A', points: 9 };
  if (total >= 70) return { letter: 'B', points: 8 };
  if (total >= 60) return { letter: 'C', points: 7 };
  if (total >= 50) return { letter: 'D', points: 6 };
  if (total >= 40) return { letter: 'E', points: 5 };
  return { letter: 'F', points: 0 };
};

/**
 * Compute SGPA for a semester
 * Formula: SGPA = Σ(Credits × Grade Points) / Σ(Credits)
 * @param {Array} courses - Array of course objects with credits and gradePoints
 * @returns {number} SGPA rounded to 2 decimal places
 */
const computeSemesterSGPA = (courses) => {
  if (!courses || courses.length === 0) return 0;
  
  const totalCredits = courses.reduce((sum, course) => {
    return sum + (parseFloat(course.credits) || 0);
  }, 0);
  
  if (totalCredits === 0) return 0;
  
  const totalGradePoints = courses.reduce((sum, course) => {
    const credits = parseFloat(course.credits) || 0;
    const gradePoints = parseFloat(course.gradePoints) || 0;
    return sum + (credits * gradePoints);
  }, 0);
  
  return parseFloat((totalGradePoints / totalCredits).toFixed(2));
};

/**
 * Compute total internal marks from IA and lab marks
 * Formula: Best 2 of (IA1, IA2, IA3) × 20/30 + Lab × 15/25 + Other × 15/25
 * @param {object} course - Course object with ia1, ia2, ia3, lab, other
 * @returns {number} Total internal marks (max 50)
 */
const computeTotalInternal = (course) => {
  const ia1 = parseFloat(course.ia1) || 0;
  const ia2 = parseFloat(course.ia2) || 0;
  const ia3 = parseFloat(course.ia3) || 0;
  const lab = parseFloat(course.lab) || 0;
  const other = parseFloat(course.other) || 0;
  
  // Get best 2 IAs
  const iaMarks = [ia1, ia2, ia3].sort((a, b) => b - a);
  const best2IAs = iaMarks[0] + iaMarks[1];
  
  // Calculate contributions
  const iaContribution = (best2IAs / 30) * 20;
  const labContribution = (lab / 25) * 15;
  const otherContribution = (other / 25) * 15;
  
  return parseFloat((iaContribution + labContribution + otherContribution).toFixed(2));
};

/**
 * Compute all fields for a course
 * @param {object} course - Course object
 * @returns {object} Updated course with computed fields
 */
const computeCourseFields = (course) => {
  const totalInternal = computeTotalInternal(course);
  const external = parseFloat(course.external) || 0;
  const total = parseFloat((totalInternal + external).toFixed(2));
  const grade = computeGrade(total);
  
  return {
    ...course,
    totalInternal,
    total,
    letterGrade: grade.letter,
    gradePoints: grade.points
  };
};

/**
 * Validate course marks are within allowed ranges
 * @param {object} course - Course object to validate
 * @returns {{valid: boolean, errors: Array}}
 */
const validateCourse = (course) => {
  const errors = [];
  
  if (!course.courseCode) errors.push('Course code is required');
  if (!course.courseName) errors.push('Course name is required');
  
  if (course.attendancePercentage < 0 || course.attendancePercentage > 100) {
    errors.push('Attendance must be between 0 and 100');
  }
  
  ['ia1', 'ia2', 'ia3'].forEach(ia => {
    if (course[ia] < 0 || course[ia] > 15) {
      errors.push(`${ia.toUpperCase()} must be between 0 and 15`);
    }
  });
  
  ['lab', 'other'].forEach(field => {
    if (course[field] < 0 || course[field] > 25) {
      errors.push(`${field} must be between 0 and 25`);
    }
  });
  
  if (course.external < 0 || course.external > 50) {
    errors.push('External marks must be between 0 and 50');
  }
  
  if (course.credits < 0 || course.credits > 10) {
    errors.push('Credits must be between 0 and 10');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = {
  computeGrade,
  computeSemesterSGPA,
  computeTotalInternal,
  computeCourseFields,
  validateCourse
};
