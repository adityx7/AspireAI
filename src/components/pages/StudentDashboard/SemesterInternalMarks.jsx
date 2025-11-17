import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SemesterInternalMarks = () => {
  const { semester } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [semesterData, setSemesterData] = useState({
    semester: parseInt(semester),
    academicYear: '',
    mentorName: '',
    feesToBePaid: 0,
    feesPaid: 0,
    receiptNo: '',
    courses: []
  });

  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    fetchSemesterData();
  }, [semester]);

  const fetchSemesterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5002/api/students/${userId}/internal-marks/${semester}`
      );
      
      if (response.data.success && response.data.data) {
        setSemesterData(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No data exists yet, use default empty structure
        console.log('No existing data, starting fresh');
      } else {
        console.error('Error fetching semester data:', err);
        setError('Failed to load semester data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (field, value) => {
    setSemesterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCourseFieldChange = (index, field, value) => {
    const updatedCourses = [...semesterData.courses];
    const course = { ...updatedCourses[index] };
    
    // Validate numeric fields
    if (['ia1', 'ia2', 'ia3', 'lab', 'other', 'attendancePercentage'].includes(field)) {
      // Handle empty string - store as 0
      const numValue = value === '' ? 0 : parseFloat(value);
      
      // Apply max limits
      if (field === 'attendancePercentage') {
        course[field] = Math.min(Math.max(numValue, 0), 100);
      } else if (['ia1', 'ia2', 'ia3'].includes(field)) {
        course[field] = Math.min(Math.max(numValue, 0), 15);
      } else if (['lab', 'other'].includes(field)) {
        course[field] = Math.min(Math.max(numValue, 0), 25);
      }
      
      // Auto-calculate total internal
      const ia1 = course.ia1 || 0;
      const ia2 = course.ia2 || 0;
      const ia3 = course.ia3 || 0;
      const lab = course.lab || 0;
      const other = course.other || 0;
      
      const iaMarks = [ia1, ia2, ia3].sort((a, b) => b - a);
      const best2IAs = iaMarks[0] + iaMarks[1];
      const iaContribution = (best2IAs / 30) * 20;
      const labContribution = (lab / 25) * 15;
      const otherContribution = (other / 25) * 15;
      
      course.totalInternal = Math.round((iaContribution + labContribution + otherContribution) * 100) / 100;
    } else {
      course[field] = value;
    }
    
    updatedCourses[index] = course;
    setSemesterData(prev => ({
      ...prev,
      courses: updatedCourses
    }));
  };

  const addNewCourse = () => {
    setSemesterData(prev => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          courseCode: '',
          courseName: '',
          attendancePercentage: 0,
          ia1: 0,
          ia2: 0,
          ia3: 0,
          lab: 0,
          other: 0,
          totalInternal: 0
        }
      ]
    }));
  };

  const deleteCourse = (index) => {
    const updatedCourses = semesterData.courses.filter((_, i) => i !== index);
    setSemesterData(prev => ({
      ...prev,
      courses: updatedCourses
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:5002/api/students/${userId}/internal-marks/${semester}`,
        semesterData
      );

      if (response.data.success) {
        alert('Internal marks saved successfully!');
        fetchSemesterData(); // Refresh data
      }
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Failed to save internal marks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2c3e57 0%, #1a2332 100%)', py: 4 }}>
    <Container maxWidth="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={6}
          sx={{ 
            p: 3, 
            mb: 3,
            background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(63, 81, 181, 0.3)'
          }}
        >
          <Box display="flex" alignItems="center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={() => navigate('/internal-marks')} 
                sx={{ 
                  mr: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </motion.div>
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight="bold" color="white">
                📚 Semester {semester} - Internal Assessment
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.9)">
                Internal Assessment Score and Attendance Details
              </Typography>
            </Box>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ 
                  bgcolor: '#B8860B',
                  color: 'rgba(10, 25, 47, 0.9)',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(184, 134, 11, 0.4)',
                  '&:hover': { 
                    bgcolor: '#DAA520',
                    boxShadow: '0 6px 20px rgba(218, 165, 32, 0.5)'
                  }
                }}
              >
                {saving ? 'Saving...' : 'Save All'}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Semester Metadata */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            border: '2px solid #e8eaf6',
            background: 'linear-gradient(to bottom, #ffffff 0%, #f5f7fa 100%)'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'rgba(26, 43, 76, 0.85)', mb: 2 }}>
            📋 Semester Information
          </Typography>
          <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Academic Year"
              value={semesterData.academicYear}
              onChange={(e) => handleMetadataChange('academicYear', e.target.value)}
              placeholder="e.g., 2024-2025"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Name of the Mentor"
              value={semesterData.mentorName}
              onChange={(e) => handleMetadataChange('mentorName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Fees to be Paid"
              type="number"
              value={semesterData.feesToBePaid || ''}
              onChange={(e) => handleMetadataChange('feesToBePaid', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Fees Paid"
              type="number"
              value={semesterData.feesPaid || ''}
              onChange={(e) => handleMetadataChange('feesPaid', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Receipt No."
              value={semesterData.receiptNo}
              onChange={(e) => handleMetadataChange('receiptNo', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
      </motion.div>

      {/* Internal Marks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Paper 
          elevation={6}
          sx={{ 
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box 
            p={2} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)' }}
          >
            <Typography variant="h6" fontWeight="bold" color="white">
              📝 Internal Assessment Score and Attendance Details
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addNewCourse}
                size="small"
                sx={{ 
                  bgcolor: '#B8860B',
                  color: 'rgba(10, 25, 47, 0.9)',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(184, 134, 11, 0.4)',
                  '&:hover': { 
                    bgcolor: '#DAA520',
                    boxShadow: '0 6px 16px rgba(218, 165, 32, 0.5)'
                  }
                }}
              >
                Add Course
              </Button>
            </motion.div>
          </Box>
          <Divider />
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Sl. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Course Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', minWidth: 200, borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Course Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }} align="center">
                  Attendance %
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">
                  IA1<br/><Typography variant="caption">(Max 15)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">
                  IA2<br/><Typography variant="caption">(Max 15)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">
                  IA3<br/><Typography variant="caption">(Max 15)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">
                  Lab<br/><Typography variant="caption">(Max 25)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">
                  Other<br/><Typography variant="caption">(Max 25)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#c5cae9', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid #B8860B' }} align="center">
                  Total<br/><Typography variant="caption">(Max 50)</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#ffcdd2', color: '#b71c1c', borderBottom: '3px solid #f44336' }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {semesterData.courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No courses added yet. Click "Add Course" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                semesterData.courses.map((course, index) => (
                  <motion.tr
                    key={index}
                    component={TableRow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={course.courseCode}
                        onChange={(e) => handleCourseFieldChange(index, 'courseCode', e.target.value)}
                        placeholder="Code"
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={course.courseName}
                        onChange={(e) => handleCourseFieldChange(index, 'courseName', e.target.value)}
                        placeholder="Course Name"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.attendancePercentage || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'attendancePercentage', e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.ia1 || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'ia1', e.target.value)}
                        inputProps={{ min: 0, max: 15, step: 0.5 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.ia2 || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'ia2', e.target.value)}
                        inputProps={{ min: 0, max: 15, step: 0.5 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.ia3 || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'ia3', e.target.value)}
                        inputProps={{ min: 0, max: 15, step: 0.5 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.lab || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'lab', e.target.value)}
                        inputProps={{ min: 0, max: 25, step: 0.5 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={course.other || ''}
                        onChange={(e) => handleCourseFieldChange(index, 'other', e.target.value)}
                        inputProps={{ min: 0, max: 25, step: 0.5 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={course.totalInternal.toFixed(2)}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #B8860B 0%, rgba(26, 43, 76, 0.85) 100%)',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(92, 107, 192, 0.3)'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => deleteCourse(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(184, 134, 11, 0.2)',
            background: 'rgba(44, 62, 87, 0.5)'
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            📐 Calculation Formula:
          </Typography>
          <Box sx={{ bgcolor: '#fffde7', p: 2, borderRadius: 2, border: '2px solid #B8860B' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              <Chip 
                label="Formula" 
                size="small" 
                sx={{ mr: 1, bgcolor: '#B8860B', color: 'rgba(10, 25, 47, 0.9)', fontWeight: 'bold' }} 
              />
              <strong>Total Internal (50 marks)</strong> = Best 2 of (IA1, IA2, IA3) × 20/30 + Lab × 15/25 + Other × 15/25
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" display="block" mt={2} sx={{ fontStyle: 'italic' }}>
            💡 Note: The system automatically calculates the total internal marks based on the best 2 IA scores.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
    </Box>
  );
};

export default SemesterInternalMarks;
