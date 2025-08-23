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

// Updated colors to match navy blue and gold theme
const COLORS = ['#ffd700', '#ffed4e', '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

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
      PaperProps={{
        sx: {
          background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
          border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: "center", 
        fontWeight: 700, 
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
        color: "#ffd700",
        fontSize: '1.8rem',
        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        py: 3
      }}>
        Analysis Result
      </DialogTitle>
      
      <DialogContent sx={{ 
        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
        px: 3,
        py: 2
      }}>
        {analysisResult && (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={setActiveStep}
          >
            {/* Slide 1: SWOT Summary */}
            <Box sx={{ 
              p: 3, 
              textAlign: "center", 
              background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)", 
              borderRadius: 3, 
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)" 
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#ffd700",
                mb: 2
              }}>
                SWOT Scores
              </Typography>
              <Grid container spacing={2} justifyContent="center" height={'120px'}>
                {swotData.map((item, index) => (
                  <Grid item xs={6} key={index} textAlign="center">
                    <Typography sx={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#e2e8f0",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    }}>
                      {item.name}: <span style={{ color: "#ffd700" }}>{item.score}</span>
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mt: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#ffd700"
              }}>
                Best Career Category
              </Typography>
              <Typography sx={{ 
                mt: 1, 
                fontSize: "18px", 
                color: "#e2e8f0", 
                fontWeight: 600,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}>
                {analysisResult.bestCareerCategory}
              </Typography>

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mt: 3, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#ffd700"
              }}>
                Suggested Careers
              </Typography>
              <Typography sx={{ 
                mt: 1, 
                fontSize: "14px",
                color: "#cbd5e1",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}>
                {analysisResult.suggestedCareers.join(", ")}
              </Typography>
            </Box>

            {/* Slide 2: SWOT Graph */}
            <Box id="swot-chart" sx={{ 
              p: 3, 
              textAlign: "center", 
              background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)", 
              borderRadius: 3, 
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)" 
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#ffd700"
              }}>
                SWOT Analysis Graph
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={swotData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                    axisLine={{ stroke: '#ffd700' }}
                  />
                  <YAxis 
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                    axisLine={{ stroke: '#ffd700' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e3a8a',
                      border: '1px solid #ffd700',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                  />
                  <Bar dataKey="score" fill="#ffd700" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Slide 3: Career Score Graph */}
            <Box id="career-chart" sx={{ 
              p: 3, 
              textAlign: "center", 
              background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)", 
              borderRadius: 3, 
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)" 
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#ffd700"
              }}>
                Career Score Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={careerData} 
                    dataKey="value" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    labelStyle={{ fill: '#e2e8f0', fontSize: '12px' }}
                  >
                    {careerData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e3a8a',
                      border: '1px solid #ffd700',
                      borderRadius: '8px',
                      color: '#e2e8f0'
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
          background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
          "& .MuiMobileStepper-dot": {
            backgroundColor: "rgba(255,215,0,0.3)",
          },
          "& .MuiMobileStepper-dotActive": {
            backgroundColor: "#ffd700",
          },
        }}
        nextButton={
          <Button 
            size="small" 
            onClick={handleNext} 
            disabled={activeStep === 2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(255,215,0,0.1)",
              },
              "&:disabled": {
                color: "rgba(255,215,0,0.3)",
              },
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
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
              color: "#ffd700",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(255,215,0,0.1)",
              },
              "&:disabled": {
                color: "rgba(255,215,0,0.3)",
              },
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
            }}
          >
            Back
          </Button>
        }
      />

      <DialogActions sx={{ 
        justifyContent: "center", 
        pb: 3, 
        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
        gap: 2,
        px: 3
      }}>
        {/* Close Button */}
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderColor: "rgba(255,215,0,0.5)",
            color: "#ffd700",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 3,
            textTransform: "none",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#ffd700",
              backgroundColor: "rgba(255,215,0,0.1)",
              borderWidth: "2px",
            },
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
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
            background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
            color: "#1e3a8a",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
              boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
            },
            "&:disabled": {
              background: "rgba(255,215,0,0.3)",
              color: "#1e3a8a",
            },
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
          }}
        >
          Download Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
