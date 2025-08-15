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
                backgroundColor: item.label === 'Find a Mentor' ? 'primary.main' : 'inherit',
                color: item.label === 'Find a Mentor' ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: item.label === 'Find a Mentor' ? 'primary.dark' : 'inherit',
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
