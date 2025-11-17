import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Chip,
    LinearProgress,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    School as SchoolIcon,
    EmojiEvents as TrophyIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Assessment as AssessmentIcon,
    Download as DownloadIcon,
    Print as PrintIcon
} from '@mui/icons-material';

const NAVY_DARK = '#0A192F';
const NAVY_MID = '#112240';
const NAVY_LIGHT = '#1A365D';
const GOLD_DARK = '#B8860B';
const GOLD_MAIN = '#DAA520';
const GOLD_LIGHT = '#FFD700';

const StatCard = ({ title, value, icon, trend, trendValue, color, delay = 0 }) => (
    <Zoom in={true} timeout={500 + delay}>
        <Card 
            sx={{ 
                background: NAVY_MID,
                border: `1px solid ${color}30`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${color}20`,
                    borderColor: color
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                mb: 1
                            }}
                        >
                            {value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {trend === 'up' ? (
                                <TrendingUpIcon sx={{ fontSize: 18, color: '#10B981' }} />
                            ) : (
                                <TrendingDownIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                            )}
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: trend === 'up' ? '#10B981' : '#EF4444',
                                    fontWeight: 600
                                }}
                            >
                                {trendValue}
                            </Typography>
                        </Box>
                    </Box>
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            background: `${color}15`
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    </Zoom>
);

const PerformanceBar = ({ label, value, max, color }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 500 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: GOLD_LIGHT, fontWeight: 600 }}>
                {value}/{max}
            </Typography>
        </Box>
        <LinearProgress 
            variant="determinate" 
            value={(value / max) * 100}
            sx={{
                height: 8,
                borderRadius: 4,
                background: NAVY_LIGHT,
                '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${color} 0%, ${color}AA 100%)`,
                    borderRadius: 4
                }
            }}
        />
    </Box>
);

