import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminStudentDetails = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [academics, setAcademics] = useState([]);
    const [loading, setLoading] = useState(true);

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            
            // Fetch student basic info
            const studentResponse = await axios.get(
                `http://localhost:5002/api/admin/students/${studentId}/academics`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (studentResponse.data.success) {
                setStudent(studentResponse.data.data.student);
                setAcademics(studentResponse.data.data.semesters || []);
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box sx={{ width: '300px' }}>
                    <LinearProgress
                        sx={{
                            backgroundColor: `${GOLD_MAIN}30`,
                            '& .MuiLinearProgress-bar': { backgroundColor: GOLD_LIGHT }
                        }}
                    />
                    <Typography sx={{ color: 'white', textAlign: 'center', mt: 2 }}>
                        Loading student details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!student) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography sx={{ color: 'white' }}>Student not found</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 50%, ${NAVY_BLUE_LIGHTER} 100%)`,
                py: 4
            }}
        >
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={() => navigate('/admin/students')}
                            sx={{
                                color: GOLD_LIGHT,
                                '&:hover': { background: `${GOLD_MAIN}20` }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                Student Details
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                View and manage student academic records
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/students/${studentId}/edit`)}
                        sx={{
                            background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                            color: 'white',
                            fontWeight: 600,
                            '&:hover': {
                                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`
                            }
                        }}
                    >
                        Edit Marks
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Student Profile Card */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                border: `1px solid ${GOLD_MAIN}30`,
                                borderRadius: 3,
                                p: 3,
                                textAlign: 'center'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    margin: '0 auto 16px',
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    fontSize: '2.5rem',
                                    fontWeight: 700
                                }}
                            >
                                {student.name?.charAt(0) || 'S'}
                            </Avatar>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                {student.name || 'N/A'}
                            </Typography>
                            <Chip
                                label={student.usn}
                                sx={{
                                    background: `${GOLD_MAIN}30`,
                                    color: GOLD_LIGHT,
                                    fontWeight: 600,
                                    mb: 2
                                }}
                            />
                            <Divider sx={{ my: 2, borderColor: `${GOLD_MAIN}20` }} />
                            <Box sx={{ textAlign: 'left' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <EmailIcon sx={{ color: GOLD_LIGHT }} />
                                    <Typography sx={{ color: '#94A3B8' }}>
                                        {student.email || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <SchoolIcon sx={{ color: GOLD_LIGHT }} />
                                    <Typography sx={{ color: '#94A3B8' }}>
                                        {student.selectedMajors || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUpIcon sx={{ color: GOLD_LIGHT }} />
                                    <Typography sx={{ color: '#94A3B8' }}>
                                        Year: {student.graduationYear || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* CGPA Card */}
                        <Paper
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                borderRadius: 3,
                                p: 3,
                                mt: 3,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                Overall CGPA
                            </Typography>
                            <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>
                                {student.academics?.overallCGPA?.toFixed(2) || 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Academic Records */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                border: `1px solid ${GOLD_MAIN}30`,
                                borderRadius: 3,
                                p: 3
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                Semester-wise Academic Performance
                            </Typography>
                            
                            {academics.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ background: `${NAVY_BLUE_MAIN}60` }}>
                                                <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>Semester</TableCell>
                                                <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>SGPA</TableCell>
                                                <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>Credits</TableCell>
                                                <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>Status</TableCell>
                                                <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {academics.map((sem) => (
                                                <TableRow
                                                    key={sem._id}
                                                    sx={{ '&:hover': { background: `${GOLD_MAIN}10` } }}
                                                >
                                                    <TableCell sx={{ color: 'white' }}>
                                                        Semester {sem.semester}
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'white' }}>
                                                        <Chip
                                                            label={sem.sgpa?.toFixed(2) || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                background: `${GOLD_MAIN}30`,
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8' }}>
                                                        {sem.totalCredits || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={sem.status || 'Active'}
                                                            size="small"
                                                            sx={{
                                                                background: '#10B98120',
                                                                color: '#10B981'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            onClick={() => navigate(`/admin/students/${studentId}/edit?semester=${sem.semester}`)}
                                                            sx={{
                                                                color: GOLD_LIGHT,
                                                                '&:hover': { background: `${GOLD_MAIN}20` }
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography sx={{ color: '#94A3B8' }}>
                                        No academic records found
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AdminStudentDetails;
