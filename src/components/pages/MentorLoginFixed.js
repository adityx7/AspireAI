import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    Grid
} from "@mui/material";
import { Badge, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Constants for styling - matching the registration theme exactly
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";
const FONT_FAMILY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const mentorIDRegex = /^BNM\d{4}$/;

// Shimmer background styles - exact match from registration
const shimmerBackground = {
    position: 'relative',
    minHeight: '100vh',
    background: `linear-gradient(135deg, 
        ${NAVY_BLUE_MAIN} 0%, 
        ${NAVY_BLUE_LIGHT} 35%, 
        ${NAVY_BLUE_DARK} 100%)`,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(ellipse at 25% 25%, rgba(184, 134, 11, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, rgba(184, 134, 11, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(218, 165, 32, 0.03) 0%, transparent 50%)
        `,
        zIndex: 0
    },
    // Animation classes
    '& .fade-in-up': {
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0,
        transform: 'translateY(30px)',
    },
    '& .scale-in': {
        animation: 'scaleIn 0.7s ease-out forwards',
        opacity: 0,
        transform: 'scale(0.9)',
        animationDelay: '0.2s'
    },
    '& .slide-in-right': {
        animation: 'slideInRight 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateX(30px)',
        animationDelay: '0.4s'
    },
    '& .floating-element': {
        willChange: 'transform',
    },
    '@keyframes fadeInUp': {
        'to': {
            opacity: 1,
            transform: 'translateY(0)',
        }
    },
    '@keyframes scaleIn': {
        'to': {
            opacity: 1,
            transform: 'scale(1)',
        }
    },
    '@keyframes slideInRight': {
        'to': {
            opacity: 1,
            transform: 'translateX(0)',
        }
    },
    '@keyframes floating': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '25%': { transform: 'translateY(-10px) rotate(1deg)' },
        '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
        '75%': { transform: 'translateY(-15px) rotate(0.5deg)' }
    }
};

const shimmerOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(
        45deg,
        transparent 30%,
        rgba(184, 134, 11, 0.02) 40%,
        rgba(218, 165, 32, 0.03) 50%,
        rgba(184, 134, 11, 0.02) 60%,
        transparent 70%
    )`,
    backgroundSize: '200% 200%',
    animation: 'shimmerMove 4s ease-in-out infinite',
    '@keyframes shimmerMove': {
        '0%': { backgroundPosition: '200% 200%' },
        '50%': { backgroundPosition: '0% 0%' },
        '100%': { backgroundPosition: '200% 200%' }
    },
    zIndex: 1
};

export default function MentorSignInPage() {
    const navigate = useNavigate();
    const [mentorID, setMentorID] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Floating decorative elements - exact match from registration
    const floatingElements = [
        { 
            color: GOLD_MAIN, 
            size: '80px', 
            top: '10%', 
            left: '5%', 
            duration: '6s', 
            delay: '0s',
            shape: 'circle'
        },
        { 
            color: GOLD_LIGHT, 
            size: '60px', 
            top: '60%', 
            right: '8%', 
            duration: '8s', 
            delay: '2s',
            shape: 'square',
            rotation: '45deg'
        },
        { 
            color: GOLD_MAIN, 
            size: '40px', 
            bottom: '20%', 
            left: '12%', 
            duration: '7s', 
            delay: '1s',
            shape: 'circle'
        },
        { 
            color: GOLD_LIGHT, 
            size: '100px', 
            top: '30%', 
            right: '15%', 
            duration: '9s', 
            delay: '3s',
            shape: 'square',
            rotation: '30deg'
        },
        { 
            color: GOLD_MAIN, 
            size: '50px', 
            bottom: '40%', 
            right: '5%', 
            duration: '5s', 
            delay: '1.5s',
            shape: 'circle'
        }
    ];

    useEffect(() => {
        // Trigger animations on mount
        const elements = document.querySelectorAll('.fade-in-up, .scale-in, .slide-in-right');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
    }, []);

    const validateMentorID = (id) => mentorIDRegex.test(id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!mentorID || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateMentorID(mentorID)) {
            setError("Mentor ID must be in format BNM#### (e.g., BNM0001)");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5002/api/mentors/login", {
                mentorID,
                password
            }, {
                timeout: 8000 // 8 seconds timeout
            });

            if (response.data && response.data.success) {
                setSuccess("Login successful! Redirecting...");
                localStorage.setItem("mentorToken", response.data.token);
                localStorage.setItem("mentorID", mentorID);
                if (response.data.mentor) {
                    localStorage.setItem("mentorData", JSON.stringify(response.data.mentor));
                }
                
                setTimeout(() => {
                    navigate("/dashboard-mentor");
                }, 1500);
            } else {
                setError(response.data && response.data.message ? response.data.message : "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            
            if (err.code === "ECONNABORTED") {
                setError("Connection timeout. Server may be down.");
                console.log("Using fallback login for development");
                
                // DEVELOPMENT FALLBACK - REMOVE IN PRODUCTION
                // This simulates a successful login when server is unavailable
                if (mentorID === "BNM0002" && password === "Sam@0002") {
                    localStorage.setItem("mentorID", mentorID);
                    // For development, navigate to dashboard even without a token
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        navigate("/dashboard-mentor");
                    }, 1500);
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
                        
                        // Special case for the demo account
                        if (mentorID === "BNM0002" && password === "Sam@0002") {
                            setError("");
                            setSuccess("Login successful! Redirecting...");
                            localStorage.setItem("mentorID", mentorID);
                            setTimeout(() => {
                                navigate("/dashboard-mentor");
                            }, 1500);
                        }
                        break;
                    default:
                        setError(err.response.data.message || "Login failed. Please try again.");
                }
            } else {
                setError("Network error. Please try again.");
                
                // DEVELOPMENT FALLBACK - REMOVE IN PRODUCTION
                // This allows access with test account when backend is unavailable
                if (mentorID === "BNM0002" && password === "Sam@0002") {
                    localStorage.setItem("mentorID", mentorID);
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        navigate("/dashboard-mentor");
                    }, 1500);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={shimmerBackground}>
            {/* Shimmer overlay */}
            <Box sx={shimmerOverlay} />
            
            {/* Floating decorative elements */}
            {floatingElements.map((element, index) => (
                <Box
                    key={index}
                    className="floating-element"
                    sx={{
                        position: 'absolute',
                        width: element.width || element.size,
                        height: element.height || element.size,
                        background: `linear-gradient(135deg, ${element.color}20, ${element.color}40)`,
                        borderRadius: element.shape === 'circle' ? '50%' : '20%',
                        top: element.top,
                        left: element.left,
                        right: element.right,
                        bottom: element.bottom,
                        transform: element.rotation ? `rotate(${element.rotation})` : 'none',
                        animation: `floating ${element.duration} ease-in-out infinite`,
                        animationDelay: element.delay,
                        opacity: 0.6,
                        zIndex: 1,
                        border: `1px solid ${element.color}60`,
                        backdropFilter: 'blur(10px)',
                    }}
                />
            ))}

            <Grid container sx={{ minHeight: "100vh", position: 'relative', zIndex: 2 }}>
                {/* Left Section (Login Form) */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        p: { xs: 3, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Header Section */}
                    <Box className="fade-in-up" sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                                filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                                fontSize: { xs: "1.8rem", md: "2.5rem" }
                            }}
                        >
                            Mentor Login
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#F8FAFC', opacity: 0.8, mt: 1 }}>
                            Welcome back! Sign in to your mentor account
                        </Typography>
                    </Box>

                    {/* Login Form */}
                    <Paper
                        className="scale-in"
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 450,
                            p: { xs: 3, md: 4 },
                            background: 'rgba(248, 250, 252, 0.05)',
                            backdropFilter: 'blur(15px)',
                            borderRadius: 3,
                            border: '1px solid rgba(248, 250, 252, 0.1)',
                            boxShadow: `
                                0 10px 40px rgba(10, 25, 47, 0.3),
                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `,
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Mentor ID"
                                name="mentorID"
                                placeholder="e.g., BNM0001"
                                autoComplete="username"
                                autoFocus
                                value={mentorID}
                                onChange={(e) => setMentorID(e.target.value.toUpperCase())}
                                error={mentorID && !validateMentorID(mentorID)}
                                helperText={mentorID && !validateMentorID(mentorID) ? "Format: BNM#### (e.g., BNM0001)" : ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Badge sx={{ color: GOLD_MAIN }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiInputLabel-root": { 
                                        color: "rgba(248, 250, 252, 0.7)",
                                        '&.Mui-focused': { color: GOLD_MAIN }
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "rgba(248, 250, 252, 0.3)" },
                                        "&:hover fieldset": { 
                                            borderColor: GOLD_LIGHT,
                                            boxShadow: `0 0 10px rgba(184, 134, 11, 0.2)`
                                        },
                                        "&.Mui-focused fieldset": { 
                                            borderColor: GOLD_MAIN,
                                            boxShadow: `0 0 15px rgba(184, 134, 11, 0.3)`
                                        },
                                    },
                                    "& .MuiInputBase-input": { color: "#F8FAFC" },
                                    "& .MuiFormHelperText-root": { color: "#ef4444" }
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: GOLD_MAIN }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: "rgba(248, 250, 252, 0.7)" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiInputLabel-root": { 
                                        color: "rgba(248, 250, 252, 0.7)",
                                        '&.Mui-focused': { color: GOLD_MAIN }
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "rgba(248, 250, 252, 0.3)" },
                                        "&:hover fieldset": { 
                                            borderColor: GOLD_LIGHT,
                                            boxShadow: `0 0 10px rgba(184, 134, 11, 0.2)`
                                        },
                                        "&.Mui-focused fieldset": { 
                                            borderColor: GOLD_MAIN,
                                            boxShadow: `0 0 15px rgba(184, 134, 11, 0.3)`
                                        },
                                    },
                                    "& .MuiInputBase-input": { color: "#F8FAFC" }
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                                    {success}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                    border: `1px solid ${GOLD_MAIN}`,
                                    borderRadius: 2,
                                    color: "#0A192F",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    boxShadow: `0 4px 15px rgba(184, 134, 11, 0.3)`,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                        background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 8px 25px rgba(184, 134, 11, 0.4)`,
                                    },
                                    "&:active": {
                                        transform: "translateY(0)",
                                    },
                                    "&:disabled": {
                                        background: "rgba(248, 250, 252, 0.1)",
                                        color: "rgba(248, 250, 252, 0.5)",
                                        border: "1px solid rgba(248, 250, 252, 0.2)",
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: "#0A192F" }} /> : "SIGN IN"}
                            </Button>

                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Typography variant="body2" sx={{ color: "rgba(248, 250, 252, 0.7)" }}>
                                    Already have an account?{" "}
                                    <Button
                                        variant="text"
                                        onClick={() => navigate("/mentor/register")}
                                        sx={{
                                            color: GOLD_MAIN,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            textDecoration: "underline",
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                                color: GOLD_LIGHT,
                                                textDecoration: "underline",
                                            }
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Section (Welcome Message) */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        p: { xs: 3, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(184, 134, 11, 0.05) 0%, rgba(218, 165, 32, 0.1) 100%)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Box className="slide-in-right" sx={{ textAlign: 'center', maxWidth: 500 }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                                filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                                fontSize: { xs: "1.8rem", md: "2.5rem" },
                                mb: 3
                            }}
                        >
                            Welcome to Career Compass!
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#F8FAFC', 
                                opacity: 0.9, 
                                lineHeight: 1.7,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                mb: 3
                            }}
                        >
                            Thank you for your interest in volunteering as a Compass mentor 
                            to help students who are in need to achieve their college and 
                            career dreams. The Compass mentoring model is completely 
                            virtual: you will conduct all communication through our online 
                            platform, without ever having to share your personal contact info 
                            with your mentee.
                        </Typography>

                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#F8FAFC', 
                                opacity: 0.9, 
                                lineHeight: 1.7,
                                fontSize: { xs: "1rem", md: "1.1rem" }
                            }}
                        >
                            The platform also contains all the tools and resources you will need to 
                            be successful as a mentor, including mentor training that takes about 
                            30 minutes to complete and can be found in the "help" tab upon 
                            registering.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}