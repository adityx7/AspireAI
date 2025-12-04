import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import NotificationBell from "./NotificationBell";

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

const NavMentor = ({ onDrawerToggle, title, subtitle }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState("M");
    const navigate = useNavigate(); // To navigate programmatically

    // Get mentor's first initial - check localStorage first, then fetch from API
    useEffect(() => {
        const fetchMentorName = async () => {
            // First, try localStorage
            let mentorName = localStorage.getItem('fullName') || localStorage.getItem('name');
            
            // If not in localStorage, fetch from API
            if (!mentorName || mentorName === "Mentor") {
                try {
                    const mentorID = localStorage.getItem('mentorID') || localStorage.getItem('mentorId');
                    if (mentorID) {
                        const response = await fetch(`http://localhost:5002/api/mentors/${mentorID}`);
                        if (response.ok) {
                            const data = await response.json();
                            mentorName = data.fullName;
                            // Store it for future use
                            localStorage.setItem('name', mentorName);
                            localStorage.setItem('fullName', mentorName);
                        }
                    }
                } catch (error) {
                    console.log('Could not fetch mentor name:', error);
                }
            }
            
            const initial = (mentorName || "Mentor").charAt(0).toUpperCase();
            setUserInitial(initial);
        };
        
        fetchMentorName();
    }, []);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget); // Set the anchor element for the menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile-mentor"); // Navigate to the login
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/mentor-login"); // Navigate to the login
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate("/settings-mentor"); // Navigate to the login
    };

    const handleTitleClick = () => {
        navigate("/"); // Navigate to home when title is clicked
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'transparent',
                boxShadow: `0px 4px 15px rgba(184, 134, 11, 0.15)`,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${GOLD_MAIN}30`,
            }}
            className="fade-in-up"
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: { xs: 56, sm: 64 },
                    py: 1
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{
                        color: GOLD_LIGHT, // Gold menu icon to match theme
                        mr: 2,
                        '&:hover': {
                            color: GOLD_MAIN,
                            background: 'rgba(184, 134, 11, 0.1)'
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: GOLD_LIGHT,
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            fontWeight: 700,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            textShadow: `0 0 10px ${GOLD_MAIN}40`,
                            mb: subtitle ? 0.5 : 0
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Notification Bell */}
                    <NotificationBell userId={localStorage.getItem('mentorID') || localStorage.getItem('mentorId')} />
                    
                    <Avatar
                        sx={{ 
                            cursor: "pointer",
                            background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            boxShadow: `0 0 10px ${GOLD_MAIN}40`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 0 15px ${GOLD_MAIN}60`,
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={handleAvatarClick} // Open dropdown menu on click
                    >
                        {userInitial}
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)} // Open if anchorEl is not null
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                background: NAVY_BLUE_LIGHT,
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${GOLD_MAIN}30`,
                                boxShadow: `0 8px 20px rgba(0, 0, 0, 0.3), 0 0 10px ${GOLD_MAIN}20`
                            },
                            '& .MuiMenuItem-root': {
                                '&:hover': {
                                    background: `rgba(184, 134, 11, 0.2)`,
                                    color: GOLD_LIGHT
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleSettings}>Settings</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

NavMentor.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

export default NavMentor;
