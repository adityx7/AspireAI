# Agentic AI System - Implementation Guide

## Overview

The Agentic AI system autonomously monitors student academic performance and delivers:
1. **Personalized Study Timetables**: 7/14/28-day plans with daily tasks, resources, and practice problems
2. **Proactive Academic Support**: Micro-lessons, insights, and mentor action suggestions

## Architecture

```
┌─────────────────┐
│   Scheduler     │  Daily/Weekly triggers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BullMQ Queue   │  Job queue with Redis
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent Worker   │  Processes jobs
└────────┬────────┘
         │
         ├─► Load Student Data
         ├─► Rule-based Checks
         ├─► Generate AI Insights (LLM)
         ├─► Validate Output
         ├─► Save to MongoDB
         └─► Send Notifications
```

## Installation

### 1. Install Dependencies

```bash
npm install bullmq ioredis node-cron ajv ajv-formats
```

### 2. Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
brew install redis  # macOS
redis-server
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`, `REDIS_PORT`: Redis connection
- `LLM_PROVIDER`: Choose 'openai' or 'claude'
- `OPENAI_API_KEY` or `CLAUDE_API_KEY`: LLM API key

### 4. Start Services

#### Option A: Integrated with Main Server

Add to your main server file (`Server.js`):

```javascript
const agentRoutes = require('./routes/agentRoutes');
app.use('/api/agents', agentRoutes);
app.use('/api', agentRoutes); // For other routes like /api/notifications
```

Start worker in separate terminal:

```bash
node src/agentServer.js
```

#### Option B: Standalone

```bash
# Terminal 1: Main API server
node src/components/pages/student/Server.js

# Terminal 2: Agent worker
node src/agentServer.js
```

## API Endpoints

### 1. Trigger Agent Job

```http
POST /api/agents/trigger
Content-Type: application/json

{
  "userId": "1BG21CS091",
  "type": "mentorAgent",
  "force": false
}
```

Response:
```json
{
  "success": true,
  "message": "Agent job enqueued successfully",
  "data": {
    "jobId": "mentor-1BG21CS091-1731654321000",
    "userId": "1BG21CS091",
    "type": "mentorAgent",
    "status": "queued"
  }
}
```

### 2. Get Job Status

```http
GET /api/agents/job/:jobId/status
```

### 3. Get Student Suggestions

```http
GET /api/students/:userId/mentor-suggestions?status=pending&limit=10
```

Response:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "_id": "...",
        "userId": "1BG21CS091",
        "insights": [
          {
            "title": "Low Attendance Alert",
            "detail": "Your attendance is 65%, below the required 75%",
            "severity": "high"
          }
        ],
        "planLength": 14,
        "plan": [
          {
            "day": 1,
            "date": "2025-11-15T00:00:00.000Z",
            "tasks": [
              {
                "time": "09:00",
                "task": "Review Data Structures - Arrays",
                "durationMinutes": 60,
                "resourceUrl": "https://..."
              }
            ]
          }
        ],
        "confidence": 0.85,
        "reviewed": false,
        "accepted": false
      }
    ],
    "total": 1
  }
}
```

### 4. Review Suggestion (Mentor)

```http
PUT /api/students/:userId/mentor-suggestions/:suggestionId/review
Content-Type: application/json

{
  "action": "accept",
  "notes": "Great plan!",
  "reviewedBy": "MENTOR_001"
}
```

### 5. Apply Plan (Student)

```http
POST /api/students/:userId/mentor-suggestions/:suggestionId/apply
```

### 6. Get Metrics

```http
GET /api/agents/metrics?days=7
```

## Database Collections

### mentorSuggestions

```javascript
{
  userId: "1BG21CS091",
  agent: "mentorAgent",
  insights: [{title, detail, severity}],
  planLength: 14,
  plan: [{day, date, tasks: [{time, task, durationMinutes, resourceUrl}]}],
  microSupport: [{title, summary, estimatedMinutes}],
  resources: [{title, url, type}],
  suggestedMentorActions: ["..."],
  confidence: 0.85,
  generatedAt: Date,
  reviewed: false,
  accepted: false,
  dismissed: false,
  applied: false
}
```

### agentJobs

```javascript
{
  jobId: "mentor-1BG21CS091-1234567890",
  userId: "1BG21CS091",
  type: "mentorAgent",
  status: "completed",
  startedAt: Date,
  finishedAt: Date,
  durationMs: 45000,
  outputSuggestionId: ObjectId
}
```

### notifications

```javascript
{
  userId: "1BG21CS091",
  type: "mentor_suggestion",
  title: "New Study Plan Available",
  body: "Your AI mentor has generated...",
  payload: {suggestionId: "..."},
  read: false,
  priority: "high"
}
```

