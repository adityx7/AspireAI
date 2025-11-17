import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    Paper, 
    InputAdornment, 
    IconButton,
    MenuItem,
    Chip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        role: 'admin',
        permissions: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Theme colors
    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    const departments = [
        'Computer Science and Engineering',
        'Information Science and Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Artificial Intelligence and Machine Learning',
        'Data Science',
        'Other'
    ];

    const roles = [
        { value: 'admin', label: 'Admin' },
        { value: 'hod', label: 'Head of Department (HOD)' },
        { value: 'coordinator', label: 'Coordinator' }
    ];

    const availablePermissions = [
        { value: 'manage_marks', label: 'Manage Marks' },
        { value: 'view_students', label: 'View Students' },
        { value: 'manage_attendance', label: 'Manage Attendance' },
        { value: 'manage_disputes', label: 'Manage Disputes' },
        { value: 'bulk_upload', label: 'Bulk Upload' },
        { value: 'view_reports', label: 'View Reports' },
        { value: 'manage_admins', label: 'Manage Admins' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePermissionsChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            permissions: typeof value === 'string' ? value.split(',') : value
        });
    };

    const validateForm = () => {
        if (!formData.employeeId || !formData.fullName || !formData.email || 
            !formData.password || !formData.confirmPassword || !formData.department) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5002/api/admin/register', {
                employeeId: formData.employeeId,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                department: formData.department,
                role: formData.role,
                permissions: formData.permissions
            });

            if (response.data.success) {
                setSuccess(true);
                console.log('✅ Admin registration successful');
                
                // Clear form
                setFormData({
                    employeeId: '',
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    department: '',
                    role: 'admin',
                    permissions: []
                });

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/admin/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Admin registration error:', error);
            setError(
                error.response?.data?.message || 
                'Registration failed. Please try again.'
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
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        py: 4
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
                    maxWidth: 600,
                    width: '90%',
                    p: 5,
                    my: 4,
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
                    Admin Registration
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
                    Create a new administrative account
                </Typography>

                {/* Success Alert */}
                {success && (
                    <Alert 
                        severity="success"
                        icon={<CheckCircle />}
                        sx={{ 
                            mb: 3,
                            background: 'rgba(76, 175, 80, 0.1)',
                            color: '#81C784',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            '& .MuiAlert-icon': {
                                color: '#81C784'
                            }
                        }}
                    >
                        Registration successful! Redirecting to login...
                    </Alert>
                )}

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

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                        {/* Employee ID */}
                        <TextField
                            fullWidth
                            required
                            label="Employee ID"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            disabled={loading || success}
                            placeholder="e.g., EMP001"
                            sx={textFieldStyles}
                        />

                        {/* Full Name */}
                        <TextField
                            fullWidth
                            required
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading || success}
                            placeholder="e.g., Dr. John Doe"
                            sx={textFieldStyles}
                        />

                        {/* Email */}
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading || success}
                            placeholder="e.g., john.doe@university.edu"
                            sx={textFieldStyles}
                        />

                        {/* Department */}
                        <TextField
                            fullWidth
                            required
                            select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            disabled={loading || success}
                            sx={textFieldStyles}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Role */}
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading || success}
                            sx={textFieldStyles}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Permissions */}
                        <FormControl sx={textFieldStyles}>
                            <InputLabel sx={{ color: '#94A3B8', '&.Mui-focused': { color: GOLD_LIGHT } }}>
                                Permissions
                            </InputLabel>
                            <Select
                                multiple
                                value={formData.permissions}
                                onChange={handlePermissionsChange}
                                input={<OutlinedInput label="Permissions" />}
                                disabled={loading || success}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip 
                                                key={value} 
                                                label={availablePermissions.find(p => p.value === value)?.label} 
                                                size="small"
                                                sx={{
                                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                                    color: 'white'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {availablePermissions.map((permission) => (
                                    <MenuItem key={permission.value} value={permission.value}>
                                        {permission.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Password */}
                        <TextField
                            fullWidth
                            required
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading || success}
                            placeholder="Minimum 6 characters"
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
                            sx={textFieldStyles}
                        />

                        {/* Confirm Password */}
                        <TextField
                            fullWidth
                            required
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading || success}
                            placeholder="Re-enter password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{ color: '#94A3B8' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyles}
                        />
                    </Box>

                    {/* Register Button */}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading || success}
                        sx={{
                            mt: 4,
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
                        {loading ? 'Creating Account...' : 'Create Admin Account'}
                    </Button>
                </form>

                {/* Links */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/admin/login')}
                        sx={{
                            color: '#94A3B8',
                            textTransform: 'none',
                            '&:hover': {
                                color: GOLD_LIGHT,
                                background: 'rgba(184, 134, 11, 0.1)',
                            }
                        }}
                    >
                        Already have an account? Login
                    </Button>
                    
                    <Button
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
                        ← Home
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

// Reusable text field styles
const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        color: 'white',
        background: 'rgba(26, 43, 76, 0.6)',
        '& fieldset': {
            borderColor: 'rgba(184, 134, 11, 0.3)',
        },
        '&:hover fieldset': {
            borderColor: '#DAA520',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#B8860B',
            boxShadow: `0 0 10px rgba(184, 134, 11, 0.3)`
        },
    },
    '& .MuiInputLabel-root': {
        color: '#94A3B8',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#DAA520',
    },
    '& .MuiSelect-icon': {
        color: '#94A3B8',
    },
};

export default AdminSignup;
