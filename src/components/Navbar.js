import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import logo from "./path-to-your-logo.svg"; // Update the path to your logo

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src={logo} alt="AspireAI Logo" style={{ height: "40px" }} />
          <Typography variant="h6" sx={{ color: "inherit", textDecoration: "none" }}>
            AspireAI
          </Typography>
        </Link>
      </nav>
    </header>
  );
};

export default Header;