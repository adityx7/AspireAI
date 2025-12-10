import React, { useState, useEffect } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import DocumentsPage from "../organisms/DocContent";
import { ToastContainer } from "react-toastify";

const Documents = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Shimmer background styling
    const shimmerBackground = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        color: "#F8FAFC"
    };



    // Function to derive the title based on the current path
    const getTitleFromPath = () => {
        const path = location.pathname.slice(1); // Remove the leading "/"
        return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard"; // Capitalize the first letter or default to "Dashboard"
    };


    const handleMenuClick = (menu) => {
        navigate(`/${menu.toLowerCase()}`);
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
            '& .fade-in-up': {
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:not(.animate-in)': {
                    opacity: 0,
                    transform: 'translateY(60px)'
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
                        title={getTitleFromPath()}
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
                        overflowX: "hidden",
                        background: "transparent",
                        width: "100%",
                        position: "relative",
                        zIndex: 10,
                        minHeight: "100vh"
                    }}>
                        <DocumentsPage />
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
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Documents;
