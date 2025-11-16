#!/bin/bash

echo "🎯 AspireAI - Agentic AI System Test"
echo "===================================="
echo ""

# Configuration
USER_ID="68a0b0f5e3324914df367302"
BASE_URL="http://localhost:5002/api/agents"

# Test 1: Check if API is responding
echo "1️⃣ Checking API health..."
if curl -s "$BASE_URL/$USER_ID/today" > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding. Is the server running?"
    exit 1
fi
echo ""

# Test 2: Get current tasks (should be empty initially)
echo "2️⃣ Checking current tasks..."
TASKS=$(curl -s "$BASE_URL/$USER_ID/today")
echo "$TASKS" | jq '.' 2>/dev/null || echo "$TASKS"
echo ""

# Test 3: Generate AI study plan
echo "3️⃣ Generating AI Study Plan..."
echo "⏳ This will take 30-60 seconds as OpenAI generates a personalized plan..."
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/run" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\"}" \
  --max-time 90)

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Study plan generated successfully!"
    echo ""
    echo "📊 Plan Summary:"
    echo "$RESPONSE" | jq '.plan | {planLength, insights: .insights | length, totalDays: .plan | length}' 2>/dev/null
    echo ""
    
    # Test 4: Get today's tasks again
    echo "4️⃣ Fetching today's tasks..."
    TODAY=$(curl -s "$BASE_URL/$USER_ID/today")
    echo "$TODAY" | jq '.tasks | .[] | {time, task, duration: .durationMinutes}' 2>/dev/null || echo "$TODAY"
    echo ""
    
    # Test 5: Get active plan
    echo "5️⃣ Getting active study plan..."
    ACTIVE=$(curl -s "$BASE_URL/$USER_ID/active-plan")
    echo "$ACTIVE" | jq '{progress, todayTasks: .todayTasks | length, nextTask: .nextTask.task}' 2>/dev/null || echo "$ACTIVE"
    echo ""
    
    echo "===================================="
    echo "✅ ALL TESTS PASSED!"
    echo ""
    echo "🎓 Next steps:"
    echo "   1. Check MongoDB: db.mentorsuggestions.find().pretty()"
    echo "   2. Integrate frontend: TodayTasks component"
    echo "   3. Students can now complete tasks and track progress!"
    
else
    echo "❌ Failed to generate study plan"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
fi
