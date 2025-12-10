import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Button, TextField, Fade, Grow, Zoom } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderCopyOutlined";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast styles
import AnalysisModal from "./AnalysisModal";
import { keyframes } from "@mui/system";

// Keyframe animations
const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
`;

const glow = keyframes`
    0%, 100% { box-shadow: 0 12px 40px rgba(184, 134, 11, 0.3); }
    50% { box-shadow: 0 12px 60px rgba(184, 134, 11, 0.6); }
`;

const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
`;

const DocumentsPage = () => {
    const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
    const [email, setEmail] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Trigger animation on mount
    useEffect(() => {
        setShowContent(true);
    }, []);

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
            <Fade in={showContent} timeout={1000}>
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
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: "0 30px 90px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(184, 134, 11, 0.2)",
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)'
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent 30%, rgba(184, 134, 11, 0.05) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        animation: `${shimmer} 3s linear infinite`,
                        pointerEvents: 'none'
                    }
                }}>
                    <Zoom in={showContent} timeout={800} style={{ transitionDelay: '200ms' }}>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            width: "80px", 
                            height: "80px", 
                            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                            borderRadius: "50%", 
                            margin: "0 auto",
                            boxShadow: "0 12px 40px rgba(184, 134, 11, 0.3)",
                            animation: `${float} 3s ease-in-out infinite, ${glow} 2s ease-in-out infinite`,
                            transition: "all 0.3s ease",
                            '&:hover': {
                                transform: 'rotate(360deg) scale(1.1)',
                                boxShadow: "0 15px 50px rgba(184, 134, 11, 0.5)"
                            }
                        }}>
                            <FolderIcon sx={{ fontSize: 40, color: "#ffffff" }} />
                        </Box>
                    </Zoom>
                    <Grow in={showContent} timeout={1000} style={{ transitionDelay: '300ms' }}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: "700", 
                            marginTop: "20px", 
                            color: "#ffffff", 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            textShadow: "0 2px 10px rgba(184, 134, 11, 0.3)"
                        }}>
                            Skill Analysis Questionnaire
                        </Typography>
                    </Grow>
                    <Fade in={showContent} timeout={1200} style={{ transitionDelay: '400ms' }}>
                        <Typography variant="body1" sx={{ 
                            marginTop: "12px", 
                            color: "#B8860B", 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            fontWeight: "500",
                            lineHeight: 1.6
                        }}>
                            Start to assess yourself by knowing yourself better with the questionnaire.
                        </Typography>
                    </Fade>

                {/* Divider */}
                <Fade in={showContent} timeout={1200} style={{ transitionDelay: '500ms' }}>
                    <Divider sx={{ 
                        width: "100%", 
                        maxWidth: "500px", 
                        marginTop: "24px", 
                        borderColor: "rgba(184, 134, 11, 0.3)",
                        '&::before, &::after': {
                            borderColor: 'rgba(184, 134, 11, 0.3)'
                        }
                    }} />
                </Fade>

                {/* Email Input */}
                <Fade in={showContent} timeout={1400} style={{ transitionDelay: '600ms' }}>
                    <TextField
                        label="Enter your email"
                        variant="outlined"
                        fullWidth
                        sx={{ 
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                                background: "rgba(26, 43, 76, 0.3)",
                                backdropFilter: "blur(10px)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                '& fieldset': {
                                    borderColor: 'rgba(184, 134, 11, 0.3)',
                                    transition: "all 0.3s ease"
                                },
                                '&:hover': {
                                    background: "rgba(26, 43, 76, 0.5)",
                                    transform: 'translateY(-2px)',
                                    '& fieldset': {
                                        borderColor: 'rgba(184, 134, 11, 0.5)',
                                    }
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(184, 134, 11, 0.5)',
                                },
                                '&.Mui-focused': {
                                    background: "rgba(26, 43, 76, 0.6)",
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(184, 134, 11, 0.2)',
                                    '& fieldset': {
                                        borderColor: '#B8860B',
                                        borderWidth: '2px'
                                    }
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
                </Fade>

                {/* Buttons */}
                <Fade in={showContent} timeout={1600} style={{ transitionDelay: '700ms' }}>
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
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '0',
                                    height: '0',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translate(-50%, -50%)',
                                    transition: 'width 0.6s, height 0.6s',
                                },
                                '&:hover': {
                                    background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                    boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                    transform: "translateY(-2px) scale(1.02)",
                                    '&::before': {
                                        width: '300px',
                                        height: '300px',
                                    }
                                },
                                '&:active': {
                                    transform: "translateY(0) scale(0.98)"
                                },
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        >
                            Questionnaire
                        </Button>
                        <Button 
                            variant="contained" 
                            startIcon={loading ? null : <QueryStatsIcon />} 
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
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '0',
                                    height: '0',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translate(-50%, -50%)',
                                    transition: 'width 0.6s, height 0.6s',
                                },
                                '&:hover': questionnaireCompleted ? {
                                    background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                    boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                    transform: "translateY(-2px) scale(1.02)",
                                    '&::before': {
                                        width: '300px',
                                        height: '300px',
                                    }
                                } : {},
                                '&:active': questionnaireCompleted ? {
                                    transform: "translateY(0) scale(0.98)"
                                } : {},
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        >
                            {loading ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    '& .dot': {
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: '#ffffff',
                                        animation: `${pulse} 1.4s ease-in-out infinite`,
                                        '&:nth-of-type(2)': {
                                            animationDelay: '0.2s'
                                        },
                                        '&:nth-of-type(3)': {
                                            animationDelay: '0.4s'
                                        }
                                    }
                                }}>
                                    <Box className="dot" />
                                    <Box className="dot" />
                                    <Box className="dot" />
                                </Box>
                            ) : 'Start Analysis'}
                        </Button>
                    </Box>
                </Fade>

                {/* Loading and Error Handling */}
                {loading && (
                    <Fade in={loading} timeout={500}>
                        <Typography sx={{ 
                            mt: 3, 
                            color: "#B8860B",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            fontWeight: "500",
                            animation: `${pulse} 1.5s ease-in-out infinite`
                        }}>
                            Fetching your data...
                        </Typography>
                    </Fade>
                )}
                {error && (
                    <Fade in={!!error} timeout={500}>
                        <Typography sx={{ 
                            mt: 3, 
                            color: "#ff6b6b",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            fontWeight: "500",
                            animation: `${pulse} 0.5s ease-in-out`
                        }}>
                            {error}
                        </Typography>
                    </Fade>
                )}
            </Box>
            </Fade>

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
