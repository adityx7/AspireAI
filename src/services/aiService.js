const crypto = require('crypto');

// Configure AI provider
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai', 'claude', 'google'
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4-turbo-preview';

// Import AI SDK based on provider
let aiClient;
if (AI_PROVIDER === 'openai') {
  const { OpenAI } = require('openai');
  aiClient = new OpenAI({ apiKey: AI_API_KEY });
} else if (AI_PROVIDER === 'claude') {
  const { Anthropic } = require('@anthropic-ai/sdk');
  aiClient = new Anthropic({ apiKey: AI_API_KEY });
}

/**
 * STRICT PROMPT TEMPLATE FOR STUDY PLAN GENERATION
 */
const STUDY_PLAN_PROMPT = `You are an academic mentor AI. Given this student profile and risk report, produce a JSON response.

RESPONSE FORMAT (STRICT JSON):

{
  "insights": [
     { "title": "", "detail": "", "severity": "low|medium|high" }
  ],
  "planLength": 7 | 14 | 28,
  "plan": [
    {
      "day": Number,
      "date": "YYYY-MM-DD",
      "tasks": [
        {
          "time": "HH:MM",
          "task": "",
          "durationMinutes": Number,
          "resourceUrl": ""
        }
      ]
    }
  ],
  "resources": [ { "title": "", "url": "" } ],
  "mentorActions": [ "..." ]
}

Rules:
- No more than 5 hours of work per day.
- Include breaks.
- If attendance is low, include class attendance reminders.
- If IA is low, include topic-specific revision tasks.
- Include at least 2 free online resources per subject.
- Keep plan realistic for Indian college students.
- Tasks should be specific and actionable.
- Times should be in 24-hour format (HH:MM).
- Dates should be in YYYY-MM-DD format.
- Duration should be between 15-180 minutes.

STUDENT DATA:
{studentData}

RESPOND WITH ONLY THE JSON OBJECT. NO MARKDOWN, NO CODE BLOCKS, NO EXPLANATIONS.`;

/**
 * Generate study plan using AI
 * @param {Object} studentData - Student data with risk profile
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated study plan
 */
async function generateStudyPlan(studentData, options = {}) {
  const {
    maxRetries = 3,
    timeout = 90000,
    temperature = 0.7
  } = options;

  console.log('🤖 Generating AI study plan for student:', studentData.basicInfo?.usn);

  // Prepare prompt with student data
  const prompt = STUDY_PLAN_PROMPT.replace(
    '{studentData}',
    JSON.stringify(studentData, null, 2)
  );

  let lastError = null;

  // Retry logic
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 AI generation attempt ${attempt}/${maxRetries}`);

      const response = await callAI(prompt, {
        temperature,
        timeout,
        attempt
      });

      // Parse and validate response
      const parsedPlan = parseAIResponse(response);
      
      if (!parsedPlan) {
        throw new Error('Failed to parse AI response');
      }

      // Validate dates and structure
      const validatedPlan = validateAndEnhancePlan(parsedPlan, studentData);

      console.log('✅ AI study plan generated successfully');
      return validatedPlan;

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      lastError = error;

      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${attempt * 2} seconds...`);
        await sleep(attempt * 2000);
      }
    }
  }

  // If all retries failed, return fallback plan
  console.warn('⚠️ All AI attempts failed, generating fallback plan');
  return generateFallbackPlan(studentData);
}

/**
 * Call AI API based on provider
 * @param {String} prompt - The prompt to send
 * @param {Object} options - Call options
 * @returns {Promise<String>} - AI response text
 */
