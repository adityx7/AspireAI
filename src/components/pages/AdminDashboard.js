import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Avatar,
    IconButton,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    LinearProgress,
    Tooltip,
    Badge,
    Snackbar,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Assessment as AssessmentIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as AccessTimeIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    CloudUpload as UploadIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        averageCGPA: 0,
        pendingDisputes: 0,
        recentActions: 0
    });
    const [recentStudents, setRecentStudents] = useState([]);
    const [recentActions, setRecentActions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('dashboard');
    const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
    const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    // Theme colors
    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';
    const GOLD_LIGHTER = '#FFD700';

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('adminToken');
        const adminId = localStorage.getItem('adminId');
        const name = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');

        if (!token || !adminId) {
            navigate('/admin/login');
            return;
        }

        setAdminData({
            employeeId: adminId,
            name: name || 'Admin',
            role: role || 'admin'
        });

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            
            // Fetch students count and stats
            const studentsResponse = await axios.get('http://localhost:5002/api/admin/students?limit=5', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (studentsResponse.data.success) {
                setStats(prev => ({
                    ...prev,
                    totalStudents: studentsResponse.data.data.total,
                    activeStudents: studentsResponse.data.data.students.length
                }));
                setRecentStudents(studentsResponse.data.data.students);
            }

            // Mock data for alerts and recent actions
            setAlerts([
                { id: 1, type: 'warning', message: '5 students have CGPA below 6.0', priority: 'high' },
                { id: 2, type: 'info', message: '12 internal marks entries pending verification', priority: 'medium' },
                { id: 3, type: 'success', message: 'Semester 3 marks updated successfully', priority: 'low' }
            ]);

            setRecentActions([
                { id: 1, action: 'Updated marks', student: 'John Doe (1BG21CS001)', time: '5 mins ago', type: 'marks' },
                { id: 2, action: 'Resolved dispute', student: 'Jane Smith (1BG21CS002)', time: '15 mins ago', type: 'dispute' },
                { id: 3, action: 'Bulk upload', student: '45 students', time: '1 hour ago', type: 'bulk' },
                { id: 4, action: 'Attendance updated', student: 'CS 3rd Sem', time: '2 hours ago', type: 'attendance' }
            ]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        localStorage.removeItem('name');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('permissions');
        navigate('/admin/login');
    };

    const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
        <Card
            sx={{
                background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                border: `1px solid ${color}40`,
                borderRadius: 3,
                boxShadow: `0 8px 20px rgba(184, 134, 11, 0.15)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 12px 30px rgba(184, 134, 11, 0.25)`,
                    border: `1px solid ${color}80`
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                            {value}
                        </Typography>
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {trend === 'up' ? (
                                    <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                                )}
                                <Typography variant="caption" sx={{ color: trend === 'up' ? '#10B981' : '#EF4444' }}>
                                    {trendValue}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            background: `linear-gradient(135deg, ${color}, ${color}DD)`,
                            width: 56,
                            height: 56,
                            boxShadow: `0 4px 15px ${color}40`
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    const AlertCard = ({ alert }) => {
        const getAlertColor = () => {
            switch (alert.type) {
                case 'warning': return '#F59E0B';
                case 'error': return '#EF4444';
                case 'success': return '#10B981';
                default: return '#3B82F6';
            }
        };

        const getAlertIcon = () => {
            switch (alert.type) {
                case 'warning': return <WarningIcon />;
                case 'success': return <CheckCircleIcon />;
                default: return <NotificationsIcon />;
            }
        };

        return (
            <Alert
                severity={alert.type}
                icon={getAlertIcon()}
                sx={{
                    background: `${getAlertColor()}15`,
                    border: `1px solid ${getAlertColor()}40`,
                    color: 'white',
                    '& .MuiAlert-icon': {
                        color: getAlertColor()
                    }
                }}
            >
                {alert.message}
            </Alert>
        );
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
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: GOLD_LIGHT
                            }
                        }} 
                    />
                    <Typography sx={{ color: 'white', textAlign: 'center', mt: 2 }}>
                        Loading dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_LIGHT} 50%, ${NAVY_BLUE_LIGHTER} 100%)`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decorations */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, ${GOLD_MAIN}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'pulse 6s ease-in-out infinite'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '5%',
                    width: '350px',
                    height: '350px',
                    background: `radial-gradient(circle, ${GOLD_LIGHT}10 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'pulse 7s ease-in-out infinite reverse'
                }}
            />

            {/* Top Navigation Bar */}
            <Paper
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                    borderBottom: `1px solid ${GOLD_MAIN}30`,
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    px: 4,
                    py: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Logo and Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 15px ${GOLD_MAIN}40`
                            }}
                        >
                            <DashboardIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                Admin Dashboard
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                AspireAI Administration Portal
                            </Typography>
                        </Box>
                    </Box>

                    {/* Search Bar */}
                    <TextField
                        placeholder="Search students, marks, records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            width: '400px',
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                background: `${NAVY_BLUE_MAIN}80`,
                                borderRadius: 3,
                                '& fieldset': {
                                    borderColor: `${GOLD_MAIN}30`,
                                },
                                '&:hover fieldset': {
                                    borderColor: `${GOLD_LIGHT}60`,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: GOLD_LIGHT,
                                }
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: '#94A3B8',
                                opacity: 1
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: GOLD_LIGHT }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Admin Profile and Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Notifications">
                            <IconButton
                                onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
                                sx={{
                                    color: GOLD_LIGHT,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: `${GOLD_MAIN}20`,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <Badge 
                                    badgeContent={alerts.length} 
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            animation: alerts.length > 0 ? 'pulse 2s infinite' : 'none',
                                            '@keyframes pulse': {
                                                '0%': {
                                                    transform: 'scale(1)',
                                                    opacity: 1
                                                },
                                                '50%': {
                                                    transform: 'scale(1.1)',
                                                    opacity: 0.8
                                                },
                                                '100%': {
                                                    transform: 'scale(1)',
                                                    opacity: 1
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Settings">
                            <IconButton
                                onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
                                sx={{
                                    color: GOLD_LIGHT,
                                    '&:hover': {
                                        background: `${GOLD_MAIN}20`
                                    }
                                }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                sx={{
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    fontWeight: 700,
                                    width: 40,
                                    height: 40
                                }}
                            >
                                {adminData?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                    {adminData?.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                    {adminData?.role?.toUpperCase()}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={handleLogout}
                                sx={{
                                    color: '#EF4444',
                                    '&:hover': {
                                        background: '#EF444420'
                                    }
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                {/* Welcome Section */}
                <Fade in={true} timeout={800}>
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: 'white', 
                                fontWeight: 700, 
                                mb: 1,
                                animation: 'fadeInUp 0.6s ease-out',
                                '@keyframes fadeInUp': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateY(20px)'
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            Welcome back, {adminData?.name}! 👋
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#94A3B8',
                                animation: 'fadeInUp 0.6s ease-out 0.2s both',
                                '@keyframes fadeInUp': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateY(20px)'
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateY(0)'
                                    }
                                }
                            }}
                        >
                            Here's what's happening with your students today.
                        </Typography>
                    </Box>
                </Fade>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grow in={true} timeout={500}>
                            <div>
                                <StatCard
                                    title="Total Students"
                                    value={stats.totalStudents || '0'}
                                    icon={<PeopleIcon sx={{ fontSize: 28 }} />}
                                    trend="up"
                                    trendValue="+12.5%"
                                    color={GOLD_MAIN}
                                />
                            </div>
                        </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grow in={true} timeout={700}>
                            <div>
                                <StatCard
                                    title="Active Students"
                                    value={stats.activeStudents || '0'}
                                    icon={<SchoolIcon sx={{ fontSize: 28 }} />}
                                    trend="up"
                                    trendValue="+5.2%"
                                    color="#10B981"
                                />
                            </div>
                        </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grow in={true} timeout={900}>
                            <div>
                                <StatCard
                                    title="Pending Disputes"
                                    value={stats.pendingDisputes || '0'}
                                    icon={<WarningIcon sx={{ fontSize: 28 }} />}
                                    trend="down"
                                    trendValue="-3.1%"
                                    color="#F59E0B"
                                />
                            </div>
                        </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Grow in={true} timeout={1100}>
                            <div>
                                <StatCard
                                    title="Recent Actions"
                                    value={recentActions.length}
                                    icon={<HistoryIcon sx={{ fontSize: 28 }} />}
                                    trend="up"
                                    trendValue="Today"
                                    color="#3B82F6"
                                />
                            </div>
                        </Grow>
                    </Grid>
                </Grid>

                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                            Important Alerts
                        </Typography>
                        <Grid container spacing={2}>
                            {alerts.map(alert => (
                                <Grid item xs={12} md={4} key={alert.id}>
                                    <AlertCard alert={alert} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Quick Actions */}
                <Slide in={true} direction="up" timeout={600}>
                    <Paper
                        sx={{
                            background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                            border: `1px solid ${GOLD_MAIN}30`,
                            borderRadius: 3,
                            p: 3,
                            mb: 4,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 12px 30px ${GOLD_MAIN}30`,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                            Quick Actions
                        </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/admin/add-student')}
                                sx={{
                                    py: 1.5,
                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 20px ${GOLD_MAIN}40`
                                    }
                                }}
                            >
                                Add Student
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                onClick={() => navigate('/admin/bulk-upload')}
                                sx={{
                                    py: 1.5,
                                    borderColor: GOLD_MAIN,
                                    color: GOLD_LIGHT,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: GOLD_LIGHT,
                                        background: `${GOLD_MAIN}15`,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Bulk Upload
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<AssessmentIcon />}
                                onClick={() => navigate('/admin/reports')}
                                sx={{
                                    py: 1.5,
                                    borderColor: '#3B82F6',
                                    color: '#60A5FA',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: '#60A5FA',
                                        background: '#3B82F615',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                View Reports
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ViewIcon />}
                                onClick={() => navigate('/admin/students')}
                                sx={{
                                    py: 1.5,
                                    borderColor: '#10B981',
                                    color: '#34D399',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: '#34D399',
                                        background: '#10B98115',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                View All Students
                            </Button>
                        </Grid>
                    </Grid>
                    </Paper>
                </Slide>

                <Grid container spacing={3}>
                    {/* Recent Students */}
                    <Grid item xs={12} lg={8}>
                        <Zoom in={true} timeout={800}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                    Recent Students
                                </Typography>
                                <Button
                                    endIcon={<ViewIcon />}
                                    onClick={() => navigate('/admin/students')}
                                    sx={{
                                        color: GOLD_LIGHT,
                                        '&:hover': {
                                            background: `${GOLD_MAIN}15`
                                        }
                                    }}
                                >
                                    View All
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>Student</TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>USN</TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>Branch</TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>CGPA</TableCell>
                                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentStudents.length > 0 ? (
                                            recentStudents.map((student) => (
                                                <TableRow 
                                                    key={student.usn}
                                                    sx={{
                                                        '&:hover': {
                                                            background: `${GOLD_MAIN}10`
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ color: 'white', borderColor: `${GOLD_MAIN}20` }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar
                                                                sx={{
                                                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                                                    width: 32,
                                                                    height: 32,
                                                                    fontSize: 14
                                                                }}
                                                            >
                                                                {student.name?.charAt(0)}
                                                            </Avatar>
                                                            {student.name || 'N/A'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8', borderColor: `${GOLD_MAIN}20` }}>
                                                        {student.usn}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8', borderColor: `${GOLD_MAIN}20` }}>
                                                        {student.selectedMajors || 'N/A'}
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Chip
                                                            label={student.academics?.overallCGPA?.toFixed(2) || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                background: `${GOLD_MAIN}20`,
                                                                color: GOLD_LIGHT,
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Tooltip title="Edit Marks">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/admin/students/${student._id}/edit`)}
                                                                sx={{
                                                                    color: GOLD_LIGHT,
                                                                    '&:hover': {
                                                                        background: `${GOLD_MAIN}20`
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/admin/students/${student._id}`)}
                                                                sx={{
                                                                    color: '#3B82F6',
                                                                    '&:hover': {
                                                                        background: '#3B82F615'
                                                                    }
                                                                }}
                                                            >
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ color: '#94A3B8', py: 4, borderColor: `${GOLD_MAIN}20` }}>
                                                    No students found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Paper>
                        </Zoom>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12} lg={4}>
                        <Zoom in={true} timeout={1000}>
                            <Paper
                                sx={{
                                background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                                border: `1px solid ${GOLD_MAIN}30`,
                                borderRadius: 3,
                                p: 3,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                                Recent Activity
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {recentActions.map(action => (
                                    <Box
                                        key={action.id}
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            background: `${NAVY_BLUE_MAIN}60`,
                                            border: `1px solid ${GOLD_MAIN}20`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: `${NAVY_BLUE_MAIN}80`,
                                                border: `1px solid ${GOLD_MAIN}40`,
                                                transform: 'translateX(5px)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                background: action.type === 'marks' ? `${GOLD_MAIN}30` : 
                                                           action.type === 'dispute' ? '#F59E0B30' : 
                                                           action.type === 'bulk' ? '#3B82F630' : '#10B98130',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {action.type === 'marks' && <EditIcon sx={{ color: GOLD_LIGHT, fontSize: 20 }} />}
                                            {action.type === 'dispute' && <WarningIcon sx={{ color: '#F59E0B', fontSize: 20 }} />}
                                            {action.type === 'bulk' && <UploadIcon sx={{ color: '#3B82F6', fontSize: 20 }} />}
                                            {action.type === 'attendance' && <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                                                {action.action}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                                                {action.student}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 12, color: '#64748B' }} />
                                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                    {action.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            </Paper>
                        </Zoom>
                    </Grid>
                </Grid>
            </Container>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notificationMenuAnchor}
                open={Boolean(notificationMenuAnchor)}
                onClose={() => setNotificationMenuAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 360,
                        maxHeight: 400,
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2,
                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${GOLD_MAIN}20` }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Notifications
                    </Typography>
                </Box>
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <MenuItem
                            key={alert.id}
                            onClick={() => setNotificationMenuAnchor(null)}
                            sx={{
                                py: 2,
                                px: 2.5,
                                borderBottom: `1px solid ${GOLD_MAIN}10`,
                                '&:hover': {
                                    background: `${GOLD_MAIN}15`
                                }
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    {alert.type === 'warning' && <WarningIcon sx={{ color: '#F59E0B', fontSize: 20 }} />}
                                    {alert.type === 'success' && <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />}
                                    {alert.type === 'info' && <NotificationsIcon sx={{ color: '#3B82F6', fontSize: 20 }} />}
                                    <Chip
                                        label={alert.priority}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            background: alert.priority === 'high' ? '#EF444420' : 
                                                       alert.priority === 'medium' ? '#F59E0B20' : '#3B82F620',
                                            color: alert.priority === 'high' ? '#EF4444' : 
                                                  alert.priority === 'medium' ? '#F59E0B' : '#3B82F6'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                                    {alert.message}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    Just now
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography sx={{ color: '#94A3B8' }}>
                            No new notifications
                        </Typography>
                    </Box>
                )}
                <Box sx={{ p: 1.5, borderTop: `1px solid ${GOLD_MAIN}20`, textAlign: 'center' }}>
                    <Button
                        fullWidth
                        sx={{
                            color: GOLD_LIGHT,
                            textTransform: 'none',
                            '&:hover': {
                                background: `${GOLD_MAIN}15`
                            }
                        }}
                    >
                        View All Notifications
                    </Button>
                </Box>
            </Menu>

            {/* Settings Menu */}
            <Menu
                anchorEl={settingsMenuAnchor}
                open={Boolean(settingsMenuAnchor)}
                onClose={() => setSettingsMenuAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 280,
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2,
                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${GOLD_MAIN}20` }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Settings
                    </Typography>
                </Box>
                <MenuItem
                    onClick={() => {
                        setSettingsMenuAnchor(null);
                        navigate('/admin/profile');
                    }}
                    sx={{
                        py: 1.5,
                        color: 'white',
                        '&:hover': {
                            background: `${GOLD_MAIN}15`
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, background: `${GOLD_MAIN}30` }}>
                            <PeopleIcon sx={{ fontSize: 18, color: GOLD_LIGHT }} />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Profile Settings
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Manage your account
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setSettingsMenuAnchor(null);
                        navigate('/admin/preferences');
                    }}
                    sx={{
                        py: 1.5,
                        color: 'white',
                        '&:hover': {
                            background: `${GOLD_MAIN}15`
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, background: `${GOLD_MAIN}30` }}>
                            <SettingsIcon sx={{ fontSize: 18, color: GOLD_LIGHT }} />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Preferences
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Customize your experience
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setSettingsMenuAnchor(null);
                        navigate('/admin/permissions');
                    }}
                    sx={{
                        py: 1.5,
                        color: 'white',
                        '&:hover': {
                            background: `${GOLD_MAIN}15`
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, background: `${GOLD_MAIN}30` }}>
                            <SchoolIcon sx={{ fontSize: 18, color: GOLD_LIGHT }} />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Permissions
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Manage access control
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <Box sx={{ borderTop: `1px solid ${GOLD_MAIN}20`, mt: 1 }}>
                    <MenuItem
                        onClick={() => {
                            setSettingsMenuAnchor(null);
                            handleLogout();
                        }}
                        sx={{
                            py: 1.5,
                            color: '#EF4444',
                            '&:hover': {
                                background: '#EF444415'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LogoutIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Logout
                            </Typography>
                        </Box>
                    </MenuItem>
                </Box>
            </Menu>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                        border: `1px solid ${GOLD_MAIN}40`,
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: GOLD_LIGHT
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Animation keyframes */}
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 0.6;
                        }
                        50% {
                            transform: scale(1.1);
                            opacity: 0.8;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default AdminDashboard;
