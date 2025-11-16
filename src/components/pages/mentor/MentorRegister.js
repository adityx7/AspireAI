import React, { useState, useEffect } from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Link,
    InputAdornment,
    IconButton,
    CircularProgress,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { Person, Email, Lock, Badge, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Styling constants
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const NAVY_BLUE_DARK = "#020c1b";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";
const FONT_FAMILY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Shimmer background styles
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

export default function MentorRegister() {
    const [fullName, setFullName] = useState("");
    const [mentorID, setMentorID] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Floating decorative elements
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

    const validateForm = () => {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!mentorID.trim()) {
            newErrors.mentorID = "Mentor ID is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5002/api/mentors/register", {
                fullName,
                mentorID,
                email,
                password,
            });

            if (response.data.success) {
                toast.success("Registration successful! Redirecting to login...", {
                    position: "top-center",
                    autoClose: 2000,
                });
                
                setTimeout(() => {
                    navigate("/mentor-login");
                }, 2000);
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
            });
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
                {/* Left Section (Form) */}
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
                            Join as Mentor
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#F8FAFC', opacity: 0.8, mt: 1 }}>
                            Help shape the future by mentoring students
                        </Typography>
                    </Box>

                    {/* Registration Form */}
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
                                label="Full Name"
                                name="fullName"
                                autoComplete="name"
                                autoFocus
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: GOLD_MAIN }} />
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
                                label="Mentor ID"
                                name="mentorID"
                                value={mentorID}
                                onChange={(e) => setMentorID(e.target.value)}
                                error={!!errors.mentorID}
                                helperText={errors.mentorID}
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
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: GOLD_MAIN }} />
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
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
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
                                                sx={{ color: 'rgba(248, 250, 252, 0.7)' }}
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
                                    "& .MuiInputBase-input": { color: "#F8FAFC" },
                                    "& .MuiFormHelperText-root": { color: "#ef4444" }
                                }}
                            />
                            
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: GOLD_MAIN }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                sx={{ color: 'rgba(248, 250, 252, 0.7)' }}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                    "& .MuiInputBase-input": { color: "#F8FAFC" },
                                    "& .MuiFormHelperText-root": { color: "#ef4444" }
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
                                    py: 1.5,
                                    background: `linear-gradient(135deg, \${GOLD_MAIN} 0%, \${GOLD_LIGHT} 100%)`,
                                    color: NAVY_BLUE_MAIN,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: `0 4px 20px rgba(184, 134, 11, 0.3)`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, \${GOLD_LIGHT} 0%, \${GOLD_MAIN} 100%)`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 6px 25px rgba(184, 134, 11, 0.4)`,
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTER"}
                            </Button>
                            
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link 
                                        href="/mentor-login" 
                                        variant="body2"
                                        sx={{ 
                                            color: GOLD_LIGHT,
                                            textDecoration: "none",
                                            fontWeight: 500,
                                            "&:hover": { 
                                                textDecoration: "underline",
                                                color: GOLD_MAIN
                                            },
                                            transition: 'color 0.3s ease'
                                        }}
                                    >
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
                
                {/* Right Section */}
                {!isMobile && (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box className="slide-in-right" sx={{ maxWidth: 550, width: "100%", zIndex: 2, position: 'relative' }}>
                            <Paper sx={{ 
                                width: "100%", 
                                background: 'rgba(248, 250, 252, 0.05)',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(248, 250, 252, 0.1)', 
                                padding: 4, 
                                borderRadius: 6,
                                boxShadow: `
                                    0 10px 40px rgba(10, 25, 47, 0.3),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                `,
                            }}>
                                <Typography variant="h4" fontWeight="bold" mb={3} sx={{ 
                                    color: GOLD_MAIN, 
                                    fontSize: '2.5rem',
                                    textAlign: 'center',
                                    fontFamily: FONT_FAMILY,
                                    textShadow: `0 2px 10px rgba(184, 134, 11, 0.3)`,
                                }}>
                                    Welcome to AspireAI!
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: "#F8FAFC", 
                                    mb: 3, 
                                    fontFamily: FONT_FAMILY,
                                    lineHeight: 1.7,
                                    fontSize: '1.1rem'
                                }}>
                                    Thank you for your interest in volunteering as an AspireAI mentor to help students who are in need to achieve their college and career dreams. The AspireAI mentoring model is completely virtual: you will conduct all communication through our online platform, without ever having to share your personal contact info with your mentee.
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: "rgba(248, 250, 252, 0.8)", 
                                    fontFamily: FONT_FAMILY,
                                    lineHeight: 1.7,
                                    fontSize: '1rem'
                                }}>
                                    The platform also contains all the tools and resources you will need to be successful as a mentor, including mentor training that takes about 30 minutes to complete and can be found in the "help" tab upon registering.
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                )}
            </Grid>
            
            <ToastContainer 
                position="top-center" 
                toastStyle={{
                    background: 'rgba(10, 25, 47, 0.95)',
                    color: '#F8FAFC',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(184, 134, 11, 0.3)'
                }}
            />
        </Box>
    );
}
