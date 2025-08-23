import React, { useState } from "react";
import { Box, Typography, TextField, Button, Chip, Input, Paper } from "@mui/material";

export default function StudentProfile() {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [resume, setResume] = useState(null);

  const handleAddSkill = () => {
    if (skillInput) setSkills([...skills, skillInput]);
    setSkillInput("");
  };
  const handleAddInterest = () => {
    if (interestInput) setInterests([...interests, interestInput]);
    setInterestInput("");
  };
  const handleAddAchievement = () => {
    if (achievementInput) setAchievements([...achievements, achievementInput]);
    setAchievementInput("");
  };
  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: 700, 
      margin: "auto", 
      mt: 4,
      minHeight: "100vh",
      background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
        animation: "shimmer 2.5s infinite linear",
        zIndex: 0,
        pointerEvents: "none",
      },
      "@keyframes shimmer": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100vw)" },
      }
    }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          mb={4}
          sx={{
            color: "#ffd700",
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            letterSpacing: "0.5px"
          }}
        >
          Student Profile & Dashboard
        </Typography>

        {/* Bio Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          backdropFilter: "blur(8px)"
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Bio
          </Typography>
          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="Tell us about yourself..." 
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: "rgba(15,23,42,0.5)",
                color: "#e2e8f0",
                borderRadius: 3,
                '& fieldset': { 
                  borderColor: "rgba(255,215,0,0.3)",
                },
                '&:hover fieldset': {
                  borderColor: "rgba(255,215,0,0.5)",
                },
                '&.Mui-focused fieldset': {
                  borderColor: "#ffd700",
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: "#cbd5e1",
                opacity: 0.7,
              }
            }}
          />
        </Paper>

        {/* Skills Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          backdropFilter: "blur(8px)"
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Skills
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {skills.map((skill, idx) => (
              <Chip 
                key={idx} 
                label={skill} 
                sx={{
                  background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(255,215,0,0.3)",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField 
              value={skillInput} 
              onChange={e => setSkillInput(e.target.value)} 
              placeholder="Add a skill" 
              size="small" 
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: "rgba(15,23,42,0.5)",
                  color: "#e2e8f0",
                  borderRadius: 3,
                  '& fieldset': { 
                    borderColor: "rgba(255,215,0,0.3)",
                  },
                  '&:hover fieldset': {
                    borderColor: "rgba(255,215,0,0.5)",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "#ffd700",
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                }
              }}
            />
            <Button 
              onClick={handleAddSkill} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* Interests Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          backdropFilter: "blur(8px)"
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Interests
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {interests.map((interest, idx) => (
              <Chip 
                key={idx} 
                label={interest} 
                sx={{
                  background: "linear-gradient(120deg, #1e3a8a 0%, #3b82f6 100%)",
                  color: "#e2e8f0",
                  fontWeight: 600,
                  border: "1px solid rgba(255,215,0,0.3)",
                  boxShadow: "0 2px 8px rgba(30,58,138,0.3)",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField 
              value={interestInput} 
              onChange={e => setInterestInput(e.target.value)} 
              placeholder="Add an interest" 
              size="small" 
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: "rgba(15,23,42,0.5)",
                  color: "#e2e8f0",
                  borderRadius: 3,
                  '& fieldset': { 
                    borderColor: "rgba(255,215,0,0.3)",
                  },
                  '&:hover fieldset': {
                    borderColor: "rgba(255,215,0,0.5)",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "#ffd700",
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                }
              }}
            />
            <Button 
              onClick={handleAddInterest} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* Achievements Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          backdropFilter: "blur(8px)"
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Achievements
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {achievements.map((ach, idx) => (
              <Chip 
                key={idx} 
                label={ach} 
                sx={{
                  background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                  color: "#1e3a8a",
                  fontWeight: 700,
                  border: "2px solid rgba(255,215,0,0.5)",
                  boxShadow: "0 2px 8px rgba(255,215,0,0.4)",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField 
              value={achievementInput} 
              onChange={e => setAchievementInput(e.target.value)} 
              placeholder="Add an achievement" 
              size="small" 
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: "rgba(15,23,42,0.5)",
                  color: "#e2e8f0",
                  borderRadius: 3,
                  '& fieldset': { 
                    borderColor: "rgba(255,215,0,0.3)",
                  },
                  '&:hover fieldset': {
                    borderColor: "rgba(255,215,0,0.5)",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "#ffd700",
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                }
              }}
            />
            <Button 
              onClick={handleAddAchievement} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* Resume Upload Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: 4,
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          backdropFilter: "blur(8px)"
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{
              color: "#ffd700",
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Upload Resume / Portfolio
          </Typography>
          <Input 
            type="file" 
            onChange={handleResumeUpload} 
            sx={{
              backgroundColor: "rgba(15,23,42,0.5)",
              borderRadius: 3,
              p: 1.5,
              width: "100%",
              color: "#e2e8f0",
              border: "1px solid rgba(255,215,0,0.3)",
              "&:hover": {
                borderColor: "rgba(255,215,0,0.5)",
              },
              "&:focus": {
                borderColor: "#ffd700",
              },
              "&::before": {
                display: "none"
              },
              "&::after": {
                display: "none"
              }
            }}
          />
          {resume && (
            <Typography 
              mt={2} 
              sx={{
                color: "#ffd700",
                fontWeight: 600,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                background: "rgba(255,215,0,0.1)",
                p: 1,
                borderRadius: 2,
                border: "1px solid rgba(255,215,0,0.3)"
              }}
            >
              ✅ Uploaded: {resume.name}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
