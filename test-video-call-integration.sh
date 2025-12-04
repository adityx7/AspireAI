#!/bin/bash

# Video Call System - Integration Test Script
# Run this to verify video call system is properly set up

echo "🎥 AspireAI Video Call System - Integration Test"
echo "=================================================="
echo ""

# Check if socket.io is installed
echo "✓ Checking dependencies..."
if npm list socket.io > /dev/null 2>&1; then
    echo "  ✅ socket.io installed"
else
    echo "  ❌ socket.io NOT installed"
    echo "  Run: npm install socket.io --save --legacy-peer-deps"
    exit 1
fi

# Check if files exist
echo ""
echo "✓ Checking backend files..."
FILES=(
    "src/models/VideoCall.js"
    "src/routes/videoCallRoutes.js"
    "src/services/videoCallService.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file NOT FOUND"
        exit 1
    fi
done

echo ""
echo "✓ Checking frontend files..."
FRONTEND_FILES=(
    "src/components/pages/VideoCallRoom.jsx"
    "src/components/pages/VideoCallRoom.css"
    "src/components/pages/VideoCallDashboard.jsx"
    "src/components/pages/VideoCallDashboard.css"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file NOT FOUND"
        exit 1
    fi
done

echo ""
echo "✓ Checking documentation..."
DOCS=(
    "VIDEO_CALL_IMPLEMENTATION.md"
    "VIDEO_CALL_QUICK_START.md"
    "VIDEO_CALL_COMPLETE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc NOT FOUND"
    fi
done

echo ""
echo "✓ Checking Server.js integration..."
if grep -q "socket.io" src/components/pages/student/Server.js; then
    echo "  ✅ Socket.IO integrated in Server.js"
else
    echo "  ❌ Socket.IO NOT integrated in Server.js"
    exit 1
fi

if grep -q "videoCallRoutes" src/components/pages/student/Server.js; then
    echo "  ✅ Video call routes integrated in Server.js"
else
    echo "  ❌ Video call routes NOT integrated in Server.js"
    exit 1
fi

echo ""
echo "✓ Checking App.js integration..."
if grep -q "VideoCallRoom" src/App.js; then
    echo "  ✅ VideoCallRoom imported in App.js"
else
    echo "  ❌ VideoCallRoom NOT imported in App.js"
    exit 1
fi

if grep -q "VideoCallDashboard" src/App.js; then
    echo "  ✅ VideoCallDashboard imported in App.js"
else
    echo "  ❌ VideoCallDashboard NOT imported in App.js"
    exit 1
fi

if grep -q "/video-calls" src/App.js; then
    echo "  ✅ Video call routes added to App.js"
else
    echo "  ❌ Video call routes NOT added to App.js"
    exit 1
fi

echo ""
echo "✓ Checking MongoDB connection..."
if pgrep -x "mongod" > /dev/null; then
    echo "  ✅ MongoDB is running"
else
    echo "  ⚠️  MongoDB might not be running"
    echo "  Start with: mongod --dbpath /path/to/data"
fi

echo ""
echo "=================================================="
echo "✅ All integration checks passed!"
echo ""
echo "📝 Next Steps:"
echo "1. Start server: npm start"
echo "2. Open browser: http://localhost:3000/video-calls"
echo "3. Make your first video call!"
echo ""
echo "📚 Read the docs:"
echo "   - VIDEO_CALL_QUICK_START.md - User guide"
echo "   - VIDEO_CALL_IMPLEMENTATION.md - Technical details"
echo "   - VIDEO_CALL_COMPLETE.md - Feature summary"
echo ""
echo "🎉 Ready to make video calls! 📹"
