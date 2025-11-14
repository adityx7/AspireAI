import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Container,
    Grid,
    LinearProgress,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC",
    '& .fade-in-up': {
      animation: 'fadeInUp 0.8s ease-out forwards',
    },
    '& .scale-in': {
      animation: 'scaleIn 0.8s ease-out forwards',
      animationDelay: '0.2s',
    },
    '@keyframes fadeInUp': {
      'from': {
        opacity: 0,
        transform: 'translateY(40px)'
      },
      'to': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    '@keyframes scaleIn': {
      'from': {
        opacity: 0,
        transform: 'scale(0.9)'
      },
      'to': {
        opacity: 1,
        transform: 'scale(1)'
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
    const [success, setSuccess] = useState('');
    const [openSemesterDialog, setOpenSemesterDialog] = useState(false);
    
    // Loading states for individual operations
    const [creditsLoading, setCreditsLoading] = useState(false);
    const [certificationsLoading, setCertificationsLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const [newSemesterData, setNewSemesterData] = useState({
        semesterNumber: '',
        cgpa: '',
        semesterCourses: []
    });

    // New state for edit dialogs
    const [openCreditsDialog, setOpenCreditsDialog] = useState(false);
    const [openCertificationsDialog, setOpenCertificationsDialog] = useState(false);
    const [openActivityPointsDialog, setOpenActivityPointsDialog] = useState(false);
    
    // State for edit forms
    const [creditsData, setCreditsData] = useState({ credits: '' });
    const [certificationData, setCertificationData] = useState({ 
        name: '', 
        issuer: '', 
        date: '', 
        description: '' 
    });
    const [activityData, setActivityData] = useState({ 
        activity: '', 
        points: '', 
        description: '' 
    });

    const usn = localStorage.getItem('userUSN') || localStorage.getItem('usn') || '1BG21CS001';

    const fetchAcademicData = useCallback(async () => {
        try {
            console.log('🔄 Fetching academic data for USN:', usn);
            setLoading(true);
            const response = await fetch(`http://localhost:5002/api/academics/dashboard/${usn}`);
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📊 Academic data received:', result);
            console.log('✅ Setting academic data state...');
            
            if (result.success) {
                setAcademicData(result.data);
                console.log('📈 Academic data state updated!');
                setError('');
            } else {
                setError(result.message || 'Failed to fetch academic data');
            }
        } catch (err) {
            console.error('❌ Error fetching academic data:', err);
            setError('Network error: ' + err.message);
        } finally {
            console.log('🏁 Fetch complete, setting loading to false');
            setLoading(false);
        }
    }, [usn]);

    useEffect(() => {
        fetchAcademicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Pre-populate forms when dialogs open
    useEffect(() => {
        if (openCreditsDialog && academicData?.academics?.totalCredits) {
            setCreditsData({ credits: academicData.academics.totalCredits.toString() });
        }
    }, [openCreditsDialog, academicData]);

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
                await fetchAcademicData();
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

    // Handler functions for editing credits, certifications, and activity points
    const handleUpdateCredits = async () => {
        setCreditsLoading(true);
        console.log('🔄 Updating credits for USN:', usn, 'Credits:', creditsData.credits);
        
        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(`http://localhost:5002/api/academics/credits`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usn,
                    credits: parseInt(creditsData.credits)
                }),
            });

            console.log('📊 Credits response status:', response.status);
            const result = await response.json();
            console.log('📊 Credits response data:', result);
            
            if (result.success) {
                await fetchAcademicData();
                setOpenCreditsDialog(false);
                setCreditsData({ credits: '' });
                setSuccess('Credits updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.message || 'Failed to update credits');
            }
        } catch (err) {
            console.error('❌ Error updating credits:', err);
            setError('Network error: ' + err.message);
        } finally {
            setCreditsLoading(false);
        }
    };

    const handleAddCertification = async () => {
        setCertificationsLoading(true);
        console.log('🔄 Adding certification for USN:', usn, 'Data:', certificationData);
        
        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(`http://localhost:5002/api/academics/certification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usn,
                    name: certificationData.name,
                    issuer: certificationData.issuer,
                    date: certificationData.date,
                    description: certificationData.description
                }),
            });

            console.log('📊 Certification response status:', response.status);
            const result = await response.json();
            console.log('📊 Certification response data:', result);
            
            if (result.success) {
                await fetchAcademicData();
                setOpenCertificationsDialog(false);
                setCertificationData({ name: '', issuer: '', date: '', description: '' });
                setSuccess('Certification added successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.message || 'Failed to add certification');
            }
        } catch (err) {
            console.error('❌ Error adding certification:', err);
            setError('Network error: ' + err.message);
        } finally {
            setCertificationsLoading(false);
        }
    };

    const handleAddActivityPoints = async () => {
        setActivityLoading(true);
        console.log('🔄 Adding activity points for USN:', usn, 'Data:', activityData);
        
        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(`http://localhost:5002/api/academics/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usn,
                    activity: activityData.activity,
                    points: parseInt(activityData.points),
                    description: activityData.description
                }),
            });

            console.log('📊 Activity response status:', response.status);
            const result = await response.json();
            console.log('📊 Activity response data:', result);
            
            if (result.success) {
                await fetchAcademicData();
                setOpenActivityPointsDialog(false);
                setActivityData({ activity: '', points: '', description: '' });
                setSuccess('Activity points added successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.message || 'Failed to add activity points');
            }
        } catch (err) {
            console.error('❌ Error adding activity points:', err);
            setError('Network error: ' + err.message);
        } finally {
            setActivityLoading(false);
        }
    };

    if (loading) {
        console.log('🔄 Currently in loading state...');
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
                            Loading Academic Data...</Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    console.log('📋 Rendering main content. Academic data:', academicData);
    console.log('❌ Error state:', error);

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

                {success && (
                    <Alert 
                        severity="success" 
                        className="fade-in-up"
                        sx={{ 
                            mb: 3,
                            background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(67, 160, 71, 0.15) 100%)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(76, 175, 80, 0.2)",
                            borderRadius: 2,
                            color: "#c8e6c9"
                        }}
                    >
                        {success}
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
                                <Box display="flex" alignItems="center" justifyContent="space-between">
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
                                    <Button
                                        size="small"
                                        onClick={() => setOpenCreditsDialog(true)}
                                        sx={{
                                            minWidth: 'auto',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                                transform: 'translateY(-2px) scale(1.1)',
                                                boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 18 }} />
                                    </Button>
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
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <EmojiEventsIcon sx={{ 
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
                                    <Button
                                        size="small"
                                        onClick={() => setOpenCertificationsDialog(true)}
                                        sx={{
                                            minWidth: 'auto',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                                transform: 'translateY(-2px) scale(1.1)',
                                                boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 18 }} />
                                    </Button>
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
                                <Box display="flex" alignItems="center" justifyContent="space-between">
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
                                                {academicData?.aictActivityPoints?.currentPoints || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        size="small"
                                        onClick={() => setOpenActivityPointsDialog(true)}
                                        sx={{
                                            minWidth: 'auto',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                                transform: 'translateY(-2px) scale(1.1)',
                                                boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 18 }} />
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Content Area */}
                <Paper 
                    className="fade-in-up"
                    sx={{
                        p: 4,
                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.75) 0%, rgba(10, 25, 47, 0.8) 100%)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                        border: "1px solid rgba(184, 134, 11, 0.1)",
                        borderRadius: 3,
                        textAlign: "center",
                        minHeight: "300px"
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: "#F8FAFC",
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            mb: 2
                        }}
                    >
                        CGPA Trend Across Semesters
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: "#F8FAFC", 
                            opacity: 0.7,
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                        }}
                    >
                        No performance data available. Add semester data to see analytics.
                    </Typography>
                </Paper>

                {/* Add Semester Dialog */}
                <Dialog 
                    open={openSemesterDialog} 
                    onClose={() => setOpenSemesterDialog(false)} 
                    maxWidth="md" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                            backdropFilter: "blur(25px)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                            borderRadius: 3,
                        }
                    }}
                >
                    <DialogTitle sx={{ color: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                        Add Semester Academic Data
                    </DialogTitle>
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
                                            semesterNumber: e.target.value
                                        })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                            }
                                        }}
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="body2" sx={{ mt: 2, color: "#F8FAFC", opacity: 0.7 }}>
                                Course details can be added later through individual course management.
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenSemesterDialog(false)}
                            sx={{ color: "#F8FAFC" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleAddSemester}
                            sx={{
                                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                }
                            }}
                        >
                            Add Semester
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Credits Edit Dialog */}
                <Dialog 
                    open={openCreditsDialog} 
                    onClose={() => setOpenCreditsDialog(false)} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                            backdropFilter: "blur(25px)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                            borderRadius: 3,
                            color: "#F8FAFC"
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        color: "#F8FAFC",
                        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 700
                    }}>
                        Update Total Credits
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Total Credits"
                                type="number"
                                value={creditsData.credits}
                                onChange={(e) => setCreditsData({ credits: e.target.value })}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        background: "rgba(248, 250, 252, 0.9)",
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: "rgba(248, 250, 252, 0.95)",
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                                        },
                                        '&.Mui-focused': {
                                            background: "rgba(248, 250, 252, 1)",
                                            boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(0, 0, 0, 0.7)',
                                        '&.Mui-focused': {
                                            color: '#B8860B'
                                        }
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(184, 134, 11, 0.3)',
                                    },
                                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(184, 134, 11, 0.5)',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#B8860B',
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenCreditsDialog(false)}
                            sx={{ color: "#F8FAFC" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleUpdateCredits}
                            disabled={!creditsData.credits || creditsData.credits.trim() === '' || creditsLoading}
                            sx={{
                                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(184, 134, 11, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            }}
                        >
                            {creditsLoading ? 'Updating...' : 'Update Credits'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Certifications Add Dialog */}
                <Dialog 
                    open={openCertificationsDialog} 
                    onClose={() => setOpenCertificationsDialog(false)} 
                    maxWidth="md" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                            backdropFilter: "blur(25px)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                            borderRadius: 3,
                            color: "#F8FAFC"
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        color: "#F8FAFC",
                        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 700
                    }}>
                        Add New Certification
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Certification Name"
                                        value={certificationData.name}
                                        onChange={(e) => setCertificationData({...certificationData, name: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Issuing Organization"
                                        value={certificationData.issuer}
                                        onChange={(e) => setCertificationData({...certificationData, issuer: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Date Obtained"
                                        type="date"
                                        value={certificationData.date}
                                        onChange={(e) => setCertificationData({...certificationData, date: e.target.value})}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description (Optional)"
                                        multiline
                                        rows={3}
                                        value={certificationData.description}
                                        onChange={(e) => setCertificationData({...certificationData, description: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenCertificationsDialog(false)}
                            sx={{ color: "#F8FAFC" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleAddCertification}
                            disabled={!certificationData.name || !certificationData.issuer || !certificationData.date || certificationsLoading}
                            sx={{
                                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(184, 134, 11, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            }}
                        >
                            {certificationsLoading ? 'Adding...' : 'Add Certification'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Activity Points Add Dialog */}
                <Dialog 
                    open={openActivityPointsDialog} 
                    onClose={() => setOpenActivityPointsDialog(false)} 
                    maxWidth="md" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                            backdropFilter: "blur(25px)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                            borderRadius: 3,
                            color: "#F8FAFC"
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        color: "#F8FAFC",
                        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 700
                    }}>
                        Add Activity Points
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        label="Activity Name"
                                        value={activityData.activity}
                                        onChange={(e) => setActivityData({...activityData, activity: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Points"
                                        type="number"
                                        value={activityData.points}
                                        onChange={(e) => setActivityData({...activityData, points: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description (Optional)"
                                        multiline
                                        rows={3}
                                        value={activityData.description}
                                        onChange={(e) => setActivityData({...activityData, description: e.target.value})}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: "rgba(248, 250, 252, 0.9)",
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&.Mui-focused': {
                                                    color: '#B8860B'
                                                }
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenActivityPointsDialog(false)}
                            sx={{ color: "#F8FAFC" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleAddActivityPoints}
                            disabled={!activityData.activity || !activityData.points || activityLoading}
                            sx={{
                                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(184, 134, 11, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            }}
                        >
                            {activityLoading ? 'Adding...' : 'Add Activity'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Academics;