import React, { useState, useEffect } from 'react';
import { Box, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodayTasks from '../../components/AI/TodayTasks';
import StudyPlanCard from '../../components/AI/StudyPlanCard';
import SideBar from '../organisms/SideBar';
import NavDash from '../organisms/NavDash';
import './StudyPlanPage.css';

const StudyPlanPage = ({ userId: propUserId }) => {
  // Get userId from props or localStorage
  const userId = propUserId || localStorage.getItem('userId') || localStorage.getItem('studentId');
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      console.log('📍 Fetching study plan for userId:', userId);
      fetchActivePlan();
      fetchSuggestions();
    } else {
      console.error('❌ No userId found in localStorage');
      setError('Please login to view your study plan');
      setLoading(false);
    }
  }, [userId]);

  const fetchActivePlan = async () => {
    try {
      console.log('🔄 Fetching active plan from:', `/api/agents/${userId}/active-plan`);
      const response = await axios.get(`/api/agents/${userId}/active-plan`);
      console.log('✅ Active plan response:', response.data);
      
      if (response.data.success) {
        setActivePlan(response.data.activePlan);
        setStats(response.data.stats);
        setError(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching active plan:', error);
      setError(error.response?.data?.error || 'Failed to load study plan');
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`/api/agents/${userId}/suggestions`, {
        params: { limit: 5 }
      });
      
      if (response.data.success) {
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleGenerateNewPlan = async () => {
    try {
      setGenerating(true);
      
      const response = await axios.post('/api/agents/run', {
        userId
      });

      if (response.data.success) {
        showNotification('✨ Study plan generated successfully!', 'success');
        
        // Refresh immediately since plan is saved synchronously
        fetchActivePlan();
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      
      if (error.response?.status === 429) {
        showNotification('⚠️ ' + error.response.data.message, 'warning');
      } else {
        showNotification('❌ Failed to generate plan. Please try again.', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleAcceptPlan = async (suggestionId) => {
    try {
      const response = await axios.put(`/api/agents/${userId}/accept/${suggestionId}`);
      
      if (response.data.success) {
        showNotification('✅ Study plan accepted! Let\'s get started!', 'success');
        fetchActivePlan();
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error accepting plan:', error);
      showNotification('❌ Failed to accept plan', 'error');
    }
  };

  const handleDeletePlan = async (suggestionId) => {
    if (!window.confirm('Are you sure you want to delete this study plan? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/agents/${userId}/plan/${suggestionId}`);
      
      if (response.data.success) {
        showNotification('🗑️ Study plan deleted successfully', 'success');
        setActivePlan(null);
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showNotification('❌ Failed to delete plan', 'error');
    }
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setShowFullPlan(true);
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (path) => {
    navigate(`/${path}`);
    if (mobileOpen) setMobileOpen(false);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)' }}>
        <NavDash onDrawerToggle={handleDrawerToggle} title="AI Study Plan" />
        <div className="study-plan-page">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading your study plan...</p>
          </div>
        </div>
      </Box>
    );
  }

  if (error && !userId) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)' }}>
        <NavDash onDrawerToggle={handleDrawerToggle} title="AI Study Plan" />
        <div className="study-plan-page">
          <div className="error-container">
            <h2>⚠️ Authentication Required</h2>
            <p>{error}</p>
            <button onClick={() => window.location.href = '/login'} className="btn-generate">
              Go to Login
            </button>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)' }}>
      {/* Navbar */}
      <NavDash onDrawerToggle={handleDrawerToggle} title="AI Study Plan" />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sliding Sidebar */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: "none", sm: "block" },
            '& .MuiDrawer-paper': {
              width: 280,
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
              backdropFilter: "blur(25px)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(184, 134, 11, 0.15)",
              borderLeft: "none",
            }
          }}
        >
          <SideBar onMenuClick={handleMenuClick} />
        </Drawer>

        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: "block", sm: "none" },
            '& .MuiDrawer-paper': {
              width: 280,
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(184, 134, 11, 0.15)",
            }
          }}
        >
          <SideBar onMenuClick={handleMenuClick} />
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", width: "100%" }}>
          <div className="study-plan-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📚 My Study Plan</h1>
          <p>AI-powered personalized learning path</p>
        </div>
        
        <button 
          className="btn-generate" 
          onClick={handleGenerateNewPlan}
          disabled={generating}
        >
          {generating ? (
            <>
              <div className="spinner-small"></div>
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate New Plan
            </>
          )}
        </button>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-content">
              <p className="stat-value">{stats.currentStreak}</p>
              <p className="stat-label">Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-content">
              <p className="stat-value">{stats.longestStreak}</p>
              <p className="stat-label">Best Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div className="stat-content">
              <p className="stat-value">{stats.averageCompletion}%</p>
              <p className="stat-label">Avg Completion</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div className="stat-content">
              <p className="stat-value">{stats.totalPlansCompleted}/{stats.totalPlansGenerated}</p>
              <p className="stat-label">Plans Completed</p>
            </div>
          </div>
        </div>
      )}

      {activePlan && activePlan.accepted && (
        <div className="section">
          <h2 className="section-title">Today's Tasks</h2>
          <TodayTasks userId={userId} />
        </div>
      )}

      <div className="section">
        <h2 className="section-title">
          {activePlan && activePlan.accepted ? 'Active Study Plan' : 'Suggested Study Plans'}
        </h2>
        
        <div className="plans-grid">
          {suggestions.map((suggestion) => (
            <StudyPlanCard
              key={suggestion._id}
              suggestion={suggestion}
              onAccept={!suggestion.accepted ? handleAcceptPlan : null}
              onViewDetails={handleViewDetails}
              onDelete={handleDeletePlan}
            />
          ))}

          {suggestions.length === 0 && (
            <div className="no-plans-message">
              <span className="emoji">🎯</span>
              <h3>No Study Plans Yet</h3>
              <p>Click "Generate New Plan" to get your personalized AI-powered study plan!</p>
            </div>
          )}
        </div>
      </div>

      {showFullPlan && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowFullPlan(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Complete Study Plan</h2>
              <button className="close-btn" onClick={() => setShowFullPlan(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="full-plan-container">
                {selectedPlan.plan && selectedPlan.plan.map((dayPlan) => (
                  <div key={dayPlan.day} className="day-plan">
                    <h3 className="day-header">
                      Day {dayPlan.day} - {new Date(dayPlan.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </h3>
                    
                    <div className="day-tasks">
                      {dayPlan.tasks.map((task, index) => (
                        <div key={index} className="plan-task">
                          <span className="task-time">{task.time}</span>
                          <div className="task-details">
                            <p className="task-name">{task.task}</p>
                            <p className="task-duration">Duration: {task.durationMinutes} minutes</p>
                            {task.resourceUrl && (
                              <a href={task.resourceUrl} target="_blank" rel="noopener noreferrer" className="task-link">
                                📎 Resource
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedPlan.resources && selectedPlan.resources.length > 0 && (
                <div className="resources-section">
                  <h3>📚 Recommended Resources</h3>
                  <div className="resources-list">
                    {selectedPlan.resources.map((resource, index) => (
                      <a 
                        key={index}
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        <span>🔗</span>
                        {resource.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default StudyPlanPage;
