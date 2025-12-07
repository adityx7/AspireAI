import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Card, CardContent, Grid, IconButton, CircularProgress, Alert, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Tick icon
import CancelIcon from "@mui/icons-material/Cancel"; // Cross icon
import VideoCallIcon from "@mui/icons-material/VideoCall";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

export default function MentorTrainingPage() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students assigned to this mentor
    useEffect(() => {
        fetchMentees();
    }, []);

    const fetchMentees = async () => {
        setLoading(true);
        setError(null);
        try {
            const mentorID = localStorage.getItem('mentorID');
            if (!mentorID) {
                setError('Mentor ID not found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:5002/api/mentor/${mentorID}/mentees`);
            
            if (response.data.success) {
                setStudents(response.data.mentees || []);
            } else {
                setError('Failed to fetch student data');
            }
        } catch (err) {
            console.error('Error fetching mentees:', err);
            setError(err.response?.data?.message || 'Failed to load students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (student) => {
        console.log(`Navigating to verify ${student.name} (${student.usn})`);
        // Navigate to student verification page
        navigate(`/mentor/verify-student/${student.usn}`);
    };

    const handleReject = async (student) => {
        console.log(`Removing ${student.name} from mentee list`);
        
        // Confirm before removing
        if (!window.confirm(`Are you sure you want to remove ${student.name} from your mentee list?`)) {
            return;
        }

        try {
            const mentorID = localStorage.getItem('mentorID');
            const response = await axios.delete(
                `http://localhost:5002/api/mentor/${mentorID}/mentee/${student.usn}`
            );

            if (response.data.success) {
                // Remove student from local state
                setStudents(prevStudents => 
                    prevStudents.filter(s => s.usn !== student.usn)
                );
                alert(`${student.name} has been removed from your mentee list.`);
            } else {
                alert('Failed to remove student. Please try again.');
            }
        } catch (error) {
            console.error('Error removing student:', error);
            alert(error.response?.data?.message || 'Failed to remove student. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: "80%", md: "70%", lg: "100%" },
                    height: '50%',
                }}
            >
                {/* Heading */}
                <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    sx={{ 
                        mb: 2, 
                        mt: 4, 
                        fontFamily: "'Inter', sans-serif", 
                        textAlign: "center",
                        color: "white",
                        textShadow: `0 0 10px ${GOLD_MAIN}40`
                    }}
                    className="scale-in"
                >
                    Mentor Training
                </Typography>

                {/* Subheading */}
                <Box sx={{ width: '100%' }} className="fade-in-up">
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 3, 
                            fontFamily: "'Inter', sans-serif", 
                            textAlign: "center",
                            color: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        The below optional training modules provide additional information about what is expected of you as
                        a mentor and what you can expect from AspireAI; the tools and resources available to you as an AspireAI
                        mentor; and other helpful information to make your mentoring experience a success!
                    </Typography>
                </Box>

                {/* Divider */}
                <Divider sx={{ mb: 3, borderColor: `${GOLD_MAIN}50`, width: '50%', mx: 'auto' }} />

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress sx={{ color: GOLD_MAIN }} />
                        <Typography sx={{ ml: 2, color: 'white' }}>Loading students...</Typography>
                    </Box>
                )}

                {/* Error State */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3, 
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            color: 'white',
                            border: '1px solid rgba(211, 47, 47, 0.5)'
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Empty State */}
                {!loading && !error && students.length === 0 && (
                    <Alert 
                        severity="info" 
                        sx={{ 
                            mb: 3, 
                            backgroundColor: 'rgba(41, 128, 185, 0.1)',
                            color: 'white',
                            border: `1px solid ${GOLD_MAIN}50`
                        }}
                    >
                        No students assigned yet. Please contact the administrator.
                    </Alert>
                )}

                {/* Cards Section */}
                {!loading && !error && students.length > 0 && (
                    <Grid container spacing={4} justifyContent={'center'} alignItems={'stretch'}>
                        {students.map((student, index) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            key={index} 
                            className="slide-in-right"
                            sx={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <Card
                                sx={{
                                    height: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: `0 10px 20px rgba(0, 0, 0, 0.3), 0 0 10px ${GOLD_MAIN}40`,
                                    borderRadius: 2,
                                    justifyContent: "space-between",
                                    background: `rgba(17, 34, 64, 0.8)`,
                                    backdropFilter: 'blur(5px)',
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: `0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${GOLD_MAIN}60`,
                                    }
                                }}
                            >
                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ 
                                            textAlign: "center", 
                                            fontSize: 18, 
                                            fontFamily: "'Inter', sans-serif",
                                            color: GOLD_LIGHT,
                                            textShadow: `0 0 5px ${GOLD_MAIN}30`
                                        }}
                                    >
                                        {student.name}
                                    </Typography>
                                    <Divider sx={{ my: 1, borderColor: `${GOLD_MAIN}30` }} />
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontSize: 14, 
                                            fontFamily: "'Inter', sans-serif",
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            mb: 1
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>USN:</strong> {student.usn}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontSize: 14, 
                                            fontFamily: "'Inter', sans-serif",
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            mb: 1
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Email:</strong> {student.email}
                                    </Typography>
                                    {student.academics?.overallCGPA && (
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontSize: 14, 
                                                fontFamily: "'Inter', sans-serif",
                                                color: 'rgba(255, 255, 255, 0.9)'
                                            }}
                                        >
                                            <strong style={{ color: GOLD_LIGHT }}>CGPA:</strong> {student.academics.overallCGPA}
                                        </Typography>
                                    )}
                                </CardContent>

                                {/* Action Buttons */}
                                <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
                                    <IconButton
                                        onClick={() => handleAccept(student)}
                                        sx={{ 
                                            bgcolor: `${GOLD_MAIN}40`,
                                            color: GOLD_LIGHT,
                                            transition: 'all 0.3s ease',
                                            "&:hover": { 
                                                bgcolor: GOLD_MAIN,
                                                color: "white",
                                                transform: 'scale(1.1)'
                                            } 
                                        }}
                                        title="Verify Student"
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleReject(student)}
                                        sx={{ 
                                            bgcolor: "rgba(220, 50, 50, 0.3)", 
                                            color: "rgba(255, 120, 120, 1)",
                                            transition: 'all 0.3s ease',
                                            "&:hover": { 
                                                bgcolor: "rgba(220, 50, 50, 0.8)",
                                                color: "white",
                                                transform: 'scale(1.1)'
                                            } 
                                        }}
                                        title="Reject Student"
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                )}

                {/* Video Call Section */}
                <Box
                    sx={{
                        width: "100%",
                        mt: 4,
                        p: 4,
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_MAIN} 100%)`,
                        backdropFilter: 'blur(25px)',
                        borderRadius: 4,
                        textAlign: "center",
                        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 ${GOLD_MAIN}14`,
                        border: `1px solid ${GOLD_MAIN}30`,
                        transition: 'all 0.4s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 ${GOLD_MAIN}20`,
                        }
                    }}
                >
                    <VideoCallIcon sx={{ 
                        fontSize: '4rem',
                        color: GOLD_MAIN,
                        filter: `drop-shadow(0 4px 8px ${GOLD_MAIN}66)`,
                        mb: 2
                    }} />
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mt: 2, 
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                            fontWeight: 700,
                            color: GOLD_LIGHT,
                            textShadow: `0 2px 8px ${GOLD_MAIN}50`,
                            fontSize: { xs: "1.5rem", md: "1.8rem" }
                        }}
                    >
                        Video Calls
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mt: 2, 
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            color: "rgba(255, 255, 255, 0.9)",
                            lineHeight: 1.6,
                            maxWidth: "600px",
                            margin: "16px auto"
                        }}
                    >
                        Connect with your students via video calls. Schedule meetings or start instant calls to provide guidance and support.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/video-calls')} 
                        startIcon={<VideoCallIcon />}
                        sx={{ 
                            mt: 3,
                            background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                            color: 'white',
                            py: 1.5,
                            px: 4,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            boxShadow: `0 4px 15px ${GOLD_MAIN}50`,
                            transition: 'all 0.3s ease',
                            textTransform: 'none',
                            '&:hover': {
                                background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD_MAIN} 100%)`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${GOLD_MAIN}66`,
                            }
                        }}
                    >
                        Start Video Call
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
