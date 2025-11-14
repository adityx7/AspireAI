import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

const NavMentor = ({ onDrawerToggle, title }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate(); // To navigate programmatically

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
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{
                        display: { sm: "none" },
                        color: GOLD_LIGHT, // Gold menu icon to match theme
                        '&:hover': {
                            color: GOLD_MAIN,
                            background: 'rgba(184, 134, 11, 0.1)'
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{
                        color: GOLD_LIGHT,
                        fontFamily: "Courier",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 38,
                        textShadow: `0 0 10px ${GOLD_MAIN}40`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: GOLD_MAIN,
                            textShadow: `0 0 15px ${GOLD_MAIN}60`,
                        }
                    }}
                    onClick={handleTitleClick} // Make title clickable
                >
                    {title}
                </Typography>

                <Box>
                    <Avatar
                        sx={{ 
                            cursor: "pointer",
                            background: `linear-gradient(135deg, ${GOLD_MAIN}, ${GOLD_LIGHT})`,
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: `0 0 10px ${GOLD_MAIN}40`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 0 15px ${GOLD_MAIN}60`,
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={handleAvatarClick} // Open dropdown menu on click
                    >
                        S
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
};

export default NavMentor;
