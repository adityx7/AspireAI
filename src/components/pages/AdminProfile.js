import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Avatar,
    Grid,
    Chip,
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
    Edit as EditIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Work as WorkIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        employeeId: '',
        fullName: '',
        email: '',
        department: '',
        role: '',
        permissions: []
    });

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
            setProfile({
                employeeId: adminData.employeeId || 'EMP001',
                fullName: adminData.fullName || 'Admin User',
                email: adminData.email || 'admin@bnmit.in',
                department: adminData.department || 'Computer Science',
                role: adminData.role || 'admin',
                permissions: adminData.permissions || []
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            setSnackbar({ 
                open: true, 
                message: 'Failed to load profile', 
                severity: 'error' 
            });
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // Update localStorage
            const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
            const updatedData = { ...adminData, ...profile };
            localStorage.setItem('adminData', JSON.stringify(updatedData));
            
            setSnackbar({ 
                open: true, 
                message: '✅ Profile updated successfully!', 
                severity: 'success' 
            });
            setEditMode(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSnackbar({ 
                open: true, 
                message: '❌ Failed to update profile', 
                severity: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 50%, ${NAVY_BLUE_LIGHTER} 100%)`,
                py: 4
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={() => navigate('/admin/dashboard')}
                            sx={{
                                color: GOLD_LIGHT,
                                '&:hover': { background: `${GOLD_MAIN}20` }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                Profile Settings
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                Manage your account information
                            </Typography>
                        </Box>
                    </Box>
                    {!editMode ? (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditMode(true)}
                            sx={{
                                borderColor: GOLD_MAIN,
                                color: GOLD_LIGHT,
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: GOLD_LIGHT,
                                    background: `${GOLD_MAIN}20`
                                }
                            }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setEditMode(false);
                                    fetchProfile();
                                }}
                                sx={{
                                    borderColor: '#64748B',
                                    color: '#94A3B8',
                                    '&:hover': {
                                        borderColor: '#94A3B8',
                                        background: '#64748B20'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                disabled={loading}
                                sx={{
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}
                </Box>

                <Grid container spacing={3}>
                    {/* Profile Card */}
                    <Grid item xs={12} md={4}>
                        <Zoom in={true} timeout={600}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 3,
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: `0 12px 30px ${GOLD_MAIN}30`
                                    }
                                }}
                            >
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto',
                                    mb: 2,
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    fontSize: '48px',
                                    fontWeight: 700,
                                    transition: 'all 0.4s ease',
                                    boxShadow: `0 4px 20px ${GOLD_MAIN}40`,
                                    animation: 'fadeInScale 0.6s ease-out',
                                    '&:hover': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                        boxShadow: `0 8px 30px ${GOLD_MAIN}60`
                                    },
                                    '@keyframes fadeInScale': {
                                        from: {
                                            opacity: 0,
                                            transform: 'scale(0.8)'
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'scale(1)'
                                        }
                                    }
                                }}
                            >
                                {profile.fullName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                {profile.fullName}
                            </Typography>
                            <Chip
                                label={profile.role.toUpperCase()}
                                sx={{
                                    background: `${GOLD_MAIN}30`,
                                    color: GOLD_LIGHT,
                                    fontWeight: 600,
                                    mb: 2
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                                {profile.email}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                {profile.employeeId}
                            </Typography>
                            </Paper>
                        </Zoom>

                        {/* Permissions Card */}
                        <Zoom in={true} timeout={800}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 3,
                                mt: 3
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                                Permissions
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {profile.permissions && profile.permissions.length > 0 ? (
                                    profile.permissions.map((perm, index) => (
                                        <Chip
                                            key={index}
                                            label={perm.replace(/_/g, ' ').toUpperCase()}
                                            size="small"
                                            sx={{
                                                background: '#3B82F620',
                                                color: '#60A5FA',
                                                fontWeight: 500,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                        No permissions assigned
                                    </Typography>
                                )}
                            </Box>
                            </Paper>
                        </Zoom>
                    </Grid>

                    {/* Profile Form */}
                    <Grid item xs={12} md={8}>
                        <Slide in={true} direction="left" timeout={700}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 4,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 12px 30px ${GOLD_MAIN}20`
                                    }
                                }}
                            >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                                Account Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Employee ID"
                                        value={profile.employeeId}
                                        disabled
                                        InputProps={{
                                            startAdornment: <BadgeIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#94A3B8',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { borderColor: `${GOLD_MAIN}60` },
                                                '&.Mui-focused fieldset': { borderColor: GOLD_MAIN }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputBase-input.Mui-disabled': { 
                                                WebkitTextFillColor: '#CBD5E1'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={profile.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { borderColor: `${GOLD_MAIN}60` },
                                                '&.Mui-focused fieldset': { borderColor: GOLD_MAIN }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputBase-input.Mui-disabled': { 
                                                WebkitTextFillColor: '#94A3B8'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <EmailIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { borderColor: `${GOLD_MAIN}60` },
                                                '&.Mui-focused fieldset': { borderColor: GOLD_MAIN }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputBase-input.Mui-disabled': { 
                                                WebkitTextFillColor: '#94A3B8'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Department"
                                        value={profile.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <WorkIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': { borderColor: `${GOLD_MAIN}40` },
                                                '&:hover fieldset': { borderColor: `${GOLD_MAIN}60` },
                                                '&.Mui-focused fieldset': { borderColor: GOLD_MAIN }
                                            },
                                            '& .MuiInputLabel-root': { color: '#94A3B8' },
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputBase-input.Mui-disabled': { 
                                                WebkitTextFillColor: '#94A3B8'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Alert 
                                        severity="info"
                                        sx={{
                                            background: '#3B82F615',
                                            color: '#60A5FA',
                                            border: '1px solid #3B82F640'
                                        }}
                                    >
                                        To change your password or role, please contact the system administrator.
                                    </Alert>
                                </Grid>
                            </Grid>
                            </Paper>
                        </Slide>
                    </Grid>
                </Grid>

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

export default AdminProfile;
