import React, { useState } from "react";
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
} from "@mui/material";
import Slider from "react-slick";
import GroupIcon from '@mui/icons-material/Group';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { toast, ToastContainer } from 'react-toastify';
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Shimmer styles for background and overlay
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

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ ...shimmerOverlay }} />
            <Grid container sx={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
            {/* Left Side (White Background) */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: 4,
                }}
            >
                <Box sx={{
                    maxWidth: 420,
                    width: "100%",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: 6,
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 24px 4px #ff8c0088",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#222",
                    position: "relative",
                    overflow: "hidden",
                    p: { xs: 3, md: 5 },
                }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={2}
                        sx={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#fff", textShadow: "0 2px 8px rgba(26,35,126,0.2)" }}
                    >
                        Get started today, it's 100% free.
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        mb={4}
                        sx={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#fff", opacity: 0.85 }}
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
                                background: "linear-gradient(90deg, #ff8c00 60%, #1a237e 100%)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                boxShadow: "0 4px 16px rgba(26,35,126,0.15), 0 0 16px 2px #ff8c0088",
                                textTransform: "none",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #1a237e 60%, #ff8c00 100%)",
                                    boxShadow: "0 4px 24px rgba(26,35,126,0.25), 0 0 32px 4px #ff8c00bb",
                                },
                            }}
                        >
                            Sign in with Email
                        </Button>
                    )}

                    {showForm && (
                        <Box component="form" onSubmit={handleSubmit}>
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
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="USN"
                                        name="usn"
                                        value={formData.usn}
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
                                Register
                            </Button>
                        </Box>
                    )}

                    <Typography variant="body2" sx={{ mt: 3, color: "#fff", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
                        Already have an account? <Link href="/login" sx={{ color: "#ffd600", textDecoration: "underline", fontWeight: 600 }}>
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side (Carousel on Black Background) */}
            {!isMobile &&
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        backgroundColor: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#fff",
                    }}
                >
                    <Box sx={{ maxWidth: 550, width: { md: "80%", lg: "200%" } }}>

                        <Slider {...carouselSettings}>
                            <Box>
                                <Box
                                    sx={{
                                        height: 70,
                                        width: 70,
                                        backgroundColor: "#fff",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                    }}
                                >
                                    <GroupIcon sx={{ color: "#000", fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ fontFamily: "courier" }}
                                >
                                    Sign up and Complete your profile
                                </Typography>
                                <Typography sx={{ fontFamily: "courier" }}>
                                    Once you've created an account, you can provide a little extra
                                    information about yourself. We'll use this information to
                                    recommend mentors to you.
                                </Typography>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        height: 70,
                                        width: 70,
                                        backgroundColor: "#fff",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                    }}
                                >
                                    <AdsClickIcon sx={{ color: "#000", fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ fontFamily: "courier" }}
                                >
                                    Browse mentors and choose one
                                </Typography>
                                <Typography sx={{ fontFamily: "courier" }}>
                                    Once you've browsed mentors & found someone that you'd like to
                                    work with, you can send them an introduction to get started.
                                </Typography>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        height: 70,
                                        width: 70,
                                        backgroundColor: "#fff",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px auto",
                                    }}
                                >
                                    <Diversity1Icon sx={{ color: "#000", fontSize: 50 }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                    sx={{ fontFamily: "courier" }}
                                >
                                    Collaborate with your mentor
                                </Typography>
                                <Typography sx={{ fontFamily: "courier" }}>
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