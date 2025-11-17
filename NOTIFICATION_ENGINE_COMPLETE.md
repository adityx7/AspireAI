# Smart Student Notification Engine - Complete Implementation

## 🎯 Overview
A comprehensive notification system for AspireAI that automatically monitors student academic performance and sends intelligent alerts to help students stay on track.

---

## ✅ Completed Features

### 1. Backend Implementation

#### A. Notification Model (`src/models/Notification.js`)
- Extended existing model with new notification types:
  - `attendance` - Attendance alerts
  - `internal_marks` - IA performance alerts
  - `semester_performance` - SGPA/CGPA alerts
  - `assignment` - Assignment notifications
  - `exam_reminder` - Exam reminders
  - `aicte_points` - AICTE activity points
  - `inactivity` - Student inactivity alerts
  - `wellbeing` - Mental health signals
  - `career_development` - Skill development reminders
  - `mentor_alert` - Mentor notifications
  - `deadline` - Deadline reminders

#### B. Notification Engine Service (`src/services/notificationEngine.js`)
Core functions implemented:
- `checkAttendance(student)` - Monitors attendance < 75% and trending patterns
- `checkInternalMarks(student)` - Tracks IA marks and declining performance
- `checkSemesterPerformance(student)` - SGPA/CGPA monitoring
- `checkAICTEPoints(student)` - AICTE activity tracking
- `checkInactivity(student)` - Login and task completion monitoring
- `checkCareerDevelopment(student)` - Certificate and GitHub activity tracking
- `checkWellbeing(student, chatMessages)` - Stress keyword detection
- `createExamReminder()` - 7-day, 1-day, and same-day reminders
- `createDeadlineReminder()` - 48-hour and 2-hour alerts
- `createMentorAlert()` - Mentor-initiated student alerts
- `runAllChecks(student)` - Run all checks for one student
- `runChecksForAllStudents()` - Batch process all students

#### C. Notification Controller (`src/controllers/notificationController.js`)
API endpoints:
- `GET /api/notifications/:userId` - Get all notifications with filters
- `GET /api/notifications/:userId/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/:userId/mark-all-read` - Mark all read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/check/:userId` - Run checks for one student
- `POST /api/notifications/check-all` - Run checks for all students
- `POST /api/notifications/mentor-alert` - Create mentor alert

#### D. Notification Scheduler (`src/services/notificationScheduler.js`)
Automated cron jobs:
- **Daily checks** - 8:00 AM IST (attendance, marks, SGPA, AICTE, inactivity, career)
- **Hourly checks** - Every hour (priority checks)
- **Exam reminders** - 6:00 PM IST (7 days, 1 day, same day)
- **Deadline reminders** - Every 6 hours (48 hours, 2 hours before)

---

### 2. Frontend Implementation

#### A. Notification Bell Component (`src/components/organisms/NotificationBell.js`)
Features:
- Bell icon with unread badge in navbar
- Dropdown menu with latest 5 notifications
- Real-time unread count (polls every 30 seconds)
- Click to mark as read and navigate
- "Mark all read" button
- "View all" button to notification center
- Color-coded priority indicators
- Icons for each notification type

#### B. Notification Center Page (`src/components/pages/NotificationCenterPage.js`)
Features:
- Full-page notification management
- Tabs: All, Unread, Academic, Urgent
- Filterable notification list
- Priority badges (URGENT, HIGH, MEDIUM, LOW)
- Color-coded left border by priority
- Swipe animations on hover
- Mark as read on click
- Delete individual notifications
- Action buttons for quick navigation
- Responsive design matching AspireAI theme

---

### 3. Routes & Integration

#### Routes Added:
```javascript
// Server.js
app.use('/api/notifications', notificationRoutes);

