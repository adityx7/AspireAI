import React from "react";
import { Card, Typography, Divider, Button, Box } from "@mui/material";

const MentorCard = ({ mentor }) => {
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
          sx={{
            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
            color: "#ffffff",
            fontWeight: "600",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "16px",
            '&:hover': {
              background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
              boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
              transform: "translateY(-2px)"
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          Choose as Mentor
        </Button>
      </Box>
    </Card>
  );
};

export default MentorCard;
