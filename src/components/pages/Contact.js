import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import BgContact from "../../assets/BgContact.png";

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

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        content: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        content: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = {};
        
        // Validate form fields
        if (!formData.name) validationErrors.name = "Name is required";
        if (!formData.email) validationErrors.email = "Email is required";
        if (!formData.subject) validationErrors.subject = "Subject is required";
        if (!formData.content) validationErrors.content = "Message is required";
        
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            // Handle form submission here
            console.log("Form submitted:", formData);
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
                                Contact Us
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            variant="outlined"
                                            sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            variant="outlined"
                                            sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            error={!!errors.subject}
                                            helperText={errors.subject}
                                            variant="outlined"
                                            sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Message"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            error={!!errors.content}
                                            helperText={errors.content}
                                            multiline
                                            minRows={4}
                                            variant="outlined"
                                            sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
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
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Box>
                </Box>
            );
}
