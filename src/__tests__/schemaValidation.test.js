const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const mentorSuggestionSchema = require('../schemas/mentorSuggestion.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(mentorSuggestionSchema);

describe('Mentor Suggestion Schema Validation', () => {
  
  test('should validate correct mentor suggestion', () => {
    const validSuggestion = {
      insights: [
        {
          title: 'Low Attendance Alert',
          detail: 'Your attendance has dropped below 75%. This may affect your eligibility.',
          severity: 'high'
        },
        {
          title: 'Strong Performance in Math',
          detail: 'You are performing well in mathematics with consistent IA marks.',
          severity: 'low'
        }
      ],
      planLength: 14,
      plan: [
        {
          day: 1,
          date: '2025-11-15',
          tasks: [
            {
              time: '09:00',
              task: 'Review Data Structures - Arrays and Linked Lists',
              durationMinutes: 60,
              resource: 'Chapter 3 notes',
              resourceUrl: 'https://example.com/notes',
              practiceProblemIds: ['P001', 'P002']
            },
            {
              time: '14:00',
              task: 'Practice algorithm problems',
              durationMinutes: 90,
              resource: 'LeetCode Easy Problems'
            }
          ]
        }
      ],
      microSupport: [
        {
          title: 'Understanding Linked Lists',
          summary: 'A comprehensive guide to linked list operations and implementations',
          estimatedMinutes: 30,
          resourceUrl: 'https://example.com/linked-lists',
          exampleProblem: 'Reverse a linked list'
        }
      ],
      resources: [
        {
          title: 'Data Structures Course',
          url: 'https://example.com/course',
          type: 'course'
        }
      ],
      mentorActions: [
        'Schedule a one-on-one meeting to discuss attendance issues',
        'Provide additional practice problems for weak subjects',
        'Encourage participation in study groups'
      ],
      confidence: 0.85
    };
    
    const valid = validate(validSuggestion);
    
    if (!valid) {
      console.log('Validation errors:', validate.errors);
    }
    
    expect(valid).toBe(true);
  });
  
  test('should reject suggestion with missing required fields', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test',
          detail: 'Test detail',
          severity: 'low'
        }
      ],
      planLength: 7
      // Missing: plan, microSupport, mentorActions, confidence
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
    expect(validate.errors).toBeDefined();
  });
  
  test('should reject suggestion with invalid severity', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test Insight',
          detail: 'This is a test detail',
          severity: 'critical' // Invalid: should be low|medium|high
        }
      ],
      planLength: 7,
      plan: [],
      microSupport: [],
      resources: [],
      mentorActions: ['Test action'],
      confidence: 0.8
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
  });
  
  test('should reject plan with invalid time format', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test',
          detail: 'Test detail that is long enough',
          severity: 'low'
        }
      ],
      planLength: 7,
      plan: [
        {
          day: 1,
          date: '2025-11-15',
          tasks: [
            {
              time: '25:00', // Invalid: hours should be 0-23
              task: 'Study mathematics',
              durationMinutes: 60
            }
          ]
        }
      ],
      microSupport: [],
      resources: [],
      mentorActions: ['Test action'],
      confidence: 0.8
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
  });
  
  test('should reject plan with task duration out of range', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test',
          detail: 'Test detail that is long enough',
          severity: 'low'
        }
      ],
      planLength: 7,
      plan: [
        {
          day: 1,
          date: '2025-11-15',
          tasks: [
            {
              time: '09:00',
              task: 'Study for 5 hours straight',
              durationMinutes: 300 // Invalid: max is 240
            }
          ]
        }
      ],
      microSupport: [],
      resources: [],
      mentorActions: ['Test action'],
      confidence: 0.8
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
  });
  
  test('should reject confidence out of range', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test',
          detail: 'Test detail that is long enough',
          severity: 'low'
        }
      ],
      planLength: 7,
      plan: [
        {
          day: 1,
          date: '2025-11-15',
          tasks: [
            {
              time: '09:00',
              task: 'Study mathematics',
              durationMinutes: 60
            }
          ]
        }
      ],
      microSupport: [],
      resources: [],
      mentorActions: ['Test action'],
      confidence: 1.5 // Invalid: max is 1.0
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
  });
  
  test('should reject invalid planLength', () => {
    const invalidSuggestion = {
      insights: [
        {
          title: 'Test',
          detail: 'Test detail that is long enough',
          severity: 'low'
        }
      ],
      planLength: 10, // Invalid: must be 7, 14, or 28
      plan: [],
      microSupport: [],
      resources: [],
      mentorActions: ['Test action'],
      confidence: 0.8
    };
    
    const valid = validate(invalidSuggestion);
    expect(valid).toBe(false);
  });
  
  test('should accept minimal valid suggestion', () => {
    const minimalSuggestion = {
      insights: [
        {
          title: 'Short',
          detail: 'A short detail message',
          severity: 'low'
        }
      ],
      planLength: 7,
      plan: [
        {
          day: 1,
          date: '2025-11-15',
          tasks: [
            {
              time: '09:00',
              task: 'Study',
              durationMinutes: 60
            }
          ]
        }
      ],
      microSupport: [],
      resources: [],
      mentorActions: ['One action'],
      confidence: 0.5
    };
    
    const valid = validate(minimalSuggestion);
    
    if (!valid) {
      console.log('Errors:', validate.errors);
    }
    
    expect(valid).toBe(true);
  });
});
