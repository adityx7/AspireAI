import React, { useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SideBar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import DashboardContent from "../organisms/DashContent";
import FloatingChat from "../organisms/FloatingChat";

const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Dashboard"); // Default title
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard" },
        { label: "Mentors", id: "mentors" },
        { label: "Documents", id: "dashboard" },
        { label: "Settings", id: "settings" },
        { label: "Contact Us", id: "contact-us" },
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
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Navbar */}
            <NavDash onDrawerToggle={handleDrawerToggle} title={title} />

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
                    <SideBar onMenuClick={handleMenuClick} />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <Container sx={{ mt: 2 }}>
                        <DashboardContent />
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
                <SideBar onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default Dashboard;
