import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ anchorEl, handleClose }) => {
  const navigate = useNavigate();

  const handleMenuItemClick = (route) => {
    if (route) {
      navigate(route);
    }
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background:
            "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
          mt: 1,
          "& .MuiMenuItem-root": {
            color: "#e2e8f0",
            fontFamily:
              "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            fontWeight: 500,
            py: 1.5,
            px: 3,
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            transition: "all 0.3s ease",
            "&:hover": {
              background:
                "linear-gradient(90deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)",
              color: "#ffd700",
              transform: "translateX(4px)",
            },
          },
        },
      }}
    >
      <MenuItem onClick={() => handleMenuItemClick("/settings")}>
        Settings
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick("/contact-us")}>
        Contact Us
      </MenuItem>
      <MenuItem onClick={() => handleMenuItemClick("/logout")}>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
