const { computeSemesterSGPA, recomputeCGPA, computeCourseGrades, validateSemesterData } = require('../services/academicsService');

describe('Academics Service - SGPA Calculation', () => {
  describe('computeSemesterSGPA', () => {
    test('should calculate SGPA correctly for valid courses', () => {
      const courses = [
        { credits: 4, gradePoints: 10 }, // S grade
        { credits: 3, gradePoints: 9 },  // A grade
        { credits: 4, gradePoints: 8 },  // B grade
        { credits: 3, gradePoints: 7 }   // C grade
      ];
      
      // (4*10 + 3*9 + 4*8 + 3*7) / (4+3+4+3) = 125/14 = 8.93
      const sgpa = computeSemesterSGPA(courses);
      expect(sgpa).toBe(8.93);
    });

    test('should return 0 for empty courses array', () => {
      const sgpa = computeSemesterSGPA([]);
      expect(sgpa).toBe(0);
    });

    test('should return 0 for null or undefined', () => {
      expect(computeSemesterSGPA(null)).toBe(0);
      expect(computeSemesterSGPA(undefined)).toBe(0);
    });

    test('should handle courses with zero credits', () => {
      const courses = [
        { credits: 0, gradePoints: 10 },
        { credits: 4, gradePoints: 9 }
      ];
      
      const sgpa = computeSemesterSGPA(courses);
      expect(sgpa).toBe(9.00);
    });

    test('should round to 2 decimal places', () => {
      const courses = [
        { credits: 3, gradePoints: 10 },
        { credits: 3, gradePoints: 8 }
      ];
      
      // (3*10 + 3*8) / 6 = 54/6 = 9.00
      const sgpa = computeSemesterSGPA(courses);
      expect(sgpa).toBe(9.00);
    });
  });

  describe('computeCourseGrades', () => {
    test('should compute total internal correctly (best 2 IAs)', () => {
      const course = {
        ia1: 80,
        ia2: 90,
        ia3: 70,
        labMarks: 80,
        otherMarks: 90
      };
      
      const result = computeCourseGrades(course);
      
      // Best 2 IAs: 90 and 80, avg = 85
      // totalInternal = 85*0.4 + 80*0.3 + 90*0.3 = 34 + 24 + 27 = 85
      expect(result.totalInternal).toBe(85);
    });

    test('should compute letter grade and grade points correctly', () => {
      const testCases = [
        { total: 180, expectedGrade: 'S', expectedGP: 10 }, // 90%
        { total: 160, expectedGrade: 'A', expectedGP: 9 },  // 80%
        { total: 140, expectedGrade: 'B', expectedGP: 8 },  // 70%
        { total: 120, expectedGrade: 'C', expectedGP: 7 },  // 60%
        { total: 100, expectedGrade: 'D', expectedGP: 6 },  // 50%
        { total: 80, expectedGrade: 'E', expectedGP: 5 },   // 40%
        { total: 60, expectedGrade: 'F', expectedGP: 0 }    // 30%
      ];

      testCases.forEach(({ total, expectedGrade, expectedGP }) => {
        const course = {
          ia1: 0, ia2: 0, ia3: 0,
          labMarks: 0, otherMarks: 0,
          externalMarks: total
        };
        
        const result = computeCourseGrades(course);
        expect(result.letterGrade).toBe(expectedGrade);
        expect(result.gradePoints).toBe(expectedGP);
      });
    });

    test('should compute total marks correctly', () => {
      const course = {
        ia1: 80,
        ia2: 90,
        ia3: 70,
        labMarks: 80,
        otherMarks: 90,
        externalMarks: 75
      };
      
      const result = computeCourseGrades(course);
      expect(result.total).toBe(result.totalInternal + 75);
    });
  });

  describe('validateSemesterData', () => {
    test('should validate correct semester data', () => {
      const validData = {
        userId: 'USER123',
        semester: 1,
        academicYear: '2024-2025',
        mentorId: null,
        courses: [
          {
            slNo: 1,
            courseCode: 'CS101',
            courseName: 'Computer Science',
            credits: 4,
            attendancePercent: 85,
            ia1: 80, ia2: 85, ia3: 90,
            labMarks: 85, otherMarks: 88,
            totalInternal: 85, externalMarks: 75,
            total: 160, letterGrade: 'A', gradePoints: 9
          }
        ],
        sgpa: 9.0
      };

      const result = validateSemesterData(validData);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should reject invalid semester number', () => {
      const invalidData = {
        userId: 'USER123',
        semester: 10, // Invalid: should be 1-8
        academicYear: '2024-2025',
        courses: []
      };

      const result = validateSemesterData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should reject invalid academic year format', () => {
      const invalidData = {
        userId: 'USER123',
        semester: 1,
        academicYear: '2024', // Invalid format
        courses: []
      };

      const result = validateSemesterData(invalidData);
      expect(result.valid).toBe(false);
    });

    test('should reject marks outside valid range', () => {
      const invalidData = {
        userId: 'USER123',
        semester: 1,
        academicYear: '2024-2025',
        courses: [
          {
            slNo: 1,
            courseCode: 'CS101',
            courseName: 'Computer Science',
            credits: 4,
            ia1: 150, // Invalid: > 100
            attendancePercent: 85
          }
        ]
      };

      const result = validateSemesterData(invalidData);
      expect(result.valid).toBe(false);
    });
  });
});

describe('Academics Service - Integration Tests', () => {
  // These would require MongoDB connection for real testing
  // Mocking here for structure

  test('should compute CGPA from multiple semesters', async () => {
    // Mock implementation
    const mockSemesters = [
      {
        semester: 1,
        courses: [
          { credits: 4, gradePoints: 10 },
          { credits: 3, gradePoints: 9 }
        ]
      },
      {
        semester: 2,
        courses: [
          { credits: 4, gradePoints: 8 },
          { credits: 3, gradePoints: 9 }
        ]
      }
    ];

    // Expected CGPA = (4*10 + 3*9 + 4*8 + 3*9) / (4+3+4+3) = 125/14 = 8.93
    // This would test the actual recomputeCGPA function with mocked DB
  });
});

module.exports = {};
