import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Divider, Grid } from "@mui/material";
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
          mentorID: mentor.mentorID,
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
      {/* Static Section */}
      <Box sx={{ 
        position: "sticky", 
        top: 0, 
        background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(184, 134, 11, 0.15)",
        borderRadius: "20px",
        zIndex: 1, 
        padding: "30px 20px",
        margin: "0 20px 30px 20px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        <Typography variant="h4" component="h1" textAlign="center" sx={{
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          fontWeight: "700",
          color: "#ffffff",
          mb: 2
        }}>
          Find Mentor
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ 
          marginBottom: "30px",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          color: "#B8860B",
          fontWeight: "500",
          lineHeight: 1.6
        }}>
          All of these mentors are ready to help! Select a mentor that you'd like to work with.
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <TextField
            placeholder="Search for Mentors..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              width: "100%", 
              maxWidth: "600px",
              '& .MuiOutlinedInput-root': {
                background: "rgba(26, 43, 76, 0.3)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                '& fieldset': {
                  borderColor: 'rgba(184, 134, 11, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(184, 134, 11, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#B8860B',
                },
                '& input': {
                  color: '#ffffff',
                  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: "500"
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
          />
        </Box>
      </Box>

      <Divider sx={{ 
        marginBottom: "30px",
        margin: "0 20px 30px 20px",
        borderColor: "rgba(184, 134, 11, 0.3)",
        '&::before, &::after': {
          borderColor: 'rgba(184, 134, 11, 0.3)'
        }
      }} />

      {/* Mentor Cards Section */}
      <Box sx={{ 
        maxHeight: "calc(100vh - 350px)", 
        overflowY: "auto", 
        scrollbarWidth: "none",
        padding: "0 20px",
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <Grid container spacing={3} justifyContent="center" mb={'40px'}>
          {filteredMentors.map((mentor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MentorCard mentor={mentor} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MentorPage;
