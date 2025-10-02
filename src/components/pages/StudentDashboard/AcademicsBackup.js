import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    Tabs,
    Tab,
    Alert,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    EmojiEvents as TrophyIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC",
    // Enhanced animation styles
    '& .fade-in-up': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(60px)'
      }
    },
    '& .scale-in': {
      opacity: 1,
      transform: 'scale(1) rotateZ(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0.3,
        transform: 'scale(0.7) rotateZ(-5deg)'
      }
    },
    '& .floating-element': {
      animation: 'floating 6s ease-in-out infinite',
      transition: 'transform 0.3s ease-out'
    },
    '@keyframes floating': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '25%': { transform: 'translateY(-10px) rotate(1deg)' },
      '50%': { transform: 'translateY(-20px) rotate(0deg)' },
      '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' }
    }
};

const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(184, 134, 11, 0.1) 0%, rgba(26, 43, 76, 0.2) 100%)",
    animation: "shimmer 3s infinite linear",
    zIndex: 0,
    pointerEvents: "none",
};

const Academics = () => {
    const [academicData, setAcademicData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [openSemesterDialog, setOpenSemesterDialog] = useState(false);
    const [openReflectionDialog, setOpenReflectionDialog] = useState(false);
    const [newSemesterData, setNewSemesterData] = useState({
        semesterNumber: '',
        cgpa: '',
        semesterCourses: []
    });
    const [reflectionData, setReflectionData] = useState({
        whatDidWell: '',
        whatToImprove: '',
        goals: '',
        challenges: ''
    });

    // Get USN from localStorage or context (adjust based on your auth system)
    const usn = localStorage.getItem('usn') || 'defaultUSN'; // Replace with actual auth logic

    useEffect(() => {
        fetchAcademicData();
        // Trigger animations on page load
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.fade-in-up, .scale-in');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 150);
            });
        }, 300);
    }, []);

    const fetchAcademicData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5002/api/academics/dashboard/${usn}`);
            const result = await response.json();
            
            if (result.success) {
                setAcademicData(result.data);
            } else {
                setError(result.message || 'Failed to fetch academic data');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSemester = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/academics/semester', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usn,
                    ...newSemesterData
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                await fetchAcademicData(); // Refresh data
                setOpenSemesterDialog(false);
                setNewSemesterData({ semesterNumber: '', cgpa: '', semesterCourses: [] });
                setError('');
            } else {
                setError(result.message || 'Failed to add semester data');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Mock data for charts (replace with real data processing)
    const performanceData = academicData?.academics?.semesters?.map(sem => ({
        semester: `Sem ${sem.semesterNumber}`,
        cgpa: sem.cgpa || 0
    })) || [];

    const attendanceData = academicData?.attendance?.map(att => ({
        subject: att.subjectName,
        percentage: att.attendancePercentage || 0
    })) || [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <Box sx={shimmerBackground}>
                <Box sx={{ ...shimmerOverlay }} />
                <Container maxWidth="lg" sx={{ 
                    mt: 4, 
                    mb: 4, 
                    position: "relative", 
                    zIndex: 2,
                    minHeight: "100vh"
                }}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <Typography sx={{ 
                            color: "#F8FAFC",
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: "1.2rem"
                        }}>
                            Loading academic data...
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={shimmerBackground}>
            {/* Animated Background Elements */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '120%',
                background: 'radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 43, 76, 0.2) 0%, transparent 50%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            
            {/* Floating Decorative Elements */}
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '15%',
                left: '3%',
                width: '50px',
                height: '50px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '70%',
                right: '5%',
                width: '35px',
                height: '35px',
                background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)',
                animationDelay: '3s'
            }} />

            <Box sx={{ ...shimmerOverlay }} />

            <Container maxWidth="lg" sx={{ 
                mt: 4, 
                mb: 4, 
                position: "relative", 
                zIndex: 2,
                minHeight: "100vh"
            }}>
                {/* Header */}
                <Paper 
                    elevation={3} 
                    className="scale-in"
                    sx={{ 
                        p: 4, 
                        mb: 3,
                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                        backdropFilter: "blur(25px)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                        border: "1px solid rgba(184, 134, 11, 0.15)",
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.6s ease",
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
                            transition: 'left 1.2s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
                            '&::before': {
                                left: '100%'
                            }
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                gutterBottom
                                sx={{
                                    background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontWeight: 700,
                                    filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                                    fontSize: { xs: "1.8rem", md: "2.2rem" }
                                }}
                            >
                                📊 Academic Dashboard
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    color: "#F8FAFC", 
                                    opacity: 0.8,
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                                }}
                            >
                                Welcome, {academicData?.studentInfo?.name} ({academicData?.studentInfo?.usn})
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenSemesterDialog(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                color: 'white',
                                py: 1.5,
                                px: 3,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                transition: 'all 0.3s ease',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                                }
                            }}
                        >
                            Add Semester Data
                        </Button>
                    </Box>
                </Paper>

                {error && (
                    <Alert 
                        severity="error" 
                        className="fade-in-up"
                        sx={{ 
                            mb: 3,
                            background: "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(198, 40, 40, 0.15) 100%)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(211, 47, 47, 0.2)",
                            borderRadius: 2,
                            color: "#ffcdd2"
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            className="fade-in-up"
                            sx={{
                                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.8) 0%, rgba(10, 25, 47, 0.85) 100%)",
                                backdropFilter: "blur(20px)",
                                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                                border: "1px solid rgba(184, 134, 11, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s ease",
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <SchoolIcon sx={{ 
                                        mr: 2, 
                                        fontSize: 40, 
                                        color: '#B8860B',
                                        filter: "drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))"
                                    }} />
                                    <Box>
                                        <Typography 
                                            sx={{ 
                                                color: "#F8FAFC", 
                                                opacity: 0.8,
                                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                                            }} 
                                            gutterBottom
                                        >
                                            Overall CGPA
                                        </Typography>
                                        <Typography 
                                            variant="h5"
                                            sx={{
                                                background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontWeight: 700,
                                                filter: "drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))"
                                            }}
                                        >
                                            {academicData?.academics?.overallCGPA?.toFixed(2) || '0.00'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            className="fade-in-up"
                            sx={{
                                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.8) 0%, rgba(10, 25, 47, 0.85) 100%)",
                                backdropFilter: "blur(20px)",
                                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                                border: "1px solid rgba(184, 134, 11, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s ease",
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <AssignmentIcon sx={{ 
                                        mr: 2, 
                                        fontSize: 40, 
                                        color: '#00C49F',
                                        filter: "drop-shadow(0 2px 4px rgba(0, 196, 159, 0.3))"
                                    }} />
                                    <Box>
                                        <Typography 
                                            sx={{ 
                                                color: "#F8FAFC", 
                                                opacity: 0.8,
                                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                                            }} 
                                            gutterBottom
                                        >
                                            Total Credits
                                        </Typography>
                                        <Typography 
                                            variant="h5"
                                            sx={{
                                                background: "linear-gradient(135deg, #00C49F 0%, #4CAF50 100%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontWeight: 700,
                                                filter: "drop-shadow(0 2px 4px rgba(0, 196, 159, 0.3))"
                                            }}
                                        >
                                            {academicData?.academics?.totalCredits || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            className="fade-in-up"
                            sx={{
                                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.8) 0%, rgba(10, 25, 47, 0.85) 100%)",
                                backdropFilter: "blur(20px)",
                                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                                border: "1px solid rgba(184, 134, 11, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s ease",
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <TrophyIcon sx={{ 
                                        mr: 2, 
                                        fontSize: 40, 
                                        color: '#FF8042',
                                        filter: "drop-shadow(0 2px 4px rgba(255, 128, 66, 0.3))"
                                    }} />
                                    <Box>
                                        <Typography 
                                            sx={{ 
                                                color: "#F8FAFC", 
                                                opacity: 0.8,
                                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                                            }} 
                                            gutterBottom
                                        >
                                            Certifications
                                        </Typography>
                                        <Typography 
                                            variant="h5"
                                            sx={{
                                                background: "linear-gradient(135deg, #FF8042 0%, #FF6B35 100%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontWeight: 700,
                                                filter: "drop-shadow(0 2px 4px rgba(255, 128, 66, 0.3))"
                                            }}
                                        >
                                            {academicData?.certifications?.length || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card 
                            className="fade-in-up"
                            sx={{
                                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.8) 0%, rgba(10, 25, 47, 0.85) 100%)",
                                backdropFilter: "blur(20px)",
                                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                                border: "1px solid rgba(184, 134, 11, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s ease",
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <TrendingUpIcon sx={{ 
                                        mr: 2, 
                                        fontSize: 40, 
                                        color: '#8884d8',
                                        filter: "drop-shadow(0 2px 4px rgba(136, 132, 216, 0.3))"
                                    }} />
                                    <Box>
                                        <Typography 
                                            sx={{ 
                                                color: "#F8FAFC", 
                                                opacity: 0.8,
                                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                                            }} 
                                            gutterBottom
                                        >
                                            Activity Points
                                        </Typography>
                                        <Typography 
                                            variant="h5"
                                            sx={{
                                                background: "linear-gradient(135deg, #8884d8 0%, #9C88FF 100%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontWeight: 700,
                                                filter: "drop-shadow(0 2px 4px rgba(136, 132, 216, 0.3))"
                                            }}
                                        >
                                            {academicData?.activityPoints || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Credits
                                    </Typography>
                                    <Typography variant="h5">
                                        {academicData?.academics?.totalCredits || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TrophyIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Certifications
                                    </Typography>
                                    <Typography variant="h5">
                                        {academicData?.certifications?.length || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TrendingUpIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Activity Points
                                    </Typography>
                                    <Typography variant="h5">
                                        {academicData?.aictActivityPoints?.currentPoints || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs for different sections */}
            <Paper elevation={3}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="📈 Performance Analytics" />
                    <Tab label="📋 Semester Records" />
                    <Tab label="📊 Attendance Tracker" />
                    <Tab label="🏆 Certifications" />
                    <Tab label="🎯 Reflection Journal" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Performance Analytics Tab */}
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Typography variant="h6" gutterBottom>
                                    CGPA Trend Across Semesters
                                </Typography>
                                <Box height={300}>
                                    {performanceData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={performanceData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="semester" />
                                                <YAxis domain={[0, 10]} />
                                                <Tooltip />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="cgpa" 
                                                    stroke="#8884d8" 
                                                    strokeWidth={3}
                                                    dot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <Typography color="text.secondary">
                                                No performance data available. Add semester data to see analytics.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} lg={4}>
                                <Typography variant="h6" gutterBottom>
                                    CGPA Calculator
                                </Typography>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Current Performance Summary
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography>Current CGPA:</Typography>
                                            <Typography fontWeight="bold">
                                                {academicData?.academics?.overallCGPA?.toFixed(2) || '0.00'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography>Semesters Completed:</Typography>
                                            <Typography>
                                                {academicData?.academics?.semesters?.length || 0}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography>Total Credits:</Typography>
                                            <Typography>
                                                {academicData?.academics?.totalCredits || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Semester Records Tab */}
                    {tabValue === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Semester-wise Academic Records
                            </Typography>
                            {academicData?.academics?.semesters?.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Semester</strong></TableCell>
                                                <TableCell><strong>CGPA</strong></TableCell>
                                                <TableCell><strong>Courses</strong></TableCell>
                                                <TableCell><strong>Total Credits</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {academicData.academics.semesters.map((semester, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Chip 
                                                            label={`Semester ${semester.semesterNumber}`} 
                                                            color="primary" 
                                                            variant="outlined" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6" color="primary">
                                                            {semester.cgpa || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {semester.semesterCourses?.length || 0} courses
                                                    </TableCell>
                                                    <TableCell>
                                                        {semester.semesterCourses?.reduce((total, course) => total + (course.credits || 0), 0) || 0}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary">
                                        No semester data available. Click "Add Semester Data" to get started.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Attendance Tracker Tab */}
                    {tabValue === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Attendance Overview
                            </Typography>
                            {attendanceData.length > 0 ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={attendanceData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="subject" />
                                                <YAxis domain={[0, 100]} />
                                                <Tooltip />
                                                <Bar dataKey="percentage" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {attendanceData.map((item, index) => (
                                            <Box key={index} mb={2}>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2">{item.subject}</Typography>
                                                    <Typography variant="body2">{item.percentage}%</Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={item.percentage} 
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary">
                                        No attendance data available.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Certifications Tab */}
                    {tabValue === 3 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Professional Certifications
                            </Typography>
                            {academicData?.certifications?.length > 0 ? (
                                <Grid container spacing={3}>
                                    {academicData.certifications.map((cert, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        {cert.name}
                                                    </Typography>
                                                    <Typography color="text.secondary" gutterBottom>
                                                        Issued by: {cert.issuer}
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        Date: {new Date(cert.date).toLocaleDateString()}
                                                    </Typography>
                                                    <Box mt={2}>
                                                        {cert.domainTags?.map((tag, tagIndex) => (
                                                            <Chip 
                                                                key={tagIndex} 
                                                                label={tag} 
                                                                size="small" 
                                                                sx={{ mr: 1, mb: 1 }} 
                                                            />
                                                        ))}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <Typography color="text.secondary">
                                        No certifications added yet.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Reflection Journal Tab */}
                    {tabValue === 4 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Post-Semester Reflection
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{ p: 2, height: '300px' }}>
                                        <Typography variant="subtitle1" color="primary" gutterBottom>
                                            🎯 What did you do well this semester?
                                        </Typography>
                                        <TextField
                                            multiline
                                            rows={8}
                                            fullWidth
                                            placeholder="Reflect on your achievements, strengths, and positive experiences..."
                                            variant="outlined"
                                            value={reflectionData.whatDidWell}
                                            onChange={(e) => setReflectionData({...reflectionData, whatDidWell: e.target.value})}
                                        />
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{ p: 2, height: '300px' }}>
                                        <Typography variant="subtitle1" color="error" gutterBottom>
                                            🔧 What would you improve next time?
                                        </Typography>
                                        <TextField
                                            multiline
                                            rows={8}
                                            fullWidth
                                            placeholder="Identify areas for improvement, challenges faced, and lessons learned..."
                                            variant="outlined"
                                            value={reflectionData.whatToImprove}
                                            onChange={(e) => setReflectionData({...reflectionData, whatToImprove: e.target.value})}
                                        />
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Button
                                            variant="contained"
                                            onClick={() => setOpenReflectionDialog(true)}
                                            startIcon={<CalendarIcon />}
                                        >
                                            Save Reflection
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Add Semester Dialog */}
            <Dialog open={openSemesterDialog} onClose={() => setOpenSemesterDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Semester Academic Data</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Semester Number"
                                    type="number"
                                    fullWidth
                                    value={newSemesterData.semesterNumber}
                                    onChange={(e) => setNewSemesterData({
                                        ...newSemesterData,
                                        semesterNumber: parseInt(e.target.value)
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CGPA"
                                    type="number"
                                    inputProps={{ min: 0, max: 10, step: 0.01 }}
                                    fullWidth
                                    value={newSemesterData.cgpa}
                                    onChange={(e) => setNewSemesterData({
                                        ...newSemesterData,
                                        cgpa: parseFloat(e.target.value)
                                    })}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Course details can be added later through individual course management.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSemesterDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddSemester}>Add Semester</Button>
                </DialogActions>
            </Dialog>
        </Container>
        </Box>
    );
};

export default Academics;