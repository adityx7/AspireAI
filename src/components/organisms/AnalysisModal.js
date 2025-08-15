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

const COLORS = ['#FFE893', '#A294F9', '#FFE6C9', '#C4D9FF', '#AAB99A', '#FBB4A5', '#5AB2FF'];

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontFamily: "Courier", bgcolor: "#FBF5DD", fontSize: '28px' }}>
        Analysis Result
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#FBF5DD" }}>
        {analysisResult && (
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={setActiveStep}
          >
            {/* Slide 1: SWOT Summary */}
            <Box sx={{ p: 3, textAlign: "center", bgcolor: "white", borderRadius: "8px", boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "Comic Sans MS" }}>
                SWOT Scores
              </Typography>
              <Grid container spacing={2} justifyContent="center" height={'120px'}>
                {swotData.map((item, index) => (
                  <Grid item xs={6} key={index} textAlign="center">
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#0288d1" }}>
                      {item.name}: {item.score}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, fontFamily: "Comic Sans MS" }}>
                Best Career Category
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "18px", color: "#0288d1", fontWeight: "bold" }}>
                {analysisResult.bestCareerCategory}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, fontFamily: "Comic Sans MS" }}>
                Suggested Careers
              </Typography>
              <Typography sx={{ mt: 1, fontSize: "14px" }}>
                {analysisResult.suggestedCareers.join(", ")}
              </Typography>
            </Box>

            {/* Slide 2: SWOT Graph */}
            <Box id="swot-chart" sx={{ p: 3, textAlign: "center", bgcolor: "white", borderRadius: "8px", boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontFamily: "Comic Sans MS" }}>
                SWOT Analysis Graph
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={swotData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#A3D8FF" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Slide 3: Career Score Graph */}
            <Box id="career-chart" sx={{ p: 3, textAlign: "center", bgcolor: "white", borderRadius: "8px", boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontFamily: "Comic Sans MS" }}>
                Career Score Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={careerData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                    {careerData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </SwipeableViews>
        )}
      </DialogContent>

      <MobileStepper
        steps={3}
        position="static"
        bgcolor="#FBF5DD"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 2}>
            Next
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
        }
      />

      <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: "#FBF5DD", gap: 8 }}>
        {/* Close Button */}
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          color="primary"
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={!analysisResult}
        >
          Download Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
