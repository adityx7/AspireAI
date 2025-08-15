import React, { useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarMentor from "../organisms/SideBarMentor";
import NavMentor from "../organisms/NavMentor";
import MenSettingsPage from "../organisms/MenSettingsPage";

const SettingsMentor = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to derive the title based on the current path
    const getTitleFromPath = () => {
        const path = location.pathname.slice(1); // Remove the leading "/"
        if (path === "settings-mentor") return "Settings"
        return path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard"; // Capitalize the first letter or default to "Dashboard"
    };

    const handleMenuClick = (menu) => {
        navigate(`/${menu.toLowerCase()}`);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Navbar */}
            <NavMentor
                onDrawerToggle={handleDrawerToggle}
                onMenuClick={handleMenuClick}
                title={getTitleFromPath()}
            />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                {/* Sidebar */}
                <Box
                    sx={{
                        width: 250,
                        backgroundColor: "#FBFBFB",
                        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <SidebarMentor onMenuClick={handleMenuClick} />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Container sx={{ mt: 2 }}>
                        <MenSettingsPage/>
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
                <SidebarMentor onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default SettingsMentor;
