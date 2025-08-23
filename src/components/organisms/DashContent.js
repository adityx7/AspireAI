import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
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
            <Paper
                elevation={8}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "32px",
                    borderRadius: "24px",
                    textAlign: "center",
                    width: { xs: "90%", sm: "80%", md: "70%" },
                    marginBottom: 3,
                    background: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& .MuiButton-root": {
                        backgroundColor: "#ff8c00",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#e67c00",
                        },
                    },
                }}
            >
                <img src={Dashboard} alt="Find a Mentor" style={{ maxWidth: "50%", borderRadius: "8px" }} />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", fontWeight: "bold" }}>
                    Find a Mentor
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, width: "80%", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                    Get help with your college applications from a mentor who knows what it takes to get in!
                </Typography>
                <Button variant="contained" onClick={handleNavigate} sx={{ mt: 2 }}>
                    Browse Mentor
                </Button>
            </Paper>

            <Paper
                elevation={8}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "24px",
                    borderRadius: "24px",
                    width: { xs: "90%", sm: "80%", md: "70%" },
                    marginBottom: 3,
                    background: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& .MuiButton-root": {
                        backgroundColor: "#1976d2",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#1565c0",
                        },
                    },
                    "& .MuiTypography-root": {
                        color: "white",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    },
                    "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.8)",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", width: "55%" }}>
                    <HelpOutlineIcon sx={{ mr: 2 }} />
                    <Typography>Not ready to choose a mentor? Explore with our AI Assistant</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<HeadsetMicIcon />}
                    onClick={() => setChatOpen(true)}
                >
                    AI Assistant
                </Button>
            </Paper>
            {/* Chat Modal */}
            <Chatbox open={chatOpen} onClose={() => setChatOpen(false)} />
        </Box>
    );
};

export default DashboardContent;