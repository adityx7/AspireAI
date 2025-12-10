import React, { useState, useEffect, useMemo } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import ContactPage from "../organisms/ContactDashContent";

const ContactDash = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState("Dashboard");

    // Shimmer background styling
    const shimmerBackground = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        color: "#F8FAFC"
    };



    // Define the sidebar options and map them to their paths
    const sidebarOptions = useMemo(() => [
        { label: "Dashboard", id: "dashboard" },
        { label: "Mentors", id: "mentors" },
        { label: "Documents", id: "dashboard" },
        { label: "Settings", id: "settings" },
        { label: "Contact Us", id: "contact-us" },
        { label: "Profile", id: "profile" },
    ], []);

    useEffect(() => {
        const currentOption = sidebarOptions.find(
            (option) => `/${option.id}` === location.pathname
        );
        setTitle(currentOption.label);
    }, [location.pathname, sidebarOptions]);

    const handleMenuClick = (path) => {
        if (location.pathname !== `/${path}`) {
            navigate(`/${path}`);
        }
        if (mobileOpen) setMobileOpen(false);
        setSidebarOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        setSidebarOpen(!sidebarOpen);
    };

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
                left: '3%',
                width: '50px',
                height: '50px',
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
                width: '35px',
                height: '35px',
                background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)',
                animationDelay: '3s'
            }} />
            
            {/* Floating Decorative Elements */}
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '12%',
                left: '8%',
                width: '70px',
                height: '70px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '65%',
                right: '6%',
                width: '50px',
                height: '50px',
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
                    <NavDash
                        onDrawerToggle={handleDrawerToggle}
                        onMenuClick={handleMenuClick}
                        title={title}
                    />
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
                        <Sidebar onMenuClick={handleMenuClick} />
                    </Drawer>

                    {/* Main Content */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflowY: "auto",
                        background: "transparent",
                        width: "100%"
                    }}>
                        <Container sx={{ mt: 2 }}>
                            <ContactPage />
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

export default ContactDash;
