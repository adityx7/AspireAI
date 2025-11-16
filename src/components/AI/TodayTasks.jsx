import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodayTasks.css';

const TodayTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ completedTasks: 0, totalTasks: 0, progressPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchTodayTasks();
  }, [userId]);

  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/agents/${userId}/today`);
      
      if (response.data.success) {
        setTasks(response.data.tasks || []);
        setProgress(response.data.progress || { completedTasks: 0, totalTasks: 0, progressPercent: 0 });
        setError(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching today tasks:', err);
      setError(null); // Don't show error if no plan exists yet
      setTasks([]);
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.put(`/api/agents/${userId}/task/${taskId}/complete`);
      
      if (response.data.success) {
        // Update local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, completed: true, completedAt: new Date() } : task
          )
        );
        
        // Fix: progress is directly in response.data, not nested in response.data.data
        setProgress(response.data.progress || { completedTasks: 0, totalTasks: 0, progressPercent: 0 });
        
        // Show success message
        showNotification('✅ Task completed! Great job!');
      }
    } catch (err) {
      console.error('Error completing task:', err);
      showNotification('❌ Failed to mark task as complete');
    }
  };

  const showNotification = (message) => {
    // Simple notification - can be replaced with better toast library
    const notification = document.createElement('div');
    notification.className = 'task-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="today-tasks-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-tasks-container">
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="today-tasks-container">
        <div className="no-tasks-message">
          <span>🎉</span>
          <h3>No tasks for today!</h3>
          <p>Either you've completed everything or you need to generate a new study plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-tasks-container">
      <div className="today-tasks-header">
        <div className="header-title">
          <h2>📚 Today's Study Tasks</h2>
          <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        {streak > 0 && (
          <div className="streak-badge">
            <span className="fire-icon">🔥</span>
            <span className="streak-count">{streak}</span>
            <span className="streak-label">day streak</span>
          </div>
        )}
      </div>

      <div className="progress-bar-container">
        <div className="progress-info">
          <span className="progress-text">{progress.completedTasks} of {progress.totalTasks} tasks completed</span>
          <span className="progress-percent">{progress.progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress.progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div 
            key={task._id || index} 
            className={`task-card ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-checkbox-container">
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => !task.completed && handleCompleteTask(task._id)}
                className="task-checkbox"
                disabled={task.completed}
              />
            </div>
            
            <div className="task-content">
              <div className="task-time">
                <span className="time-icon">⏰</span>
                <span>{task.time}</span>
                <span className="task-duration">({task.durationMinutes} min)</span>
              </div>
              
              <h4 className="task-title">{task.task}</h4>
              
              {task.resourceUrl && (
                <a 
                  href={task.resourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="task-resource"
                >
                  📎 Resource
                </a>
              )}
              
              {task.completed && task.completedAt && (
                <p className="completed-time">
                  ✓ Completed {new Date(task.completedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTasks;
