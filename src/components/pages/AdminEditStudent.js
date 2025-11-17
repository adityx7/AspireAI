import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    IconButton,
    Alert
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditStudent = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

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
                            onClick={() => navigate(`/admin/students/${studentId}`)}
                            sx={{
                                color: GOLD_LIGHT,
                                '&:hover': { background: `${GOLD_MAIN}20` }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                Edit Student Marks
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                Update student academic records and marks
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
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

                <Paper
                    sx={{
                        background: `linear-gradient(135deg, ${NAVY_BLUE_LIGHT} 0%, ${NAVY_BLUE_LIGHTER} 100%)`,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        minHeight: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                            📝 Marks Editor
                        </Typography>
                        <Typography sx={{ color: '#94A3B8', mb: 3 }}>
                            Full marks editing interface will be implemented here.
                            <br />
                            This will include course-wise marks entry, IA marks, lab marks, external marks, etc.
                        </Typography>
                        <Alert severity="info" sx={{ 
                            background: '#3B82F615',
                            color: '#60A5FA',
                            border: '1px solid #3B82F640',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            Coming Soon: Full marks management system with course selection, mark entry, 
                            automatic SGPA/CGPA calculation, and validation.
                        </Alert>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminEditStudent;
