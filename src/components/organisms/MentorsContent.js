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
      <Box sx={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1, padding: "20px 0" }}>
        <Typography variant="h4" component="h1" textAlign="center" fontFamily="Courier">
          Find Mentor
        </Typography>
        <Typography variant="body1" fontFamily="Bookman Old Style" textAlign="center" sx={{ marginBottom: "20px" }}>
          All of these mentors are ready to help! Select a mentor that you'd like to work with.
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <TextField
            label="Search for Mentors..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "100%", maxWidth: "600px" }}
          />
        </Box>
      </Box>

      <Divider sx={{ marginBottom: "30px" }} />

      {/* Mentor Cards Section */}
      <Box sx={{ maxHeight: "calc(100vh - 250px)", overflowY: "scroll", scrollbarWidth: "none" }}>
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
