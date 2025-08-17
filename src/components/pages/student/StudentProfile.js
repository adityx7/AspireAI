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
    <Box sx={{ p: 4, maxWidth: 700, margin: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>Student Profile & Dashboard</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Bio</Typography>
        <TextField fullWidth multiline rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Skills</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {skills.map((skill, idx) => <Chip key={idx} label={skill} />)}
        </Box>
        <TextField value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill" size="small" sx={{ mr: 1 }} />
        <Button onClick={handleAddSkill} variant="contained">Add</Button>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Interests</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {interests.map((interest, idx) => <Chip key={idx} label={interest} />)}
        </Box>
        <TextField value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="Add an interest" size="small" sx={{ mr: 1 }} />
        <Button onClick={handleAddInterest} variant="contained">Add</Button>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Achievements</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {achievements.map((ach, idx) => <Chip key={idx} label={ach} />)}
        </Box>
        <TextField value={achievementInput} onChange={e => setAchievementInput(e.target.value)} placeholder="Add an achievement" size="small" sx={{ mr: 1 }} />
        <Button onClick={handleAddAchievement} variant="contained">Add</Button>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>Upload Resume / Portfolio</Typography>
        <Input type="file" onChange={handleResumeUpload} />
        {resume && <Typography mt={1}>Uploaded: {resume.name}</Typography>}
      </Paper>
    </Box>
  );
}
