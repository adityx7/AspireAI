import React from "react";
import { Typography, Box } from "@mui/material";

const AnimatedText = ({ text, variant, sx }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      ...sx,
    }}
  >
    {text.split("").map((letter, index) => (
      <Typography
        key={index}
        variant={variant || "h2"}
        component="span"
        sx={{
          display: "inline-block",
          animation: `fadeIn 0.1s linear ${index * 0.1}s forwards`,
          opacity: 0,
          "@keyframes fadeIn": {
            to: { opacity: 1, transform: "translateY(0)" },
          },
          transform: "translateY(10px)",
          fontFamily: "Courier",
          fontWeight: "bold"
        }}
      >
        {letter === " " ? "\u00A0" : letter} {/* Preserve spaces */}
      </Typography>
    ))}
  </Box>
);
export default AnimatedText;