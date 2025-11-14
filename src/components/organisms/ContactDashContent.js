import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSendQuery = () => {
    console.log("Query Sent");
  };

  return (
    <Box
      className="fade-in-up"
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
          background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(184, 134, 11, 0.15)",
          borderRadius: "24px",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)'
          }
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack icon and text vertically on small screens
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "30px",
          }}
        >
          {/* Icon inside circular box */}
          <Box
            sx={{
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
              borderRadius: "50%",
              mr: isMobile ? '0' : '24px',
              mb: isMobile ? '16px' : '0',
              boxShadow: "0 12px 40px rgba(184, 134, 11, 0.3)"
            }}
          >
            <EmailIcon sx={{ color: "#ffffff", fontSize: "40px" }} />
          </Box>

          {/* Text Section */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: "700",
                color: "#ffffff",
                mb: 1
              }}
            >
              Contact Support
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginTop: "8px",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B",
                fontWeight: "500",
                lineHeight: 1.6
              }}
            >
              Use the form below to contact the Career Compass team with any
              questions, comments, or concerns.
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ 
          margin: "30px 0",
          borderColor: "rgba(184, 134, 11, 0.3)",
          '&::before, &::after': {
            borderColor: 'rgba(184, 134, 11, 0.3)'
          }
        }} />

        {/* Form Fields */}
        <TextField
          placeholder="Name"
          variant="outlined"
          fullWidth
          sx={{ 
            marginBottom: "24px",
            '& .MuiOutlinedInput-root': {
              background: "rgba(248, 250, 252, 0.9)",
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                background: "rgba(248, 250, 252, 0.95)",
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
              },
              '&.Mui-focused': {
                background: "rgba(248, 250, 252, 1)",
                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
              },
              '& fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#B8860B',
                borderWidth: '2px'
              },
              '& input': {
                color: 'rgba(0, 0, 0, 0.87)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                }
              }
            }
          }}
        />
        <TextField
          placeholder="Email"
          variant="outlined"
          fullWidth
          sx={{ 
            marginBottom: "24px",
            '& .MuiOutlinedInput-root': {
              background: "rgba(248, 250, 252, 0.9)",
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                background: "rgba(248, 250, 252, 0.95)",
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
              },
              '&.Mui-focused': {
                background: "rgba(248, 250, 252, 1)",
                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
              },
              '& fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#B8860B',
                borderWidth: '2px'
              },
              '& input': {
                color: 'rgba(0, 0, 0, 0.87)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                }
              }
            }
          }}
        />
        <TextField
          placeholder="Subject"
          variant="outlined"
          fullWidth
          sx={{ 
            marginBottom: "24px",
            '& .MuiOutlinedInput-root': {
              background: "rgba(248, 250, 252, 0.9)",
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                background: "rgba(248, 250, 252, 0.95)",
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
              },
              '&.Mui-focused': {
                background: "rgba(248, 250, 252, 1)",
                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
              },
              '& fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#B8860B',
                borderWidth: '2px'
              },
              '& input': {
                color: 'rgba(0, 0, 0, 0.87)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                }
              }
            }
          }}
        />
        <TextField
          placeholder="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          sx={{ 
            marginBottom: "30px",
            '& .MuiOutlinedInput-root': {
              background: "rgba(248, 250, 252, 0.9)",
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                background: "rgba(248, 250, 252, 0.95)",
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
              },
              '&.Mui-focused': {
                background: "rgba(248, 250, 252, 1)",
                boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
              },
              '& fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(184, 134, 11, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#B8860B',
                borderWidth: '2px'
              },
              '& textarea': {
                color: 'rgba(0, 0, 0, 0.87)',
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                '&::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                }
              }
            }
          }}
        />

        {/* Divider */}
        <Divider sx={{ 
          mb: 4,
          borderColor: "rgba(184, 134, 11, 0.3)",
          '&::before, &::after': {
            borderColor: 'rgba(184, 134, 11, 0.3)'
          }
        }} />

        {/* Button */}
        <Button
          variant="contained"
          onClick={handleSendQuery}
          sx={{
            width: isMobile ? "100%" : "auto",
            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
            color: "#ffffff",
            fontWeight: "700",
            padding: "16px 40px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            fontSize: "16px",
            textTransform: "none",
            border: "2px solid transparent",
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.6s ease'
            },
            "&:hover": {
              background: "linear-gradient(135deg, #8B6914 0%, #B8860B 100%)",
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
              border: "2px solid rgba(184, 134, 11, 0.3)",
              '&::before': {
                left: '100%'
              }
            },
            "&:active": {
              transform: "translateY(0px) scale(1)",
            },
            '&:hover': {
              background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
              transform: "translateY(-2px)"
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          Send Query
        </Button>
      </Box>
    </Box>
  );
};

export default ContactPage;
