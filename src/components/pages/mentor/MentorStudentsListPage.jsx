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
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';

const NAVY_BLUE_MAIN = "#0A192F";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

const MentorStudentsListPage = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const mentorID = localStorage.getItem('mentorID');

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

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh' 
            }}>
                <CircularProgress sx={{ color: GOLD_MAIN }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: GOLD_MAIN, 
                        fontWeight: 700,
                        mb: 1 
                    }}
                >
                    Student Verification
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                    Select a student to verify their academic records and achievements
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {students.length === 0 ? (
                <Alert severity="info">
                    No students assigned yet. Contact the administrator to assign students.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {students.map((student) => (
                        <Grid item xs={12} sm={6} md={4} key={student.usn}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)',
                                    backdropFilter: 'blur(25px)',
                                    border: '1px solid rgba(184, 134, 11, 0.15)',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.3s ease',
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
            )}
        </Container>
    );
};

export default MentorStudentsListPage;
