import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    Drawer,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import SidebarMentor from '../../organisms/SideBarMentor';
import NavMentor from '../../organisms/NavMentor';

const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

const MentorStudentsListPage = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const mentorID = localStorage.getItem('mentorID');

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        fetchMentorStudents();
    }, []);

    const fetchMentorStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5002/api/mentor/${mentorID}/mentees`);
            
            if (response.data.success) {
                setStudents(response.data.mentees || []);
            } else {
                setError('Failed to load students');
            }
        } catch (err) {
            console.error('Error fetching students:', err);
            setError(err.response?.data?.message || 'Error loading students');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyStudent = (studentUSN) => {
        navigate(`/mentor/verify-student/${studentUSN}`);
    };

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: NAVY_BLUE_MAIN,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            {/* Navbar */}
            <NavMentor 
                onDrawerToggle={handleDrawerToggle}
                title="Student Verification"
            />

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                {/* Sidebar */}
                <Box
                    sx={{
                        width: 250,
                        backgroundColor: `rgba(17, 34, 64, 0.9)`,
                        boxShadow: `0 0 15px rgba(184, 134, 11, 0.15)`,
                        backdropFilter: 'blur(5px)',
                        display: { xs: "none", sm: "block" },
                        borderRight: `1px solid ${GOLD_MAIN}20`,
                    }}
                >
                    <SidebarMentor />
                </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    margin: { xs: '0', sm: '0 0 0 250px' },
                    background: 'transparent',
                    position: 'relative'
                }}
            >
                {loading ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '60vh',
                        width: '100%'
                    }}>
                        <CircularProgress sx={{ color: GOLD_MAIN }} />
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        p: 4 
                    }}>
                        <Box sx={{ width: { xs: '100%', sm: '80%', md: '70%', lg: '100%' } }}>
                            {/* Subheading Quote */}
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mb: 3, 
                                    fontFamily: "'Inter', sans-serif", 
                                    textAlign: "center",
                                    color: "rgba(255, 255, 255, 0.8)",
                                }}
                                className="fade-in-up"
                            >
                                "Verification is not about judging past performance, but about understanding potential and guiding future success. Each student's journey is unique, and your validation empowers their growth."
                            </Typography>

                            {/* Divider */}
                            <Divider sx={{ mb: 4, borderColor: `${GOLD_MAIN}50`, width: '50%', mx: 'auto' }} />

                            {error && (
                                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                                    {error}
                                </Alert>
                            )}

                            {students.length === 0 ? (
                                <Alert 
                                    severity="info" 
                                    sx={{ 
                                        mb: 3, 
                                        backgroundColor: 'rgba(41, 128, 185, 0.1)',
                                        color: 'white',
                                        border: `1px solid ${GOLD_MAIN}50`
                                    }}
                                >
                                    No students assigned yet. Contact the administrator to assign students.
                                </Alert>
                            ) : (
                                <Box sx={{ pt: 2, pr: 2, pb: 2, pl: 2, width: '100%' }}>
                                <Grid container spacing={2} justifyContent="center">
                                {students.map((student) => (
                                    <Grid item xs={12} sm={10} md={8} lg={6} key={student.usn}>
                                            <Card
                                                sx={{
                                                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
                                                    backdropFilter: 'blur(25px)',
                                                    border: '1px solid rgba(184, 134, 11, 0.15)',
                                                    borderRadius: '16px',
                                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                                                        border: '1px solid rgba(184, 134, 11, 0.3)',
                                                    }
                                                }}
                                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ color: GOLD_MAIN, fontSize: 40, mr: 2 }} />
                                        <Box>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: '#fff', 
                                                    fontWeight: 600 
                                                }}
                                            >
                                                {student.name || 'Student'}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ color: GOLD_LIGHT }}
                                            >
                                                {student.usn}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        {student.email && (
                                            <Typography 
                                                variant="body2" 
                                                sx={{ color: '#aaa', mb: 1 }}
                                            >
                                                📧 {student.email}
                                            </Typography>
                                        )}
                                        {student.academics?.overallCGPA && (
                                            <Chip 
                                                label={`CGPA: ${student.academics.overallCGPA}`}
                                                size="small"
                                                sx={{ 
                                                    bgcolor: 'rgba(184, 134, 11, 0.2)',
                                                    color: GOLD_LIGHT,
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ px: 2, pb: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<VerifiedUserIcon />}
                                        onClick={() => handleVerifyStudent(student.usn)}
                                        sx={{
                                            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                                            color: '#fff',
                                            fontWeight: 600,
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)',
                                            }
                                        }}
                                    >
                                        Verify Student
                                    </Button>
                                </CardActions>
                                    </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            </Box>
                        )}
                        </Box>
                    </Box>
                )}
            </Box>
            </Box>

            {/* Mobile Sidebar Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ 
                    display: { xs: "block", sm: "none" },
                    '& .MuiDrawer-paper': {
                        backgroundColor: NAVY_BLUE_LIGHT,
                        color: 'white'
                    }
                }}
            >
                <SidebarMentor />
            </Drawer>
        </Box>
    );
};

export default MentorStudentsListPage;
