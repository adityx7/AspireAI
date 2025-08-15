import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography, Link, Alert, CircularProgress } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit"; 
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // To navigate after login

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
                            Student Login
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="USN"
                                name="usn"
                                value={usn}
                                onChange={(e) => setUsn(e.target.value)}
                                error={!!usnError}
                                helperText={usnError}
                                inputRef={usnRef}
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
                            Don't have an account? <Link href="/student/register" sx={{ color: "#ffd600", textDecoration: "underline", fontWeight: 600 }}>
                                Sign up and Get Connected.
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }