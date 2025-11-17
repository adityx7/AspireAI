import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Switch,
    IconButton,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Button,
    Snackbar,
    Alert,
    Grid,
    Fade,
    Grow,
    Slide,
    Zoom
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Notifications as NotificationsIcon,
    Palette as PaletteIcon,
    Language as LanguageIcon,
    ViewModule as ViewModuleIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPreferences = () => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [preferences, setPreferences] = useState({
        notifications: {
            email: true,
            push: true,
            studentRegistration: true,
            markUpdates: true,
            disputes: true
        },
        display: {
            theme: 'dark',
            language: 'en',
            itemsPerPage: 10,
            dateFormat: 'DD/MM/YYYY'
        }
    });

    const NAVY_BLUE_MAIN = '#0A192F';
    const NAVY_BLUE_LIGHT = '#112240';
    const NAVY_BLUE_LIGHTER = '#1A365D';
    const GOLD_MAIN = '#B8860B';
    const GOLD_LIGHT = '#DAA520';

    useEffect(() => {
        // Load preferences from localStorage
        const saved = localStorage.getItem('adminPreferences');
        if (saved) {
            setPreferences(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('adminPreferences', JSON.stringify(preferences));
        setSnackbar({ 
            open: true, 
            message: '✅ Preferences saved successfully!', 
            severity: 'success' 
        });
    };

    const handleNotificationChange = (key) => {
        setPreferences(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleDisplayChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            display: {
                ...prev.display,
                [key]: value
            }
        }));
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
                                    Preferences
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Customize your experience
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
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
                            Save Preferences
                        </Button>
                    </Box>
                </Fade>

                <Grid container spacing={3}>
                    {/* Notification Settings */}
                    <Grid item xs={12} md={6}>
                        <Slide in={true} direction="right" timeout={700}>
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
                                <NotificationsIcon sx={{ color: GOLD_LIGHT, fontSize: 28 }} />
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                    Notifications
                                </Typography>
                            </Box>

                            <Grow in={true} timeout={900}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.notifications.email}
                                            onChange={() => handleNotificationChange('email')}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    transition: 'all 0.3s ease'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: GOLD_LIGHT,
                                                    transform: 'translateX(20px) scale(1.1)',
                                                    '&:hover': { backgroundColor: `${GOLD_MAIN}20` }
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: GOLD_MAIN,
                                                    boxShadow: `0 0 10px ${GOLD_MAIN}60`
                                                },
                                                '& .MuiSwitch-track': {
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    }
                                    label="Email Notifications"
                                    sx={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        mb: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            color: GOLD_LIGHT
                                        }
                                    }}
                                />
                            </Grow>

                            <Grow in={true} timeout={1000}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.notifications.push}
                                            onChange={() => handleNotificationChange('push')}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    transition: 'all 0.3s ease'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: GOLD_LIGHT,
                                                    transform: 'translateX(20px) scale(1.1)',
                                                    '&:hover': { backgroundColor: `${GOLD_MAIN}20` }
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: GOLD_MAIN,
                                                    boxShadow: `0 0 10px ${GOLD_MAIN}60`
                                                },
                                                '& .MuiSwitch-track': {
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    }
                                    label="Push Notifications"
                                    sx={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        mb: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            color: GOLD_LIGHT
                                        }
                                    }}
                                />
                            </Grow>

                            <Divider sx={{ my: 2, borderColor: `${GOLD_MAIN}20` }} />

                            <Typography variant="subtitle2" sx={{ color: '#94A3B8', mb: 2 }}>
                                Notification Types
                            </Typography>

                            <Grow in={true} timeout={1100}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.notifications.studentRegistration}
                                            onChange={() => handleNotificationChange('studentRegistration')}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    transition: 'all 0.3s ease'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: GOLD_LIGHT,
                                                    transform: 'translateX(20px) scale(1.1)',
                                                    '&:hover': { backgroundColor: `${GOLD_MAIN}20` }
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: GOLD_MAIN,
                                                    boxShadow: `0 0 10px ${GOLD_MAIN}60`
                                                },
                                                '& .MuiSwitch-track': {
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    }
                                    label="Student Registration Alerts"
                                    sx={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        mb: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            color: GOLD_LIGHT
                                        }
                                    }}
                                />
                            </Grow>

                            <Grow in={true} timeout={1200}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.notifications.markUpdates}
                                            onChange={() => handleNotificationChange('markUpdates')}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    transition: 'all 0.3s ease'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: GOLD_LIGHT,
                                                    transform: 'translateX(20px) scale(1.1)',
                                                    '&:hover': { backgroundColor: `${GOLD_MAIN}20` }
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: GOLD_MAIN,
                                                    boxShadow: `0 0 10px ${GOLD_MAIN}60`
                                                },
                                                '& .MuiSwitch-track': {
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    }
                                    label="Mark Update Confirmations"
                                    sx={{ 
                                        color: 'white', 
                                        display: 'block', 
                                        mb: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            color: GOLD_LIGHT
                                        }
                                    }}
                                />
                            </Grow>

                            <Grow in={true} timeout={1300}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.notifications.disputes}
                                            onChange={() => handleNotificationChange('disputes')}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    transition: 'all 0.3s ease'
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: GOLD_LIGHT,
                                                    transform: 'translateX(20px) scale(1.1)',
                                                    '&:hover': { backgroundColor: `${GOLD_MAIN}20` }
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: GOLD_MAIN,
                                                    boxShadow: `0 0 10px ${GOLD_MAIN}60`
                                                },
                                                '& .MuiSwitch-track': {
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    }
                                    label="Dispute Notifications"
                                    sx={{ 
                                        color: 'white', 
                                        display: 'block',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            color: GOLD_LIGHT
                                        }
                                    }}
                                />
                            </Grow>
                            </Paper>
                        </Slide>
                    </Grid>

                    {/* Display Settings */}
                    <Grid item xs={12} md={6}>
                        <Slide in={true} direction="left" timeout={700}>
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
                                <PaletteIcon sx={{ color: GOLD_LIGHT, fontSize: 28 }} />
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                    Display Settings
                                </Typography>
                            </Box>

                            <Zoom in={true} timeout={900}>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel sx={{ color: '#94A3B8' }}>Theme</InputLabel>
                                    <Select
                                        value={preferences.display.theme}
                                        onChange={(e) => handleDisplayChange('theme', e.target.value)}
                                        sx={{
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: `${GOLD_MAIN}40`,
                                                transition: 'all 0.3s ease'
                                            },
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                }
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: GOLD_MAIN,
                                                boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                            }
                                        }}
                                    >
                                        <MenuItem value="dark">Dark (Current)</MenuItem>
                                        <MenuItem value="light" disabled>Light (Coming Soon)</MenuItem>
                                        <MenuItem value="auto" disabled>Auto (Coming Soon)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Zoom>

                            <Zoom in={true} timeout={1000}>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel sx={{ color: '#94A3B8' }}>Language</InputLabel>
                                    <Select
                                        value={preferences.display.language}
                                        onChange={(e) => handleDisplayChange('language', e.target.value)}
                                        startAdornment={<LanguageIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: `${GOLD_MAIN}40`,
                                                transition: 'all 0.3s ease'
                                            },
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                }
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: GOLD_MAIN,
                                                boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                            }
                                        }}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="hi" disabled>हिन्दी (Coming Soon)</MenuItem>
                                        <MenuItem value="kn" disabled>ಕನ್ನಡ (Coming Soon)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Zoom>

                            <Zoom in={true} timeout={1100}>
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel sx={{ color: '#94A3B8' }}>Items Per Page</InputLabel>
                                    <Select
                                        value={preferences.display.itemsPerPage}
                                        onChange={(e) => handleDisplayChange('itemsPerPage', e.target.value)}
                                        startAdornment={<ViewModuleIcon sx={{ color: GOLD_LIGHT, mr: 1 }} />}
                                        sx={{
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: `${GOLD_MAIN}40`,
                                                transition: 'all 0.3s ease'
                                            },
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                }
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: GOLD_MAIN,
                                                boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                            }
                                        }}
                                    >
                                    <MenuItem value={5}>5 items</MenuItem>
                                    <MenuItem value={10}>10 items</MenuItem>
                                    <MenuItem value={25}>25 items</MenuItem>
                                        <MenuItem value={50}>50 items</MenuItem>
                                    </Select>
                                </FormControl>
                            </Zoom>

                            <Zoom in={true} timeout={1200}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#94A3B8' }}>Date Format</InputLabel>
                                    <Select
                                        value={preferences.display.dateFormat}
                                        onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                                        sx={{
                                            color: 'white',
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: `${GOLD_MAIN}40`,
                                                transition: 'all 0.3s ease'
                                            },
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: `${GOLD_MAIN}60`,
                                                    boxShadow: `0 0 8px ${GOLD_MAIN}30`
                                                }
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: GOLD_MAIN,
                                                boxShadow: `0 0 12px ${GOLD_MAIN}40`
                                            }
                                        }}
                                    >
                                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                    </Select>
                                </FormControl>
                            </Zoom>
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

export default AdminPreferences;
