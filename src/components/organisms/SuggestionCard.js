import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Alert,
  Collapse,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// Theme colors
const NAVY_BLUE_MAIN = '#001F3F';
const NAVY_BLUE_LIGHT = '#003D7A';
const GOLD_MAIN = '#FFD700';
const GOLD_LIGHT = '#FFE44D';

const SuggestionCard = ({ suggestion, onApply, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await onApply(suggestion._id);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await onDismiss(suggestion._id);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <WarningIcon />;
      case 'medium':
        return <InfoIcon />;
      case 'low':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };

  const getDaysRemaining = () => {
    if (!suggestion.planEndsAt) return null;
    const daysLeft = Math.ceil(
      (new Date(suggestion.planEndsAt) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft > 0 ? daysLeft : 0;
  };

  const getStatusDisplay = () => {
    if (suggestion.applied) {
      return { label: 'Active', color: 'success' };
    } else if (suggestion.dismissed) {
      return { label: 'Dismissed', color: 'default' };
    } else if (suggestion.reviewed) {
      return { label: 'Reviewed', color: 'info' };
    } else {
      return { label: 'Pending', color: 'warning' };
    }
  };

  const status = getStatusDisplay();
  const daysRemaining = getDaysRemaining();

  return (
    <Card
      sx={{
        mb: 2,
        border: `2px solid ${suggestion.applied ? GOLD_MAIN : NAVY_BLUE_LIGHT}`,
        bgcolor: suggestion.applied ? '#FFFEF7' : 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {loading && <LinearProgress sx={{ bgcolor: GOLD_LIGHT }} />}
      
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon sx={{ color: NAVY_BLUE_MAIN }} />
            <Typography variant="h6" color={NAVY_BLUE_MAIN}>
              {suggestion.planLength}-Day Study Plan
            </Typography>
          </Box>
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Confidence Score */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            AI Confidence: {Math.round(suggestion.confidence * 100)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={suggestion.confidence * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: suggestion.confidence > 0.7 ? GOLD_MAIN : 'warning.main',
              },
            }}
          />
        </Box>

        {/* Days Remaining */}
        {daysRemaining !== null && suggestion.applied && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining in your plan
          </Alert>
        )}

        {/* Key Insights */}
        <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
          Key Insights:
        </Typography>
        <Box mb={2}>
          {suggestion.insights.slice(0, expanded ? undefined : 2).map((insight, idx) => (
            <Alert
              key={idx}
              severity={getSeverityColor(insight.severity)}
              icon={getSeverityIcon(insight.severity)}
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2">{insight.title}</Typography>
              <Typography variant="body2">{insight.detail}</Typography>
            </Alert>
          ))}
        </Box>

        {/* Expand/Collapse Button */}
        {suggestion.insights.length > 2 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.3s',
                }}
              />
            }
            sx={{ color: NAVY_BLUE_MAIN, mb: 2 }}
          >
            {expanded ? 'Show Less' : `Show ${suggestion.insights.length - 2} More Insights`}
          </Button>
        )}

        {/* Expanded Content */}
        <Collapse in={expanded}>
          {/* Micro Support */}
          {suggestion.microSupport && suggestion.microSupport.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                Daily Support Messages:
              </Typography>
              {suggestion.microSupport.map((msg, idx) => (
                <Typography key={idx} variant="body2" color="text.secondary" sx={{ ml: 2, mb: 0.5 }}>
                  • {msg}
                </Typography>
              ))}
            </Box>
          )}

          {/* Resources */}
          {suggestion.resources && suggestion.resources.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                Recommended Resources:
              </Typography>
              {suggestion.resources.map((resource, idx) => (
                <Box key={idx} sx={{ ml: 2, mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {resource.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {resource.description}
                  </Typography>
                  {resource.url && (
                    <Button
                      size="small"
                      href={resource.url}
                      target="_blank"
                      sx={{ color: GOLD_MAIN, p: 0, minWidth: 0 }}
                    >
                      View Resource →
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Mentor Actions */}
          {suggestion.suggestedMentorActions && suggestion.suggestedMentorActions.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                Suggested Mentor Actions:
              </Typography>
              {suggestion.suggestedMentorActions.map((action, idx) => (
                <Typography key={idx} variant="body2" color="text.secondary" sx={{ ml: 2, mb: 0.5 }}>
                  • {action}
                </Typography>
              ))}
            </Box>
          )}
        </Collapse>

        {/* Generated Date */}
        <Typography variant="caption" color="text.secondary">
          Generated: {new Date(suggestion.generatedAt).toLocaleDateString()} by {suggestion.agent}
        </Typography>
      </CardContent>

      {/* Actions */}
      {!suggestion.applied && !suggestion.dismissed && (
        <CardActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={loading}
            sx={{
              bgcolor: GOLD_MAIN,
              color: NAVY_BLUE_MAIN,
              '&:hover': {
                bgcolor: GOLD_LIGHT,
              },
            }}
          >
            Apply This Plan
          </Button>
          <Button
            variant="outlined"
            onClick={handleDismiss}
            disabled={loading}
            sx={{
              borderColor: NAVY_BLUE_MAIN,
              color: NAVY_BLUE_MAIN,
              '&:hover': {
                borderColor: NAVY_BLUE_MAIN,
                bgcolor: 'grey.100',
              },
            }}
          >
            Dismiss
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default SuggestionCard;
