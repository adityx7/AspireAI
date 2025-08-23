import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  Link,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

function StudentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
    
    // Example validation
    if (formData.email && formData.password) {
      setAlertMessage("Login successful! Redirecting to dashboard...");
      setAlertSeverity("success");
      setShowAlert(true);
      
      // Simulate redirect after 2 seconds
      setTimeout(() => {
        // navigate("/student/dashboard");
        setShowAlert(false);
      }, 2000);
    } else {
      setAlertMessage("Please fill in all fields");
      setAlertSeverity("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/* Background Overlay */}
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Alert */}
      {showAlert && (
        <Alert
          severity={alertSeverity}
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: alertSeverity === "success" ? "rgba(255,215,0,0.1)" : "rgba(239,68,68,0.1)",
            color: alertSeverity === "success" ? "#ffd700" : "#ef4444",
            border: `1px solid ${alertSeverity === "success" ? "rgba(255,215,0,0.3)" : "rgba(239,68,68,0.3)"}`,
            "& .MuiAlert-icon": {
              color: alertSeverity === "success" ? "#ffd700" : "#ef4444",
            },
          }}
        >
          {alertMessage}
        </Alert>
      )}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          sx={{
            background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
            border: "1px solid rgba(255,215,0,0.3)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <PersonIcon
                sx={{
                  fontSize: 60,
                  color: "#ffd700",
                  mb: 2,
                  p: 1.5,
                  backgroundColor: "rgba(255,215,0,0.1)",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,215,0,0.3)",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: "#ffd700",
                  mb: 2,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                }}
              >
                Student Login
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#e2e8f0",
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                }}
              >
                Welcome back! Sign in to continue your mentorship journey.
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffd700",
                    mb: 1,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      backgroundColor: "rgba(15,23,42,0.5)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(255,215,0,0.3)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,215,0,0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffd700",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "14px 16px",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "#cbd5e1",
                      opacity: 0.7,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffd700",
                    mb: 1,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      backgroundColor: "rgba(15,23,42,0.5)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(255,215,0,0.3)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,215,0,0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffd700",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "14px 16px",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "#cbd5e1",
                      opacity: 0.7,
                    },
                  }}
                />
              </Box>

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: "right", mb: 4 }}>
                <Link
                  href="#"
                  sx={{
                    color: "#ffd700",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#ffed4e",
                      textDecoration: "underline",
                    },
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                  color: "#1e3a8a",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  py: 1.8,
                  borderRadius: 3,
                  boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                  textTransform: "none",
                  mb: 3,
                  "&:hover": {
                    background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                    boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                }}
              >
                <LockIcon sx={{ mr: 1, fontSize: 20 }} />
                Sign In
              </Button>

              {/* Divider */}
              <Divider
                sx={{
                  my: 3,
                  borderColor: "rgba(255,215,0,0.3)",
                  "&::before, &::after": {
                    borderColor: "rgba(255,215,0,0.3)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#cbd5e1",
                    px: 2,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  OR
                </Typography>
              </Divider>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#e2e8f0",
                    mb: 2,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Don't have an account?
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/student/register")}
                  sx={{
                    borderColor: "rgba(255,215,0,0.5)",
                    color: "#ffd700",
                    fontWeight: 600,
                    fontSize: "1rem",
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    borderWidth: "2px",
                    "&:hover": {
                      borderColor: "#ffd700",
                      backgroundColor: "rgba(255,215,0,0.1)",
                      borderWidth: "2px",
                    },
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Create Student Account
                </Button>
              </Box>

              {/* Additional Links */}
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#cbd5e1",
                    mb: 2,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Are you a mentor?
                </Typography>
                <Link
                  href="/mentor/login"
                  sx={{
                    color: "#ffd700",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#ffed4e",
                      textDecoration: "underline",
                    },
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  }}
                >
                  Login as Mentor
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            sx={{
              color: "#ffd700",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255,215,0,0.1)",
                color: "#ffed4e",
              },
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
          >
            ← Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default StudentLogin;