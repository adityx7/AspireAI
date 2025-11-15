import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import SemesterPage from './SemesterPage';

const AcademicsOverview = ({ userId }) => {
  const [academicsData, setAcademicsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    fetchAcademicsData();
  }, [userId]);

  const fetchAcademicsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5002/api/students/${userId}/academics`
      );
      
      if (response.data.success) {
        setAcademicsData(response.data.data);
        // Auto-select latest non-empty semester
        const latestSemester = response.data.data.semesters
          .filter(sem => sem.courses.length > 0)
          .sort((a, b) => b.semester - a.semester)[0];
        
        if (latestSemester) {
          // Don't auto-select, let user choose
          // setSelectedSemester(latestSemester.semester);
        }
      }
    } catch (err) {
      if (err.response?.status === 503) {
        setError('Semester-based academics feature is not enabled yet. Please enable USE_SEMESTER_ACADEMICS in environment variables.');
      } else {
        setError(err.response?.data?.message || 'Failed to load academics data');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSemesterColor = (sgpa) => {
    if (sgpa >= 9) return '#4caf50'; // Green
    if (sgpa >= 8) return '#8bc34a'; // Light green
    if (sgpa >= 7) return '#ffc107'; // Amber
    if (sgpa >= 6) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getSemesterStatus = (semester) => {
    const semesterData = academicsData?.semesters.find(s => s.semester === semester);
    if (!semesterData || semesterData.courses.length === 0) {
      return { label: 'Not Started', color: 'default' };
    }
    if (semesterData.sgpa === 0) {
      return { label: 'In Progress', color: 'info' };
    }
    return { label: 'Completed', color: 'success' };
  };

  if (selectedSemester !== null) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setSelectedSemester(null)}
          sx={{ mb: 2, color: '#667eea' }}
        >
          Back to Overview
        </Button>
        <SemesterPage
          userId={userId}
          semester={selectedSemester}
          onBack={() => setSelectedSemester(null)}
        />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  const cgpa = academicsData?.cgpa || 0;
  const totalSemesters = academicsData?.totalSemesters || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <Fade in timeout={500}>
        <Card
          elevation={4}
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Academic Performance
                </Typography>
                <Typography variant="subtitle1">
                  Track your semester-wise progress and grades
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold">
                  {cgpa.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">Cumulative CGPA</Typography>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`${totalSemesters} Semesters Completed`}
                  sx={{
                    mt: 1,
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Semester Grid */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: '#2c3e50' }}>
        <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Select a Semester
      </Typography>

      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem, index) => {
          const semesterData = academicsData?.semesters.find(s => s.semester === sem);
          const sgpa = semesterData?.sgpa || 0;
          const courseCount = semesterData?.courses.length || 0;
          const status = getSemesterStatus(sem);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={sem}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: semesterData ? getSemesterColor(sgpa) : '#e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      borderColor: '#667eea'
                    }
                  }}
                  onClick={() => setSelectedSemester(sem)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                        Semester {sem}
                      </Typography>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                    </Box>

                    <Box mt={2}>
                      {semesterData && courseCount > 0 ? (
                        <>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: 80,
                              bgcolor: getSemesterColor(sgpa),
                              borderRadius: 2,
                              mb: 2
                            }}
                          >
                            <Typography variant="h3" fontWeight="bold" color="white">
                              {sgpa.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" align="center">
                            {courseCount} Courses
                          </Typography>
                          <Typography variant="caption" color="text.secondary" align="center" display="block">
                            {semesterData.academicYear}
                          </Typography>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 80,
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            mb: 2
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            No data yet
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          bgcolor: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      {courseCount > 0 ? 'View Details' : 'Add Courses'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Stats */}
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6" color="#1976d2">
                  Total Credits Earned
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1976d2">
                  {academicsData?.semesters.reduce((sum, sem) => {
                    return sum + sem.courses.reduce((cSum, c) => cSum + (c.credits || 0), 0);
                  }, 0) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography variant="h6" color="#7b1fa2">
                  Total Courses
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#7b1fa2">
                  {academicsData?.semesters.reduce((sum, sem) => sum + sem.courses.length, 0) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" color="#e65100">
                  Highest SGPA
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#e65100">
                  {Math.max(...(academicsData?.semesters.map(s => s.sgpa) || [0])).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AcademicsOverview;
