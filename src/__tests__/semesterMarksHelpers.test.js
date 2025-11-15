/**
 * Tests for Semester Marks Helpers
 * Run with: npm test -- semesterMarksHelpers.test.js
 */

const {
  computeGrade,
  computeSemesterSGPA,
  computeTotalInternal,
  computeCourseFields,
  validateCourse
} = require('../utils/semesterMarksHelpers');

describe('Semester Marks Helpers', () => {
  
  describe('computeGrade', () => {
    test('should return S grade for marks >= 90', () => {
      expect(computeGrade(95)).toEqual({ letter: 'S', points: 10 });
      expect(computeGrade(90)).toEqual({ letter: 'S', points: 10 });
    });
    
    test('should return A grade for marks >= 80', () => {
      expect(computeGrade(85)).toEqual({ letter: 'A', points: 9 });
      expect(computeGrade(80)).toEqual({ letter: 'A', points: 9 });
    });
    
    test('should return F grade for marks < 40', () => {
      expect(computeGrade(35)).toEqual({ letter: 'F', points: 0 });
      expect(computeGrade(0)).toEqual({ letter: 'F', points: 0 });
    });
  });
  
  describe('computeSemesterSGPA', () => {
    test('should calculate correct SGPA', () => {
      const courses = [
        { credits: 4, gradePoints: 9 },
        { credits: 3, gradePoints: 8 },
        { credits: 3, gradePoints: 10 }
      ];
      // (4*9 + 3*8 + 3*10) / (4+3+3) = (36+24+30)/10 = 90/10 = 9.00
      expect(computeSemesterSGPA(courses)).toBe(9.00);
    });
    
    test('should return 0 for empty courses array', () => {
      expect(computeSemesterSGPA([])).toBe(0);
    });
    
    test('should return 0 if total credits is 0', () => {
      const courses = [
        { credits: 0, gradePoints: 9 }
      ];
      expect(computeSemesterSGPA(courses)).toBe(0);
    });
    
    test('should handle mixed credit values', () => {
      const courses = [
        { credits: 4, gradePoints: 10 },
        { credits: 4, gradePoints: 8 },
        { credits: 2, gradePoints: 9 }
      ];
      // (4*10 + 4*8 + 2*9) / (4+4+2) = (40+32+18)/10 = 90/10 = 9.00
      expect(computeSemesterSGPA(courses)).toBe(9.00);
    });
  });
  
  describe('computeTotalInternal', () => {
    test('should calculate internal marks using best 2 IAs', () => {
      const course = {
        ia1: 15,
        ia2: 10,
        ia3: 12,
        lab: 25,
        other: 25
      };
      // Best 2 IAs: 15 + 12 = 27
      // IA contribution: (27/30) * 20 = 18
      // Lab contribution: (25/25) * 15 = 15
      // Other contribution: (25/25) * 15 = 15
      // Total: 18 + 15 + 15 = 48
      expect(computeTotalInternal(course)).toBe(48.00);
    });
    
    test('should handle zero marks', () => {
      const course = {
        ia1: 0,
        ia2: 0,
        ia3: 0,
        lab: 0,
        other: 0
      };
      expect(computeTotalInternal(course)).toBe(0);
    });
    
    test('should work with partial marks', () => {
      const course = {
        ia1: 10,
        ia2: 12,
        ia3: 8,
        lab: 20,
        other: 15
      };
      // Best 2 IAs: 12 + 10 = 22
      // IA: (22/30)*20 = 14.67
      // Lab: (20/25)*15 = 12
      // Other: (15/25)*15 = 9
      // Total: 14.67 + 12 + 9 = 35.67
      expect(computeTotalInternal(course)).toBe(35.67);
    });
  });
  
  describe('computeCourseFields', () => {
    test('should compute all fields correctly', () => {
      const course = {
        ia1: 15,
        ia2: 14,
        ia3: 13,
        lab: 25,
        other: 25,
        external: 45
      };
      
      const result = computeCourseFields(course);
      
      // Best 2 IAs: 15+14=29, (29/30)*20 = 19.33
      // Lab: 25/25*15 = 15
      // Other: 25/25*15 = 15
      // Total Internal: 49.33
      expect(result.totalInternal).toBe(49.33);
      
      // Total: 49.33 + 45 = 94.33
      expect(result.total).toBe(94.33);
      
      // Grade: S (>= 90)
      expect(result.letterGrade).toBe('S');
      expect(result.gradePoints).toBe(10);
    });
  });
  
  describe('validateCourse', () => {
    test('should validate a correct course', () => {
      const course = {
        courseCode: 'CS101',
        courseName: 'Data Structures',
        attendancePercentage: 85,
        ia1: 14,
        ia2: 13,
        ia3: 15,
        lab: 23,
        other: 22,
        external: 45,
        credits: 4
      };
      
      const result = validateCourse(course);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should catch missing required fields', () => {
      const course = {
        attendancePercentage: 85,
        ia1: 14,
        ia2: 13,
        ia3: 15,
        lab: 23,
        other: 22,
        external: 45,
        credits: 4
      };
      
      const result = validateCourse(course);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Course code is required');
      expect(result.errors).toContain('Course name is required');
    });
    
    test('should catch out-of-range values', () => {
      const course = {
        courseCode: 'CS101',
        courseName: 'Data Structures',
        attendancePercentage: 150,
        ia1: 20,
        ia2: 13,
        ia3: 15,
        lab: 30,
        other: 22,
        external: 60,
        credits: 15
      };
      
      const result = validateCourse(course);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Integration Test: Save Semester and Verify SGPA', () => {
  test('should save semester data with correct SGPA calculation', () => {
    const semesterData = {
      semester: 1,
      academicYear: '2024-2025',
      courses: [
        {
          courseCode: 'CS101',
          courseName: 'Data Structures',
          ia1: 15, ia2: 14, ia3: 13,
          lab: 25, other: 25,
          external: 45,
          credits: 4
        },
        {
          courseCode: 'CS102',
          courseName: 'Algorithms',
          ia1: 14, ia2: 13, ia3: 12,
          lab: 23, other: 22,
          external: 42,
          credits: 4
        },
        {
          courseCode: 'CS103',
          courseName: 'Database Systems',
          ia1: 13, ia2: 14, ia3: 15,
          lab: 24, other: 23,
          external: 44,
          credits: 3
        }
      ]
    };
    
    // Compute fields for each course
    const processedCourses = semesterData.courses.map(computeCourseFields);
    
    // Calculate SGPA
    const sgpa = computeSemesterSGPA(processedCourses);
    
    // Verify SGPA is calculated correctly
    expect(sgpa).toBeGreaterThan(0);
    expect(sgpa).toBeLessThanOrEqual(10);
    
    // Verify all courses have computed fields
    processedCourses.forEach(course => {
      expect(course.totalInternal).toBeDefined();
      expect(course.total).toBeDefined();
      expect(course.letterGrade).toBeDefined();
      expect(course.gradePoints).toBeDefined();
    });
  });
});
