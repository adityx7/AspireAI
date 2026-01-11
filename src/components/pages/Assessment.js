import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  LinearProgress,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import axios from 'axios';
import SideBar from '../organisms/SideBar';
import NavDash from '../organisms/NavDash';

const shimmerBackground = {
  minHeight: '100vh',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  background: 'linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: '#F8FAFC',
  paddingBottom: '40px'
};

const Assessment = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [semester, setSemester] = useState(1);
  const [batch, setBatch] = useState('2022');
  const [department, setDepartment] = useState('Computer Science');
  const [selectedTests, setSelectedTests] = useState(['ia1', 'ia2', 'ia3']);
  const [analysisData, setAnalysisData] = useState(null);
  const [importantTopicsData, setImportantTopicsData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('strengths');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIA, setSelectedIA] = useState('ia1');

  const navigate = useNavigate();

  // Get userId from localStorage or context
  const userId = localStorage.getItem('userId') || 'testuser';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (path) => {
    navigate(`/${path}`);
    if (mobileOpen) setMobileOpen(false);
    setSidebarOpen(false);
  };

  const handleTestChange = (test) => {
    setSelectedTests(prev => 
      prev.includes(test) 
        ? prev.filter(t => t !== test)
        : [...prev, test]
    );
  };

  const handleAnalyze = async () => {
    if (selectedTests.length === 0) {
      setError('Please select at least one internal assessment');
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      console.log('🔍 Analyzing assessment data...', { userId, semester, selectedTests, batch, department });
      
      const response = await axios.post('http://localhost:5002/api/assessment/analyze', {
        userId,
        semester,
        selectedTests,
        batch,
        department
      });

      if (response.data.success) {
        setAnalysisData(response.data.data);
        console.log('✅ Analysis completed:', response.data.data);
      } else {
        setError(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('❌ Analysis error:', err);
      
      // Provide more helpful error messages
      if (err.response?.status === 404) {
        setError(`No data found for Semester ${semester}. Please go to "Semester Marks" page, enter your marks, and click "Save" before analyzing.`);
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid request. Please check your inputs.');
      } else {
        setError(err.response?.data?.message || 'Failed to analyze assessment data. Please make sure you have saved your semester marks first.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Fetch important topics for weak areas
  const handleFetchImportantTopics = async () => {
    setFetchingTopics(true);
    setError(null);

    try {
      console.log('📚 Fetching important topics...', { userId, semester, batch, department });

      const response = await axios.post('http://localhost:5002/api/assessment/important-topics', {
        userId,
        semester,
        batch,
        department
      });

      if (response.data.success) {
        setImportantTopicsData(response.data.data);
        console.log('✅ Important topics fetched:', response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch important topics');
      }
    } catch (err) {
      console.error('❌ Error fetching important topics:', err);
      if (err.response?.status === 404) {
        setError(err.response?.data?.message || 'Data not found. Please ensure marks and syllabus are uploaded.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch important topics');
      }
    } finally {
      setFetchingTopics(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getIADescription = (ia) => {
    const descriptions = {
      ia1: 'Module 1 + First half of Module 2',
      ia2: 'Second half of Module 2 + Module 3',
      ia3: 'Module 4 + Module 5'
    };
    return descriptions[ia] || '';
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e57 0%, #1a2332 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <NavDash onDrawerToggle={handleDrawerToggle} title="Assessment Analysis" />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sliding Sidebar */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: "none", sm: "block" },
            '& .MuiDrawer-paper': {
              width: 280,
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
              backdropFilter: "blur(25px)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(184, 134, 11, 0.15)",
              borderLeft: "none",
            }
          }}
        >
          <SideBar onMenuClick={handleMenuClick} />
        </Drawer>

        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: "block", sm: "none" },
            '& .MuiDrawer-paper': {
              width: 280,
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(184, 134, 11, 0.15)",
            }
          }}
        >
          <SideBar onMenuClick={handleMenuClick} />
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          ...shimmerBackground
        }}>
          <Container maxWidth="lg" sx={{ mt: 3 }}>
        
        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.2) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              color: '#F8FAFC',
              '& .MuiAlert-icon': {
                color: '#64B5F6'
              }
            }}
          >
            <Typography variant="body2">
              <strong>Before analyzing:</strong> Make sure you have entered and <strong>saved</strong> your internal marks in the "Internal Marks" page. Click the navigation menu → Internal Marks → Select semester → Enter marks → Click Save.
            </Typography>
          </Alert>
        </motion.div>

        {/* Header */}
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
              <AutoAwesomeIcon sx={{ fontSize: 40, color: '#B8860B' }} />
              AI Assessment Analysis
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
              Analyze your internal assessment performance with AI-powered insights
            </Typography>
          </Box>
        </motion.div>

        {/* Analysis Controls */}
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
              p: 3,
              mb: 3
            }}
          >
            <Typography variant="h5" sx={{ color: '#F8FAFC', mb: 3, fontWeight: 600 }}>
              Configure Analysis
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>Semester</InputLabel>
                  <Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    sx={{
                      color: '#F8FAFC',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.5)'
                      }
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>Batch Entry</InputLabel>
                  <Select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    sx={{
                      color: '#F8FAFC',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.5)'
                      }
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
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>Department</InputLabel>
                  <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    sx={{
                      color: '#F8FAFC',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(184, 134, 11, 0.5)'
                      }
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
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 1 }}>
                  Select Internal Assessments
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTests.includes('ia1')}
                        onChange={() => handleTestChange('ia1')}
                        sx={{ color: '#B8860B' }}
                      />
                    }
                    label={<Typography sx={{ color: '#F8FAFC' }}>IA1</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTests.includes('ia2')}
                        onChange={() => handleTestChange('ia2')}
                        sx={{ color: '#B8860B' }}
                      />
                    }
                    label={<Typography sx={{ color: '#F8FAFC' }}>IA2</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTests.includes('ia3')}
                        onChange={() => handleTestChange('ia3')}
                        sx={{ color: '#B8860B' }}
                      />
                    }
                    label={<Typography sx={{ color: '#F8FAFC' }}>IA3</Typography>}
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={analyzing ? <CircularProgress size={20} sx={{ color: '#0A192F' }} /> : <AutoAwesomeIcon />}
                onClick={handleAnalyze}
                disabled={analyzing || selectedTests.length === 0}
                sx={{
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  color: '#0A192F',
                  fontWeight: 600,
                  px: 4,
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
                {analyzing ? 'Analyzing...' : 'Analyze Performance'}
              </Button>

              <Button
                variant="outlined"
                startIcon={fetchingTopics ? <CircularProgress size={20} sx={{ color: '#B8860B' }} /> : <MenuBookIcon />}
                onClick={handleFetchImportantTopics}
                disabled={fetchingTopics}
                sx={{
                  borderColor: '#B8860B',
                  color: '#B8860B',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#DAA520',
                    background: 'rgba(184, 134, 11, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(184, 134, 11, 0.3)',
                    color: 'rgba(184, 134, 11, 0.5)'
                  }
                }}
              >
                {fetchingTopics ? 'Fetching Topics...' : 'Get Important Topics by IA'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Overall Assessment Card */}
              <Paper
                sx={{
                  background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  p: 3,
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 32, color: '#B8860B', mr: 2 }} />
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                    AI Analysis Results
                  </Typography>
                  <Chip
                    label={`${analysisData.performanceScore}/100`}
                    sx={{
                      ml: 'auto',
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      color: '#0A192F',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.9)', lineHeight: 1.8 }}>
                  {analysisData.overallAssessment}
                </Typography>
              </Paper>

              {/* Performance Charts */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(184, 134, 11, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      p: 3
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                      Performance by Subject
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analysisData.chartData?.performanceBySubject || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 134, 11, 0.2)" />
                        <XAxis dataKey="subject" stroke="#F8FAFC" />
                        <YAxis stroke="#F8FAFC" />
                        <RechartsTooltip
                          contentStyle={{
                            background: 'rgba(26, 43, 76, 0.9)',
                            border: '1px solid rgba(184, 134, 11, 0.3)',
                            borderRadius: '8px',
                            color: '#F8FAFC'
                          }}
                        />
                        <Bar dataKey="score" fill="#B8860B" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(184, 134, 11, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      p: 3
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                      Test Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analysisData.chartData?.testComparison || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(184, 134, 11, 0.2)" />
                        <XAxis dataKey="test" stroke="#F8FAFC" />
                        <YAxis stroke="#F8FAFC" />
                        <RechartsTooltip
                          contentStyle={{
                            background: 'rgba(26, 43, 76, 0.9)',
                            border: '1px solid rgba(184, 134, 11, 0.3)',
                            borderRadius: '8px',
                            color: '#F8FAFC'
                          }}
                        />
                        <Line type="monotone" dataKey="avgScore" stroke="#DAA520" strokeWidth={3} dot={{ fill: '#B8860B', r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>

              {/* Strengths & Weaknesses */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(184, 134, 11, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      p: 3
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }} onClick={() => toggleSection('strengths')}>
                      <TrendingUpIcon sx={{ fontSize: 28, color: '#10B981', mr: 1 }} />
                      <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                        Strengths
                      </Typography>
                      {expandedSection === 'strengths' ? <ExpandLessIcon sx={{ ml: 'auto', color: '#F8FAFC' }} /> : <ExpandMoreIcon sx={{ ml: 'auto', color: '#F8FAFC' }} />}
                    </Box>
                    <Collapse in={expandedSection === 'strengths'}>
                      <List>
                        {analysisData.strengths?.map((strength, index) => (
                          <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon>
                              <CheckCircleIcon sx={{ color: '#10B981' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={<Typography sx={{ color: '#F8FAFC', fontWeight: 600 }}>{strength.subject}</Typography>}
                              secondary={
                                <Typography sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                                  {strength.reason} • Score: {strength.score}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(184, 134, 11, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      p: 3
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }} onClick={() => toggleSection('weaknesses')}>
                      <TrendingDownIcon sx={{ fontSize: 28, color: '#EF4444', mr: 1 }} />
                      <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                        Areas for Improvement
                      </Typography>
                      {expandedSection === 'weaknesses' ? <ExpandLessIcon sx={{ ml: 'auto', color: '#F8FAFC' }} /> : <ExpandMoreIcon sx={{ ml: 'auto', color: '#F8FAFC' }} />}
                    </Box>
                    <Collapse in={expandedSection === 'weaknesses'}>
                      <List>
                        {analysisData.weaknesses?.map((weakness, index) => (
                          <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon>
                              <WarningIcon sx={{ color: '#EF4444' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={<Typography sx={{ color: '#F8FAFC', fontWeight: 600 }}>{weakness.subject}</Typography>}
                              secondary={
                                <Typography sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                                  {weakness.issue} • Score: {weakness.score}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Paper>
                </Grid>
              </Grid>

              {/* Recommendations */}
              <Paper
                sx={{
                  background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  p: 3,
                  mb: 3
                }}
              >
                <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                  📋 Personalized Recommendations
                </Typography>
                <Grid container spacing={2}>
                  {analysisData.recommendations?.map((rec, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          background: 'rgba(184, 134, 11, 0.1)',
                          border: `1px solid ${getPriorityColor(rec.priority)}`,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Chip
                          label={rec.priority.toUpperCase()}
                          size="small"
                          sx={{
                            background: getPriorityColor(rec.priority),
                            color: '#FFF',
                            fontWeight: 600
                          }}
                        />
                        <Box>
                          <Typography sx={{ color: '#F8FAFC', fontWeight: 600 }}>{rec.subject}</Typography>
                          <Typography sx={{ color: 'rgba(248, 250, 252, 0.8)' }}>{rec.action}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Priority Actions */}
              <Paper
                sx={{
                  background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  p: 3,
                  mb: 3
                }}
              >
                <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                  🎯 Top Priority Actions
                </Typography>
                <List>
                  {analysisData.priorityActions?.map((action, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Chip label={index + 1} sx={{ background: '#B8860B', color: '#0A192F', fontWeight: 700 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: '#F8FAFC' }}>{action}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Trend Analysis */}
              {analysisData.trendAnalysis && (
                <Paper
                  sx={{
                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    p: 3,
                    mb: 3
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                    📈 Trend Analysis
                  </Typography>
                  <Typography sx={{ color: 'rgba(248, 250, 252, 0.9)', lineHeight: 1.8 }}>
                    {analysisData.trendAnalysis}
                  </Typography>
                </Paper>
              )}

              {/* Topic-Specific Analysis from Groq */}
              {analysisData.topicAnalysis && !analysisData.topicAnalysis.error && (
                <>
                  {/* Course-wise Topic Analysis */}
                  {analysisData.topicAnalysis.courseAnalysis && analysisData.topicAnalysis.courseAnalysis.length > 0 && (
                    <Paper
                      sx={{
                        background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(184, 134, 11, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        p: 3,
                        mb: 3
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 32, color: '#B8860B', mr: 2 }} />
                        <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                          📚 Topic-Specific Analysis (Groq AI)
                        </Typography>
                      </Box>

                      <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.9)', mb: 3, lineHeight: 1.8 }}>
                        {analysisData.topicAnalysis.overallAnalysis}
                      </Typography>

                      <Divider sx={{ borderColor: 'rgba(184, 134, 11, 0.2)', my: 3 }} />

                      {/* Course-wise breakdown */}
                      {analysisData.topicAnalysis.courseAnalysis.map((course, index) => (
                        <Box key={index} sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ color: '#B8860B', mb: 2, fontWeight: 600 }}>
                            {course.courseName} ({course.courseCode})
                          </Typography>
                          
                          <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)', mb: 2 }}>
                            {course.performanceSummary}
                          </Typography>

                          {course.weakIAs && course.weakIAs.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                                Weak Performance In: {course.weakIAs.map(ia => ia.toUpperCase()).join(', ')}
                              </Typography>
                            </Box>
                          )}

                          {/* Topics to focus */}
                          {course.topicsToFocus && course.topicsToFocus.length > 0 && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              {course.topicsToFocus.map((topic, topicIndex) => (
                                <Grid item xs={12} md={6} key={topicIndex}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      background: 'rgba(184, 134, 11, 0.1)',
                                      border: `1px solid ${getPriorityColor(topic.priority)}`,
                                      borderRadius: 2
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Chip
                                        label={`Module ${topic.module}`}
                                        size="small"
                                        sx={{ background: '#B8860B', color: '#0A192F', fontWeight: 600 }}
                                      />
                                      <Chip
                                        label={topic.priority.toUpperCase()}
                                        size="small"
                                        sx={{ background: getPriorityColor(topic.priority), color: '#FFF', fontWeight: 600 }}
                                      />
                                    </Box>
                                    <Typography sx={{ color: '#F8FAFC', fontWeight: 600, mb: 1 }}>
                                      {topic.topic}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 1 }}>
                                      {topic.studyTips}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <TimelineIcon sx={{ fontSize: 16, color: '#B8860B' }} />
                                      <Typography variant="caption" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                                        Estimated: {topic.estimatedHours}h
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        </Box>
                      ))}
                    </Paper>
                  )}

                  {/* Weekly Study Plan */}
                  {analysisData.topicAnalysis.weeklyStudyPlan && (
                    <Paper
                      sx={{
                        background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(184, 134, 11, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        p: 3,
                        mb: 3
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                        📅 Weekly Study Plan
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 3 }}>
                        Total Hours Needed: {analysisData.topicAnalysis.weeklyStudyPlan.totalHoursNeeded}h
                      </Typography>

                      {analysisData.topicAnalysis.weeklyStudyPlan.dailySchedule?.map((day, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ color: '#B8860B', fontWeight: 600, mb: 1 }}>
                            {day.day}
                          </Typography>
                          <List dense>
                            {day.tasks?.map((task, taskIndex) => (
                              <ListItem key={taskIndex} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ color: '#F8FAFC' }}>
                                      {task.course}: {task.topic}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                                      {task.duration}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Paper>
                  )}

                  {/* Motivational Message */}
                  {analysisData.topicAnalysis.motivationalMessage && (
                    <Paper
                      sx={{
                        background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.2), rgba(218, 165, 32, 0.1))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(184, 134, 11, 0.3)',
                        boxShadow: '0 8px 32px rgba(184, 134, 11, 0.2)',
                        p: 3,
                        mb: 3,
                        textAlign: 'center'
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 48, color: '#B8860B', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#F8FAFC', fontStyle: 'italic', lineHeight: 1.8 }}>
                        "{analysisData.topicAnalysis.motivationalMessage}"
                      </Typography>
                    </Paper>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Important Topics by IA Section */}
        <AnimatePresence>
          {importantTopicsData && importantTopicsData.iaTopics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  p: 3,
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <MenuBookIcon sx={{ fontSize: 32, color: '#B8860B', mr: 2 }} />
                  <Typography variant="h5" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                    📖 Important Topics by Internal Assessment
                  </Typography>
                </Box>

                {importantTopicsData.overallRecommendation && (
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      background: 'rgba(33, 150, 243, 0.1)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      color: '#F8FAFC'
                    }}
                  >
                    <Typography variant="body2">{importantTopicsData.overallRecommendation}</Typography>
                  </Alert>
                )}

                {/* IA Tabs */}
                <Tabs
                  value={selectedIA}
                  onChange={(e, newValue) => setSelectedIA(newValue)}
                  sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                      color: 'rgba(248, 250, 252, 0.7)',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        color: '#B8860B'
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#B8860B'
                    }
                  }}
                >
                  <Tab value="ia1" label="IA1 (Modules 1-1.5)" />
                  <Tab value="ia2" label="IA2 (Modules 2-3)" />
                  <Tab value="ia3" label="IA3 (Modules 4-5)" />
                </Tabs>

                {/* Selected IA Content */}
                {importantTopicsData.iaTopics[selectedIA] && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 3 }}>
                      📌 Coverage: {importantTopicsData.iaTopics[selectedIA].description || getIADescription(selectedIA)}
                    </Typography>

                    {importantTopicsData.iaTopics[selectedIA].courses?.map((course, courseIndex) => (
                      <Accordion
                        key={courseIndex}
                        sx={{
                          background: 'rgba(184, 134, 11, 0.1)',
                          border: '1px solid rgba(184, 134, 11, 0.2)',
                          mb: 2,
                          '&:before': { display: 'none' }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: '#B8860B' }} />}
                          sx={{ py: 1 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <SchoolIcon sx={{ color: '#B8860B' }} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                                {course.courseName} ({course.courseCode})
                              </Typography>
                              {course.studentScore !== null && course.studentScore !== undefined && (
                                <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                                  Your Score: {course.studentScore}/15
                                </Typography>
                              )}
                            </Box>
                            {course.isWeak && (
                              <Chip
                                label="Needs Focus"
                                size="small"
                                sx={{
                                  background: '#EF4444',
                                  color: '#FFF',
                                  fontWeight: 600
                                }}
                              />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Important Topics */}
                          {course.importantTopics && course.importantTopics.length > 0 ? (
                            <Grid container spacing={2}>
                              {course.importantTopics.map((topic, topicIndex) => (
                                <Grid item xs={12} md={6} key={topicIndex}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      background: 'rgba(10, 25, 47, 0.6)',
                                      border: `1px solid ${getImportanceColor(topic.importance)}`,
                                      borderRadius: 2,
                                      height: '100%'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Chip
                                        label={`Module ${topic.module}`}
                                        size="small"
                                        sx={{ background: '#B8860B', color: '#0A192F', fontWeight: 600 }}
                                      />
                                      <Chip
                                        icon={<PriorityHighIcon sx={{ fontSize: 14 }} />}
                                        label={topic.importance?.toUpperCase()}
                                        size="small"
                                        sx={{
                                          background: getImportanceColor(topic.importance),
                                          color: '#FFF',
                                          fontWeight: 600
                                        }}
                                      />
                                    </Box>
                                    
                                    <Typography sx={{ color: '#F8FAFC', fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                                      {topic.topic}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 2 }}>
                                      {topic.reason}
                                    </Typography>

                                    {/* Key Concepts */}
                                    {topic.keyConceptsToMaster && topic.keyConceptsToMaster.length > 0 && (
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#B8860B', fontWeight: 600 }}>
                                          Key Concepts to Master:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                          {topic.keyConceptsToMaster.map((concept, i) => (
                                            <Chip
                                              key={i}
                                              label={concept}
                                              size="small"
                                              sx={{
                                                background: 'rgba(184, 134, 11, 0.2)',
                                                color: '#F8FAFC',
                                                fontSize: '0.7rem'
                                              }}
                                            />
                                          ))}
                                        </Box>
                                      </Box>
                                    )}

                                    {/* Common Mistakes */}
                                    {topic.commonMistakes && (
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>
                                          ⚠️ Common Mistakes:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)', fontSize: '0.8rem' }}>
                                          {topic.commonMistakes}
                                        </Typography>
                                      </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                                      <AccessTimeIcon sx={{ fontSize: 16, color: '#B8860B' }} />
                                      <Typography variant="caption" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                                        Estimated Study Time: {topic.estimatedStudyHours}h
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography sx={{ color: 'rgba(248, 250, 252, 0.6)', textAlign: 'center', py: 2 }}>
                              No specific topics identified for this course
                            </Typography>
                          )}

                          {/* Quick Revision Points */}
                          {course.quickRevisionPoints && course.quickRevisionPoints.length > 0 && (
                            <Box sx={{ mt: 3, p: 2, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 2 }}>
                              <Typography variant="subtitle2" sx={{ color: '#10B981', fontWeight: 600, mb: 1 }}>
                                ⚡ Quick Revision Points
                              </Typography>
                              <List dense>
                                {course.quickRevisionPoints.map((point, i) => (
                                  <ListItem key={i} sx={{ py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <LightbulbIcon sx={{ fontSize: 18, color: '#10B981' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2" sx={{ color: '#F8FAFC' }}>
                                          {point}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}

                {/* Priority Subjects */}
                {importantTopicsData.prioritySubjects && importantTopicsData.prioritySubjects.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ borderColor: 'rgba(184, 134, 11, 0.2)', mb: 3 }} />
                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 600 }}>
                      🎯 Priority Subjects for Immediate Focus
                    </Typography>
                    <Grid container spacing={2}>
                      {importantTopicsData.prioritySubjects.map((subject, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: `1px solid ${getImportanceColor(subject.urgency)}`,
                              borderRadius: 2
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip
                                label={subject.urgency?.toUpperCase()}
                                size="small"
                                sx={{
                                  background: getImportanceColor(subject.urgency),
                                  color: '#FFF',
                                  fontWeight: 600
                                }}
                              />
                              <Chip
                                label={subject.focusIA?.toUpperCase()}
                                size="small"
                                sx={{
                                  background: '#B8860B',
                                  color: '#0A192F',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography sx={{ color: '#F8FAFC', fontWeight: 600, mb: 1 }}>
                              {subject.courseName} ({subject.courseCode})
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                              {subject.actionPlan}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coming Soon Section - only show if no analysis yet */}
        {!analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AutoAwesomeIcon sx={{ fontSize: 80, color: '#B8860B', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 700 }}>
                  AI-Powered Assessment Analysis
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.7)', mb: 3 }}>
                  Get instant insights on your academic performance with our AI assistant
                </Typography>
                
                <Divider sx={{ borderColor: 'rgba(184, 134, 11, 0.2)', my: 3 }} />
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'left', p: 2 }}>
                      <Typography variant="h6" sx={{ color: '#B8860B', mb: 1 }}>🤖 AI Analysis</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                        Powered by Google Gemini to analyze your internal assessment performance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'left', p: 2 }}>
                      <Typography variant="h6" sx={{ color: '#B8860B', mb: 1 }}>📊 Visual Insights</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                        Interactive charts showing performance trends and subject-wise breakdown
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'left', p: 2 }}>
                      <Typography variant="h6" sx={{ color: '#B8860B', mb: 1 }}>🎯 Personalized Tips</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                        Get actionable recommendations tailored to your specific needs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'left', p: 2 }}>
                      <Typography variant="h6" sx={{ color: '#B8860B', mb: 1 }}>📈 Track Progress</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.6)' }}>
                        Monitor improvements across multiple assessments and semesters
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body2" sx={{ mt: 4, color: 'rgba(248, 250, 252, 0.5)', fontStyle: 'italic' }}>
                  Select a semester and internal assessments above, then click "Analyze Performance" to get started!
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Assessment;
