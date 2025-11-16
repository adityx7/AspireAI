#!/bin/bash

echo "🧪 Testing Agentic AI API Endpoints"
echo "===================================="
echo ""

# Test 1: Check server is running
echo "1️⃣ Testing server health..."
curl -s http://localhost:5002/ > /dev/null && echo "✅ Server is running" || echo "❌ Server is not running"
echo ""

# Test 2: Get today's tasks (will be empty for new user)
echo "2️⃣ Testing GET /api/agents/:userId/today..."
USER_ID="674f2a2f820d99b7c31ec2d3"  # Replace with actual user ID from your DB
RESPONSE=$(curl -s http://localhost:5002/api/agents/$USER_ID/today)
echo "Response: $RESPONSE"
echo ""

# Test 3: Get risk profile
echo "3️⃣ Testing GET /api/agents/:userId/risk-profile..."
RESPONSE=$(curl -s http://localhost:5002/api/agents/$USER_ID/risk-profile)
echo "Response: $RESPONSE"
echo ""

# Test 4: Get active plan
echo "4️⃣ Testing GET /api/agents/:userId/active-plan..."
RESPONSE=$(curl -s http://localhost:5002/api/agents/$USER_ID/active-plan)
echo "Response: $RESPONSE"
echo ""

# Test 5: Manual trigger (this will queue a job)
echo "5️⃣ Testing POST /api/agents/run (Manual trigger)..."
RESPONSE=$(curl -s -X POST http://localhost:5002/api/agents/run \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\"}")
echo "Response: $RESPONSE"
echo ""

echo "===================================="
echo "✅ API testing complete!"
echo ""
echo "📝 Next steps:"
echo "1. Replace USER_ID with an actual student ID from your database"
echo "2. The manual trigger will create a study plan in the background"
echo "3. Check MongoDB for the created plan: db.mentorsuggestions.find().pretty()"