// App.js
<Route path="/notifications" element={<NotificationCenterPage />} />
```

#### Scheduler Integration:
The notification scheduler automatically starts when the server boots up and runs:
- Daily at 8:00 AM
- Hourly checks
- Evening exam reminders
- Deadline checks every 6 hours

---

## 🎨 UI/UX Features

### Color Coding by Priority:
- **Urgent (Red)**: #d32f2f - Critical issues requiring immediate attention
- **High (Orange-Red)**: #ff6b6b - Important alerts
- **Medium (Orange)**: #ff9800 - Standard notifications
- **Low (Green)**: #4caf50 - Informational

### Icons by Type:
- 🚨 Attendance - WarningAmberIcon
- 📉 Marks/Performance - TrendingDownIcon
- 📝 Assignment/Deadline - AssignmentIcon
- 📅 Exam Reminder - EventIcon
- 💙 Wellbeing - FavoriteIcon
- 🎓 Career - SchoolIcon
- 👤 Mentor Alert - PersonIcon

### Animation Effects:
- Fade-in on load
- Hover transform (translateX)
- Smooth transitions
- Badge pulse animation for unread count

---

## 🔔 Notification Rules Summary

### A. Attendance Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| < 75% | High | Your attendance is at X%. You need at least 75% |
| < 65% | Urgent | Critical! You are at risk of being barred from exams |
| Declining trend | Medium | Your attendance has been consistently decreasing |

### B. Internal Assessment Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| IA marks < 15/30 | High | You are at risk in this subject |
| Declining across IAs | Medium | Your performance is consistently decreasing |

### C. Semester Performance Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| SGPA < 6.0 | High | Your semester performance is below expectations |
| CGPA decreased | High | Your CGPA has dropped by X points |

### D. AICTE Points Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| < 50% by mid-year | Medium | Participate in more activities to meet requirements |
| Pending verification | Low | X certificate(s) pending verification |

### E. Inactivity Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| No login 3+ days | Low | You haven't logged in for X days |
| Incomplete tasks > 5 | Medium | You have X incomplete tasks in your study plan |

### F. Career Development Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| No certificate 60+ days | Low | Consider taking a new course to enhance skills |
| No GitHub activity 30+ days | Low | Keep building projects to strengthen portfolio |

### G. Exam & Deadline Reminders
| Condition | Priority | Message |
|-----------|----------|---------|
| Exam in 7 days | Medium | Exam scheduled for [date]. Start preparing now! |
| Exam in 1 day | High | Exam tomorrow. Make sure you're prepared! |
| Exam today | Urgent | Exam is today! Good luck! |
| Deadline in 48 hours | High | Assignment due in 48 hours |
| Deadline in 2 hours | Urgent | Assignment due in 2 hours! Submit now! |

### H. Wellbeing Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| Stress keywords detected | Medium | We care about your wellbeing. Talk to your mentor |

### I. Mentor Alerts
| Condition | Priority | Message |
|-----------|----------|---------|
| Mentor flags issue | High | Your mentor wants to discuss: [reason] |

---

## 📊 Testing Scenarios

### Test Cases to Verify:

1. **Attendance Alert**
   - Set student attendance to 74% → Should receive HIGH priority alert
   - Set to 64% → Should receive URGENT alert

2. **Internal Marks Alert**
   - Set IA1 marks to 14/30 → Should receive HIGH alert
   - Set IA2 < IA1 and IA3 < IA2 → Should receive declining performance alert

3. **Inactivity Alert**
   - Don't log in for 3 days → Should receive LOW alert
   - Set incomplete tasks > 5 → Should receive MEDIUM alert

4. **Exam Reminder**
   - Add exam 7 days from now → Should receive MEDIUM reminder at 6 PM
   - Add exam tomorrow → Should receive HIGH reminder

5. **Real-time Updates**
   - Verify bell icon shows correct unread count
   - Verify count updates after marking as read
   - Verify notifications appear in center page

6. **Mentor Alert**
   - POST to `/api/notifications/mentor-alert` → Student should receive notification

7. **Manual Trigger**
   - POST to `/api/notifications/check/:userId` → Should run all checks

---

## 🚀 Usage Guide

### For Students:
1. **View Notifications**: Click bell icon in navbar
2. **Mark as Read**: Click on notification
3. **View All**: Click "View All Notifications" button
4. **Filter**: Use tabs in Notification Center (All/Unread/Academic/Urgent)
5. **Delete**: Click delete icon on individual notifications
6. **Take Action**: Click action buttons to navigate to relevant pages

### For Mentors:
1. **Create Alert**: Use mentor dashboard or API endpoint
2. **Monitor Student**: Mentor can see critical alerts for their mentees

### For Admins:
1. **Manual Trigger**: `POST /api/notifications/check-all`
2. **Individual Check**: `POST /api/notifications/check/:userId`
3. **View Status**: Check scheduler status in server logs

---

## 🔧 Integration Points

### Trigger Notifications When:
1. **Attendance Updated** - Call `notificationEngine.checkAttendance(student)`
2. **Marks Updated** - Call `notificationEngine.checkInternalMarks(student)`
3. **Semester Results** - Call `notificationEngine.checkSemesterPerformance(student)`
4. **Student Logs In** - Update `lastLogin` field
5. **AI Chat Message** - Call `notificationEngine.checkWellbeing(student, messages)`
6. **Mentor Flags Issue** - Call `notificationEngine.createMentorAlert()`
7. **Assignment Created** - Store in `student.assignments` array
8. **Exam Scheduled** - Store in `student.upcomingExams` array

---

## 📝 Next Steps (Optional Enhancements)

1. **Push Notifications** - Web Push API integration
2. **Email Alerts** - Send email for urgent notifications
3. **SMS Alerts** - For critical issues (attendance < 65%, exam today)
4. **Do Not Disturb** - Allow students to set quiet hours
5. **Notification Preferences** - Let students customize which alerts they receive
6. **Analytics Dashboard** - Track notification engagement
7. **Mentor Dashboard** - Dedicated view for mentors to see their students' alerts
8. **Socket.IO Integration** - Real-time notifications without polling

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NOTIFICATION ENGINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Attendance  │  │ Internal Marks│  │   Semester   │      │
│  │    Check     │  │     Check     │  │ Performance  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AICTE Points │  │  Inactivity  │  │    Career    │      │
│  │    Check     │  │     Check     │  │ Development  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Wellbeing   │  │ Exam Reminder│  │   Deadline   │      │
│  │    Check     │  │     Check     │  │   Reminder   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  NOTIFICATION SCHEDULER                       │
├─────────────────────────────────────────────────────────────┤
│  • Daily at 8:00 AM  (Full checks)                          │
│  • Hourly           (Priority checks)                        │
│  • 6:00 PM          (Exam reminders)                         │
│  • Every 6 hours    (Deadline reminders)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB COLLECTION                          │
├─────────────────────────────────────────────────────────────┤
│  • userId, type, title, body                                 │
│  • priority, read, readAt                                    │
│  • payload, actionUrl, actionLabel                           │
│  • createdAt, expiresAt                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     API ENDPOINTS                             │
├─────────────────────────────────────────────────────────────┤
│  GET    /api/notifications/:userId                           │
│  GET    /api/notifications/:userId/unread-count              │
│  POST   /api/notifications                                   │
│  PUT    /api/notifications/:id/read                          │
│  PUT    /api/notifications/:userId/mark-all-read             │
│  DELETE /api/notifications/:id                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  • NotificationBell (Navbar)                                 │
│  • NotificationCenterPage (Full View)                        │
│  • Real-time polling every 30 seconds                        │
│  • Color-coded UI with priority indicators                   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Complete!

All components of the Smart Student Notification Engine have been successfully implemented and integrated into AspireAI. The system is ready for testing and deployment.

**Total Files Created/Modified:** 8
**API Endpoints Added:** 9
**Cron Jobs Scheduled:** 4
**Notification Types:** 12
**Frontend Components:** 2

The system will automatically monitor all students and send appropriate notifications based on their academic performance and behavior patterns! 🎉
