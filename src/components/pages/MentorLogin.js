import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const mentorIDRegex = /^BNM\d{4}$/;

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)",
    position: "relative",
    overflow: "hidden",
};

const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
    animation: "shimmer 2.5s infinite linear",
    zIndex: 0,
    pointerEvents: "none",
};

export default function MentorSignInPage() {
    const navigate = useNavigate();
    const [mentorID, setmentorID] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For login errors
    const [password, setPassword] = useState("");
    const [mentorIDError, setMentorIDError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    // Refs for focusing on the fields
    const mentorIDRef = useRef(null);
    const passwordRef = useRef(null);

    // Focus on mentorID when the component mounts
    useEffect(() => {
        if (mentorIDRef.current) {
            mentorIDRef.current.focus(); // Focus on mentorID field
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setMentorIDError("");
        setPasswordError("");
        setErrorMessage(""); // Reset error message before login attempt

        // Validate mentorID
        if (!mentorID) {
            setMentorIDError("Mentor ID is required.");
            mentorIDRef.current.focus();
            return;
        } else if (!mentorIDRegex.test(mentorID)) {
            setMentorIDError("Please enter a valid Mentor ID (e.g., BNM0001).");
            mentorIDRef.current.focus();
            return;
        }

        // Validate password
        if (!password) {
            setPasswordError("Password is required.");
            passwordRef.current.focus();
            return;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            passwordRef.current.focus();
            return;
        }

        setLoading(true);
        try {
            console.log("Sending request with:", { mentorID, password });
        
            const response = await axios.post("http://localhost:5002/api/mentor/login", {
                mentorID,
                password
            });
        
            console.log("Response received:", response.data); // ✅ Debugging log
        
            if (response.data.success) {
                console.log("Mentor Token:", response.data.token); // ✅ Debug token before storing
                localStorage.setItem("mentorToken", response.data.token); // Store token
                localStorage.setItem("mentorID", mentorID);
                navigate("/dashboard-mentor"); // Redirect to dashboard
            } else {
                console.log("Error:", response.data.message); // ✅ Log error message
                setErrorMessage("Invalid Mentor ID or Password. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error);
            setErrorMessage("Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }        
    };

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ ...shimmerOverlay }} />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        background: "rgba(255,255,255,0.18)",
                        borderRadius: 6,
                        p: { xs: 4, md: 8 },
                        textAlign: "center",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 24px 4px #ff8c0088",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#222",
                        width: { xs: "90%", sm: "500px" },
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#fff", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", textShadow: "0 2px 8px rgba(26,35,126,0.2)" }}>
                        Mentor Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Mentor ID"
                            name="mentorID"
                            placeholder="BNM0001"
                            value={mentorID}
                            onChange={(e) => setmentorID(e.target.value)}
                            error={!!mentorIDError}
                            helperText={mentorIDError}
                            inputRef={mentorIDRef}
                            variant="outlined"
                            sx={{ mb: 2, background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            inputRef={passwordRef}
                            variant="outlined"
                            sx={{ mb: 2, background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                        />
                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                boxShadow: "0 4px 16px rgba(26,35,126,0.15), 0 0 16px 2px #ff8c0088",
                                textTransform: "none",
                                mb: 2,
                                "&:hover": {
                                    background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                    boxShadow: "0 4px 24px rgba(26,35,126,0.25), 0 0 32px 4px #ff8c00bb",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2, color: "#fff", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                        Don't have an account? <Link href="/mentor/register" sx={{ color: "#ffd600", textDecoration: "underline", fontWeight: 600 }}>
                            Create Mentor Account
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
