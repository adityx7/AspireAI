import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";

const ProfilePage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [title, setTitle] = useState("Profile");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Shimmer background styling
    const shimmerBackground = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        color: "#F8FAFC"
    };

    // ✅ Retrieve USN safely
    
    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard" },
        { label: "Mentors", id: "mentors" },
        { label: "Documents", id: "documents" },
        { label: "Settings", id: "settings" },
        { label: "Contact Us", id: "contact-us" },
    ];
    
    const fetchUserProfile = async () => {
        // Try multiple possible keys for USN
        const usn = localStorage.getItem("userUSN") || 
                    localStorage.getItem("usn") || 
                    localStorage.getItem("studentUSN") ||
                    sessionStorage.getItem("userUSN") ||
                    sessionStorage.getItem("usn");
        
        console.log("USN found:", usn);
        console.log("All localStorage keys:", Object.keys(localStorage));
        
        if (!usn) {
            setError("Please complete your profile in Settings first, or log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5002/api/students/${usn}`);
            console.log("Profile data:", response.data);
            setUserData(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            if (error.response?.status === 404) {
                setError("Profile not found. Please update your profile in Settings.");
            } else {
                setError("Could not fetch profile. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserProfile();
    }, []); // ✅ Depend on `usn` to re-fetch if it changes

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuClick = (path) => {
        const selectedOption = sidebarOptions.find((option) => option.id === path);
        if (selectedOption) {
            setTitle(selectedOption.label);
            navigate(`/${path}`);
        }
        if (mobileOpen) setMobileOpen(false);
        setSidebarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={shimmerBackground}>
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "100vh",
                    position: "relative",
                    zIndex: 2
                }}>
                    <Box sx={{
                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                        backdropFilter: "blur(25px)",
                        border: "1px solid rgba(184, 134, 11, 0.15)",
                        borderRadius: "20px",
                        padding: "40px",
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                    }}>
                        <CircularProgress sx={{ color: "#B8860B", mb: 2 }} size={60} />
                        <Typography variant="h6" sx={{ color: "#B8860B", fontWeight: "600" }}>
                            Loading Profile...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box sx={shimmerBackground}>
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "100vh",
                    position: "relative",
                    zIndex: 2
                }}>
                    <Box sx={{
                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                        backdropFilter: "blur(25px)",
                        border: "1px solid rgba(220, 53, 69, 0.3)",
                        borderRadius: "20px",
                        padding: "40px",
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                    }}>
                        <Typography variant="h6" sx={{ color: "#dc3545", fontWeight: "600", mb: 3 }}>
                            {error || "User profile not found!"}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/settings")}
                                sx={{
                                    background: "linear-gradient(135deg, #B8860B, #DAA520)",
                                    color: "white",
                                    fontWeight: "bold",
                                    padding: "10px 30px",
                                    '&:hover': {
                                        background: "linear-gradient(135deg, #DAA520, #B8860B)",
                                    }
                                }}
                            >
                                Go to Settings
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/login")}
                                sx={{
                                    borderColor: "#B8860B",
                                    color: "#B8860B",
                                    fontWeight: "bold",
                                    padding: "10px 30px",
                                    '&:hover': {
                                        borderColor: "#DAA520",
                                        color: "#DAA520",
                                        background: "rgba(184, 134, 11, 0.1)"
                                    }
                                }}
                            >
                                Go to Login
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            ...shimmerBackground,
            // Animation classes
            '& .fade-in-up': {
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0,
                transform: 'translateY(30px)',
            },
            '& .scale-in': {
                animation: 'scaleIn 0.7s ease-out forwards',
                opacity: 0,
                transform: 'scale(0.9)',
                animationDelay: '0.2s'
            },
            '& .slide-in-right': {
                animation: 'slideInRight 0.8s ease-out forwards',
                opacity: 0,
                transform: 'translateX(30px)',
                animationDelay: '0.4s'
            },
            '& .floating-element': {
                animation: 'floating 6s ease-in-out infinite',
                transition: 'transform 0.3s ease-out'
            },
            '@keyframes fadeInUp': {
                'to': {
                    opacity: 1,
                    transform: 'translateY(0)',
                }
            },
            '@keyframes scaleIn': {
                'to': {
                    opacity: 1,
                    transform: 'scale(1)',
                }
            },
            '@keyframes slideInRight': {
                'to': {
                    opacity: 1,
                    transform: 'translateX(0)',
                }
            },
            '@keyframes floating': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '25%': { transform: 'translateY(-10px) rotate(1deg)' },
                '50%': { transform: 'translateY(-20px) rotate(0deg)' },
                '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
            }
        }}>
            {/* Animated Background Elements */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '120%',
                background: 'radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 43, 76, 0.2) 0%, transparent 50%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            
            {/* Floating Decorative Elements */}
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '15%',
                left: '10%',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '70%',
                right: '5%',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)',
                animationDelay: '2s'
            }} />
            
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                height: "100vh",
                position: "relative",
                zIndex: 2
            }}>
                {/* Navbar */}
                <Box>
                    <NavDash onDrawerToggle={handleDrawerToggle} title={title} />
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Sliding Sidebar for Desktop */}
                    <Drawer
                        variant="temporary"
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        sx={{
                            display: { xs: "none", sm: "block" },
                            '& .MuiDrawer-paper': {
                                width: 280,
                                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                                backdropFilter: "blur(25px)",
                                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                                border: "1px solid rgba(184, 134, 11, 0.15)",
                                borderLeft: "none",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }
                        }}
                    >
                        <SideBar onMenuClick={handleMenuClick} />
                    </Drawer>

                    {/* Main Content */}
                    <Box sx={{ 
                        display: "flex", 
                        flexGrow: 1, 
                        justifyContent: "center", 
                        alignItems: "center", 
                        minHeight: "80vh",
                        background: "transparent",
                        width: "100%"
                    }}>
                        <Container maxWidth="md" className="fade-in-up">
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                                    backdropFilter: "blur(25px)",
                                    border: "1px solid rgba(184, 134, 11, 0.15)",
                                    borderRadius: "24px",
                                    padding: "48px",
                                    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                                    position: "relative",
                                    overflow: "hidden",
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '1px',
                                        background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)'
                                    }
                                }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar sx={{ 
                                        width: 120, 
                                        height: 120, 
                                        mb: 3,
                                        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                        fontSize: "48px",
                                        fontWeight: "bold",
                                        boxShadow: "0 12px 40px rgba(184, 134, 11, 0.3)"
                                    }}>
                                        {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                                    </Avatar>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: "700",
                                        color: "#ffffff",
                                        mb: 1,
                                        textAlign: "center"
                                    }}>
                                        {userData.name || "N/A"}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        color: "#B8860B",
                                        textAlign: "center",
                                        fontWeight: "500"
                                    }}>
                                        {userData.collegeName || "N/A"} - {Array.isArray(userData.selectedMajors) ? userData.selectedMajors.join(", ") : (userData.selectedMajors || "N/A")}
                                    </Typography>
                                </Box>

                                <Grid container spacing={4} sx={{ mt: 4 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
                                            border: "1px solid rgba(184, 134, 11, 0.2)",
                                            borderRadius: "16px",
                                            padding: "24px",
                                            backdropFilter: "blur(10px)"
                                        }}>
                                            <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>USN:</span> {userData.usn || "N/A"}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>Email:</span> {userData.email || "N/A"}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>College Email:</span> {userData.collegeEmail || "N/A"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{
                                            background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
                                            border: "1px solid rgba(184, 134, 11, 0.2)",
                                            borderRadius: "16px",
                                            padding: "24px",
                                            backdropFilter: "blur(10px)"
                                        }}>
                                            <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>Mobile:</span> {userData.mobileNumber || "N/A"}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>Alt Mobile:</span> {userData.alternateMobileNumber || "N/A"}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>Gender:</span> {userData.gender || "N/A"}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: "600" }}>
                                                <span style={{ color: "#B8860B" }}>Date of Birth:</span> {userData.dob || "N/A"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ 
                                    mt: 4,
                                    background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
                                    border: "1px solid rgba(184, 134, 11, 0.2)",
                                    borderRadius: "16px",
                                    padding: "24px",
                                    backdropFilter: "blur(10px)"
                                }}>
                                    <Typography variant="h6" sx={{ color: "#B8860B", fontWeight: "700", mb: 2 }}>
                                        About Me
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: "#ffffff", 
                                        fontStyle: "italic",
                                        lineHeight: 1.6,
                                        fontSize: "16px"
                                    }}>
                                        {userData.shortBio || "No bio available"}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Container>
                    </Box>
                </Box>

                {/* Mobile Sidebar Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ 
                        display: { xs: "block", sm: "none" }, 
                        color: "black",
                        '& .MuiDrawer-paper': {
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                            backdropFilter: "blur(25px)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                        }
                    }}
                >
                    <SideBar onMenuClick={handleMenuClick} />
                </Drawer>
            </Box>
        </Box>
    );
};

export default ProfilePage;
