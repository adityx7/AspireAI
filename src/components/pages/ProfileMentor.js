import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBarMentor";
import NavDash from "../organisms/NavMentor";

// Updated background style to match navy blue and gold theme
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
    position: "relative",
    overflow: "hidden",
};

// Shimmer overlay for subtle gold effect
const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
    animation: "shimmer 2.5s infinite linear",
    zIndex: 0,
    pointerEvents: "none",
};

const MentorProfile = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Mentor Profile");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard-mentor" },
        { label: "Settings", id: "settings-mentor" },
        { label: "Contact Us", id: "contact-mentor" },
        { label: "Profile", id: "profile-mentor" },
    ];

    // ✅ Fetch Mentor Profile
    const fetchMentorProfile = async () => {
        const mentorID = localStorage.getItem("mentorID"); // Make sure 'mentorID' is stored during login
        console.log(mentorID);
        if (!mentorID) {
            setError("Mentor ID not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5002/api/mentors/${mentorID}`);
            console.log(response.data);
            setUserData({
                ...response.data,
                selectedMajors: Array.isArray(response.data.selectedMajors)
                    ? response.data.selectedMajors
                    : response.data.selectedMajors ? [response.data.selectedMajors] : []
            });
        } catch (error) {
            console.error("Error fetching mentor profile:", error);
            setError("Could not fetch profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentorProfile();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (path) => {
        const selectedOption = sidebarOptions.find((option) => option.id === path);
        if (selectedOption) {
            setTitle(selectedOption.label);
            navigate(`/${path}`);
        }
    };

    if (loading) {
        return (
            <Box sx={shimmerBackground}>
                <Box sx={shimmerOverlay} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: "relative", zIndex: 1 }}>
                    <CircularProgress sx={{ color: "#ffd700" }} />
                </Box>
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box sx={shimmerBackground}>
                <Box sx={shimmerOverlay} />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h6" sx={{ 
                        color: "#ef4444", 
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        textAlign: "center"
                    }}>
                        {error || "Mentor profile not found!"}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={shimmerBackground}>
            <Box sx={shimmerOverlay} />
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative", zIndex: 1 }}>
                <NavDash onDrawerToggle={handleDrawerToggle} title={title} />

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    <Box sx={{ 
                        width: 250, 
                        background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                        backdropFilter: "blur(10px)", 
                        boxShadow: "2px 0px 15px rgba(255,215,0,0.2)", 
                        display: { xs: "none", sm: "block" }, 
                        border: "1px solid rgba(255,215,0,0.3)",
                        borderRadius: "0 8px 8px 0"
                    }}>
                        <SideBar onMenuClick={handleMenuClick} />
                    </Box>

                    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                        <Container maxWidth="md">
                            <Paper 
                                elevation={8}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: "24px",
                                    background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                                    backdropFilter: "blur(10px)",
                                    WebkitBackdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,215,0,0.3)",
                                    boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
                                    color: "#e2e8f0",
                                }}
                            >
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar sx={{ 
                                    width: 100, 
                                    height: 100, 
                                    mb: 2,
                                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                                    color: "#1e3a8a",
                                    boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                    border: "2px solid rgba(255,215,0,0.6)",
                                    fontSize: "2rem",
                                    fontWeight: 700,
                                }}>
                                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "?"}
                                </Avatar>
                                <Typography 
                                    variant="h5" 
                                    fontWeight="bold"
                                    sx={{ 
                                        color: "#ffd700",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                        letterSpacing: "0.5px",
                                        mb: 1
                                    }}
                                >
                                    {userData.fullName || "N/A"}
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{
                                        color: "#e2e8f0",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                        textAlign: "center"
                                    }}
                                >
                                    {userData.employeeIn || "N/A"} - {userData.selectedMajors?.join(", ") || "N/A"}
                                </Typography>
                            </Box>

                            <Grid container spacing={3} sx={{ mt: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ 
                                        background: "linear-gradient(120deg, rgba(15,23,42,0.8) 0%, rgba(30,58,138,0.6) 100%)",
                                        borderRadius: "16px",
                                        p: 3,
                                        backdropFilter: "blur(6px)",
                                        border: "1px solid rgba(255,215,0,0.3)",
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.2)"
                                    }}>
                                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Mentor ID:</strong> {userData.mentorID || "N/A"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Name:</strong> {userData.fullName || "N/A"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Email:</strong> {userData.email || "N/A"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Employee In:</strong> {userData.employeeIn || "N/A"}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ 
                                        background: "linear-gradient(120deg, rgba(15,23,42,0.8) 0%, rgba(30,58,138,0.6) 100%)",
                                        borderRadius: "16px",
                                        p: 3,
                                        backdropFilter: "blur(6px)",
                                        border: "1px solid rgba(255,215,0,0.3)",
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.2)"
                                    }}>
                                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Mobile:</strong> {userData.phoneNumber || "N/A"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Alt Mobile:</strong> {userData.alternatePhoneNumber || "N/A"}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: "#e2e8f0", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                                            <strong style={{ color: "#ffd700" }}>Gender:</strong> {userData.gender || "N/A"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Box sx={{ 
                                    background: "linear-gradient(120deg, rgba(15,23,42,0.8) 0%, rgba(30,58,138,0.6) 100%)",
                                    borderRadius: "16px",
                                    p: 3,
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid rgba(255,215,0,0.3)",
                                    boxShadow: "0 4px 16px rgba(255,215,0,0.2)"
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: "#ffd700",
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            fontWeight: 600,
                                            mb: 2,
                                            borderBottom: "2px solid rgba(255,215,0,0.6)",
                                            pb: 1
                                        }}
                                    >
                                        About Me
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            mt: 1, 
                                            fontStyle: "italic",
                                            color: "#e2e8f0",
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {userData.bio || "No bio available"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ 
                    keepMounted: true,
                    sx: {
                        "& .MuiDrawer-paper": {
                            background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                            border: "1px solid rgba(255,215,0,0.3)",
                            boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
                        }
                    }
                }}
                sx={{ 
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
                    }
                }}
            >
                <SideBar onMenuClick={handleMenuClick} />
            </Drawer>
            </Box>

            {/* Add the shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100vw); }
                }
            `}</style>
        </Box>
    );
};

export default MentorProfile;
