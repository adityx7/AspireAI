import React, { useState } from "react";
import { Box, Typography, Divider, Button, TextField, Paper } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderCopyOutlined";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        toast.info("Questionnaire opened in a new tab!");
    };

    // Handle Analysis Click
    const handleAnalysisClick = async () => {
        if (!email) {
            toast.warning("Please enter your email first.");
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
                toast.error("No data found for this email.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while fetching data.");
            toast.error("Error fetching data. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            mt: { xs: "40px", md: "180px" }, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            px: 2
        }}>
            {/* Top Section */}
            <Paper 
                elevation={8}
                sx={{ 
                    textAlign: "center", 
                    padding: "32px", 
                    borderRadius: "24px", 
                    maxWidth: "600px", 
                    width: "100%",
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
                            "& input::placeholder": {
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
                    "& .MuiButton-root": {
                        background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                        color: "#1e3a8a",
                        fontWeight: 600,
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                        textTransform: "none",
                        "&:hover": {
                            background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                            boxShadow: "0 6px 24px rgba(255,215,0,0.4)",
                            transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                            background: "rgba(255,215,0,0.2)",
                            color: "rgba(30,58,138,0.5)",
                            boxShadow: "none",
                            transform: "none",
                        },
                        transition: "all 0.3s ease",
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
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "80px", 
                    height: "80px", 
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)", 
                    borderRadius: "50%", 
                    margin: "0 auto",
                    boxShadow: "0 4px 16px rgba(255,215,0,0.4)",
                    border: "2px solid rgba(255,215,0,0.6)",
                }}>
                    <FolderIcon sx={{ fontSize: 40, color: "#1e3a8a" }} />
                </Box>
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 700, 
                        marginTop: "16px",
                        color: "#ffd700",
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        letterSpacing: "0.5px"
                    }}
                >
                    Skill Analysis Questionnaire
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        marginTop: "8px",
                        color: "#cbd5e1",
                        fontSize: "1rem",
                        lineHeight: 1.6
                    }}
                >
                    Start to assess yourself by knowing yourself better with the questionnaire.
                </Typography>

                {/* Divider */}
                <Divider sx={{ 
                    width: "100%", 
                    maxWidth: "500px", 
                    marginTop: "24px",
                    marginBottom: "24px"
                }} />

                {/* Email Input */}
                <TextField
                    label="Enter your email"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                />

                {/* Buttons */}
                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    marginTop: "24px", 
                    gap: 3,
                    flexWrap: "wrap"
                }}>
                    <Button 
                        variant="contained" 
                        startIcon={<DynamicFormIcon />} 
                        onClick={handleQuestionnaireClick}
                        sx={{ 
                            minWidth: "160px",
                            py: 1.5,
                            px: 3
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
                            minWidth: "160px",
                            py: 1.5,
                            px: 3
                        }}
                    >
                        Start Analysis
                    </Button>
                </Box>

                {/* Loading and Error Handling */}
                {loading && (
                    <Typography 
                        sx={{ 
                            mt: 3, 
                            color: "#ffd700",
                            fontWeight: 600,
                            background: "rgba(255,215,0,0.1)",
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(255,215,0,0.3)"
                        }}
                    >
                        🔄 Fetching your data...
                    </Typography>
                )}
                {error && (
                    <Typography 
                        sx={{ 
                            mt: 3, 
                            color: "#ff6b6b",
                            fontWeight: 600,
                            background: "rgba(255,107,107,0.1)",
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(255,107,107,0.3)"
                        }}
                    >
                        ❌ {error}
                    </Typography>
                )}
            </Paper>

            {/* Analysis Modal */}
            <AnalysisModal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                analysisResult={analysisResult}
                email={email}
            />

            {/* Toast Container with Navy Blue & Gold Theme */}
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    color: "#e2e8f0",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    fontWeight: 500,
                }}
                progressStyle={{
                    background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)"
                }}
            />
        </Box>
    );
};

export default DocumentsPage;
