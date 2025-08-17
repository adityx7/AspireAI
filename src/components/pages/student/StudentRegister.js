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

    return (
        <Box sx={{ minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", background: "linear-gradient(120deg, #ff8c00 0%, #1a237e 100%)", position: "relative", overflow: "hidden" }}>
            <Box
                component="div"
                sx={{
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    pointerEvents: "none",
                    background: "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    animation: "shimmer 2.5s infinite linear",
                }}
            />
            <Grid container sx={{ minHeight: "100vh", position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Grid item xs={12} md={7} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", maxWidth: 500, background: "linear-gradient(90deg, #fbd288 60%, #6a85b6 100%)", borderRadius: 8, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)", p: { xs: 3, md: 5 }, textAlign: "center" }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: "#1a237e", mb: 2, fontFamily: "inherit", textShadow: "0 2px 8px rgba(26,35,126,0.2)" }}>
                            Find a Mentor
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, color: "#1a237e", opacity: 0.95, mb: 3, fontFamily: "inherit" }}>
                            Create your account and connect with the perfect mentor for your journey!
                        </Typography>
                        {!showForm && (
                            <Button
                                variant="contained"
                                    sx={{
                                        background: "linear-gradient(90deg, #6a85b6 60%, #fbd288 100%)",
                                        color: "#1a237e",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 8,
                                        boxShadow: "0 4px 16px rgba(26,35,126,0.15), 0 0 16px 2px #fbd28888",
                                        textTransform: "none",
                                        mb: 2,
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #fbd288 60%, #6a85b6 100%)",
                                            boxShadow: "0 4px 24px rgba(26,35,126,0.25), 0 0 32px 4px #6a85b6bb",
                                        },
                                    }}
                                    onClick={() => setShowForm(true)}
                                    fullWidth
                                >
                                    Sign in with Email
                                </Button>
                            )}
                            {showForm && (
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
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
                                        <Grid item xs={12} sm={6}>
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
                                        <Grid item xs={12} sm={6}>
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
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
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
                                        sx={{
                                            background: "linear-gradient(90deg, #6a85b6 60%, #fbd288 100%)",
                                            color: "#1a237e",
                                            fontWeight: 700,
                                            fontSize: "1.1rem",
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 8,
                                            boxShadow: "0 4px 16px rgba(26,35,126,0.15), 0 0 16px 2px #fbd28888",
                                            textTransform: "none",
                                            mb: 2,
                                            "&:hover": {
                                                background: "linear-gradient(90deg, #fbd288 60%, #6a85b6 100%)",
                                                boxShadow: "0 4px 24px rgba(26,35,126,0.25), 0 0 32px 4px #6a85b6bb",
                                            },
                                        }}
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                </Box>
                            )}
                            <Typography variant="body2" sx={{ mt: 3, color: "#1a237e", fontFamily: "inherit" }}>
                                Already have an account?{" "}
                                <Link href="/login" sx={{ color: "#ff8c00", textDecoration: "underline", fontWeight: 600, "&:hover": { color: "#fff176" } }}>
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                    {/* Right Section: Info Box */}
                    {!isMobile && (
                        <Grid item xs={12} md={5} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box sx={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 8, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)", p: { xs: 3, md: 5 }, ml: { md: 4 }, textAlign: "center" }}>
                                <Typography variant="h5" fontWeight="bold" mb={2} color="#1a237e" fontSize={'2rem'} sx={{ fontFamily: "inherit" }}>
                                    How it works
                                </Typography>
                                <Typography variant="body1" color="#1a237e" mb={2} sx={{ fontFamily: "inherit" }}>
                                    1. Sign up and complete your profile.<br />
                                    2. Browse mentors and choose one.<br />
                                    3. Collaborate with your mentor using our platform's tools.<br />
                                    <br />
                                    Get started and unlock your potential today!
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
                <ToastContainer />
            </Box>
    );
}