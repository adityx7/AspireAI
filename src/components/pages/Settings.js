import React, { useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import SettingsPage from "../organisms/SettingContent";

const Settings = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        <Box 
            sx={{ 
                minHeight: "100vh",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Navbar */}
            <NavDash
                onDrawerToggle={handleDrawerToggle}
                onMenuClick={handleMenuClick}
                title={getTitleFromPath()}
            />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                {/* Sidebar */}
                <Box
                    sx={{
                        width: 250,
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <Sidebar onMenuClick={handleMenuClick} />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Container maxWidth="lg" sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
                        <SettingsPage/>
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
    );
};

export default Settings;