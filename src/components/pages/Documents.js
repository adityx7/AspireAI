import React, { useState, useEffect } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import DocumentsPage from "../organisms/DocContent";
import { ToastContainer } from "react-toastify";

const Documents = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Shimmer background styling
    const shimmerBackground = {
        minHeight: "100vh",
        background: `
            linear-gradient(135deg, 
                rgba(10, 25, 47, 0.9) 0%, 
                rgba(26, 43, 76, 0.85) 35%, 
                rgba(50, 73, 94, 0.8) 100%
            ),
            radial-gradient(circle at 30% 70%, rgba(184, 134, 11, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(218, 165, 32, 0.1) 0%, transparent 50%)
        `,
        animation: 'shimmer 4s ease-in-out infinite',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
    };

    const shimmerOverlay = {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.05), transparent)',
        animation: 'shimmerSlide 3s ease-in-out infinite',
        zIndex: 1
    };

    // Add animation keyframes to document head
    useEffect(() => {
        // Animation styles removed for immediate page load
        return () => {
            // Cleanup function (empty since no styles to remove)
        };
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
                top: '18%',
                left: '7%',
                width: '65px',
                height: '65px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '62%',
                right: '9%',
                width: '55px',
                height: '55px',
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
                <Box>
                    <NavDash
                        onDrawerToggle={handleDrawerToggle}
                        onMenuClick={handleMenuClick}
                        title={getTitleFromPath()}
                    />
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Sidebar */}
                    <Box
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
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflowY: "auto",
                        background: "transparent",
                        marginLeft: "250px" // Add margin equal to sidebar width
                    }}>
                        <Container sx={{ mt: 2 }}>
                            <DocumentsPage />
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
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Documents;
