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
import PersonIcon from "@mui/icons-material/Person";

const mentorIDRegex = /^BNM\d{4}$/;

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
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
    background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
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
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                        borderRadius: 6,
                        p: { xs: 4, md: 8 },
                        textAlign: "center",
                        boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        color: "#e2e8f0",
                        width: { xs: "90%", sm: "500px" },
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Header with Icon */}
                    <Box sx={{ mb: 4 }}>
                        <PersonIcon
                            sx={{
                                fontSize: 60,
                                color: "#ffd700",
                                mb: 2,
                                p: 1.5,
                                backgroundColor: "rgba(255,215,0,0.1)",
                                borderRadius: "50%",
                                border: "2px solid rgba(255,215,0,0.3)",
                            }}
                        />
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700, 
                                color: "#ffd700", 
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
                                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                mb: 1
                            }}
                        >
                            Mentor Login
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#e2e8f0",
                                opacity: 0.9,
                                fontSize: "1.1rem",
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            }}
                        >
                            Welcome back! Enter your credentials to access your mentor dashboard.
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3, textAlign: "left" }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#ffd700",
                                    mb: 1,
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                }}
                            >
                                Mentor ID
                            </Typography>
                            <TextField
                                fullWidth
                                name="mentorID"
                                placeholder="Enter your Mentor ID (e.g., BNM0001)"
                                value={mentorID}
                                onChange={(e) => setmentorID(e.target.value)}
                                error={!!mentorIDError}
                                helperText={mentorIDError}
                                inputRef={mentorIDRef}
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        color: "#e2e8f0",
                                        backgroundColor: "rgba(15,23,42,0.5)",
                                        borderRadius: 2,
                                        "& fieldset": {
                                            borderColor: "rgba(255,215,0,0.3)",
                                            borderWidth: "2px",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "rgba(255,215,0,0.5)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ffd700",
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "14px 16px",
                                    },
                                    "& .MuiOutlinedInput-input::placeholder": {
                                        color: "#cbd5e1",
                                        opacity: 0.7,
                                    },
                                    "& .MuiFormHelperText-root": {
                                        color: "#ef4444",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 4, textAlign: "left" }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#ffd700",
                                    mb: 1,
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                }}
                            >
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                inputRef={passwordRef}
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        color: "#e2e8f0",
                                        backgroundColor: "rgba(15,23,42,0.5)",
                                        borderRadius: 2,
                                        "& fieldset": {
                                            borderColor: "rgba(255,215,0,0.3)",
                                            borderWidth: "2px",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "rgba(255,215,0,0.5)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ffd700",
                                            borderWidth: "2px",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "14px 16px",
                                    },
                                    "& .MuiOutlinedInput-input::placeholder": {
                                        color: "#cbd5e1",
                                        opacity: 0.7,
                                    },
                                    "& .MuiFormHelperText-root": {
                                        color: "#ef4444",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    },
                                }}
                            />
                        </Box>

                        {errorMessage && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3,
                                    backgroundColor: "rgba(239,68,68,0.1)",
                                    color: "#ef4444",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    borderRadius: 2,
                                    "& .MuiAlert-icon": {
                                        color: "#ef4444",
                                    },
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                }}
                            >
                                {errorMessage}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                                color: "#1e3a8a",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                py: 1.8,
                                borderRadius: 3,
                                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                textTransform: "none",
                                mb: 3,
                                "&:hover": {
                                    background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                    boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                                    transform: "translateY(-1px)",
                                },
                                "&:disabled": {
                                    background: "rgba(255,215,0,0.3)",
                                    color: "#1e3a8a",
                                },
                                transition: "all 0.3s ease",
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: "#1e3a8a" }} />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>

                    {/* Navigation Links */}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            mt: 2, 
                            color: "#e2e8f0", 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            mb: 2
                        }}
                    >
                        Don't have an account?{" "}
                        <Link 
                            href="/mentor/register" 
                            sx={{ 
                                color: "#ffd700", 
                                textDecoration: "none", 
                                fontWeight: 600,
                                "&:hover": {
                                    color: "#ffed4e",
                                    textDecoration: "underline",
                                }
                            }}
                        >
                            Create Mentor Account
                        </Link>
                    </Typography>

                    {/* Additional Links */}
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#cbd5e1",
                                mb: 2,
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            }}
                        >
                            Are you a student?
                        </Typography>
                        <Link
                            href="/login"
                            sx={{
                                color: "#ffd700",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                "&:hover": {
                                    color: "#ffed4e",
                                    textDecoration: "underline",
                                },
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            }}
                        >
                            Login as Student
                        </Link>
                    </Box>

                    {/* Back to Home */}
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate("/")}
                            sx={{
                                color: "#ffd700",
                                fontWeight: 500,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "rgba(255,215,0,0.1)",
                                    color: "#ffed4e",
                                },
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            }}
                        >
                            ← Back to Home
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
