import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  CallEnd,
  FiberManualRecord,
  Stop as StopIcon,
  Refresh,
  SignalCellularAlt,
  SignalCellularConnectedNoInternet0Bar
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import './VideoCallRoom.css';

// Configuration - adjust for production
const getSocketUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin; // Same origin for production
  }
  return process.env.REACT_APP_SOCKET_URL || 'http://localhost:5002';
};

const SOCKET_URL = getSocketUrl();

// ICE Servers with TURN fallback for NAT traversal
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    // Free TURN servers (for production, use your own TURN server)
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ],
  iceCandidatePoolSize: 10
};

// Connection states
const ConnectionState = {
  INITIALIZING: 'initializing',
  REQUESTING_MEDIA: 'requesting_media',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
  ENDED: 'ended'
};

const VideoCallRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user info from localStorage with proper fallbacks
  const [currentUser] = useState(() => {
    const userType = localStorage.getItem('userType');
    
    if (userType === 'student') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        userId: user.usn || user._id || `student_${Date.now()}`,
        userName: user.fullName || user.name || 'Student',
        userType: 'student'
      };
    } else if (userType === 'mentor') {
      const mentor = JSON.parse(localStorage.getItem('mentorData') || '{}');
      return {
        userId: mentor.mentorID || mentor._id || `mentor_${Date.now()}`,
        userName: mentor.fullName || mentor.name || 'Mentor',
        userType: 'mentor'
      };
    }
    
    // Fallback for testing
    return {
      userId: `user_${Date.now()}`,
      userName: 'User',
      userType: 'student'
    };
  });

  // Refs - using refs to avoid stale closure issues
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const isNegotiating = useRef(false);
  const makingOffer = useRef(false);
  const remoteSocketIdRef = useRef(null);

  // State
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [remoteUser, setRemoteUser] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionState, setConnectionState] = useState(ConnectionState.INITIALIZING);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
  const [networkQuality, setNetworkQuality] = useState('good'); // 'excellent', 'good', 'fair', 'poor'
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (connectionState === ConnectionState.CONNECTED) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  // Initialize call
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (!mounted) return;
      await initializeCall();
    };
    
    init();
    
    return () => {
      mounted = false;
      cleanup();
    };
  }, [roomId]);

  // Handle page visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && 
          connectionState === ConnectionState.DISCONNECTED) {
        handleReconnect();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connectionState]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (connectionState === ConnectionState.CONNECTED) {
        e.preventDefault();
        e.returnValue = 'You have an active call. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [connectionState]);

  const initializeCall = async () => {
    try {
      setConnectionState(ConnectionState.REQUESTING_MEDIA);
      
      // Request media permissions with fallbacks
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch (mediaError) {
        console.warn('Failed to get video+audio, trying audio only:', mediaError);
        
        if (mediaError.name === 'NotAllowedError') {
          setPermissionError('Camera/microphone access denied. Please allow access in your browser settings.');
          setConnectionState(ConnectionState.FAILED);
          return;
        }
        
        // Try audio only
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          setIsVideoEnabled(false);
          toast.warning('Camera not available. Continuing with audio only.');
        } catch (audioError) {
          setPermissionError('Could not access camera or microphone. Please check your device settings.');
          setConnectionState(ConnectionState.FAILED);
          return;
        }
      }
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setConnectionState(ConnectionState.CONNECTING);

      // Initialize socket connection with reconnection options
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000
      });

      setupSocketListeners();

      // Register and join room
      socketRef.current.emit('register', currentUser.userId);
      
      // Small delay to ensure registration is processed
      setTimeout(() => {
        socketRef.current.emit('join-room', {
          roomId,
          userId: currentUser.userId,
          userName: currentUser.userName,
          userType: currentUser.userType
        });
      }, 100);

      // Update backend
      try {
        await axios.put(`${SOCKET_URL}/api/video-calls/${roomId}/join`, {
          userId: currentUser.userId,
          userType: currentUser.userType
        });
      } catch (err) {
        console.warn('Failed to update backend join status:', err);
      }
      
    } catch (error) {
      console.error('Error initializing call:', error);
      setConnectionState(ConnectionState.FAILED);
      setPermissionError(error.message || 'Failed to initialize call');
    }
  };

  const setupSocketListeners = () => {
    const socket = socketRef.current;
    if (!socket) return;

    // Room joined confirmation
    socket.on('room-joined', async ({ roomId: joinedRoomId, participants, isInitiator }) => {
      console.log('✅ Joined room:', joinedRoomId, 'isInitiator:', isInitiator, 'participants:', participants);
      
      if (participants.length > 0) {
        // There's already someone in the room, create offer
        const firstParticipant = participants[0];
        setRemoteUser(firstParticipant);
        remoteSocketIdRef.current = firstParticipant.socketId;
        
        await createPeerConnection(firstParticipant.socketId);
        await createOffer(firstParticipant.socketId);
      }
    });

    // User joined the room
    socket.on('user-joined', async ({ userId, userName, userType, socketId }) => {
      console.log('👤 User joined:', userName, socketId);
      setRemoteUser({ userId, userName, userType, socketId });
      remoteSocketIdRef.current = socketId;
      
      // If we don't have a peer connection yet, create one and wait for offer
      if (!peerConnectionRef.current) {
        await createPeerConnection(socketId);
      }
    });

    // Receive offer
    socket.on('offer', async ({ from, fromUserId, fromUserName, offer }) => {
      console.log('📥 Received offer from:', fromUserName || fromUserId);
      
      try {
        // Check for collision
        const offerCollision = makingOffer.current || 
          (peerConnectionRef.current?.signalingState !== 'stable');
        
        const isPolite = !location.state?.isInitiator;
        
        if (offerCollision && !isPolite) {
          console.log('⚠️ Offer collision, ignoring (impolite peer)');
          return;
        }
        
        if (!peerConnectionRef.current) {
          await createPeerConnection(from);
        }
        
        remoteSocketIdRef.current = from;
        
        if (offerCollision && isPolite) {
          // Rollback our offer
          await peerConnectionRef.current.setLocalDescription({ type: 'rollback' });
        }
        
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Notify server that remote description is set
        socket.emit('remote-description-set');
        
        // Process queued ICE candidates
        await processIceCandidateQueue();
        
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socket.emit('answer', {
          to: from,
          answer,
          from: currentUser.userId
        });
        
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // Receive answer
    socket.on('answer', async ({ from, fromUserId, answer }) => {
      console.log('📥 Received answer from:', fromUserId);
      
      try {
        if (peerConnectionRef.current?.signalingState === 'have-local-offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          
          // Notify server that remote description is set
          socket.emit('remote-description-set');
          
          // Process queued ICE candidates
          await processIceCandidateQueue();
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    // Receive ICE candidate
    socket.on('ice-candidate', async ({ from, candidate }) => {
      if (!candidate) return;
      
      try {
        if (peerConnectionRef.current?.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Queue the candidate
          iceCandidateQueue.current.push(candidate);
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    // Chat messages
    socket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    // User left
    socket.on('user-left', ({ userName }) => {
      console.log('👋 User left:', userName);
      toast.info(`${userName} left the call`);
    });

    // Peer disconnected
    socket.on('peer-disconnected', ({ userName }) => {
      console.log('📵 Peer disconnected:', userName);
      setConnectionState(ConnectionState.DISCONNECTED);
      setShowReconnectButton(true);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      toast.warning(`${userName} disconnected. Waiting for reconnection...`);
    });

    // Call connected (both participants present)
    socket.on('call-connected', ({ participants }) => {
      console.log('🤝 Call connected with participants:', participants);
    });

    // Video/Audio toggles from remote user
    socket.on('user-toggle-video', ({ userId, userName, enabled }) => {
      console.log(`📹 ${userName} ${enabled ? 'enabled' : 'disabled'} video`);
      setRemoteVideoEnabled(enabled);
      if (!enabled) {
        toast.info(`${userName} turned off their camera`);
      }
    });

    socket.on('user-toggle-audio', ({ userId, userName, enabled }) => {
      console.log(`🎤 ${userName} ${enabled ? 'enabled' : 'disabled'} audio`);
      setRemoteAudioEnabled(enabled);
      if (!enabled) {
        toast.info(`${userName} muted their microphone`);
      }
    });

    // Screen sharing events
    socket.on('user-started-screen-share', ({ userName }) => {
      toast.info(`${userName} is sharing their screen`);
    });

    socket.on('user-stopped-screen-share', ({ userName }) => {
      toast.info(`${userName} stopped sharing their screen`);
    });

    // Renegotiation request
    socket.on('renegotiate-request', async ({ from }) => {
      console.log('🔄 Renegotiation request received');
      if (peerConnectionRef.current && remoteSocketIdRef.current) {
        await createOffer(remoteSocketIdRef.current);
      }
    });

    // Session replaced (connected from another device/tab)
    socket.on('session-replaced', ({ message }) => {
      toast.error(message);
      cleanup();
      navigate(-1);
    });

    // Socket connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      if (connectionState === ConnectionState.RECONNECTING) {
        socket.emit('reconnect-attempt', {
          roomId,
          userId: currentUser.userId,
          userName: currentUser.userName,
          userType: currentUser.userType
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        socket.connect();
      }
      setConnectionState(ConnectionState.RECONNECTING);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionState(ConnectionState.FAILED);
      setShowReconnectButton(true);
    });

    // Can rejoin after reconnection
    socket.on('can-rejoin', ({ roomId: rejoinRoomId }) => {
      socket.emit('join-room', {
        roomId: rejoinRoomId,
        userId: currentUser.userId,
        userName: currentUser.userName,
        userType: currentUser.userType
      });
    });

    // Room ended
    socket.on('room-ended', () => {
      toast.info('The call has ended');
      cleanup();
      navigate(-1);
    });
  };

  const processIceCandidateQueue = async () => {
    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error processing queued ICE candidate:', error);
      }
    }
  };

  const createPeerConnection = async (remoteSocketId) => {
    if (peerConnectionRef.current) {
      console.log('⚠️ Peer connection already exists');
      return;
    }

    console.log('🔗 Creating peer connection to:', remoteSocketId);
    
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;
    
    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log('📺 Received remote track:', event.track.kind);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          to: remoteSocketId,
          candidate: event.candidate,
          from: currentUser.userId
        });
      }
    };

    // Handle ICE gathering state
    peerConnection.onicegatheringstatechange = () => {
      console.log('🧊 ICE gathering state:', peerConnection.iceGatheringState);
    };

    // Handle ICE connection state
    peerConnection.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', peerConnection.iceConnectionState);
      
      switch (peerConnection.iceConnectionState) {
        case 'checking':
          setConnectionState(ConnectionState.CONNECTING);
          break;
        case 'connected':
        case 'completed':
          setConnectionState(ConnectionState.CONNECTED);
          setShowReconnectButton(false);
          break;
        case 'disconnected':
          setConnectionState(ConnectionState.DISCONNECTED);
          // Try to recover connection
          setTimeout(() => {
            if (peerConnection.iceConnectionState === 'disconnected') {
              setShowReconnectButton(true);
            }
          }, 5000);
          break;
        case 'failed':
          setConnectionState(ConnectionState.FAILED);
          setShowReconnectButton(true);
          break;
        case 'closed':
          setConnectionState(ConnectionState.ENDED);
          break;
      }
      
      // Notify server of connection state change
      if (socketRef.current) {
        socketRef.current.emit('connection-state-change', {
          state: peerConnection.iceConnectionState
        });
      }
    };

    // Handle connection state (more reliable than ICE state)
    peerConnection.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'failed') {
        setConnectionState(ConnectionState.FAILED);
        setShowReconnectButton(true);
      }
    };

    // Handle negotiation needed (for track changes)
    peerConnection.onnegotiationneeded = async () => {
      console.log('🔄 Negotiation needed');
      
      if (isNegotiating.current) {
        console.log('⏳ Already negotiating, skipping');
        return;
      }
      
      try {
        isNegotiating.current = true;
        makingOffer.current = true;
        
        await peerConnection.setLocalDescription();
        
        socketRef.current?.emit('offer', {
          to: remoteSocketIdRef.current,
          offer: peerConnection.localDescription,
          from: currentUser.userId
        });
      } catch (error) {
        console.error('Error in negotiation:', error);
      } finally {
        makingOffer.current = false;
      }
    };

    // Reset negotiating flag on signaling state change
    peerConnection.onsignalingstatechange = () => {
      console.log('📡 Signaling state:', peerConnection.signalingState);
      if (peerConnection.signalingState === 'stable') {
        isNegotiating.current = false;
      }
    };

    // Monitor connection quality
    startQualityMonitoring(peerConnection);
  };

  const createOffer = async (remoteSocketId) => {
    if (!peerConnectionRef.current || makingOffer.current) return;
    
    try {
      makingOffer.current = true;
      
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      if (peerConnectionRef.current.signalingState !== 'stable') {
        console.log('⚠️ Signaling state changed during offer creation');
        return;
      }
      
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketRef.current?.emit('offer', {
        to: remoteSocketId,
        offer,
        from: currentUser.userId
      });
      
    } catch (error) {
      console.error('Error creating offer:', error);
    } finally {
      makingOffer.current = false;
    }
  };

  const startQualityMonitoring = (peerConnection) => {
    const interval = setInterval(async () => {
      if (!peerConnection || peerConnection.connectionState === 'closed') {
        clearInterval(interval);
        return;
      }
      
      try {
        const stats = await peerConnection.getStats();
        let packetsLost = 0;
        let packetsReceived = 0;
        
        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            packetsLost += report.packetsLost || 0;
            packetsReceived += report.packetsReceived || 0;
          }
        });
        
        if (packetsReceived > 0) {
          const lossRate = packetsLost / (packetsLost + packetsReceived);
          
          if (lossRate < 0.01) {
            setNetworkQuality('excellent');
          } else if (lossRate < 0.05) {
            setNetworkQuality('good');
          } else if (lossRate < 0.1) {
            setNetworkQuality('fair');
          } else {
            setNetworkQuality('poor');
          }
        }
      } catch (error) {
        // Stats not available
      }
    }, 5000);
    
    return () => clearInterval(interval);
  };

  const handleReconnect = async () => {
    console.log('🔄 Attempting reconnection...');
    setConnectionState(ConnectionState.RECONNECTING);
    setShowReconnectButton(false);
    
    // Close existing connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    iceCandidateQueue.current = [];
    isNegotiating.current = false;
    makingOffer.current = false;
    
    // If socket is disconnected, reconnect
    if (!socketRef.current?.connected) {
      socketRef.current?.connect();
    }
    
    // Rejoin room
    setTimeout(() => {
      socketRef.current?.emit('join-room', {
        roomId,
        userId: currentUser.userId,
        userName: currentUser.userName,
        userType: currentUser.userType
      });
    }, 500);
  };

  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;
    
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
      
      socketRef.current?.emit('toggle-video', {
        roomId,
        enabled: videoTrack.enabled
      });
    }
  }, [roomId]);

  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return;
    
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      
      socketRef.current?.emit('toggle-audio', {
        roomId,
        enabled: audioTrack.enabled
      });
    }
  }, [roomId]);

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: false
        });
        
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace video track in peer connection
        const sender = peerConnectionRef.current?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }
        
        // Update local video preview
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        socketRef.current?.emit('start-screen-share', { roomId });
        
        // Handle screen share stop (user clicks browser's stop button)
        screenTrack.onended = () => {
          stopScreenShare();
        };
        
      } else {
        stopScreenShare();
      }
    } catch (error) {
      if (error.name !== 'AbortError') { // User cancelled
        console.error('Error sharing screen:', error);
        toast.error('Failed to share screen');
      }
    }
  };

  const stopScreenShare = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    // Switch back to camera
    if (localStreamRef.current && peerConnectionRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
      
      // Update local video preview
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    
    setIsScreenSharing(false);
    socketRef.current?.emit('stop-screen-share', { roomId });
  };

  const toggleRecording = async () => {
    // Note: Actual recording requires MediaRecorder API and server storage
    // This is a placeholder for UI state
    if (!isRecording) {
      setIsRecording(true);
      socketRef.current?.emit('start-recording', { roomId });
      toast.info('Recording started');
    } else {
      setIsRecording(false);
      socketRef.current?.emit('stop-recording', { roomId });
      toast.info('Recording stopped');
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    socketRef.current?.emit('send-message', {
      roomId,
      message: messageInput.trim()
    });
    
    setMessageInput('');
  };

  const endCall = async () => {
    try {
      await axios.put(`${SOCKET_URL}/api/video-calls/${roomId}/end`, {
        userId: currentUser.userId
      });
    } catch (error) {
      console.warn('Failed to update backend end status:', error);
    }
    
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up call resources');
    
    // Clear any pending timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Stop all local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    
    // Stop screen sharing tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      screenStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    // Clear refs
    iceCandidateQueue.current = [];
    isNegotiating.current = false;
    makingOffer.current = false;
    remoteSocketIdRef.current = null;
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case ConnectionState.INITIALIZING:
        return 'Initializing...';
      case ConnectionState.REQUESTING_MEDIA:
        return 'Requesting camera access...';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.CONNECTED:
        return 'Connected';
      case ConnectionState.RECONNECTING:
        return 'Reconnecting...';
      case ConnectionState.DISCONNECTED:
        return 'Disconnected';
      case ConnectionState.FAILED:
        return 'Connection Failed';
      case ConnectionState.ENDED:
        return 'Call Ended';
      default:
        return '';
    }
  };

  const getNetworkQualityIcon = () => {
    if (connectionState !== ConnectionState.CONNECTED) {
      return <SignalCellularConnectedNoInternet0Bar />;
    }
    return <SignalCellularAlt className={`network-${networkQuality}`} />;
  };

  // Render permission error screen
  if (permissionError) {
    return (
      <div className="video-call-room error-screen">
        <div className="error-content">
          <VideocamOff className="error-icon" />
          <h2>Camera/Microphone Access Required</h2>
          <p>{permissionError}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()}>
              <Refresh /> Try Again
            </button>
            <button onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-call-room">
      {/* Header */}
      <div className="call-header">
        <div className="call-info">
          <h3>{remoteUser?.userName || 'Waiting for participant...'}</h3>
          <div className="call-meta">
            <span className="call-duration">{formatDuration(callDuration)}</span>
            <span className={`connection-status ${connectionState}`}>
              ● {getConnectionStatusText()}
            </span>
            <span className="network-quality" title={`Network: ${networkQuality}`}>
              {getNetworkQualityIcon()}
            </span>
          </div>
        </div>
        
        {isRecording && (
          <div className="recording-indicator">
            <FiberManualRecord className="pulse" />
            <span>Recording</span>
          </div>
        )}
      </div>

      {/* Video Container */}
      <div className="video-container">
        {/* Remote Video */}
        <div className={`remote-video-wrapper ${!remoteVideoEnabled ? 'video-off' : ''}`}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          
          {!remoteUser && (
            <div className="waiting-message">
              <div className="waiting-spinner"></div>
              <h3>Waiting for {currentUser.userType === 'student' ? 'mentor' : 'student'} to join...</h3>
              <p>Share the room link to invite them</p>
            </div>
          )}
          
          {remoteUser && !remoteVideoEnabled && (
            <div className="video-off-placeholder">
              <div className="avatar">{remoteUser.userName?.[0]?.toUpperCase() || '?'}</div>
              <span>{remoteUser.userName}</span>
              <span className="camera-off-text">Camera Off</span>
            </div>
          )}
          
          {!remoteAudioEnabled && remoteUser && (
            <div className="muted-indicator">
              <MicOff /> Muted
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className={`local-video-wrapper ${!isVideoEnabled ? 'video-off' : ''}`}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
          {!isVideoEnabled && (
            <div className="video-off-placeholder small">
              <div className="avatar">{currentUser.userName?.[0]?.toUpperCase() || 'Y'}</div>
            </div>
          )}
          <span className="video-label">You</span>
        </div>
      </div>

      {/* Reconnect Button */}
      {showReconnectButton && (
        <div className="reconnect-overlay">
          <button className="reconnect-btn" onClick={handleReconnect}>
            <Refresh />
            Reconnect
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="call-controls">
        <button 
          className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
          onClick={toggleAudio}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
          <span className="control-label">{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
        </button>

        <button 
          className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
          onClick={toggleVideo}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          <span className="control-label">{isVideoEnabled ? 'Stop Video' : 'Start Video'}</span>
        </button>

        <button 
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
          <span className="control-label">{isScreenSharing ? 'Stop Share' : 'Share'}</span>
        </button>

        <button 
          className={`control-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopIcon /> : <FiberManualRecord />}
          <span className="control-label">{isRecording ? 'Stop Rec' : 'Record'}</span>
        </button>

        <button 
          className={`control-btn ${isChatOpen ? 'active' : ''}`}
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Chat"
        >
          <Chat />
          {chatMessages.length > 0 && !isChatOpen && (
            <span className="badge">{chatMessages.length}</span>
          )}
          <span className="control-label">Chat</span>
        </button>

        <button 
          className="control-btn end-call"
          onClick={endCall}
          title="End call"
        >
          <CallEnd />
          <span className="control-label">End</span>
        </button>
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h4>Chat</h4>
            <button onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="no-messages">No messages yet</div>
            ) : (
              chatMessages.map((msg, index) => (
                <div 
                  key={msg.id || index}
                  className={`chat-message ${msg.senderId === currentUser.userId ? 'own' : ''}`}
                >
                  <div className="message-sender">{msg.senderName}</div>
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!messageInput.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallRoom;
