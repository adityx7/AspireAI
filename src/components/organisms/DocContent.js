import React, { useState } from "react";
import { Box, Typography, Divider, Button, TextField, Paper } from "@mui/material";
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
        <Box sx={{ mt: { xs: "40px", md: "180px" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Top Section */}
            <Paper 
                elevation={8}
                sx={{ 
                    textAlign: "center", 
                    padding: "32px", 
                    borderRadius: "24px", 
                    maxWidth: "600px", 
                    width: "100%",
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
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.8)",
                            "&.Mui-focused": {
                                color: "#ff8c00",
                            },
                        },
                    },
                    "& .MuiButton-root": {
                        backgroundColor: "#ff8c00",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#e67c00",
                        },
                        "&:disabled": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "rgba(255, 255, 255, 0.5)",
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
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "80px", 
                    height: "80px", 
                    background: "linear-gradient(135deg, #ff8c00, #0288d1)", 
                    borderRadius: "50%", 
                    margin: "0 auto",
                    boxShadow: "0 4px 16px rgba(255, 140, 0, 0.3)",
                }}>
                    <FolderIcon sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: "16px" }}>
                    Skill Analysis Questionnaire
                </Typography>
                <Typography variant="body2" sx={{ marginTop: "8px" }}>
                    Start to assess yourself by knowing yourself better with the questionnaire.
                </Typography>

                {/* Divider */}
                <Divider sx={{ width: "100%", maxWidth: "500px", marginTop: "24px" }} />

                {/* Email Input */}
                <TextField
                    label="Enter your email"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px", gap: 6 }}>
                    <Button variant="contained" color="primary" startIcon={<DynamicFormIcon />} onClick={handleQuestionnaireClick} sx={{ textTransform: "none" }}>
                        Questionnaire
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<QueryStatsIcon />} onClick={handleAnalysisClick} sx={{ textTransform: "none" }} disabled={!questionnaireCompleted}>
                        Start Analysis
                    </Button>
                </Box>

                {/* Loading and Error Handling */}
                {loading && <Typography sx={{ mt: 2, color: "#4fc3f7" }}>Fetching your data...</Typography>}
                {error && <Typography sx={{ mt: 2, color: "#ff6b6b" }}>{error}</Typography>}
            </Paper>

            {/* Analysis Modal with Download Report Button */}
            {/* Analysis Modal with Download Report Button */}
            <AnalysisModal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                analysisResult={analysisResult}
                email={email} // ✅ Pass email prop
            />


            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
};

export default DocumentsPage;
