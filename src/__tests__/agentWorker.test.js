const { normalizeStudentData, performRuleChecks } = require('../workers/mentorAgentWorker');
const { isStudentAtRisk } = require('../services/schedulerService');

describe('Mentor Agent Worker Tests', () => {
  
  describe('performRuleChecks', () => {
    test('should flag low attendance', () => {
      const student = {
        academics: {
          attendance: 65
        }
      };
      
      const flags = performRuleChecks(student);
      const attendanceFlag = flags.find(f => f.type === 'attendance');
      
      expect(attendanceFlag).toBeDefined();
      expect(attendanceFlag.severity).toBe('high');
      expect(attendanceFlag.message).toContain('65%');
    });
    
    test('should flag CGPA drop', () => {
      const student = {
        academics: {
          attendance: 85,
          semesters: [
            { semester: 1, cgpa: 8.5, sgpa: 8.5 },
            { semester: 2, cgpa: 8.0, sgpa: 7.5 }
          ]
        }
      };
      
      const flags = performRuleChecks(student);
      const cgpaFlag = flags.find(f => f.type === 'cgpa_drop');
      
      expect(cgpaFlag).toBeDefined();
      expect(cgpaFlag.severity).toBe('medium');
    });
    
    test('should flag no recent activity', () => {
      const student = {
        usn: 'TEST001',
        academics: {
          attendance: 85
        },
        aicteActivityPoints: []
      };
      
      const flags = performRuleChecks(student);
      const activityFlag = flags.find(f => f.type === 'no_activity');
      
      expect(activityFlag).toBeDefined();
      expect(activityFlag.severity).toBe('low');
    });
    
    test('should flag low IA marks', () => {
      const student = {
        academics: {
          attendance: 85,
          semesters: [
            { semester: 1, cgpa: 8.0, sgpa: 8.0 }
          ],
          internalMarks: [
            {
              semester: 1,
              subject: 'Math',
              ia1: 10,
              ia2: 12,
              ia3: 11
            }
          ]
        }
      };
      
      const flags = performRuleChecks(student);
      const iaFlag = flags.find(f => f.type === 'low_ia');
      
      expect(iaFlag).toBeDefined();
      expect(iaFlag.severity).toBe('medium');
    });
    
    test('should return empty array for healthy student', () => {
      const student = {
        academics: {
          attendance: 90,
          semesters: [
            { semester: 1, cgpa: 8.5, sgpa: 8.5 }
          ],
          internalMarks: [
            {
              semester: 1,
              subject: 'Math',
              ia1: 25,
              ia2: 27,
              ia3: 26
            }
          ]
        },
        aicteActivityPoints: [
          {
            title: 'Hackathon',
            date: new Date(),
            points: 10
          }
        ]
      };
      
      const flags = performRuleChecks(student);
      
      expect(flags.length).toBe(0);
    });
  });
  
  describe('normalizeStudentData', () => {
    test('should normalize student data correctly', () => {
      const studentData = {
        student: {
          usn: 'TEST001',
          name: 'John Doe',
          branch: 'CS',
          academics: {
            attendance: 85,
            semesters: [
              { semester: 1, cgpa: 8.5, sgpa: 8.5, year: 1 }
            ],
            internalMarks: [
              {
                semester: 1,
                subject: 'Math',
                subjectCode: 'MATH101',
                ia1: 25,
                ia2: 27,
                ia3: 26,
                semesterEndMarks: 85
              }
            ]
          },
          certificates: [{ name: 'Cert1' }],
          aicteActivityPoints: [
            {
              title: 'Hackathon',
              category: 'Technical',
              points: 10,
              date: new Date()
            }
          ]
        },
        recentSuggestions: []
      };
      
      const ruleFlags = [];
      const normalized = normalizeStudentData(studentData, ruleFlags);
      
      expect(normalized.userId).toBe('TEST001');
      expect(normalized.name).toBe('John Doe');
      expect(normalized.semester).toBe(1);
      expect(normalized.cgpa).toBe(8.5);
      expect(normalized.attendance).toBe(85);
      expect(normalized.semesters).toHaveLength(1);
      expect(normalized.internalMarks).toHaveLength(1);
      expect(normalized.internalMarks[0].average).toBe(26);
      expect(normalized.certificates).toBe(1);
      expect(normalized.activityPoints).toHaveLength(1);
    });
  });
  
  describe('isStudentAtRisk', () => {
    test('should identify at-risk student with low attendance', () => {
      const student = {
        academics: {
          attendance: 65
        }
      };
      
      expect(isStudentAtRisk(student)).toBe(true);
    });
    
    test('should identify at-risk student with CGPA drop', () => {
      const student = {
        academics: {
          attendance: 85,
          semesters: [
            { semester: 1, cgpa: 8.5 },
            { semester: 2, cgpa: 8.0 }
          ]
        }
      };
      
      expect(isStudentAtRisk(student)).toBe(true);
    });
    
    test('should identify at-risk student with low CGPA', () => {
      const student = {
        academics: {
          attendance: 85,
          semesters: [
            { semester: 1, cgpa: 5.5 }
          ]
        }
      };
      
      expect(isStudentAtRisk(student)).toBe(true);
    });
    
    test('should not flag healthy student', () => {
      const student = {
        academics: {
          attendance: 90,
          semesters: [
            { semester: 1, cgpa: 8.5 }
          ]
        }
      };
      
      expect(isStudentAtRisk(student)).toBe(false);
    });
  });
});

describe('CGPA Calculations', () => {
  test('should calculate SGPA correctly', () => {
    // Simple SGPA calculation
    const subjects = [
      { credits: 4, grade: 9 },
      { credits: 3, grade: 8 },
      { credits: 3, grade: 10 }
    ];
    
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const totalPoints = subjects.reduce((sum, s) => sum + (s.credits * s.grade), 0);
    const sgpa = totalPoints / totalCredits;
    
    expect(sgpa).toBeCloseTo(9.0, 1);
  });
});
