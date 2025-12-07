import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0A192F 0%, #172A45 100%)",
        padding: 4,
      }}
    >
      {/* Title */}
      <Typography
        variant="h2"
        sx={{
          color: "#B8860B",
          fontWeight: 700,
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "2rem", md: "3rem" },
          textShadow: "0 0 20px rgba(184, 134, 11, 0.5)",
        }}
      >
        AspireAI Online Mentoring
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          mb: 6,
          textAlign: "center",
          fontSize: { xs: "1rem", md: "1.5rem" },
        }}
      >
        Unlock your potential with guidance from experienced mentors
      </Typography>

      {/* Login Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Student Login/Signup Button */}
        <Button
          variant="contained"
          startIcon={<SchoolIcon sx={{ fontSize: "2rem" }} />}
          onClick={() => navigate("/login")}
          sx={{
            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
            color: "white",
            py: 3,
            px: 6,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: 3,
            minWidth: 280,
            boxShadow: "0 8px 25px rgba(184, 134, 11, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #8B6914 0%, #B8860B 100%)",
              transform: "translateY(-4px)",
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.6)",
            },
          }}
        >
          Student Login/Signup
        </Button>

        {/* Mentor Login/Signup Button */}
        <Button
          variant="contained"
          startIcon={<PersonIcon sx={{ fontSize: "2rem" }} />}
          onClick={() => navigate("/mentor-login")}
          sx={{
            background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
            color: "white",
            py: 3,
            px: 6,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: 3,
            minWidth: 280,
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
              transform: "translateY(-4px)",
              boxShadow: "0 12px 35px rgba(59, 130, 246, 0.6)",
            },
          }}
        >
          Mentor Login/Signup
        </Button>

        {/* Admin Login Button */}
        <Button
          variant="contained"
          startIcon={<AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />}
          onClick={() => navigate("/admin-login")}
          sx={{
            background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
            color: "white",
            py: 3,
            px: 6,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: 3,
            minWidth: 280,
            boxShadow: "0 8px 25px rgba(124, 58, 237, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
              transform: "translateY(-4px)",
              boxShadow: "0 12px 35px rgba(124, 58, 237, 0.6)",
            },
          }}
        >
          Admin Login
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
