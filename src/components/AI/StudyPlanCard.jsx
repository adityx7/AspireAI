import React from 'react';
import './StudyPlanCard.css';

const StudyPlanCard = ({ suggestion, onAccept, onViewDetails, onDelete }) => {
  if (!suggestion) return null;

  const { insights, planLength, plan, resources, riskProfile, createdAt, accepted, active } = suggestion;

  const totalTasks = plan?.reduce((sum, day) => sum + day.tasks.length, 0) || 0;
  const completedTasks = plan?.reduce((sum, day) => 
    sum + day.tasks.filter(t => t.completed).length, 0) || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getRiskBadgeClass = (risk) => {
    switch(risk) {
      case 'high': return 'risk-badge-high';
      case 'medium': return 'risk-badge-medium';
      default: return 'risk-badge-low';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '✅';
    }
  };

  return (
    <div className={`study-plan-card ${accepted ? 'accepted' : ''}`}>
      <div className="card-header">
        <div className="header-top">
          <h3 className="card-title">
            {accepted ? '📚 Active Study Plan' : '🎯 Generated Study Plan'}
          </h3>
          {riskProfile?.overallRisk && (
            <span className={`risk-badge ${getRiskBadgeClass(riskProfile.overallRisk)}`}>
              {getRiskIcon(riskProfile.overallRisk)} {riskProfile.overallRisk.toUpperCase()} RISK
            </span>
          )}
        </div>
        
        <p className="card-date">
          Generated {new Date(createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {accepted && (
        <div className="progress-section">
          <div className="progress-info">
            <span>Progress</span>
            <span className="progress-text">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="plan-summary">
          <div className="summary-item">
            <span className="summary-icon">📅</span>
            <div>
              <p className="summary-value">{planLength} Days</p>
              <p className="summary-label">Duration</p>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-icon">📝</span>
            <div>
              <p className="summary-value">{totalTasks}</p>
              <p className="summary-label">Total Tasks</p>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-icon">📚</span>
            <div>
              <p className="summary-value">{resources?.length || 0}</p>
              <p className="summary-label">Resources</p>
            </div>
          </div>

          <div className="summary-item">
            <span className="summary-icon">💡</span>
            <div>
              <p className="summary-value">{insights?.length || 0}</p>
              <p className="summary-label">Insights</p>
            </div>
          </div>
        </div>

        {insights && insights.length > 0 && (
          <div className="insights-section">
            <h4 className="section-title">Key Insights</h4>
            <div className="insights-list">
              {insights.slice(0, 3).map((insight, index) => (
                <div key={index} className={`insight-item severity-${insight.severity}`}>
                  <div className="insight-header">
                    <span className="insight-icon">
                      {insight.severity === 'high' ? '🔴' : insight.severity === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <h5>{insight.title}</h5>
                  </div>
                  <p className="insight-detail">{insight.detail}</p>
                </div>
              ))}
            </div>
            {insights.length > 3 && (
              <p className="more-insights">+{insights.length - 3} more insights</p>
            )}
          </div>
        )}

        {riskProfile && (
          <div className="risk-section">
            {riskProfile.lowAttendance && riskProfile.lowAttendance.length > 0 && (
              <div className="risk-item">
                <span className="risk-icon">📉</span>
                <p><strong>{riskProfile.lowAttendance.length}</strong> subjects with low attendance</p>
              </div>
            )}
            
            {riskProfile.weakSubjects && riskProfile.weakSubjects.length > 0 && (
              <div className="risk-item">
                <span className="risk-icon">📊</span>
                <p><strong>{riskProfile.weakSubjects.length}</strong> subjects need improvement</p>
              </div>
            )}

            {riskProfile.cgpaDrop && (
              <div className="risk-item">
                <span className="risk-icon">📉</span>
                <p>CGPA decline detected</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-actions">
        {!accepted && onAccept && (
          <button className="btn btn-primary" onClick={() => onAccept(suggestion._id)}>
            <span>✓</span>
            Accept & Start Plan
          </button>
        )}
        
        {onViewDetails && (
          <button className="btn btn-secondary" onClick={() => onViewDetails(suggestion)}>
            <span>👁️</span>
            View Full Plan
          </button>
        )}

        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(suggestion._id)}>
            <span>🗑️</span>
            Delete Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyPlanCard;
