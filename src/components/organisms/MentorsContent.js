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
      {/* Static Section with Glassmorphism */}
      <Paper 
        elevation={0} 
        sx={{ 
          background: "rgba(255,255,255,0.18)",
          borderRadius: 6,
          p: 4, 
          mb: 3,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 24px 4px #ff8c0088",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#fff"
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center" sx={{ 
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          color: "#fff", 
          fontWeight: 700,
          textShadow: "0 2px 8px rgba(26,35,126,0.3)",
          mb: 2
        }}>
          Find Mentor
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ 
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          marginBottom: 3,
          color: "rgba(255,255,255,0.9)",
          fontSize: "1.1rem"
        }}>
          All of these mentors are ready to help! Select a mentor that you'd like to work with.
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            label="Search for Mentors..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              width: "100%", 
              maxWidth: "600px",
              background: "rgba(255,255,255,0.7)", 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' }
              },
              '& .MuiInputLabel-root': {
                color: "rgba(0,0,0,0.7)"
              }
            }}
          />
        </Box>
        
        <Divider sx={{ margin: "30px 0", borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Mentor Cards Section */}
        <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto", scrollbarWidth: "none" }}>
          <Grid container spacing={3} justifyContent="center">
            {filteredMentors.map((mentor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MentorCard mentor={mentor} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default MentorPage;
