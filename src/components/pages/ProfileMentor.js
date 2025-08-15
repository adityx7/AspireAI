import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBarMentor";
import NavDash from "../organisms/NavMentor";

const MentorProfile = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Mentor Profile");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sidebarOptions = [
        { label: "Dashboard", id: "dashboard-mentor" },
        { label: "Settings", id: "settings-mentor" },
        { label: "Contact Us", id: "contact-mentor" },
        { label: "Profile", id: "profile-mentor" },
    ];

    // ✅ Fetch Mentor Profile
    const fetchMentorProfile = async () => {
        const mentorID = localStorage.getItem("mentorID"); // Make sure 'mentorID' is stored during login
        console.log(mentorID);
        if (!mentorID) {
            setError("Mentor ID not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5002/api/mentors/${mentorID}`);
            console.log(response.data);
            setUserData({
                ...response.data,
                selectedMajors: Array.isArray(response.data.selectedMajors)
                    ? response.data.selectedMajors
                    : response.data.selectedMajors ? [response.data.selectedMajors] : []
            });
        } catch (error) {
            console.error("Error fetching mentor profile:", error);
            setError("Could not fetch profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentorProfile();
    }, []);

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
                <Typography variant="h6" color="error">{error || "Mentor profile not found!"}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <NavDash onDrawerToggle={handleDrawerToggle} title={title} />

            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Box sx={{ width: 250, backgroundColor: "#FBFBFB", boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)", display: { xs: "none", sm: "block" } }}>
                    <SideBar onMenuClick={handleMenuClick} />
                </Box>

                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                    <Container maxWidth="md">
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "?"}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    {userData.fullName || "N/A"}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {userData.employeeIn || "N/A"} - {userData.selectedMajors?.join(", ") || "N/A"}
                                </Typography>
                            </Box>

                            <Grid container spacing={3} sx={{ mt: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Mentor ID:</strong> {userData.mentorID || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Name:</strong> {userData.fullName || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Email:</strong> {userData.email || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Employee In: </strong> {userData.employeeIn || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Mobile:</strong> {userData.phoneNumber || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Alt Mobile:</strong> {userData.alternatePhoneNumber || "N/A"}</Typography>
                                    <Typography variant="body1"><strong>Gender:</strong> {userData.gender || "N/A"}</Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Typography variant="h6">About Me</Typography>
                                <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
                                    {userData.bio || "No bio available"}
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

export default MentorProfile;
