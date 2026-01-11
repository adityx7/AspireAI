const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const InternalMarks = require('../models/InternalMarks');
const Syllabus = require('../models/Syllabus');
const groqService = require('../services/groqService');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);

/**
 * POST /api/assessment/important-topics
 * Get important topics for each IA based on student weaknesses
 */
router.post('/important-topics', async (req, res) => {
  try {
    const { userId, semester, batch, department } = req.body;

    console.log('📚 Fetching important topics for weak areas:', { userId, semester, batch, department });

    // Validate input
    if (!userId || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userId and semester'
      });
    }

    // Fetch internal marks data
    const internalMarksData = await InternalMarks.findOne({
      userId,
      semester: parseInt(semester)
    });

    if (!internalMarksData) {
      return res.status(404).json({
        success: false,
        message: 'Internal marks data not found. Please enter your marks first.'
      });
    }

    // Fetch syllabus data with new schema (branch instead of department)
    const syllabusQuery = { 
      batch, 
      branch: department,
      semester: parseInt(semester)
    };
    console.log('📚 Syllabus query:', syllabusQuery);
    
    const syllabusData = await Syllabus.find(syllabusQuery);

    if (syllabusData.length === 0) {
      // Try alternate query without semester filter
      const altQuery = { batch, branch: department };
      const altSyllabusData = await Syllabus.find(altQuery);
      
      if (altSyllabusData.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No syllabus found for batch ${batch}, branch ${department}. Please ask admin to upload syllabus.`
        });
      }
      
      // Use the alternate data
      console.log(`✅ Found ${altSyllabusData.length} syllabus records (all semesters)`);
      return processTopics(res, internalMarksData, altSyllabusData);
    }

    console.log(`✅ Found ${syllabusData.length} syllabus records`);
    return processTopics(res, internalMarksData, syllabusData);

  } catch (error) {
    console.error('❌ Error fetching important topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to identify important topics',
      error: error.message
    });
  }
});

/**
 * Helper function to extract course number from course code
 * e.g., 22AML132 -> 132, 22CSE132 -> 132, 22MAI131 -> 131
 */
function extractCourseNumber(courseCode) {
  if (!courseCode) return null;
  // Pattern: YYXXX### where YY=year, XXX=branch, ###=number
  const match = courseCode.match(/\d{2}[A-Z]{2,4}(\d{2,3})$/i);
  return match ? match[1] : null;
}

/**
 * Helper function to find matching syllabus for a course code
 * Uses fuzzy matching on course number when exact match not found
 */
function findMatchingSyllabus(courseCode, courseName, syllabusData) {
  // First try exact match
  let match = syllabusData.find(s => s.courseCode.toUpperCase() === courseCode.toUpperCase());
  if (match) return match;
  
  // Try matching by course number (e.g., 22AML132 matches 22CSE132)
  const courseNum = extractCourseNumber(courseCode);
  if (courseNum) {
    match = syllabusData.find(s => extractCourseNumber(s.courseCode) === courseNum);
    if (match) {
      console.log(`📌 Fuzzy matched: ${courseCode} -> ${match.courseCode} (${match.courseName})`);
      return match;
    }
  }
  
  // Try matching by course name similarity
  const normalizedName = courseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  match = syllabusData.find(s => {
    const syllabusName = s.courseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return syllabusName.includes(normalizedName.substring(0, 15)) || 
           normalizedName.includes(syllabusName.substring(0, 15));
  });
  if (match) {
    console.log(`📌 Name matched: ${courseName} -> ${match.courseName} (${match.courseCode})`);
    return match;
  }
  
  return null;
}

/**
 * Helper function to process topics with Groq
 */
async function processTopics(res, internalMarksData, syllabusData) {
  // Prepare performance data for Groq with matched syllabus
  const performanceData = {
    courses: internalMarksData.courses.map(course => {
      // Find matching syllabus for this course
      const matchedSyllabus = findMatchingSyllabus(course.courseCode, course.courseName, syllabusData);
      
      return {
        courseCode: course.courseCode,
        courseName: course.courseName,
        ia1: course.ia1,
        ia2: course.ia2,
        ia3: course.ia3,
        attendance: course.attendancePercentage,
        // Include matched syllabus code for reference
        matchedSyllabusCode: matchedSyllabus?.courseCode || null
      };
    })
  };

  // Only include syllabus entries that have a matching course in performance data
  const matchedCourseCodes = new Set(
    performanceData.courses
      .map(c => c.matchedSyllabusCode)
      .filter(Boolean)
  );
  
  // Prepare syllabus data for Groq (convert new schema to expected format)
  const enrichedSyllabusData = syllabusData
    .filter(syllabus => matchedCourseCodes.has(syllabus.courseCode))
    .map(syllabus => ({
      courseCode: syllabus.courseCode,
      courseName: syllabus.courseName,
      modules: [
        { moduleNumber: 1, title: 'Module 1', topics: syllabus.module_1_topics ? syllabus.module_1_topics.split(',').map(t => t.trim()) : [] },
        { moduleNumber: 2, title: 'Module 2', topics: syllabus.module_2_topics ? syllabus.module_2_topics.split(',').map(t => t.trim()) : [] },
        { moduleNumber: 3, title: 'Module 3', topics: syllabus.module_3_topics ? syllabus.module_3_topics.split(',').map(t => t.trim()) : [] },
        { moduleNumber: 4, title: 'Module 4', topics: syllabus.module_4_topics ? syllabus.module_4_topics.split(',').map(t => t.trim()) : [] },
        { moduleNumber: 5, title: 'Module 5', topics: syllabus.module_5_topics ? syllabus.module_5_topics.split(',').map(t => t.trim()) : [] }
      ]
  }));
  
  console.log(`📊 Matched ${enrichedSyllabusData.length} courses with syllabus data`);

  // If no matches found, use all available syllabus data
  const finalSyllabusData = enrichedSyllabusData.length > 0 ? enrichedSyllabusData : syllabusData.map(syllabus => ({
    courseCode: syllabus.courseCode,
    courseName: syllabus.courseName,
    modules: [
      { moduleNumber: 1, title: 'Module 1', topics: syllabus.module_1_topics ? syllabus.module_1_topics.split(',').map(t => t.trim()) : [] },
      { moduleNumber: 2, title: 'Module 2', topics: syllabus.module_2_topics ? syllabus.module_2_topics.split(',').map(t => t.trim()) : [] },
      { moduleNumber: 3, title: 'Module 3', topics: syllabus.module_3_topics ? syllabus.module_3_topics.split(',').map(t => t.trim()) : [] },
      { moduleNumber: 4, title: 'Module 4', topics: syllabus.module_4_topics ? syllabus.module_4_topics.split(',').map(t => t.trim()) : [] },
      { moduleNumber: 5, title: 'Module 5', topics: syllabus.module_5_topics ? syllabus.module_5_topics.split(',').map(t => t.trim()) : [] }
    ]
  }));

  // Call Groq to identify important topics
  const importantTopics = await groqService.getImportantTopicsForWeakAreas(
    performanceData,
    finalSyllabusData
  );

  // Add IA module mapping info to response
  importantTopics.moduleMapping = groqService.IA_MODULE_MAPPING;

  res.json({
    success: true,
    message: 'Important topics identified successfully',
    data: importantTopics
  });
}

/**
 * POST /api/assessment/analyze
 * Analyze student's internal marks using AI
 */
router.post('/analyze', async (req, res) => {
  try {
    const { userId, semester, selectedTests, batch, department } = req.body;

    console.log('📊 Assessment analysis requested:', { userId, semester, selectedTests, batch, department });
    console.log('🔑 API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 API Key length:', process.env.GEMINI_API_KEY?.length);

    // Validate input
    if (!userId || !semester || !selectedTests || selectedTests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userId, semester, and selectedTests'
      });
    }

    // Fetch internal marks data
    console.log('🔍 Querying InternalMarks:', { userId, semester: parseInt(semester) });
    const internalMarksData = await InternalMarks.findOne({ 
      userId, 
      semester: parseInt(semester) 
    });

    console.log('📦 InternalMarks data found:', !!internalMarksData);
    console.log('📚 Number of courses:', internalMarksData?.courses?.length);

    if (!internalMarksData) {
      return res.status(404).json({
        success: false,
        message: 'Internal marks data not found for this semester. Please enter and save your internal marks first.'
      });
    }

    // Prepare data for analysis
    console.log('📊 Preparing courses data...');
    const coursesData = internalMarksData.courses.map(course => {
      const testScores = {};
      
      if (selectedTests.includes('ia1')) testScores.ia1 = course.ia1 || 0;
      if (selectedTests.includes('ia2')) testScores.ia2 = course.ia2 || 0;
      if (selectedTests.includes('ia3')) testScores.ia3 = course.ia3 || 0;

      return {
        courseCode: course.courseCode,
        courseName: course.courseName,
        ...testScores,
        labMarks: course.lab || 0,
        attendance: course.attendancePercentage || 0,
        totalInternal: course.totalInternal || 0
      };
    });
    console.log('✅ Courses data prepared:', JSON.stringify(coursesData, null, 2));

    // Calculate overall statistics
    console.log('📈 Calculating overall statistics...');
    const overallStats = {
      selectedTests: selectedTests.join(', ').toUpperCase(),
      semester: semester,
      totalCourses: coursesData.length,
      avgScores: {}
    };

    selectedTests.forEach(test => {
      const scores = coursesData.map(c => c[test] || 0).filter(s => s > 0);
      if (scores.length > 0) {
        overallStats.avgScores[test.toUpperCase()] = (
          scores.reduce((a, b) => a + b, 0) / scores.length
        ).toFixed(2);
      }
    });
    console.log('✅ Overall stats calculated:', JSON.stringify(overallStats, null, 2));

    // Create AI prompt
    const prompt = `You are an expert academic advisor analyzing a student's internal assessment performance.

**Student Data:**
Semester: ${semester}
Selected Internal Tests: ${selectedTests.join(', ').toUpperCase()}
Total Courses: ${coursesData.length}

**Course-wise Performance:**
${JSON.stringify(coursesData, null, 2)}

**Overall Statistics:**
${JSON.stringify(overallStats, null, 2)}

**Task:**
Analyze this student's performance and provide:

1. **Overall Assessment**: Brief summary of performance (2-3 sentences)
2. **Strengths**: List 3 subjects/areas where student is performing well
3. **Weaknesses**: List 3 subjects/areas that need improvement
4. **Specific Recommendations**: Provide 5 actionable recommendations with specific subject names
5. **Trend Analysis**: Analyze if there are patterns across ${selectedTests.join(', ')} (if multiple tests selected)
6. **Priority Actions**: List top 3 immediate actions student should take

**Important:**
- Be specific and mention actual course names/codes
- Provide practical, actionable advice
- Focus on the selected tests: ${selectedTests.join(', ').toUpperCase()}
- Consider attendance patterns if relevant
- Use encouraging language while being honest about areas needing improvement

**Response Format (JSON):**
{
  "overallAssessment": "string",
  "performanceScore": number (0-100),
  "strengths": [
    { "subject": "string", "reason": "string", "score": number }
  ],
  "weaknesses": [
    { "subject": "string", "issue": "string", "score": number }
  ],
  "recommendations": [
    { "priority": "high|medium|low", "action": "string", "subject": "string" }
  ],
  "trendAnalysis": "string",
  "priorityActions": ["string", "string", "string"],
  "chartData": {
    "performanceBySubject": [
      { "subject": "string", "score": number }
    ],
    "testComparison": [
      { "test": "string", "avgScore": number }
    ]
  }
}

Respond with ONLY the JSON object, no markdown or code blocks.`;

    console.log('\n' + '='.repeat(80));
    console.log('📝 FULL PROMPT BEING SENT TO GEMINI:');
    console.log('='.repeat(80));
    console.log(prompt);
    console.log('='.repeat(80) + '\n');
    
    console.log('🤖 Sending request to Gemini AI...');
    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('🎯 Model being used: gemini-1.5-flash-latest');

    // Call Gemini AI - use gemini-1.5-flash-latest
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✅ Model initialized successfully');
    
    console.log('⏳ Calling generateContent...');
    const result = await model.generateContent(prompt);
    console.log('✅ generateContent completed');
    
    console.log('⏳ Getting response...');
    const response = await result.response;
    console.log('✅ Response object retrieved');
    
    console.log('⏳ Extracting text from response...');
    let aiAnalysis = response.text();
    console.log('✅ Text extracted, length:', aiAnalysis.length);
    console.log('\n' + '='.repeat(80));
    console.log('🤖 RAW GEMINI RESPONSE:');
    console.log('='.repeat(80));
    console.log(aiAnalysis);
    console.log('='.repeat(80) + '\n');

    // Clean response
    aiAnalysis = aiAnalysis.trim();
    if (aiAnalysis.startsWith('```json')) {
      aiAnalysis = aiAnalysis.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (aiAnalysis.startsWith('```')) {
      aiAnalysis = aiAnalysis.replace(/```\n?/g, '');
    }

    // Parse AI response
    let analysisData;
    try {
      analysisData = JSON.parse(aiAnalysis);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Create fallback response
      analysisData = {
        overallAssessment: 'Analysis completed. Please review your performance across selected assessments.',
        performanceScore: 70,
        strengths: coursesData.slice(0, 3).map(c => ({
          subject: c.courseName,
          reason: 'Performing adequately',
          score: c[selectedTests[0]] || 0
        })),
        weaknesses: [],
        recommendations: [
          { priority: 'high', action: 'Review course materials regularly', subject: 'All subjects' }
        ],
        trendAnalysis: 'Continue monitoring your progress across all assessments.',
        priorityActions: [
          'Focus on consistent study habits',
          'Attend all classes regularly',
          'Complete assignments on time'
        ],
        chartData: {
          performanceBySubject: coursesData.map(c => ({
            subject: c.courseCode,
            score: c[selectedTests[0]] || 0
          })),
          testComparison: selectedTests.map(test => ({
            test: test.toUpperCase(),
            avgScore: parseFloat(overallStats.avgScores[test.toUpperCase()] || 0)
          }))
        }
      };
    }

    // Add raw data for reference
    analysisData.rawData = {
      semester,
      selectedTests,
      coursesData,
      overallStats
    };

    // Step 2: Fetch syllabus data for courses in this semester
    console.log('📚 Fetching syllabus data for semester', semester, 'batch', batch, 'department', department);
    const courseCodes = coursesData.map(c => c.courseCode);
    const semesterInt = parseInt(semester);
    
    // Use new schema fields: branch instead of department
    const syllabusQuery = {
      semester: semesterInt,
      batch: batch,
      branch: department
    };
    
    let syllabusData = await Syllabus.find(syllabusQuery);
    
    // If no results, try without semester filter
    if (syllabusData.length === 0) {
      const altQuery = { batch, branch: department };
      syllabusData = await Syllabus.find(altQuery);
    }

    console.log(`✅ Found ${syllabusData.length} syllabus records for batch ${batch}, branch ${department}`);

    // Step 3: Send to Groq for topic-specific analysis
    let topicAnalysis = null;
    if (syllabusData.length > 0) {
      try {
        console.log('🤖 Sending data to Groq for topic analysis...');
        
        // Prepare performance data for Groq
        const performanceForGroq = {
          semester,
          selectedTests,
          coursePerformance: coursesData.map(course => {
            const perf = { ...course };
            selectedTests.forEach(test => {
              perf[`${test}Score`] = course[test] || 0;
            });
            return perf;
          })
        };

        // Convert new schema to expected format with modules array
        const enrichedSyllabusData = syllabusData.map(syllabus => {
          // Build modules array from individual module fields
          const modules = [
            { moduleNumber: 1, title: 'Module 1', topics: syllabus.module_1_topics ? syllabus.module_1_topics.split(',').map(t => t.trim()) : [], description: syllabus.module_1_topics || '' },
            { moduleNumber: 2, title: 'Module 2', topics: syllabus.module_2_topics ? syllabus.module_2_topics.split(',').map(t => t.trim()) : [], description: syllabus.module_2_topics || '' },
            { moduleNumber: 3, title: 'Module 3', topics: syllabus.module_3_topics ? syllabus.module_3_topics.split(',').map(t => t.trim()) : [], description: syllabus.module_3_topics || '' },
            { moduleNumber: 4, title: 'Module 4', topics: syllabus.module_4_topics ? syllabus.module_4_topics.split(',').map(t => t.trim()) : [], description: syllabus.module_4_topics || '' },
            { moduleNumber: 5, title: 'Module 5', topics: syllabus.module_5_topics ? syllabus.module_5_topics.split(',').map(t => t.trim()) : [], description: syllabus.module_5_topics || '' }
          ];
          
          // Filter to only relevant modules based on selected tests
          const relevantModules = [];
          selectedTests.forEach(test => {
            const testModules = groqService.getModulesForIA(modules, test);
            testModules.forEach(m => {
              if (!relevantModules.find(rm => rm.moduleNumber === m.moduleNumber)) {
                relevantModules.push({
                  ...m,
                  coveredInIA: test.toUpperCase()
                });
              }
            });
          });

          return {
            courseCode: syllabus.courseCode,
            courseName: syllabus.courseName,
            modules: relevantModules.length > 0 ? relevantModules : modules
          };
        });

        topicAnalysis = await groqService.analyzePerformanceWithSyllabus(
          performanceForGroq,
          enrichedSyllabusData
        );

        console.log('✅ Topic analysis received from Groq');
        analysisData.topicAnalysis = topicAnalysis;

      } catch (groqError) {
        console.error('⚠️  Groq analysis failed:', groqError.message);
        analysisData.topicAnalysis = {
          error: 'Topic analysis unavailable',
          message: 'Syllabus-based analysis could not be completed'
        };
      }
    } else {
      analysisData.topicAnalysis = {
        message: `No syllabus data available for semester ${semester}, batch ${batch || 'not specified'}, branch ${department || 'not specified'}`,
        recommendation: `Please add course syllabus data for batch ${batch} - ${department} semester ${semester} using the /api/syllabus/add-course endpoint to enable topic-specific analysis`
      };
    }

    res.json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysisData
    });

  } catch (error) {
    console.error('❌ Error in assessment analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze assessment data',
      error: error.message
    });
  }
});

module.exports = router;
