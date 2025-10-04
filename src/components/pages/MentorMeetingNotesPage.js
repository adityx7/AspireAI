import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBarMentor from "../organisms/SideBarMentor";
import NavMentor from "../organisms/NavMentor";
import MentorMeetingNotes from "../organisms/MentorMeetingNotes";

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC"
};

const MentorMeetingNotesPage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard-mentor" },
        { label: "Meeting Notes", id: "meeting-notes-mentor" },
        { label: "Settings", id: "settings-mentor" },
        { label: "Contact Us", id: "contact-mentor" },
        { label: "Profile", id: "profile-mentor" },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (menuId) => {
        switch (menuId) {
            case "dashboard-mentor":
                navigate("/mentor-main");
                break;
            case "meeting-notes-mentor":
                // Already on this page
                break;
            case "settings-mentor":
                navigate("/settings-mentor");
                break;
            case "contact-mentor":
                navigate("/mentor-contact");
                break;
            case "profile-mentor":
                navigate("/profile-mentor");
                break;
            default:
                break;
        }
    };

    return (
        <Box sx={shimmerBackground}>
            <NavMentor title="Meeting Notes" onMenuClick={handleDrawerToggle} />
            
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
                <SideBarMentor options={sidebarOptions} onMenuClick={handleMenuClick} />
            </Drawer>

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Box sx={{ 
                    width: 250, 
                    backgroundColor: "#FBFBFB", 
                    boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)", 
                    display: { xs: "none", sm: "block" } 
                }}>
                    <SideBarMentor options={sidebarOptions} onMenuClick={handleMenuClick} />
                </Box>
                
                <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                    <MentorMeetingNotes />
                </Box>
            </Box>
        </Box>
    );
};

export default MentorMeetingNotesPage;