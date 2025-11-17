import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    IconButton,
    Chip,
    Grid,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPermissions = () => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [adminData, setAdminData] = useState({
        fullName: '',
        role: '',
        permissions: []
    });

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    // All possible permissions
    const allPermissions = [
        { id: 'view_students', name: 'View Students', description: 'View student profiles and information' },
        { id: 'manage_marks', name: 'Manage Marks', description: 'Add and edit student marks' },
        { id: 'manage_attendance', name: 'Manage Attendance', description: 'Update attendance records' },
        { id: 'manage_disputes', name: 'Manage Disputes', description: 'Handle student disputes and appeals' },
        { id: 'bulk_upload', name: 'Bulk Upload', description: 'Upload marks and data in bulk' },
        { id: 'view_reports', name: 'View Reports', description: 'Access analytics and reports' },
        { id: 'manage_admins', name: 'Manage Admins', description: 'Create and manage admin accounts' }
    ];

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('adminData') || '{}');
        setAdminData({
            fullName: data.fullName || 'Admin User',
            role: data.role || 'admin',
            permissions: data.permissions || []
        });
    }, []);

    const hasPermission = (permId) => {
        return adminData.permissions.includes(permId);
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
                                    Permissions
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Manage access control and permissions
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                <Grid container spacing={3}>
                    {/* Current User Permissions */}
                    <Grid item xs={12} md={4}>
                        <Zoom in={true} timeout={700}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: `0 12px 30px ${GOLD_MAIN}30`
                                    }
                                }}
                            >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <SecurityIcon sx={{ color: GOLD_LIGHT, fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                        Your Access Level
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                        {adminData.fullName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                label={adminData.role.toUpperCase()}
                                sx={{
                                    width: '100%',
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    mb: 3,
                                    py: 2.5
                                }}
                            />

                            <Typography variant="subtitle2" sx={{ color: '#94A3B8', mb: 2 }}>
                                Active Permissions ({adminData.permissions.length})
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {adminData.permissions.map((perm, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            background: '#10B98110',
                                            border: '1px solid #10B98130',
                                            borderRadius: 2,
                                            p: 1.5
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                                        <Typography sx={{ color: '#34D399', fontSize: '0.875rem', fontWeight: 500 }}>
                                            {perm.replace(/_/g, ' ').toUpperCase()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            </Paper>
                        </Zoom>

                        <Grow in={true} timeout={1000}>
                            <Alert 
                                severity="info"
                                sx={{
                                    mt: 3,
                                    background: '#3B82F615',
                                    color: '#60A5FA',
                                    border: '1px solid #3B82F640'
                                }}
                            >
                                To modify your permissions, contact the system administrator.
                            </Alert>
                        </Grow>
                    </Grid>

                    {/* All Permissions Overview */}
                    <Grid item xs={12} md={8}>
                        <Slide in={true} direction="left" timeout={800}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 12px 30px ${GOLD_MAIN}20`
                                    }
                                }}
                            >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                                Permission Details
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Status
                                            </TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Permission
                                            </TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Description
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allPermissions.map((perm) => {
                                            const hasAccess = hasPermission(perm.id);
                                            return (
                                                <TableRow 
                                                    key={perm.id}
                                                    sx={{
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': { 
                                                            background: `${GOLD_MAIN}10`,
                                                            transform: 'translateX(5px)'
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Checkbox
                                                            checked={hasAccess}
                                                            disabled
                                                            sx={{
                                                                color: hasAccess ? '#10B981' : '#64748B',
                                                                '&.Mui-checked': {
                                                                    color: '#10B981'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Typography 
                                                            sx={{ 
                                                                color: hasAccess ? 'white' : '#64748B',
                                                                fontWeight: hasAccess ? 600 : 400
                                                            }}
                                                        >
                                                            {perm.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: hasAccess ? '#94A3B8' : '#64748B'
                                                            }}
                                                        >
                                                            {perm.description}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Slide>

                        {/* Role-Based Access Info */}
                        <Grow in={true} timeout={1000}>
                            <Paper
                                sx={{
                                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}30`,
                                    borderRadius: 3,
                                    p: 3,
                                    mt: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 8px 20px ${GOLD_MAIN}20`
                                    }
                                }}
                            >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                                Role-Based Access Control (RBAC)
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                                AspireAI uses a role-based permission system to control access to different features:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Box
                                        sx={{
                                            background: '#EF444410',
                                            border: '1px solid #EF444430',
                                            borderRadius: 2,
                                            p: 2
                                        }}
                                    >
                                        <Typography sx={{ color: '#F87171', fontWeight: 600, mb: 1 }}>
                                            🔴 Admin
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            Full system access and control
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box
                                        sx={{
                                            background: '#F59E0B10',
                                            border: '1px solid #F59E0B30',
                                            borderRadius: 2,
                                            p: 2
                                        }}
                                    >
                                        <Typography sx={{ color: '#FBBF24', fontWeight: 600, mb: 1 }}>
                                            🟡 HOD
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            Department-level management
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box
                                        sx={{
                                            background: '#3B82F610',
                                            border: '1px solid #3B82F630',
                                            borderRadius: 2,
                                            p: 2
                                        }}
                                    >
                                        <Typography sx={{ color: '#60A5FA', fontWeight: 600, mb: 1 }}>
                                            🔵 Coordinator
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            Limited administrative access
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            </Paper>
                        </Grow>
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

export default AdminPermissions;
