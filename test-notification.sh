#!/bin/bash

echo "📬 Creating test notification..."
echo ""

curl -X POST http://localhost:5002/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1BG21CS091",
    "type": "attendance",
    "title": "⚠️ Attendance Alert",
    "body": "Your attendance is at 72%. You need at least 75% to appear for exams.",
    "priority": "high",
    "payload": {
      "actionUrl": "/attendance",
      "actionLabel": "View Attendance"
    }
  }'

echo ""
echo ""
echo "✅ Done! Check your dashboard - the bell icon should show a notification badge."
