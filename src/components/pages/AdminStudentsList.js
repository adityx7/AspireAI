import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Pagination,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    LinearProgress,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    ArrowBack as ArrowBackIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminStudentsList = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterBranch, setFilterBranch] = useState('');
    const [filterSemester, setFilterSemester] = useState('');

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    useEffect(() => {
        fetchStudents();
    }, [page, filterBranch, filterSemester]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            
            if (filterBranch) params.append('branch', filterBranch);
            if (filterSemester) params.append('semester', filterSemester);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(
                `http://localhost:5002/api/admin/students?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setStudents(response.data.data.students);
                setTotalPages(Math.ceil(response.data.data.total / 10));
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchStudents();
    };

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
                <Fade in={true} timeout={600}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <IconButton
                            onClick={() => navigate('/admin/dashboard')}
                            sx={{
                                color: GOLD_LIGHT,
                                '&:hover': {
                                    background: `${GOLD_MAIN}20`
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                All Students
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                Manage student records and academic data
                            </Typography>
                        </Box>
                    </Box>
                </Fade>

                {/* Filters and Search */}
                <Slide direction="right" in={true} timeout={700}>
                    <Paper
                        sx={{
                            background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                            border: `1px solid ${GOLD_MAIN}30`,
                            borderRadius: 3,
                            p: 3,
                            mb: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: `${GOLD_MAIN}60`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 24px ${GOLD_MAIN}20`
                            }
                        }}
                    >
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search by name, USN, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{
                                flex: 1,
                                minWidth: '300px',
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    background: `${NAVY_BLUE_MAIN}80`,
                                    '& fieldset': { borderColor: `${GOLD_MAIN}30` },
                                    '&:hover fieldset': { borderColor: `${GOLD_LIGHT}60` },
                                    '&.Mui-focused fieldset': { borderColor: GOLD_LIGHT }
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
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel sx={{ color: '#94A3B8' }}>Branch</InputLabel>
                            <Select
                                value={filterBranch}
                                onChange={(e) => setFilterBranch(e.target.value)}
                                label="Branch"
                                sx={{
                                    color: 'white',
                                    background: `${NAVY_BLUE_MAIN}80`,
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: `${GOLD_MAIN}30` },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: `${GOLD_LIGHT}60` },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GOLD_LIGHT }
                                }}
                            >
                                <MenuItem value="">All Branches</MenuItem>
                                <MenuItem value="Computer Science and Engineering">CSE</MenuItem>
                                <MenuItem value="Information Science">ISE</MenuItem>
                                <MenuItem value="Electronics and Communication">ECE</MenuItem>
                                <MenuItem value="Mechanical Engineering">ME</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel sx={{ color: '#94A3B8' }}>Semester</InputLabel>
                            <Select
                                value={filterSemester}
                                onChange={(e) => setFilterSemester(e.target.value)}
                                label="Semester"
                                sx={{
                                    color: 'white',
                                    background: `${NAVY_BLUE_MAIN}80`,
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: `${GOLD_MAIN}30` },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: `${GOLD_LIGHT}60` },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GOLD_LIGHT }
                                }}
                            >
                                <MenuItem value="">All Semesters</MenuItem>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MAIN})`
                                }
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                    </Paper>
                </Slide>

                {/* Students Table */}
                <Grow in={true} timeout={900}>
                    <Paper
                    sx={{
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    {loading ? (
                        <Box sx={{ p: 4 }}>
                            <LinearProgress
                                sx={{
                                    backgroundColor: `${GOLD_MAIN}30`,
                                    '& .MuiLinearProgress-bar': { backgroundColor: GOLD_LIGHT }
                                }}
                            />
                            <Typography sx={{ color: 'white', textAlign: 'center', mt: 2 }}>
                                Loading students...
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: `${NAVY_BLUE_MAIN}60` }}>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Student
                                            </TableCell>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                USN
                                            </TableCell>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Email
                                            </TableCell>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Branch
                                            </TableCell>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                CGPA
                                            </TableCell>
                                            <TableCell sx={{ color: GOLD_LIGHT, fontWeight: 600, borderColor: `${GOLD_MAIN}20` }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.length > 0 ? (
                                            students.map((student, index) => (
                                                <TableRow
                                                    key={student._id}
                                                    sx={{
                                                        animation: `slideInLeft 0.4s ease-out ${index * 0.05}s both`,
                                                        '@keyframes slideInLeft': {
                                                            from: {
                                                                opacity: 0,
                                                                transform: 'translateX(-20px)'
                                                            },
                                                            to: {
                                                                opacity: 1,
                                                                transform: 'translateX(0)'
                                                            }
                                                        },
                                                        '&:hover': {
                                                            background: `${GOLD_MAIN}10`,
                                                            transform: 'scale(1.01)',
                                                            transition: 'all 0.2s ease'
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ color: 'white', borderColor: `${GOLD_MAIN}20` }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar
                                                                sx={{
                                                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                                                    width: 36,
                                                                    height: 36,
                                                                    fontSize: 14
                                                                }}
                                                            >
                                                                {student.name?.charAt(0) || 'S'}
                                                            </Avatar>
                                                            {student.name || 'N/A'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8', borderColor: `${GOLD_MAIN}20` }}>
                                                        {student.usn}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8', borderColor: `${GOLD_MAIN}20` }}>
                                                        {student.email || 'N/A'}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#94A3B8', borderColor: `${GOLD_MAIN}20` }}>
                                                        <Chip
                                                            label={student.selectedMajors || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                background: `${GOLD_MAIN}20`,
                                                                color: GOLD_LIGHT,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Chip
                                                            label={student.academics?.overallCGPA?.toFixed(2) || 'N/A'}
                                                            size="small"
                                                            sx={{
                                                                background: `${GOLD_MAIN}30`,
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ borderColor: `${GOLD_MAIN}20` }}>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/admin/students/${student._id}`)}
                                                                sx={{
                                                                    color: '#3B82F6',
                                                                    '&:hover': { background: '#3B82F615' }
                                                                }}
                                                            >
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit Marks">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/admin/students/${student._id}/edit`)}
                                                                sx={{
                                                                    color: GOLD_LIGHT,
                                                                    '&:hover': { background: `${GOLD_MAIN}20` }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    align="center"
                                                    sx={{ color: '#94A3B8', py: 8, borderColor: `${GOLD_MAIN}20` }}
                                                >
                                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                                        No students found
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Try adjusting your search or filters
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Fade in={true} timeout={1200}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={(e, value) => setPage(value)}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: 'white',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': { 
                                                        background: `${GOLD_MAIN}20`,
                                                        transform: 'scale(1.1)'
                                                    }
                                                },
                                                '& .Mui-selected': {
                                                    background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT}) !important`,
                                                    color: 'white',
                                                    transform: 'scale(1.15)'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Fade>
                            )}
                        </>
                    )}
                    </Paper>
                </Grow>
            </Container>
        </Box>
    );
};

export default AdminStudentsList;
