import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Divider, Grid, Paper } from "@mui/material";
import MentorCard from "../molecules/Cards";

const MentorPage = () => {
  const [search, setSearch] = useState("");
  const [mentors, setMentors] = useState([]);

  // Fetch mentor details from backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/mentor/details");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        // Extract only necessary fields
        const formattedMentors = data.map(mentor => ({
          fullName: mentor.fullName,
          selectedMajors: mentor.selectedMajors,
          bio: mentor.bio,
          tech: mentor.tech,
        }));

        setMentors(formattedMentors);
      } catch (error) {
        console.error("❌ Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  // Filter mentors based on search input
  const filteredMentors = mentors.filter((mentor) =>
    mentor.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Static Section with Navy Blue & Gold Glassmorphism */}
      <Paper 
        elevation={8} 
        sx={{ 
          background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
          borderRadius: "24px",
          p: 4, 
          mb: 3,
          boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,215,0,0.3)",
          color: "#e2e8f0",
          "& .MuiTextField-root": {
            "& .MuiOutlinedInput-root": {
              background: "rgba(15,23,42,0.5)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: "rgba(255,215,0,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,215,0,0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffd700",
                borderWidth: "2px",
              },
              "& input": {
                color: "#e2e8f0",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              },
              "& input::placeholder": {
                color: "#cbd5e1",
                opacity: 0.7,
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,215,0,0.8)",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              "&.Mui-focused": {
                color: "#ffd700",
              },
            },
          },
          "& .MuiTypography-root": {
            color: "#e2e8f0",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          },
          "& .MuiDivider-root": {
            backgroundColor: "rgba(255,215,0,0.3)",
          },
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center" sx={{ 
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          color: "#ffd700", 
          fontWeight: 700,
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          letterSpacing: "0.5px",
          mb: 2
        }}>
          🎓 Find Your Mentor
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ 
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          marginBottom: 3,
          color: "#cbd5e1",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          maxWidth: "800px",
          margin: "0 auto 24px auto"
        }}>
          All of these mentors are ready to help! Select a mentor that you'd like to work with to achieve your career goals.
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <TextField
            label="Search for Mentors..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a mentor's name..."
            sx={{ 
              width: "100%", 
              maxWidth: "600px"
            }}
          />
        </Box>
        
        <Divider sx={{ margin: "30px 0" }} />

        {/* Mentor Cards Section */}
        <Box 
          sx={{ 
            maxHeight: "calc(100vh - 350px)", 
            overflowY: "auto", 
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(15,23,42,0.3)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "linear-gradient(180deg, #ffd700 0%, #ffed4e 100%)",
              borderRadius: "4px",
              "&:hover": {
                background: "linear-gradient(180deg, #ffed4e 0%, #ffd700 100%)",
              },
            },
            pr: 1
          }}
        >
          {filteredMentors.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {filteredMentors.map((mentor, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MentorCard mentor={mentor} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              textAlign: "center", 
              py: 8,
              background: "rgba(15,23,42,0.3)",
              borderRadius: "16px",
              border: "1px solid rgba(255,215,0,0.2)"
            }}>
              <Typography variant="h6" sx={{ 
                color: "#ffd700",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontWeight: 600,
                mb: 1
              }}>
                🔍 No mentors found
              </Typography>
              <Typography variant="body2" sx={{ 
                color: "#cbd5e1",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
              }}>
                Try adjusting your search terms
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MentorPage;
