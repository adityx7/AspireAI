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
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                height: "100vh",
                boxShadow: "2px 0px 15px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden", // Prevent content overflow
                boxSizing: "border-box", // Include border and padding in width calculation
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                }}
            >
                <AcUnitIcon sx={{ color: "#fff", marginRight: "8px", filter: "drop-shadow(0 2px 4px rgba(26,35,126,0.3))" }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        color: "#fff",
                        textShadow: "0 2px 8px rgba(26,35,126,0.3)",
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
                        onClick={() => handleMenuClick(path)}
                        sx={{
                            mt: "20px",
                            mx: 1.5, // Reduced margin to fit within container
                            borderRadius: 3,
                            background: currentPath === path 
                                ? "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)"
                                : "rgba(255,255,255,0.1)",
                            color: "#fff",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: currentPath === path 
                                ? "0 4px 16px rgba(255,140,0,0.3)"
                                : "0 2px 8px rgba(0,0,0,0.1)",
                            maxWidth: "calc(100% - 24px)", // Ensure button fits within container
                            "&:hover": {
                                background: currentPath === path
                                    ? "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)"
                                    : "rgba(255,255,255,0.2)",
                                boxShadow: "0 4px 20px rgba(255,140,0,0.4)",
                                transform: "translateY(-1px)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: "#fff",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                                minWidth: 40, // Control icon width
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text} 
                            sx={{
                                '& .MuiTypography-root': {
                                    fontWeight: currentPath === path ? 600 : 400,
                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                    fontSize: "0.9rem", // Slightly smaller text to ensure fit
                                }
                            }}
                        />
                    </ListItem>
                ))}
                <Divider sx={{ 
                    mt: 2, 
                    mx: 2.5, // Adjusted divider margin
                    borderColor: "rgba(255,255,255,0.3)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }} />

                {secondaryMenuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleMenuClick(path)}
                        sx={{
                            mt: "20px",
                            mx: 1.5, // Reduced margin to fit within container
                            borderRadius: 3,
                            background: currentPath === path 
                                ? "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)"
                                : "rgba(255,255,255,0.1)",
                            color: "#fff",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: currentPath === path 
                                ? "0 4px 16px rgba(255,140,0,0.3)"
                                : "0 2px 8px rgba(0,0,0,0.1)",
                            maxWidth: "calc(100% - 24px)", // Ensure button fits within container
                            "&:hover": {
                                background: currentPath === path
                                    ? "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)"
                                    : "rgba(255,255,255,0.2)",
                                boxShadow: "0 4px 20px rgba(255,140,0,0.4)",
                                transform: "translateY(-1px)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: "#fff",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                                minWidth: 40, // Control icon width
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text} 
                            sx={{
                                '& .MuiTypography-root': {
                                    fontWeight: currentPath === path ? 600 : 400,
                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                    fontSize: "0.9rem", // Slightly smaller text to ensure fit
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
