import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SemesterPage = ({ userId, semester, onBack }) => {
  const [semesterData, setSemesterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchSemesterData();
  }, [userId, semester]);

  const fetchSemesterData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5002/api/students/${userId}/academics/${semester}`
      );
      
      if (response.data.success) {
        setSemesterData(response.data.data);
      } else {
        // Semester doesn't exist, create empty one
        setSemesterData({
          userId,
          semester,
          academicYear: getCurrentAcademicYear(),
          courses: [],
          sgpa: 0
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Create new semester
        setSemesterData({
          userId,
          semester,
          academicYear: getCurrentAcademicYear(),
          courses: [],
          sgpa: 0
        });
      } else {
        setError(err.response?.data?.message || 'Failed to load semester data');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };

  const validateNumber = (value, min = 0, max = 100) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  };

  const handleCourseFieldChange = (courseIndex, field, value) => {
    const updatedCourses = [...semesterData.courses];
    
    // Parse numeric fields to numbers, keep strings as strings
    if (['attendancePercent', 'ia1', 'ia2', 'ia3', 'labMarks', 'otherMarks', 'externalMarks', 'credits'].includes(field)) {
      updatedCourses[courseIndex][field] = parseFloat(value) || 0;
    } else {
      updatedCourses[courseIndex][field] = value;
    }

    // Validate
    const errors = { ...validationErrors };
    const errorKey = `${courseIndex}-${field}`;

    if (field === 'attendancePercent') {
      if (!validateNumber(value, 0, 100)) {
        errors[errorKey] = 'Must be 0-100';
      } else {
        delete errors[errorKey];
      }
    } else if (['ia1', 'ia2', 'ia3', 'labMarks', 'otherMarks', 'externalMarks'].includes(field)) {
      if (!validateNumber(value, 0, 100)) {
        errors[errorKey] = 'Must be 0-100';
      } else {
        delete errors[errorKey];
      }
    } else if (field === 'credits') {
      if (!validateNumber(value, 0, 5)) {
        errors[errorKey] = 'Must be 0-5';
      } else {
        delete errors[errorKey];
      }
    }

    setValidationErrors(errors);

    // Compute derived fields
    const course = updatedCourses[courseIndex];
    const ia1 = parseFloat(course.ia1) || 0;
    const ia2 = parseFloat(course.ia2) || 0;
    const ia3 = parseFloat(course.ia3) || 0;
    const iaScores = [ia1, ia2, ia3].sort((a, b) => b - a);
    const avgIA = (iaScores[0] + iaScores[1]) / 2;

    course.totalInternal = Math.round(
      avgIA * 0.4 +
      (parseFloat(course.labMarks) || 0) * 0.3 +
      (parseFloat(course.otherMarks) || 0) * 0.3
    );

    course.total = course.totalInternal + (parseFloat(course.externalMarks) || 0);

    // Compute grade
    const percentage = (course.total / 200) * 100;
    if (percentage >= 90) {
      course.letterGrade = 'S';
      course.gradePoints = 10;
    } else if (percentage >= 80) {
      course.letterGrade = 'A';
      course.gradePoints = 9;
    } else if (percentage >= 70) {
      course.letterGrade = 'B';
      course.gradePoints = 8;
    } else if (percentage >= 60) {
      course.letterGrade = 'C';
      course.gradePoints = 7;
    } else if (percentage >= 50) {
      course.letterGrade = 'D';
      course.gradePoints = 6;
    } else if (percentage >= 40) {
      course.letterGrade = 'E';
      course.gradePoints = 5;
    } else {
      course.letterGrade = 'F';
      course.gradePoints = 0;
    }

    // Compute SGPA
    let totalCredits = 0;
    let weightedSum = 0;
    updatedCourses.forEach(c => {
      const credits = parseFloat(c.credits) || 0;
      const gp = parseFloat(c.gradePoints) || 0;
      totalCredits += credits;
      weightedSum += gp * credits;
    });
    const sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

    setSemesterData({
      ...semesterData,
      courses: updatedCourses,
      sgpa: parseFloat(sgpa)
    });
  };

  const handleAddCourse = () => {
    const newCourse = {
      slNo: semesterData.courses.length + 1,
      courseCode: '',
      courseName: '',
      attendancePercent: 0,
      ia1: 0,
      ia2: 0,
      ia3: 0,
      labMarks: 0,
      otherMarks: 0,
      totalInternal: 0,
      externalMarks: 0,
      total: 0,
      letterGrade: '',
      gradePoints: 0,
      credits: 0
    };

    setSemesterData({
      ...semesterData,
      courses: [...semesterData.courses, newCourse]
    });
    setEditingCourse(semesterData.courses.length);
  };

  const handleRemoveCourse = async (courseIndex) => {
    try {
      const course = semesterData.courses[courseIndex];
      
      if (course.courseCode) {
        await axios.delete(
          `http://localhost:5002/api/students/${userId}/academics/${semester}/courses/${course.courseCode}`
        );
      }

      const updatedCourses = semesterData.courses.filter((_, idx) => idx !== courseIndex);
      // Renumber slNo
      updatedCourses.forEach((c, idx) => {
        c.slNo = idx + 1;
      });

      setSemesterData({
        ...semesterData,
        courses: updatedCourses
      });
    } catch (err) {
      setError('Failed to remove course');
    }
  };

  const handleSave = async () => {
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Ensure all numeric fields are properly formatted as numbers
      const sanitizedData = {
        ...semesterData,
        courses: semesterData.courses.map(course => ({
          ...course,
          slNo: parseInt(course.slNo) || 0,
          attendancePercent: parseFloat(course.attendancePercent) || 0,
          ia1: parseFloat(course.ia1) || 0,
          ia2: parseFloat(course.ia2) || 0,
          ia3: parseFloat(course.ia3) || 0,
          labMarks: parseFloat(course.labMarks) || 0,
          otherMarks: parseFloat(course.otherMarks) || 0,
          totalInternal: parseFloat(course.totalInternal) || 0,
          externalMarks: parseFloat(course.externalMarks) || 0,
          total: parseFloat(course.total) || 0,
          gradePoints: parseFloat(course.gradePoints) || 0,
          credits: parseFloat(course.credits) || 0
        }))
      };

      console.log('💾 Saving semester data:', JSON.stringify(sanitizedData, null, 2));

      const response = await axios.post(
        `http://localhost:5002/api/students/${userId}/academics/${semester}`,
        sanitizedData
      );

      if (response.data.success) {
        console.log('✅ Save successful:', response.data);
        setSemesterData(response.data.data);
        setEditingCourse(null);
        // Show success message
        alert('Semester data saved successfully!');
      }
    } catch (err) {
      console.error('❌ Save error:', err);
      setError(err.response?.data?.message || 'Failed to save semester data');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      window.open(
        `http://localhost:5002/api/students/${userId}/academics/${semester}/export?format=html`,
        '_blank'
      );
    } catch (err) {
      setError('Failed to export semester');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Semester {semester}
            </Typography>
            <Typography variant="subtitle1">
              Academic Year: {semesterData?.academicYear}
            </Typography>
            <Chip
              label={`SGPA: ${semesterData?.sgpa || 0}`}
              sx={{
                mt: 1,
                bgcolor: 'gold',
                color: '#2c3e50',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handleExport}
              sx={{ mr: 1, bgcolor: 'white', color: '#667eea' }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{ bgcolor: 'gold', color: '#2c3e50' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#3f51b5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sl No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Course Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attendance %</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IA1</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IA2</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IA3</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lab</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Other</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Int.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>External</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>GP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Credits</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {semesterData?.courses.map((course, index) => (
                <motion.tr
                  key={`course-${index}`}
                  component={TableRow}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  sx={{ '&:nth-of-type(even)': { bgcolor: '#f5f5f5' } }}
                >
                  <TableCell>{course.slNo}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={course.courseCode || ''}
                      onChange={(e) => handleCourseFieldChange(index, 'courseCode', e.target.value)}
                      variant="standard"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={course.courseName || ''}
                      onChange={(e) => handleCourseFieldChange(index, 'courseName', e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.attendancePercent || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'attendancePercent', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-attendancePercent`]}
                      sx={{ width: 60 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.ia1 || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'ia1', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-ia1`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.ia2 || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'ia2', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-ia2`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.ia3 || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'ia3', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-ia3`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.labMarks || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'labMarks', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-labMarks`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.otherMarks || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'otherMarks', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-otherMarks`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={course.totalInternal} size="small" color="info" />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.externalMarks || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'externalMarks', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-externalMarks`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={course.total} size="small" color="success" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.letterGrade}
                      size="small"
                      color={course.letterGrade === 'F' ? 'error' : 'primary'}
                    />
                  </TableCell>
                  <TableCell>{course.gradePoints}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={course.credits || 0}
                      onChange={(e) => handleCourseFieldChange(index, 'credits', e.target.value)}
                      variant="standard"
                      error={!!validationErrors[`${index}-credits`]}
                      sx={{ width: 50 }}
                      inputProps={{ min: 0, max: 5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Remove Course">
                      <IconButton size="small" color="error" onClick={() => handleRemoveCourse(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddCourse}
          sx={{ borderColor: '#667eea', color: '#667eea' }}
        >
          Add Course
        </Button>
      </Box>
    </Box>
  );
};

export default SemesterPage;
