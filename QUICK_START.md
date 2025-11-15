# Agentic AI - Quick Start Guide

## ✅ Installation (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `bullmq` - Job queue
- `ioredis` - Redis client
- `node-cron` - Task scheduler
- `ajv` & `ajv-formats` - JSON validation

### Step 2: Start Redis

```bash
# Option A: Using Docker (recommended)
docker run -d -p 6379:6379 --name aspireai-redis redis:alpine

# Option B: Install locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu
redis-server
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API key
# For OpenAI:
OPENAI_API_KEY=sk-your-key-here

# For Claude:
CLAUDE_API_KEY=sk-ant-your-key-here
LLM_PROVIDER=claude
```

### Step 4: Start Services

```bash
# Terminal 1: Start everything (React + API + AI + Agent Worker)
npm run start-with-agents
```

OR start separately:

```bash
# Terminal 1: Main services
npm run start-all

# Terminal 2: Agent worker
npm run agent-worker
```

## 🧪 Testing the System

### 1. Trigger a Test Job

```bash
curl -X POST http://localhost:5002/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1BG21CS091",
    "type": "mentorAgent",
    "force": true
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "jobId": "mentor-1BG21CS091-1731654321000",
    "status": "queued"
  }
}
```

### 2. Check Job Status

```bash
curl http://localhost:5002/api/agents/job/mentor-1BG21CS091-1731654321000/status
```

### 3. View Generated Suggestions

```bash
curl http://localhost:5002/api/students/1BG21CS091/mentor-suggestions
```

### 4. Check System Metrics

```bash
curl http://localhost:5002/api/agents/metrics?days=7
```

## 📊 Verify Installation

Run the test suite:

```bash
npm run test:agents
```

Expected output:
```
✅ Schema validation tests: 8 passed
✅ Worker logic tests: 5 passed
✅ All tests passed!
```

## 🔧 Troubleshooting

### Redis not running

```bash
# Check if Redis is running
ps aux | grep redis

# Start Redis
redis-server

# Or with Docker
docker start aspireai-redis
```

### API Key Error

Check `.env` file has correct API key:
```bash
cat .env | grep API_KEY
```

### MongoDB not connected

Verify MongoDB is running:
```bash
mongo --eval "db.adminCommand('ping')"
```

### Worker not processing

Check worker logs:
```bash
npm run agent-worker
```

Look for:
```
✅ MongoDB connected
✅ Redis connected
👷 Mentor agent worker started
⏰ Scheduler initialized
```

## 📱 Using in Frontend

### Install Dependencies

```bash
# No additional frontend dependencies needed
```

### API Integration Example

```javascript
// Trigger agent for current student
const triggerMentorPlan = async (userId) => {
  const response = await axios.post('/api/agents/trigger', {
    userId,
    type: 'mentorAgent',
    force: false
  });
  return response.data;
};

// Get student suggestions
const getSuggestions = async (userId) => {
  const response = await axios.get(
    `/api/students/${userId}/mentor-suggestions?status=pending`
  );
  return response.data.data.suggestions;
};

// Mentor reviews suggestion
const reviewSuggestion = async (userId, suggestionId, action, notes) => {
  const response = await axios.put(
    `/api/students/${userId}/mentor-suggestions/${suggestionId}/review`,
    {
      action, // 'accept' or 'dismiss'
      notes,
      reviewedBy: 'MENTOR_ID'
    }
  );
  return response.data;
};

// Student applies plan
const applyPlan = async (userId, suggestionId) => {
  const response = await axios.post(
    `/api/students/${userId}/mentor-suggestions/${suggestionId}/apply`
  );
  return response.data;
};
```

## 🚀 Next Steps

1. **Test with Real Data**: Trigger jobs for actual students
2. **Build UI Components**: Create suggestion cards and plan viewers
3. **Configure Scheduler**: Adjust cron schedules in `schedulerService.js`
4. **Monitor Metrics**: Check `/api/agents/metrics` daily
5. **Train Mentors**: Show them the review interface

## 📚 Documentation

- **Full Guide**: `AGENTIC_AI_GUIDE.md`
- **API Reference**: `postman_collection.json`
- **Code Examples**: `src/__tests__/`

## 🆘 Need Help?

1. Check logs: `npm run agent-worker`
2. View metrics: `curl http://localhost:5002/api/agents/metrics`
3. Test endpoint: Force trigger a job with existing student
4. Check MongoDB: Verify collections exist:
   - `mentorsuggestions`
   - `agentjobs`
   - `notifications`

## ✅ Success Checklist

- [ ] Redis running and accessible
- [ ] MongoDB connected
- [ ] API key configured in `.env`
- [ ] Worker server started successfully
- [ ] Test job completes successfully
- [ ] Suggestion generated and saved
- [ ] Notification created
- [ ] API endpoints responding

**Status**: 🟢 System ready for production!
