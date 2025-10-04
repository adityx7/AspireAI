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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Fab,
    Menu,
    MenuList,
    MenuItem as MenuItemComponent,
    ListItemAvatar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    MoreVert as MoreVertIcon,
    TaskAlt as TaskIcon,
    Schedule as ScheduleIcon,
    Notes as NotesIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';

// Theme colors
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#172A45";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

const MentorMeetingNotes = () => {
    const [mentees, setMentees] = useState([]);
    const [meetingNotes, setMeetingNotes] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Dialog states
    const [openNoteDialog, setOpenNoteDialog] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    
    // Form data
    const [noteForm, setNoteForm] = useState({
        studentUSN: '',
        meetingDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        summary: '',
        mentorNotes: '',
        nextMeetingDate: '',
        tags: [],
        actionItems: []
    });
    
    // Action item form
    const [newActionItem, setNewActionItem] = useState({
        item: '',
        priority: 'Medium',
        dueDate: ''
    });

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedNoteForMenu, setSelectedNoteForMenu] = useState(null);

    const mentorID = localStorage.getItem('mentorID');

    useEffect(() => {
        fetchMentees();
        fetchMeetingNotes();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            fetchMeetingNotes(selectedStudent);
        } else {
            fetchMeetingNotes();
        }
    }, [selectedStudent]);

    const fetchMentees = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/mentor/${mentorID}/mentees`);
            setMentees(response.data.mentees);
        } catch (error) {
            console.error('Error fetching mentees:', error);
            setError('Failed to fetch mentees');
        }
    };

    const fetchMeetingNotes = async (studentUSN = null) => {
        try {
            setLoading(true);
            const url = studentUSN 
                ? `http://localhost:5002/api/meeting-notes/mentor/${mentorID}?studentUSN=${studentUSN}`
                : `http://localhost:5002/api/meeting-notes/mentor/${mentorID}`;
            
            const response = await axios.get(url);
            setMeetingNotes(response.data.meetingNotes);
        } catch (error) {
            console.error('Error fetching meeting notes:', error);
            setError('Failed to fetch meeting notes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = () => {
        setEditingNote(null);
        setNoteForm({
            studentUSN: selectedStudent || '',
            meetingDate: new Date().toISOString().split('T')[0],
            summary: '',
            mentorNotes: '',
            nextMeetingDate: '',
            tags: [],
            actionItems: []
        });
        setOpenNoteDialog(true);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setNoteForm({
            studentUSN: note.studentUSN,
            meetingDate: new Date(note.meetingDate).toISOString().split('T')[0],
            summary: note.summary,
            mentorNotes: note.mentorNotes || '',
            nextMeetingDate: note.nextMeetingDate ? new Date(note.nextMeetingDate).toISOString().split('T')[0] : '',
            tags: note.tags || [],
            actionItems: note.actionItems || []
        });
        setOpenNoteDialog(true);
        setMenuAnchor(null);
    };

    const handleDeleteNote = async () => {
        try {
            await axios.delete(`http://localhost:5002/api/meeting-notes/${noteToDelete._id}`, {
                data: { mentorID }
            });
            setSuccess('Meeting note deleted successfully');
            setOpenDeleteDialog(false);
            setNoteToDelete(null);
            fetchMeetingNotes(selectedStudent);
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete meeting note');
        }
    };

    const handleSaveNote = async () => {
        try {
            if (!noteForm.studentUSN || !noteForm.summary) {
                setError('Please select a student and enter a summary');
                return;
            }

            const noteData = {
                ...noteForm,
                mentorID,
                meetingDate: new Date(noteForm.meetingDate).toISOString(),
                nextMeetingDate: noteForm.nextMeetingDate ? new Date(noteForm.nextMeetingDate).toISOString() : null
            };

            if (editingNote) {
                await axios.put(`http://localhost:5002/api/meeting-notes/${editingNote._id}`, noteData);
                setSuccess('Meeting note updated successfully');
            } else {
                await axios.post('http://localhost:5002/api/meeting-notes', noteData);
                setSuccess('Meeting note created successfully');
            }

            setOpenNoteDialog(false);
            fetchMeetingNotes(selectedStudent);
        } catch (error) {
            console.error('Error saving note:', error);
            setError('Failed to save meeting note');
        }
    };

    const addActionItem = () => {
        if (newActionItem.item.trim()) {
            setNoteForm(prev => ({
                ...prev,
                actionItems: [...prev.actionItems, {
                    ...newActionItem,
                    dueDate: newActionItem.dueDate ? new Date(newActionItem.dueDate).toISOString() : null,
                    status: 'Pending'
                }]
            }));
            setNewActionItem({ item: '', priority: 'Medium', dueDate: '' });
        }
    };

    const removeActionItem = (index) => {
        setNoteForm(prev => ({
            ...prev,
            actionItems: prev.actionItems.filter((_, i) => i !== index)
        }));
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
                        Meeting Notes & Action Items
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                        Track meetings and assign action items to your mentees
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

                {/* Controls */}
                <Paper sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: 'rgba(248, 250, 252, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(248, 250, 252, 0.1)'
                }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#94A3B8' }}>Filter by Student</InputLabel>
                                <Select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    sx={{ 
                                        color: '#F8FAFC',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                        }
                                    }}
                                >
                                    <MenuItem value="">All Students</MenuItem>
                                    {mentees.map((mentee) => (
                                        <MenuItem key={mentee.usn} value={mentee.usn}>
                                            {mentee.name} ({mentee.usn})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateNote}
                                    sx={{
                                        background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                        color: '#0A192F',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
                                        }
                                    }}
                                >
                                    Add Meeting Note
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

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
                                        Start by creating your first meeting note
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            meetingNotes.map((note) => (
                                <Grid item xs={12} lg={6} key={note._id}>
                                    <Card sx={{ 
                                        background: 'rgba(248, 250, 252, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(248, 250, 252, 0.1)',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 32px rgba(184, 134, 11, 0.2)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: GOLD_MAIN, 
                                                        color: NAVY_BLUE_MAIN, 
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}>
                                                        {note.studentName ? note.studentName.charAt(0) : 'S'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                                                            {note.studentName || 'Unknown Student'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                            USN: {note.studentUSN}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton
                                                    onClick={(e) => {
                                                        setMenuAnchor(e.currentTarget);
                                                        setSelectedNoteForMenu(note);
                                                    }}
                                                    sx={{ color: '#94A3B8' }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Meeting Details */}
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarIcon sx={{ color: GOLD_MAIN, mr: 1, fontSize: 20 }} />
                                                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                        Meeting Date: {formatDate(note.meetingDate)}
                                                    </Typography>
                                                </Box>
                                                {note.nextMeetingDate && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <ScheduleIcon sx={{ color: GOLD_MAIN, mr: 1, fontSize: 20 }} />
                                                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                                            Next Meeting: {formatDate(note.nextMeetingDate)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Summary */}
                                            <Typography variant="body1" sx={{ color: '#F8FAFC', mb: 2, lineHeight: 1.6 }}>
                                                {note.summary}
                                            </Typography>

                                            {/* Tags */}
                                            {note.tags && note.tags.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
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

                                            {/* Action Items */}
                                            {note.actionItems && note.actionItems.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#F8FAFC', mb: 1, fontWeight: 'bold' }}>
                                                        Action Items ({note.actionItems.length})
                                                    </Typography>
                                                    <List dense>
                                                        {note.actionItems.slice(0, 3).map((item, index) => (
                                                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                                    <TaskIcon sx={{ 
                                                                        color: getStatusColor(item.status), 
                                                                        fontSize: 20 
                                                                    }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography variant="body2" sx={{ color: '#F8FAFC' }}>
                                                                            {item.item}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                                                                        </Box>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        ))}
                                                        {note.actionItems.length > 3 && (
                                                            <ListItem sx={{ px: 0 }}>
                                                                <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                                                                    +{note.actionItems.length - 3} more items...
                                                                </Typography>
                                                            </ListItem>
                                                        )}
                                                    </List>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

                {/* Menu for Note Actions */}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                >
                    <MenuItemComponent
                        onClick={() => handleEditNote(selectedNoteForMenu)}
                        sx={{ color: '#0A192F' }}
                    >
                        <EditIcon sx={{ mr: 1 }} />
                        Edit Note
                    </MenuItemComponent>
                    <MenuItemComponent
                        onClick={() => {
                            setNoteToDelete(selectedNoteForMenu);
                            setOpenDeleteDialog(true);
                            setMenuAnchor(null);
                        }}
                        sx={{ color: '#f44336' }}
                    >
                        <DeleteIcon sx={{ mr: 1 }} />
                        Delete Note
                    </MenuItemComponent>
                </Menu>

                {/* Note Dialog */}
                <Dialog 
                    open={openNoteDialog} 
                    onClose={() => setOpenNoteDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: NAVY_BLUE_MAIN, color: '#F8FAFC' }}>
                        {editingNote ? 'Edit Meeting Note' : 'Add New Meeting Note'}
                    </DialogTitle>
                    <DialogContent sx={{ bgcolor: NAVY_BLUE_LIGHT, color: '#F8FAFC', mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#94A3B8' }}>Select Student</InputLabel>
                                    <Select
                                        value={noteForm.studentUSN}
                                        onChange={(e) => setNoteForm(prev => ({ ...prev, studentUSN: e.target.value }))}
                                        sx={{ 
                                            color: '#F8FAFC',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(248, 250, 252, 0.3)'
                                            }
                                        }}
                                    >
                                        {mentees.map((mentee) => (
                                            <MenuItem key={mentee.usn} value={mentee.usn}>
                                                {mentee.name} ({mentee.usn})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Meeting Date"
                                    value={noteForm.meetingDate}
                                    onChange={(e) => setNoteForm(prev => ({ ...prev, meetingDate: e.target.value }))}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        '& .MuiInputBase-input': { color: '#F8FAFC' },
                                        '& .MuiInputLabel-root': { color: '#94A3B8' },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Meeting Summary"
                                    value={noteForm.summary}
                                    onChange={(e) => setNoteForm(prev => ({ ...prev, summary: e.target.value }))}
                                    sx={{ 
                                        '& .MuiInputBase-input': { color: '#F8FAFC' },
                                        '& .MuiInputLabel-root': { color: '#94A3B8' },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Additional Mentor Notes"
                                    value={noteForm.mentorNotes}
                                    onChange={(e) => setNoteForm(prev => ({ ...prev, mentorNotes: e.target.value }))}
                                    sx={{ 
                                        '& .MuiInputBase-input': { color: '#F8FAFC' },
                                        '& .MuiInputLabel-root': { color: '#94A3B8' },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Next Meeting Date (Optional)"
                                    value={noteForm.nextMeetingDate}
                                    onChange={(e) => setNoteForm(prev => ({ ...prev, nextMeetingDate: e.target.value }))}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ 
                                        '& .MuiInputBase-input': { color: '#F8FAFC' },
                                        '& .MuiInputLabel-root': { color: '#94A3B8' },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                        }
                                    }}
                                />
                            </Grid>
                            
                            {/* Action Items Section */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2, borderColor: 'rgba(248, 250, 252, 0.2)' }} />
                                <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2 }}>
                                    Action Items
                                </Typography>
                                
                                {/* Add Action Item */}
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Action Item"
                                                value={newActionItem.item}
                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, item: e.target.value }))}
                                                sx={{ 
                                                    '& .MuiInputBase-input': { color: '#F8FAFC' },
                                                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(248, 250, 252, 0.3)'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ color: '#94A3B8' }}>Priority</InputLabel>
                                                <Select
                                                    value={newActionItem.priority}
                                                    onChange={(e) => setNewActionItem(prev => ({ ...prev, priority: e.target.value }))}
                                                    sx={{ 
                                                        color: '#F8FAFC',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(248, 250, 252, 0.3)'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="High">High</MenuItem>
                                                    <MenuItem value="Medium">Medium</MenuItem>
                                                    <MenuItem value="Low">Low</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Due Date (Optional)"
                                                value={newActionItem.dueDate}
                                                onChange={(e) => setNewActionItem(prev => ({ ...prev, dueDate: e.target.value }))}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ 
                                                    '& .MuiInputBase-input': { color: '#F8FAFC' },
                                                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(248, 250, 252, 0.3)'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={addActionItem}
                                                sx={{ 
                                                    height: '56px',
                                                    borderColor: GOLD_MAIN,
                                                    color: GOLD_MAIN,
                                                    '&:hover': {
                                                        borderColor: GOLD_LIGHT,
                                                        backgroundColor: `${GOLD_MAIN}20`
                                                    }
                                                }}
                                            >
                                                Add Item
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Action Items List */}
                                {noteForm.actionItems.length > 0 && (
                                    <List sx={{ bgcolor: 'rgba(248, 250, 252, 0.05)', borderRadius: 1, p: 1 }}>
                                        {noteForm.actionItems.map((item, index) => (
                                            <ListItem key={index} sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body1" sx={{ color: '#F8FAFC' }}>
                                                            {item.item}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Chip
                                                            label={item.priority}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getPriorityColor(item.priority),
                                                                color: 'white',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    }
                                                />
                                                <IconButton
                                                    onClick={() => removeActionItem(index)}
                                                    sx={{ color: '#f44336' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: NAVY_BLUE_LIGHT, p: 2 }}>
                        <Button 
                            onClick={() => setOpenNoteDialog(false)}
                            sx={{ color: '#94A3B8' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSaveNote}
                            variant="contained"
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold'
                            }}
                        >
                            {editingNote ? 'Update Note' : 'Create Note'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle sx={{ bgcolor: NAVY_BLUE_MAIN, color: '#F8FAFC' }}>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent sx={{ bgcolor: NAVY_BLUE_LIGHT, color: '#F8FAFC', mt: 2 }}>
                        <Typography>
                            Are you sure you want to delete this meeting note? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: NAVY_BLUE_LIGHT, p: 2 }}>
                        <Button 
                            onClick={() => setOpenDeleteDialog(false)}
                            sx={{ color: '#94A3B8' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDeleteNote}
                            variant="contained"
                            color="error"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default MentorMeetingNotes;