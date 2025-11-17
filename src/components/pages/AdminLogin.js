import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Theme colors
    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!employeeId || !password) {
            setError('Please enter both Employee ID and Password');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5002/api/admin/login', {
                employeeId,
                password
            });

            if (response.data.success) {
                // Store admin data
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminId', response.data.admin.employeeId);
                localStorage.setItem('name', response.data.admin.fullName);
                localStorage.setItem('fullName', response.data.admin.fullName);
                localStorage.setItem('role', response.data.admin.role);
                localStorage.setItem('email', response.data.admin.email);
                localStorage.setItem('permissions', JSON.stringify(response.data.admin.permissions));
                
                // Store complete admin data object
                localStorage.setItem('adminData', JSON.stringify({
                    employeeId: response.data.admin.employeeId,
                    fullName: response.data.admin.fullName,
                    email: response.data.admin.email,
                    department: response.data.admin.department || 'Computer Science',
                    role: response.data.admin.role,
                    permissions: response.data.admin.permissions || []
                }));
                
                console.log('✅ Admin login successful');
                
                // Navigate to admin dashboard
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            setError(
                error.response?.data?.message || 
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    const shimmerBackground = {
        minHeight: '100vh',
        background: `
            linear-gradient(135deg, 
                rgba(10, 25, 47, 0.95) 0%, 
                rgba(26, 43, 76, 0.9) 35%, 
                rgba(50, 73, 94, 0.85) 100%
            ),
            radial-gradient(circle at 30% 70%, rgba(184, 134, 11, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(218, 165, 32, 0.1) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
    };

    return (
        <Box sx={shimmerBackground}>
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(184, 134, 11, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    animation: 'pulse 4s ease-in-out infinite'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(218, 165, 32, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    animation: 'pulse 5s ease-in-out infinite reverse'
                }}
            />

            <Paper
                elevation={24}
                sx={{
                    maxWidth: 480,
                    width: '90%',
                    p: 5,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.98) 0%, rgba(10, 25, 47, 0.99) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
                    boxShadow: `
                        0 20px 60px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(184, 134, 11, 0.1),
                        0 0 40px rgba(184, 134, 11, 0.1)
                    `,
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {/* Admin Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 25px rgba(184, 134, 11, 0.3)`,
                            animation: 'pulse 3s ease-in-out infinite'
                        }}
                    >
                        <AdminPanelSettings sx={{ fontSize: 48, color: 'white' }} />
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        mb: 1,
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '2rem'
                    }}
                >
                    Admin Access
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        color: '#94A3B8',
                        fontSize: '0.95rem'
                    }}
                >
                    Secure portal for administrative functions
                </Typography>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            background: 'rgba(211, 47, 47, 0.1)',
                            color: '#EF5350',
                            border: '1px solid rgba(211, 47, 47, 0.3)',
                            '& .MuiAlert-icon': {
                                color: '#EF5350'
                            }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Employee ID Field */}
                    <TextField
                        fullWidth
                        label="Employee ID"
                        variant="outlined"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        disabled={loading}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                background: 'rgba(26, 43, 76, 0.6)',
                                '& fieldset': {
                                    borderColor: 'rgba(184, 134, 11, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: GOLD_LIGHT,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: GOLD_MAIN,
                                    boxShadow: `0 0 10px rgba(184, 134, 11, 0.3)`
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#94A3B8',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: GOLD_LIGHT,
                            },
                        }}
                    />

                    {/* Password Field */}
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#94A3B8' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                background: 'rgba(26, 43, 76, 0.6)',
                                '& fieldset': {
                                    borderColor: 'rgba(184, 134, 11, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: GOLD_LIGHT,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: GOLD_MAIN,
                                    boxShadow: `0 0 10px rgba(184, 134, 11, 0.3)`
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#94A3B8',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: GOLD_LIGHT,
                            },
                        }}
                    />

                    {/* Login Button */}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                            color: 'white',
                            borderRadius: 2,
                            boxShadow: `0 8px 20px rgba(184, 134, 11, 0.3)`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`,
                                boxShadow: `0 12px 30px rgba(184, 134, 11, 0.4)`,
                                transform: 'translateY(-2px)',
                            },
                            '&:active': {
                                transform: 'translateY(0px)',
                            },
                            '&:disabled': {
                                background: 'rgba(184, 134, 11, 0.3)',
                                color: 'rgba(255, 255, 255, 0.5)',
                            }
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                {/* Sign Up and Home Links */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/admin/signup')}
                        sx={{
                            color: GOLD_LIGHT,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                color: GOLD_MAIN,
                                background: 'rgba(184, 134, 11, 0.1)',
                            }
                        }}
                    >
                        Don't have an account? Sign Up
                    </Button>
                    
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#94A3B8',
                            textTransform: 'none',
                            '&:hover': {
                                color: GOLD_LIGHT,
                                background: 'rgba(184, 134, 11, 0.1)',
                            }
                        }}
                    >
                        ← Back to Home
                    </Button>
                </Box>
            </Paper>

            {/* Animation keyframes */}
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 0.8;
                        }
                        50% {
                            transform: scale(1.1);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default AdminLogin;