## Scheduled Jobs

| Schedule | Task | Description |
|----------|------|-------------|
| Daily 1 AM | At-Risk Check | Process students with low attendance/CGPA |
| Monday 2 AM | Weekly Scan | Process all students (once per week) |
| Daily 8 AM | Plan Reminders | Send task reminders for active plans |
| Sunday 3 AM | Cleanup | Remove old dismissed/unreviewed suggestions |

## Rule-Based Checks

The system flags students automatically:

1. **Attendance < 75%**: High severity
2. **CGPA drop > 0.3**: Medium/High severity
3. **Low IA marks** (avg < 50%): Medium severity
4. **No activity points** in 6 months: Low severity

## LLM Integration

### generateAIInsight() Function

```javascript
const { generateAIInsight } = require('./services/aiService');

const result = await generateAIInsight(studentJson, 'mentor_plan', {
  maxRetries: 1,
  timeout: 60000
});

// result.data = validated AI output
// result.metadata = {promptHash, modelUsed, tokenCostEstimate}
```

### Prompt Template

The system uses a structured prompt that:
- Analyzes student grades, attendance, and activities
- Generates 1-5 prioritized insights
- Creates realistic daily study plans (max 5 hours/day)
- Suggests micro-learning units
- Recommends mentor actions

## Testing

```bash
# Run unit tests
npm test

# Run specific test file
npm test -- agentWorker.test.js
```

## Monitoring

### Check Queue Status

```bash
# Redis CLI
redis-cli
> KEYS bull:mentor-agent:*
> LLEN bull:mentor-agent:wait
```

### Check Logs

```bash
# Worker logs
tail -f logs/agent-worker.log

# MongoDB logs
tail -f logs/mongodb.log
```

### Metrics Dashboard

```http
GET /api/agents/metrics?days=30
```

Returns:
- Job success/failure rates
- Average processing time
- Suggestion acceptance rates
- Top insights by severity

## Frontend Integration

### React Hook Example

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function useMentorSuggestions(userId) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/students/${userId}/mentor-suggestions?status=pending`)
      .then(res => setSuggestions(res.data.data.suggestions))
      .finally(() => setLoading(false));
  }, [userId]);

  return { suggestions, loading };
}
```

### UI Components Needed

1. **Suggestion Card**: Display insights with severity colors
2. **Plan Timeline**: Show daily tasks with expandable details
3. **Mentor Review Panel**: Accept/dismiss buttons
4. **Student Apply Button**: Activate plan
5. **Progress Tracker**: Show completed tasks

## Troubleshooting

### Worker not processing jobs

```bash
# Check Redis connection
redis-cli ping

# Check worker logs
node src/agentServer.js

# Manually trigger job
curl -X POST http://localhost:5002/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"userId":"TEST001","force":true}'
```

### LLM timeouts

- Increase timeout in `generateAIInsight()` options
- Check API key validity
- Monitor API rate limits

### Schema validation failures

- Check `schemas/mentorSuggestion.json`
- Validate sample output with test
- Enable detailed logging in worker

## Security Considerations

1. **API Keys**: Store in environment variables, never commit
2. **Rate Limiting**: 6-hour window between jobs (configurable)
3. **Mentor Review**: High-severity suggestions require approval
4. **Data Privacy**: Student data is anonymized in logs
5. **Audit Trail**: All jobs logged in agentJobs collection

## Performance Optimization

1. **Batch Processing**: Process multiple students in parallel
2. **Caching**: Cache frequent student queries
3. **Job Priority**: At-risk students get higher priority
4. **Resource Limits**: Max 2 concurrent LLM calls
5. **Cleanup**: Auto-delete old jobs and suggestions

## Cost Estimation

### LLM Costs (per student/month)

- OpenAI GPT-4: ~$0.10-0.30 per plan
- Claude Sonnet: ~$0.08-0.25 per plan
- Weekly generation: ~$0.40-1.20/student/month

### Infrastructure

- Redis: Free (self-hosted) or $10/month (cloud)
- MongoDB: Free (self-hosted) or $25/month (Atlas M10)
- Compute: $20-50/month (DigitalOcean/AWS)

**Total**: ~$50-100/month for 100 students

## Next Steps

1. ✅ Install and configure system
2. ✅ Test with sample student data
3. ⏳ Integrate frontend UI components
4. ⏳ Train mentors on review workflow
5. ⏳ Monitor metrics and iterate
6. ⏳ Expand to career planning agent

## Support

For issues or questions:
- Check logs: `node src/agentServer.js`
- View metrics: `GET /api/agents/metrics`
- Test endpoint: `POST /api/agents/trigger` with `force:true`
