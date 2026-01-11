const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * IA to Module Mapping (corrected as per requirement)
 * IA1: First 1.5 modules (Module 1 + half of Module 2)
 * IA2: Next 1.5 modules (half of Module 2 + Module 3)
 * IA3: Last 2 modules (Module 4 + Module 5)
 */
const IA_MODULE_MAPPING = {
  ia1: { start: 1, end: 1.5, modules: [1], partialModule: 2, description: 'Module 1 and first half of Module 2' },
  ia2: { start: 2, end: 3, modules: [2, 3], partialModule: null, description: 'Second half of Module 2 and Module 3' },
  ia3: { start: 4, end: 5, modules: [4, 5], partialModule: null, description: 'Modules 4 and 5' }
};

/**
 * Analyze student performance using Groq AI and provide topic-specific recommendations
 * @param {Object} performanceData - Student performance data
 * @param {Object} syllabusData - Course syllabus information
 * @returns {Promise<Object>} - AI analysis with topic recommendations
 */
async function analyzePerformanceWithSyllabus(performanceData, syllabusData) {
  try {
    console.log('🤖 Calling Groq AI for topic-specific analysis...');

    // Create detailed prompt
    const prompt = createAnalysisPrompt(performanceData, syllabusData);

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic advisor specializing in analyzing student performance and providing targeted study recommendations based on curriculum modules.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content || '{}';
    console.log('✅ Groq AI response received');

    // Parse and return
    return JSON.parse(response);

  } catch (error) {
    console.error('❌ Error calling Groq AI:', error);
    throw error;
  }
}

/**
 * Identify important topics for each IA based on student weaknesses
 * @param {Object} performanceData - Student's internal marks
 * @param {Array} syllabusData - Course syllabus with modules
 * @returns {Promise<Object>} - Important topics mapped to each IA
 */
async function getImportantTopicsForWeakAreas(performanceData, syllabusData) {
  try {
    console.log('🎯 Identifying important topics for weak areas...');

    const prompt = createImportantTopicsPrompt(performanceData, syllabusData);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert academic advisor who identifies the most important and frequently tested topics from a syllabus. 
You analyze student performance data and syllabus content to recommend topics that:
1. Are frequently asked in exams
2. Carry high weightage
3. Are fundamental concepts that other topics depend on
4. Are areas where the student has shown weakness

Focus on practical, actionable topic recommendations with clear study priorities.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content || '{}';
    console.log('✅ Important topics identified by Groq AI');

    return JSON.parse(response);

  } catch (error) {
    console.error('❌ Error identifying important topics:', error);
    throw error;
  }
}

/**
 * Create prompt for identifying important topics
 */
function createImportantTopicsPrompt(performanceData, syllabusData) {
  const { courses, selectedIA } = performanceData;

  // Build course performance summary with matched syllabus codes
  const coursePerformanceSummary = courses.map(course => {
    const weakIAs = [];
    if (course.ia1 !== undefined && course.ia1 < 10) weakIAs.push({ ia: 'IA1', score: course.ia1 });
    if (course.ia2 !== undefined && course.ia2 < 10) weakIAs.push({ ia: 'IA2', score: course.ia2 });
    if (course.ia3 !== undefined && course.ia3 < 10) weakIAs.push({ ia: 'IA3', score: course.ia3 });

    return {
      studentCourseCode: course.courseCode, // The code shown to student
      matchedSyllabusCode: course.matchedSyllabusCode || course.courseCode, // The code in syllabus
      courseName: course.courseName,
      ia1: course.ia1,
      ia2: course.ia2,
      ia3: course.ia3,
      weakIAs,
      isWeak: weakIAs.length > 0
    };
  });

  // Create mapping for course code translation
  const codeMapping = {};
  courses.forEach(c => {
    if (c.matchedSyllabusCode && c.matchedSyllabusCode !== c.courseCode) {
      codeMapping[c.matchedSyllabusCode] = c.courseCode;
    }
  });

  const prompt = `Analyze the student's performance and syllabus to identify the most important topics for each Internal Assessment.

**IA to Module Mapping:**
- IA1: Module 1 + first half of Module 2 (first 1.5 modules)
- IA2: Second half of Module 2 + Module 3 (next 1.5 modules)  
- IA3: Module 4 + Module 5 (last 2 modules)

**IMPORTANT Course Code Mapping:**
Some course codes in syllabus differ from student's course codes (different branch codes for same course).
Use the STUDENT'S course code (studentCourseCode) in your response, not the syllabus code.
${Object.keys(codeMapping).length > 0 ? `Mappings: ${JSON.stringify(codeMapping)}` : 'No mappings needed - codes match.'}

**Student Performance Data:**
${JSON.stringify(coursePerformanceSummary, null, 2)}

**Syllabus Data (Modules and Topics):**
${syllabusData.map(syllabus => {
  // Use the student's course code if there's a mapping
  const displayCode = codeMapping[syllabus.courseCode] || syllabus.courseCode;
  return `
📚 Course: ${syllabus.courseName} (${displayCode})
${syllabus.modules.map(m => `
  📖 Module ${m.moduleNumber}: ${m.title || 'Untitled'}
  Topics: ${m.topics?.join(', ') || m.description?.substring(0, 200) || 'No specific topics listed'}
`).join('\n')}
`;
}).join('\n---\n')}

**Task:**
For EACH course, identify the most important topics for each IA based on:
1. The module coverage for that IA
2. Student's weak performance areas (score < 10/15)
3. Topics that are fundamental and frequently tested
4. Topics that require more study time

IMPORTANT: In your response, use the student's courseCode (from studentCourseCode field), NOT the syllabus code.

**Response Format (JSON):**
{
  "iaTopics": {
    "ia1": {
      "description": "Module 1 + first half of Module 2",
      "courses": [
        {
          "courseCode": "string (use student's course code)",
          "courseName": "string",
          "studentScore": number or null,
          "isWeak": boolean,
          "importantTopics": [
            {
              "topic": "string",
              "module": number,
              "importance": "critical|high|medium",
              "reason": "Why this topic is important",
              "estimatedStudyHours": number,
              "keyConceptsToMaster": ["concept1", "concept2"],
              "commonMistakes": "string"
            }
          ],
          "quickRevisionPoints": ["point1", "point2", "point3"]
        }
      ]
    },
    "ia2": {
      "description": "Second half of Module 2 + Module 3",
      "courses": [...]
    },
    "ia3": {
      "description": "Modules 4 and 5",
      "courses": [...]
    }
  },
  "overallRecommendation": "string",
  "prioritySubjects": [
    {
      "courseCode": "string (use student's course code)",
      "courseName": "string",
      "urgency": "critical|high|medium",
      "focusIA": "ia1|ia2|ia3",
      "actionPlan": "string"
    }
  ]
}

Provide ONLY the JSON response. Be specific with actual topic names from the syllabus.`;

  return prompt;
}

