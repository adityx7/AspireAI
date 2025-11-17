#!/bin/bash

echo "🔍 AspireAI Notification System - Quick Check"
echo "=============================================="
echo ""

# Check if server is running
echo "1️⃣  Checking if backend server is running..."
if curl -s http://localhost:5002 > /dev/null 2>&1; then
    echo "   ✅ Backend server is running on port 5002"
else
    echo "   ❌ Backend server is NOT running!"
    echo "   👉 Run: npm start"
    exit 1
fi
echo ""

# Check if React app is running
echo "2️⃣  Checking if React app is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ React app is running on port 3000"
else
    echo "   ❌ React app is NOT running!"
    echo "   👉 Run: npm start"
    exit 1
fi
echo ""

# Check notification routes
echo "3️⃣  Checking notification API endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5002/api/notifications/1BG21CS091/unread-count)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Notification API is working!"
else
    echo "   ❌ Notification API returned status: $RESPONSE"
    echo "   👉 Check server logs for errors"
fi
echo ""

# Get current notification count
echo "4️⃣  Checking current notifications..."
COUNT_RESPONSE=$(curl -s http://localhost:5002/api/notifications/1BG21CS091/unread-count)
if echo "$COUNT_RESPONSE" | grep -q "unreadCount"; then
    UNREAD_COUNT=$(echo "$COUNT_RESPONSE" | grep -o '"unreadCount":[0-9]*' | cut -d':' -f2)
    echo "   📬 You have $UNREAD_COUNT unread notification(s)"
else
    echo "   ⚠️  Could not fetch notification count"
fi
echo ""

echo "=============================================="
echo "✅ All systems operational!"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open http://localhost:3000/dashboard in your browser"
echo "   2. Look for the bell icon (🔔) in the top-right corner"
echo "   3. Run './test-notification.sh' to create a test notification"
echo "   4. See the red badge appear on the bell icon!"
echo ""
echo "📚 Full testing guide: NOTIFICATION_TESTING_INSTRUCTIONS.md"
