import React from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search for Mentor or Goals..."
      InputProps={{
        startAdornment: <SearchIcon sx={{ mr: 1 }} />,
      }}
      sx={{
        backgroundColor: "#fff", // Background color of the search bar
        borderRadius: "8px", // Border radius to make corners rounded
        
        width: "300px", // Set a specific width (optional)
      }}
    />
  );
};

export default SearchBar;
