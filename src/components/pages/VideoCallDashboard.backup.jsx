import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import {
  VideoCall as VideoCallIcon,
  History,
  Schedule,
  Close,
  CheckCircle,
  Cancel,
  Phone,
  AccessTime
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import './VideoCallDashboard.css';

const SOCKET_URL = 'http://localhost:5002';

const VideoCallDashboard = () => {
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const [currentUser] = useState(() => {
    const userType = localStorage.getItem('userType');
    console.log('🔍 UserType from localStorage:', userType);
    
    if (userType === 'student') {
      const userString = localStorage.getItem('user');
      console.log('📦 Raw user data:', userString);
      const user = JSON.parse(userString || '{}');
      console.log('👤 Parsed user:', user);
      const currentUserData = {
        userId: user.usn || user._id,
        userName: user.fullName || user.name || 'Student',
        userType: 'student'
      };
      console.log('✅ Final currentUser:', currentUserData);
      return currentUserData;
    } else if (userType === 'mentor') {
      const mentor = JSON.parse(localStorage.getItem('mentorData') || '{}');
      return {
        userId: mentor.mentorID || mentor._id,
        userName: mentor.fullName || mentor.name || 'Mentor',
        userType: 'mentor'
      };
    }
    console.log('⚠️ No valid userType, using default');
    return { userId: '', userName: '', userType: 'student' };
  });

  const [activeTab, setActiveTab] = useState('start');
  const [callHistory, setCallHistory] = useState([]);
  const [upcomingCalls, setUpcomingCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  
  // For initiating calls
  const [selectedUser, setSelectedUser] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    fetchCallHistory();
    fetchUpcomingCalls();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    const newSocket = io(SOCKET_URL);
    
    newSocket.emit('register', currentUser.userId);
    
    newSocket.on('incoming-call', (data) => {
      console.log('Incoming call:', data);
      setIncomingCall(data);
      
      // Play ringtone (optional)
      const audio = new Audio('/ringtone.mp3');
      audio.loop = true;
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Store audio reference to stop later
      newSocket.audioRef = audio;
    });

    newSocket.on('call-accepted', ({ roomId }) => {
      toast.success('Call accepted!');
      navigate(`/video-call/${roomId}`);
    });

    newSocket.on('call-rejected', ({ reason }) => {
      toast.error(`Call rejected: ${reason}`);
    });

    setSocket(newSocket);
  };

  const fetchCallHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/video-calls/history/${currentUser.userId}`, {
        params: { userType: currentUser.userType, limit: 20 }
      });
      if (response.data.success) {
        setCallHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  };

  const fetchUpcomingCalls = async () => {
    console.log('📅 Fetching upcoming calls for user:', currentUser.userId);
    try {
      const response = await axios.get(`http://localhost:5002/api/video-calls/upcoming/${currentUser.userId}`);
      console.log('📋 Upcoming calls response:', response.data);
      if (response.data.success) {
        setUpcomingCalls(response.data.data);
        console.log('✅ Set upcoming calls:', response.data.data);
      } else {
        console.warn('⚠️ No upcoming calls or unsuccessful response');
      }
    } catch (error) {
      console.error('❌ Error fetching upcoming calls:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Fetch mentors if student, students if mentor
      const endpoint = currentUser.userType === 'student' 
        ? 'http://localhost:5002/api/mentor/details' 
        : `http://localhost:5002/api/mentor/${currentUser.userId}/mentees`;
      
      const response = await axios.get(endpoint);
      
      // Format the response data
      if (currentUser.userType === 'student') {
        // For students fetching mentors - response is array of mentor objects
        const formattedMentors = (response.data || []).map(mentor => ({
          id: mentor.mentorID || mentor._id,
          mentorID: mentor.mentorID,
          fullName: mentor.fullName || mentor.name,
          name: mentor.fullName || mentor.name
        }));
        setAvailableUsers(formattedMentors);
      } else {
        // For mentors fetching students - response.data.mentees
        setAvailableUsers(response.data.mentees || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load available users');
    }
  };

  useEffect(() => {
    if (activeTab === 'start') {
      fetchAvailableUsers();
    } else if (activeTab === 'scheduled') {
      fetchUpcomingCalls();
    } else if (activeTab === 'history') {
      fetchCallHistory();
    }
  }, [activeTab, currentUser.userType]);

  const startInstantCall = async (receiverId, receiverName) => {
    console.log('🎥 startInstantCall called', { receiverId, receiverName });
    console.log('👤 currentUser:', currentUser);
    
    if (!receiverId || !receiverName) {
      toast.error('Please select a user to call');
      return;
    }

    setLoading(true);
    
    const callData = {
      initiatorId: currentUser.userId,
      initiatorType: currentUser.userType,
      initiatorName: currentUser.userName,
      receiverId,
      receiverType: currentUser.userType === 'student' ? 'mentor' : 'student',
      receiverName
    };
    
    console.log('📤 Sending call data:', callData);
    
    try {
      const response = await axios.post('http://localhost:5002/api/video-calls/initiate', callData);

      console.log('✅ Response received:', response.data);
      
      if (response.data.success) {
        const { roomId } = response.data.data;
        
        console.log('🚪 Room ID:', roomId);
        
        // Notify the other user via socket
        if (socket) {
          socket.emit('call-user', {
            callerId: currentUser.userId,
            callerName: currentUser.userName,
            receiverId,
            receiverName,
            roomId
          });
          console.log('📡 Socket notification sent');
        } else {
          console.warn('⚠️ Socket not connected');
        }

        toast.success('Calling...');
        
        // Navigate to call room after a brief delay
        setTimeout(() => {
          console.log('🎯 Navigating to:', `/video-call/${roomId}`);
          navigate(`/video-call/${roomId}`);
        }, 1000);
      } else {
        console.error('❌ Call initiation failed:', response.data);
        toast.error(response.data.message || 'Failed to start call');
      }
    } catch (error) {
      console.error('❌ Error starting call:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to start call');
    } finally {
      setLoading(false);
    }
  };

  const scheduleCall = async () => {
    console.log('📅 scheduleCall called', { selectedUser, scheduleDate, scheduleTime });
    
    if (!selectedUser || !scheduleDate || !scheduleTime) {
      toast.error('Please fill all fields');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    console.log('⏰ Scheduled DateTime:', scheduledDateTime);
    
    if (scheduledDateTime <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setLoading(true);
    try {
      const user = availableUsers.find(u => 
        (u.mentorID || u.usn || u._id) === selectedUser
      );
      
      console.log('👤 Found user for scheduling:', user);

      const scheduleData = {
        initiatorId: currentUser.userId,
        initiatorType: currentUser.userType,
        initiatorName: currentUser.userName,
        receiverId: selectedUser,
        receiverType: currentUser.userType === 'student' ? 'mentor' : 'student',
        receiverName: user?.fullName || user?.name || 'User',
        scheduledTime: scheduledDateTime.toISOString()
      };
      
      console.log('📤 Sending schedule data:', scheduleData);

      const response = await axios.post('http://localhost:5002/api/video-calls/initiate', scheduleData);
      
      console.log('✅ Schedule response:', response.data);

      if (response.data.success) {
        toast.success('Call scheduled successfully!');
        setScheduleDate('');
        setScheduleTime('');
        setSelectedUser('');
        fetchUpcomingCalls();
        setActiveTab('scheduled');
      } else {
        console.error('❌ Schedule failed:', response.data);
        toast.error(response.data.message || 'Failed to schedule call');
      }
    } catch (error) {
      console.error('❌ Error scheduling call:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to schedule call');
    } finally {
      setLoading(false);
    }
  };

  const acceptCall = () => {
    if (incomingCall && socket) {
      // Stop ringtone
      if (socket.audioRef) {
        socket.audioRef.pause();
        socket.audioRef = null;
      }

      socket.emit('accept-call', {
        roomId: incomingCall.roomId,
        callerId: incomingCall.callerId
      });

      navigate(`/video-call/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall && socket) {
      // Stop ringtone
      if (socket.audioRef) {
        socket.audioRef.pause();
        socket.audioRef = null;
      }

      socket.emit('reject-call', {
        roomId: incomingCall.roomId,
        callerId: incomingCall.callerId,
        reason: 'Busy'
      });

      setIncomingCall(null);
      toast.info('Call rejected');
    }
  };

  const joinScheduledCall = (roomId) => {
    navigate(`/video-call/${roomId}`);
  };

  const cancelScheduledCall = async (roomId) => {
    try {
      await axios.put(`http://localhost:5002/api/video-calls/${roomId}/cancel`, {
        cancelledBy: currentUser.userId,
        cancelReason: 'Cancelled by user'
      });
      
      toast.success('Call cancelled');
      fetchUpcomingCalls();
    } catch (error) {
      console.error('Error cancelling call:', error);
      toast.error('Failed to cancel call');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="video-call-dashboard">
      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="incoming-call-modal">
          <div className="modal-overlay" onClick={rejectCall}></div>
          <div className="modal-content">
            <div className="call-avatar">
              <Phone className="ringing-icon" />
            </div>
            <h2>{incomingCall.callerName}</h2>
            <p>Incoming video call...</p>
            
            <div className="call-actions">
              <button className="accept-btn" onClick={acceptCall}>
                <CheckCircle />
                <span>Accept</span>
              </button>
              <button className="reject-btn" onClick={rejectCall}>
                <Cancel />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1><VideoCallIcon /> Video Calls</h1>
        <p>Connect with your {currentUser.userType === 'student' ? 'mentors' : 'mentees'} via video</p>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'start' ? 'active' : ''}
          onClick={() => setActiveTab('start')}
        >
          <VideoCallIcon /> Start Call
        </button>
        <button 
          className={activeTab === 'scheduled' ? 'active' : ''}
          onClick={() => setActiveTab('scheduled')}
        >
          <Schedule /> Scheduled ({upcomingCalls.length})
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          <History /> History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Start Call Tab */}
        {activeTab === 'start' && (
          <div className="start-call-section">
            <div className="call-options">
              {/* Instant Call */}
              <div className="call-option-card">
                <h3>Instant Call</h3>
                <p>Start a call right now</p>
                
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="user-select"
                >
                  <option value="">Select {currentUser.userType === 'student' ? 'mentor' : 'student'}</option>
                  {availableUsers.map((user) => {
                    const id = user.mentorID || user.usn || user._id;
                    const name = user.fullName || user.name;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                <button
                  className="instant-call-btn"
                  onClick={() => {
                    console.log('🔘 Button clicked! selectedUser:', selectedUser);
                    console.log('👥 availableUsers:', availableUsers);
                    const user = availableUsers.find(u => 
                      (u.mentorID || u.usn || u._id) === selectedUser
                    );
                    console.log('👤 Found user:', user);
                    startInstantCall(selectedUser, user?.fullName || user?.name);
                  }}
                  disabled={!selectedUser || loading}
                >
                  <VideoCallIcon />
                  {loading ? 'Calling...' : 'Start Call Now'}
                </button>
              </div>

              {/* Schedule Call */}
              <div className="call-option-card">
                <h3>Schedule Call</h3>
                <p>Plan a call for later</p>
                
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="user-select"
                >
                  <option value="">Select {currentUser.userType === 'student' ? 'mentor' : 'student'}</option>
                  {availableUsers.map((user) => {
                    const id = user.mentorID || user.usn || user._id;
                    const name = user.fullName || user.name;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input"
                />

                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="time-input"
                />

                <button
                  className="schedule-call-btn"
                  onClick={() => {
                    console.log('🔘 Schedule button clicked!');
                    scheduleCall();
                  }}
                  disabled={!selectedUser || !scheduleDate || !scheduleTime || loading}
                >
                  <Schedule />
                  {loading ? 'Scheduling...' : 'Schedule Call'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Calls Tab */}
        {activeTab === 'scheduled' && (
          <div className="scheduled-calls-section">
            {upcomingCalls.length === 0 ? (
              <div className="empty-state">
                <Schedule />
                <p>No upcoming calls scheduled</p>
              </div>
            ) : (
              <div className="calls-grid">
                {upcomingCalls.map((call) => (
                  <div key={call._id} className="call-card scheduled">
                    <div className="call-header">
                      <h4>
                        {call.initiator.userId === currentUser.userId 
                          ? call.receiver.name 
                          : call.initiator.name}
                      </h4>
                      <span className="status-badge">{call.status}</span>
                    </div>
                    
                    <div className="call-details">
                      <p><AccessTime /> {formatDate(call.scheduledTime)}</p>
                    </div>

                    <div className="call-actions-row">
                      <button
                        className="join-btn"
                        onClick={() => joinScheduledCall(call.roomId)}
                      >
                        Join Call
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => cancelScheduledCall(call.roomId)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            {callHistory.length === 0 ? (
              <div className="empty-state">
                <History />
                <p>No call history yet</p>
              </div>
            ) : (
              <div className="history-list">
                {callHistory.map((call) => (
                  <div key={call._id} className="history-card">
                    <div className="call-info">
                      <h4>
                        {call.initiator.userId === currentUser.userId 
                          ? call.receiver.name 
                          : call.initiator.name}
                      </h4>
                      <span className={`status ${call.status}`}>{call.status}</span>
                    </div>
                    
                    <div className="call-metadata">
                      <p>📅 {formatDate(call.startTime || call.createdAt)}</p>
                      {call.duration && (
                        <p>⏱️ Duration: {formatDuration(call.duration)}</p>
                      )}
                    </div>

                    {call.meetingNotes?.summary && (
                      <div className="meeting-notes">
                        <strong>Notes:</strong>
                        <p>{call.meetingNotes.summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallDashboard;
