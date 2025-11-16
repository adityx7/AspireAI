# AGENTIC AI - COMPLETE IMPLEMENTATION GUIDE
## AspireAI Intelligent Study Plan System

> **Status**: ✅ FULLY IMPLEMENTED  
> **Date**: November 16, 2025  
> **Developer**: Senior AI Engineer & Full-Stack Developer

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Database Models](#database-models)
5. [Services](#services)
6. [Worker & Scheduler](#worker--scheduler)
7. [API Routes](#api-routes)
8. [Frontend Components](#frontend-components)
9. [Integration Steps](#integration-steps)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 SYSTEM OVERVIEW

The Agentic AI system is a comprehensive, autonomous academic support platform that:

- **Monitors** student data daily
- **Detects** academic risks (low attendance, weak subjects, CGPA drops)
- **Generates** personalized 7, 14, or 28-day study plans
- **Creates** daily tasks and micro-suggestions
- **Alerts** mentors proactively
- **Adapts** plans based on student progress
- **Stores** everything in MongoDB
- **Displays** interactive tasks in student dashboard

### Key Features

✅ **Autonomous Risk Detection**  
✅ **AI-Powered Study Plan Generation**  
✅ **Daily Task Scheduling**  
✅ **Progress Tracking with Streaks**  
✅ **Mentor Notifications**  
✅ **Student Dashboard Integration**  
✅ **Real-time Updates**  
✅ **Mobile Responsive UI**  

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      AGENTIC AI SYSTEM                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   TRIGGERS       │
│  - Daily Cron    │
│  - IA Update     │
│  - Attendance    │
│  - Manual        │
│  - Student Req   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  AGENT SCHEDULER │
│  - Job Queue     │
│  - Rate Limiting │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│      BULLMQ WORKER           │
│  1. Load Student Data        │
│  2. Risk Analysis            │
│  3. AI Study Plan Generation │
│  4. Database Storage         │
│  5. Notifications            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│      SERVICES                │
│  - Academic Risk Service     │
│  - AI Service (OpenAI/Claude)│
│  - Notification Service      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│      DATABASE (MongoDB)      │
│  - MentorSuggestion          │
│  - StudyPlan                 │
│  - User                      │
│  - Notification              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│      API ROUTES              │
│  - GET /agents/:userId/...   │
│  - POST /agents/run          │
│  - PUT /agents/:userId/...   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   FRONTEND (React)           │
│  - TodayTasks                │
│  - StudyPlanCard             │
│  - StudyPlanPage             │
└──────────────────────────────┘
```

---

## 🚀 INSTALLATION & SETUP

### Prerequisites

```bash
node >= 16.x
npm >= 8.x
MongoDB >= 5.x
Redis >= 6.x
```

### 1. Install Dependencies

```bash
npm install --save \
  bullmq \
  ioredis \
  node-cron \
  openai \
  @anthropic-ai/sdk \
  axios
```

### 2. Environment Variables

Create or update `.env`:

```bash
# AI Provider Configuration
AI_PROVIDER=openai          # or 'claude'
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4-turbo-preview

# Alternative: OpenAI specific
OPENAI_API_KEY=sk-...

# Alternative: Claude specific
CLAUDE_API_KEY=sk-ant-...

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB
MONGODB_URI=mongodb://localhost:27017/aspireai

# Server
PORT=5001
NODE_ENV=development
```

### 3. Redis Installation (if not installed)

#### macOS
```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

#### Windows
Use WSL or Docker:
```bash
docker run -d -p 6379:6379 redis:latest
```

### 4. Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

---

## 💾 DATABASE MODELS

### MentorSuggestion Model

Location: `src/models/MentorSuggestion.js`

**Fields:**
- `userId` - Reference to User
- `insights[]` - Array of academic insights
- `planLength` - 7, 14, or 28 days
- `plan[]` - Daily task schedule
- `resources[]` - Learning resources
- `mentorActions[]` - Suggested mentor interventions
- `riskProfile` - Academic risk assessment
- `reviewed` - Boolean
- `accepted` - Boolean
- `active` - Boolean

**Methods:**
- `getProgress()` - Calculate completion percentage
- `getTodayTasks()` - Get tasks for today
- `getNextTask()` - Get next incomplete task
- `getActivePlan(userId)` - Static method to get active plan

### StudyPlan Model

Location: `src/models/StudyPlan.js`

**Fields:**
- `userId` - Reference to User
- `activePlanId` - Current active plan
- `tasksCompleted` - Total completed tasks
- `progressPercent` - Overall progress
- `nextTask` - Upcoming task info
- `statistics` - Streaks, completion rates

**Methods:**
- `updateProgress(mentorSuggestion)` - Update progress
- `updateStreak()` - Calculate daily streak
- `completePlan(finalProgress)` - Mark plan as complete
- `getOrCreate(userId)` - Static method to get or create plan

---

## 🔧 SERVICES

### 1. Academic Risk Service

**Location**: `src/services/academicRiskService.js`

**Key Functions:**

```javascript
generateRiskProfile(student)
// Returns: {
//   lowAttendance: [...],
//   weakSubjects: [...],
//   cgpaDrop: Boolean,
//   overallRisk: 'low'|'medium'|'high',
//   urgentActions: [...]
// }

detectLowAttendance(student)
// Identifies subjects with < 75% attendance

detectWeakSubjects(student)
// Identifies subjects with IA < 15/30

detectCGPADrop(student)
// Detects CGPA drop > 0.4

generateStudentSnapshot(student, riskProfile)
// Creates formatted data for AI
```

### 2. AI Service

**Location**: `src/services/aiService.js`

**Key Functions:**

```javascript
generateStudyPlan(studentData, options)
// Calls AI API to generate personalized study plan
// Returns: {
//   insights: [...],
//   planLength: Number,
//   plan: [...],
//   resources: [...],
//   mentorActions: [...]
// }

callAI(prompt, options)
// Wrapper for OpenAI/Claude API calls

validateAndEnhancePlan(plan, studentData)
// Validates and fixes AI-generated plan

generateFallbackPlan(studentData)
// Creates basic plan if AI fails
```

**Supported AI Providers:**
- OpenAI (gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo)
- Claude (claude-3-5-sonnet, claude-3-opus)

### 3. Agent Scheduler

**Location**: `src/services/agentScheduler.js`

**Key Functions:**

```javascript
start()
// Start all scheduled jobs

scheduleDailyScan()
// Runs at 3:00 AM daily

triggerOnAttendanceUpdate(userId)
// Trigger when attendance updated

triggerOnIAMarksUpdate(userId)
// Trigger when IA marks updated

triggerManual(userId, mentorId)
// Manual mentor trigger

triggerStudentRequest(userId)
// Student-initiated trigger

cleanupOldData()
// Runs at 2:00 AM daily
```

---

## ⚙️ WORKER & SCHEDULER

### Worker Process

**Location**: `src/workers/mentorAgentWorker.js`

**Process Flow:**

1. **Load Student Data** (Progress: 10%)
   - Fetch user document
   - Populate attendance, marks, semesters

2. **Analyze Risks** (Progress: 40%)
   - Run risk detection service
   - Generate risk profile

3. **Generate AI Plan** (Progress: 70%)
   - Create student snapshot
   - Call AI service
   - Parse and validate response

4. **Save to Database** (Progress: 80%)
   - Deactivate old plans
   - Save new MentorSuggestion
   - Update StudyPlan document

5. **Send Notifications** (Progress: 90%)
   - Notify student
   - Notify mentor (if high/medium risk)

6. **Complete** (Progress: 100%)

### Starting the Worker

```javascript
// In your main server file (e.g., Server.js)
const { worker } = require('./src/workers/mentorAgentWorker');
const agentScheduler = require('./src/services/agentScheduler');

// Start scheduler
agentScheduler.start();

console.log('🤖 Agentic AI System Started');
```

---

## 🌐 API ROUTES

**Base URL**: `/api/agents`

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/run` | Manually trigger agent |
| GET | `/:userId/suggestions` | Get all suggestions |
| GET | `/:userId/active-plan` | Get active study plan |
| PUT | `/:userId/accept/:suggestionId` | Accept a suggestion |
| PUT | `/:userId/task/:taskId/complete` | Mark task as completed |
| GET | `/:userId/today` | Get today's tasks |
| GET | `/:userId/risk-profile` | Get risk profile |
| PUT | `/review/:suggestionId` | Review suggestion (mentor) |
| GET | `/scheduler/status` | Get scheduler status (admin) |

### Example Requests

**Trigger Agent:**
```javascript
POST /api/agents/run
{
  "userId": "64a1b2c3d4e5f6789"
}
```

**Get Today's Tasks:**
```javascript
GET /api/agents/64a1b2c3d4e5f6789/today

Response:
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "...",
        "time": "09:00",
        "task": "Revise Data Structures - Arrays",
        "durationMinutes": 60,
        "resourceUrl": "https://...",
        "completed": false
      }
    ],
    "progress": {
      "completedTasks": 2,
      "totalTasks": 10,
      "progressPercent": 20
    }
  }
}
```

**Complete Task:**
```javascript
PUT /api/agents/64a1b2c3d4e5f6789/task/task123/complete

Response:
{
  "success": true,
  "data": {
    "taskId": "task123",
    "progress": { ... },
    "streak": 5
  }
}
```

---

## 🎨 FRONTEND COMPONENTS

### 1. TodayTasks Component

**Location**: `src/components/AI/TodayTasks.jsx`

**Features:**
- Display today's tasks
- Checkbox to mark complete
- Progress bar
- Streak indicator
- Responsive design

**Usage:**
```jsx
import TodayTasks from './components/AI/TodayTasks';

<TodayTasks userId={userId} />
```

### 2. StudyPlanCard Component

**Location**: `src/components/AI/StudyPlanCard.jsx`

**Features:**
- Display plan summary
- Show insights and risk profile
- Accept button
- View details button
- Beautiful indigo/gold UI

**Usage:**
```jsx
import StudyPlanCard from './components/AI/StudyPlanCard';

<StudyPlanCard
  suggestion={suggestion}
  onAccept={handleAccept}
  onViewDetails={handleViewDetails}
/>
```

### 3. StudyPlanPage Component

**Location**: `src/components/pages/StudyPlanPage.jsx`

**Features:**
- Complete study plan management
- Generate new plan button
- Statistics display
- Today's tasks section
- Modal for full plan view

**Usage:**
```jsx
import StudyPlanPage from './components/pages/StudyPlanPage';

<Route path="/study-plan" element={<StudyPlanPage userId={userId} />} />
```

---

## 🔗 INTEGRATION STEPS

### Step 1: Update Server Entry Point

```javascript
// src/components/pages/student/Server.js

const express = require('express');
const mongoose = require('mongoose');
const agentRoutes = require('../../routes/agentRoutes');
const agentScheduler = require('../../services/agentScheduler');
const { worker } = require('../../workers/mentorAgentWorker');

const app = express();

// ... existing middleware ...

// Add agent routes
app.use('/api/agents', agentRoutes);

// Start agent scheduler
agentScheduler.start();

// ... rest of server code ...
```

### Step 2: Add to Student Dashboard

```jsx
// src/components/pages/student/Dashboard.jsx

import TodayTasks from '../../AI/TodayTasks';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const userId = // ... get from auth context
  
  return (
    <div>
      {/* Existing dashboard content */}
      
      <section className="study-plan-section">
        <h2>📚 Today's Study Plan</h2>
        <TodayTasks userId={userId} />
        <Link to="/study-plan">View Full Study Plan →</Link>
      </section>
    </div>
  );
}
```

### Step 3: Add Route

```jsx
// App.js or Router setup

import StudyPlanPage from './components/pages/StudyPlanPage';

<Route 
  path="/student/study-plan" 
  element={<StudyPlanPage userId={currentUser._id} />} 
/>
```

### Step 4: Update Navigation

```jsx
// Navbar or Sidebar

<NavLink to="/student/study-plan">
  <span>📚</span>
  Study Plan
</NavLink>
```

---

## 🧪 TESTING

### 1. Test Worker Manually

```javascript
// Create test script: test-worker.js

const mongoose = require('mongoose');
const { processMentorAgentJob } = require('./src/workers/mentorAgentWorker');

mongoose.connect('mongodb://localhost:27017/aspireai');

const testJob = {
  id: 'test-123',
  data: {
    userId: 'your-test-user-id',
    triggerType: 'manual',
    manual: true
  },
  updateProgress: (progress) => {
    console.log(`Progress: ${progress}%`);
  }
};

processMentorAgentJob(testJob)
  .then(result => {
    console.log('✅ Test successful:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
```

Run:
```bash
node test-worker.js
```

### 2. Test API Endpoints

```bash
# Test trigger endpoint
curl -X POST http://localhost:5001/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'

# Test get today's tasks
curl http://localhost:5001/api/agents/your-user-id/today
```

### 3. Test Scheduler

```javascript
// In Node REPL or test script
const agentScheduler = require('./src/services/agentScheduler');

agentScheduler.start();
agentScheduler.triggerStudentRequest('test-user-id');

setTimeout(() => {
  console.log('Status:', agentScheduler.getStatus());
}, 5000);
```

---

## 🚢 DEPLOYMENT

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production AI_API_KEY
- [ ] Set up production Redis
- [ ] Configure production MongoDB
- [ ] Enable Redis persistence
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up SSL/TLS
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Test failover scenarios

### Environment-Specific Settings

**Development:**
```env
NODE_ENV=development
AI_PROVIDER=openai
REDIS_HOST=localhost
```

**Staging:**
```env
NODE_ENV=staging
AI_PROVIDER=openai
REDIS_HOST=staging-redis.example.com
```

**Production:**
```env
NODE_ENV=production
AI_PROVIDER=openai
REDIS_HOST=prod-redis.example.com
REDIS_PASSWORD=secure-password
```

---

## 🔍 TROUBLESHOOTING

### Common Issues

#### 1. Worker Not Starting

**Symptoms:**
- No jobs processing
- Scheduler silent

**Solutions:**
```bash
# Check Redis connection
redis-cli ping

# Check worker logs
tail -f logs/worker.log

# Restart Redis
brew services restart redis

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

#### 2. AI API Errors

**Symptoms:**
- "Failed to generate plan"
- 429 Rate Limit errors

**Solutions:**
- Check API key: `echo $AI_API_KEY`
- Verify API quota
- Switch to fallback plan temporarily
- Implement exponential backoff (already done)

#### 3. Plans Not Showing

**Symptoms:**
- Empty dashboard
- No suggestions returned

**Solutions:**
```javascript
// Check database
db.mentorsuggestions.find({ userId: ObjectId("...") })

// Manually trigger
await agentScheduler.triggerManual(userId, 'admin');

// Check API response
curl http://localhost:5001/api/agents/userId/active-plan
```

#### 4. Redis Connection Issues

**Symptoms:**
- "ECONNREFUSED"
- Worker crashes

**Solutions:**
```bash
# Start Redis
brew services start redis

# Check Redis status
brew services list | grep redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

---

## 📊 MONITORING

### Key Metrics to Track

1. **Job Processing Rate**
   - Jobs queued per hour
   - Jobs completed per hour
   - Average processing time

2. **AI API Usage**
   - API calls per day
   - Token usage
   - Cost tracking

3. **Student Engagement**
   - Plans accepted rate
   - Task completion rate
   - Average streak length

4. **System Health**
   - Worker uptime
   - Redis memory usage
   - MongoDB queries performance

### Logging

All components include comprehensive logging:

```
🤖 AGENT WORKER STARTED
📥 Loading student data...
✅ Loaded data for John Doe (1RV21CS001)
🔍 Analyzing academic risks...
📊 Risk Level: MEDIUM
🧠 Generating AI study plan...
✅ AI plan generated: 14 days, 56 tasks
💾 Saving study plan to database...
✅ Saved suggestion ID: 64a1b2c3d4e5f6789
🔔 Creating notifications...
✅ AGENT PROCESSING COMPLETED
```

---

## 🎉 CONCLUSION

The Agentic AI system is now fully implemented and ready for use!

### Quick Start Commands

```bash
# 1. Start Redis
brew services start redis

# 2. Start MongoDB
brew services start mongodb-community

# 3. Start your server (which includes the worker)
node src/components/pages/student/Server.js

# 4. In another terminal, start React
npm start
```

### Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review error messages in console
3. Test individual components
4. Check MongoDB collections
5. Verify Redis queues

### Next Steps

1. Monitor system performance
2. Gather student feedback
3. Fine-tune AI prompts
4. Add more risk detection rules
5. Implement A/B testing
6. Add analytics dashboard
7. Optimize task recommendations

---

**Built with ❤️ for AspireAI**  
**Version**: 1.0.0  
**Last Updated**: November 16, 2025
