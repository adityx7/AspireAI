import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBarMentor";
import NavDash from "../organisms/NavMentor";

// Gold and Indigo Theme Colors
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

// Keyframe animations
const fadeInUp = {
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

const scaleIn = {
  '@keyframes scaleIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
};

const pulse = {
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
  },
};

const shimmer = {
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-1000px 0',
    },
    '100%': {
      backgroundPosition: '1000px 0',
    },
  },
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
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
                sx={{ 
                    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
                    ...pulse,
                }}
            >
                <CircularProgress 
                    sx={{ 
                        color: GOLD_LIGHT,
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }} 
                />
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
                sx={{ 
                    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
                    ...fadeInUp,
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: GOLD_LIGHT,
                        animation: 'fadeInUp 0.6s ease-out',
                    }}
                >
                    {error || "Mentor profile not found!"}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100vh",
            background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
        }}>
            <NavDash onDrawerToggle={handleDrawerToggle} title={title} />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Box sx={{ 
                    width: 250, 
                    background: "rgba(10, 25, 47, 0.95)", 
                    boxShadow: `2px 0px 15px rgba(184, 134, 11, 0.2)`, 
                    display: { xs: "none", sm: "block" },
                    borderRight: `1px solid rgba(184, 134, 11, 0.3)`,
                }}>
                    <SideBar onMenuClick={handleMenuClick} />
                </Box>

                <Box sx={{ 
                    display: "flex", 
                    flexGrow: 1, 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "80vh",
                    ...fadeInUp,
                }}>
                    <Container maxWidth="md">
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                borderRadius: 3,
                                background: `rgba(17, 34, 64, 0.8)`,
                                backdropFilter: 'blur(10px)',
                                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${GOLD_MAIN}40`,
                                border: `1px solid ${GOLD_MAIN}30`,
                                animation: 'fadeInUp 0.6s ease-out',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px ${GOLD_MAIN}60`,
                                    transform: 'translateY(-5px)',
                                },
                                ...scaleIn,
                            }}
                        >
                            <Box 
                                display="flex" 
                                flexDirection="column" 
                                alignItems="center"
                                sx={{
                                    animation: 'scaleIn 0.8s ease-out 0.2s both',
                                }}
                            >
                                <Avatar 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        mb: 2,
                                        background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                        color: NAVY_BLUE_MAIN,
                                        fontSize: "2.5rem",
                                        fontWeight: "bold",
                                        boxShadow: `0 4px 15px ${GOLD_MAIN}60`,
                                        animation: 'scaleIn 1s ease-out 0.4s both',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                            boxShadow: `0 6px 20px ${GOLD_MAIN}80`,
                                        },
                                    }}
                                >
                                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "?"}
                                </Avatar>
                                <Typography 
                                    variant="h5" 
                                    fontWeight="bold"
                                    sx={{ 
                                        color: GOLD_LIGHT,
                                        textShadow: `0 0 10px ${GOLD_MAIN}40`,
                                        animation: 'fadeInUp 0.8s ease-out 0.5s both',
                                    }}
                                >
                                    {userData.fullName || "N/A"}
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        color: "rgba(255, 255, 255, 0.7)",
                                        animation: 'fadeInUp 0.8s ease-out 0.6s both',
                                    }}
                                >
                                    {userData.employeeIn || "N/A"} - {userData.selectedMajors?.join(", ") || "N/A"}
                                </Typography>
                            </Box>

                            <Grid 
                                container 
                                spacing={3} 
                                sx={{ 
                                    mt: 3,
                                    animation: 'fadeInUp 0.8s ease-out 0.7s both',
                                }}
                            >
                                <Grid item xs={12} sm={6}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 0.8s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Mentor ID:</strong> {userData.mentorID || "N/A"}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 0.9s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Name:</strong> {userData.fullName || "N/A"}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 1s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Email:</strong> {userData.email || "N/A"}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 1.1s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Employee In: </strong> {userData.employeeIn || "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 1.2s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Mobile:</strong> {userData.phoneNumber || "N/A"}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 1.3s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Alt Mobile:</strong> {userData.alternatePhoneNumber || "N/A"}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: "white", 
                                            mb: 1,
                                            animation: 'fadeInUp 0.8s ease-out 1.4s both',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateX(5px)',
                                                color: GOLD_LIGHT,
                                            }
                                        }}
                                    >
                                        <strong style={{ color: GOLD_LIGHT }}>Gender:</strong> {userData.gender || "N/A"}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box 
                                mt={3}
                                sx={{
                                    animation: 'fadeInUp 0.8s ease-out 1.5s both',
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        color: GOLD_LIGHT,
                                        fontWeight: "bold",
                                        animation: 'fadeInUp 0.8s ease-out 1.6s both',
                                        position: 'relative',
                                        paddingBottom: '8px',
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '60px',
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                                            animation: 'fadeInUp 0.8s ease-out 1.7s both',
                                        }
                                    }}
                                >
                                    About Me
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mt: 1, 
                                        fontStyle: "italic",
                                        color: "rgba(255, 255, 255, 0.8)",
                                        animation: 'fadeInUp 0.8s ease-out 1.8s both',
                                        padding: '12px',
                                        borderLeft: `3px solid ${GOLD_MAIN}40`,
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderLeftColor: GOLD_MAIN,
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            transform: 'translateX(5px)',
                                        }
                                    }}
                                >
                                    {userData.bio || "No bio available"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ 
                    display: { xs: "block", sm: "none" },
                    '& .MuiDrawer-paper': {
                        background: "rgba(10, 25, 47, 0.98)",
                        backdropFilter: 'blur(10px)',
                        borderRight: `1px solid rgba(184, 134, 11, 0.3)`,
                    }
                }}
            >
                <SideBar onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default MentorProfile;
