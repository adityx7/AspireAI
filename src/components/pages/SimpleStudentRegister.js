import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  Paper,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Person, Email, Lock, School, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const shimmerBackground = {
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)",
    position: "relative",
    overflow: "hidden",
    color: "#F8FAFC",
    // Enhanced animation styles
    '& .fade-in-up': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(60px)'
      }
    },
    '& .scale-in': {
      opacity: 1,
      transform: 'scale(1) rotateZ(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0.3,
        transform: 'scale(0.7) rotateZ(-5deg)'
      }
    },
    '& .floating-element': {
      animation: 'floating 6s ease-in-out infinite',
      transition: 'transform 0.3s ease-out'
    },
    '@keyframes floating': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '25%': { transform: 'translateY(-10px) rotate(1deg)' },
      '50%': { transform: 'translateY(-20px) rotate(0deg)' },
      '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' }
    }
};

const shimmerOverlay = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, rgba(184, 134, 11, 0.1) 0%, rgba(26, 43, 76, 0.2) 100%)",
    animation: "shimmer 3s infinite linear",
    zIndex: 0,
    pointerEvents: "none",
};

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    usn: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations on page load
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.fade-in-up, .scale-in');
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, index * 200);
      });
    }, 300);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/api/student/register', {
        fullName: formData.fullName,
        usn: formData.usn,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={shimmerBackground}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '120%',
        background: 'radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 43, 76, 0.2) 0%, transparent 50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Floating Decorative Elements */}
      <Box className="floating-element" sx={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1), rgba(184, 134, 11, 0.2))',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        filter: 'blur(1px)'
      }} />
      
      <Box className="floating-element" sx={{
        position: 'fixed',
        top: '60%',
        right: '8%',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
        borderRadius: '50%',
        zIndex: 1,
        pointerEvents: 'none',
        filter: 'blur(1px)',
        animationDelay: '2s'
      }} />

      <Box sx={{ ...shimmerOverlay }} />
      
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        p: 2
      }}>
        <Paper 
          className="scale-in"
          sx={{
            p: 4,
            maxWidth: 500,
            width: '100%',
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
            backdropFilter: "blur(25px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
            border: "1px solid rgba(184, 134, 11, 0.15)",
            color: "#F8FAFC",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.6s ease",
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.08), transparent)',
              transition: 'left 1.2s ease',
            },
            '&:hover': {
              transform: 'translateY(-2px) scale(1.01)',
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.12)",
              '&::before': {
                left: '100%'
              }
            }
          }}
        >
          <Box className="fade-in-up" sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))",
                fontSize: { xs: "1.8rem", md: "2.2rem" }
              }}
            >
              Find Your Mentor
            </Typography>
            <Typography variant="body1" sx={{ color: '#F8FAFC', opacity: 0.8 }}>
              Join AspireAI and connect with experienced mentors
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} className="fade-in-up">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} className="fade-in-up">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              className="fade-in-up"
              fullWidth
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#B8860B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  background: "rgba(248, 250, 252, 0.9)",
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: "rgba(248, 250, 252, 0.95)",
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                  },
                  '&.Mui-focused': {
                    background: "rgba(248, 250, 252, 1)",
                    boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.3)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.5)',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#B8860B',
                }
              }}
            />

            <TextField
              className="fade-in-up"
              fullWidth
              placeholder="e.g., 1BG21CS001"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <School sx={{ color: '#B8860B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  background: "rgba(248, 250, 252, 0.9)",
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: "rgba(248, 250, 252, 0.95)",
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                  },
                  '&.Mui-focused': {
                    background: "rgba(248, 250, 252, 1)",
                    boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.3)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.5)',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#B8860B',
                }
              }}
            />

            <TextField
              className="fade-in-up"
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#B8860B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  background: "rgba(248, 250, 252, 0.9)",
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: "rgba(248, 250, 252, 0.95)",
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                  },
                  '&.Mui-focused': {
                    background: "rgba(248, 250, 252, 1)",
                    boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  opacity: 1
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.3)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(184, 134, 11, 0.5)',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#B8860B',
                }
              }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  className="fade-in-up"
                  fullWidth
                  placeholder="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#B8860B' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#B8860B' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      background: "rgba(248, 250, 252, 0.9)",
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: "rgba(248, 250, 252, 0.95)",
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                      },
                      '&.Mui-focused': {
                        background: "rgba(248, 250, 252, 1)",
                        boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(0, 0, 0, 0.6)',
                      opacity: 1
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(184, 134, 11, 0.3)',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(184, 134, 11, 0.5)',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#B8860B',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="fade-in-up"
                  fullWidth
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#B8860B' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#B8860B' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      background: "rgba(248, 250, 252, 0.9)",
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: "rgba(248, 250, 252, 0.95)",
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.2)'
                      },
                      '&.Mui-focused': {
                        background: "rgba(248, 250, 252, 1)",
                        boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(0, 0, 0, 0.6)',
                      opacity: 1
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(184, 134, 11, 0.3)',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(184, 134, 11, 0.5)',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#B8860B',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Button
              className="fade-in-up"
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8B6914 0%, #B8860B 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(184, 134, 11, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(184, 134, 11, 0.5)',
                },
                mb: 2,
                mt: 2
              }}
            >
              {loading ? 'Registering...' : 'REGISTER AS STUDENT'}
            </Button>
          </form>

          <Box className="fade-in-up" sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#F8FAFC', opacity: 0.8 }}>
              Already have an account?{' '}
              <Button 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#B8860B', 
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: 'transparent',
                    color: '#DAA520'
                  }
                }}
              >
                Sign in here
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}