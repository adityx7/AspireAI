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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to compute letter grade and grade points
const computeGrade = (total) => {
  if (total >= 90) return { letter: 'S', points: 10 };
  if (total >= 80) return { letter: 'A', points: 9 };
  if (total >= 70) return { letter: 'B', points: 8 };
  if (total >= 60) return { letter: 'C', points: 7 };
  if (total >= 50) return { letter: 'D', points: 6 };
  if (total >= 40) return { letter: 'E', points: 5 };
  return { letter: 'F', points: 0 };
};

// Helper function to compute semester SGPA
const computeSemesterSGPA = (courses) => {
  if (!courses || courses.length === 0) return 0;
  
  const totalCredits = courses.reduce((sum, course) => sum + (parseFloat(course.credits) || 0), 0);
  if (totalCredits === 0) return 0;
  
  const totalGradePoints = courses.reduce((sum, course) => {
    const credits = parseFloat(course.credits) || 0;
    const gradePoints = parseFloat(course.gradePoints) || 0;
    return sum + (credits * gradePoints);
  }, 0);
  
  return (totalGradePoints / totalCredits).toFixed(2);
};

const SemesterMarksPage = () => {
  const { semester: paramSemester } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState(parseInt(paramSemester) || 1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [semesterData, setSemesterData] = useState({
    semester: semester,
    academicYear: '',
    courses: []
  });

  const userId = localStorage.getItem('userId') || localStorage.getItem('studentId') || '';

  useEffect(() => {
    if (semester >= 1 && semester <= 8) {
      fetchSemesterData();
    }
  }, [semester]);

  const fetchSemesterData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5002/api/students/${userId}/academics/${semester}`
      );
      
      if (response.data.success && response.data.data) {
        setSemesterData(response.data.data);
      } else {
        // Initialize empty semester
        setSemesterData({
          semester: semester,
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          courses: []
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No data exists, start fresh
        setSemesterData({
          semester: semester,
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          courses: []
        });
      } else {
        console.error('Error fetching semester data:', err);
        setError('Failed to load semester data');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateNumber = (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  };

  const handleCourseFieldChange = (index, field, value) => {
    const updatedCourses = [...semesterData.courses];
    const course = { ...updatedCourses[index] };
    
    // Handle different field types
    if (field === 'courseCode' || field === 'courseName') {
      course[field] = value;
    } else if (field === 'attendancePercentage') {
      course[field] = validateNumber(value, 0, 100);
    } else if (['ia1', 'ia2', 'ia3'].includes(field)) {
      course[field] = validateNumber(value, 0, 15);
    } else if (['lab', 'other'].includes(field)) {
      course[field] = validateNumber(value, 0, 25);
    } else if (field === 'external') {
      course[field] = validateNumber(value, 0, 50);
    } else if (field === 'credits') {
      course[field] = validateNumber(value, 0, 10);
    }
    
    // Auto-calculate internal marks (best 2 IAs)
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
    
    // Calculate total marks
    const external = course.external || 0;
    course.total = Math.round((course.totalInternal + external) * 100) / 100;
    
    // Calculate letter grade and grade points
    const gradeInfo = computeGrade(course.total);
    course.letterGrade = gradeInfo.letter;
    course.gradePoints = gradeInfo.points;
    
    updatedCourses[index] = course;
    setSemesterData(prev => ({
      ...prev,
      courses: updatedCourses
    }));
  };

  const addNewCourse = () => {
    const newCourse = {
      courseCode: '',
      courseName: '',
      attendancePercentage: 0,
      ia1: 0,
      ia2: 0,
      ia3: 0,
      lab: 0,
      other: 0,
      totalInternal: 0,
      external: 0,
      total: 0,
      letterGrade: 'F',
      gradePoints: 0,
      credits: 0
    };
    
    setSemesterData(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
    
    toast.info('New course row added');
  };

  const deleteCourse = (index) => {
    const updatedCourses = semesterData.courses.filter((_, i) => i !== index);
    setSemesterData(prev => ({
      ...prev,
      courses: updatedCourses
    }));
    
    toast.info('Course removed');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Calculate SGPA before saving
      const sgpa = computeSemesterSGPA(semesterData.courses);
      const dataToSave = {
        ...semesterData,
        sgpa: parseFloat(sgpa)
      };

      const response = await axios.put(
        `http://localhost:5002/api/students/${userId}/academics/${semester}`,
        dataToSave
      );

      if (response.data.success) {
        toast.success('Semester marks saved successfully!');
        fetchSemesterData(); // Refresh to get updated CGPA
      }
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Failed to save semester marks. Please check all fields and try again.');
      toast.error('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    // Check if there are courses to export
    if (!semesterData.courses || semesterData.courses.length === 0) {
      toast.warning('Please add courses before exporting PDF');
      return;
    }
    
    try {
      setExporting(true);
      const response = await axios.get(
        `http://localhost:5002/api/students/${userId}/academics/${semester}/export`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Semester_${semester}_Marks.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      toast.error('Failed to export PDF. Please save data first.');
    } finally {
      setExporting(false);
    }
  };

  const handleSemesterChange = (newSemester) => {
    if (newSemester >= 1 && newSemester <= 8) {
      setSemester(newSemester);
      navigate(`/semester-marks/${newSemester}`);
    }
  };

  const handlePrevSemester = () => {
    if (semester > 1) {
      handleSemesterChange(semester - 1);
    }
  };

  const handleNextSemester = () => {
    if (semester < 8) {
      handleSemesterChange(semester + 1);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress 
            size={60}
            thickness={4}
            sx={{ 
              color: 'rgba(26, 43, 76, 0.85)',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 3,
              background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Loading Semester Data...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  const sgpa = computeSemesterSGPA(semesterData.courses);
  const totalCredits = semesterData.courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e57 0%, #1a2332 100%)',
      py: 4
    }}>
    <Container maxWidth="xl">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="colored"
        style={{ marginTop: '60px' }}
      />
      
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 0.5 }}>
                  📚 Semester {semester} Marks Entry
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ fontStyle: 'italic' }}>
                  Complete marks sheet - Internal + External
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center" flexWrap="wrap">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    onClick={handlePrevSemester}
                    disabled={semester === 1}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.25)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' },
                      '&:disabled': { opacity: 0.5 }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <FormControl sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 2 }}>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      value={semester}
                      label="Semester"
                      onChange={(e) => handleSemesterChange(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    onClick={handleNextSemester}
                    disabled={semester === 8}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.25)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' },
                      '&:disabled': { opacity: 0.5 }
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Semester Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'rgba(44, 62, 87, 0.5)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  value={semesterData.academicYear || ''}
                  onChange={(e) => setSemesterData(prev => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="e.g., 2024-2025"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#764ba2' }
                    }
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={2}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box 
                  p={2} 
                  bgcolor="linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)" 
                  borderRadius={2} 
                  textAlign="center"
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
                    boxShadow: '0 4px 15px rgba(63, 81, 181, 0.3)'
                  }}
                >
                  <Typography variant="caption" color="white" fontWeight="medium">SGPA</Typography>
                  <Typography variant="h4" fontWeight="bold" color="white">{sgpa}</Typography>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={2}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box 
                  p={2} 
                  borderRadius={2} 
                  textAlign="center"
                  sx={{ 
                    background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                  }}
                >
                  <Typography variant="caption" color="rgba(10, 25, 47, 0.9)" fontWeight="medium">Total Credits</Typography>
                  <Typography variant="h4" fontWeight="bold" color="rgba(10, 25, 47, 0.9)">{totalCredits}</Typography>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={2}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box 
                  p={2} 
                  borderRadius={2} 
                  textAlign="center"
                  sx={{ 
                    background: 'linear-gradient(135deg, #B8860B 0%, rgba(26, 43, 76, 0.85) 100%)',
                    boxShadow: '0 4px 15px rgba(92, 107, 192, 0.3)'
                  }}
                >
                  <Typography variant="caption" color="white" fontWeight="medium">Courses</Typography>
                  <Typography variant="h4" fontWeight="bold" color="white">{semesterData.courses.length}</Typography>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={2}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleExportPDF}
                  disabled={exporting || semesterData.courses.length === 0}
                  sx={{ 
                    height: '100%',
                    background: semesterData.courses.length > 0 ? 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' : '#ccc',
                    color: semesterData.courses.length > 0 ? 'rgba(10, 25, 47, 0.9)' : 'white',
                    fontWeight: 'bold',
                    boxShadow: semesterData.courses.length > 0 ? '0 4px 15px rgba(184, 134, 11, 0.4)' : 'none',
                    '&:hover': { 
                      background: semesterData.courses.length > 0 ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)' : '#ccc'
                    }
                  }}
                  title={semesterData.courses.length === 0 ? 'Add courses first' : 'Export semester as PDF'}
                >
                  {exporting ? 'Exporting...' : 'PDF'}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Marks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
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
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="h6" fontWeight="bold" color="white">
                📝 Course-wise Marks Entry
              </Typography>
            </motion.div>
            <Box display="flex" gap={1}>
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
                    '&:hover': { bgcolor: '#DAA520', boxShadow: '0 6px 16px rgba(218, 165, 32, 0.5)' }
                  }}
                >
                  Add Course
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  size="small"
                  sx={{ 
                    bgcolor: '#B8860B',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(92, 107, 192, 0.4)',
                    '&:hover': { bgcolor: 'rgba(26, 43, 76, 0.85)', boxShadow: '0 6px 16px rgba(63, 81, 181, 0.5)' }
                  }}
                >
                  {saving ? 'Saving...' : 'Save All'}
                </Button>
              </motion.div>
            </Box>
          </Box>
          <Divider />
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', minWidth: 50, borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Sl. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', minWidth: 100, borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Course Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', minWidth: 200, borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }}>Course Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }} align="center">Attendance %</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">IA1<br/><Typography variant="caption">(15)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">IA2<br/><Typography variant="caption">(15)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">IA3<br/><Typography variant="caption">(15)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">Lab<br/><Typography variant="caption">(25)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff9c4', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">Other<br/><Typography variant="caption">(25)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fffde7', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">Total Internal<br/><Typography variant="caption">(50)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8eaf6', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid rgba(26, 43, 76, 0.85)' }} align="center">External<br/><Typography variant="caption">(50)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#c5cae9', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid #B8860B' }} align="center">Total<br/><Typography variant="caption">(100)</Typography></TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#c5cae9', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid #B8860B' }} align="center">Letter Grade</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#c5cae9', color: 'rgba(10, 25, 47, 0.9)', borderBottom: '3px solid #B8860B' }} align="center">Grade Points</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff59d', color: '#f57f17', borderBottom: '3px solid #B8860B' }} align="center">Credits</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#ffcdd2', color: '#b71c1c', borderBottom: '3px solid #f44336' }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {semesterData.courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: '#f8f9ff' }}
                      sx={{
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          transform: 'scale(1.001)'
                        }
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={course.courseCode || ''}
                          onChange={(e) => handleCourseFieldChange(index, 'courseCode', e.target.value)}
                          placeholder="Code"
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          value={course.courseName || ''}
                          onChange={(e) => handleCourseFieldChange(index, 'courseName', e.target.value)}
                          placeholder="Course Name"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.attendancePercentage || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'attendancePercentage', e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.ia1 || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'ia1', e.target.value)}
                          inputProps={{ min: 0, max: 15, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.ia2 || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'ia2', e.target.value)}
                          inputProps={{ min: 0, max: 15, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.ia3 || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'ia3', e.target.value)}
                          inputProps={{ min: 0, max: 15, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.lab || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'lab', e.target.value)}
                          inputProps={{ min: 0, max: 25, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.other || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'other', e.target.value)}
                          inputProps={{ min: 0, max: 25, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Chip
                            label={course.totalInternal?.toFixed(2) || 0}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold', 
                              minWidth: 60,
                              background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                              color: 'rgba(10, 25, 47, 0.9)',
                              boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)'
                            }}
                          />
                        </motion.div>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.external || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'external', e.target.value)}
                          inputProps={{ min: 0, max: 50, step: 0.5 }}
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                          <Chip
                            label={course.total?.toFixed(2) || 0}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold', 
                              minWidth: 60,
                              background: 'linear-gradient(135deg, #B8860B 0%, rgba(26, 43, 76, 0.85) 100%)',
                              color: 'white',
                              boxShadow: '0 2px 8px rgba(92, 107, 192, 0.3)'
                            }}
                          />
                        </motion.div>
                      </TableCell>
                      <TableCell align="center">
                        <motion.div whileHover={{ scale: 1.2 }}>
                          <Chip
                            label={course.letterGrade || 'F'}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold', 
                              minWidth: 40,
                              bgcolor: course.letterGrade === 'S' ? '#4caf50' : 
                                       course.letterGrade === 'A' ? '#8bc34a' :
                                       course.letterGrade === 'B' ? '#cddc39' :
                                       course.letterGrade === 'C' ? '#ffeb3b' :
                                       course.letterGrade === 'D' ? '#ffc107' :
                                       course.letterGrade === 'E' ? '#ff9800' : '#f44336',
                              color: ['C', 'D', 'B'].includes(course.letterGrade) ? 'black' : 'white',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}
                          />
                        </motion.div>
                      </TableCell>
                      <TableCell align="center">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ 
                            color: 'rgba(26, 43, 76, 0.85)',
                            fontSize: '1.1rem'
                          }}>
                            {course.gradePoints || 0}
                          </Typography>
                        </motion.div>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={course.credits || 0}
                          onChange={(e) => handleCourseFieldChange(index, 'credits', e.target.value)}
                          inputProps={{ min: 0, max: 10, step: 1 }}
                          sx={{ width: 60 }}
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
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      </motion.div>

      {/* Formula Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'rgba(44, 62, 87, 0.5)',
            border: '1px solid rgba(184, 134, 11, 0.2)'
          }}
        >
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            color: 'white',
            mb: 2
          }}
        >
          📐 Calculation Formulas
        </Typography>
        <Box sx={{ '& > *': { mb: 1.5 } }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
            <Chip label="Formula 1" size="small" sx={{ mr: 1, bgcolor: '#B8860B', color: 'white' }} />
            <strong>Total Internal (50)</strong> = Best 2 of (IA1, IA2, IA3) × 20/30 + Lab × 15/25 + Other × 15/25
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
            <Chip label="Formula 2" size="small" sx={{ mr: 1, bgcolor: '#B8860B', color: 'white' }} />
            <strong>Total (100)</strong> = Total Internal + External
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
            <Chip label="Formula 3" size="small" sx={{ mr: 1, bgcolor: '#B8860B', color: 'white' }} />
            <strong>SGPA</strong> = Σ(Credits × Grade Points) / Σ(Credits)
          </Typography>
        </Box>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'white' }}>
          <strong>🎓 Grading Scale:</strong>
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip label="S (90-100) = 10" size="small" sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold' }} />
          <Chip label="A (80-89) = 9" size="small" sx={{ bgcolor: '#8bc34a', color: 'white', fontWeight: 'bold' }} />
          <Chip label="B (70-79) = 8" size="small" sx={{ bgcolor: '#cddc39', color: 'black', fontWeight: 'bold' }} />
          <Chip label="C (60-69) = 7" size="small" sx={{ bgcolor: '#ffeb3b', color: 'black', fontWeight: 'bold' }} />
          <Chip label="D (50-59) = 6" size="small" sx={{ bgcolor: '#ffc107', color: 'black', fontWeight: 'bold' }} />
          <Chip label="E (40-49) = 5" size="small" sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }} />
          <Chip label="F (<40) = 0" size="small" sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 'bold' }} />
        </Box>
      </Paper>
      </motion.div>
    </Container>
    </Box>
  );
};

export default SemesterMarksPage;
