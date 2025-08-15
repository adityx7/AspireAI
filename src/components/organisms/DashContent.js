import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Dashboard from "../../assets/Dashboard.png";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useNavigate } from "react-router-dom";
import Chatbox from "./Chatbox";

const DashboardContent = ({ selectedMenu }) => {
    const navigate = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);

    const handleNavigate = () => {
        navigate("/mentors");
    };

    return (
        <Box sx={{ mt: { xs: "40px", md: "80px" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    p: 3,
                    borderRadius: "8px",
                    textAlign: "center",
                    width: { xs: "90%", sm: "80%", md: "60%" },
                    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                    marginBottom: 3,
                }}
            >
                <img src={Dashboard} alt="Find a Mentor" style={{ maxWidth: "50%", borderRadius: "8px" }} />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Courier", fontWeight: "bold" }}>
                    Find a Mentor
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, width: "80%", fontFamily: "Courier" }}>
                    Get help with your college applications from a mentor who knows what it takes to get in!
                </Typography>
                <Button variant="contained" onClick={handleNavigate} sx={{ mt: 2 }}>
                    Browse Mentor
                </Button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    width: { xs: "90%", sm: "80%", md: "60%" },
                    marginBottom: 3,
                    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", width: "55%" }}>
                    <HelpOutlineIcon sx={{ mr: 2 }} />
                    <Typography sx={{ fontFamily: "Courier" }}>Not ready to choose a mentor? Explore with our AI Assistant</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<HeadsetMicIcon />}
                    onClick={() => setChatOpen(true)}
                >
                    AI Assistant
                </Button>
            </Box>
            {/* Chat Modal */}
            <Chatbox open={chatOpen} onClose={() => setChatOpen(false)} />
        </Box>
    );
};

export default DashboardContent;