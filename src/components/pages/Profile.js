import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";

const ProfilePage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Profile");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ✅ Retrieve USN safely
    
    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard" },
        { label: "Mentors", id: "mentors" },
        { label: "Documents", id: "documents" },
        { label: "Settings", id: "settings" },
        { label: "Contact Us", id: "contact-us" },
    ];
    
    const fetchUserProfile = async () => {
        const usn = localStorage.getItem("usn"); // Ensure 'usn' is stored correctly during login
        console.log(usn)
        if (!usn) {
            setError("User USN not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5002/api/students/${usn}`);
            console.log(response.data);
            
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setError("Could not fetch profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserProfile();
    }, []); // ✅ Depend on `usn` to re-fetch if it changes

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (path) => {
        const selectedOption = sidebarOptions.find((option) => option.id === path);
        if (selectedOption) {
            setTitle(selectedOption.label);
            navigate(`/${path}`);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="error">{error || "User profile not found!"}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <NavDash onDrawerToggle={handleDrawerToggle} title={title} />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Box
                    sx={{
                        width: 250,
                        backgroundColor: "#FBFBFB",
                        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <SideBar onMenuClick={handleMenuClick} />
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                    <Container maxWidth="md">
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                                    {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    {userData.name || "N/A"}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {userData.collegeName || "N/A"} - {userData.selectedMajors?.join(", ") || "N/A"}
                                </Typography>
                            </Box>

                            <Grid container spacing={3} sx={{ mt: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>USN:</strong> {userData.usn || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Email:</strong> {userData.email || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>College Email:</strong> {userData.collegeEmail || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Mobile:</strong> {userData.mobileNumber || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Alt Mobile:</strong> {userData.alternateMobileNumber || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Gender:</strong> {userData.gender || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Date of Birth:</strong> {userData.dob || "N/A"}</Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Typography variant="h6">About Me</Typography>
                                <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
                                    {userData.shortBio || "No bio available"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: "block", sm: "none" }, color: "black" }}
            >
                <SideBar onMenuClick={handleMenuClick} />
            </Drawer>
        </Box>
    );
};

export default ProfilePage;
