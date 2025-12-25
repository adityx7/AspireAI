import React, { useState, useEffect } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarMentor from "../organisms/SideBarMentor";
import NavMentor from "../organisms/NavMentor";
import MenSettingsPage from "../organisms/MenSettingsPage";

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

const SettingsMentor = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to derive the title based on the current path
    const getTitleFromPath = () => {
        const path = location.pathname.slice(1); // Remove the leading "/"
        if (path === "settings-mentor") return "Settings"
        return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard"; // Capitalize the first letter or default to "Dashboard"
    };

    const handleMenuClick = (path) => {
        // Handle both formats: "dashboard-mentor" and "/dashboard-mentor"
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        navigate(cleanPath);
        // Close sidebar after navigation
        setSidebarOpen(false);
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        setSidebarOpen(!sidebarOpen);
    };

    // Add animation effects when component mounts
    useEffect(() => {
        // Trigger animations for elements with these classes
        const elements = document.querySelectorAll('.fade-in-up, .scale-in, .slide-in-right');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
    }, []);
    
    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                height: "100vh",
                position: 'relative',
                background: `linear-gradient(135deg, 
                    ${NAVY_BLUE_MAIN} 0%, 
                    ${NAVY_BLUE_LIGHT} 35%, 
                    ${NAVY_BLUE_DARK} 100%)`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(ellipse at 25% 25%, rgba(184, 134, 11, 0.05) 0%, transparent 50%),
                        radial-gradient(ellipse at 75% 75%, rgba(184, 134, 11, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(218, 165, 32, 0.03) 0%, transparent 50%)
                    `,
                    zIndex: 0
                },
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
                }
            }}
        >
            {/* Navbar */}
            <NavMentor
                onDrawerToggle={handleDrawerToggle}
                onMenuClick={handleMenuClick}
                title={getTitleFromPath()}
            />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: 'relative', zIndex: 1 }}>
                {/* Desktop Sidebar (Sliding - opens on hamburger click) */}
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
                    <SidebarMentor onMenuClick={handleMenuClick} />
                </Drawer>

                {/* Main Content */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: "auto",
                    background: 'transparent',
                    position: 'relative',
                    width: '100%'
                }}>
                    <Container 
                        sx={{ 
                            mt: 2,
                            position: 'relative',
                            zIndex: 1
                        }}
                        className="fade-in-up"
                    >
                        <MenSettingsPage/>
                    </Container>
                    
                    {/* Animated floating elements */}
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: '10%', 
                            left: '5%', 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%',
                            background: `${GOLD_MAIN}20`,
                            animation: 'floating 6s infinite ease-in-out',
                            zIndex: 0,
                            '@keyframes floating': {
                                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                                '25%': { transform: 'translateY(-10px) rotate(1deg)' },
                                '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
                                '75%': { transform: 'translateY(-15px) rotate(0.5deg)' }
                            }
                        }}
                    />
                    
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            bottom: '20%', 
                            right: '15%', 
                            width: '60px', 
                            height: '60px', 
                            transform: 'rotate(45deg)',
                            background: `${GOLD_LIGHT}20`,
                            animation: 'floating 8s infinite ease-in-out',
                            animationDelay: '1s',
                            zIndex: 0
                        }}
                    />
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
                    '& .MuiDrawer-paper': {
                        backgroundColor: NAVY_BLUE_LIGHT,
                        color: 'white'
                    }
                }}
            >
                <SidebarMentor onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default SettingsMentor;
