const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Syllabus = require('../models/Syllabus');

// Try to import pdf-parse (handle different versions)
let pdfParse;
try {
  const pdfParseModule = require('pdf-parse');
  if (pdfParseModule.PDFParse) {
    // v2 API
    pdfParse = async (dataBuffer) => {
      const pdf = new pdfParseModule.PDFParse({ data: dataBuffer });
      const result = await pdf.getText();
      return { text: result.text };
    };
  } else {
    // v1 API
    pdfParse = async (dataBuffer) => {
      const result = await pdfParseModule(dataBuffer);
      return { text: result.text };
    };
  }
} catch (e) {
  console.warn('pdf-parse not available, PDF parsing will be limited');
  pdfParse = async () => ({ text: '' });
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/syllabus');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `syllabus-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

/**
 * POST /api/syllabus/upload
 * Upload syllabus PDF and extract course-wise data
 */
router.post('/upload', upload.single('syllabus'), async (req, res) => {
  try {
    const { batch, department, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      });
    }

    if (!batch || !department) {
      return res.status(400).json({
        success: false,
        message: 'Batch and department are required'
      });
    }

    console.log('📄 Processing syllabus PDF:', req.file.filename, 'for batch:', batch, 'department:', department);

    // Extract text from PDF
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfResult = await pdfParse(dataBuffer);
    const extractedContent = pdfResult.text;
    console.log('✅ PDF text extracted, length:', extractedContent.length);

    // Parse courses from the PDF content
    const courses = parseCoursesFromText(extractedContent, batch, department, semester ? parseInt(semester) : null);
    console.log(`📚 Found ${courses.length} courses in the PDF`);

    // Save each course as a separate syllabus record
    const savedCourses = [];
    const errors = [];

    for (const course of courses) {
      try {
        const syllabusData = {
          batch: course.batch,
          branch: course.branch,
          semester: course.semester,
          courseCode: course.courseCode,
          courseName: course.courseName,
          module_1_topics: course.module_1_topics,
          module_2_topics: course.module_2_topics,
          module_3_topics: course.module_3_topics,
          module_4_topics: course.module_4_topics,
          module_5_topics: course.module_5_topics,
          department: department,
          fileName: req.file.originalname.replace('.pdf', ''),
          pdfPath: req.file.path,
          uploadedBy: req.user?.userId || 'admin'
        };

        const saved = await Syllabus.findOneAndUpdate(
          {
            batch: course.batch,
            branch: course.branch,
            semester: course.semester,
            courseCode: course.courseCode
          },
          syllabusData,
          { upsert: true, new: true }
        );
        savedCourses.push(saved);
      } catch (err) {
        console.error(`❌ Error saving course ${course.courseCode}:`, err.message);
        errors.push({ courseCode: course.courseCode, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Syllabus uploaded successfully. ${savedCourses.length} courses saved.`,
      data: {
        coursesFound: courses.length,
        coursesSaved: savedCourses.length,
        courses: savedCourses.map(c => ({
          courseCode: c.courseCode,
          courseName: c.courseName,
          semester: c.semester
        })),
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('❌ Error uploading syllabus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload syllabus',
      error: error.message
    });
  }
});

/**
 * POST /api/syllabus/add-course
 * Manually add a single course syllabus
 */
router.post('/add-course', async (req, res) => {
  try {
    const {
      batch,
      branch,
      semester,
      courseCode,
      courseName,
      module_1_topics,
      module_2_topics,
      module_3_topics,
      module_4_topics,
      module_5_topics
    } = req.body;

    // Validate required fields
    if (!batch || !branch || !semester || !courseCode || !courseName) {
      return res.status(400).json({
        success: false,
        message: 'batch, branch, semester, courseCode, and courseName are required'
      });
    }

    const syllabusData = {
      batch,
      branch,
      semester: parseInt(semester),
      courseCode: courseCode.toUpperCase(),
      courseName,
      module_1_topics: module_1_topics || '',
      module_2_topics: module_2_topics || '',
      module_3_topics: module_3_topics || '',
      module_4_topics: module_4_topics || '',
      module_5_topics: module_5_topics || '',
      department: branch,
      uploadedBy: req.user?.userId || 'admin'
    };

    const syllabus = await Syllabus.findOneAndUpdate(
      { batch, branch, semester: parseInt(semester), courseCode: courseCode.toUpperCase() },
      syllabusData,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Course syllabus added successfully',
      data: syllabus
    });

  } catch (error) {
    console.error('❌ Error adding course syllabus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add course syllabus',
      error: error.message
    });
  }
});

/**
 * GET /api/syllabus/courses
 * Get all courses for a batch/branch/semester
 */
router.get('/courses', async (req, res) => {
  try {
    const { batch, branch, semester, department } = req.query;

    const query = {};
    if (batch) query.batch = batch;
    if (branch) query.branch = branch;
    if (department) query.branch = department; // Support both 'branch' and 'department'
    if (semester) query.semester = parseInt(semester);

    console.log('📚 Fetching syllabus with query:', query);

    const syllabi = await Syllabus.find(query).select('-pdfPath');

    console.log(`✅ Found ${syllabi.length} syllabus records`);

    res.json({
      success: true,
      count: syllabi.length,
      data: syllabi
    });

  } catch (error) {
    console.error('❌ Error fetching syllabi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch syllabi',
      error: error.message
    });
  }
});

/**
 * GET /api/syllabus/semester/:semester
 * Get all syllabi for a semester
 */
router.get('/semester/:semester', async (req, res) => {
  try {
    const { semester } = req.params;
    const { batch, branch, department } = req.query;

    const query = { semester: parseInt(semester) };
    if (batch) query.batch = batch;
    if (branch || department) query.branch = branch || department;

    const syllabi = await Syllabus.find(query).select('-pdfPath');

    res.json({
      success: true,
      count: syllabi.length,
      data: syllabi
    });

  } catch (error) {
    console.error('❌ Error fetching syllabi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch syllabi',
      error: error.message
    });
  }
});

/**
 * GET /api/syllabus/:courseCode/:semester
 * Get specific syllabus by course code and semester
 */
router.get('/:courseCode/:semester', async (req, res) => {
  try {
    const { courseCode, semester } = req.params;
    const { batch, branch } = req.query;

    const query = {
      courseCode: courseCode.toUpperCase(),
      semester: parseInt(semester)
    };
    if (batch) query.batch = batch;
    if (branch) query.branch = branch;

    const syllabus = await Syllabus.findOne(query);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }

    res.json({
      success: true,
      data: syllabus
    });

  } catch (error) {
    console.error('❌ Error fetching syllabus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch syllabus',
      error: error.message
    });
  }
});

/**
 * DELETE /api/syllabus/:id
 * Delete syllabus
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const syllabus = await Syllabus.findById(id);
    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: 'Syllabus not found'
      });
    }

    // Delete PDF file if exists
    if (syllabus.pdfPath) {
      try {
        await fs.unlink(syllabus.pdfPath);
      } catch (err) {
        console.warn('Could not delete PDF file:', err.message);
      }
    }

    await Syllabus.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting syllabus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete syllabus',
      error: error.message
    });
  }
});

/**
 * Parse courses from PDF text
 * Extracts course code, course name, and module-wise topics
 * Handles VTU syllabus format with Module-1, Module-2, etc.
 */
function parseCoursesFromText(text, batch, department, defaultSemester) {
  const courses = [];
  const processedCodes = new Set(); // Track processed course codes
  
  console.log('📄 Starting PDF parsing...');
  console.log('📄 Text length:', text.length);
  
  // Try to find semester from text
  const semesterMatch = text.match(/Semester\s*[:\-]?\s*(I{1,3}|IV|V|VI|VII|VIII|\d+)/i);
  let semester = defaultSemester || 1;
  if (semesterMatch) {
    const semStr = semesterMatch[1].toUpperCase();
    const romanToNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8 };
    semester = romanToNum[semStr] || parseInt(semStr) || defaultSemester || 1;
  }
  console.log('📄 Detected semester:', semester);

  // STRATEGY: Find all "Course Code: XXXX" occurrences and extract course name from nearby text
  // This handles both "Course: name" and "Course Name: name" formats
  const courseCodePattern = /Course\s*Code\s*[:\-]?\s*(\d{2}[A-Z]{2,4}\d{2,3})/gi;
  
  let match;
  const coursePositions = [];
  
  // Find all course code positions
  while ((match = courseCodePattern.exec(text)) !== null) {
    const courseCode = match[1].toUpperCase();
    
    // Skip if already found (take first occurrence only)
    if (processedCodes.has(courseCode)) continue;
    processedCodes.add(courseCode);
    
    // Look backwards for course name (within 500 chars before the Course Code)
    const lookbackStart = Math.max(0, match.index - 500);
    const lookbackText = text.substring(lookbackStart, match.index);
    
    // Try multiple patterns to find course name
    let courseName = '';
    
    // Pattern 1: "Course: <name>" or "Course Name: <name>"
    const nameMatch1 = lookbackText.match(/Course\s*(?:Name)?\s*[:\-]\s*([A-Za-z][A-Za-z0-9\s,&\-()]+?)(?:\s*Course\s*Code|\s*L\s*:\s*T|$)/is);
    if (nameMatch1) {
      courseName = nameMatch1[1].trim();
    }
    
    // Pattern 2: Look for capitalized text before course code (often course title)
    if (!courseName) {
      const nameMatch2 = lookbackText.match(/([A-Z][A-Za-z\s&,\-]+(?:and|with|for|of|in)?[A-Za-z\s&,\-]+?)\s*(?:Course\s*Code|$)/s);
      if (nameMatch2 && nameMatch2[1].length > 5 && nameMatch2[1].length < 100) {
        courseName = nameMatch2[1].trim();
      }
    }
    
    // Pattern 3: From line starting with "Semester" look for text after
    if (!courseName) {
      const nameMatch3 = lookbackText.match(/Semester\s*[:\-]?\s*(?:I{1,3}|IV|V|VI|VII|VIII|\d+)\s+([A-Za-z][A-Za-z\s&,\-]+)/i);
      if (nameMatch3) {
        courseName = nameMatch3[1].trim();
      }
    }
    
    // Clean up course name
    courseName = courseName
      .replace(/\s+/g, ' ')
      .replace(/^[:\-\s]+/, '')
      .replace(/[:\-\s]+$/, '')
      .replace(/\(Common.*?\)/gi, '')
      .replace(/BNM\s*Institute.*/gi, '')
      .replace(/Dept\.?\s*of.*/gi, '')
      .trim();
    
    if (!courseName || courseName.length < 3) {
      courseName = `Course ${courseCode}`;
    }
    
    coursePositions.push({
      code: courseCode,
      name: courseName.substring(0, 100),
      index: match.index
    });
  }
  
  // Reset for actual processing
  processedCodes.clear();
  
  console.log(`📄 Found ${coursePositions.length} unique course codes:`, coursePositions.map(m => m.code));

  // Process each course - extract text section and parse modules
  for (let i = 0; i < coursePositions.length; i++) {
    const current = coursePositions[i];
    
    // Skip duplicates
    if (processedCodes.has(current.code)) continue;
    processedCodes.add(current.code);
    
    const next = coursePositions[i + 1];
    
    // Extract section for this course (from current position to next course or limit to 10000 chars)
    const startIdx = current.index;
    const endIdx = next ? next.index : Math.min(startIdx + 15000, text.length);
    const courseSection = text.substring(startIdx, endIdx);
    
    console.log(`📄 Processing course: ${current.code} - ${current.name}`);
    console.log(`📄 Section length: ${courseSection.length} chars`);

    // Extract modules from this course section
    const modules = extractModulesFromSection(courseSection);
    
    // Log what we found
    for (let m = 1; m <= 5; m++) {
      if (modules[m]) {
        console.log(`  ✅ Module ${m}: ${modules[m].substring(0, 80)}...`);
      }
    }
    
    courses.push({
      batch,
      branch: department,
      semester,
      courseCode: current.code,
      courseName: current.name,
      module_1_topics: modules[1] || '',
      module_2_topics: modules[2] || '',
      module_3_topics: modules[3] || '',
      module_4_topics: modules[4] || '',
      module_5_topics: modules[5] || ''
    });
  }

  // FALLBACK: If nothing found, try simple extraction
  if (courses.length === 0) {
    console.log('📄 Main strategy found nothing, trying fallback...');
    const simpleCourse = parseAlternativeFormat(text, batch, department, semester);
    if (simpleCourse) {
      courses.push(simpleCourse);
    }
  }

  console.log(`📄 Total courses extracted: ${courses.length}`);
  return courses;
}

/**
 * Extract module topics from a course section
 * Handles VTU format: "Module-1:", "Module 1:", etc.
 */
function extractModulesFromSection(text) {
  const modules = { 1: '', 2: '', 3: '', 4: '', 5: '' };
  
  // Find all module positions first
  const modulePositions = [];
  const moduleHeaderPattern = /Module\s*[-–]?\s*(\d)\s*[:\-–]?\s*/gi;
  let match;
  
  while ((match = moduleHeaderPattern.exec(text)) !== null) {
    const moduleNum = parseInt(match[1]);
    if (moduleNum >= 1 && moduleNum <= 5) {
      // Avoid duplicates - only take first occurrence of each module
      if (!modulePositions.find(p => p.num === moduleNum)) {
        modulePositions.push({
          num: moduleNum,
          index: match.index,
          headerEnd: match.index + match[0].length
        });
      }
    }
  }
  
  // Sort by position in text
  modulePositions.sort((a, b) => a.index - b.index);
  
  // Extract content for each module
  for (let i = 0; i < modulePositions.length; i++) {
    const current = modulePositions[i];
    const next = modulePositions[i + 1];
    
    // Content starts after the header
    const contentStart = current.headerEnd;
    
    // Content ends at next module, or at common end markers, or after reasonable length
    let contentEnd;
    if (next) {
      contentEnd = next.index;
    } else {
      // Find end markers
      const remainingText = text.substring(contentStart);
      const endPatterns = [
        /\n\s*Course\s*Outcomes?\s*:/i,
        /\n\s*Text\s*Books?\s*:/i,
        /\n\s*Reference\s*Books?\s*:/i,
        /\n\s*Scheme\s*of\s*/i,
        /\n\s*Assessment\s*Details/i,
        /\n\s*Examination\s*/i,
        /\n\s*Marks\s*Distribution/i,
        /\n\s*CIA\s*Marks/i,
        /\n\s*SEA\s*Marks/i
      ];
      
      let minEnd = remainingText.length;
      for (const pattern of endPatterns) {
        const endMatch = remainingText.match(pattern);
        if (endMatch && endMatch.index < minEnd) {
          minEnd = endMatch.index;
        }
      }
      contentEnd = contentStart + Math.min(minEnd, 3000);
    }
    
    let content = text.substring(contentStart, contentEnd);
    
    // Clean up the content
    content = cleanModuleContent(content);
    
    if (content.length > 10) { // Only save if meaningful content
      modules[current.num] = content;
    }
  }
  
  // If regex approach didn't work, try line-by-line
  if (!modules[1] && !modules[2] && !modules[3]) {
    const lines = text.split(/\r?\n/);
    let currentModule = 0;
    let currentContent = [];
    
    for (const line of lines) {
      const moduleMatch = line.match(/Module\s*[-–]?\s*(\d)/i);
      if (moduleMatch) {
        // Save previous module content
        if (currentModule >= 1 && currentModule <= 5 && currentContent.length > 0) {
          modules[currentModule] = cleanModuleContent(currentContent.join(' '));
        }
        
        currentModule = parseInt(moduleMatch[1]);
        currentContent = [];
        
        // Get content after header on same line
        const afterHeader = line.substring(moduleMatch.index + moduleMatch[0].length);
        if (afterHeader.trim().length > 2) {
          currentContent.push(afterHeader.trim());
        }
      } else if (currentModule >= 1 && currentModule <= 5) {
        // Skip noise lines
        const trimmed = line.trim();
        if (trimmed.length > 2 && 
            !trimmed.match(/^(L\s*:\s*T|Credits|Hours|No\.\s*of|Blooms|cognitive|Level|CO\d|SEA|CIA|CIE|SEE|\d+\s*$)/i) &&
            !trimmed.match(/^(Course\s*Outcomes?|Text\s*Books?|Reference|Scheme|Assessment|Examination)/i)) {
          currentContent.push(trimmed);
        }
      }
    }
    
    // Save last module
    if (currentModule >= 1 && currentModule <= 5 && currentContent.length > 0) {
      modules[currentModule] = cleanModuleContent(currentContent.join(' '));
    }
  }
  
  return modules;
}

/**
 * Clean up module content
 */
function cleanModuleContent(content) {
  return content
    .replace(/No\.\s*of\s*hours/gi, '')
    .replace(/Blooms\s*cognitive\s*Levels?/gi, '')
    .replace(/L\s*:\s*\d+/gi, '')
    .replace(/T\s*:\s*\d+/gi, '')
    .replace(/CO\d+\s*(Apply|Understand|Remember|Analyze|Evaluate|Create)?/gi, '')
    .replace(/\d+\s*Hours?/gi, '')
    .replace(/Examples?\s*from\s*Engineering\s*field\s*that\s*require/gi, '')
    .replace(/Lab\s*Component\s*:/gi, 'Lab:')
    .replace(/Self[- ]?study/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*\.\s*/g, '. ')
    .replace(/^[\s,.\-:]+/, '')
    .replace(/[\s,.\-:]+$/, '')
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Alternative parsing for different PDF formats
 */
function parseAlternativeFormat(text, batch, department, semester) {
  // Try to extract at least one course from the text
  const lines = text.split('\n').filter(l => l.trim());
  
  let courseName = '';
  let courseCode = '';
  const modules = { 1: '', 2: '', 3: '', 4: '', 5: '' };
  
  // Look for course info
  for (const line of lines.slice(0, 30)) {
    if (!courseCode) {
      const codeMatch = line.match(/(\d{2}[A-Z]{2,4}\d{2,3}|B[A-Z]{2,3}\d{3})/i);
      if (codeMatch) {
        courseCode = codeMatch[1].toUpperCase();
      }
    }
    if (!courseName && line.match(/Course\s*[:\-]/i)) {
      courseName = line.replace(/Course\s*[:\-]/i, '').trim().substring(0, 100);
    }
  }
  
  if (!courseCode) {
    return null;
  }
  
  // Extract modules
  const moduleData = extractModulesFromSection(text);
  
  return {
    batch,
    branch: department,
    semester,
    courseCode,
    courseName: courseName || `Course ${courseCode}`,
    module_1_topics: moduleData[1] || '',
    module_2_topics: moduleData[2] || '',
    module_3_topics: moduleData[3] || '',
    module_4_topics: moduleData[4] || '',
    module_5_topics: moduleData[5] || ''
  };
}

/**
 * Extract semester from course code
 * e.g., 22AI132 -> semester might be encoded in the number
 */
function extractSemesterFromCode(courseCode) {
  // Common patterns:
  // 22AI132 - last digit before course number might indicate semester
  // 21CS51 - 5th semester (first digit of last two)
  // BCS301 - 3rd semester
  
  const match = courseCode.match(/(\d)(\d{2})$/);
  if (match) {
    const semDigit = parseInt(match[1]);
    if (semDigit >= 1 && semDigit <= 8) {
      return semDigit;
    }
  }
  
  return null;
}

module.exports = router;
