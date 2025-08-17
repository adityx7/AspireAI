import React, { useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import MentorPage from "../organisms/MentorsContent";

// Glassmorphism background style
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
    position: "relative",
    overflow: "hidden",
};

const Mentors = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path

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
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Navbar */}
                <NavDash
                    onDrawerToggle={handleDrawerToggle}
                    onMenuClick={handleMenuClick}
                    title={getTitleFromPath()} // Dynamically set the title
                />

                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Sidebar */}
                    <Box
                        sx={{
                            width: 250,
                            backgroundColor: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "2px 0px 15px rgba(0, 0, 0, 0.2)",
                            display: { xs: "none", sm: "block" },
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        <Sidebar onMenuClick={handleMenuClick} />
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                        <Container maxWidth="lg" sx={{ py: 0, px: 2, width: "100%" }}>
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
                    sx={{ display: { xs: "block", sm: "none" }, color: "black" }}
                >
                    <Sidebar onMenuClick={handleMenuClick} />
                </Drawer>
            </Box>
        </Box>
    );
};

export default Mentors;
