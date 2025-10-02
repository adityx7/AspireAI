import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import BgContact from "../../assets/BgContact.png";

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC",
    // Enhanced animation styles
    '& .fade-in-up': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(60px)'
      }
    },
    '& .scale-in': {
      opacity: 1,
      transform: 'scale(1) rotateZ(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0.3,
        transform: 'scale(0.7) rotateZ(-5deg)'
      }
    },
    '& .floating-element': {
      animation: 'floating 6s ease-in-out infinite',
      transition: 'transform 0.3s ease-out'
    },
    '@keyframes floating': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '25%': { transform: 'translateY(-10px) rotate(1deg)' },
      '50%': { transform: 'translateY(-20px) rotate(0deg)' },
      '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' }
    }
};

const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(184, 134, 11, 0.1) 0%, rgba(26, 43, 76, 0.2) 100%)",
    animation: "shimmer 3s infinite linear",
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
            {/* Animated Background Elements */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '120%',
                background: 'radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 43, 76, 0.2) 0%, transparent 50%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            
            {/* Floating Decorative Elements */}
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '10%',
                left: '5%',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)'
            }} />
            
            <Box className="floating-element" sx={{
                position: 'fixed',
                top: '60%',
                right: '8%',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
                borderRadius: '50%',
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(1px)',
                animationDelay: '2s'
            }} />

            <Box sx={{ ...shimmerOverlay }} />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 2
                }}
            >
                <Box
                    className="scale-in"
                    sx={{
                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                        backdropFilter: "blur(25px)",
                        borderRadius: 20,
                        p: { xs: 4, md: 8 },
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                        border: "1px solid rgba(184, 134, 11, 0.15)",
                        color: "#F8FAFC",
                        width: { xs: "90%", sm: "600px" },
                        maxWidth: "800px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.6s ease",
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
                            transition: 'left 1.2s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-2px) scale(1.01)',
                            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
                            '&::before': {
                                left: '100%'
                            }
                        }
                    }}
                >
                    <Typography 
                        className="fade-in-up"
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700, 
                            mb: 3, 
                            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                            filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                            fontSize: { xs: "1.8rem", md: "2.2rem" }
                        }}
                    >
                        Contact Us
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    className="fade-in-up"
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(248, 250, 252, 0.9)",
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: "rgba(248, 250, 252, 0.95)",
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                                            },
                                            '&.Mui-focused': {
                                                background: "rgba(248, 250, 252, 1)",
                                                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            '&.Mui-focused': {
                                                color: '#B8860B'
                                            }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#B8860B',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="fade-in-up"
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(248, 250, 252, 0.9)",
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: "rgba(248, 250, 252, 0.95)",
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                                            },
                                            '&.Mui-focused': {
                                                background: "rgba(248, 250, 252, 1)",
                                                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            '&.Mui-focused': {
                                                color: '#B8860B'
                                            }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#B8860B',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="fade-in-up"
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    error={!!errors.subject}
                                    helperText={errors.subject}
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(248, 250, 252, 0.9)",
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: "rgba(248, 250, 252, 0.95)",
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                                            },
                                            '&.Mui-focused': {
                                                background: "rgba(248, 250, 252, 1)",
                                                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            '&.Mui-focused': {
                                                color: '#B8860B'
                                            }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#B8860B',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="fade-in-up"
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
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(248, 250, 252, 0.9)",
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: "rgba(248, 250, 252, 0.95)",
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                                            },
                                            '&.Mui-focused': {
                                                background: "rgba(248, 250, 252, 1)",
                                                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            '&.Mui-focused': {
                                                color: '#B8860B'
                                            }
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#B8860B',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    className="fade-in-up"
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.95) 100%)",
                                        color: "#F8FAFC",
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                        px: 4,
                                        py: 1.8,
                                        borderRadius: 12,
                                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                                        textTransform: "none",
                                        border: "1px solid rgba(184, 134, 11, 0.2)",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent)',
                                            transition: 'left 0.6s'
                                        },
                                        mb: 2,
                                        "&:hover": {
                                            background: "linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(26, 43, 76, 0.9) 100%)",
                                            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(184, 134, 11, 0.2)",
                                            transform: "translateY(-2px) scale(1.02)",
                                            border: "1px solid rgba(184, 134, 11, 0.4)",
                                            '&::before': {
                                                left: '100%'
                                            }
                                        },
                                        "&:active": {
                                            transform: "translateY(0px)"
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
