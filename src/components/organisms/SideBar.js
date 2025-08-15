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
                backgroundColor: "#FBFBFB",
                height: "100vh",
                boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
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
                <AcUnitIcon sx={{ color: "#0288d1", marginRight: "8px" }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "courier",
                        color: "#0288d1",
                    }}
                >
                    Career Compass
                </Typography>
            </Box>

            {/* Menu Items */}
            <List>
                {menuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleMenuClick(path)} // Use the updated function
                        sx={{
                            mt: "20px",
                            backgroundColor:
                                currentPath === path ? "#0288d1" : "transparent",
                            color: currentPath === path ? "#fff" : "#333",
                            "&:hover": {
                                backgroundColor: currentPath === path
                                    ? "#0288d1"
                                    : "#ddd",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentPath === path ? "#fff" : "#333",
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                <Divider sx={{ mt: 2, mx: 3 }} /> {/* Divider */}

                {secondaryMenuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => handleMenuClick(path)} // Use the updated function
                        sx={{
                            mt: "20px",
                            backgroundColor:
                                currentPath === path ? "#0288d1" : "transparent",
                            color: currentPath === path ? "#fff" : "#333",
                            "&:hover": {
                                backgroundColor: currentPath === path
                                    ? "#0288d1"
                                    : "#ddd",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentPath === path ? "#fff" : "#333",
                            }}
                        >
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
