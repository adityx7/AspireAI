import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ButtonComponent from '../atoms/Button';
import MenuComponent from '../atoms/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isMentorLoginPage = location.pathname === '/mentor-login';
  const isRegisterStudent = location.pathname === '/student/register';
  const isRegisterMentor = location.pathname === '/mentor/register';
  const isDashbaord = location.pathname === '/dashboard';
  const isMentors = location.pathname === '/mentors';
  const isDocuments = location.pathname === '/documents';
  const isSettings = location.pathname === '/settings'
  const isProfile = location.pathname === '/profile'
  const isContactUs = location.pathname === '/contact-us';
  const isMentormain = location.pathname === '/dashboard-mentor';
  const isMentorSettings = location.pathname === '/settings-mentor';
  const isMentorContact = location.pathname === '/contact-mentor'
  const isProfileMentor = location.pathname === '/profile-mentor'

  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (id) => {
    switch (id) {
      case 1: navigate("/"); break;
      case 2: navigate("/contact"); break;
      case 3: navigate("/login"); break;
      case 4: navigate("/student/register"); break;
      default: navigate("/"); break;
    }
  }

  return (<>{!isLoginPage && !isRegisterStudent && !isRegisterMentor &&
    !isDashbaord && !isMentormain && !isMentors && !isDocuments &&
    !isContactUs && !isSettings && !isMentorLoginPage && !isMentorContact && 
    !isMentorSettings && !isProfile && !isProfileMentor &&
    <AppBar 
      position="sticky" 
      sx={{ 
        background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#e2e8f0", 
        boxShadow: "0px 4px 16px rgba(255,215,0,0.2)", 
        border: "1px solid rgba(255,215,0,0.3)",
        borderTop: "none",
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
      }} 
    >
      <Toolbar sx={{ mt: "20px" }}>
        {/* Menu Icon - Visible only on smaller screens */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls={anchorEl ? 'mobile-menu' : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{
              color: "#ffd700",
              '&:hover': {
                backgroundColor: "rgba(255,215,0,0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease"
            }}
          >
            <MenuIcon />
          </IconButton>

          <MenuComponent
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleNavigate={handleNavigate}
          />

        </Box>

        {/* Icon and Logo/Text */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Updated icon with gold color */}
          <AcUnitIcon sx={{ 
            fontSize: 30, 
            mr: 1, 
            color: "#ffd700",
            filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.3))",
            transition: "all 0.3s ease",
            '&:hover': {
              transform: "rotate(15deg) scale(1.1)",
              filter: "drop-shadow(0 4px 12px rgba(255,215,0,0.5))",
            }
          }} />
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              display: "flex",
              color: "#ffd700",
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              '&:hover': {
                textShadow: "0 0 12px rgba(255,215,0,0.6)",
                transform: "scale(1.02)",
              }
            }}
          >
            AspireAI
          </Typography>
        </Box>

        {/* Navbar Buttons - Visible only on larger screens */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 6, ml: 'auto' }}>
          <ButtonComponent onClick={handleNavigate} />
        </Box>
      </Toolbar>
    </AppBar>}
  </>
  );
}