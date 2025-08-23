import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography, Link, Alert, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; 
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // To navigate after login

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

const usnRegex = /^1BG\d{2}(CS|IS|AI|ME|EE|EC)\d{3}$/;

export default function SignInPage() {
    const [usn, setUsn] = useState("");
    const [password, setPassword] = useState("");
    const [usnError, setUsnError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const usnRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        if (usnRef.current) {
            usnRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsnError("");
        setPasswordError("");
        setErrorMessage("");
        setLoading(true);
        try {
            // Validate USN
            if (!usn) {
                setUsnError("USN is required.");
                usnRef.current.focus();
                setLoading(false);
                return;
            } else if (!usnRegex.test(usn)) {
                setUsnError("Please enter a valid USN (e.g., 1BG21CS001).");
                usnRef.current.focus();
                setLoading(false);
                return;
            }
            // Validate Password
            if (!password) {
                setPasswordError("Password is required.");
                passwordRef.current.focus();
                setLoading(false);
                return;
            } else if (password.length < 6) {
                setPasswordError("Password must be at least 6 characters.");
                passwordRef.current.focus();
                setLoading(false);
                return;
            }
            // Send login request to backend
            const response = await axios.post("http://localhost:5002/api/student/login", { usn, password });
            if (response.data.success) {
                localStorage.setItem("studentToken", response.data.token); // Store token
                localStorage.setItem("usn", usn);
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                setErrorMessage("Invalid USN or Password. Please try again.");
            }
        } catch (error) {
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
                            Student Login
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
                            Welcome back! Enter your credentials to continue.
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
                                University Seat Number (USN)
                            </Typography>
                            <TextField
                                fullWidth
                                name="usn"
                                value={usn}
                                onChange={(e) => setUsn(e.target.value)}
                                error={!!usnError}
                                helperText={usnError}
                                inputRef={usnRef}
                                variant="outlined"
                                placeholder="Enter your USN (e.g., 1BG21CS001)"
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
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                inputRef={passwordRef}
                                variant="outlined"
                                placeholder="Enter your password"
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
                            {loading ? <CircularProgress size={24} sx={{ color: "#1e3a8a" }} /> : "Login"}
                        </Button>
                    </form>

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: "#e2e8f0", 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            mb: 2
                        }}
                    >
                        Don't have an account?{" "}
                        <Link 
                            href="/student/register" 
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
                            Sign up and Get Connected.
                        </Link>
                    </Typography>

                    {/* Back to Home Link */}
                    <Link
                        href="/"
                        sx={{
                            color: "#cbd5e1",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            "&:hover": {
                                color: "#ffd700",
                                textDecoration: "underline",
                            },
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        }}
                    >
                        ← Back to Home
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}