const AdminReports = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('month');
    const [reportType, setReportType] = useState('overview');

    const overviewStats = {
        totalStudents: 2847,
        averageGPA: 7.8,
        passRate: 92.3,
        atRiskStudents: 145
    };

    const branchPerformance = [
        { name: 'Computer Science', students: 850, avgGPA: 8.2 },
        { name: 'Information Science', students: 720, avgGPA: 7.9 },
        { name: 'Electronics', students: 650, avgGPA: 7.6 },
        { name: 'Mechanical', students: 627, avgGPA: 7.4 }
    ];

    const semesterDistribution = [
        { semester: 1, students: 350, passing: 325 },
        { semester: 2, students: 365, passing: 340 },
        { semester: 3, students: 380, passing: 355 },
        { semester: 4, students: 370, passing: 348 },
        { semester: 5, students: 360, passing: 342 },
        { semester: 6, students: 355, passing: 335 },
        { semester: 7, students: 345, passing: 328 },
        { semester: 8, students: 322, passing: 310 }
    ];

    const topPerformers = [
        { rank: 1, name: 'Aditya Kumar', usn: '1MS21CS001', gpa: 9.8, branch: 'CSE' },
        { rank: 2, name: 'Priya Sharma', usn: '1MS21IS023', gpa: 9.7, branch: 'ISE' },
        { rank: 3, name: 'Rahul Verma', usn: '1MS21EC045', gpa: 9.6, branch: 'ECE' },
        { rank: 4, name: 'Sneha Patel', usn: '1MS21CS089', gpa: 9.5, branch: 'CSE' },
        { rank: 5, name: 'Arjun Singh', usn: '1MS21ME012', gpa: 9.4, branch: 'MECH' }
    ];

    const handleExport = () => {
        // Export functionality
        console.log('Exporting report...');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 100%)`,
            p: 4
        }}>
            {/* Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                            onClick={() => navigate('/admin/dashboard')}
                            sx={{ 
                                color: GOLD_LIGHT,
                                mr: 2,
                                '&:hover': { background: `${GOLD_MAIN}15` }
                            }}
                        >
                            <BackIcon />
                        </IconButton>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            📊 Analytics & Reports
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{
                                borderColor: GOLD_MAIN,
                                color: GOLD_LIGHT,
                                '&:hover': {
                                    borderColor: GOLD_LIGHT,
                                    background: `${GOLD_MAIN}15`
                                }
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{
                                borderColor: GOLD_MAIN,
                                color: GOLD_LIGHT,
                                '&:hover': {
                                    borderColor: GOLD_LIGHT,
                                    background: `${GOLD_MAIN}15`
                                }
                            }}
                        >
                            Print
                        </Button>
                    </Box>
                </Box>
            </Fade>

            {/* Filters */}
            <Slide direction="right" in={true} timeout={700}>
                <Paper sx={{ 
                    p: 3, 
                    mb: 3,
                    background: NAVY_MID,
                    border: `1px solid ${GOLD_MAIN}30`,
                    borderRadius: 2
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#94A3B8' }}>Time Range</InputLabel>
                                <Select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    label="Time Range"
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: `${GOLD_MAIN}30`
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: GOLD_MAIN
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: GOLD_LIGHT
                                        }
                                    }}
                                >
                                    <MenuItem value="week">Last Week</MenuItem>
                                    <MenuItem value="month">Last Month</MenuItem>
                                    <MenuItem value="semester">This Semester</MenuItem>
                                    <MenuItem value="year">This Year</MenuItem>
                                    <MenuItem value="all">All Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#94A3B8' }}>Report Type</InputLabel>
                                <Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    label="Report Type"
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: `${GOLD_MAIN}30`
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: GOLD_MAIN
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: GOLD_LIGHT
                                        }
                                    }}
                                >
                                    <MenuItem value="overview">Overview</MenuItem>
                                    <MenuItem value="performance">Performance Analysis</MenuItem>
                                    <MenuItem value="attendance">Attendance Report</MenuItem>
                                    <MenuItem value="risk">Risk Assessment</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            </Slide>

            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Students"
                        value={overviewStats.totalStudents.toLocaleString()}
                        icon={<SchoolIcon sx={{ fontSize: 28, color: GOLD_MAIN }} />}
                        trend="up"
                        trendValue="+12.5%"
                        color={GOLD_MAIN}
                        delay={0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Average GPA"
                        value={overviewStats.averageGPA.toFixed(1)}
                        icon={<TrophyIcon sx={{ fontSize: 28, color: '#10B981' }} />}
                        trend="up"
                        trendValue="+0.3"
                        color="#10B981"
                        delay={100}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pass Rate"
                        value={`${overviewStats.passRate}%`}
                        icon={<CheckIcon sx={{ fontSize: 28, color: '#3B82F6' }} />}
                        trend="up"
                        trendValue="+2.1%"
                        color="#3B82F6"
                        delay={200}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="At-Risk Students"
                        value={overviewStats.atRiskStudents}
                        icon={<WarningIcon sx={{ fontSize: 28, color: '#F59E0B' }} />}
                        trend="down"
                        trendValue="-8.4%"
                        color="#F59E0B"
                        delay={300}
                    />
                </Grid>
            </Grid>

            {/* Branch Performance */}
            <Grow in={true} timeout={900}>
                <Paper sx={{ 
                    p: 3, 
                    mb: 3,
                    background: NAVY_MID,
                    border: `1px solid ${GOLD_MAIN}30`,
                    borderRadius: 2
                }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: GOLD_LIGHT,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <AssessmentIcon />
                        Branch-wise Performance
                    </Typography>
                    
                    {branchPerformance.map((branch, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                                    {branch.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip 
                                        label={`${branch.students} students`}
                                        size="small"
                                        sx={{ 
                                            background: NAVY_LIGHT,
                                            color: '#94A3B8',
                                            fontWeight: 600
                                        }}
                                    />
                                    <Chip 
                                        label={`GPA: ${branch.avgGPA}`}
                                        size="small"
                                        sx={{ 
                                            background: `${GOLD_MAIN}20`,
                                            color: GOLD_LIGHT,
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(branch.avgGPA / 10) * 100}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    background: NAVY_LIGHT,
                                    '& .MuiLinearProgress-bar': {
                                        background: `linear-gradient(90deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                        borderRadius: 5
                                    }
                                }}
                            />
                        </Box>
                    ))}
                </Paper>
            </Grow>

            <Grid container spacing={3}>
                {/* Semester Distribution */}
                <Grid item xs={12} md={6}>
                    <Slide direction="right" in={true} timeout={1000}>
                        <Paper sx={{ 
                            p: 3,
                            background: NAVY_MID,
                            border: `1px solid ${GOLD_MAIN}30`,
                            borderRadius: 2,
                            height: '100%'
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: GOLD_LIGHT,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <SchoolIcon />
                                Semester-wise Distribution
                            </Typography>
                            
                            {semesterDistribution.map((sem, index) => {
                                const passPercentage = (sem.passing / sem.students) * 100;
                                return (
                                    <PerformanceBar
                                        key={index}
                                        label={`Semester ${sem.semester}`}
                                        value={sem.passing}
                                        max={sem.students}
                                        color={passPercentage >= 90 ? '#10B981' : passPercentage >= 75 ? GOLD_MAIN : '#F59E0B'}
                                    />
                                );
                            })}
                        </Paper>
                    </Slide>
                </Grid>

                {/* Top Performers */}
                <Grid item xs={12} md={6}>
                    <Slide direction="left" in={true} timeout={1000}>
                        <Paper sx={{ 
                            p: 3,
                            background: NAVY_MID,
                            border: `1px solid ${GOLD_MAIN}30`,
                            borderRadius: 2,
                            height: '100%'
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: GOLD_LIGHT,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <TrophyIcon />
                                Top Performers
                            </Typography>
                            
                            {topPerformers.map((student, index) => (
                                <Box 
                                    key={index}
                                    sx={{ 
                                        p: 2,
                                        mb: 2,
                                        background: index === 0 ? `${GOLD_MAIN}10` : NAVY_LIGHT,
                                        border: index === 0 ? `1px solid ${GOLD_MAIN}` : `1px solid ${NAVY_LIGHT}`,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(4px)',
                                            borderColor: GOLD_MAIN
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box 
                                            sx={{ 
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: index === 0 ? `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)` :
                                                           index === 1 ? '#C0C0C0' :
                                                           index === 2 ? '#CD7F32' :
                                                           NAVY_DARK,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700
                                            }}
                                        >
                                            {student.rank}
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                                {student.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                                                {student.usn} • {student.branch}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip 
                                        label={`GPA: ${student.gpa}`}
                                        sx={{ 
                                            background: `${GOLD_MAIN}20`,
                                            color: GOLD_LIGHT,
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Paper>
                    </Slide>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminReports;
