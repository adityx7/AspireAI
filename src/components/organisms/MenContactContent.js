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

// Gold and Indigo Theme Colors
const NAVY_BLUE_MAIN = "#0A192F";
const NAVY_BLUE_LIGHT = "#112240";
const GOLD_MAIN = "#B8860B";
const GOLD_LIGHT = "#DAA520";

// Keyframe animations
const fadeInUp = {
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

const scaleIn = {
  '@keyframes scaleIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
};

const shimmer = {
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-1000px 0',
    },
    '100%': {
      backgroundPosition: '1000px 0',
    },
  },
};

const MentorContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSendQuery = () => {
    console.log("Query Sent");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        ...fadeInUp,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          borderRadius: isMobile ? "0" : "12px",
          background: `rgba(17, 34, 64, 0.8)`,
          backdropFilter: 'blur(10px)',
          boxShadow: isMobile ? "none" : `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${GOLD_MAIN}40`,
          border: `1px solid ${GOLD_MAIN}30`,
          overflow: "hidden",
          animation: 'fadeInUp 0.6s ease-out',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px ${GOLD_MAIN}60`,
            transform: 'translateY(-5px)',
          },
          ...scaleIn,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "25px",
            animation: 'fadeInUp 0.8s ease-out 0.2s both',
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
              background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
              borderRadius: "50%",
              mr: isMobile ? 0 : '20px',
              mb: isMobile ? '15px' : 0,
              boxShadow: `0 4px 15px ${GOLD_MAIN}60`,
              animation: 'scaleIn 0.6s ease-out 0.3s both',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: `0 6px 20px ${GOLD_MAIN}80`,
              },
            }}
          >
            <EmailIcon 
              sx={{ 
                color: NAVY_BLUE_MAIN, 
                fontSize: "35px",
                transition: 'transform 0.3s ease',
              }} 
            />
          </Box>

          {/* Text Section */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                color: GOLD_LIGHT,
                fontWeight: "bold",
                textShadow: `0 0 10px ${GOLD_MAIN}40`,
                animation: 'fadeInUp 0.8s ease-out 0.4s both',
              }}
            >
              Contact Support
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginTop: "8px",
                fontSize: isMobile ? "0.9rem" : "1rem",
                color: "rgba(255, 255, 255, 0.8)",
                animation: 'fadeInUp 0.8s ease-out 0.5s both',
              }}
            >
              Use the form below to contact the AspireAI team with any
              questions, comments, or concerns.
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider 
          sx={{ 
            margin: "20px 0", 
            borderColor: `${GOLD_MAIN}40`,
            animation: 'fadeInUp 0.8s ease-out 0.6s both',
          }} 
        />

        {/* Form Fields */}
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          sx={{
            marginBottom: "20px",
            animation: 'fadeInUp 0.8s ease-out 0.7s both',
            '& .MuiInputBase-root': {
              color: 'white',
              background: `rgba(10, 25, 47, 0.5)`,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: GOLD_LIGHT,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              },
              '&:hover fieldset': {
                borderColor: GOLD_MAIN,
                boxShadow: `0 0 10px ${GOLD_MAIN}30`,
              },
              '&.Mui-focused fieldset': {
                borderColor: GOLD_LIGHT,
                boxShadow: `0 0 15px ${GOLD_LIGHT}40`,
              },
            }
          }}
        />
        <TextField
          label="Message..."
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          sx={{
            marginBottom: "20px",
            animation: 'fadeInUp 0.8s ease-out 0.8s both',
            '& .MuiInputBase-root': {
              color: 'white',
              background: `rgba(10, 25, 47, 0.5)`,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: GOLD_LIGHT,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              },
              '&:hover fieldset': {
                borderColor: GOLD_MAIN,
                boxShadow: `0 0 10px ${GOLD_MAIN}30`,
              },
              '&.Mui-focused fieldset': {
                borderColor: GOLD_LIGHT,
                boxShadow: `0 0 15px ${GOLD_LIGHT}40`,
              },
            }
          }}
        />

        {/* Divider */}
        <Divider 
          sx={{ 
            mb: 3, 
            borderColor: `${GOLD_MAIN}40`,
            animation: 'fadeInUp 0.8s ease-out 0.9s both',
          }} 
        />

        {/* Button */}
        <Button
          variant="contained"
          onClick={handleSendQuery}
          sx={{
            width: isMobile ? "100%" : "auto",
            background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
            color: NAVY_BLUE_MAIN,
            fontWeight: "bold",
            padding: "12px 30px",
            borderRadius: "8px",
            boxShadow: `0 4px 15px ${GOLD_MAIN}60`,
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.8s ease-out 1s both',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transition: 'left 0.5s ease',
            },
            '&:hover': {
              background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
              boxShadow: `0 6px 20px ${GOLD_MAIN}80`,
              transform: 'translateY(-2px) scale(1.05)',
            },
            '&:hover:before': {
              left: '100%',
            },
            '&:active': {
              transform: 'translateY(0) scale(0.98)',
            }
          }}
        >
          Send Query
        </Button>
      </Box>
    </Box>
  );
};

export default MentorContactPage;
