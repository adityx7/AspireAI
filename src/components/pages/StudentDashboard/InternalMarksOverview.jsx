import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';

const InternalMarksOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [semestersData, setSemestersData] = useState([]);
  
  // Get user ID from your auth context or local storage
  const userId = localStorage.getItem('userId') || ''; // Adjust based on your auth setup

  useEffect(() => {
    fetchInternalMarksData();
  }, []);

  const fetchInternalMarksData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5002/api/students/${userId}/internal-marks`);
      
      if (response.data.success) {
        setSemestersData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching internal marks:', err);
      setError('Failed to load internal marks data');
    } finally {
      setLoading(false);
    }
  };

  const getSemesterData = (semNum) => {
    return semestersData.find(sem => sem.semester === semNum);
  };

  const calculateAverageAttendance = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const total = courses.reduce((sum, course) => sum + (course.attendancePercentage || 0), 0);
    return (total / courses.length).toFixed(1);
  };

  const getSemesterCardColor = (avgAttendance) => {
    if (avgAttendance >= 85) return 'rgba(26, 43, 76, 0.85)'; // Indigo for good attendance
    if (avgAttendance >= 75) return '#B8860B'; // Gold for average
    return '#f44336'; // Red for low
  };

  const handleSemesterClick = (semesterNum) => {
    navigate(`/internal-marks/semester/${semesterNum}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2c3e57 0%, #1a2332 100%)', py: 4 }}>
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box 
          mb={4} 
          p={3} 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(63, 81, 181, 0.3)'
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
            📊 Internal Assessment Marks
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.9)">
            View and manage semester-wise internal marks (IA1, IA2, IA3, Lab, Other)
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
          const semData = getSemesterData(semNum);
          const courseCount = semData?.courses?.length || 0;
          const avgAttendance = semData ? calculateAverageAttendance(semData.courses) : 0;
          const cardColor = getSemesterCardColor(parseFloat(avgAttendance));

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={semNum}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: semNum * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    border: semData ? '3px solid rgba(255, 193, 7, 0.6)' : '3px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: semData ? '0 4px 20px rgba(255, 193, 7, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
                    borderRadius: 3,
                    background: semData 
                      ? 'linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(44, 62, 87, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(44, 62, 87, 0.5) 0%, rgba(26, 35, 50, 0.6) 100%)',
                    '&:hover': {
                      boxShadow: semData ? '0 8px 30px rgba(255, 193, 7, 0.4)' : '0 8px 30px rgba(63, 81, 181, 0.3)',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                      border: semData ? '3px solid rgba(255, 193, 7, 0.8)' : '3px solid rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleSemesterClick(semNum)}
                    sx={{ height: '100%' }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <AssignmentIcon sx={{ fontSize: 40, color: semData ? cardColor : '#e0e0e0', mr: 1 }} />
                        <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                          Semester {semNum}
                        </Typography>
                      </Box>

                      {semData ? (
                        <>
                          <Box mb={2}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                              Academic Year
                            </Typography>
                            <Typography variant="body1" fontWeight="medium" sx={{ color: 'white' }}>
                              {semData.academicYear || 'N/A'}
                            </Typography>
                          </Box>

                          <Box mb={2}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                              Number of Courses
                            </Typography>
                            <Chip 
                              label={`${courseCount} Courses`} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(255, 193, 7, 0.9)',
                                color: 'rgba(10, 25, 47, 0.9)',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>

                          <Box mb={2}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                              Avg Attendance
                            </Typography>
                            <Chip 
                              label={`${avgAttendance}%`}
                              size="small"
                              sx={{ 
                                bgcolor: parseFloat(avgAttendance) >= 85 ? '#4caf50' : parseFloat(avgAttendance) >= 75 ? '#ff9800' : '#f44336',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>

                          {semData.mentorName && (
                            <Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                                Mentor
                              </Typography>
                              <Typography variant="body2" fontWeight="medium" sx={{ color: 'white' }}>
                                {semData.mentorName}
                              </Typography>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} align="center">
                            No data available
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} align="center" display="block" mt={1}>
                            Click to add internal marks
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Container>
    </Box>
  );
};

export default InternalMarksOverview;
