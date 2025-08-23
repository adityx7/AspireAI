import React, { useEffect, useMemo, useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarMentor from "../organisms/SideBarMentor";
import NavMentor from "../organisms/NavMentor";
import MentorContactPage from "../organisms/MenContactContent";

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

const MentorContact = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Dashboard"); // Default title
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarOptions = useMemo(() => [
        { label: "Dashboard", id: "dashboard-mentor" },
        { label: "Settings", id: "settings-mentor" },
        { label: "Contact Us", id: "contact-mentor" },
        { label: "Profile", id: "profile-mentor" },
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
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };    

    console.log("title", title);

    return (
        <Box sx={shimmerBackground}>
            {/* Background Shimmer Overlay */}
            <Box sx={shimmerOverlay} />
            
            <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                height: "100vh",
                position: "relative",
                zIndex: 1
            }}>
                {/* Navbar */}
                <NavMentor onDrawerToggle={handleDrawerToggle} title={title} />

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Sidebar */}
                    <Box
                        sx={{
                            width: 250,
                            background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "2px 0px 15px rgba(255,215,0,0.2)",
                            display: { xs: "none", sm: "block" },
                            border: "1px solid rgba(255,215,0,0.3)",
                            borderRadius: "0 8px 8px 0",
                        }}
                    >
                        <SidebarMentor onMenuClick={handleMenuClick} />
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflowY: "auto",
                        p: 2,
                        background: "linear-gradient(120deg, rgba(30,58,138,0.1) 0%, rgba(15,23,42,0.2) 100%)",
                    }}>
                        <Container 
                            sx={{ 
                                mt: 2,
                                background: "linear-gradient(120deg, rgba(30,58,138,0.3) 0%, rgba(15,23,42,0.4) 100%)",
                                borderRadius: 4,
                                border: "1px solid rgba(255,215,0,0.2)",
                                boxShadow: "0 4px 16px rgba(255,215,0,0.1)",
                                backdropFilter: "blur(8px)",
                                minHeight: "calc(100vh - 120px)",
                                p: 2,
                            }}
                        >
                            <MentorContactPage />
                        </Container>
                    </Box>
                </Box>

                {/* Mobile Sidebar Drawer */}
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
                    <SidebarMentor onMenuClick={handleMenuClick} />
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

export default MentorContact;
