import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    MenuItem,
    Alert,
    Snackbar,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    School as SchoolIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminAddStudent = () => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        email: '',
        phone: '',
        branch: 'CSE',
        semester: '1',
        year: '1'
    });

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // TODO: Implement actual API call
        setSnackbar({
            open: true,
            message: '✅ Student added successfully!',
            severity: 'success'
        });
        setTimeout(() => navigate('/admin/students'), 2000);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 50%, ${NAVY_BLUE_LIGHTER} 100%)`,
                py: 4
            }}
        >
            <Container maxWidth="md">
                {/* Header */}
                <Fade in={true} timeout={600}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => navigate('/admin/dashboard')}
                                sx={{
                                    color: GOLD_LIGHT,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        background: `${GOLD_MAIN}20`,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                    Add New Student
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Register a new student in the system
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                color: 'white',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 20px ${GOLD_MAIN}40`
                                }
                            }}
                        >
                            Add Student
                        </Button>
                    </Box>
                </Fade>

                <Slide direction="up" in={true} timeout={800}>
                    <Paper
                        sx={{
                            background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                            border: `1px solid ${GOLD_MAIN}30`,
                            borderRadius: 3,
                            p: 4,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: `${GOLD_MAIN}60`,
                                boxShadow: `0 8px 24px ${GOLD_MAIN}20`
                            }
                        }}
                    >
                        <Zoom in={true} timeout={1000}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                                Student Information
                            </Typography>
                        </Zoom>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Grow in={true} timeout={1100}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' }
                                        }}
                                    />
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Grow in={true} timeout={1200}>
                                    <TextField
                                        fullWidth
                                        label="USN (University Seat Number)"
                                        value={formData.usn}
                                        onChange={(e) => handleChange('usn', e.target.value)}
                                        InputProps={{
                                            startAdornment: <SchoolIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' }
                                        }}
                                    />
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Grow in={true} timeout={1300}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        InputProps={{
                                            startAdornment: <EmailIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' }
                                        }}
                                    />
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Grow in={true} timeout={1400}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        InputProps={{
                                            startAdornment: <PhoneIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' }
                                        }}
                                    />
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Grow in={true} timeout={1500}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Branch"
                                        value={formData.branch}
                                        onChange={(e) => handleChange('branch', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiSelect-select': { color: 'white' }
                                        }}
                                    >
                                        <MenuItem value="CSE">Computer Science</MenuItem>
                                        <MenuItem value="ISE">Information Science</MenuItem>
                                        <MenuItem value="ECE">Electronics</MenuItem>
                                        <MenuItem value="ME">Mechanical</MenuItem>
                                    </TextField>
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Grow in={true} timeout={1600}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Semester"
                                        value={formData.semester}
                                        onChange={(e) => handleChange('semester', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiSelect-select': { color: 'white' }
                                        }}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(sem => (
                                            <MenuItem key={sem} value={sem.toString()}>Semester {sem}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grow>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Grow in={true} timeout={1700}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Year"
                                        value={formData.year}
                                        onChange={(e) => handleChange('year', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { 
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                },
                                                '&.Mui-focused fieldset': { 
                                                    borderColor: GOLD_MAIN,
                                                    boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                                }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiSelect-select': { color: 'white' }
                                        }}
                                    >
                                        <MenuItem value="1">1st Year</MenuItem>
                                        <MenuItem value="2">2nd Year</MenuItem>
                                        <MenuItem value="3">3rd Year</MenuItem>
                                        <MenuItem value="4">4th Year</MenuItem>
                                    </TextField>
                                </Grow>
                            </Grid>

                            <Grid item xs={12}>
                                <Fade in={true} timeout={1800}>
                                    <Alert 
                                        severity="info"
                                        sx={{
                                            background: '#3B82F615',
                                            color: '#60A5FA',
                                            border: '1px solid #3B82F640',
                                            animation: 'pulse 2s ease-in-out infinite',
                                            '@keyframes pulse': {
                                                '0%, 100%': { opacity: 1 },
                                                '50%': { opacity: 0.8 }
                                            }
                                        }}
                                    >
                                        All fields are required. The student will receive a welcome email with login credentials.
                                    </Alert>
                                </Fade>
                            </Grid>
                        </Grid>
                    </Paper>
                </Slide>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert 
                        onClose={() => setSnackbar({ ...snackbar, open: false })} 
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default AdminAddStudent;
