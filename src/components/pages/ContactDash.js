import React, { useState, useEffect, useMemo } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import ContactPage from "../organisms/ContactDashContent";

// Glassmorphism background style
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
    position: "relative",
    overflow: "hidden",
};

const ContactDash = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState("Dashboard");

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
                    title={title}
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
                    sx={{ display: { xs: "block", sm: "none" }, color: "black" }}
                >
                    <Sidebar onMenuClick={handleMenuClick} />
                </Drawer>
            </Box>
        </Box>
    );
};

export default ContactDash;
