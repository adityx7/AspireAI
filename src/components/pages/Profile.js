import React, { useState, useEffect } from "react";
import { Box, Drawer, Container, Paper, Typography, Avatar, Grid, CircularProgress, Chip, TextField, Button, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../organisms/SideBar";
import NavDash from "../organisms/NavDash";

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
    position: "relative",
    overflow: "hidden",
};

const ProfilePage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [title, setTitle] = useState("Profile");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    // New profile features
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [interests, setInterests] = useState([]);
    const [interestInput, setInterestInput] = useState("");
    const [achievements, setAchievements] = useState([]);
    const [achievementInput, setAchievementInput] = useState("");
    const [resume, setResume] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handlers for new features
    const handleAddSkill = () => { if (skillInput) setSkills([...skills, skillInput]); setSkillInput(""); };
    const handleAddInterest = () => { if (interestInput) setInterests([...interests, interestInput]); setInterestInput(""); };
    const handleAddAchievement = () => { if (achievementInput) setAchievements([...achievements, achievementInput]); setAchievementInput(""); };
    const handleResumeUpload = (e) => { setResume(e.target.files[0]); };
    
    const handleUpdateBio = async () => {
        try {
            const usn = localStorage.getItem("usn");
            if (!usn) {
                alert("User USN not found. Please log in.");
                return;
            }
            
            const response = await axios.put(`http://localhost:5002/api/students/${usn}`, {
                shortBio: bio
            });
            
            if (response.status === 200) {
                // Update the userData state to reflect the change
                setUserData(prev => ({ ...prev, shortBio: bio }));
                alert("Bio updated successfully!");
            }
        } catch (error) {
            console.error("Error updating bio:", error);
            alert("Failed to update bio. Please try again.");
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usn = localStorage.getItem("usn");
                if (!usn) {
                    setError("User USN not found. Please log in.");
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`http://localhost:5002/api/students/${usn}`);
                console.log("Profile data received:", response.data);
                setUserData(response.data);
            } catch (err) {
                setError("Could not fetch profile. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (text) => {
        setTitle(text);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }
    if (error || !userData) {
        console.log("Error or no userData:", error, userData);
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="error">{error || "User profile not found!"}</Typography>
            </Box>
        );
    }

    console.log("Rendering profile with userData:", userData);

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <NavDash onDrawerToggle={handleDrawerToggle} title={title} />
                <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    <Box sx={{ 
                        width: 250, 
                        backgroundColor: "rgba(251,251,251,0.15)", 
                        backdropFilter: "blur(10px)", 
                        boxShadow: "2px 0px 15px rgba(0, 0, 0, 0.2)", 
                        display: { xs: "none", sm: "block" }, 
                        border: "1px solid rgba(255,255,255,0.1)" 
                    }}>
                        <SideBar onMenuClick={handleMenuClick} />
                    </Box>
                    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "flex-start", minHeight: "80vh", overflowY: "auto", p: 2 }}>
                        <Container maxWidth="lg" sx={{ py: 0, px: 2, width: "100%" }}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    background: "rgba(255,255,255,0.18)",
                                    borderRadius: 6,
                                    p: 4, 
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 24px 4px #ff8c0088",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    color: "#fff"
                                }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                                        {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold" sx={{ 
                                        color: "#fff", 
                                        textShadow: "0 2px 8px rgba(26,35,126,0.2)",
                                        fontFamily: "'Poppins', 'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                        letterSpacing: "0.5px"
                                    }}>
                                        {userData.name || "N/A"}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ 
                                        color: "rgba(255,255,255,0.9)",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                        fontWeight: 500
                                    }}>
                                        {userData.collegeName || "N/A"} - {userData.selectedMajors?.join(", ") || "N/A"}
                                    </Typography>
                                </Box>
                                
                                {/* User Details Cards */}
                                <Grid container spacing={3} sx={{ mt: 2 }}>
                                    {/* Personal Information Card */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ 
                                            background: "rgba(255,255,255,0.12)",
                                            borderRadius: 4,
                                            p: 3, 
                                            backdropFilter: "blur(6px)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.25)"
                                        }}>
                                            <Typography variant="h6" sx={{ 
                                                color: "#fff", 
                                                fontWeight: 600, 
                                                mb: 2, 
                                                borderBottom: "2px solid rgba(255,140,0,0.6)", 
                                                pb: 1,
                                                fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                                                letterSpacing: "0.3px"
                                            }}>
                                                Personal Information
                                            </Typography>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>USN:</Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{userData.usn || "N/A"}</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Gender:</Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{userData.gender || "N/A"}</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Date of Birth:</Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{userData.dob || "N/A"}</Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Contact Information Card */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ 
                                            background: "rgba(255,255,255,0.12)",
                                            borderRadius: 4,
                                            p: 3, 
                                            backdropFilter: "blur(6px)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.25)"
                                        }}>
                                            <Typography variant="h6" sx={{ 
                                                color: "#fff", 
                                                fontWeight: 600, 
                                                mb: 2, 
                                                borderBottom: "2px solid rgba(26,35,126,0.8)", 
                                                pb: 1,
                                                fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                                                letterSpacing: "0.3px"
                                            }}>
                                                Contact Information
                                            </Typography>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Mobile:</Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{userData.mobileNumber || "N/A"}</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Alt Mobile:</Typography>
                                                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{userData.alternateMobileNumber || "N/A"}</Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Email Information Card */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ 
                                            background: "rgba(255,255,255,0.12)",
                                            borderRadius: 4,
                                            p: 3, 
                                            backdropFilter: "blur(6px)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.25)"
                                        }}>
                                            <Typography variant="h6" sx={{ 
                                                color: "#fff", 
                                                fontWeight: 600, 
                                                mb: 2, 
                                                borderBottom: "2px solid rgba(255,140,0,0.6)", 
                                                pb: 1,
                                                fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                                                letterSpacing: "0.3px"
                                            }}>
                                                Email Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Personal Email:</Typography>
                                                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, wordBreak: "break-all" }}>{userData.email || "N/A"}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>College Email:</Typography>
                                                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, wordBreak: "break-all" }}>{userData.collegeEmail || "N/A"}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* About Me Section */}
                                <Box mt={4}>
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.12)",
                                        borderRadius: 4,
                                        p: 3, 
                                        backdropFilter: "blur(6px)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.25)"
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            color: "#fff", 
                                            fontWeight: 600, 
                                            mb: 2, 
                                            borderBottom: "2px solid rgba(26,35,126,0.8)", 
                                            pb: 1,
                                            fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                                            letterSpacing: "0.3px"
                                        }}>
                                            About Me
                                        </Typography>
                                        <Typography variant="body1" sx={{ 
                                            color: "rgba(255,255,255,0.9)", 
                                            lineHeight: 1.6,
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }}>
                                            {userData.shortBio || "No bio available"}
                                        </Typography>
                                    </Paper>
                                </Box>
                                
                                {/* New Profile Features */}
                                <Box mt={4}>
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        p: 3, 
                                        mb: 3,
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
                                    }}>
                                        <Typography variant="h6" mb={1} sx={{ color: "#fff", fontWeight: 600 }}>Bio</Typography>
                                        <TextField 
                                            fullWidth 
                                            multiline 
                                            rows={3} 
                                            value={bio} 
                                            onChange={e => setBio(e.target.value)} 
                                            placeholder="Tell us about yourself..." 
                                            sx={{ 
                                                background: "rgba(255,255,255,0.7)", 
                                                borderRadius: 2,
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { border: 'none' }
                                                }
                                            }}
                                        />
                                        <Button 
                                            onClick={handleUpdateBio} 
                                            variant="contained"
                                            disabled={!bio.trim()}
                                            sx={{
                                                background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                                color: "#fff",
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                "&:hover": {
                                                    background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                                },
                                                "&:disabled": {
                                                    background: "rgba(255,255,255,0.3)",
                                                    color: "rgba(255,255,255,0.5)",
                                                },
                                            }}
                                        >
                                            Update Bio
                                        </Button>
                                    </Paper>
                                    
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        p: 3, 
                                        mb: 3,
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
                                    }}>
                                        <Typography variant="h6" mb={1} sx={{ color: "#fff", fontWeight: 600 }}>Skills</Typography>
                                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                                            {skills.map((skill, idx) => <Chip key={idx} label={skill} sx={{ background: "rgba(255,140,0,0.8)", color: "#fff" }} />)}
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <TextField 
                                                value={skillInput} 
                                                onChange={e => setSkillInput(e.target.value)} 
                                                placeholder="Add a skill" 
                                                size="small" 
                                                sx={{ 
                                                    flex: 1,
                                                    background: "rgba(255,255,255,0.7)", 
                                                    borderRadius: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }} 
                                            />
                                            <Button 
                                                onClick={handleAddSkill} 
                                                variant="contained"
                                                sx={{
                                                    background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                                    },
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Paper>
                                    
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        p: 3, 
                                        mb: 3,
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
                                    }}>
                                        <Typography variant="h6" mb={1} sx={{ color: "#fff", fontWeight: 600 }}>Interests</Typography>
                                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                                            {interests.map((interest, idx) => <Chip key={idx} label={interest} sx={{ background: "rgba(26,35,126,0.8)", color: "#fff" }} />)}
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <TextField 
                                                value={interestInput} 
                                                onChange={e => setInterestInput(e.target.value)} 
                                                placeholder="Add an interest" 
                                                size="small" 
                                                sx={{ 
                                                    flex: 1,
                                                    background: "rgba(255,255,255,0.7)", 
                                                    borderRadius: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }} 
                                            />
                                            <Button 
                                                onClick={handleAddInterest} 
                                                variant="contained"
                                                sx={{
                                                    background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                                    },
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Paper>
                                    
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        p: 3, 
                                        mb: 3,
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
                                    }}>
                                        <Typography variant="h6" mb={1} sx={{ color: "#fff", fontWeight: 600 }}>Achievements</Typography>
                                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                                            {achievements.map((ach, idx) => <Chip key={idx} label={ach} sx={{ background: "rgba(255,214,0,0.8)", color: "#000" }} />)}
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <TextField 
                                                value={achievementInput} 
                                                onChange={e => setAchievementInput(e.target.value)} 
                                                placeholder="Add an achievement" 
                                                size="small" 
                                                sx={{ 
                                                    flex: 1,
                                                    background: "rgba(255,255,255,0.7)", 
                                                    borderRadius: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }} 
                                            />
                                            <Button 
                                                onClick={handleAddAchievement} 
                                                variant="contained"
                                                sx={{
                                                    background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                                    },
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Box>
                                    </Paper>
                                    
                                    <Paper sx={{ 
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        p: 3, 
                                        mb: 3,
                                        backdropFilter: "blur(4px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.2)"
                                    }}>
                                        <Typography variant="h6" mb={1} sx={{ color: "#fff", fontWeight: 600 }}>Upload Resume / Portfolio</Typography>
                                        <Input 
                                            type="file" 
                                            onChange={handleResumeUpload} 
                                            sx={{ 
                                                background: "rgba(255,255,255,0.7)", 
                                                borderRadius: 2,
                                                p: 1,
                                                width: "100%"
                                            }}
                                        />
                                        {resume && <Typography mt={1} sx={{ color: "#fff" }}>Uploaded: {resume.name}</Typography>}
                                    </Paper>
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
        </Box>
    );
};

export default ProfilePage;
