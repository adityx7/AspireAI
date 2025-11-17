import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    Button,
    IconButton,
    Tab,
    Tabs,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";

const NotificationCenterPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const userId = localStorage.getItem('usn') || localStorage.getItem('studentId');

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        filterNotifications();
    }, [tabValue, notifications]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5002/api/notifications/${userId}?limit=100`);
            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterNotifications = () => {
        switch (tabValue) {
            case 0: // All
                setFilteredNotifications(notifications);
                break;
            case 1: // Unread
                setFilteredNotifications(notifications.filter(n => !n.read));
                break;
            case 2: // Academic
                setFilteredNotifications(notifications.filter(n =>
                    ['attendance', 'internal_marks', 'semester_performance', 'exam_reminder', 'assignment'].includes(n.type)
                ));
                break;
            case 3: // Urgent
                setFilteredNotifications(notifications.filter(n =>
                    n.priority === 'urgent' || n.priority === 'high'
                ));
                break;
            default:
                setFilteredNotifications(notifications);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            await axios.put(`http://localhost:5002/api/notifications/${notification._id}/read`);
            
            // Update local state
            setNotifications(prev =>
                prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Navigate if action URL exists
            if (notification.actionUrl) {
                navigate(notification.actionUrl);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`http://localhost:5002/api/notifications/${userId}/mark-all-read`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:5002/api/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'attendance':
                return <WarningAmberIcon sx={{ color: '#ff6b6b' }} />;
            case 'internal_marks':
            case 'semester_performance':
                return <TrendingDownIcon sx={{ color: '#ff9800' }} />;
            case 'assignment':
            case 'deadline':
                return <AssignmentIcon sx={{ color: '#2196f3' }} />;
            case 'exam_reminder':
                return <EventIcon sx={{ color: '#9c27b0' }} />;
            case 'wellbeing':
                return <FavoriteIcon sx={{ color: '#e91e63' }} />;
            case 'career_development':
                return <SchoolIcon sx={{ color: '#4caf50' }} />;
            case 'mentor_alert':
                return <PersonIcon sx={{ color: GOLD_MAIN }} />;
            default:
                return <NotificationsIcon sx={{ color: '#757575' }} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return '#d32f2f';
            case 'high':
                return '#ff6b6b';
            case 'medium':
                return '#ff9800';
            case 'low':
                return '#4caf50';
            default:
                return '#757575';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'URGENT';
            case 'high':
                return 'HIGH';
            case 'medium':
                return 'MEDIUM';
            case 'low':
                return 'LOW';
            default:
                return '';
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: NAVY_BLUE_MAIN,
            pt: 4,
            pb: 6
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: GOLD_LIGHT,
                            fontWeight: 700,
                            mb: 1
                        }}
                    >
                        🔔 Notification Center
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Stay updated with your academic progress and important alerts
                    </Typography>
                </Box>

                {/* Tabs and Actions */}
                <Card sx={{
                    background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${GOLD_MAIN}30`,
                    borderRadius: 2,
                    mb: 3
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        flexWrap: 'wrap'
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-selected': {
                                        color: GOLD_LIGHT
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: GOLD_MAIN
                                }
                            }}
                        >
                            <Tab label={`All (${notifications.length})`} />
                            <Tab label={`Unread (${unreadCount})`} />
                            <Tab label="Academic" />
                            <Tab label="Urgent" />
                        </Tabs>

                        {unreadCount > 0 && (
                            <Button
                                variant="outlined"
                                startIcon={<CheckIcon />}
                                onClick={handleMarkAllRead}
                                sx={{
                                    color: GOLD_LIGHT,
                                    borderColor: GOLD_MAIN,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: GOLD_LIGHT,
                                        backgroundColor: 'rgba(184, 134, 11, 0.1)'
                                    }
                                }}
                            >
                                Mark All Read
                            </Button>
                        )}
                    </Box>
                </Card>

                {/* Notifications List */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: GOLD_MAIN }} />
                    </Box>
                ) : filteredNotifications.length === 0 ? (
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2,
                        p: 6,
                        textAlign: 'center'
                    }}>
                        <NotificationsIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            No notifications to display
                        </Typography>
                    </Card>
                ) : (
                    <List sx={{ p: 0 }}>
                        {filteredNotifications.map((notification) => (
                            <Card
                                key={notification._id}
                                sx={{
                                    mb: 2,
                                    background: notification.read
                                        ? 'linear-gradient(135deg, rgba(26, 43, 76, 0.7) 0%, rgba(10, 25, 47, 0.7) 100%)'
                                        : 'linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.95) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: `1px solid ${notification.read ? 'rgba(184, 134, 11, 0.2)' : GOLD_MAIN}`,
                                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                        border: `1px solid ${GOLD_LIGHT}`
                                    }
                                }}
                            >
                                <ListItem
                                    onClick={() => handleNotificationClick(notification)}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNotification(notification._id);
                                            }}
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                '&:hover': {
                                                    color: '#ff6b6b'
                                                }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(184, 134, 11, 0.1)',
                                            border: `2px solid ${getPriorityColor(notification.priority)}`
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: notification.read ? 400 : 600
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                <Chip
                                                    label={getPriorityLabel(notification.priority)}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 600,
                                                        bgcolor: getPriorityColor(notification.priority),
                                                        color: 'white'
                                                    }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                        mb: 1
                                                    }}
                                                >
                                                    {notification.body}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: GOLD_LIGHT }}
                                                    >
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </Typography>
                                                    {notification.actionLabel && (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                color: GOLD_LIGHT,
                                                                borderColor: GOLD_MAIN,
                                                                textTransform: 'none',
                                                                fontSize: '0.75rem',
                                                                '&:hover': {
                                                                    borderColor: GOLD_LIGHT,
                                                                    backgroundColor: 'rgba(184, 134, 11, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            {notification.actionLabel}
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                )}
            </Container>
        </Box>
    );
};

export default NotificationCenterPage;
