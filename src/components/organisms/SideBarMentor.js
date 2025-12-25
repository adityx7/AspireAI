import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactMailIcon from "@mui/icons-material/DraftsOutlined";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HomeIcon from "@mui/icons-material/Home";
import PropTypes from "prop-types";

// Constants for styling - matching the login theme
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";

const SidebarMentor = ({ onMenuClick }) => {
    const navigate = useNavigate();  // ✅ React Router hook for navigation
    const location = useLocation();
    const currentPath = location.pathname;

    const handleNavigation = (path) => {
        navigate(path);
        if (onMenuClick) {
            onMenuClick(path);
        }
    };

    const menuItems = [
        { text: "Home", path: "/", icon: <HomeIcon /> },
        { text: "Dashboard", path: "/dashboard-mentor", icon: <DashboardIcon /> },
        { text: "Student Verification", path: "/mentor/students-verification", icon: <VerifiedUserIcon /> },
    ];

    const secondaryMenuItems = [
        { text: "Settings", path: "/settings-mentor", icon: <SettingsIcon /> },
        { text: "Contact Us", path: "/contact-mentor", icon: <ContactMailIcon /> },
        { text: "Profile", path: "/profile-mentor", icon: <AccountCircleIcon /> },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                background: 'transparent',
                height: "100vh",
                color: "white",
                pt: 2
            }}
        >
            {/* Logo Section */}
            <Box 
                sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    padding: "16px",
                    borderBottom: `1px solid ${GOLD_MAIN}40`,
                }}
                className="scale-in"
            >
                <StarIcon sx={{ color: GOLD_MAIN, marginRight: "8px" }} />
                <Typography
                    variant="h6"
                    sx={{ 
                        fontWeight: "bold", 
                        fontFamily: "'Inter', sans-serif", 
                        color: GOLD_LIGHT,
                        textShadow: `0 0 5px ${GOLD_MAIN}40`
                    }}
                >
                    AspireAI
                </Typography>
            </Box>

            {/* Menu Items */}
            <List>
                {menuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleNavigation(path)}
                        className="fade-in-up"
                        sx={{
                            mt: "20px",
                            backgroundColor: currentPath === path ? `${GOLD_MAIN}40` : "transparent",
                            color: currentPath === path ? GOLD_LIGHT : "white",
                            borderLeft: currentPath === path ? `3px solid ${GOLD_MAIN}` : 'none',
                            "&:hover": { 
                                backgroundColor: currentPath === path ? `${GOLD_MAIN}40` : `${GOLD_MAIN}20`,
                                borderLeft: `3px solid ${GOLD_MAIN}80`,
                                transform: 'translateX(5px)'
                            },
                            transition: "all 0.3s ease",
                            borderRadius: "0 4px 4px 0",
                            margin: "5px 0",
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: currentPath === path ? GOLD_LIGHT : "rgba(255, 255, 255, 0.7)",
                                minWidth: "40px"
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text}
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: currentPath === path ? "bold" : "normal",
                                fontFamily: "'Inter', sans-serif"
                            }}
                        />
                    </ListItem>
                ))}

                <Divider sx={{ mt: 2, mx: 3, borderColor: `${GOLD_MAIN}30` }} className="scale-in" /> {/* Divider */}

                {secondaryMenuItems.map(({ text, path, icon }, index) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleNavigation(path)}
                        className="slide-in-right"
                        sx={{
                            mt: "10px",
                            backgroundColor: currentPath === path ? `${GOLD_MAIN}40` : "transparent",
                            color: currentPath === path ? GOLD_LIGHT : "white",
                            borderLeft: currentPath === path ? `3px solid ${GOLD_MAIN}` : 'none',
                            "&:hover": { 
                                backgroundColor: currentPath === path ? `${GOLD_MAIN}40` : `${GOLD_MAIN}20`,
                                borderLeft: `3px solid ${GOLD_MAIN}80`,
                                transform: 'translateX(5px)'
                            },
                            transition: "all 0.3s ease",
                            borderRadius: "0 4px 4px 0",
                            margin: "5px 0",
                            animationDelay: `${0.2 + index * 0.1}s`,
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: currentPath === path ? GOLD_LIGHT : "rgba(255, 255, 255, 0.7)",
                                minWidth: "40px"
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text}
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: currentPath === path ? "bold" : "normal"
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            
            {/* Footer section with version */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    bottom: 10, 
                    left: 0, 
                    width: '100%', 
                    textAlign: 'center',
                    opacity: 0.7,
                    padding: '10px'
                }}
            >
                <Typography variant="caption" sx={{ color: GOLD_LIGHT, fontSize: '0.7rem' }}>
                    AspireAI v1.0.2
                </Typography>
            </Box>
        </Box>
    );
};

SidebarMentor.propTypes = {
    onMenuClick: PropTypes.func,
};

export default SidebarMentor;
