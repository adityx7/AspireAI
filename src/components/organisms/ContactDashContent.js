import React, { useState } from "react";
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
import { toast, ToastContainer } from "react-toastify";

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSendQuery = () => {
    if (!formData.subject || !formData.message) {
      toast.warning("Please fill in all fields.");
      return;
    }
    
    console.log("Query Sent", formData);
    toast.success("Query sent successfully!");
    setFormData({ subject: "", message: "" });
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
        p: 2,
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
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
          color: "#e2e8f0",
          "& .MuiTextField-root": {
            "& .MuiOutlinedInput-root": {
              background: "rgba(15,23,42,0.5)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(255,215,0,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,215,0,0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffd700",
                borderWidth: "2px",
              },
              "& input": {
                color: "#e2e8f0",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              },
              "& textarea": {
                color: "#e2e8f0",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              },
              "& input::placeholder": {
                color: "#cbd5e1",
                opacity: 0.7,
              },
              "& textarea::placeholder": {
                color: "#cbd5e1",
                opacity: 0.7,
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,215,0,0.8)",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              "&.Mui-focused": {
                color: "#ffd700",
              },
            },
          },
          "& .MuiTypography-root": {
            color: "#e2e8f0",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          },
          "& .MuiDivider-root": {
            backgroundColor: "rgba(255,215,0,0.3)",
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "24px",
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
              background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
              borderRadius: "50%",
              mr: isMobile ? 0 : '20px',
              mb: isMobile ? '16px' : 0,
              boxShadow: "0 4px 16px rgba(255,215,0,0.4)",
              border: "2px solid rgba(255,215,0,0.6)",
            }}
          >
            <EmailIcon sx={{ color: "#1e3a8a", fontSize: "32px" }} />
          </Box>

          {/* Text Section */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontWeight: 700,
                color: "#ffd700",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                letterSpacing: "0.5px",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              Contact Support
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginTop: "8px",
                fontSize: isMobile ? "1rem" : "1.1rem",
                color: "#cbd5e1",
                lineHeight: 1.6,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              Use the form below to contact the AspireAI team with any
              questions, comments, or concerns.
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ margin: "24px 0" }} />

        {/* Form Fields */}
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          placeholder="Enter your subject..."
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          placeholder="Type your message here..."
          sx={{ marginBottom: "24px" }}
        />

        {/* Divider */}
        <Divider sx={{ mb: 3 }} />

        {/* Button */}
        <Button
          variant="contained"
          onClick={handleSendQuery}
          sx={{
            background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
            color: "#1e3a8a",
            fontWeight: 700,
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
            textTransform: "none",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            width: isMobile ? "100%" : "auto",
            "&:hover": {
              background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
              boxShadow: "0 6px 24px rgba(255,215,0,0.4)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Send Query
        </Button>
      </Paper>

      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{
          background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
          border: "1px solid rgba(255,215,0,0.3)",
          color: "#e2e8f0",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
        }}
        progressStyle={{
          background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)"
        }}
      />
    </Box>
  );
};

export default ContactPage;
