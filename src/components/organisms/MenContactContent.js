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
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          color: "white",
          overflow: "hidden",
          "& .MuiTextField-root": {
            "& .MuiOutlinedInput-root": {
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ff8c00",
              },
              "& input, & textarea": {
                color: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.8)",
              "&.Mui-focused": {
                color: "#ff8c00",
              },
            },
          },
          "& .MuiTypography-root": {
            color: "white",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          },
          "& .MuiDivider-root": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack icon and text vertically on small screens
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "20px",
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
              background: "linear-gradient(45deg, #ff8c00 30%, #ff9500 90%)",
              borderRadius: "50%",
              mr: '20px',
              boxShadow: "0 4px 16px rgba(255, 140, 0, 0.3)",
            }}
          >
            <EmailIcon sx={{ color: "#fff", fontSize: "30px" }} />
          </Box>

          {/* Text Section */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 700,
                color: "white",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Contact Support
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginTop: "5px",
                fontSize: isMobile ? "0.9rem" : "1rem",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              Use the form below to contact the AspireAI team with any
              questions, comments, or concerns.
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ margin: "20px 0" }} />

        {/* Form Fields */}
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Message..."
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          sx={{ marginBottom: "20px" }}
        />

        {/* Divider */}
        <Divider sx={{ mb: 3 }} />

        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendQuery}
          sx={{
            width: isMobile ? "100%" : "auto",
            background: "linear-gradient(45deg, #ff8c00 30%, #ff9500 90%)",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "1rem",
            py: 1.5,
            px: 4,
            boxShadow: "0 4px 16px rgba(255, 140, 0, 0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            "&:hover": {
              background: "linear-gradient(45deg, #e67c00 30%, #ff8c00 90%)",
              boxShadow: "0 6px 20px rgba(255, 140, 0, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Send Query
        </Button>
      </Box>
    </Box>
  );
};

export default MentorContactPage;
