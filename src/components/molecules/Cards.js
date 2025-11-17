import React, { useState, useEffect } from "react";
import { Card, Typography, Divider, Button, Box } from "@mui/material";
import { toast } from "react-toastify";

const MentorCard = ({ mentor }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if this mentor is already selected
  useEffect(() => {
    const selectedMentorID = localStorage.getItem("selectedMentorID");
    const selectedMentorName = localStorage.getItem("selectedMentor");
    
    if (mentor.mentorID && selectedMentorID === mentor.mentorID) {
      setIsSelected(true);
    } else if (mentor.fullName && selectedMentorName === mentor.fullName) {
      setIsSelected(true);
    }
  }, [mentor]);

  const handleChooseMentor = async () => {
    const userUSN = localStorage.getItem("userUSN");
    
    if (!userUSN) {
      toast.error("Please login to choose a mentor");
      return;
    }

    if (isLoading) return; // Prevent double clicks

    console.log("🎯 Choosing mentor:", { userUSN, mentor });

    setIsLoading(true);

    try {
      const payload = { 
        usn: userUSN, 
        mentorID: mentor.mentorID || mentor.fullName 
      };
      
      console.log("📤 Sending request:", payload);

      const response = await fetch("http://localhost:5002/api/students/choose-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("📥 Response status:", response.status, response.ok);

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (response.ok && data.success) {
        setIsSelected(true);
        localStorage.setItem("selectedMentor", mentor.fullName);
        localStorage.setItem("selectedMentorID", data.mentor?.mentorID || mentor.mentorID);
        toast.success(data.message || `${mentor.fullName} is now your mentor!`);
      } else {
        console.error("❌ API returned error:", data);
        toast.error(data.message || "Failed to choose mentor");
      }
    } catch (error) {
      console.error("❌ Error choosing mentor:", error);
      toast.error(`Failed to choose mentor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(184, 134, 11, 0.15)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.6s ease",
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
          transition: 'left 1.2s ease',
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
          '&::before': {
            left: '100%'
          }
        }
      }}
    >
      {/* Mentor Name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
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
        }}
      >
        <Typography variant="h6" sx={{
          color: "#ffffff",
          fontWeight: "700",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
        }}>
          {mentor.fullName}
        </Typography>
      </Box>

      {/* Specialization */}
      <Box sx={{ padding: "20px 20px 10px 20px" }}>
        <Typography variant="body2" sx={{
          fontStyle: "italic",
          color: "#B8860B",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          fontWeight: "500"
        }}>
          Tech Stack: {mentor.tech}
        </Typography>
      </Box>

      <Divider sx={{ 
        margin: "10px 20px",
        borderColor: "rgba(184, 134, 11, 0.3)",
        '&::before, &::after': {
          borderColor: 'rgba(184, 134, 11, 0.3)'
        }
      }} />

      {/* Bio Section */}
      <Box sx={{ padding: "15px 20px", flexGrow: 1 }}>
        <Typography variant="body2" sx={{
          color: "#ffffff",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          lineHeight: 1.6,
          fontSize: "14px"
        }}>
          {mentor.bio}
        </Typography>
      </Box>

      <Divider sx={{ 
        margin: "10px 20px",
        borderColor: "rgba(184, 134, 11, 0.3)",
        '&::before, &::after': {
          borderColor: 'rgba(184, 134, 11, 0.3)'
        }
      }} />

      {/* Help With Section */}
      <Box sx={{ padding: "20px" }}>
        <Typography variant="body2" sx={{ 
          marginBottom: "15px",
          color: "#B8860B",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          fontWeight: "500"
        }}>
          Majors In: {mentor.selectedMajors}
        </Typography>
        <Button
          fullWidth
          onClick={handleChooseMentor}
          disabled={isSelected || isLoading}
          sx={{
            background: isSelected 
              ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)" 
              : isLoading 
                ? "linear-gradient(135deg, #888 0%, #999 100%)"
                : "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
            color: "#ffffff",
            fontWeight: "600",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "16px",
            '&:hover': {
              background: isSelected
                ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                : "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
              transform: isSelected ? "none" : "translateY(-2px)"
            },
            '&.Mui-disabled': {
              color: "#ffffff",
              opacity: 0.9
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {isSelected ? "✓ Selected as Mentor" : isLoading ? "Selecting..." : "Choose as Mentor"}
        </Button>
      </Box>
    </Card>
  );
};

export default MentorCard;