/**
 * Create detailed prompt for Groq AI analysis
 */
function createAnalysisPrompt(performanceData, syllabusData) {
  const { semester, selectedTests, coursePerformance } = performanceData;

  const prompt = `Analyze this student's internal assessment performance and provide specific topic recommendations.

**Student Performance Data:**
Semester: ${semester}
Assessments Analyzed: ${selectedTests.map(t => t.toUpperCase()).join(', ')}

**IA to Module Mapping:**
- IA1: Module 1 + first half of Module 2 (first 1.5 modules)
- IA2: Second half of Module 2 + Module 3 (next 1.5 modules)
- IA3: Module 4 + Module 5 (last 2 modules)

**Course-wise Performance:**
${JSON.stringify(coursePerformance, null, 2)}

**Syllabus Information:**
${syllabusData.map(syllabus => `
Course: ${syllabus.courseName} (${syllabus.courseCode})
Modules:
${syllabus.modules.map(m => `
  Module ${m.moduleNumber}: ${m.title}
  Topics: ${m.topics?.join(', ') || 'Not specified'}
`).join('\n')}
`).join('\n\n')}

**Task:**
For each course where the student performed poorly (score < 10/15 or < 67%), identify:
1. Which specific modules/topics were covered in that IA
2. Which topics need immediate focus
3. Prioritized study plan for improvement
4. Estimated time needed for each topic

**Response Format (JSON):**
{
  "overallAnalysis": "Brief summary of performance patterns",
  "courseAnalysis": [
    {
      "courseCode": "string",
      "courseName": "string",
      "performanceSummary": "string",
      "weakIAs": ["ia1", "ia2"],
      "topicsToFocus": [
        {
          "module": "1",
          "topic": "string",
          "priority": "high|medium|low",
          "estimatedHours": number,
          "resources": ["string"],
          "studyTips": "string"
        }
      ]
    }
  ],
  "priorityTopics": [
    {
      "course": "string",
      "topic": "string",
      "reason": "string",
      "actionPlan": "string"
    }
  ],
  "weeklyStudyPlan": {
    "totalHoursNeeded": number,
    "dailySchedule": [
      {
        "day": "Monday",
        "tasks": [
          {
            "course": "string",
            "topic": "string",
            "duration": "string"
          }
        ]
      }
    ]
  },
  "motivationalMessage": "string"
}

Provide ONLY the JSON response, no additional text.`;

  return prompt;
}

/**
 * Map IA test to module range (corrected mapping)
 */
function getModuleRangeForIA(iaTest) {
  return IA_MODULE_MAPPING[iaTest] || null;
}

/**
 * Filter modules based on IA coverage
 */
function getModulesForIA(modules, iaTest) {
  const range = getModuleRangeForIA(iaTest);
  if (!range) return [];

  return modules.filter(m => {
    const moduleNum = parseFloat(m.moduleNumber);
    // For IA1: modules 1 and 2 (partial)
    if (iaTest === 'ia1') {
      return moduleNum >= 1 && moduleNum <= 2;
    }
    // For IA2: modules 2 and 3
    if (iaTest === 'ia2') {
      return moduleNum >= 2 && moduleNum <= 3;
    }
    // For IA3: modules 4 and 5
    if (iaTest === 'ia3') {
      return moduleNum >= 4 && moduleNum <= 5;
    }
    return false;
  });
}

module.exports = {
  analyzePerformanceWithSyllabus,
  getImportantTopicsForWeakAreas,
  getModuleRangeForIA,
  getModulesForIA,
  IA_MODULE_MAPPING
};
