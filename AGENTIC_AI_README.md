# 🤖 Agentic AI - Installation & Usage

## ⚡ Quick Install (5 Minutes)

```bash
# 1. Install npm dependencies
npm install

# 2. Start Redis (required for job queue)
docker run -d -p 6379:6379 --name aspireai-redis redis:alpine

# 3. Configure API keys
cp .env.example .env
# Edit .env: Add OPENAI_API_KEY or CLAUDE_API_KEY

# 4. Start everything
npm run start-with-agents
```

That's it! The system is now running.

---

## 🧪 Test It

```bash
# Trigger AI mentor for a student
curl -X POST http://localhost:5002/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"userId":"1BG21CS091","force":true}'

# Check if it worked
curl http://localhost:5002/api/students/1BG21CS091/mentor-suggestions
```

---

## 📖 Documentation

- **[AGENTIC_AI_SUMMARY.md](./AGENTIC_AI_SUMMARY.md)** - Quick overview
- **[QUICK_START.md](./QUICK_START.md)** - Detailed setup guide
- **[AGENTIC_AI_GUIDE.md](./AGENTIC_AI_GUIDE.md)** - Complete technical docs
- **[postman_collection.json](./postman_collection.json)** - API testing

---

## 🎯 What This Does

Automatically generates personalized study plans for students:

1. **Monitors** student performance daily
2. **Detects** at-risk students (low attendance/CGPA)
3. **Generates** AI-powered study timetables (7/14/28 days)
4. **Notifies** students and mentors
5. **Tracks** plan acceptance and progress

---

## 🛠️ Troubleshooting

**Redis not running?**
```bash
docker start aspireai-redis
```

**Worker not processing?**
```bash
npm run agent-worker
# Look for: "✅ Mentor agent worker started"
```

**Test failed?**
```bash
npm run test:agents
```

---

## 📚 More Help

See **[QUICK_START.md](./QUICK_START.md)** for detailed instructions.
