import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Updated import

const UserMenu = ({ anchorEl, handleClose }) => {
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const handleMenuItemClick = (route) => {
    if (route) {
      navigate(route); // Navigate to the specified route
    }
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
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
