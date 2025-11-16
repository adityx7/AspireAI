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
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "25px",
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
            }}
          >
            <EmailIcon sx={{ color: NAVY_BLUE_MAIN, fontSize: "35px" }} />
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
              }}
            >
              Use the form below to contact the Career Compass team with any
              questions, comments, or concerns.
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ margin: "20px 0", borderColor: `${GOLD_MAIN}40` }} />

        {/* Form Fields */}
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          sx={{
            marginBottom: "20px",
            '& .MuiInputBase-root': {
              color: 'white',
              background: `rgba(10, 25, 47, 0.5)`,
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: GOLD_LIGHT,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: GOLD_MAIN,
              },
              '&.Mui-focused fieldset': {
                borderColor: GOLD_LIGHT,
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
            '& .MuiInputBase-root': {
              color: 'white',
              background: `rgba(10, 25, 47, 0.5)`,
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: GOLD_LIGHT,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: GOLD_MAIN,
              },
              '&.Mui-focused fieldset': {
                borderColor: GOLD_LIGHT,
              },
            }
          }}
        />

        {/* Divider */}
        <Divider sx={{ mb: 3, borderColor: `${GOLD_MAIN}40` }} />

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
            '&:hover': {
              background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
              boxShadow: `0 6px 20px ${GOLD_MAIN}80`,
              transform: 'translateY(-2px)',
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
