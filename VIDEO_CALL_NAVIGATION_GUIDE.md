# 🎯 Navigation Menu Integration Guide

## Adding Video Calls to Navigation

To make the video call feature easily accessible, add it to your navigation menus.

---

## For Student Sidebar (SideBar.js)

Add this menu item to your student sidebar:

```jsx
<Link to="/video-calls" className="nav-link">
  <VideoCall className="nav-icon" />
  <span>Video Calls</span>
</Link>
```

**Import needed:**
```jsx
import { VideoCall } from '@mui/icons-material';
```

**Suggested position:** Between "Mentors" and "Documents"

---

## For Mentor Sidebar (SideBarMentor.js)

Add this menu item to your mentor sidebar:

```jsx
<Link to="/video-calls" className="nav-link">
  <VideoCall className="nav-icon" />
  <span>Video Calls</span>
</Link>
```

**Suggested position:** Between "Students" and "Meeting Notes"

---

## For Student Dashboard (Dashboard.js)

Add a quick action card:

```jsx
<div className="dashboard-card" onClick={() => navigate('/video-calls')}>
  <div className="card-icon">
    <VideoCall />
  </div>
  <h3>Video Calls</h3>
  <p>Connect with your mentors</p>
  <span className="upcoming-count">{upcomingCalls} upcoming</span>
</div>
```

---

## For Mentor Dashboard (MentorMain.js)

Add a quick action card:

```jsx
<div className="dashboard-card" onClick={() => navigate('/video-calls')}>
  <div className="card-icon">
    <VideoCall />
  </div>
  <h3>Video Calls</h3>
  <p>Connect with your students</p>
  <span className="call-now-badge">Call Now</span>
</div>
```

---

## Notification Integration

Add incoming call alerts to NotificationBell.js:

```jsx
// Listen for incoming calls via Socket.IO
useEffect(() => {
  const socket = io('http://localhost:5002');
  
  socket.emit('register', userId);
  
  socket.on('incoming-call', (data) => {
    // Show toast notification
    toast.info(`Incoming call from ${data.callerName}`, {
      onClick: () => navigate(`/video-call/${data.roomId}`)
    });
  });
  
  return () => socket.disconnect();
}, [userId]);
```

---

## Navbar Quick Access

Add a video call icon to the top navbar for instant access:

```jsx
<IconButton 
  onClick={() => navigate('/video-calls')}
  title="Video Calls"
>
  <Badge badgeContent={upcomingCallsCount} color="error">
    <VideoCall />
  </Badge>
</IconButton>
```

**Shows:** Badge with number of upcoming/pending calls

---

## Student Profile Page

Add call history widget:

```jsx
<div className="profile-section">
  <h3>Recent Video Calls</h3>
  {recentCalls.map(call => (
    <div key={call._id} className="call-item">
      <span>{call.receiver.name}</span>
      <span>{formatDate(call.startTime)}</span>
      <span>{formatDuration(call.duration)}</span>
    </div>
  ))}
  <Link to="/video-calls">View all calls →</Link>
</div>
```

---

## Mentor Profile Page

Add call statistics:

```jsx
<div className="stats-card">
  <h3>Call Statistics</h3>
  <div className="stat-item">
    <span>Total Calls</span>
    <strong>{totalCalls}</strong>
  </div>
  <div className="stat-item">
    <span>This Month</span>
    <strong>{monthCalls}</strong>
  </div>
  <div className="stat-item">
    <span>Total Duration</span>
    <strong>{formatDuration(totalDuration)}</strong>
  </div>
</div>
```

---

## Meeting Notes Integration

Link meeting notes to video calls:

In `MentorMeetingNotesPage.jsx`, add a button to start a call:

