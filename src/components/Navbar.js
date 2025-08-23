import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "./path-to-your-logo.svg"; // Update the path to your logo

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  const authItems = [
    { label: "Student Login", path: "/login" },
    { label: "Mentor Login", path: "/mentor/login" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,215,0,0.3)",
        boxShadow: "0 4px 16px rgba(255,215,0,0.1)",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo and Brand */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexGrow: { xs: 1, md: 0 },
            mr: { md: 4 }
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
              border: "2px solid rgba(255,215,0,0.5)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1e3a8a",
                fontWeight: 800,
                fontSize: "1.2rem",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              A
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: "#ffd700",
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            AspireAI
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 4 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: "#e2e8f0",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    "&:hover": {
                      backgroundColor: "rgba(255,215,0,0.1)",
                      color: "#ffd700",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {authItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  variant={item.label === "Student Login" ? "outlined" : "contained"}
                  sx={{
                    ...(item.label === "Student Login"
                      ? {
                          borderColor: "rgba(255,215,0,0.5)",
                          color: "#ffd700",
                          fontWeight: 600,
                          borderWidth: "2px",
                          "&:hover": {
                            borderColor: "#ffd700",
                            backgroundColor: "rgba(255,215,0,0.1)",
                            borderWidth: "2px",
                          },
                        }
                      : {
                          background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                          color: "#1e3a8a",
                          fontWeight: 700,
                          boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                          "&:hover": {
                            background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                            boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                            transform: "translateY(-1px)",
                          },
                        }),
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#ffd700",
              "&:hover": {
                backgroundColor: "rgba(255,215,0,0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,215,0,0.3)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffd700",
                fontWeight: 700,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: "#ffd700",
                "&:hover": {
                  backgroundColor: "rgba(255,215,0,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ px: 2, py: 1 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.label}
              button
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 3,
                mb: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,215,0,0.1)",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "#e2e8f0",
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ px: 2, py: 2, borderTop: "1px solid rgba(255,215,0,0.3)" }}>
          {authItems.map((item, index) => (
            <Button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              variant={index === 0 ? "outlined" : "contained"}
              fullWidth
              sx={{
                mb: index === 0 ? 2 : 0,
                ...(index === 0
                  ? {
                      borderColor: "rgba(255,215,0,0.5)",
                      color: "#ffd700",
                      fontWeight: 600,
                      borderWidth: "2px",
                      "&:hover": {
                        borderColor: "#ffd700",
                        backgroundColor: "rgba(255,215,0,0.1)",
                        borderWidth: "2px",
                      },
                    }
                  : {
                      background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                      color: "#1e3a8a",
                      fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                        boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                      },
                    }),
                textTransform: "none",
                py: 1.5,
                borderRadius: 3,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;