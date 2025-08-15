import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit"; // Snowflake icon
import { useNavigate } from "react-router-dom";
import axios from "axios";

const mentorIDRegex = /^BNM\d{4}$/;

export default function MentorSignInPage() {
    const navigate = useNavigate();
    const [mentorID, setmentorID] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For login errors
    const [password, setPassword] = useState("");
    const [mentorIDError, setMentorIDError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Refs for focusing on the fields
    const mentorIDRef = useRef(null);
    const passwordRef = useRef(null);

    // Focus on mentorID when the component mounts
    useEffect(() => {
        if (mentorIDRef.current) {
            mentorIDRef.current.focus(); // Focus on mentorID field
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setMentorIDError("");
        setPasswordError("");
        setErrorMessage(""); // Reset error message before login attempt

        // Validate mentorID
        if (!mentorID) {
            setMentorIDError("Mentor ID is required.");
            mentorIDRef.current.focus();
            return;
        } else if (!mentorIDRegex.test(mentorID)) {
            setMentorIDError("Please enter a valid Mentor ID (e.g., BNM0001).");
            mentorIDRef.current.focus();
            return;
        }

        // Validate password
        if (!password) {
            setPasswordError("Password is required.");
            passwordRef.current.focus();
            return;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            passwordRef.current.focus();
            return;
        }

        try {
            console.log("Sending request with:", { mentorID, password });
        
            const response = await axios.post("http://localhost:5002/api/mentor/login", {
                mentorID,
                password
            });
        
            console.log("Response received:", response.data); // ✅ Debugging log
        
            if (response.data.success) {
                console.log("Mentor Token:", response.data.token); // ✅ Debug token before storing
                localStorage.setItem("mentorToken", response.data.token); // Store token
                localStorage.setItem("mentorID", mentorID);
                navigate("/dashboard-mentor"); // Redirect to dashboard
            } else {
                console.log("Error:", response.data.message); // ✅ Log error message
                setErrorMessage("Invalid Mentor ID or Password. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error);
            setErrorMessage("Login failed. Check your credentials.");
        }        
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to bottom, #f5f5f5 50%, #000 50%)",
                px: 2, // Padding for smaller screens
            }}
        >
            {/* Main Container */}
            <Box
                sx={{
                    width: { xs: "100%", sm: "80%", md: "50%", lg: "40%" },
                    maxWidth: 450,
                    backgroundColor: "#F8FAFC", // Light gray
                    borderRadius: 3,
                    boxShadow: 3,
                    padding: { xs: 3, sm: 4, md: 5 },
                }}
            >
                {errorMessage && (
                    <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Top Section */}
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <AcUnitIcon sx={{ fontSize: 40, color: "black.main" }} />
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                                fontFamily: "Courier",
                            }}
                        >
                            Career Compass
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }}
                    >
                        Account Login
                    </Typography>
                    <Typography variant="body3" color="text.secondary">
                        Enter your account info below:
                    </Typography>
                </Box>

                {/* Sign-In Form Section */}
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        boxShadow: 1,
                        padding: { xs: 2, sm: 4 },
                        mb: 3,
                    }}
                >
                    {/* mentorID and Password Section */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Mentor ID"
                            placeholder="BNM0001"
                            value={mentorID}
                            onChange={(e) => setmentorID(e.target.value)}
                            error={Boolean(mentorIDError)}
                            helperText={mentorIDError}
                            sx={{
                                mb: 4,
                                mt: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    backgroundColor: "#fff",
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#FFA928",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#0073B1",
                                    },
                                },
                                "& .MuiFormHelperText-root": {
                                    fontSize: "0.85rem",
                                },
                            }}
                            inputRef={mentorIDRef}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    backgroundColor: "#fff",
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#FFA928",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#0073B1",
                                    },
                                },
                                "& .MuiFormHelperText-root": {
                                    fontSize: "0.85rem",
                                },
                            }}
                            inputRef={passwordRef}
                        />
                    </Box>

                    {/* Sign In Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            textTransform: "capitalize",
                            mb: 2,
                            py: { xs: 1, sm: 1.5 },
                            background: "#FFA928",
                        }}
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>

                    {/* Links Section */}
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                        >
                            <Link href="/mentor/register" underline="hover" color="primary">
                                Create Mentor Account<br></br>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
