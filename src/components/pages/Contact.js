import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [showAlert, setShowAlert] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
        setShowAlert(true);
        // Reset form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
        // Hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 5000);
    };

    return (
        <Box sx={shimmerBackground}>
            <Box sx={{ ...shimmerOverlay }} />
            
            {/* Alert */}
            {showAlert && (
                <Alert
                    severity="success"
                    sx={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                        backgroundColor: "rgba(255,215,0,0.1)",
                        color: "#ffd700",
                        border: "1px solid rgba(255,215,0,0.3)",
                        "& .MuiAlert-icon": {
                            color: "#ffd700",
                        },
                    }}
                >
                    Message sent successfully! We'll get back to you soon.
                </Alert>
            )}

            <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            color: "#ffd700",
                            mb: 3,
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#e2e8f0",
                            opacity: 0.9,
                            fontSize: { xs: "1.1rem", md: "1.3rem" },
                            maxWidth: "600px",
                            mx: "auto",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        }}
                    >
                        Have questions or need guidance? Our team is here to support you—contact us anytime!
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                                borderRadius: 4,
                                boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
                                border: "1px solid rgba(255,215,0,0.3)",
                                overflow: "hidden",
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: "#ffd700",
                                        mb: 3,
                                        fontWeight: 700,
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    }}
                                >
                                    Send us a Message
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#e2e8f0",
                                                        backgroundColor: "rgba(15,23,42,0.5)",
                                                        "& fieldset": {
                                                            borderColor: "rgba(255,215,0,0.3)",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "rgba(255,215,0,0.5)",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#ffd700",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#cbd5e1",
                                                        "&.Mui-focused": {
                                                            color: "#ffd700",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#e2e8f0",
                                                        backgroundColor: "rgba(15,23,42,0.5)",
                                                        "& fieldset": {
                                                            borderColor: "rgba(255,215,0,0.3)",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "rgba(255,215,0,0.5)",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#ffd700",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#cbd5e1",
                                                        "&.Mui-focused": {
                                                            color: "#ffd700",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#e2e8f0",
                                                        backgroundColor: "rgba(15,23,42,0.5)",
                                                        "& fieldset": {
                                                            borderColor: "rgba(255,215,0,0.3)",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "rgba(255,215,0,0.5)",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#ffd700",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#cbd5e1",
                                                        "&.Mui-focused": {
                                                            color: "#ffd700",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#e2e8f0",
                                                        backgroundColor: "rgba(15,23,42,0.5)",
                                                        "& fieldset": {
                                                            borderColor: "rgba(255,215,0,0.3)",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "rgba(255,215,0,0.5)",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#ffd700",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#cbd5e1",
                                                        "&.Mui-focused": {
                                                            color: "#ffd700",
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                                                    color: "#1e3a8a",
                                                    fontWeight: 700,
                                                    fontSize: "1.1rem",
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: 3,
                                                    boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                                        boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                                                    },
                                                }}
                                            >
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ height: "100%" }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#ffd700",
                                    mb: 4,
                                    fontWeight: 700,
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                }}
                            >
                                Get in Touch
                            </Typography>

                            {/* Contact Cards */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <Card
                                    sx={{
                                        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                                        borderRadius: 3,
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
                                        border: "1px solid rgba(255,215,0,0.3)",
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <EmailIcon sx={{ color: "#ffd700", mr: 2, fontSize: 28 }} />
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: "#ffd700",
                                                    fontWeight: 600,
                                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                                }}
                                            >
                                                Email
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#e2e8f0",
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            }}
                                        >
                                            support@aspireai.com
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#cbd5e1",
                                                mt: 1,
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            }}
                                        >
                                            We typically respond within 24 hours
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                                        borderRadius: 3,
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
                                        border: "1px solid rgba(255,215,0,0.3)",
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <PhoneIcon sx={{ color: "#ffd700", mr: 2, fontSize: 28 }} />
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: "#ffd700",
                                                    fontWeight: 600,
                                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                                }}
                                            >
                                                Phone
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#e2e8f0",
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            }}
                                        >
                                            +1 (555) 123-4567
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#cbd5e1",
                                                mt: 1,
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            }}
                                        >
                                            Mon-Fri, 9:00 AM - 6:00 PM EST
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                                        borderRadius: 3,
                                        boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
                                        border: "1px solid rgba(255,215,0,0.3)",
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <LocationOnIcon sx={{ color: "#ffd700", mr: 2, fontSize: 28 }} />
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: "#ffd700",
                                                    fontWeight: 600,
                                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                                }}
                                            >
                                                Office
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#e2e8f0",
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                            }}
                                        >
                                            123 Innovation Drive<br />
                                            Suite 100<br />
                                            Tech City, TC 12345
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* Additional Info */}
                            <Box
                                sx={{
                                    mt: 4,
                                    p: 3,
                                    background: "rgba(30,58,138,0.3)",
                                    borderRadius: 3,
                                    border: "1px solid rgba(255,215,0,0.2)",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#ffd700",
                                        mb: 2,
                                        fontWeight: 600,
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    }}
                                >
                                    Why Contact Us?
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#e2e8f0",
                                        lineHeight: 1.6,
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    }}
                                >
                                    Whether you need help finding the right mentor, have technical questions, or want to provide feedback, our dedicated support team is here to assist you on your mentorship journey.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
