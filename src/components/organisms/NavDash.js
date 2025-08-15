import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";

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
        navigate("/profile-mentor"); // Navigate to the login
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/login"); // Navigate to the login
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate("/settings"); // Navigate to the login
    };

    const handleTitleClick = () => {
        navigate("/"); // Navigate to home when title is clicked
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#FBF5E5",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
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
                        color: "black",
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{
                        color: "black",
                        fontFamily: "Courier",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 38
                    }}
                    onClick={handleTitleClick} // Make title clickable
                >
                    {title}
                </Typography>

                <Box>
                    <Avatar
                        sx={{ cursor: "pointer" }}
                        onClick={handleAvatarClick}
                    >
                        S
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
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