```jsx
<button 
  className="video-call-btn"
  onClick={async () => {
    const response = await axios.post('/api/video-calls/initiate', {
      initiatorId: mentorId,
      initiatorType: 'mentor',
      initiatorName: mentorName,
      receiverId: studentId,
      receiverType: 'student',
      receiverName: studentName
    });
    navigate(`/video-call/${response.data.data.roomId}`);
  }}
>
  <VideoCall /> Start Video Call
</button>
```

---

## Student Meeting Notes

In `StudentMeetingNotesPage.jsx`, show if call was recorded:

```jsx
{note.videoCallId && (
  <div className="video-call-info">
    <VideoCall />
    <span>This meeting had a video call</span>
    <button onClick={() => viewCallDetails(note.videoCallId)}>
      View Recording
    </button>
  </div>
)}
```

---

## Settings Page

Add video call preferences:

```jsx
<div className="settings-section">
  <h3>Video Call Settings</h3>
  
  <label>
    <input type="checkbox" checked={autoAcceptFromMentor} />
    Auto-accept calls from mentor
  </label>
  
  <label>
    <input type="checkbox" checked={enableCallNotifications} />
    Enable call notifications
  </label>
  
  <label>
    <input type="checkbox" checked={saveCallHistory} />
    Save call history
  </label>
  
  <label>
    Default video quality:
    <select value={videoQuality}>
      <option value="high">High (720p)</option>
      <option value="medium">Medium (480p)</option>
      <option value="low">Low (360p)</option>
    </select>
  </label>
</div>
```

---

## Mobile View

For responsive mobile navigation:

```jsx
<BottomNavigation>
  <BottomNavigationAction
    label="Calls"
    icon={<VideoCall />}
    onClick={() => navigate('/video-calls')}
  />
</BottomNavigation>
```

---

## Example Complete Integration

### In SideBar.js (Student):

```jsx
import { 
  Home, 
  School, 
  VideoCall,  // ADD THIS
  People, 
  Description, 
  Settings 
} from '@mui/icons-material';

// ... existing code ...

<nav className="sidebar-nav">
  <Link to="/dashboard" className="nav-link">
    <Home /> Dashboard
  </Link>
  
  <Link to="/academics" className="nav-link">
    <School /> Academics
  </Link>
  
  <Link to="/mentors" className="nav-link">
    <People /> Mentors
  </Link>
  
  {/* ADD THIS */}
  <Link to="/video-calls" className="nav-link">
    <VideoCall /> Video Calls
  </Link>
  
  <Link to="/documents" className="nav-link">
    <Description /> Documents
  </Link>
  
  <Link to="/settings" className="nav-link">
    <Settings /> Settings
  </Link>
</nav>
```

---

## Styling Tips

### Active Link Highlight:
```css
.nav-link.active[href="/video-calls"] {
  background: linear-gradient(135deg, #B8860B 0%, #DAA520 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
}
```

### Icon Color:
```css
.nav-link .nav-icon {
  color: #B8860B;
}
```

### Badge for Pending Calls:
```jsx
<Badge badgeContent={pendingCalls} color="error">
  <VideoCall />
</Badge>
```

---

## Quick Action Buttons

Add these throughout the platform:

```jsx
// On mentor card
<IconButton onClick={() => callMentor(mentorId)}>
  <VideoCall />
</IconButton>

// On student card (for mentors)
<IconButton onClick={() => callStudent(studentId)}>
  <VideoCall />
</IconButton>

// In chat messages
<Button onClick={() => startVideoCall()}>
  <VideoCall /> Upgrade to Video Call
</Button>
```

---

## Summary

**Key Integration Points:**
1. ✅ Student Sidebar - Main navigation
2. ✅ Mentor Sidebar - Main navigation
3. ✅ Dashboard Cards - Quick access
4. ✅ Navbar - Top-level access
5. ✅ Profile Pages - Call history
6. ✅ Meeting Notes - Link to calls
7. ✅ Settings - Preferences
8. ✅ Mobile Nav - Bottom navigation

**Result:** Video calls accessible from anywhere in the platform! 🎉
