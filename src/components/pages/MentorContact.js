import React, { useEffect, useMemo, useState } from "react";
import { Box, Drawer, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarMentor from "../organisms/SideBarMentor";
import NavMentor from "../organisms/NavMentor";
import MentorContactPage from "../organisms/MenContactContent";

const MentorContact = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        // Handle both formats: "contact-mentor" and "/contact-mentor"
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        if (location.pathname !== cleanPath) {
            navigate(cleanPath);
        }
        // Close sidebar after navigation
        setSidebarOpen(false);
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        setSidebarOpen(!sidebarOpen);
    };    

    console.log("title", title);


    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100vh",
            background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
        }}>
            {/* Navbar */}
            <NavMentor onDrawerToggle={handleDrawerToggle} title={title} />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                {/* Desktop Sidebar (Sliding - opens on hamburger click) */}
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
                    <SidebarMentor onMenuClick={handleMenuClick} />
                </Drawer>

                {/* Main Content */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: "auto",
                    width: "100%"
                }}>
                    <Container sx={{ mt: 2 }}>
                        <MentorContactPage />
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
                    '& .MuiDrawer-paper': {
                        background: "rgba(10, 25, 47, 0.98)",
                        backdropFilter: 'blur(10px)',
                        borderRight: `1px solid rgba(184, 134, 11, 0.3)`,
                    }
                }}
            >
                <SidebarMentor onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default MentorContact;
