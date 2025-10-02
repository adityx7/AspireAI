import React from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import SchoolIcon from "@mui/icons-material/School"; // ✅ Import Academics Icon
import SettingsIcon from "@mui/icons-material/Settings";
import ContactMailIcon from "@mui/icons-material/DraftsOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined"; // ✅ Import Profile Icon

const Sidebar = ({ onMenuClick }) => {
    const location = useLocation(); // Get the current route path
    const navigate = useNavigate(); // For programmatic navigation

    const currentPath = location.pathname.split("/")[1]; // Extract the first part of the path

    const menuItems = [
        { text: "Dashboard", path: "dashboard", icon: <DashboardIcon /> },
        { text: "Academics", path: "academics", icon: <SchoolIcon /> }, // ✅ Added Academics
        { text: "Mentors", path: "mentors", icon: <PersonIcon /> },
        { text: "Skill Analysis", path: "documents", icon: <AutoGraphOutlinedIcon /> },
    ];

    const secondaryMenuItems = [
        { text: "Settings", path: "settings", icon: <SettingsIcon /> },
        { text: "Contact Us", path: "contact-us", icon: <ContactMailIcon /> },
        { text: "Profile", path: "profile", icon: <AccountCircleIcon /> }, // ✅ Added Profile Button
    ];

    const handleMenuClick = (path) => {
        if (path !== currentPath) {
            navigate(`/${path}`); // Navigate to the selected path
            if (onMenuClick) onMenuClick(path); // Callback to parent component if needed
        }
    };

    return (
        <Box
            sx={{
                width: 250,
                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                backdropFilter: "blur(25px)",
                height: "100vh",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                border: "1px solid rgba(184, 134, 11, 0.15)",
                position: "fixed", // Changed from relative to fixed
                left: 0,
                top: 0,
                overflow: "hidden",
                zIndex: 1200, // Ensure sidebar is above other content
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)',
                    zIndex: 1
                }
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px 16px",
                    position: "relative",
                    zIndex: 2
                }}
            >
                <AcUnitIcon sx={{ 
                    color: "#B8860B", 
                    marginRight: "12px",
                    fontSize: "32px",
                    filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))"
                }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "700",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        color: "#B8860B",
                        fontSize: "20px",
                        textShadow: "0 2px 8px rgba(184, 134, 11, 0.3)"
                    }}
                >
                    AspireAI
                </Typography>
            </Box>

            {/* Menu Items */}
            <List sx={{ position: "relative", zIndex: 2 }}>
                {menuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleMenuClick(path)} // Use the updated function
                        sx={{
                            mt: "8px",
                            mx: "12px",
                            borderRadius: "12px",
                            background: currentPath === path 
                                ? "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)"
                                : "transparent",
                            color: currentPath === path ? "#ffffff" : "#ffffff",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            borderLeft: currentPath === path ? "3px solid #FFFFFF" : "3px solid transparent",
                            '&:hover': {
                                background: currentPath === path
                                    ? "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)"
                                    : "rgba(184, 134, 11, 0.1)",
                                // Removed transform property to prevent movement
                                boxShadow: currentPath === path
                                    ? "0 8px 25px rgba(184, 134, 11, 0.3)"
                                    : "0 4px 15px rgba(184, 134, 11, 0.1)",
                                borderLeft: "3px solid #B8860B"
                            },
                            ...(currentPath === path && {
                                boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '3px',
                                    background: '#ffffff',
                                    borderRadius: '0 2px 2px 0'
                                }
                            })
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentPath === path ? "#ffffff" : "#B8860B",
                                transition: "color 0.3s ease",
                                minWidth: "40px"
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                    fontWeight: currentPath === path ? "600" : "500",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </ListItem>
                ))}
                <Divider sx={{ 
                    mt: 3, 
                    mx: 3,
                    borderColor: "rgba(184, 134, 11, 0.3)",
                    '&::before, &::after': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                    }
                }} />

                {secondaryMenuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleMenuClick(path)} // Use the updated function
                        sx={{
                            mt: "8px",
                            mx: "12px",
                            borderRadius: "12px",
                            background: currentPath === path 
                                ? "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)"
                                : "transparent",
                            color: currentPath === path ? "#ffffff" : "#ffffff",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            borderLeft: currentPath === path ? "3px solid #FFFFFF" : "3px solid transparent",
                            '&:hover': {
                                background: currentPath === path
                                    ? "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)"
                                    : "rgba(184, 134, 11, 0.1)",
                                // Removed transform property to prevent movement
                                boxShadow: currentPath === path
                                    ? "0 8px 25px rgba(184, 134, 11, 0.3)"
                                    : "0 4px 15px rgba(184, 134, 11, 0.1)",
                                borderLeft: "3px solid #B8860B"
                            },
                            ...(currentPath === path && {
                                boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '3px',
                                    background: '#ffffff',
                                    borderRadius: '0 2px 2px 0'
                                }
                            })
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentPath === path ? "#ffffff" : "#B8860B",
                                transition: "color 0.3s ease",
                                minWidth: "40px"
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                    fontWeight: currentPath === path ? "600" : "500",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
