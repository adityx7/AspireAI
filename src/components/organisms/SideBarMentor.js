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
import HomeIcon from "@mui/icons-material/Home";

const SidebarMentor = () => {
    const navigate = useNavigate();  // ✅ React Router hook for navigation
    const location = useLocation();
    const currentPath = location.pathname.split("/")[1];

    const menuItems = [
        { text: "Home", path: "/", icon: <HomeIcon /> },
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
                background: "rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "0 24px 24px 0",
                height: "100vh",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                color: "white",
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* Logo Section */}
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "16px 12px",
                boxSizing: "border-box",
                width: "100%"
            }}>
                <AcUnitIcon sx={{ color: "rgba(255, 255, 255, 0.9)", marginRight: "8px", fontSize: 32 }} />
                <Typography
                    variant="h6"
                    sx={{ 
                        fontWeight: "bold", 
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
                        color: "white",
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        fontSize: "1.3rem"
                    }}
                >
                    AspireAI
                </Typography>
            </Box>

            {/* Menu Items */}
            <List sx={{ padding: 0, width: "100%" }}>
                {menuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => navigate(path)}  // ✅ Direct navigation using useNavigate
                        sx={{
                            mt: "20px",
                            mx: 1,
                            borderRadius: "16px",
                            background: currentPath === path.slice(1) 
                                ? "linear-gradient(45deg, #ff8c00 30%, #ff9500 90%)" 
                                : "rgba(255, 255, 255, 0.1)",
                            color: "white",
                            backdropFilter: "blur(4px)",
                            WebkitBackdropFilter: "blur(4px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: currentPath === path.slice(1) 
                                ? "0 4px 16px rgba(255, 140, 0, 0.3)" 
                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                            width: "calc(100% - 16px)",
                            boxSizing: "border-box",
                            "&:hover": { 
                                background: currentPath === path.slice(1) 
                                    ? "linear-gradient(45deg, #e67c00 30%, #ff8c00 90%)" 
                                    : "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 6px 20px rgba(255, 140, 0, 0.4)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <ListItemIcon sx={{ 
                            color: "white",
                            filter: currentPath === path.slice(1) ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : "none"
                        }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text} 
                            sx={{
                                "& .MuiTypography-root": {
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    fontWeight: currentPath === path.slice(1) ? 600 : 500,
                                    textShadow: currentPath === path.slice(1) ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
                                }
                            }}
                        />
                    </ListItem>
                ))}

                <Divider sx={{ 
                    mt: 2, 
                    mx: 2, 
                    background: "rgba(255, 255, 255, 0.3)",
                    height: "2px",
                    borderRadius: "1px"
                }} /> {/* Divider */}

                {secondaryMenuItems.map(({ text, path, icon }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => navigate(path)}  // ✅ Direct navigation using useNavigate
                        sx={{
                            mt: "20px",
                            mx: 1,
                            borderRadius: "16px",
                            background: currentPath === path.slice(1) 
                                ? "linear-gradient(45deg, #ff8c00 30%, #ff9500 90%)" 
                                : "rgba(255, 255, 255, 0.1)",
                            color: "white",
                            backdropFilter: "blur(4px)",
                            WebkitBackdropFilter: "blur(4px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: currentPath === path.slice(1) 
                                ? "0 4px 16px rgba(255, 140, 0, 0.3)" 
                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                            width: "calc(100% - 16px)",
                            boxSizing: "border-box",
                            "&:hover": { 
                                background: currentPath === path.slice(1) 
                                    ? "linear-gradient(45deg, #e67c00 30%, #ff8c00 90%)" 
                                    : "rgba(255, 255, 255, 0.2)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 6px 20px rgba(255, 140, 0, 0.4)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <ListItemIcon sx={{ 
                            color: "white",
                            filter: currentPath === path.slice(1) ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : "none"
                        }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={text}
                            sx={{
                                "& .MuiTypography-root": {
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    fontWeight: currentPath === path.slice(1) ? 600 : 500,
                                    textShadow: currentPath === path.slice(1) ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SidebarMentor;
