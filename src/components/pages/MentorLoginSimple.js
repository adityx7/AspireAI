import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MentorSignInPage() {
    const navigate = useNavigate();
    const [mentorID, setMentorID] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const mentorIDRegex = /^BNM\d{4}$/;
    const validateMentorID = (id) => mentorIDRegex.test(id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset error
        setError("");
        
        // Validate mentor ID format
        if (!validateMentorID(mentorID)) {
            setError("Invalid Mentor ID format. Use format BNM followed by 4 digits (e.g., BNM0001).");
            return;
        }
        
        setLoading(true);
        
        try {
            // Attempt to login with backend
            const response = await axios.post("http://localhost:5002/api/mentors/login", {
                mentorID,
                password
            }, {
                timeout: 8000 // 8 seconds timeout
            });
            
            // Save the token to localStorage
            if (response.data && response.data.token) {
                localStorage.setItem("mentorToken", response.data.token);
                localStorage.setItem("mentorID", mentorID);
                
                // Navigate to mentor dashboard
                navigate("/dashboard-mentor");
            } else {
                setError("Login successful but no token received. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            
            if (err.code === "ECONNABORTED") {
                setError("Connection timeout. Server may be down.");
                console.log("Using fallback login for development");
                
                // DEVELOPMENT FALLBACK - REMOVE IN PRODUCTION
                // This simulates a successful login when server is unavailable
                // for demonstration and development purposes
                if (mentorID === "BNM0002" && password) {
                    localStorage.setItem("mentorID", mentorID);
                    // For development, navigate to dashboard even without a token
                    setTimeout(() => {
                        navigate("/dashboard-mentor");
                    }, 1000);
                    return;
                }
            } else if (!navigator.onLine) {
                setError("You are offline. Please check your internet connection.");
            } else if (err.response) {
                // Server responded with error
                switch (err.response.status) {
                    case 401:
                        setError("Invalid credentials. Please check your Mentor ID and password.");
                        break;
                    case 404:
                        setError("Mentor account not found. Please check your Mentor ID.");
                        break;
                    default:
                        setError(err.response.data.message || "Login failed. Please try again.");
                }
            } else {
                setError("Network error. Please try again.");
                
                // DEVELOPMENT FALLBACK - REMOVE IN PRODUCTION
                // This simulates a successful login when server is unavailable
                if (mentorID === "BNM0002" && password) {
                    localStorage.setItem("mentorID", mentorID);
                    setTimeout(() => {
                        navigate("/dashboard-mentor");
                    }, 1000);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                minHeight: "100vh", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "linear-gradient(135deg, #0A192F 0%, #112240 100%)"
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    width: "100%", 
                    maxWidth: 400,
                    background: "rgba(255, 255, 255, 0.95)"
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{ color: "#B8860B", fontWeight: "bold" }}>
                    Mentor Login
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <TextField
                        fullWidth
                        label="Mentor ID"
                        value={mentorID}
                        onChange={(e) => setMentorID(e.target.value.toUpperCase())}
                        margin="normal"
                        required
                        placeholder="e.g., BNM0001"
                        error={mentorID !== "" && !validateMentorID(mentorID)}
                        helperText={mentorID !== "" && !validateMentorID(mentorID) ? 
                            "Mentor ID must be BNM followed by 4 digits" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Box component="span" sx={{ color: "#B8860B" }}>
                                        ID
                                    </Box>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            background: "linear-gradient(135deg, #B8860B, #DAA520)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #DAA520, #B8860B)"
                            },
                            position: "relative"
                        }}
                    >
                        {loading ? (
                            <CircularProgress 
                                size={24} 
                                sx={{ 
                                    color: "white",
                                    position: "absolute"
                                }}
                            />
                        ) : "Sign In"}
                    </Button>
                    
                    <Typography variant="body2" align="center">
                        Don't have an account?{" "}
                        <Button 
                            variant="text" 
                            onClick={() => navigate("/mentor/register")}
                            sx={{ color: "#B8860B" }}
                        >
                            Register as a Mentor
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}