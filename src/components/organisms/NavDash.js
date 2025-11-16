import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

const Navbar = ({ onDrawerToggle, title }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate(); // Initialize navigate function

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile"); // Navigate to student profile
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/login"); // Navigate to the login
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate("/settings"); // Navigate to settings
    };

    const handleTitleClick = () => {
        navigate("/"); // Navigate to home when title is clicked
    };

    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                backdropFilter: 'blur(25px)',
                borderBottom: `1px solid rgba(184, 134, 11, 0.15)`,
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{
                        display: { sm: "none" },
                        color: GOLD_LIGHT,
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
                        onClick={handleAvatarClick}
                    >
                        S
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
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

// Prop types for better documentation and validation
Navbar.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default Navbar;