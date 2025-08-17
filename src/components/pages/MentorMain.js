import React, { useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SidebarMentor from "../organisms/SideBarMentor";
import MentorTrainingPage from "../organisms/MenMainContent";
import NavMentor from "../organisms/NavMentor";
import FloatingChat from "../organisms/FloatingChatMentor";

// Glassmorphism background style
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
    position: "relative",
    overflow: "hidden",
};

const MentorMain = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Dashboard"); // Default title
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard-mentor" },
        { label: "Settings", id: "settings-mentor" },
        { label: "Contact Us", id: "contact-mentor" },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (path) => {
        const selectedOption = sidebarOptions.find((option) => option.id === path);
        if (selectedOption) {
            setTitle(selectedOption.label); // Update title
            navigate(`/${path}`); // Navigate to the selected path
        }
    };

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Navbar */}
                <NavMentor onDrawerToggle={handleDrawerToggle} title={title} />

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
                    <SidebarMentor onMenuClick={handleMenuClick} />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                    <Container maxWidth="lg" sx={{ py: 0, px: 2, width: "100%" }}>
                        <MentorTrainingPage />
                    </Container>
                </Box>
            </Box>

            {/* Floating Chat Feature */}
            <FloatingChat />

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
        </Box>
    );
};

export default MentorMain;