async function callAI(prompt, options = {}) {
  const { temperature = 0.7, timeout = 90000 } = options;

  try {
    if (AI_PROVIDER === 'openai' && aiClient) {
      const completion = await Promise.race([
        aiClient.chat.completions.create({
          model: AI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic mentor AI. You generate structured JSON study plans for students.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          response_format: { type: 'json_object' }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI call timeout')), timeout)
        )
      ]);

      return completion.choices[0].message.content;

    } else if (AI_PROVIDER === 'claude' && aiClient) {
      const message = await Promise.race([
        aiClient.messages.create({
          model: AI_MODEL,
          max_tokens: 4096,
          temperature: temperature,
          messages: [{
            role: 'user',
            content: prompt
          }]
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI call timeout')), timeout)
        )
      ]);

      return message.content[0].text;

    } else {
      throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
    }

  } catch (error) {
    console.error('AI API call error:', error);
    throw error;
  }
}

/**
 * Parse AI response and extract JSON
 * @param {String} response - Raw AI response
 * @returns {Object|null} - Parsed JSON object
 */
function parseAIResponse(response) {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    
    // Remove ```json and ``` markers
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/, '');
    cleaned = cleaned.replace(/```\s*$/, '');
    
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse AI response:', error.message);
    console.error('Raw response:', response.substring(0, 500));
    return null;
  }
}

/**
 * Validate and enhance AI-generated plan
 * @param {Object} plan - Parsed plan from AI
 * @param {Object} studentData - Original student data
 * @returns {Object} - Validated and enhanced plan
 */
function validateAndEnhancePlan(plan, studentData) {
  // Ensure required fields exist
  if (!plan.insights) plan.insights = [];
  if (!plan.plan) plan.plan = [];
  if (!plan.resources) plan.resources = [];
  if (!plan.mentorActions) plan.mentorActions = [];
  if (!plan.planLength) plan.planLength = 7;

  // Validate and fix dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  plan.plan = plan.plan.map((dayPlan, index) => {
    // Calculate correct date
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + index);

    return {
      day: index + 1,
      date: dayDate,
      tasks: (dayPlan.tasks || []).map(task => ({
        time: task.time || '09:00',
        task: task.task || 'Study session',
        durationMinutes: Math.min(Math.max(task.durationMinutes || 60, 15), 180),
        resourceUrl: task.resourceUrl || '',
        completed: false
      }))
    };
  });

  // Ensure plan length matches
  if (plan.plan.length !== plan.planLength) {
    console.warn(`Plan length mismatch: expected ${plan.planLength}, got ${plan.plan.length}`);
    plan.planLength = plan.plan.length;
  }

  // Add risk profile from student data
  if (studentData.riskProfile) {
    plan.riskProfile = studentData.riskProfile;
  }

  return plan;
}

/**
 * Generate fallback plan when AI fails
 * @param {Object} studentData - Student data
 * @returns {Object} - Basic study plan
 */
function generateFallbackPlan(studentData) {
  console.log('📋 Generating fallback study plan');

  const { riskProfile, basicInfo } = studentData;
  const planLength = riskProfile?.overallRisk === 'high' ? 14 : 7;
  
  const insights = [
    {
      title: 'Automated Study Plan',
      detail: 'This is an automated study plan. For personalized recommendations, ensure all your academic data is up to date.',
      severity: 'low'
    }
  ];

  // Add insights based on risk profile
  if (riskProfile?.lowAttendance?.length > 0) {
    insights.push({
      title: 'Attendance Alert',
      detail: `You have low attendance in ${riskProfile.lowAttendance.length} subject(s). Focus on attending all upcoming classes.`,
      severity: 'high'
    });
  }

  if (riskProfile?.weakSubjects?.length > 0) {
    insights.push({
      title: 'Performance Improvement Needed',
      detail: `${riskProfile.weakSubjects.length} subject(s) require additional focus and revision.`,
      severity: 'medium'
    });
  }

  // Generate daily plan
  const plan = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < planLength; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    const tasks = [
      {
        time: '09:00',
        task: 'Morning revision - Review previous day concepts',
        durationMinutes: 60,
        resourceUrl: '',
        completed: false
      },
      {
        time: '14:00',
        task: 'Practice problems and exercises',
        durationMinutes: 90,
        resourceUrl: '',
        completed: false
      },
      {
        time: '17:00',
        task: 'Attend all scheduled classes',
        durationMinutes: 60,
        resourceUrl: '',
        completed: false
      },
      {
        time: '20:00',
        task: 'Evening study session - Focus on weak areas',
        durationMinutes: 90,
        resourceUrl: '',
        completed: false
      }
    ];

    plan.push({
      day: i + 1,
      date: dayDate,
      tasks: tasks
    });
  }

  const resources = [
    {
      title: 'Khan Academy',
      url: 'https://www.khanacademy.org/'
    },
    {
      title: 'Coursera Free Courses',
      url: 'https://www.coursera.org/courses?query=free'
    },
    {
      title: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/'
    }
  ];

  const mentorActions = [
    'Review student progress weekly',
    'Discuss attendance improvement strategy',
    'Provide additional practice materials',
    'Schedule one-on-one mentoring session'
  ];

  return {
    insights,
    planLength,
    plan,
    resources,
    mentorActions,
    riskProfile: riskProfile || {},
    fallback: true
  };
}

/**
 * Sleep utility
 * @param {Number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse JSON safely with multiple strategies
 */
function parseJSON(text) {
  // Strategy 1: Direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue to other strategies
  }

  // Strategy 2: Extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {
      // Continue
    }
  }

  // Strategy 3: Find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue
    }
  }

  return null;
}

/**
 * Hash string using SHA256
 */
function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Rate limiter check
 */
const rateLimitMap = new Map();

function checkRateLimit(key, maxPerMinute = 10) {
  const now = Date.now();
  const windowStart = now - 60000;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }
  
  const requests = rateLimitMap.get(key);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxPerMinute) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  
  return true;
}

/**
 * Hash string using crypto
 * @param {String} str - String to hash
 * @returns {String} - Hash
 */
function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = {
  generateStudyPlan,
  callAI,
  parseAIResponse,
  validateAndEnhancePlan,
  generateFallbackPlan,
  hashString,
  sleep,
  checkRateLimit,
  // Backward compatibility
  generateAIInsight: generateStudyPlan
};
