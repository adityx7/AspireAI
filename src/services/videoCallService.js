/**
 * Video Call Service
 * Handles WebRTC signaling and Socket.IO events for video calls
 */

class VideoCallService {
  constructor(io) {
    this.io = io;
    this.activeRooms = new Map(); // roomId -> { participants: [], startTime }
    this.userSockets = new Map(); // userId -> socketId
    
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      // User registers their ID
      socket.on('register', (userId) => {
        this.userSockets.set(userId, socket.id);
        socket.userId = userId;
        console.log(`✅ User registered: ${userId} -> ${socket.id}`);
      });

      // Join video call room
      socket.on('join-room', ({ roomId, userId, userName, userType }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;
        socket.userName = userName;
        socket.userType = userType;

        // Track room participants
        if (!this.activeRooms.has(roomId)) {
          this.activeRooms.set(roomId, {
            participants: [],
            startTime: Date.now()
          });
        }

        const room = this.activeRooms.get(roomId);
        room.participants.push({
          userId,
          userName,
          userType,
          socketId: socket.id,
          joinedAt: Date.now()
        });

        console.log(`👤 User ${userName} joined room ${roomId}`);

        // Notify other participants
        socket.to(roomId).emit('user-joined', {
          userId,
          userName,
          userType,
          socketId: socket.id
        });

        // Send current participants to the new joiner
        const otherParticipants = room.participants.filter(p => p.socketId !== socket.id);
        socket.emit('existing-participants', otherParticipants);
      });

      // WebRTC Signaling: Offer
      socket.on('offer', ({ to, offer, from }) => {
        console.log(`📞 Offer from ${from} to ${to}`);
        this.io.to(to).emit('offer', {
          from: socket.id,
          fromUserId: from,
          offer
        });
      });

      // WebRTC Signaling: Answer
      socket.on('answer', ({ to, answer, from }) => {
        console.log(`✅ Answer from ${from} to ${to}`);
        this.io.to(to).emit('answer', {
          from: socket.id,
          fromUserId: from,
          answer
        });
      });

      // WebRTC Signaling: ICE Candidate
      socket.on('ice-candidate', ({ to, candidate }) => {
        this.io.to(to).emit('ice-candidate', {
          from: socket.id,
          candidate
        });
      });

      // Toggle video
      socket.on('toggle-video', ({ roomId, enabled }) => {
        socket.to(roomId).emit('user-toggle-video', {
          userId: socket.userId,
          enabled
        });
      });

      // Toggle audio
      socket.on('toggle-audio', ({ roomId, enabled }) => {
        socket.to(roomId).emit('user-toggle-audio', {
          userId: socket.userId,
          enabled
        });
      });

      // Screen sharing
      socket.on('start-screen-share', ({ roomId }) => {
        socket.to(roomId).emit('user-started-screen-share', {
          userId: socket.userId,
          userName: socket.userName
        });
      });

      socket.on('stop-screen-share', ({ roomId }) => {
        socket.to(roomId).emit('user-stopped-screen-share', {
          userId: socket.userId
        });
      });

      // Chat messages
      socket.on('send-message', ({ roomId, message }) => {
        const chatMessage = {
          senderId: socket.userId,
          senderName: socket.userName,
          message,
          timestamp: Date.now()
        };
        
        // Broadcast to all in room including sender
        this.io.in(roomId).emit('chat-message', chatMessage);
      });

      // Call someone directly
      socket.on('call-user', ({ callerId, callerName, receiverId, receiverName, roomId }) => {
        const receiverSocketId = this.userSockets.get(receiverId);
        
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('incoming-call', {
            callerId,
            callerName,
            roomId,
            receiverId,
            receiverName
          });
          
          console.log(`📞 Calling ${receiverName} (${receiverId}) from ${callerName}`);
        } else {
          socket.emit('call-failed', {
            reason: 'User is offline'
          });
        }
      });

      // Accept call
      socket.on('accept-call', ({ roomId, callerId }) => {
        const callerSocketId = this.userSockets.get(callerId);
        
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call-accepted', {
            roomId,
            acceptedBy: socket.userId
          });
        }
      });

      // Reject call
      socket.on('reject-call', ({ roomId, callerId, reason }) => {
        const callerSocketId = this.userSockets.get(callerId);
        
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call-rejected', {
            roomId,
            rejectedBy: socket.userId,
            reason: reason || 'Call declined'
          });
        }
      });

      // Recording control
      socket.on('start-recording', ({ roomId }) => {
        socket.to(roomId).emit('recording-started', {
          startedBy: socket.userId,
          timestamp: Date.now()
        });
      });

      socket.on('stop-recording', ({ roomId }) => {
        socket.to(roomId).emit('recording-stopped', {
          stoppedBy: socket.userId,
          timestamp: Date.now()
        });
      });

      // Leave room
      socket.on('leave-room', ({ roomId }) => {
        this.handleUserLeave(socket, roomId);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
        
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
        
        if (socket.roomId) {
          this.handleUserLeave(socket, socket.roomId);
        }
      });
    });
  }

  handleUserLeave(socket, roomId) {
    console.log(`👋 User ${socket.userName || socket.id} left room ${roomId}`);
    
    // Remove from room tracking
    if (this.activeRooms.has(roomId)) {
      const room = this.activeRooms.get(roomId);
      room.participants = room.participants.filter(p => p.socketId !== socket.id);
      
      // Clean up empty rooms
      if (room.participants.length === 0) {
        this.activeRooms.delete(roomId);
        console.log(`🧹 Room ${roomId} cleaned up`);
      }
    }
    
    // Notify others in room
    socket.to(roomId).emit('user-left', {
      userId: socket.userId,
      userName: socket.userName,
      socketId: socket.id
    });
    
    socket.leave(roomId);
  }

  // Get active rooms
  getActiveRooms() {
    const rooms = [];
    this.activeRooms.forEach((value, key) => {
      rooms.push({
        roomId: key,
        participantCount: value.participants.length,
        startTime: value.startTime,
        duration: Date.now() - value.startTime
      });
    });
    return rooms;
  }

  // Get room participants
  getRoomParticipants(roomId) {
    const room = this.activeRooms.get(roomId);
    return room ? room.participants : [];
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.userSockets.has(userId);
  }

  // Send notification to user
  notifyUser(userId, event, data) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }
}

module.exports = VideoCallService;
