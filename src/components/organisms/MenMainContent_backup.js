import React from "react";
import { Box, Typography, Divider, Card, CardContent, Grid, IconButton, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Tick icon
import CancelIcon from "@mui/icons-material/Cancel"; // Cross icon

export default function MentorTrainingPage() {
    // Array of student details
    const trainingModules = [
        {
            title: "Student 1",
            description: "Student Details from Database.",
        },
        {
            title: "Student 2",
            description: "Student Details from Database.",
        },
        {
            title: "Student 3",
            description: "Student Details from Database.",
        },
    ];

    const handleAccept = (studentName) => {
        console.log(`${studentName} accepted`);
        // Add logic for accepting the student
    };

    const handleReject = (studentName) => {
        console.log(`${studentName} rejected`);
        // Add logic for rejecting the student
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header Section with Glassmorphism */}
            <Paper 
                elevation={0} 
                sx={{ 
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: 6,
                    p: 4, 
                    mb: 3,
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 24px 4px #ff8c0088",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff",
                    textAlign: "center"
                }}
            >
                <Typography variant="h4" component="h1" sx={{ 
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    color: "#fff", 
                    fontWeight: 700,
                    textShadow: "0 2px 8px rgba(26,35,126,0.3)",
                    mb: 2
                }}>
                    Mentor Training
                </Typography>
                <Typography variant="body1" sx={{ 
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "1.1rem",
                    lineHeight: 1.6
                }}>
                    The below optional training modules provide additional information about what is expected of you as
                    a mentor and what you can expect from AspireAI; the tools and resources available to you as an AspireAI
                    mentor; and other helpful information to make your mentoring experience a success!
                </Typography>

                <Divider sx={{ margin: "30px 0", borderColor: "rgba(255,255,255,0.3)" }} />

                {/* Student Cards Section */}
                <Grid container spacing={3} justifyContent="center">
                    {trainingModules.map((module, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    background: "rgba(255,255,255,0.12)",
                                    borderRadius: 4,
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    boxShadow: "0 4px 16px rgba(31, 38, 135, 0.25)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 25px rgba(31, 38, 135, 0.4)",
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: "center", p: 3 }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: "#fff", 
                                            fontWeight: 600, 
                                            mb: 1.5,
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                        }}
                                    >
                                        {module.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: "rgba(255,255,255,0.8)", 
                                            mb: 3,
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                        }}
                                    >
                                        {module.description}
                                    </Typography>
                                    
                                    {/* Action Buttons */}
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                        <IconButton
                                            onClick={() => handleAccept(module.title)}
                                            sx={{
                                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                                color: "#4CAF50",
                                                border: "1px solid rgba(76, 175, 80, 0.3)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(76, 175, 80, 0.3)",
                                                    transform: "scale(1.1)",
                                                },
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleReject(module.title)}
                                            sx={{
                                                backgroundColor: "rgba(244, 67, 54, 0.2)",
                                                color: "#f44336",
                                                border: "1px solid rgba(244, 67, 54, 0.3)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(244, 67, 54, 0.3)",
                                                    transform: "scale(1.1)",
                                                },
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
                </Typography>

                {/* Subheading */}
                <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontFamily: 'Gilroy', textAlign: "center" }}>
                        The below optional training modules provide additional information about what is expected of you as
                        a mentor and what you can expect from AspireAI; the tools and resources available to you as an AspireAI
                        mentor; and other helpful information to make your mentoring experience a success!
                    </Typography>
                </Box>

                {/* Divider */}
                <Divider sx={{ mb: 3 }} />

                {/* Cards Section */}
                <Grid container spacing={4} justifyContent={'center'} alignItems={'stretch'}>
                    {trainingModules.map((module, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    height: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    justifyContent: "space-between",
                                }}
                            >
                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{ textAlign: "center", fontSize: 16, fontFamily: "courier" }}
                                    >
                                        {module.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "justify", fontSize: 14, fontFamily: 'gilroy' }}>
                                        {module.description}
                                    </Typography>
                                </CardContent>

                                {/* Action Buttons */}
                                <Box sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleAccept(module.title)}
                                        sx={{ bgcolor: "lightblue", "&:hover": { bgcolor: "blue", color: "white" } }}
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleReject(module.title)}
                                        sx={{ bgcolor: "lightcoral", "&:hover": { bgcolor: "red", color: "white" } }}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
