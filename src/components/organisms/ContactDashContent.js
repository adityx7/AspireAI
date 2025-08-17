import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  useMediaQuery,
  useTheme
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
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "700px",
          padding: isMobile ? "24px" : "32px",
          borderRadius: "24px",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
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
              "& input": {
                color: "white",
              },
              "& textarea": {
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
          "& .MuiButton-root": {
            backgroundColor: "#ff8c00",
            color: "white",
            "&:hover": {
              backgroundColor: "#e67c00",
            },
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
              background: "linear-gradient(135deg, #ff8c00, #1976d2)",
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
              variant="h6"
              component="h1"
              fontFamily={"Courier"}
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
              }}
            >
              Contact Support
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              fontFamily={"Bookman Old Style"}
              sx={{
                marginTop: "5px",
                fontSize: isMobile ? "0.9rem" : "1rem",
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
            width: isMobile ? "100%" : "auto", // Full-width button on small screens
          }}
        >
          Send Query
        </Button>
      </Paper>
    </Box>
  );
};

export default ContactPage;
