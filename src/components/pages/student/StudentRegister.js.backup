import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Link,
    useMediaQuery,
    IconButton,
    CircularProgress,
} from "@mui/material";
import Slider from "react-slick";
import GroupIcon from '@mui/icons-material/Group';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { toast, ToastContainer } from 'react-toastify';
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Constants for styling
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#172A45";
const NAVY_BLUE_DARK = "#0D1B2A";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";
const GOLD_DARK = "#8B6914";
const FONT_FAMILY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Animation constants
const ANIMATIONS = {
    fadeIn: "fadeIn",
    slideUp: "slideUp",
    slideLeft: "slideLeft",
    slideRight: "slideRight",
    float: "float",
    "@keyframes fadeIn": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    },
    "@keyframes slideUp": {
        "0%": { opacity: 0, transform: "translateY(30px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes slideLeft": {
        "0%": { opacity: 0, transform: "translateX(30px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
    },
    "@keyframes slideRight": {
        "0%": { opacity: 0, transform: "translateX(-30px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
    },
    "@keyframes float": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" },
    },
};

// Floating elements for background design
const floatingElements = [
    { size: '300px', color: GOLD_MAIN, top: '15%', left: '10%', duration: '15s', delay: '0s' },
    { size: '200px', color: NAVY_BLUE_LIGHT, top: '60%', left: '75%', duration: '12s', delay: '2s' },
    { size: '150px', color: GOLD_LIGHT, top: '80%', left: '20%', duration: '10s', delay: '1s' },
    { size: '250px', color: NAVY_BLUE_DARK, top: '20%', left: '80%', duration: '14s', delay: '3s' },
];

// Helper function for RGB conversion (for transparency in styling)
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "0, 0, 0";
};

// Shimmer styles for background and overlay
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: FONT_FAMILY,
    background: `
        radial-gradient(circle at 20% 80%, ${NAVY_BLUE_DARK} 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${GOLD_DARK} 0%, transparent 50%),
        linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_DARK} 100%)
    `,
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
    background: `
        radial-gradient(circle at 25% 25%, ${GOLD_MAIN}20 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, ${NAVY_BLUE_DARK}30 0%, transparent 50%)
    `,
    animation: "shimmer 8s ease-in-out infinite alternate",
    zIndex: 0,
    pointerEvents: "none",
    '@keyframes shimmer': {
        '0%': { opacity: 0.7 },
        '50%': { opacity: 0.9 },
        '100%': { opacity: 0.7 }
    }
};


// Email validation regex (XX<branch short code>XXX@bnmit.in)
const emailRegex = /^[0-9]{2}(cse|eee|aiml|ise|me|ece)[0-9]{3}@bnmit\.in$/;

// USN validation regex (1BG<year of admission (2 digits)><branch (CS, IS, AI, ME, EE, EC)><3 digits>)
const usnRegex = /^1BG\d{2}(CS|IS|AI|ME|EE|EC)\d{3}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&_()#])[A-Za-z\d@$!%?&_()#]{8,}$/;


