import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Container,
    Button,
    Alert,
    TextField,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import axios from 'axios';

const NAVY_BLUE_MAIN = "#0A192F";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

const MeetingNotesTestPage = () => {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    
    const [mentorID, setMentorID] = useState('BNM0001');
    const [studentUSNs, setStudentUSNs] = useState('1BG22CS001,1BG22CS002,1BG22CS003');

    // Test: Assign mentees to mentor
    const assignMentees = async () => {
        try {
            const response = await axios.post('http://localhost:5002/api/mentor/assign-mentees', {
                mentorID,
                menteeUSNs: studentUSNs.split(',').map(usn => usn.trim())
            });
            setResult(JSON.stringify(response.data, null, 2));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setResult('');
        }
    };

    // Test: Create sample meeting note
    const createSampleMeetingNote = async () => {
        try {
            const response = await axios.post('http://localhost:5002/api/meeting-notes', {
                mentorID,
                studentUSN: studentUSNs.split(',')[0].trim(),
                meetingDate: new Date().toISOString(),
                summary: "Discussed student's progress in Data Structures and Algorithms. Good understanding of concepts but needs more practice with complex problems.",
                actionItems: [
                    {
                        item: "Complete 5 medium-level problems on LeetCode",
                        priority: "High",
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: "Pending"
                    },
                    {
                        item: "Review tree traversal algorithms",
                        priority: "Medium",
                        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                        status: "Pending"
                    }
                ],
                mentorNotes: "Student shows enthusiasm but struggles with time complexity analysis. Recommend additional study materials.",
                nextMeetingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                tags: ["Academic", "Programming", "DSA"]
            });
            setResult(JSON.stringify(response.data, null, 2));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setResult('');
        }
    };

    // Test: Get mentor's meeting notes
    const getMentorNotes = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/meeting-notes/mentor/${mentorID}`);
            setResult(JSON.stringify(response.data, null, 2));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setResult('');
        }
    };

    // Test: Get student's meeting notes
    const getStudentNotes = async () => {
        try {
            const studentUSN = studentUSNs.split(',')[0].trim();
            const response = await axios.get(`http://localhost:5002/api/meeting-notes/student/${studentUSN}`);
            setResult(JSON.stringify(response.data, null, 2));
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setResult('');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
            py: 4 
        }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                    Meeting Notes Module - Test Page
                </Typography>

                {/* Input Controls */}
                <Paper sx={{ 
                    p: 3, 
                    mb: 3,
                    background: 'rgba(248, 250, 252, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(248, 250, 252, 0.1)'
                }}>
                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2 }}>
                        Test Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mentor ID"
                                value={mentorID}
                                onChange={(e) => setMentorID(e.target.value)}
                                sx={{ 
                                    '& .MuiInputBase-input': { color: '#F8FAFC' },
                                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(248, 250, 252, 0.3)'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Student USNs (comma-separated)"
                                value={studentUSNs}
                                onChange={(e) => setStudentUSNs(e.target.value)}
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
                </Paper>

                {/* Test Buttons */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={assignMentees}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold',
                                py: 1.5
                            }}
                        >
                            1. Assign Mentees
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={createSampleMeetingNote}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold',
                                py: 1.5
                            }}
                        >
                            2. Create Sample Note
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={getMentorNotes}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold',
                                py: 1.5
                            }}
                        >
                            3. Get Mentor Notes
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={getStudentNotes}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: '#0A192F',
                                fontWeight: 'bold',
                                py: 1.5
                            }}
                        >
                            4. Get Student Notes
                        </Button>
                    </Grid>
                </Grid>

                {/* Results */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Paper sx={{ 
                        p: 3,
                        background: 'rgba(248, 250, 252, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(248, 250, 252, 0.1)'
                    }}>
                        <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2 }}>
                            API Response:
                        </Typography>
                        <pre style={{ 
                            color: '#94A3B8', 
                            fontSize: '0.875rem',
                            overflow: 'auto',
                            maxHeight: '400px',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            padding: '16px',
                            borderRadius: '8px'
                        }}>
                            {result}
                        </pre>
                    </Paper>
                )}

                {/* Instructions */}
                <Paper sx={{ 
                    p: 3, 
                    mt: 3,
                    background: 'rgba(248, 250, 252, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(248, 250, 252, 0.1)'
                }}>
                    <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2 }}>
                        Testing Instructions:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                        <strong>Step 1:</strong> Click "Assign Mentees" to assign students to the mentor
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                        <strong>Step 2:</strong> Click "Create Sample Note" to create a meeting note with action items
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                        <strong>Step 3:</strong> Click "Get Mentor Notes" to verify the note was created
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                        <strong>Step 4:</strong> Click "Get Student Notes" to see the student's view
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(248, 250, 252, 0.2)' }} />
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        After testing the APIs, navigate to:
                        <br />• <strong>/mentor-meeting-notes</strong> (Mentor view)
                        <br />• <strong>/meeting-notes</strong> (Student view)
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default MeetingNotesTestPage;