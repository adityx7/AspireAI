import { Box, Button } from '@mui/material';
import React from 'react';

function ButtonComponent({ onClick = () => {} }) {
  const navItems = [
    { label: 'Home', id: 1 },
    { label: 'Contact', id: 2 },
    { label: 'Login', id: 3 },
  ];

  return (
    <>
      <Box>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 6, ml: 'auto' }}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              sx={{
                backgroundColor: 'transparent',
                background: 'transparent',
                color: '#F8FAFC',
                fontWeight: 500,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textTransform: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                border: '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(184, 134, 11, 0.1)',
                  background: 'rgba(184, 134, 11, 0.1)',
                  color: '#DAA520',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)',
                  border: '1px solid rgba(184, 134, 11, 0.3)'
                },
              }}
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
