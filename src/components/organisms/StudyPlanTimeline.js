import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

// Theme colors
const NAVY_BLUE_MAIN = '#001F3F';
const NAVY_BLUE_LIGHT = '#003D7A';
const GOLD_MAIN = '#FFD700';
const GOLD_LIGHT = '#FFE44D';

const StudyPlanTimeline = ({ suggestion, onTaskComplete }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [activeStep, setActiveStep] = useState(0);

  if (!suggestion || !suggestion.plan) {
    return (
      <Alert severity="info">
        No active study plan. Apply a suggestion to get started!
      </Alert>
    );
  }

  const getCurrentDayIndex = () => {
    if (!suggestion.appliedAt) return 0;
    
    const startDate = new Date(suggestion.appliedAt);
    const today = new Date();
    const dayDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max(dayDiff, 0), suggestion.plan.length - 1);
  };

  const currentDayIndex = getCurrentDayIndex();

  const handleTaskToggle = (dayIndex, taskIndex) => {
    const taskId = `${dayIndex}-${taskIndex}`;
    const newCompleted = new Set(completedTasks);
    
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    
    setCompletedTasks(newCompleted);
    
    if (onTaskComplete) {
      onTaskComplete(dayIndex, taskIndex, !completedTasks.has(taskId));
    }
  };

  const isTaskCompleted = (dayIndex, taskIndex) => {
    return completedTasks.has(`${dayIndex}-${taskIndex}`);
  };

  const getDayProgress = (dayIndex) => {
    const day = suggestion.plan[dayIndex];
    if (!day || !day.tasks) return 0;
    
    const completed = day.tasks.filter((_, idx) => 
      isTaskCompleted(dayIndex, idx)
    ).length;
    
    return Math.round((completed / day.tasks.length) * 100);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isPastDay = (dayIndex) => dayIndex < currentDayIndex;
  const isToday = (dayIndex) => dayIndex === currentDayIndex;
  const isFutureDay = (dayIndex) => dayIndex > currentDayIndex;

  return (
    <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" color={NAVY_BLUE_MAIN} gutterBottom>
              Your {suggestion.planLength}-Day Study Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Started: {new Date(suggestion.appliedAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            label={`Day ${currentDayIndex + 1}/${suggestion.plan.length}`}
            sx={{
              bgcolor: GOLD_MAIN,
              color: NAVY_BLUE_MAIN,
              fontWeight: 'bold',
              fontSize: '1rem',
              height: 40,
              px: 2,
            }}
          />
        </Box>

        {/* Timeline Stepper */}
        <Stepper 
          activeStep={activeStep} 
          orientation="vertical"
          sx={{
            '& .MuiStepLabel-root .Mui-completed': {
              color: GOLD_MAIN,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: NAVY_BLUE_MAIN,
            },
          }}
        >
          {suggestion.plan.map((day, dayIndex) => (
            <Step 
              key={dayIndex} 
              expanded={isToday(dayIndex) || activeStep === dayIndex}
              completed={isPastDay(dayIndex)}
            >
              <StepLabel
                onClick={() => setActiveStep(dayIndex)}
                sx={{ cursor: 'pointer' }}
                optional={
                  <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      icon={<EventIcon />}
                      label={formatDate(day.date)}
                      size="small"
                      variant={isToday(dayIndex) ? "filled" : "outlined"}
                      color={isToday(dayIndex) ? "primary" : "default"}
                    />
                    {isToday(dayIndex) && (
                      <Chip
                        label="Today"
                        size="small"
                        sx={{ bgcolor: GOLD_MAIN, color: NAVY_BLUE_MAIN }}
                      />
                    )}
                    <Chip
                      label={`${getDayProgress(dayIndex)}% Complete`}
                      size="small"
                      color={getDayProgress(dayIndex) === 100 ? "success" : "default"}
                    />
                  </Box>
                }
              >
                <Typography variant="h6">
                  Day {day.day}
                  {day.theme && ` - ${day.theme}`}
                </Typography>
              </StepLabel>

              <StepContent>
                {day.focus && (
                  <Alert 
                    severity="info" 
                    sx={{ mb: 2, bgcolor: NAVY_BLUE_LIGHT, color: 'white' }}
                    icon={<InfoIcon sx={{ color: GOLD_MAIN }} />}
                  >
                    <Typography variant="subtitle2">Focus Area:</Typography>
                    <Typography variant="body2">{day.focus}</Typography>
                  </Alert>
                )}

                <List dense>
                  {day.tasks && day.tasks.map((task, taskIndex) => (
                    <ListItem
                      key={taskIndex}
                      sx={{
                        bgcolor: isTaskCompleted(dayIndex, taskIndex) 
                          ? 'success.50' 
                          : 'background.paper',
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid',
                        borderColor: isTaskCompleted(dayIndex, taskIndex)
                          ? 'success.main'
                          : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isTaskCompleted(dayIndex, taskIndex)
                            ? 'success.100'
                            : 'grey.50',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isTaskCompleted(dayIndex, taskIndex)}
                          onChange={() => handleTaskToggle(dayIndex, taskIndex)}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: isTaskCompleted(dayIndex, taskIndex)
                                ? 'line-through'
                                : 'none',
                            }}
                          >
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                            {task.time && (
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={task.time}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {task.duration && (
                              <Chip
                                label={`${task.duration} min`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {task.subject && (
                              <Chip
                                label={task.subject}
                                size="small"
                                sx={{ bgcolor: GOLD_LIGHT }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {isFutureDay(dayIndex) && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This day's tasks will unlock on {formatDate(day.date)}
                  </Alert>
                )}

                <Box mt={2}>
                  <Button
                    size="small"
                    onClick={() => {
                      if (dayIndex < suggestion.plan.length - 1) {
                        setActiveStep(dayIndex + 1);
                      }
                    }}
                    disabled={dayIndex === suggestion.plan.length - 1}
                    sx={{ color: NAVY_BLUE_MAIN }}
                  >
                    Next Day
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Overall Progress */}
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
          <Typography variant="subtitle2" color={NAVY_BLUE_MAIN} gutterBottom>
            Overall Progress
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip
              label={`${currentDayIndex + 1}/${suggestion.plan.length} Days`}
              color="primary"
            />
            <Chip
              label={`${completedTasks.size} Tasks Completed`}
              color="success"
            />
            <Chip
              label={`${Math.round(suggestion.confidence * 100)}% AI Confidence`}
              sx={{ bgcolor: GOLD_MAIN }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudyPlanTimeline;
