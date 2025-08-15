import React from "react";
import { Box, Typography, Divider, Card, CardContent, Grid, IconButton } from "@mui/material";
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: "80%", md: "70%", lg: "100%" },
                    height: '50%',
                }}
            >
                {/* Heading */}
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, mt: 4, fontFamily: 'Courier', textAlign: "center" }}>
                    Mentor Training
                </Typography>

                {/* Subheading */}
                <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontFamily: 'Gilroy', textAlign: "center" }}>
                        The below optional training modules provide additional information about what is expected of you as
                        a mentor and what you can expect from Career Compass; the tools and resources available to you as a Career Compass
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
