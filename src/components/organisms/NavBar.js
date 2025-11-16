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
    <AppBar position="sticky" sx={{ 
      background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.95) 0%, rgba(26, 43, 76, 0.98) 100%) !important',
      backgroundColor: 'rgba(10, 25, 47, 0.95) !important',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(184, 134, 11, 0.15)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)',
      color: '#F8FAFC',
      borderBottom: '1px solid rgba(184, 134, 11, 0.2)'
    }} >
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
              color: '#F8FAFC',
              '&:hover': {
                backgroundColor: 'rgba(184, 134, 11, 0.1)',
                color: '#DAA520'
              }
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
          {/* Added HomeIcon here */}
          <AcUnitIcon sx={{ 
            fontSize: 30, 
            mr: 1,
            color: '#DAA520',
            filter: 'drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3))'
          }} />
          <Typography variant="h6" sx={{ 
            flexGrow: 1, 
            display: "flex",
            color: '#F8FAFC',
            fontWeight: 700,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            background: 'linear-gradient(135deg, #F8FAFC 0%, #DAA520 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
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