const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const crypto = require('crypto');
const mentorSuggestionSchema = require('../schemas/mentorSuggestion.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateMentorSuggestion = ajv.compile(mentorSuggestionSchema);

// Prompt templates
const PROMPTS = {
  mentor_plan: `You are an empathetic academic coach. Input: {studentJson}. Output only JSON. Analyze the student's grades, IA marks, attendance, upcoming exams, and recent activity. Produce:
1) "insights": up to 5 prioritized observations {title, detail, severity: low|medium|high}.
2) "planLength": choose 7|14|28 days.
3) "plan": array of days [{day:1, date, tasks:[{time:'09:00', task:'Revise topic X', durationMinutes:60, resource:'url or text', practiceProblemIds:[] }]}].
4) "microSupport": array of short learning units {title, summary, estimatedMinutes, resourceUrl, exampleProblem}.
5) "mentorActions": short bullet suggestions for mentor (meeting, exercise, encouragement).
6) "confidence": numeric 0-1.
Ensure tasks are realistic (no more than 5 hours/day) and considerate of attendance/semester load. Return only JSON.`,

  strict_json: `Your previous response was not valid JSON. Please respond ONLY with valid JSON matching the exact schema required. No markdown, no code blocks, no explanations - just pure JSON.`
};

/**
 * Generate AI insights using LLM (Claude or OpenAI)
 * @param {Object} studentJson - Normalized student data
 * @param {String} promptName - Name of prompt template to use
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Validated AI response
 */
async function generateAIInsight(studentJson, promptName = 'mentor_plan', options = {}) {
  const {
    maxRetries = 1,
    timeout = 60000,
    model = process.env.LLM_MODEL || 'gpt-4-turbo-preview'
  } = options;

  const provider = process.env.LLM_PROVIDER || 'openai'; // 'openai' or 'claude'
  
  // Get prompt template
  const promptTemplate = PROMPTS[promptName];
  if (!promptTemplate) {
    throw new Error(`Unknown prompt name: ${promptName}`);
  }

  // Build full prompt
  const prompt = promptTemplate.replace('{studentJson}', JSON.stringify(studentJson, null, 2));
  const inputHash = hashString(prompt);

  let lastError = null;
  
  // Retry loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Generating AI insight (attempt ${attempt + 1}/${maxRetries + 1})...`);
      
      let response;
      let rawOutput;
      let tokenCost = 0;

      if (provider === 'claude') {
        const result = await callClaude(prompt, model, timeout, attempt > 0);
        rawOutput = result.output;
        tokenCost = result.tokenCost;
      } else {
        const result = await callOpenAI(prompt, model, timeout, attempt > 0);
        rawOutput = result.output;
        tokenCost = result.tokenCost;
      }

      // Parse JSON
      response = parseJSON(rawOutput);
      
      if (!response) {
        throw new Error('Failed to parse JSON from LLM response');
      }

      // Validate against schema
      const valid = validateMentorSuggestion(response);
      
      if (!valid) {
        const errors = validateMentorSuggestion.errors;
        console.error('❌ Schema validation failed:', JSON.stringify(errors, null, 2));
        throw new Error(`Schema validation failed: ${JSON.stringify(errors)}`);
      }

      // Success!
      console.log('✅ AI insight generated and validated successfully');
      
      const outputHash = hashString(JSON.stringify(response));
      
      return {
        data: response,
        metadata: {
          promptHash: inputHash,
          outputHash,
          modelUsed: model,
          provider,
          tokenCostEstimate: tokenCost,
          attempt: attempt + 1
        }
      };

    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
      // If this was our last attempt, throw
      if (attempt >= maxRetries) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }

  // All retries failed
  throw new Error(`Failed to generate AI insight after ${maxRetries + 1} attempts: ${lastError.message}`);
}

/**
 * Call Claude API
 */
async function callClaude(prompt, model, timeout, isRetry) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY not configured');
  }

  const messages = [
    {
      role: 'user',
      content: isRetry ? `${PROMPTS.strict_json}\n\n${prompt}` : prompt
    }
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        messages
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const output = data.content[0].text;
    const tokenCost = (data.usage.input_tokens + data.usage.output_tokens) / 1000;

    return { output, tokenCost };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Claude API request timeout');
    }
    throw error;
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, model, timeout, isRetry) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful academic advisor. Always respond with valid JSON only.'
    },
    {
      role: 'user',
      content: isRetry ? `${PROMPTS.strict_json}\n\n${prompt}` : prompt
    }
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const output = data.choices[0].message.content;
    const tokenCost = (data.usage.prompt_tokens + data.usage.completion_tokens) / 1000;

    return { output, tokenCost };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('OpenAI API request timeout');
    }
    throw error;
  }
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

module.exports = {
  generateAIInsight,
  checkRateLimit,
  PROMPTS
};
