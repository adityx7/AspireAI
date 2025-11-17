# 🔔 How to Test the Notification System

## ✅ Step 1: Check Notification Bell Icon

1. **Open your browser** and go to `http://localhost:3000/dashboard`
2. **Look at the top-right corner** of the navbar
3. You should see a **bell icon (🔔)** between the "Dashboard" title and your avatar
4. If you don't see it, **refresh the page** (Cmd+R or Ctrl+R)

## 🧪 Step 2: Create Test Notifications

### Option A: Use the Test Script (Easiest)
```bash
./test-notification.sh
```

### Option B: Manual curl Commands

**Test 1: Attendance Alert (High Priority)**
```bash
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
```

**Test 2: Marks Alert (Urgent Priority)**
```bash
curl -X POST http://localhost:5002/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1BG21CS091",
    "type": "internal_marks",
    "title": "📉 Low Marks Alert",
    "body": "You scored only 12/30 in Data Structures IA1. Consider seeking help.",
    "priority": "urgent",
    "payload": {
      "subject": "Data Structures",
      "marks": 12,
      "maxMarks": 30,
      "actionUrl": "/marks",
      "actionLabel": "View Marks"
    }
  }'
```

**Test 3: Exam Reminder (Medium Priority)**
```bash
curl -X POST http://localhost:5002/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1BG21CS091",
    "type": "exam_reminder",
    "title": "📅 Exam Tomorrow",
    "body": "Your Computer Networks exam is scheduled for tomorrow at 10:00 AM.",
    "priority": "medium",
    "payload": {
      "examName": "Computer Networks",
      "examDate": "2024-12-20",
      "actionUrl": "/exams",
      "actionLabel": "View Schedule"
    }
  }'
```

**Test 4: General Notification (Low Priority)**
```bash
curl -X POST http://localhost:5002/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1BG21CS091",
    "type": "general",
    "title": "🎉 Welcome!",
    "body": "Welcome to the new notification system. Stay updated with all your academic alerts!",
    "priority": "low"
  }'
```

## 📋 Step 3: Verify Notifications Appear

### In the Navbar Bell:
1. After creating notifications, wait **5-10 seconds**
2. The bell icon should show a **red badge** with the notification count
3. **Click the bell icon** - a dropdown should appear with your latest notifications
4. Each notification should show:
   - Appropriate icon based on type (⚠️ for attendance, 📉 for marks, etc.)
   - Title and body text
   - Priority-based color coding
   - Action button (if provided)

### In the Notification Center:
1. Click **"See All"** in the bell dropdown OR navigate to `/notifications`
2. You should see the full notification center page with:
   - **Tabs**: All, Unread, Academic, Urgent
   - **Filters**: Filter by notification type
   - **Actions**: Mark as read, delete notifications
   - **Beautiful UI**: Matching your dashboard theme (navy blue + gold)

## 🎯 Step 4: Test Interactive Features

### Test "Mark as Read":
1. Click on any unread notification (white background)
2. It should turn light gray and lose the "NEW" badge
3. The unread count in the bell badge should decrease

### Test "Delete":
1. Click the delete button (trash icon) on any notification
2. The notification should disappear
3. The count should update

### Test Tabs:
1. Click **"Unread"** tab - should show only unread notifications
2. Click **"Academic"** tab - should show attendance, marks, and performance alerts
3. Click **"Urgent"** tab - should show only urgent priority notifications

### Test Navigation:
1. Click **"View Attendance"** or similar action buttons
2. You should be navigated to the relevant page

## 🔍 Step 5: Test API Endpoints

**Get all notifications:**
```bash
curl http://localhost:5002/api/notifications/1BG21CS091
```

**Get unread count:**
```bash
curl http://localhost:5002/api/notifications/1BG21CS091/unread-count
```

**Mark notification as read:** (replace `<notification-id>` with actual ID from previous response)
```bash
curl -X PUT http://localhost:5002/api/notifications/<notification-id>/read
```

**Mark all as read:**
```bash
curl -X PUT http://localhost:5002/api/notifications/1BG21CS091/mark-all-read
```

**Delete notification:** (replace `<notification-id>` with actual ID)
```bash
curl -X DELETE http://localhost:5002/api/notifications/<notification-id>
```

## 🤖 Step 6: Test Automated Checks

These run automatically on schedule, but you can trigger them manually:

**Run checks for your student:**
```bash
curl -X POST http://localhost:5002/api/notifications/check/1BG21CS091
```

**Run checks for all students:**
```bash
curl -X POST http://localhost:5002/api/notifications/check-all
```

## ⏰ Automated Scheduler Times:

- **Daily Checks**: Every day at 8:00 AM IST (attendance, marks, AICTE points)
- **Hourly Checks**: Every hour (inactivity, performance)
- **Exam Reminders**: Every day at 6:00 PM IST
- **Deadline Reminders**: Every 6 hours

## 🎨 Expected Visual Appearance:

### Notification Bell in Navbar:
- **Position**: Between "Dashboard" title and avatar (top-right)
- **Icon**: Bell icon (🔔)
- **Badge**: Red circle with count (when you have unread notifications)
- **Color**: Gold/white

### Notification Dropdown:
- **Background**: Navy blue (#0A192F)
- **Text**: White
- **Icons**: Colored based on type (red for urgent, orange for high, etc.)
- **Hover Effect**: Slight gold highlight

### Notification Center Page:
- **Background**: Gradient navy blue
- **Cards**: Glassmorphism effect with blur
- **Tabs**: Gold underline for active tab
- **Buttons**: Gold accents
- **Animations**: Smooth fade-in effects

## 🐛 Troubleshooting:

**Bell icon not visible?**
- Refresh the browser (Cmd+R or Ctrl+R)
- Clear browser cache
- Check browser console for errors (F12)

**Notifications not appearing?**
- Verify server is running: `http://localhost:5002`
- Check server logs for errors
- Verify MongoDB is running: `mongosh` in terminal
- Check if notification was created: Run the "Get all notifications" curl command

**Badge count not updating?**
- Wait 30 seconds (frontend polls every 30 seconds)
- Or refresh the page

**Can't click on notifications?**
- Check browser console for JavaScript errors
- Verify React app compiled successfully

## ✨ Success Criteria:

✅ Bell icon visible in navbar  
✅ Badge shows correct unread count  
✅ Dropdown opens when clicking bell  
✅ Notifications display with correct icons and colors  
✅ Can click to mark as read  
✅ Can navigate to notification center  
✅ Can filter and sort notifications  
✅ Can delete notifications  
✅ Automated checks create notifications on schedule  

---

**Need Help?** Check the server logs or browser console for error messages!
