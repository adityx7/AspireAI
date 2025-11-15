import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Theme colors
const NAVY_BLUE_MAIN = '#001F3F';
const NAVY_BLUE_LIGHT = '#003D7A';
const GOLD_MAIN = '#FFD700';
const GOLD_LIGHT = '#FFE44D';

const MentorReviewPanel = ({ mentorId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState(null); // 'accept' or 'dismiss'
  const [tabValue, setTabValue] = useState(0); // 0: Pending, 1: Reviewed, 2: All
  const [studentFilter, setStudentFilter] = useState('');

  // Fetch suggestions assigned to this mentor
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // Get all students assigned to this mentor
      const mentorResponse = await axios.get(
        `http://localhost:5002/api/mentors/${mentorId}/students`
      );
      
      if (mentorResponse.data.success) {
        const studentIds = mentorResponse.data.data.students.map(s => s.usn);
        
        // Fetch suggestions for all these students
        const suggestionPromises = studentIds.map(studentId =>
          axios.get(`http://localhost:5002/api/students/${studentId}/mentor-suggestions`)
        );
        
        const results = await Promise.all(suggestionPromises);
        const allSuggestions = results.flatMap(r => 
          r.data.success ? r.data.data.suggestions : []
        );
        
        setSuggestions(allSuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // Refresh every 60 seconds
    const interval = setInterval(fetchSuggestions, 60000);
    return () => clearInterval(interval);
  }, [mentorId]);

  const handleReviewClick = (suggestion, action) => {
    setSelectedSuggestion(suggestion);
    setReviewAction(action);
    setReviewNotes('');
    setReviewDialog(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedSuggestion || !reviewAction) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5002/api/students/${selectedSuggestion.userId}/mentor-suggestions/${selectedSuggestion._id}/review`,
        {
          action: reviewAction,
          mentorNotes: reviewNotes,
          reviewedBy: mentorId,
        }
      );

      if (response.data.success) {
        // Update local state
        setSuggestions(prev =>
          prev.map(s =>
            s._id === selectedSuggestion._id
              ? { ...s, reviewed: true, [reviewAction === 'accept' ? 'accepted' : 'dismissed']: true }
              : s
          )
        );
        
        setReviewDialog(false);
        setSelectedSuggestion(null);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSuggestions = () => {
    let filtered = suggestions;

    // Filter by status tab
    if (tabValue === 0) {
      filtered = filtered.filter(s => !s.reviewed);
    } else if (tabValue === 1) {
      filtered = filtered.filter(s => s.reviewed);
    }

    // Filter by student
    if (studentFilter) {
      filtered = filtered.filter(s =>
        s.userId.toLowerCase().includes(studentFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const getPendingCount = () => suggestions.filter(s => !s.reviewed).length;
  const getReviewedCount = () => suggestions.filter(s => s.reviewed).length;

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

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" color={NAVY_BLUE_MAIN} gutterBottom>
          Student Suggestion Review
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review AI-generated study plans for your mentees
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: GOLD_LIGHT, border: `2px solid ${GOLD_MAIN}` }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color={NAVY_BLUE_MAIN}>
                    {getPendingCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 48, color: NAVY_BLUE_MAIN }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="success.dark">
                    {suggestions.filter(s => s.accepted).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accepted
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'grey.100', border: '2px solid', borderColor: 'grey.400' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" color="text.secondary">
                    {suggestions.filter(s => s.dismissed).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dismissed
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 48, color: 'grey.500' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                color: NAVY_BLUE_MAIN,
                '&.Mui-selected': {
                  color: GOLD_MAIN,
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: GOLD_MAIN,
              },
            }}
          >
            <Tab label={`Pending (${getPendingCount()})`} />
            <Tab label={`Reviewed (${getReviewedCount()})`} />
            <Tab label="All" />
          </Tabs>

          <TextField
            fullWidth
            placeholder="Filter by student ID..."
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      {/* Suggestions List */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {filteredSuggestions.length === 0 ? (
        <Alert severity="info">
          No suggestions to review at this time.
        </Alert>
      ) : (
        filteredSuggestions.map((suggestion) => (
          <Card key={suggestion._id} sx={{ mb: 2, boxShadow: 2 }}>
            <CardContent>
              {/* Student Info */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h6" color={NAVY_BLUE_MAIN}>
                    Student: {suggestion.userId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Generated: {new Date(suggestion.generatedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Chip
                    label={`${suggestion.planLength} Days`}
                    sx={{ bgcolor: NAVY_BLUE_LIGHT, color: 'white' }}
                  />
                  {suggestion.accepted && <Chip label="Accepted" color="success" />}
                  {suggestion.dismissed && <Chip label="Dismissed" color="default" />}
                  {suggestion.applied && <Chip label="Applied" sx={{ bgcolor: GOLD_MAIN }} />}
                  {!suggestion.reviewed && <Chip label="Pending" color="warning" />}
                </Box>
              </Box>

              {/* AI Confidence */}
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
                      bgcolor: suggestion.confidence > 0.7 ? 'success.main' : 'warning.main',
                    },
                  }}
                />
              </Box>

              {/* Key Insights */}
              <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                Key Insights:
              </Typography>
              <List dense>
                {suggestion.insights.map((insight, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={insight.severity}
                            color={getSeverityColor(insight.severity)}
                            size="small"
                          />
                          <Typography variant="subtitle2">{insight.title}</Typography>
                        </Box>
                      }
                      secondary={insight.detail}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Suggested Actions */}
              {suggestion.suggestedMentorActions && suggestion.suggestedMentorActions.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                    Recommended Actions for Mentor:
                  </Typography>
                  <List dense>
                    {suggestion.suggestedMentorActions.map((action, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={`• ${action}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Review Actions */}
              {!suggestion.reviewed && (
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleReviewClick(suggestion, 'accept')}
                    sx={{
                      bgcolor: 'success.main',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                    }}
                  >
                    Accept & Approve
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReviewClick(suggestion, 'dismiss')}
                    sx={{
                      borderColor: 'error.main',
                      color: 'error.main',
                      '&:hover': {
                        borderColor: 'error.dark',
                        bgcolor: 'error.50',
                      },
                    }}
                  >
                    Dismiss
                  </Button>
                </Box>
              )}

              {/* Review Info */}
              {suggestion.reviewed && (
                <Box mt={2} p={2} bgcolor="grey.50" borderRadius={2}>
                  <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
                    Review Details:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reviewed: {new Date(suggestion.reviewedAt).toLocaleString()}
                  </Typography>
                  {suggestion.mentorNotes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Notes: {suggestion.mentorNotes}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: NAVY_BLUE_MAIN, color: 'white' }}>
          {reviewAction === 'accept' ? 'Accept Suggestion' : 'Dismiss Suggestion'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert
            severity={reviewAction === 'accept' ? 'success' : 'warning'}
            sx={{ mb: 2 }}
            icon={reviewAction === 'accept' ? <CheckCircleIcon /> : <InfoIcon />}
          >
            {reviewAction === 'accept'
              ? 'This suggestion will be approved and the student can apply it.'
              : 'This suggestion will be dismissed and marked as not suitable.'}
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review Notes (Optional)"
            placeholder="Add any notes or feedback for the student..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReviewSubmit}
            disabled={loading}
            sx={{
              bgcolor: reviewAction === 'accept' ? 'success.main' : 'error.main',
              '&:hover': {
                bgcolor: reviewAction === 'accept' ? 'success.dark' : 'error.dark',
              },
            }}
          >
            {loading ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorReviewPanel;
