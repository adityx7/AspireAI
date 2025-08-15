import { Menu, MenuItem } from '@mui/material';
import React from 'react';

function MenuComponent({ anchorEl, handleMenuClose, handleNavigate }) {
  const menuItems = [
    { label: "Home", id: 1 },
    { label: "Contact", id: 2 },
    { label: "Login", id: 3 },
    { label: "Find a Mentor", id: 4 },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {menuItems.map((menuItem) => (
        <MenuItem
          key={menuItem.id}
          onClick={() => {
            handleNavigate(menuItem.id);
            handleMenuClose();
          }}
        >
          {menuItem.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default MenuComponent;
