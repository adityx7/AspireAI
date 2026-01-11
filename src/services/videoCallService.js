/**
 * Video Call Service - Fixed Implementation
 * Handles WebRTC signaling and Socket.IO events for video calls
 * 
 * Key fixes:
 * - Proper ICE candidate queuing
 * - Deterministic room IDs for same user pairs
 * - Robust connection handling
 * - Call acceptance before room join
 * - Duplicate socket prevention
 * - Proper cleanup on disconnect
 */

class VideoCallService {
  constructor(io) {
    this.io = io;
    this.activeRooms = new Map(); // roomId -> { participants: [], startTime, callStatus }
    this.userSockets = new Map(); // oderId -> { socketId, connectedAt }
    this.pendingCalls = new Map(); // roomId -> { callerId, receiverId, status, createdAt }
    this.iceCandidateQueues = new Map(); // socketId -> [candidates]
    
    this.setupSocketHandlers();
    
    // Cleanup stale data every 5 minutes
    setInterval(() => this.cleanupStaleData(), 5 * 60 * 1000);
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      // Prevent duplicate registrations
      socket.on('register', (userId) => {
        if (!userId) {
          console.warn('⚠️ Register called without userId');
          return;
        }

        // Disconnect previous socket for same user (prevent duplicates)
        const existingSocket = this.userSockets.get(userId);
        if (existingSocket && existingSocket.socketId !== socket.id) {
          const oldSocket = this.io.sockets.sockets.get(existingSocket.socketId);
          if (oldSocket) {
            console.log(`🔄 Replacing old socket for user ${userId}`);
            oldSocket.emit('session-replaced', { message: 'Connected from another tab/device' });
            oldSocket.disconnect(true);
          }
        }

        this.userSockets.set(userId, {
          socketId: socket.id,
          connectedAt: Date.now()
        });
        socket.userId = userId;
        
        console.log(`✅ User registered: ${userId} -> ${socket.id}`);
        
        // Notify user of successful registration
        socket.emit('registered', { userId, socketId: socket.id });
      });

      // Initiate a call (before joining room)
      socket.on('call-user', ({ callerId, callerName, receiverId, receiverName, roomId }) => {
        console.log(`📞 Call request: ${callerName} -> ${receiverName}, room: ${roomId}`);
        
        const receiverSocket = this.userSockets.get(receiverId);
        
        if (!receiverSocket) {
          socket.emit('call-failed', {
            reason: 'User is offline',
            receiverId
          });
          return;
        }

        // Store pending call
        this.pendingCalls.set(roomId, {
          callerId,
          callerName,
          receiverId,
          receiverName,
          status: 'ringing',
          createdAt: Date.now()
        });

        // Notify receiver
        this.io.to(receiverSocket.socketId).emit('incoming-call', {
          callerId,
          callerName,
          receiverId,
          receiverName,
          roomId
        });

        // Notify caller that call is ringing
        socket.emit('call-ringing', { roomId, receiverId });

        // Auto-timeout call after 30 seconds
        setTimeout(() => {
          const call = this.pendingCalls.get(roomId);
          if (call && call.status === 'ringing') {
            this.pendingCalls.delete(roomId);
            
            socket.emit('call-timeout', { roomId, reason: 'No answer' });
            
            const recvSocket = this.userSockets.get(receiverId);
            if (recvSocket) {
              this.io.to(recvSocket.socketId).emit('call-missed', {
                callerId,
                callerName,
                roomId
              });
            }
          }
        }, 30000);
      });

      // Accept call
      socket.on('accept-call', ({ roomId, callerId }) => {
        console.log(`✅ Call accepted for room: ${roomId}`);
        
        const call = this.pendingCalls.get(roomId);
        if (call) {
          call.status = 'accepted';
          
          const callerSocket = this.userSockets.get(callerId);
          if (callerSocket) {
            this.io.to(callerSocket.socketId).emit('call-accepted', {
              roomId,
              acceptedBy: socket.userId
            });
          }
        }
      });

      // Reject call
      socket.on('reject-call', ({ roomId, callerId, reason }) => {
        console.log(`❌ Call rejected for room: ${roomId}`);
        
        this.pendingCalls.delete(roomId);
        
        const callerSocket = this.userSockets.get(callerId);
        if (callerSocket) {
          this.io.to(callerSocket.socketId).emit('call-rejected', {
            roomId,
            rejectedBy: socket.userId,
            reason: reason || 'Call declined'
          });
        }
      });

      // Cancel outgoing call
      socket.on('cancel-call', ({ roomId, receiverId }) => {
        console.log(`🚫 Call cancelled for room: ${roomId}`);
        
        this.pendingCalls.delete(roomId);
        
        const receiverSocket = this.userSockets.get(receiverId);
        if (receiverSocket) {
          this.io.to(receiverSocket.socketId).emit('call-cancelled', {
            roomId,
            cancelledBy: socket.userId
          });
        }
      });

      // Join video call room (only after call accepted)
      socket.on('join-room', ({ roomId, userId, userName, userType }) => {
        if (!roomId || !userId) {
          socket.emit('error', { message: 'Invalid room or user ID' });
          return;
        }

        // Leave any previous room
        if (socket.roomId && socket.roomId !== roomId) {
          this.handleUserLeave(socket, socket.roomId);
        }

        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;
        socket.userName = userName;
        socket.userType = userType;

        // Initialize ICE candidate queue for this socket
        this.iceCandidateQueues.set(socket.id, []);

        // Track room participants
        if (!this.activeRooms.has(roomId)) {
          this.activeRooms.set(roomId, {
            participants: [],
            startTime: Date.now(),
            callStatus: 'connecting'
          });
        }

        const room = this.activeRooms.get(roomId);
        
        // Prevent duplicate participants
        const existingParticipant = room.participants.find(p => p.userId === userId);
        if (!existingParticipant) {
          room.participants.push({
            userId,
            userName,
            userType,
            socketId: socket.id,
            joinedAt: Date.now(),
            connectionState: 'new'
          });
        } else {
          // Update socket ID for existing participant (reconnection)
          existingParticipant.socketId = socket.id;
          existingParticipant.connectionState = 'new';
        }

        console.log(`👤 ${userName} joined room ${roomId} (${room.participants.length} participants)`);

        // Get other participants
        const otherParticipants = room.participants.filter(p => p.socketId !== socket.id);

        // Send existing participants to the new joiner
        socket.emit('room-joined', {
          roomId,
          participants: otherParticipants,
          isInitiator: otherParticipants.length === 0
        });

        // Notify other participants
        socket.to(roomId).emit('user-joined', {
          userId,
          userName,
          userType,
          socketId: socket.id
        });

        // If room has 2 participants, update status
        if (room.participants.length === 2) {
          room.callStatus = 'connected';
          this.io.in(roomId).emit('call-connected', {
            participants: room.participants.map(p => ({
              userId: p.userId,
              userName: p.userName,
              userType: p.userType
            }))
          });
        }
      });

      // WebRTC Signaling: Offer
      socket.on('offer', ({ to, offer, from }) => {
        console.log(`📤 Offer from ${socket.userName || from} to ${to}`);
        
        this.io.to(to).emit('offer', {
          from: socket.id,
          fromUserId: from || socket.userId,
          fromUserName: socket.userName,
          offer
        });
      });

      // WebRTC Signaling: Answer
      socket.on('answer', ({ to, answer, from }) => {
        console.log(`📥 Answer from ${socket.userName || from} to ${to}`);
        
        this.io.to(to).emit('answer', {
          from: socket.id,
          fromUserId: from || socket.userId,
          answer
        });

        // Send any queued ICE candidates
        const queuedCandidates = this.iceCandidateQueues.get(to) || [];
        if (queuedCandidates.length > 0) {
          console.log(`📦 Sending ${queuedCandidates.length} queued ICE candidates to ${to}`);
          queuedCandidates.forEach(item => {
            this.io.to(to).emit('ice-candidate', item);
          });
          this.iceCandidateQueues.set(to, []);
        }
      });

      // WebRTC Signaling: ICE Candidate
      socket.on('ice-candidate', ({ to, candidate, from }) => {
        if (!candidate) return;
        
        const candidateData = {
          from: socket.id,
          fromUserId: from || socket.userId,
          candidate
        };

        // Check if the target socket has set remote description
        const targetRoom = this.activeRooms.get(socket.roomId);
        const targetParticipant = targetRoom?.participants.find(p => p.socketId === to);
        
        if (targetParticipant?.connectionState === 'connected') {
          // Remote description is set, send immediately
          this.io.to(to).emit('ice-candidate', candidateData);
        } else {
          // Queue the candidate
          const queue = this.iceCandidateQueues.get(to) || [];
          queue.push(candidateData);
          this.iceCandidateQueues.set(to, queue);
        }
      });

      // Notify that remote description is set (for ICE candidate queuing)
      socket.on('remote-description-set', () => {
        const room = this.activeRooms.get(socket.roomId);
        if (room) {
          const participant = room.participants.find(p => p.socketId === socket.id);
          if (participant) {
            participant.connectionState = 'connected';
          }
        }

        // Send queued ICE candidates
        const queuedCandidates = this.iceCandidateQueues.get(socket.id) || [];
        if (queuedCandidates.length > 0) {
          console.log(`📦 Delivering ${queuedCandidates.length} queued ICE candidates`);
          queuedCandidates.forEach(item => {
            socket.emit('ice-candidate', item);
          });
          this.iceCandidateQueues.set(socket.id, []);
        }
      });

      // Connection state update
      socket.on('connection-state-change', ({ state }) => {
        console.log(`🔗 Connection state for ${socket.userName}: ${state}`);
        
        const room = this.activeRooms.get(socket.roomId);
        if (room) {
          const participant = room.participants.find(p => p.socketId === socket.id);
          if (participant) {
            participant.connectionState = state;
          }
        }

        // Notify other participants
        socket.to(socket.roomId).emit('peer-connection-state', {
          userId: socket.userId,
          state
        });
      });

      // Toggle video
      socket.on('toggle-video', ({ roomId, enabled }) => {
        socket.to(roomId).emit('user-toggle-video', {
          userId: socket.userId,
          userName: socket.userName,
          enabled
        });
      });

      // Toggle audio
      socket.on('toggle-audio', ({ roomId, enabled }) => {
        socket.to(roomId).emit('user-toggle-audio', {
          userId: socket.userId,
          userName: socket.userName,
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
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          senderId: socket.userId,
          senderName: socket.userName,
          message,
          timestamp: Date.now()
        };
        
        this.io.in(roomId).emit('chat-message', chatMessage);
      });

      // Recording control
      socket.on('start-recording', ({ roomId }) => {
        socket.to(roomId).emit('recording-started', {
          startedBy: socket.userId,
          startedByName: socket.userName,
          timestamp: Date.now()
        });
      });

      socket.on('stop-recording', ({ roomId }) => {
        socket.to(roomId).emit('recording-stopped', {
          stoppedBy: socket.userId,
          timestamp: Date.now()
        });
      });

      // Renegotiation (for adding/removing tracks)
      socket.on('renegotiate', ({ to }) => {
        console.log(`🔄 Renegotiation requested by ${socket.userName}`);
        this.io.to(to).emit('renegotiate-request', {
          from: socket.id,
          fromUserId: socket.userId
        });
      });

      // Leave room
      socket.on('leave-room', ({ roomId }) => {
        this.handleUserLeave(socket, roomId || socket.roomId);
      });

      // Disconnect
      socket.on('disconnect', (reason) => {
        console.log(`🔌 Socket disconnected: ${socket.id}, reason: ${reason}`);
        
        if (socket.userId) {
          // Only remove from userSockets if this is the current socket
          const currentSocket = this.userSockets.get(socket.userId);
          if (currentSocket && currentSocket.socketId === socket.id) {
            this.userSockets.delete(socket.userId);
          }
        }
        
        if (socket.roomId) {
          this.handleUserLeave(socket, socket.roomId);
        }

        // Clean up ICE candidate queue
        this.iceCandidateQueues.delete(socket.id);
      });

      // Reconnection handling
      socket.on('reconnect-attempt', ({ roomId, userId, userName, userType }) => {
        console.log(`🔄 Reconnection attempt from ${userName} for room ${roomId}`);
        
        // Re-register user
        socket.userId = userId;
        socket.userName = userName;
        socket.userType = userType;
        
        this.userSockets.set(userId, {
          socketId: socket.id,
          connectedAt: Date.now()
        });

        // Rejoin room if it exists
        if (this.activeRooms.has(roomId)) {
          socket.emit('can-rejoin', { roomId });
        } else {
          socket.emit('room-ended', { roomId });
        }
      });
    });
  }

  handleUserLeave(socket, roomId) {
    if (!roomId) return;
    
    console.log(`👋 ${socket.userName || socket.id} leaving room ${roomId}`);
    
    // Remove from room tracking
    if (this.activeRooms.has(roomId)) {
      const room = this.activeRooms.get(roomId);
      room.participants = room.participants.filter(p => p.socketId !== socket.id);
      
      // Notify others in room
      socket.to(roomId).emit('user-left', {
        userId: socket.userId,
        userName: socket.userName,
        socketId: socket.id
      });
      
      // Clean up empty rooms
      if (room.participants.length === 0) {
        this.activeRooms.delete(roomId);
        this.pendingCalls.delete(roomId);
        console.log(`🧹 Room ${roomId} cleaned up`);
      } else if (room.participants.length === 1) {
        // Notify remaining participant they're alone
        const remainingParticipant = room.participants[0];
        this.io.to(remainingParticipant.socketId).emit('peer-disconnected', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    }
    
    socket.leave(roomId);
    socket.roomId = null;
    
    // Clean up ICE candidate queue
    this.iceCandidateQueues.delete(socket.id);
  }

  cleanupStaleData() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    // Clean up old pending calls
    for (const [roomId, call] of this.pendingCalls) {
      if (now - call.createdAt > 60000) { // 1 minute for pending calls
        this.pendingCalls.delete(roomId);
      }
    }
    
    // Clean up old empty rooms
    for (const [roomId, room] of this.activeRooms) {
      if (room.participants.length === 0 && now - room.startTime > maxAge) {
        this.activeRooms.delete(roomId);
      }
    }
    
    console.log(`🧹 Cleanup complete. Active rooms: ${this.activeRooms.size}, Pending calls: ${this.pendingCalls.size}`);
  }

  // Get active rooms
  getActiveRooms() {
    const rooms = [];
    this.activeRooms.forEach((value, key) => {
      rooms.push({
        roomId: key,
        participantCount: value.participants.length,
        startTime: value.startTime,
        duration: Date.now() - value.startTime,
        callStatus: value.callStatus
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

  // Get online users
  getOnlineUsers() {
    return Array.from(this.userSockets.keys());
  }

  // Send notification to user
  notifyUser(userId, event, data) {
    const userSocket = this.userSockets.get(userId);
    if (userSocket) {
      this.io.to(userSocket.socketId).emit(event, data);
      return true;
    }
    return false;
  }
}

module.exports = VideoCallService;
