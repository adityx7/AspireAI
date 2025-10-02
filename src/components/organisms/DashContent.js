import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Dashboard from "../../assets/Dashboard.png";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useNavigate } from "react-router-dom";
import Chatbox from "./Chatbox";

const DashboardContent = ({ selectedMenu }) => {
    const navigate = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        // Trigger animations on content load
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.content-fade-in-up, .content-scale-in');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 300);
            });
        }, 500);
    }, []);

    const handleNavigate = () => {
        navigate("/mentors");
    };

    return (
        <Box sx={{ 
            mt: { xs: "40px", md: "80px" }, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            '& .content-fade-in-up': {
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:not(.animate-in)': {
                    opacity: 0,
                    transform: 'translateY(60px)'
                }
            },
            '& .content-scale-in': {
                opacity: 1,
                transform: 'scale(1) rotateZ(0deg)',
                transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:not(.animate-in)': {
                    opacity: 0.3,
                    transform: 'scale(0.7) rotateZ(-5deg)'
                }
            }
        }}>
            <Box
                className="content-scale-in"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                    backdropFilter: "blur(25px)",
                    p: 4,
                    borderRadius: 4,
                    textAlign: "center",
                    width: { xs: "90%", sm: "80%", md: "60%" },
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                    border: "1px solid rgba(184, 134, 11, 0.15)",
                    marginBottom: 3,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.6s ease",
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
                        transition: 'left 1.2s ease',
                    },
                    '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
                        '&::before': {
                            left: '100%'
                        }
                    }
                }}
            >
                <Box
                    component="img"
                    src={Dashboard}
                    alt="Find a Mentor"
                    sx={{ 
                        maxWidth: "50%", 
                        borderRadius: 2,
                        filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
                        transition: "all 0.3s ease",
                        '&:hover': {
                            transform: "scale(1.05)",
                            filter: "drop-shadow(0 12px 24px rgba(184, 134, 11, 0.3))"
                        }
                    }}
                />
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mt: 3, 
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                        fontSize: { xs: "1.5rem", md: "1.8rem" }
                    }}
                >
                    Find a Mentor
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        mt: 2, 
                        width: "80%", 
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        color: "#F8FAFC",
                        opacity: 0.9,
                        lineHeight: 1.6
                    }}
                >
                    Get help with your college applications from a mentor who knows what it takes to get in!
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={handleNavigate} 
                    sx={{ 
                        mt: 3,
                        background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                        transition: 'all 0.3s ease',
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                        }
                    }}
                >
                    Browse Mentor
                </Button>
            </Box>

            <Box
                className="content-fade-in-up"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3,
                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.75) 0%, rgba(10, 25, 47, 0.85) 100%)",
                    backdropFilter: "blur(25px)",
                    borderRadius: 3,
                    width: { xs: "90%", sm: "80%", md: "60%" },
                    marginBottom: 3,
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
                    border: "1px solid rgba(184, 134, 11, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s ease",
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                    }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", width: "65%" }}>
                    <HelpOutlineIcon sx={{ 
                        mr: 2, 
                        color: '#B8860B',
                        fontSize: '2rem',
                        filter: "drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))"
                    }} />
                    <Typography sx={{ 
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        color: "#F8FAFC",
                        fontWeight: 500,
                        lineHeight: 1.5
                    }}>
                        Not ready to choose a mentor? Explore with our AI Assistant
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<HeadsetMicIcon />}
                    onClick={() => setChatOpen(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                        color: 'white',
                        py: 1.2,
                        px: 3,
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                        transition: 'all 0.3s ease',
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                        }
                    }}
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