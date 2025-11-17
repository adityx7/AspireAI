import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorStudentVerificationPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [verification, setVerification] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completing, setCompleting] = useState(false);
  
  const mentorId = localStorage.getItem('mentorID') || localStorage.getItem('mentorId') || localStorage.getItem('userId') || '';
  const mentorName = localStorage.getItem('mentorName') || localStorage.getItem('fullName') || localStorage.getItem('name') || '';

  useEffect(() => {
    fetchStudentOverview();
  }, [studentId]);

  const fetchStudentOverview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5002/api/mentor/${mentorId}/student/${studentId}/overview`
      );
      
      if (response.data.success) {
        setStudentData(response.data.data.student);
        setVerification(response.data.data.verification);
        
        // Initialize remarks from existing verification
        const initialRemarks = {};
        Object.keys(response.data.data.verification.sections).forEach(key => {
          initialRemarks[key] = response.data.data.verification.sections[key].remark || '';
        });
        setRemarks(initialRemarks);
      }
    } catch (error) {
      console.error('Error fetching student overview:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySection = async (section, verified) => {
    try {
      const response = await axios.post(
        `http://localhost:5002/api/mentor/${mentorId}/student/${studentId}/verify-section`,
        {
          section,
          verified,
          remark: remarks[section] || '',
          mentorName
        }
      );
      
      if (response.data.success) {
        // Update verification state
        setVerification(prev => ({
          ...prev,
          sections: {
            ...prev.sections,
            [section]: response.data.data.section
          },
          overallStatus: response.data.data.overallStatus,
          progress: response.data.data.progress
        }));
        
        toast.success(`Section ${verified ? 'verified' : 'unverified'} successfully`);
      }
    } catch (error) {
      console.error('Error verifying section:', error);
      toast.error('Failed to verify section');
    }
  };

  const handleCompleteVerification = async () => {
    try {
      setCompleting(true);
      const response = await axios.post(
        `http://localhost:5002/api/mentor/${mentorId}/student/${studentId}/complete-verification`,
        { lockData: true }
      );
      
      if (response.data.success) {
        toast.success('Student verification completed successfully!');
        setShowCompleteDialog(false);
        setTimeout(() => navigate('/mentor-dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error completing verification:', error);
      toast.error(error.response?.data?.message || 'Failed to complete verification');
    } finally {
      setCompleting(false);
    }
  };

  const renderSectionCard = (title, sectionKey, icon, content, dataExists = true) => {
    const section = verification?.sections[sectionKey];
    const isVerified = section?.verified;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Accordion
          sx={{
            mb: 2,
            border: isVerified ? '2px solid #4caf50' : '2px solid #e0e0e0',
            borderRadius: 2,
            '&:before': { display: 'none' },
            boxShadow: isVerified ? '0 4px 15px rgba(76, 175, 80, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              background: isVerified 
                ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              borderRadius: '8px 8px 0 0'
            }}
          >
            <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" pr={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ fontSize: 30 }}>{icon}</Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {title}
                  </Typography>
                  {!dataExists && (
                    <Typography variant="caption" color="error">
                      No data available
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                {isVerified ? (
                  <Chip 
                    icon={<VerifiedIcon />} 
                    label="Verified" 
                    color="success" 
                    size="small"
                  />
                ) : (
                  <Chip 
                    icon={<RadioButtonUncheckedIcon />} 
                    label="Pending" 
                    color="default" 
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {content}
            
            <Divider sx={{ my: 2 }} />
            
            {/* Verification Controls */}
            <Box mt={2}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mentor Remarks (Optional)"
                value={remarks[sectionKey] || ''}
                onChange={(e) => setRemarks(prev => ({ ...prev, [sectionKey]: e.target.value }))}
                disabled={verification?.locked}
                sx={{ mb: 2 }}
              />
              
              <Box display="flex" gap={2}>
                {!isVerified ? (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleVerifySection(sectionKey, true)}
                    disabled={verification?.locked}
                  >
                    Mark as Verified
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleVerifySection(sectionKey, false)}
                    disabled={verification?.locked}
                  >
                    Unverify
                  </Button>
                )}
              </Box>
              
              {section?.verifiedAt && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Verified by {section.verifiedBy} on {new Date(section.verifiedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!studentData || !verification) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          Failed to load student data. Please try again.
        </Alert>
      </Container>
    );
  }

  const progress = verification.progress;
  const allVerified = progress.verified === progress.total;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2c3e57 0%, #1a2332 100%)', py: 4 }}>
      <Container maxWidth="xl">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper elevation={6} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.9) 100%)' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={() => navigate('/dashboard-mentor')}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    🎓 Student Verification
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    {studentData.studentInfo.name} ({studentData.studentInfo.usn})
                  </Typography>
                </Box>
              </Box>
              
              {verification.locked && (
                <Chip
                  icon={<LockIcon />}
                  label="Locked"
                  color="warning"
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Verification Progress
              </Typography>
              <Chip
                label={`${progress.verified} / ${progress.total} Sections`}
                color={allVerified ? 'success' : 'primary'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress.percentage}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #B8860B 0%, #4caf50 100%)'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" mt={1} display="block">
              {progress.percentage}% Complete
            </Typography>
          </Paper>
        </motion.div>

        {/* Student Info Card */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📋 Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">USN</Typography>
                    <Typography variant="body1" fontWeight="medium">{studentData.studentInfo.usn}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Branch</Typography>
                    <Typography variant="body1" fontWeight="medium">{studentData.studentInfo.branch}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Year</Typography>
                    <Typography variant="body1" fontWeight="medium">{studentData.studentInfo.year}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Semester</Typography>
                    <Typography variant="body1" fontWeight="medium">{studentData.studentInfo.semester}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  📊 Academic Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">CGPA</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {studentData.statistics.cgpa}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Overall Attendance</Typography>
                    <Typography variant="h5" fontWeight="bold" color={studentData.statistics.overallAttendance >= 85 ? 'success.main' : 'error.main'}>
                      {studentData.statistics.overallAttendance}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Verification Sections */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'white', mb: 2 }}>
          Verification Sections
        </Typography>

        {/* Personal Details */}
        {renderSectionCard(
          'Personal Details',
          'personal',
          '👤',
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><strong>Email:</strong> {studentData.studentInfo.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>Phone:</strong> {studentData.studentInfo.phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>DOB:</strong> {studentData.studentInfo.dateOfBirth || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>Blood Group:</strong> {studentData.studentInfo.bloodGroup || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Address:</strong> {studentData.studentInfo.address || 'N/A'}</Typography>
            </Grid>
          </Grid>,
          true
        )}

        {/* Academic Records */}
        {renderSectionCard(
          'Academic Records',
          'academics',
          '📚',
          <Box>
            <Typography variant="h6" gutterBottom>Semester-wise Performance</Typography>
            {studentData.academics.semesters.map(sem => (
              <Card key={sem.semester} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Semester {sem.semester}</Typography>
                    <Chip label={`SGPA: ${sem.sgpa}`} color="primary" />
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Course</strong></TableCell>
                          <TableCell><strong>Credits</strong></TableCell>
                          <TableCell><strong>Grade</strong></TableCell>
                          <TableCell><strong>Total</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.courses.map((course, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{course.courseCode} - {course.courseName}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.letterGrade}</TableCell>
                            <TableCell>{course.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
          </Box>,
          studentData.academics.semesters.length > 0
        )}

        {/* Attendance */}
        {renderSectionCard(
          'Attendance Records',
          'attendance',
          '📅',
          <Box>
            <Typography variant="h6" gutterBottom>
              Overall Attendance: {studentData.statistics.overallAttendance}%
            </Typography>
            {studentData.attendance.semesterWise.map(sem => (
              <Card key={sem.semester} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Semester {sem.semester} - Average: {sem.average}%
                  </Typography>
                  <Grid container spacing={1} mt={1}>
                    {sem.courses.map((course, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">{course.code}</Typography>
                          <Chip 
                            label={`${course.attendance}%`}
                            size="small"
                            color={course.attendance >= 85 ? 'success' : 'error'}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>,
          studentData.attendance.semesterWise.length > 0
        )}

        {/* Internal Assessments */}
        {renderSectionCard(
          'Internal Assessments',
          'internalAssessments',
          '📝',
          <Box>
            {studentData.internalAssessments.map(sem => (
              <Card key={sem.semester} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Semester {sem.semester} - {sem.academicYear}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Course</strong></TableCell>
                          <TableCell><strong>IA1</strong></TableCell>
                          <TableCell><strong>IA2</strong></TableCell>
                          <TableCell><strong>IA3</strong></TableCell>
                          <TableCell><strong>Lab</strong></TableCell>
                          <TableCell><strong>Total</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.courses.map((course, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{course.courseCode}</TableCell>
                            <TableCell>{course.ia1}</TableCell>
                            <TableCell>{course.ia2}</TableCell>
                            <TableCell>{course.ia3}</TableCell>
                            <TableCell>{course.lab}</TableCell>
                            <TableCell><strong>{course.totalInternal}</strong></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
          </Box>,
          studentData.internalAssessments.length > 0
        )}

        {/* Self Assessments */}
        {renderSectionCard(
          'Self Assessment (Start)',
          'selfAssessmentStart',
          '📋',
          <Typography>
            {studentData.selfAssessments.start.length > 0 
              ? `${studentData.selfAssessments.start.length} assessment(s) found`
              : 'No self-assessment data available'}
          </Typography>,
          studentData.selfAssessments.start.length > 0
        )}

        {renderSectionCard(
          'Self Assessment (End)',
          'selfAssessmentEnd',
          '✅',
          <Typography>
            {studentData.selfAssessments.end.length > 0 
              ? `${studentData.selfAssessments.end.length} assessment(s) found`
              : 'No end-of-semester assessment data available'}
          </Typography>,
          studentData.selfAssessments.end.length > 0
        )}

        {/* Personality Development */}
        {renderSectionCard(
          'Personality Development',
          'personalityDevelopment',
          '🌟',
          <Typography>
            {studentData.personalityDevelopment.length > 0 
              ? `${studentData.personalityDevelopment.length} form(s) submitted`
              : 'No personality development data available'}
          </Typography>,
          studentData.personalityDevelopment.length > 0
        )}

        {/* AICTE Points */}
        {renderSectionCard(
          'AICTE Activity Points',
          'aictePoints',
          '🏆',
          <Box>
            <Typography variant="h6" gutterBottom>
              Total Points: {studentData.aictePoints.totalPoints}
            </Typography>
            {studentData.aictePoints.records.length > 0 && (
              <Typography variant="body2">
                {studentData.aictePoints.records.length} activity record(s)
              </Typography>
            )}
          </Box>,
          studentData.aictePoints.records.length > 0
        )}

        {/* Certificates */}
        {renderSectionCard(
          'Certificates',
          'certificates',
          '📜',
          <Typography>
            {studentData.certificates.length > 0 
              ? `${studentData.certificates.length} certificate(s) uploaded`
              : 'No certificates available'}
          </Typography>,
          studentData.certificates.length > 0
        )}

        {/* Achievements */}
        {renderSectionCard(
          'Achievements',
          'achievements',
          '🥇',
          <Typography>
            {studentData.achievements.length > 0 
              ? `${studentData.achievements.length} achievement(s) recorded`
              : 'No achievements available'}
          </Typography>,
          studentData.achievements.length > 0
        )}

        {/* Mentor Meetings */}
        {renderSectionCard(
          'Mentor Meeting History',
          'meetings',
          '🤝',
          <Box>
            {studentData.meetings.map((meeting, idx) => (
              <Card key={idx} sx={{ mb: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {new Date(meeting.date).toLocaleDateString()} - {meeting.topic}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meeting.notes}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {studentData.meetings.length === 0 && (
              <Typography>No meeting records available</Typography>
            )}
          </Box>,
          studentData.meetings.length > 0
        )}

        {/* Career Roadmap */}
        {renderSectionCard(
          'AI Career Suggestions & Roadmap',
          'career',
          '🚀',
          <Box>
            {studentData.career.latestPlan ? (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Latest plan generated on: {new Date(studentData.career.latestPlan.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {studentData.career.aiSuggestions.length > 0 
                    ? `${studentData.career.aiSuggestions.length} day plan available`
                    : 'Plan details available'}
                </Typography>
              </Box>
            ) : (
              <Typography>No AI career suggestions generated yet</Typography>
            )}
          </Box>,
          studentData.career.latestPlan !== null
        )}

        {/* Complete Verification Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Paper elevation={6} sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight="bold" color="rgba(10, 25, 47, 0.9)">
                  {allVerified ? 'All sections verified!' : 'Complete verification to submit'}
                </Typography>
                <Typography variant="body2" color="rgba(10, 25, 47, 0.7)">
                  {allVerified 
                    ? 'You can now submit the final verification'
                    : `Please verify all ${progress.total} sections before completing`}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={() => setShowCompleteDialog(true)}
                disabled={!allVerified || verification.locked}
                sx={{
                  bgcolor: 'rgba(10, 25, 47, 0.9)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'rgba(26, 43, 76, 0.95)' }
                }}
              >
                Complete Verification
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Complete Verification Dialog */}
        <Dialog open={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
          <DialogTitle>Complete Student Verification</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to complete the verification for <strong>{studentData.studentInfo.name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={2}>
              This will lock the verification and the student's data cannot be modified until unlocked by admin.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCompleteDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCompleteVerification} 
              variant="contained" 
              color="primary"
              disabled={completing}
            >
              {completing ? 'Completing...' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MentorStudentVerificationPage;
