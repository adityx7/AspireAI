import React, { useState, useEffect, useMemo } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import ContactPage from "../organisms/ContactDashContent";

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
                        backgroundColor: "#FBFBFB",
                        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <Sidebar onMenuClick={handleMenuClick} />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
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
                sx={{ display: { xs: "block", sm: "none" }, color: "black" }}
            >
                <Sidebar onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default ContactDash;
