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
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";

const SidebarMentor = () => {
    const navigate = useNavigate();  // ✅ React Router hook for navigation
    const location = useLocation();
    const currentPath = location.pathname.split("/")[1];

    const menuItems = [
        { text: "Dashboard", path: "/dashboard-mentor", icon: <DashboardIcon /> },
    ];

    const secondaryMenuItems = [
        { text: "Settings", path: "/settings-mentor", icon: <SettingsIcon /> },
        { text: "Contact Us", path: "/contact-mentor", icon: <ContactMailIcon /> },
        { text: "Profile", path: "/profile-mentor", icon: <AccountCircleIcon /> },
    ];

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
            <Box sx={{ display: "flex", alignItems: "center", padding: "16px" }}>
                <AcUnitIcon sx={{ color: "#0288d1", marginRight: "8px" }} />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontFamily: "courier", color: "#0288d1" }}
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
                        onClick={() => navigate(path)}  // ✅ Direct navigation using useNavigate
                        sx={{
                            mt: "20px",
                            backgroundColor: currentPath === path.slice(1) ? "#0288d1" : "transparent",
                            color: currentPath === path.slice(1) ? "#fff" : "#333",
                            "&:hover": { backgroundColor: currentPath === path.slice(1) ? "#0288d1" : "#ddd" },
                        }}
                    >
                        <ListItemIcon sx={{ color: currentPath === path.slice(1) ? "#fff" : "#333" }}>
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
                        onClick={() => navigate(path)}  // ✅ Direct navigation using useNavigate
                        sx={{
                            mt: "20px",
                            backgroundColor: currentPath === path.slice(1) ? "#0288d1" : "transparent",
                            color: currentPath === path.slice(1) ? "#fff" : "#333",
                            "&:hover": { backgroundColor: currentPath === path.slice(1) ? "#0288d1" : "#ddd" },
                        }}
                    >
                        <ListItemIcon sx={{ color: currentPath === path.slice(1) ? "#fff" : "#333" }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SidebarMentor;
