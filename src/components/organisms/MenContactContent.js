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
          padding: "20px",
        //   border: isMobile ? "none" : "1px solid #ccc",
          borderRadius: isMobile ? "0" : "8px",
          backgroundColor: "#fff",
          boxShadow: isMobile ? "none" : "0px 6px 12px rgba(0, 0, 0, 0.2)",
          overflow: "hidden", // Prevent content from overflowing
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
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1976d2",
              borderRadius: "50%",
              mr: '20px'
            }}
          >
            <EmailIcon sx={{ color: "#fff", fontSize: "30px" }} />
          </Box>

          {/* Text Section */}
          <Box>
            <Typography
              variant="h4"
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
              Use the form below to contact the Career Compass team with any
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
      </Box>
    </Box>
  );
};

export default MentorContactPage;
