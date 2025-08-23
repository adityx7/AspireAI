import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";

const Navbar = ({ onDrawerToggle, title }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/login");
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate("/settings");
    };

    const handleTitleClick = () => {
        navigate("/");
    };

    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0px 4px 16px rgba(255,215,0,0.2)",
                border: "1px solid rgba(255,215,0,0.3)",
                borderTop: "none",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
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
                        color: "#ffd700",
                        "&:hover": {
                            backgroundColor: "rgba(255,215,0,0.1)",
                            transform: "scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{
                        color: "#ffd700",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: { xs: 24, md: 32 },
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        letterSpacing: "0.5px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            textShadow: "0 0 12px rgba(255,215,0,0.6)",
                            transform: "scale(1.02)",
                        },
                    }}
                    onClick={handleTitleClick}
                >
                    {title}
                </Typography>

                <Box>
                    <Avatar
                        sx={{ 
                            cursor: "pointer",
                            background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                            color: "#1e3a8a",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                            border: "2px solid rgba(255,215,0,0.6)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                                boxShadow: "0 6px 24px rgba(255,215,0,0.5)",
                            },
                        }}
                        onClick={handleAvatarClick}
                    >
                        S
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,215,0,0.3)",
                                borderRadius: 3,
                                boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
                                mt: 1,
                                "& .MuiMenuItem-root": {
                                    color: "#e2e8f0",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    fontWeight: 500,
                                    py: 1.5,
                                    px: 3,
                                    borderRadius: 2,
                                    mx: 1,
                                    my: 0.5,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "linear-gradient(90deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)",
                                        color: "#ffd700",
                                        transform: "translateX(4px)",
                                    },
                                },
                            },
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

Navbar.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default Navbar;