import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Container,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    Divider,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    TaskAlt as TaskIcon,
    Schedule as ScheduleIcon,
    Notes as NotesIcon,
    TrendingUp as TrendingUpIcon,
    ExpandMore as ExpandMoreIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as AccessTimeIcon,
    PlayArrow as PlayArrowIcon,
    Edit as EditIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

// Theme colors
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#172A45";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

const StudentMeetingNotes = () => {
    const [meetingNotes, setMeetingNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Action item update dialog
    const [openActionDialog, setOpenActionDialog] = useState(false);
    const [selectedActionItem, setSelectedActionItem] = useState(null);
    const [actionItemForm, setActionItemForm] = useState({
        status: '',
        studentNotes: ''
    });

    const [expandedNotes, setExpandedNotes] = useState({});

    const studentUSN = localStorage.getItem('usn'); // Assuming USN is stored in localStorage

    useEffect(() => {
        fetchMeetingNotes();
    }, []);

    const fetchMeetingNotes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5002/api/meeting-notes/student/${studentUSN}`);
            setMeetingNotes(response.data.meetingNotes);
        } catch (error) {
            console.error('Error fetching meeting notes:', error);
            setError('Failed to fetch meeting notes');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateActionItem = async () => {
        try {
            if (!selectedActionItem) return;

            await axios.put(
                `http://localhost:5002/api/meeting-notes/${selectedActionItem.noteId}/action-item/${selectedActionItem.index}`,
                {
                    studentUSN,
                    status: actionItemForm.status,
                    studentNotes: actionItemForm.studentNotes
                }
            );

            setSuccess('Action item updated successfully');
            setOpenActionDialog(false);
            setSelectedActionItem(null);
            fetchMeetingNotes();
        } catch (error) {
            console.error('Error updating action item:', error);
            setError('Failed to update action item');
        }
    };

    const openActionItemDialog = (note, actionItem, index) => {
        setSelectedActionItem({
            noteId: note._id,
            index,
            ...actionItem
        });
        setActionItemForm({
            status: actionItem.status,
            studentNotes: actionItem.studentNotes || ''
        });
        setOpenActionDialog(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#f44336';
            case 'Medium': return '#ff9800';
            case 'Low': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#4caf50';
            case 'In Progress': return '#ff9800';
            case 'Pending': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircleIcon />;
            case 'In Progress': return <PlayArrowIcon />;
            case 'Pending': return <AccessTimeIcon />;
            default: return <AccessTimeIcon />;
        }
    };

    const calculateProgress = (actionItems) => {
        if (!actionItems || actionItems.length === 0) return 0;
        const completed = actionItems.filter(item => item.status === 'Completed').length;
        return (completed / actionItems.length) * 100;
    };

    const toggleNoteExpansion = (noteId) => {
        setExpandedNotes(prev => ({
            ...prev,
            [noteId]: !prev[noteId]
        }));
    };

    // Get statistics
    const getStatistics = () => {
        const totalActionItems = meetingNotes.reduce((total, note) => total + (note.actionItems?.length || 0), 0);
        const completedItems = meetingNotes.reduce((total, note) => 
            total + (note.actionItems?.filter(item => item.status === 'Completed').length || 0), 0
        );
        const pendingItems = meetingNotes.reduce((total, note) => 
            total + (note.actionItems?.filter(item => item.status === 'Pending').length || 0), 0
        );
        const inProgressItems = meetingNotes.reduce((total, note) => 
            total + (note.actionItems?.filter(item => item.status === 'In Progress').length || 0), 0
        );

        return {
            totalMeetings: meetingNotes.length,
            totalActionItems,
            completedItems,
            pendingItems,
            inProgressItems,
            completionRate: totalActionItems > 0 ? (completedItems / totalActionItems) * 100 : 0
        };
    };

    const stats = getStatistics();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
            py: 4 
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 2 }}>
                        Mentor Meeting Notes & Action Items
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                        Track your progress on mentor-assigned action items and review meeting discussions
                    </Typography>
                </Box>

                {/* Alerts */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: `linear-gradient(135deg, ${GOLD_MAIN}20, ${GOLD_LIGHT}20)`,
                            border: `1px solid ${GOLD_MAIN}40`
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <CalendarIcon sx={{ fontSize: 40, color: GOLD_MAIN, mb: 1 }} />
                                <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                    {stats.totalMeetings}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Total Meetings
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: `linear-gradient(135deg, #4caf5020, #4caf5040)`,
                            border: `1px solid #4caf5060`
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                                <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                    {stats.completedItems}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Completed Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: `linear-gradient(135deg, #ff980020, #ff980040)`,
                            border: `1px solid #ff980060`
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <PlayArrowIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                                <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                    {stats.inProgressItems}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    In Progress
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: `linear-gradient(135deg, #f4433620, #f4433640)`,
                            border: `1px solid #f4433660`
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <AccessTimeIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                                <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                    {stats.pendingItems}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                    Pending Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Overall Progress */}
                {stats.totalActionItems > 0 && (
                    <Paper sx={{ 
                        p: 3, 
                        mb: 3,
                        background: 'rgba(248, 250, 252, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(248, 250, 252, 0.1)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUpIcon sx={{ color: GOLD_MAIN, mr: 2 }} />
                            <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                Overall Progress
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={stats.completionRate}
                                sx={{
                                    flex: 1,
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'rgba(248, 250, 252, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        background: `linear-gradient(90deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`
                                    }
                                }}
                            />
                            <Typography variant="h6" sx={{ color: GOLD_MAIN, fontWeight: 'bold' }}>
                                {Math.round(stats.completionRate)}%
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>
                            {stats.completedItems} of {stats.totalActionItems} action items completed
                        </Typography>
                    </Paper>
                )}

                {/* Meeting Notes List */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: GOLD_MAIN }} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {meetingNotes.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper sx={{ 
                                    p: 4, 
                                    textAlign: 'center',
                                    background: 'rgba(248, 250, 252, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(248, 250, 252, 0.1)'
                                }}>
                                    <NotesIcon sx={{ fontSize: 64, color: '#64748B', mb: 2 }} />
                                    <Typography variant="h6" sx={{ color: '#94A3B8', mb: 1 }}>
                                        No meeting notes found
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                                        Your mentor hasn't added any meeting notes yet
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            meetingNotes.map((note) => (
                                <Grid item xs={12} key={note._id}>
                                    <Accordion 
                                        expanded={expandedNotes[note._id] || false}
                                        onChange={() => toggleNoteExpansion(note._id)}
                                        sx={{ 
                                            background: 'rgba(248, 250, 252, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(248, 250, 252, 0.1)',
                                            borderRadius: 2,
                                            '&:before': { display: 'none' },
                                            mb: 2
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: GOLD_MAIN }} />}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: GOLD_MAIN, 
                                                    color: NAVY_BLUE_MAIN, 
                                                    mr: 2,
                                                    width: 48,
                                                    height: 48
                                                }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                                        Meeting with {note.mentorName || 'Your Mentor'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                        {formatDate(note.meetingDate)} • {note.actionItems?.length || 0} action items
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right', mr: 2 }}>
                                                    {note.actionItems && note.actionItems.length > 0 && (
                                                        <>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={calculateProgress(note.actionItems)}
                                                                sx={{
                                                                    width: 100,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: 'rgba(248, 250, 252, 0.1)',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        background: `linear-gradient(90deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`
                                                                    }
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
                                                                {Math.round(calculateProgress(note.actionItems))}% Complete
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ pl: 8 }}>
                                                {/* Meeting Details */}
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 'bold' }}>
                                                        Meeting Summary
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: '#F8FAFC', lineHeight: 1.6, mb: 2 }}>
                                                        {note.summary}
                                                    </Typography>
                                                    
                                                    {note.mentorNotes && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Typography variant="subtitle2" sx={{ color: GOLD_MAIN, mb: 1 }}>
                                                                Additional Notes:
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                                                {note.mentorNotes}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {note.nextMeetingDate && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                            <ScheduleIcon sx={{ color: GOLD_MAIN, mr: 1, fontSize: 20 }} />
                                                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                                Next Meeting: {formatDate(note.nextMeetingDate)}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {/* Tags */}
                                                    {note.tags && note.tags.length > 0 && (
                                                        <Box sx={{ mt: 2 }}>
                                                            {note.tags.map((tag, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={tag}
                                                                    size="small"
                                                                    sx={{
                                                                        mr: 1,
                                                                        mb: 1,
                                                                        background: `linear-gradient(135deg, ${GOLD_MAIN}20, ${GOLD_LIGHT}20)`,
                                                                        color: GOLD_LIGHT,
                                                                        border: `1px solid ${GOLD_MAIN}40`
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Action Items */}
                                                {note.actionItems && note.actionItems.length > 0 && (
                                                    <Box>
                                                        <Divider sx={{ my: 2, borderColor: 'rgba(248, 250, 252, 0.2)' }} />
                                                        <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2, fontWeight: 'bold' }}>
                                                            Action Items ({note.actionItems.length})
                                                        </Typography>
                                                        <List>
                                                            {note.actionItems.map((item, index) => (
                                                                <ListItem 
                                                                    key={index} 
                                                                    sx={{ 
                                                                        mb: 1, 
                                                                        bgcolor: 'rgba(248, 250, 252, 0.03)', 
                                                                        borderRadius: 1,
                                                                        border: '1px solid rgba(248, 250, 252, 0.05)'
                                                                    }}
                                                                >
                                                                    <ListItemIcon>
                                                                        {React.cloneElement(getStatusIcon(item.status), {
                                                                            sx: { color: getStatusColor(item.status) }
                                                                        })}
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography variant="body1" sx={{ color: '#F8FAFC', fontWeight: 'medium' }}>
                                                                                {item.item}
                                                                            </Typography>
                                                                        }
                                                                        secondary={
                                                                            <Box sx={{ mt: 1 }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                                    <Chip
                                                                                        label={item.status}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            bgcolor: getStatusColor(item.status),
                                                                                            color: 'white',
                                                                                            fontSize: '0.7rem',
                                                                                            height: 20
                                                                                        }}
                                                                                    />
                                                                                    <Chip
                                                                                        label={item.priority}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            bgcolor: getPriorityColor(item.priority),
                                                                                            color: 'white',
                                                                                            fontSize: '0.7rem',
                                                                                            height: 20
                                                                                        }}
                                                                                    />
                                                                                    {item.dueDate && (
                                                                                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                                                            Due: {formatDate(item.dueDate)}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                                {item.studentNotes && (
                                                                                    <Typography variant="body2" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                                                                        Your notes: {item.studentNotes}
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        }
                                                                    />
                                                                    <IconButton
                                                                        onClick={() => openActionItemDialog(note, item, index)}
                                                                        sx={{ 
                                                                            color: GOLD_MAIN,
                                                                            '&:hover': { bgcolor: `${GOLD_MAIN}20` }
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                )}
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

                {/* Action Item Update Dialog */}
                <Dialog 
                    open={openActionDialog} 
                    onClose={() => setOpenActionDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: NAVY_BLUE_MAIN, color: '#F8FAFC' }}>
                        Update Action Item
                    </DialogTitle>
                    <DialogContent sx={{ bgcolor: NAVY_BLUE_LIGHT, color: '#F8FAFC', mt: 2 }}>
                        {selectedActionItem && (
                            <>
                                <Typography variant="body1" sx={{ mb: 3, color: '#F8FAFC' }}>
                                    <strong>Task:</strong> {selectedActionItem.item}
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel sx={{ color: '#94A3B8' }}>Status</InputLabel>
                                            <Select
                                                value={actionItemForm.status}
                                                onChange={(e) => setActionItemForm(prev => ({ ...prev, status: e.target.value }))}
                                                sx={{ 
                                                    color: '#F8FAFC',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(248, 250, 252, 0.3)'
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Your Notes (Optional)"
                                            value={actionItemForm.studentNotes}
                                            onChange={(e) => setActionItemForm(prev => ({ ...prev, studentNotes: e.target.value }))}
                                            placeholder="Add any progress notes, challenges, or completion details..."
                                            sx={{ 
                                                '& .MuiInputBase-input': { color: '#F8FAFC' },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(248, 250, 252, 0.3)'
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: NAVY_BLUE_LIGHT, p: 2 }}>
                        <Button 
                            onClick={() => setOpenActionDialog(false)}
                            sx={{ color: '#94A3B8' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateActionItem}
                            variant="contained"
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold'
                            }}
                        >
                            Update Status
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default StudentMeetingNotes;