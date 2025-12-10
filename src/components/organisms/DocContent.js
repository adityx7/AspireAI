import React, { useState } from "react";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderCopyOutlined";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast styles
import AnalysisModal from "./AnalysisModal";

const DocumentsPage = () => {
    const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
    const [email, setEmail] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Handle questionnaire click
    const handleQuestionnaireClick = () => {
        window.open("https://forms.gle/na4ae7QdwdDCP66PA", "_blank");
        setQuestionnaireCompleted(true);
        toast.info("Questionnaire opened in a new tab!"); // ✅ Show toast notification
    };

    // Handle Analysis Click
    const handleAnalysisClick = async () => {
        if (!email) {
            toast.warning("Please enter your email first."); // ✅ Replace alert with toast
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await axios.post("http://localhost:5001/fetch-data", { email });

            if (response.data.success) {
                setAnalysisResult(response.data.data);
                setOpenDialog(true);
            } else {
                setError("No data found for the provided email.");
                toast.error("No data found for this email."); // ✅ Error toast
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while fetching data.");
            toast.error("Error fetching data. Try again later."); // ✅ Error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            mt: { xs: "60px", md: "80px" }, 
            mb: { xs: "40px", md: "80px" },
            px: { xs: 2, sm: 3 },
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            minHeight: "70vh",
            justifyContent: "center",
            position: "relative",
            zIndex: 100
        }}>
            {/* Top Section */}
            <Box 
                sx={{ 
                textAlign: "center", 
                padding: "40px",
                background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(184, 134, 11, 0.3)",
                borderRadius: "24px",
                maxWidth: "550px", 
                width: "100%",
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(184, 134, 11, 0.1)",
                position: "relative",
                overflow: "hidden",
                opacity: 1,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)'
                }
            }}>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "80px", 
                    height: "80px", 
                    background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                    borderRadius: "50%", 
                    margin: "0 auto",
                    boxShadow: "0 12px 40px rgba(184, 134, 11, 0.3)"
                }}>
                    <FolderIcon sx={{ fontSize: 40, color: "#ffffff" }} />
                </Box>
                <Typography variant="h5" sx={{ 
                    fontWeight: "700", 
                    marginTop: "20px", 
                    color: "#ffffff", 
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                }}>
                    Skill Analysis Questionnaire
                </Typography>
                <Typography variant="body1" sx={{ 
                    marginTop: "12px", 
                    color: "#B8860B", 
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                    fontWeight: "500",
                    lineHeight: 1.6
                }}>
                    Start to assess yourself by knowing yourself better with the questionnaire.
                </Typography>

                {/* Divider */}
                <Divider sx={{ 
                    width: "100%", 
                    maxWidth: "500px", 
                    marginTop: "24px", 
                    borderColor: "rgba(184, 134, 11, 0.3)",
                    '&::before, &::after': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                    }
                }} />

                {/* Email Input */}
                <TextField
                    label="Enter your email"
                    variant="outlined"
                    fullWidth
                    sx={{ 
                        mt: 3,
                        '& .MuiOutlinedInput-root': {
                            background: "rgba(26, 43, 76, 0.3)",
                            backdropFilter: "blur(10px)",
                            '& fieldset': {
                                borderColor: 'rgba(184, 134, 11, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(184, 134, 11, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#B8860B',
                            },
                            '& input': {
                                color: '#ffffff',
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#B8860B',
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            '&.Mui-focused': {
                                color: '#B8860B',
                            },
                        },
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "24px", gap: 3 }}>
                    <Button 
                        variant="contained" 
                        startIcon={<DynamicFormIcon />} 
                        onClick={handleQuestionnaireClick} 
                        sx={{ 
                            textTransform: "none",
                            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                            color: "#ffffff",
                            fontWeight: "600",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            '&:hover': {
                                background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                transform: "translateY(-2px)"
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        Questionnaire
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<QueryStatsIcon />} 
                        onClick={handleAnalysisClick} 
                        disabled={!questionnaireCompleted}
                        sx={{ 
                            textTransform: "none",
                            background: questionnaireCompleted 
                                ? "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)"
                                : "linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(218, 165, 32, 0.3) 100%)",
                            color: questionnaireCompleted ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                            fontWeight: "600",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            boxShadow: questionnaireCompleted 
                                ? "0 8px 25px rgba(184, 134, 11, 0.3)"
                                : "0 4px 15px rgba(184, 134, 11, 0.1)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            '&:hover': questionnaireCompleted ? {
                                background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                transform: "translateY(-2px)"
                            } : {},
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        Start Analysis
                    </Button>
                </Box>

                {/* Loading and Error Handling */}
                {loading && (
                    <Typography sx={{ 
                        mt: 3, 
                        color: "#B8860B",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontWeight: "500"
                    }}>
                        Fetching your data...
                    </Typography>
                )}
                {error && (
                    <Typography sx={{ 
                        mt: 3, 
                        color: "#ff6b6b",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                        fontWeight: "500"
                    }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {/* Analysis Modal with Download Report Button */}
            {/* Analysis Modal with Download Report Button */}
            <AnalysisModal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                analysisResult={analysisResult}
                email={email} // ✅ Pass email prop
            />


            {/* Toast Container */}
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                toastStyle={{
                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                }}
            />
        </Box>
    );
};

export default DocumentsPage;
