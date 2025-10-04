import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";
import StudentMeetingNotes from "../organisms/StudentMeetingNotes";

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC"
};

const StudentMeetingNotesPage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard" },
        { label: "Academics", id: "academics" },
        { label: "Meeting Notes", id: "meeting-notes" },
        { label: "Mentors", id: "mentors" },
        { label: "Documents", id: "documents" },
        { label: "Settings", id: "settings" },
        { label: "Contact Us", id: "contact" },
        { label: "Profile", id: "profile" },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (menuId) => {
        switch (menuId) {
            case "dashboard":
                navigate("/dashboard");
                break;
            case "academics":
                navigate("/academics");
                break;
            case "meeting-notes":
                // Already on this page
                break;
            case "mentors":
                navigate("/mentors");
                break;
            case "documents":
                navigate("/documents");
                break;
            case "settings":
                navigate("/settings");
                break;
            case "contact":
                navigate("/contact");
                break;
            case "profile":
                navigate("/profile");
                break;
            default:
                break;
        }
    };

    return (
        <Box sx={shimmerBackground}>
            <NavDash title="Meeting Notes" onMenuClick={handleDrawerToggle} />
            
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { 
                        boxSizing: "border-box", 
                        width: 250,
                        backgroundColor: "#FBFBFB",
                        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)"
                    },
                }}
            >
                <SideBar options={sidebarOptions} onMenuClick={handleMenuClick} />
            </Drawer>

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Box sx={{ 
                    width: 250, 
                    backgroundColor: "#FBFBFB", 
                    boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)", 
                    display: { xs: "none", sm: "block" } 
                }}>
                    <SideBar options={sidebarOptions} onMenuClick={handleMenuClick} />
                </Box>
                
                <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                    <StudentMeetingNotes />
                </Box>
            </Box>
        </Box>
    );
};

export default StudentMeetingNotesPage;