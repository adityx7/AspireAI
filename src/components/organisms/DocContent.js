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
        <Box sx={{ mt: { xs: "40px", md: "180px" }, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Top Section */}
            <Box sx={{ textAlign: "center", padding: "24px", boxShadow: "0 5px 12px rgba(0, 0, 0, 0.4)", borderRadius: "8px", maxWidth: "500px", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", backgroundColor: "#D4EBF8", borderRadius: "50%", margin: "0 auto" }}>
                    <FolderIcon sx={{ fontSize: 40, color: "#0288d1" }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: "16px", color: "#333", fontFamily: "Courier" }}>
                    Skill Analysis Questionnaire
                </Typography>
                <Typography variant="body2" sx={{ marginTop: "8px", color: "#666", fontFamily: "Courier" }}>
                    Start to assess yourself by knowing yourself better with the questionnaire.
                </Typography>

                {/* Divider */}
                <Divider sx={{ width: "100%", maxWidth: "500px", marginTop: "24px", borderColor: "#ddd" }} />

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
                {loading && <Typography sx={{ mt: 2, color: "blue" }}>Fetching your data...</Typography>}
                {error && <Typography sx={{ mt: 2, color: "red" }}>{error}</Typography>}
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
            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
};

export default DocumentsPage;
