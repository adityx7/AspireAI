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
        <Box sx={{ 
            minHeight: "100vh", 
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
            background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)", 
            position: "relative", 
            overflow: "hidden" 
        }}>
            {/* Shimmer Overlay */}
            <Box
                component="div"
                sx={{
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    pointerEvents: "none",
                    background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    animation: "shimmer 2.5s infinite linear",
                }}
            />
            
            <Grid container sx={{ 
                minHeight: "100vh", 
                position: "relative", 
                zIndex: 1, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
            }}>
                {/* Left Section: Registration Form */}
                <Grid item xs={12} md={7} sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                }}>
                    <Box sx={{ 
                        width: "100%", 
                        maxWidth: 500, 
                        background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)", 
                        borderRadius: 8, 
                        boxShadow: "0 8px 32px rgba(255,215,0,0.2)", 
                        border: "1px solid rgba(255,215,0,0.3)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        p: { xs: 3, md: 5 }, 
                        textAlign: "center" 
                    }}>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 800, 
                            color: "#ffd700", 
                            mb: 2, 
                            fontFamily: "inherit", 
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            letterSpacing: "0.5px"
                        }}>
                            Mentor Registration
                        </Typography>
                        
                        <Typography variant="body1" sx={{ 
                            fontSize: { xs: "1.1rem", md: "1.3rem" }, 
                            color: "#e2e8f0", 
                            opacity: 0.95, 
                            mb: 3, 
                            fontFamily: "inherit",
                            lineHeight: 1.6
                        }}>
                            Join AspireAI as a mentor and empower students to achieve their dreams!
                        </Typography>
                        
                        {!showForm && (
                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                                    color: "#1e3a8a",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 8,
                                    boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                    textTransform: "none",
                                    mb: 2,
                                    fontFamily: "inherit",
                                    "&:hover": {
                                        background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                        boxShadow: "0 6px 24px rgba(255,215,0,0.4)",
                                        transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.3s ease",
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: "rgba(15,23,42,0.5)",
                                                    '& fieldset': {
                                                        borderColor: "rgba(255,215,0,0.3)",
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: "rgba(255,215,0,0.5)",
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: "#ffd700",
                                                    },
                                                    '& input': {
                                                        color: "#e2e8f0",
                                                        fontFamily: "inherit",
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: "rgba(255,215,0,0.8)",
                                                    fontFamily: "inherit",
                                                    '&.Mui-focused': {
                                                        color: "#ffd700",
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    color: "#ff6b6b",
                                                    fontFamily: "inherit",
                                                },
                                            }}
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: "rgba(15,23,42,0.5)",
                                                    '& fieldset': {
                                                        borderColor: "rgba(255,215,0,0.3)",
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: "rgba(255,215,0,0.5)",
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: "#ffd700",
                                                    },
                                                    '& input': {
                                                        color: "#e2e8f0",
                                                        fontFamily: "inherit",
                                                    },
                                                    '& input::placeholder': {
                                                        color: "#cbd5e1",
                                                        opacity: 0.7,
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: "rgba(255,215,0,0.8)",
                                                    fontFamily: "inherit",
                                                    '&.Mui-focused': {
                                                        color: "#ffd700",
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    color: "#ff6b6b",
                                                    fontFamily: "inherit",
                                                },
                                            }}
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: "rgba(15,23,42,0.5)",
                                                    '& fieldset': {
                                                        borderColor: "rgba(255,215,0,0.3)",
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: "rgba(255,215,0,0.5)",
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: "#ffd700",
                                                    },
                                                    '& input': {
                                                        color: "#e2e8f0",
                                                        fontFamily: "inherit",
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: "rgba(255,215,0,0.8)",
                                                    fontFamily: "inherit",
                                                    '&.Mui-focused': {
                                                        color: "#ffd700",
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    color: "#ff6b6b",
                                                    fontFamily: "inherit",
                                                },
                                            }}
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: "rgba(15,23,42,0.5)",
                                                    '& fieldset': {
                                                        borderColor: "rgba(255,215,0,0.3)",
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: "rgba(255,215,0,0.5)",
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: "#ffd700",
                                                    },
                                                    '& input': {
                                                        color: "#e2e8f0",
                                                        fontFamily: "inherit",
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: "rgba(255,215,0,0.8)",
                                                    fontFamily: "inherit",
                                                    '&.Mui-focused': {
                                                        color: "#ffd700",
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    color: "#ff6b6b",
                                                    fontFamily: "inherit",
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                                        color: "#1e3a8a",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 8,
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                        textTransform: "none",
                                        mb: 2,
                                        fontFamily: "inherit",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                            boxShadow: "0 6px 24px rgba(255,215,0,0.4)",
                                            transform: "translateY(-2px)",
                                        },
                                        transition: "all 0.3s ease",
                                    }}
                                    type="submit"
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                        
                        <Typography variant="body2" sx={{ 
                            mt: 3, 
                            color: "#e2e8f0", 
                            fontFamily: "inherit" 
                        }}>
                            Already have an account?{" "}
                            <Link 
                                href="/mentor-login" 
                                sx={{ 
                                    color: "#ffd700", 
                                    textDecoration: "underline", 
                                    fontWeight: 600, 
                                    "&:hover": { 
                                        color: "#ffed4e",
                                        textShadow: "0 0 8px rgba(255,215,0,0.5)"
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Grid>
                
                {/* Right Section: Info Box */}
                {!isMobile && (
                    <Grid item xs={12} md={5} sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                    }}>
                        <Box sx={{ 
                            width: "100%", 
                            maxWidth: 400, 
                            background: "#fff", 
                            borderRadius: 8, 
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)", 
                            p: { xs: 3, md: 5 }, 
                            ml: { md: 4 }, 
                            textAlign: "center" 
                        }}>
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
