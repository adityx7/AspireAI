# 🚀 Video Call System - Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Start the Server
```bash
npm start
```
This will start:
- React frontend on `http://localhost:3000`
- Backend server with Socket.IO on `http://localhost:5002`
- AI Assistant (Python Flask)

### Step 2: Access Video Calls

#### For Students:
1. Login at `http://localhost:3000/login`
2. Navigate to **Video Calls** from sidebar/dashboard
3. Or directly: `http://localhost:3000/video-calls`

#### For Mentors:
1. Login at `http://localhost:3000/mentor-login`
2. Navigate to **Video Calls** from sidebar/dashboard
3. Or directly: `http://localhost:3000/video-calls`

### Step 3: Make Your First Call

#### Instant Call:
1. Select "Start Call" tab
2. Choose a mentor/student from dropdown
3. Click "Start Call Now"
4. Wait for other person to accept
5. Enjoy your video call! 🎉

#### Schedule a Call:
1. Select "Start Call" tab
2. Choose a mentor/student
3. Pick date and time
4. Click "Schedule Call"
5. Both parties will see it in "Scheduled" tab

---

## 🎮 In-Call Features

### Controls Available:
- 🎥 **Toggle Camera** - Turn video on/off
- 🎤 **Toggle Microphone** - Mute/unmute
- 🖥️ **Screen Share** - Share your screen
- 💬 **Chat** - Send text messages
- ⏺️ **Record** - Record the session (coming soon)
- 📞 **End Call** - Leave the call

### Tips:
- Your video appears in bottom-right corner (mirrored)
- Remote video fills the screen
- Connection status shown at top
- Call duration tracked automatically
- Chat messages saved to database

---

## 🔧 Technical Details

### Frontend Components:
- `VideoCallDashboard.jsx` - Main dashboard
- `VideoCallRoom.jsx` - Active call interface

### Backend Services:
- `videoCallRoutes.js` - REST API
- `videoCallService.js` - Socket.IO signaling
- `VideoCall.js` - Database model

### WebRTC Configuration:
- Uses Google's public STUN servers
- Peer-to-peer connection
- Automatic ICE candidate exchange

---

## 🐛 Troubleshooting

### Camera not working?
- Allow browser camera/microphone permissions
- Try refreshing the page
- Test on Chrome/Firefox (recommended)

### Can't connect?
- Ensure both users are online
- Check internet connection
- Verify server is running on port 5002

### No audio/video?
- Check if microphone/camera are in use by other apps
- Verify WebRTC is supported (modern browsers only)
- Test at `chrome://webrtc-internals/`

---

## 📱 Browser Support

### Fully Supported:
- ✅ Chrome 74+
- ✅ Firefox 66+
- ✅ Edge 79+
- ✅ Safari 12.1+
- ✅ Opera 62+

### Not Supported:
- ❌ Internet Explorer
- ❌ Older mobile browsers

---

## 🎨 UI Shortcuts

### Keyboard Shortcuts (Coming Soon):
- `M` - Toggle microphone
- `V` - Toggle video
- `C` - Open/close chat
- `S` - Start/stop screen share
- `ESC` - End call

---

## 📞 Need Help?

### Common Questions:

**Q: Can I call multiple people?**  
A: Currently supports 1-on-1 calls. Group calls coming soon!

**Q: Are calls recorded automatically?**  
A: No, you must click the record button. Recording feature in development.

**Q: Can I call someone not in my mentor/mentee list?**  
A: Currently limited to assigned mentor-mentee pairs for security.

**Q: What happens if I lose connection?**  
A: Call will pause, and you'll see "disconnected" status. Rejoin when connection restored.

---

## 🚀 Next Steps

1. **Test a call** with a colleague
2. **Schedule a call** for later today
3. **Explore features** (screen share, chat)
4. **Check call history** to see past sessions

---

**Ready to connect?** Head to `/video-calls` and start your first call! 📹✨
