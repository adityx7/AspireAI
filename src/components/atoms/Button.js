import { Box, Button } from '@mui/material';
import React from 'react';

function ButtonComponent({ onClick = () => {} }) {
  const navItems = [
    { label: 'Home', id: 1 },
    { label: 'Contact', id: 2 },
    { label: 'Login', id: 3 },
    { label: 'Find a Mentor', id: 4 },
  ];

  return (
    <>
      <Box>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 6, ml: 'auto' }}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              sx={{
                backgroundColor: item.label === 'Find a Mentor' ? 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' : 'transparent',
                background: item.label === 'Find a Mentor' ? 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' : 'transparent',
                color: item.label === 'Find a Mentor' ? '#FFFFFF' : '#F8FAFC',
                fontWeight: item.label === 'Find a Mentor' ? 700 : 500,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textTransform: 'none',
                borderRadius: item.label === 'Find a Mentor' ? '12px' : '8px',
                padding: '8px 20px',
                border: item.label === 'Find a Mentor' ? 'none' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:hover': {
                  backgroundColor: item.label === 'Find a Mentor' ? undefined : 'rgba(184, 134, 11, 0.1)',
                  background: item.label === 'Find a Mentor' ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)' : 'rgba(184, 134, 11, 0.1)',
                  color: item.label === 'Find a Mentor' ? '#FFFFFF' : '#DAA520',
                  transform: 'translateY(-1px)',
                  boxShadow: item.label === 'Find a Mentor' ? '0 8px 25px rgba(184, 134, 11, 0.3)' : '0 4px 15px rgba(184, 134, 11, 0.2)',
                  border: item.label === 'Find a Mentor' ? 'none' : '1px solid rgba(184, 134, 11, 0.3)'
                },
              }}
              // Pass an inline function that calls onClick with item.id
              onClick={() => onClick(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default ButtonComponent;
