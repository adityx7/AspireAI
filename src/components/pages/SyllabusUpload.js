import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const shimmerBackground = {
  minHeight: '100vh',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  background: 'linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: '#F8FAFC',
  paddingTop: '80px',
  paddingBottom: '40px'
};

const SyllabusUpload = () => {
  const [formData, setFormData] = useState({
    batch: '2022',
    department: 'Computer Science'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadData = new FormData();
      uploadData.append('syllabus', selectedFile);
      uploadData.append('batch', formData.batch);
      uploadData.append('department', formData.department);

      const response = await axios.post('http://localhost:5002/api/syllabus/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(`Syllabus uploaded successfully! Found ${response.data.data.modulesFound} modules.`);
        setSelectedFile(null);
        // Keep batch and department
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload syllabus');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={shimmerBackground}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#F8FAFC',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: '#B8860B' }} />
              Upload Syllabus
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
              Upload course syllabus PDFs to enable AI-powered topic analysis
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            sx={{
              background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              p: 4,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                  Batch Entry
                </InputLabel>
                <Select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  sx={{
                    color: '#F8FAFC',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(184, 134, 11, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(184, 134, 11, 0.5)' }
                  }}
                >
                  <MenuItem value="2020">2020</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                  Department
                </InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  sx={{
                    color: '#F8FAFC',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(184, 134, 11, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(184, 134, 11, 0.5)' }
                  }}
                >
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Information Science">Information Science</MenuItem>
                  <MenuItem value="AIML">AIML</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Mechanical">Mechanical</MenuItem>
                  <MenuItem value="Civil">Civil</MenuItem>
                </Select>
              </FormControl>

              {/* File Upload */}
              <Box>
                <input
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="syllabus-file-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="syllabus-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderColor: '#B8860B',
                      color: '#B8860B',
                      '&:hover': {
                        borderColor: '#DAA520',
                        background: 'rgba(184, 134, 11, 0.1)'
                      }
                    }}
                  >
                    Choose PDF File
                  </Button>
                </label>

                {selectedFile && (
                  <Card
                    sx={{
                      mt: 2,
                      background: 'rgba(184, 134, 11, 0.1)',
                      border: '1px solid rgba(184, 134, 11, 0.3)'
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                        <Typography sx={{ color: '#F8FAFC' }}>{selectedFile.name}</Typography>
                        <Chip
                          label={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                          size="small"
                          sx={{ background: '#B8860B', color: '#0A192F' }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedFile(null)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                startIcon={uploading ? <CircularProgress size={20} sx={{ color: '#0A192F' }} /> : <CloudUploadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  color: '#0A192F',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #DAA520, #B8860B)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(184, 134, 11, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(184, 134, 11, 0.3)',
                    color: 'rgba(10, 25, 47, 0.5)'
                  }
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Syllabus'}
              </Button>
            </Box>
          </Paper>

          {/* Instructions */}
          <Paper
            sx={{
              background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              p: 3
            }}
          >
            <Typography variant="h6" sx={{ color: '#B8860B', mb: 2, fontWeight: 600 }}>
              📝 Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)', mb: 1 }}>
              • Select your <strong>Batch Entry Year</strong> (year you joined college)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)', mb: 1 }}>
              • Select your <strong>Department</strong> (Computer Science, AIML, etc.)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)', mb: 1 }}>
              • Upload syllabus PDF (system will auto-extract course info and modules)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)' }}>
              • IA1 covers Modules 1-1.5, IA2 covers Modules 2.5-4, IA3 covers Modules 4-5
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SyllabusUpload;
