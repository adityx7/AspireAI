import React, { useState } from "react";
import { Box, Typography, TextField, Button, Chip, Input, Paper } from "@mui/material";
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Updated background style to match navy blue and gold theme
const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
    background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
    position: "relative",
    overflow: "hidden",
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
};

export default function MentorProfile() {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [resume, setResume] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date && !availability.includes(date.toDateString())) {
      setAvailability([...availability, date.toDateString()]);
    }
  };

  return (
    <Box sx={shimmerBackground}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        maxWidth: "100%", 
        width: "100%",
        margin: "0 auto", 
        pt: 4,
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
        position: "relative",
        zIndex: 1
      }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          mb={4}
          sx={{ 
            color: "#ffd700",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            textAlign: "center",
            letterSpacing: "0.5px"
          }}
        >
          Mentor Profile & Dashboard
        </Typography>

        {/* Bio Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
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
              width: "100%",
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
              '& .MuiInputBase-input': {
                color: "#e2e8f0",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              },
              '& .MuiInputBase-input::placeholder': {
                color: "#cbd5e1",
                opacity: 0.7,
              },
            }}
          />
        </Paper>

        {/* Skills Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
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
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(255,215,0,0.3)",
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <TextField 
              value={skillInput} 
              onChange={e => setSkillInput(e.target.value)} 
              placeholder="Add a skill" 
              size="small" 
              sx={{ 
                flex: 1,
                minWidth: "200px",
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
                '& .MuiInputBase-input': {
                  color: "#e2e8f0",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                },
                '& .MuiInputBase-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                },
              }} 
            />
            <Button 
              onClick={handleAddSkill} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
                borderRadius: 3,
                flexShrink: 0,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                '&:hover': {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
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
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  fontWeight: 600,
                  border: "1px solid rgba(255,215,0,0.3)",
                  boxShadow: "0 2px 8px rgba(30,58,138,0.3)",
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <TextField 
              value={interestInput} 
              onChange={e => setInterestInput(e.target.value)} 
              placeholder="Add an interest" 
              size="small" 
              sx={{ 
                flex: 1,
                minWidth: "200px",
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
                '& .MuiInputBase-input': {
                  color: "#e2e8f0",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                },
                '& .MuiInputBase-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                },
              }} 
            />
            <Button 
              onClick={handleAddInterest} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
                borderRadius: 3,
                flexShrink: 0,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                '&:hover': {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
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
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  fontWeight: 600,
                  border: "2px solid rgba(255,215,0,0.5)",
                  boxShadow: "0 2px 8px rgba(255,215,0,0.4)",
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <TextField 
              value={achievementInput} 
              onChange={e => setAchievementInput(e.target.value)} 
              placeholder="Add an achievement" 
              size="small" 
              sx={{ 
                flex: 1,
                minWidth: "200px",
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
                '& .MuiInputBase-input': {
                  color: "#e2e8f0",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                },
                '& .MuiInputBase-input::placeholder': {
                  color: "#cbd5e1",
                  opacity: 0.7,
                },
              }} 
            />
            <Button 
              onClick={handleAddAchievement} 
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
                borderRadius: 3,
                flexShrink: 0,
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                '&:hover': {
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                },
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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
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
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              '&:hover': {
                borderColor: "rgba(255,215,0,0.5)",
              },
              '&:focus': {
                borderColor: "#ffd700",
              },
              '&::before': {
                display: "none"
              },
              '&::after': {
                display: "none"
              }
            }}
          />
          {resume && (
            <Typography 
              mt={2}
              sx={{ 
                color: "#ffd700",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
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

        {/* Availability Calendar Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,215,0,0.3)",
          boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            mb={2}
            sx={{ 
              color: "#ffd700",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              fontWeight: 600,
              borderBottom: "2px solid rgba(255,215,0,0.6)",
              pb: 1
            }}
          >
            Availability Calendar
          </Typography>
          <Box sx={{ 
            background: "rgba(15,23,42,0.5)",
            borderRadius: 3,
            p: 2,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            border: "1px solid rgba(255,215,0,0.3)",
            '& .MuiPickersCalendarHeader-root': {
              color: "#e2e8f0",
            },
            '& .MuiPickersCalendarHeader-label': {
              color: "#ffd700",
              fontWeight: 600,
            },
            '& .MuiDayCalendar-weekDayLabel': {
              color: "#cbd5e1",
              fontWeight: 600,
            },
            '& .MuiPickersDay-root': {
              color: "#e2e8f0",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              '&:hover': {
                backgroundColor: "rgba(255,215,0,0.2)",
              },
              '&.Mui-selected': {
                backgroundColor: "#ffd700",
                color: "#1e3a8a",
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: "#ffed4e",
                },
              },
            },
            '& .MuiPickersArrowSwitcher-button': {
              color: "#ffd700",
              '&:hover': {
                backgroundColor: "rgba(255,215,0,0.2)",
              },
            },
            '& .MuiDateCalendar-root': {
              width: "100%",
              maxWidth: "100%",
            },
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar value={selectedDate} onChange={handleDateSelect} />
            </LocalizationProvider>
          </Box>
          <Box mt={2}>
            <Typography 
              variant="body2"
              sx={{ 
                color: "#ffd700",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
                mb: 1
              }}
            >
              Selected Dates:
            </Typography>
            {availability.map((date, idx) => (
              <Chip 
                key={idx} 
                label={date} 
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                  color: "#1e3a8a",
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(255,215,0,0.3)",
                }} 
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
