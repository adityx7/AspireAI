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
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.95) 0%, rgba(26, 43, 76, 0.98) 100%)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(184, 134, 11, 0.15)',
          borderRadius: 3,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          mt: 1
        }
      }}
    >
      {menuItems.map((menuItem) => (
        <MenuItem
          key={menuItem.id}
          onClick={() => {
            handleNavigate(menuItem.id);
            handleMenuClose();
          }}
          sx={{
            color: '#F8FAFC',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: menuItem.label === 'Find a Mentor' ? 700 : 500,
            background: menuItem.label === 'Find a Mentor' ? 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' : 'transparent',
            borderRadius: menuItem.label === 'Find a Mentor' ? 2 : 0,
            margin: menuItem.label === 'Find a Mentor' ? '4px 8px' : '0 8px',
            '&:hover': {
              backgroundColor: menuItem.label === 'Find a Mentor' ? undefined : 'rgba(184, 134, 11, 0.1)',
              background: menuItem.label === 'Find a Mentor' ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)' : 'rgba(184, 134, 11, 0.1)',
              color: menuItem.label === 'Find a Mentor' ? '#FFFFFF' : '#DAA520'
            }
          }}
        >
          {menuItem.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default MenuComponent;
