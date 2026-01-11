import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  MoreVert
} from '@mui/icons-material';
import './VideoCallRoom.css';

const SOCKET_URL = 'http://localhost:5002';
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const VideoCallRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // User info from localStorage
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('userType') === 'student' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : JSON.parse(localStorage.getItem('mentorData') || '{}');
    return {
      userId: user.usn || user.mentorID || user._id,
      userName: user.fullName || user.name || 'User',
      userType: localStorage.getItem('userType') || 'student'
    };
  });

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

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
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Initialize
  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize socket connection
      socketRef.current = io(SOCKET_URL);

      // Register user
      socketRef.current.emit('register', currentUser.userId);

      // Join room
      socketRef.current.emit('join-room', {
        roomId,
        userId: currentUser.userId,
        userName: currentUser.userName,
        userType: currentUser.userType
      });

      // Update backend
      await axios.put(`/api/video-calls/${roomId}/join`, {
        userId: currentUser.userId,
        userType: currentUser.userType
      });

      setupSocketListeners();
      
    } catch (error) {
      console.error('Error initializing call:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const setupSocketListeners = () => {
    const socket = socketRef.current;

    // Existing participants
    socket.on('existing-participants', async (participants) => {
      console.log('Existing participants:', participants);
      if (participants.length > 0) {
        setRemoteUser(participants[0]);
        await createPeerConnection(participants[0].socketId);
        await createOffer(participants[0].socketId);
      }
    });

    // User joined
    socket.on('user-joined', async ({ userId, userName, userType, socketId }) => {
      console.log('User joined:', userName);
      setRemoteUser({ userId, userName, userType, socketId });
      await createPeerConnection(socketId);
    });

    // Receive offer
    socket.on('offer', async ({ from, fromUserId, offer }) => {
      console.log('Received offer from:', fromUserId);
      await createPeerConnection(from);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', {
        to: from,
        answer,
        from: currentUser.userId
      });
    });

    // Receive answer
    socket.on('answer', async ({ from, fromUserId, answer }) => {
      console.log('Received answer from:', fromUserId);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setConnectionStatus('connected');
    });

    // Receive ICE candidate
    socket.on('ice-candidate', async ({ from, candidate }) => {
      if (candidate && peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Chat messages
    socket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    // User left
    socket.on('user-left', ({ userName }) => {
      console.log('User left:', userName);
      setConnectionStatus('disconnected');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setRemoteUser(null);
    });

    // Video/Audio toggles
    socket.on('user-toggle-video', ({ userId, enabled }) => {
      console.log(`User ${userId} ${enabled ? 'enabled' : 'disabled'} video`);
    });

    socket.on('user-toggle-audio', ({ userId, enabled }) => {
      console.log(`User ${userId} ${enabled ? 'enabled' : 'disabled'} audio`);
    });
  };

  const createPeerConnection = async (socketId) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log('Received remote track');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus('connected');
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          to: socketId,
          candidate: event.candidate
        });
      }
    };

    // Connection state
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        setConnectionStatus('disconnected');
      }
    };
  };

  const createOffer = async (socketId) => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socketRef.current.emit('offer', {
      to: socketId,
      offer,
      from: currentUser.userId
    });
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
      
      socketRef.current.emit('toggle-video', {
        roomId,
        enabled: videoTrack.enabled
      });

      axios.put(`/api/video-calls/${roomId}/toggle-feature`, {
        feature: 'videoEnabled',
        enabled: videoTrack.enabled
      });
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      
      socketRef.current.emit('toggle-audio', {
        roomId,
        enabled: audioTrack.enabled
      });

      axios.put(`/api/video-calls/${roomId}/toggle-feature`, {
        feature: 'audioEnabled',
        enabled: audioTrack.enabled
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace video track in peer connection
        const sender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
        
        setIsScreenSharing(true);
        socketRef.current.emit('start-screen-share', { roomId });
        
        // Handle screen share stop
        screenTrack.onended = () => {
          stopScreenShare();
        };
        
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Switch back to camera
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    const sender = peerConnectionRef.current.getSenders().find(s => 
      s.track && s.track.kind === 'video'
    );
    
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }
    
    setIsScreenSharing(false);
    socketRef.current.emit('stop-screen-share', { roomId });
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      socketRef.current.emit('start-recording', { roomId });
      
      await axios.put(`/api/video-calls/${roomId}/toggle-feature`, {
        feature: 'recordingEnabled',
        enabled: true
      });
    } else {
      setIsRecording(false);
      socketRef.current.emit('stop-recording', { roomId });
      
      await axios.put(`/api/video-calls/${roomId}/toggle-feature`, {
        feature: 'recordingEnabled',
        enabled: false
      });
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim()) {
      socketRef.current.emit('send-message', {
        roomId,
        message: messageInput
      });
      
      await axios.post(`/api/video-calls/${roomId}/chat`, {
        senderId: currentUser.userId,
        senderName: currentUser.userName,
        message: messageInput
      });
      
      setMessageInput('');
    }
  };

  const endCall = async () => {
    try {
      await axios.put(`/api/video-calls/${roomId}/end`, {
        userId: currentUser.userId
      });
      
      cleanup();
      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const cleanup = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-call-room">
      {/* Header */}
      <div className="call-header">
        <div className="call-info">
          <h3>{remoteUser?.userName || 'Waiting for participant...'}</h3>
          <span className="call-duration">{formatDuration(callDuration)}</span>
          <span className={`connection-status ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '● Connected' : '● Connecting...'}
          </span>
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
        <div className="remote-video-wrapper">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          {!remoteUser && (
            <div className="waiting-message">
              <h3>Waiting for {currentUser.userType === 'student' ? 'mentor' : 'student'} to join...</h3>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="local-video-wrapper">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
          <span className="video-label">You</span>
        </div>
      </div>

      {/* Controls */}
      <div className="call-controls">
        <button 
          className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
          onClick={toggleAudio}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </button>

        <button 
          className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
          onClick={toggleVideo}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </button>

        <button 
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </button>

        <button 
          className={`control-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopIcon /> : <FiberManualRecord />}
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
        </button>

        <button 
          className="control-btn end-call"
          onClick={endCall}
          title="End call"
        >
          <CallEnd />
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
            {chatMessages.map((msg, index) => (
              <div 
                key={index}
                className={`chat-message ${msg.senderId === currentUser.userId ? 'own' : ''}`}
              >
                <div className="message-sender">{msg.senderName}</div>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallRoom;
