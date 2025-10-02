import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { toast } from "react-toastify";
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MobileStepper from '@mui/material/MobileStepper';
import html2canvas from "html2canvas";

const COLORS = ['#B8860B', '#DAA520', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#B22222'];

const AnalysisModal = ({ open, onClose, analysisResult, email }) => {

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  // Handle PDF Download
  const [responseContent, setResponseContent] = useState("");

  // Update responseContent when analysisResult changes
  useEffect(() => {
    if (analysisResult?.responseContent) {
      setResponseContent(analysisResult.responseContent);
    }
  }, [analysisResult]);

  const captureChartAsImage = async (chartId) => {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return null;
    await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure chart is fully rendered
    const canvas = await html2canvas(chartElement);
    return canvas.toDataURL("image/png"); // Convert to Base64
  };

  const handleDownload = async () => {
    if (!responseContent.trim()) {
      toast.warning("No content available for report generation.", { autoClose: 3000 });
      return;
    }

    try {
      const toastId = toast.loading("Generating report, please wait...");

      // Capture SWOT and Career Score charts
      const swotChartImage = await captureChartAsImage("swot-chart");
      const careerChartImage = await captureChartAsImage("career-chart");

      const userName = analysisResult?.userName || "Unknown_User";

      const response = await axios.post(
        "http://localhost:5001/generate-report",
        {
          userName,
          responseContent,
          swotChartImage,
          careerChartImage, // Send images to backend
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${email.split("@")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.update(toastId, { render: "PDF report generated successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate the PDF report.");
    }
  };

  const swotData = analysisResult?.swotScores
    ? Object.entries(analysisResult.swotScores).map(([key, value]) => ({ name: key, score: value }))
    : [];

  const careerData = analysisResult?.careerScores
    ? Object.entries(analysisResult.careerScores).map(([key, value]) => ({ name: key, value }))
    : [];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);


  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(184, 134, 11, 0.15)",
          borderRadius: "20px",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)"
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: "center", 
        fontWeight: "700", 
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", 
        background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
        color: "#ffffff",
        fontSize: '28px',
        borderRadius: "20px 20px 0 0",
        position: "relative",
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '2px'
        }
      }}>
        Analysis Result
      </DialogTitle>
      <DialogContent sx={{ 
        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
        color: "#ffffff"
      }}>
        {analysisResult && (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={setActiveStep}
          >
            {/* Slide 1: SWOT Summary */}
            <Box sx={{ 
              p: 4, 
              textAlign: "center", 
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: "16px", 
              backdropFilter: "blur(10px)",
              margin: "16px 0"
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "700", 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B",
                mb: 3
              }}>
                SWOT Scores
              </Typography>
              <Grid container spacing={2} justifyContent="center" minHeight={'120px'}>
                {swotData.map((item, index) => (
                  <Grid item xs={6} key={index} textAlign="center">
                    <Typography sx={{ 
                      fontSize: "16px", 
                      fontWeight: "600", 
                      color: "#ffffff",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                    }}>
                      <span style={{ color: "#B8860B" }}>{item.name}:</span> {item.score}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ 
                fontWeight: "700", 
                mt: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B"
              }}>
                Best Career Category
              </Typography>
              <Typography sx={{ 
                mt: 1, 
                fontSize: "18px", 
                color: "#ffffff", 
                fontWeight: "600",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
              }}>
                {analysisResult.bestCareerCategory}
              </Typography>

              <Typography variant="h6" sx={{ 
                fontWeight: "700", 
                mt: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B"
              }}>
                Suggested Careers
              </Typography>
              <Typography sx={{ 
                mt: 1, 
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                lineHeight: 1.6
              }}>
                {analysisResult.suggestedCareers.join(", ")}
              </Typography>
            </Box>

            {/* Slide 2: SWOT Graph */}
            <Box id="swot-chart" sx={{ 
              p: 4, 
              textAlign: "center", 
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: "16px", 
              backdropFilter: "blur(10px)",
              margin: "16px 0"
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "700", 
                mb: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B"
              }}>
                SWOT Analysis Graph
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={swotData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#B8860B', fontFamily: "'Inter', sans-serif" }}
                  />
                  <YAxis 
                    tick={{ fill: '#B8860B', fontFamily: "'Inter', sans-serif" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(26, 43, 76, 0.9)',
                      border: '1px solid rgba(184, 134, 11, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="score" fill="#B8860B" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Slide 3: Career Score Graph */}
            <Box id="career-chart" sx={{ 
              p: 4, 
              textAlign: "center", 
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: "16px", 
              backdropFilter: "blur(10px)",
              margin: "16px 0"
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "700", 
                mb: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                color: "#B8860B"
              }}>
                Career Score Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={careerData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                    {careerData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(26, 43, 76, 0.9)',
                      border: '1px solid rgba(184, 134, 11, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </SwipeableViews>
        )}
      </DialogContent>

      <MobileStepper
        steps={3}
        position="static"
        activeStep={activeStep}
        sx={{
          background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
          color: "#ffffff",
          '& .MuiMobileStepper-dots': {
            '& .MuiMobileStepper-dot': {
              backgroundColor: 'rgba(184, 134, 11, 0.3)',
            },
            '& .MuiMobileStepper-dotActive': {
              backgroundColor: '#B8860B',
            }
          }
        }}
        nextButton={
          <Button 
            size="small" 
            onClick={handleNext} 
            disabled={activeStep === 2}
            sx={{
              color: activeStep === 2 ? 'rgba(184, 134, 11, 0.3)' : '#B8860B',
              fontWeight: '600',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            Next
          </Button>
        }
        backButton={
          <Button 
            size="small" 
            onClick={handleBack} 
            disabled={activeStep === 0}
            sx={{
              color: activeStep === 0 ? 'rgba(184, 134, 11, 0.3)' : '#B8860B',
              fontWeight: '600',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            Back
          </Button>
        }
      />

      <DialogActions sx={{ 
        justifyContent: "center", 
        pb: 3, 
        pt: 2,
        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
        gap: 3,
        borderRadius: "0 0 20px 20px"
      }}>
        {/* Close Button */}
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(218, 165, 32, 0.2) 100%)",
            color: "#B8860B",
            fontWeight: "600",
            padding: "12px 24px",
            borderRadius: "12px",
            border: "1px solid rgba(184, 134, 11, 0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            '&:hover': {
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(218, 165, 32, 0.3) 100%)",
              transform: "translateY(-1px)"
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          Close
        </Button>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={!analysisResult}
          sx={{
            background: analysisResult 
              ? "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)"
              : "linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(218, 165, 32, 0.3) 100%)",
            color: analysisResult ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
            fontWeight: "600",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow: analysisResult 
              ? "0 8px 25px rgba(184, 134, 11, 0.3)"
              : "0 4px 15px rgba(184, 134, 11, 0.1)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            '&:hover': analysisResult ? {
              background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
              transform: "translateY(-2px)"
            } : {},
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          Download Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
