import React, { useState, useEffect } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import MentorPage from "../organisms/MentorsContent";

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC",
    '& .fade-in-up': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(60px)'
      }
    },
    '& .scale-in': {
      opacity: 1,
      transform: 'scale(1) rotateZ(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0.3,
        transform: 'scale(0.7) rotateZ(-5deg)'
      }
    },
    '& .floating-element': {
      animation: 'floating 6s ease-in-out infinite',
      transition: 'transform 0.3s ease-out'
    },
    '@keyframes floating': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '25%': { transform: 'translateY(-10px) rotate(1deg)' },
      '50%': { transform: 'translateY(-20px) rotate(0deg)' },
      '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' }
    }
};

const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(184, 134, 11, 0.1) 0%, rgba(26, 43, 76, 0.2) 100%)",
    animation: "shimmer 3s infinite linear",
    zIndex: 0,
    pointerEvents: "none",
};

const Mentors = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path

    useEffect(() => {
        // Trigger animations on page load
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.fade-in-up, .scale-in');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 200);
            });
        }, 300);
    }, []);

    // Function to derive the title based on the current path
    const getTitleFromPath = () => {
        const path = location.pathname.slice(1); // Remove the leading "/"
        return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard"; // Capitalize the first letter or default to "Dashboard"
    };

    const handleMenuClick = (menu) => {
        navigate(`/${menu.toLowerCase()}`);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={shimmerBackground}>
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
                top: '10%',
                left: '5%',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '60%',
                right: '8%',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)',
                animationDelay: '2s'
            }} />

            <Box sx={{ ...shimmerOverlay }} />
            
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                height: "100vh",
                position: "relative",
                zIndex: 2
            }}>
                {/* Navbar */}
                <Box className="fade-in-up">
                    <NavDash
                        onDrawerToggle={handleDrawerToggle}
                        onMenuClick={handleMenuClick}
                        title={getTitleFromPath()} // Dynamically set the title
                    />
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Sidebar */}
                    <Box
                        className="scale-in"
                        sx={{
                            width: 250,
                            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                            backdropFilter: "blur(25px)",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                            border: "1px solid rgba(184, 134, 11, 0.15)",
                            display: { xs: "none", sm: "block" },
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.6s ease",
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
                                transition: 'left 1.2s ease',
                            },
                            '&:hover': {
                                transform: 'translateX(2px)',
                                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
                                '&::before': {
                                    left: '100%'
                                }
                            }
                        }}
                    >
                        <Sidebar onMenuClick={handleMenuClick} />
                    </Box>

                    {/* Main Content */}
                    <Box className="fade-in-up" sx={{ 
                        flexGrow: 1, 
                        overflowY: "auto",
                        background: "transparent",
                        marginLeft: "250px" // Add margin equal to sidebar width
                    }}>
                        <Container sx={{ mt: 2 }}>
                            <MentorPage/>
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
                    <Sidebar onMenuClick={handleMenuClick} />
                </Drawer>
            </Box>
        </Box>
    );
};

export default Mentors;