export default function StudentRegister() {
    const [showForm, setShowForm] = useState(false);
    const isMobile = useMediaQuery("(max-width:800px)");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();  // Initialize useNavigate
    
    const [formData, setFormData] = useState({
        fullName: "",
        usn: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        usn: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        // Validation Logic (same as before)
        if (!formData.fullName) validationErrors.fullName = "Full Name is required";
        if (!formData.email) validationErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) {
            validationErrors.email = "Please enter a valid email (e.g., 21cse001@bnmit.in)";
        }
        if (!formData.usn) validationErrors.usn = "USN is required";
        else if (!usnRegex.test(formData.usn)) {
            validationErrors.usn = "Please enter a valid USN (e.g., 1BG21CS001)";
        }
        if (!formData.password) {
            validationErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            validationErrors.password = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors in the form.", {
                autoClose: 3000,
                position: "top-right"
            });
        } else {
            // Reset errors and form fields before submitting
            setErrors({});
            setFormData({
                fullName: "",
                usn: "",
                email: "",
                password: "",
            });

            try {
                // Sending the form data to the backend
                const response = await fetch('http://localhost:5002/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    toast.success("Registration successful!");
                    console.log("Form submitted", formData);
                    setFormData({ fullName: "", usn: "", email: "", password: "" });
                    setTimeout(() => {
                        navigate("/dashboard");  // Redirect to dashboard
                    }, 1000);  // Delay navigation slightly for better UX

                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || "An error occurred.");
                }
            } catch (error) {
                toast.error("An error occurred while submitting the form.");
                console.error("Error submitting form:", error);
            }
        }
    };

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Add animation trigger
    useEffect(() => {
        // Trigger animations on page load
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.fade-in-up, .scale-in');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 200);
            });
        }, 300);
    }, []);

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ ...shimmerOverlay }} />
            
            {/* Floating Background Elements */}
            {floatingElements.map((el, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        width: el.size,
                        height: el.size,
                        background: `radial-gradient(circle, ${el.color}40, transparent)`,
                        borderRadius: '50%',
                        top: el.top,
                        left: el.left,
                        animation: `float ${el.duration} ease-in-out infinite ${el.delay}`,
                        zIndex: 2,
                        '@keyframes float': {
                            '0%, 100%': {
                                transform: 'translateY(0px) rotate(0deg)',
                            },
                            '50%': {
                                transform: 'translateY(-20px) rotate(180deg)',
                            },
                        },
                    }}
                />
            ))}
            <Grid container sx={{ 
                minHeight: "100vh", 
                position: "relative", 
                zIndex: 1,
                p: { xs: 2, md: 4 },
            }}>
            {/* Left Side (Form Background) */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    opacity: 0,
                    animation: `${ANIMATIONS.fadeIn} 0.8s ease-out forwards`,
                    padding: 4,
                }}
            >
                <Box sx={{
                    maxWidth: 420,
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    boxShadow: `
                        0 25px 50px -12px rgba(10, 25, 47, 0.25),
                        0 0 0 1px rgba(184, 134, 11, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    border: `1px solid rgba(${hexToRgb(GOLD_MAIN)}, 0.2)`,
                    transition: 'all 0.3s ease',
                    position: "relative",
                    overflow: "hidden",
                    p: { xs: 3, md: 5 },
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `
                            0 32px 64px -12px rgba(10, 25, 47, 0.35),
                            0 0 0 1px rgba(184, 134, 11, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                    },
                }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={2}
                        sx={{ 
                            fontFamily: FONT_FAMILY, 
                            color: NAVY_BLUE_MAIN, 
                            textShadow: `0 2px 8px ${GOLD_MAIN}30`,
                            opacity: 0,
                            animation: `${ANIMATIONS.slideUp} 0.6s ease-out 0.2s forwards`,
                        }}
                    >
                        Get started today, it's 100% free.
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        mb={4}
                        sx={{ 
                            fontFamily: FONT_FAMILY, 
                            color: NAVY_BLUE_MAIN, 
                            opacity: 0,
                            animation: `${ANIMATIONS.slideUp} 0.6s ease-out 0.4s forwards`,
                        }}
                    >
                        Create an account and connect with a mentor within minutes!
                    </Typography>

                    {!showForm && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setShowForm(true)}
                            fullWidth
                            sx={{
                                mb: 2,
                                textTransform: "none",
                                py: { xs: 1.2, sm: 1.7 },
                                mt: 2,
                                fontFamily: FONT_FAMILY,
                                fontWeight: 600,
                                fontSize: '1rem',
                                letterSpacing: '0.5px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_DARK} 100%)`,
                                boxShadow: `0 8px 25px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.5)`,
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: 0,
                                animation: `${ANIMATIONS.slideUp} 0.6s ease-out 0.6s forwards`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD_MAIN} 100%)`,
                                    transform: 'translateY(-3px)',
                                    boxShadow: `0 12px 30px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.6)`,
                                },
                                '&:active': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 5px 15px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.4)`,
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                                    transform: 'translateX(-100%)',
                                    transition: 'all 0.6s ease',
                                },
                                '&:hover::before': {
                                    transform: 'translateX(100%)',
                                },
                            }}
                        >
                            Sign in with Email
                        </Button>
                    )}

                    {showForm && (
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit}
                            sx={{
                                opacity: 0,
                                animation: `${ANIMATIONS.fadeIn} 0.6s ease-out forwards`,
                            }}
                        >
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.fullName)}
                                        helperText={errors.fullName}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                fontFamily: FONT_FAMILY,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                "&.Mui-focused": {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px rgba(${hexToRgb(GOLD_MAIN)}, 0.15)`,
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: GOLD_MAIN,
                                                        borderWidth: '2px',
                                                        boxShadow: `0 0 0 3px rgba(${hexToRgb(GOLD_MAIN)}, 0.1)`,
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    transform: 'translateY(-1px)',
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: NAVY_BLUE_MAIN,
                                                    },
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily: FONT_FAMILY,
                                                color: NAVY_BLUE_MAIN,
                                                fontWeight: 500,
                                                "&.Mui-focused": {
                                                    color: GOLD_MAIN,
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                fontSize: "0.85rem",
                                                fontFamily: FONT_FAMILY,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="USN"
                                        name="usn"
                                        value={formData.usn}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                fontFamily: FONT_FAMILY,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                "&.Mui-focused": {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px rgba(${hexToRgb(GOLD_MAIN)}, 0.15)`,
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: GOLD_MAIN,
                                                        borderWidth: '2px',
                                                        boxShadow: `0 0 0 3px rgba(${hexToRgb(GOLD_MAIN)}, 0.1)`,
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    transform: 'translateY(-1px)',
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: NAVY_BLUE_MAIN,
                                                    },
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily: FONT_FAMILY,
                                                color: NAVY_BLUE_MAIN,
                                                fontWeight: 500,
                                                "&.Mui-focused": {
                                                    color: GOLD_MAIN,
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                fontSize: "0.85rem",
                                                fontFamily: FONT_FAMILY,
                                            },
                                        }}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.usn)}
                                        helperText={errors.usn}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                fontFamily: FONT_FAMILY,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                "&.Mui-focused": {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px rgba(${hexToRgb(GOLD_MAIN)}, 0.15)`,
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: GOLD_MAIN,
                                                        borderWidth: '2px',
                                                        boxShadow: `0 0 0 3px rgba(${hexToRgb(GOLD_MAIN)}, 0.1)`,
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    transform: 'translateY(-1px)',
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: NAVY_BLUE_MAIN,
                                                    },
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily: FONT_FAMILY,
                                                color: NAVY_BLUE_MAIN,
                                                fontWeight: 500,
                                                "&.Mui-focused": {
                                                    color: GOLD_MAIN,
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                fontSize: "0.85rem",
                                                fontFamily: FONT_FAMILY,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}  // Toggle between text/password
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.password)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                fontFamily: FONT_FAMILY,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                "&.Mui-focused": {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px rgba(${hexToRgb(GOLD_MAIN)}, 0.15)`,
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: GOLD_MAIN,
                                                        borderWidth: '2px',
                                                        boxShadow: `0 0 0 3px rgba(${hexToRgb(GOLD_MAIN)}, 0.1)`,
                                                    },
                                                },
                                                "&:hover": {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    transform: 'translateY(-1px)',
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: NAVY_BLUE_MAIN,
                                                    },
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontFamily: FONT_FAMILY,
                                                color: NAVY_BLUE_MAIN,
                                                fontWeight: 500,
                                                "&.Mui-focused": {
                                                    color: GOLD_MAIN,
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                fontSize: "0.85rem",
                                                fontFamily: FONT_FAMILY,
                                            },
                                        }}
                                        helperText={errors.password}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            ),
                                        }}
                                    />

                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{
                                    textTransform: "none",
                                    py: { xs: 1.2, sm: 1.7 },
                                    mt: 2,
                                    mb: 2,
                                    fontFamily: FONT_FAMILY,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    letterSpacing: '0.5px',
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_DARK} 100%)`,
                                    boxShadow: `0 8px 25px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.5)`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD_MAIN} 100%)`,
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 12px 30px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.6)`,
                                    },
                                    '&:active': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: `0 5px 15px -5px rgba(${hexToRgb(GOLD_MAIN)}, 0.4)`,
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                                        transform: 'translateX(-100%)',
                                        transition: 'all 0.6s ease',
                                    },
                                    '&:hover::before': {
                                        transform: 'translateX(100%)',
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </Box>
                    )}

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            mt: 3, 
                            color: "#fff", 
                            fontFamily: FONT_FAMILY,
                            opacity: 0,
                            animation: `${ANIMATIONS.fadeIn} 0.8s ease-out 0.8s forwards`,
                        }}
                    >
                        Already have an account? <Link 
                            href="/login" 
                            sx={{ 
                                color: GOLD_LIGHT, 
                                textDecoration: "none", 
                                fontWeight: 600,
                                position: 'relative',
                                '&:hover': {
                                    color: GOLD_MAIN,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '0',
                                    height: '2px',
                                    bottom: '-2px',
                                    left: '0',
                                    background: `linear-gradient(90deg, ${GOLD_MAIN}, ${GOLD_DARK})`,
                                    transition: 'width 0.3s ease',
                                },
                                '&:hover::after': {
                                    width: '100%',
                                },
                            }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side (Carousel with Navy Blue Background) */}
            {!isMobile &&
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        background: `linear-gradient(135deg, ${NAVY_BLUE_MAIN} 0%, ${NAVY_BLUE_DARK} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#fff",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: { xs: 0, md: '0 12px 12px 0' },
                        boxShadow: `inset 0 0 100px rgba(${hexToRgb(GOLD_MAIN)}, 0.1)`,
                        opacity: 0,
                        animation: `${ANIMATIONS.fadeIn} 1s ease-out 0.4s forwards`,
                    }}
                >
                    {/* Gold accent line on left edge */}
                    <Box 
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '10%',
                            height: '80%',
                            width: '4px',
                            background: `linear-gradient(to bottom, transparent, ${GOLD_MAIN}, transparent)`,
                            opacity: 0.7,
                        }}
                    />
                    
                    <Box sx={{ 
                        maxWidth: 550, 
                        width: { md: "80%", lg: "200%" },
                        position: 'relative',
                        zIndex: 5,
                    }}>
                        <Slider {...carouselSettings}>
                            <Box>
                                <Box
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                        boxShadow: `0 15px 30px rgba(${hexToRgb(GOLD_MAIN)}, 0.2)`,
                                        border: `2px solid rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 20px 40px rgba(${hexToRgb(GOLD_MAIN)}, 0.4)`,
                                        }
                                    }}
                                >
                                    <GroupIcon sx={{ color: NAVY_BLUE_MAIN, fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ 
                                        fontFamily: FONT_FAMILY,
                                        color: GOLD_MAIN,
                                        textShadow: `0 2px 10px rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                    }}
                                >
                                    Sign up and Complete your profile
                                </Typography>
                                <Typography sx={{ 
                                    fontFamily: FONT_FAMILY,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    lineHeight: 1.6,
                                    fontSize: '1rem',
                                }}>
                                    Once you've created an account, you can provide a little extra
                                    information about yourself. We'll use this information to
                                    recommend mentors to you.
                                </Typography>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                        boxShadow: `0 15px 30px rgba(${hexToRgb(GOLD_MAIN)}, 0.2)`,
                                        border: `2px solid rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 20px 40px rgba(${hexToRgb(GOLD_MAIN)}, 0.4)`,
                                        }
                                    }}
                                >
                                    <AdsClickIcon sx={{ color: NAVY_BLUE_MAIN, fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ 
                                        fontFamily: FONT_FAMILY,
                                        color: GOLD_MAIN,
                                        textShadow: `0 2px 10px rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                    }}
                                >
                                    Browse mentors and choose one
                                </Typography>
                                <Typography sx={{ 
                                    fontFamily: FONT_FAMILY,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    lineHeight: 1.6,
                                    fontSize: '1rem',
                                }}>
                                    Once you've browsed mentors & found someone that you'd like to
                                    work with, you can send them an introduction to get started.
                                </Typography>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                        boxShadow: `0 15px 30px rgba(${hexToRgb(GOLD_MAIN)}, 0.2)`,
                                        border: `2px solid rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 20px 40px rgba(${hexToRgb(GOLD_MAIN)}, 0.4)`,
                                        }
                                    }}
                                >
                                    <Diversity1Icon sx={{ color: NAVY_BLUE_MAIN, fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ 
                                        fontFamily: FONT_FAMILY,
                                        color: GOLD_MAIN,
                                        textShadow: `0 2px 10px rgba(${hexToRgb(GOLD_MAIN)}, 0.3)`,
                                    }}
                                >
                                    Collaborate with your mentor
                                </Typography>
                                <Typography sx={{ 
                                    fontFamily: FONT_FAMILY,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    lineHeight: 1.6,
                                    fontSize: '1rem',
                                }}>
                                    Use our tools like real-time messaging, phone calls & video chat
                                    to tackle any challenges that you're currently facing.
                                </Typography>
                            </Box>
                        </Slider>
                    </Box>
                </Grid>
            }
            <ToastContainer />
        </Grid>
        </Box>
    );
}