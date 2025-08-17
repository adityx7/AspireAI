import React, { useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Link,
    useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9._%+-]+@bnmit\.in$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_()#])[A-Za-z\d@$!%*?&]{8,}$/;
const mentorIDRegex = /^BNM\d{4}$/;

export default function MentorRegister() {
    const [showForm, setShowForm] = useState(false);
    const isMobile = useMediaQuery("(max-width:800px)");
    const navigate = useNavigate(); // Added for navigation

    const [formData, setFormData] = useState({
        fullName: "",
        mentorID: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        mentorID: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked");
        let validationErrors = {};

        // Validation
        if (!formData.fullName) validationErrors.fullName = "Full Name is required";
        if (!formData.email) validationErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) {
            validationErrors.email = "Please enter a valid email (e.g., ----@bnmit.in)";
        }

        if (!formData.mentorID) {
            validationErrors.mentorID = "Mentor ID is required";
        } else if (!mentorIDRegex.test(formData.mentorID)) {
            validationErrors.mentorID = "Please enter a valid Mentor ID (e.g., BNM0001)";
        }

        if (!formData.password) {
            validationErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            validationErrors.password =
                "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
        }

        if (Object.keys(validationErrors).length > 0) {
            console.log("Validation failed", validationErrors);
            setErrors(validationErrors);
            toast.error("Please fix the errors in the form.", {
                autoClose: 3000,
                position: "top-right",
            });
            return;
        }

        setErrors({});
        try {
            // Sending form data to the backend
            const response = await fetch("http://localhost:5002/api/mentor/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Registration successful!");
                console.log("Form submitted", formData);
                setFormData({ fullName: "", mentorID: "", email: "", password: "" });
                setTimeout(() => {
                    navigate("/dashboard-mentor"); // Redirect to dashboard
                }, 1000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "An error occurred.");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the form.");
            console.error("Error submitting form:", error);
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
                            Mentor Registration
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" }, color: "#1a237e", opacity: 0.95, mb: 3, fontFamily: "inherit" }}>
                            Join AspireAI as a mentor and empower students to achieve their dreams!
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
                                            label="Mentor ID"
                                            name="mentorID"
                                            placeholder="BNM0001"
                                            value={formData.mentorID}
                                            onChange={handleInputChange}
                                            error={Boolean(errors.mentorID)}
                                            helperText={errors.mentorID}
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
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            error={Boolean(errors.password)}
                                            helperText={errors.password}
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
                            <Link href="/mentor-login" sx={{ color: "#ff8c00", textDecoration: "underline", fontWeight: 600, "&:hover": { color: "#fff176" } }}>
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
                                Welcome to AspireAI!
                            </Typography>
                            <Typography variant="body1" color="#1a237e" mb={2} sx={{ fontFamily: "inherit" }}>
                                Thank you for your interest in volunteering as an AspireAI mentor to help students achieve their college and career dreams. The AspireAI mentoring model is completely virtual: you will conduct all communication through our online platform, without ever having to share your personal contact info with your mentee. The platform also contains all the tools and resources you need to be successful as a mentor, including mentor training found in the "help" tab upon registering.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
