import React, { useEffect, useRef } from "react";
import { Box, Grid, Typography, Button, Link } from "@mui/material";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TextsmsRoundedIcon from "@mui/icons-material/TextsmsRounded";
import manImage from "../../assets/man.png";
import girlImage from "../../assets/girl.png";
import dotImage from "../../assets/Dot.png";
import chatImage from "../../assets/Chat.png";
import pplImage from "../../assets/pplImage.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const chatRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Advanced scroll-triggered animations with staggered timing
    const animateOnScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Parallax background movement
      const bgElements = document.querySelectorAll('.parallax-bg');
      bgElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrollTop * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      // Floating elements animation
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((el, index) => {
        const speed = 1 + (index * 0.3);
        const yPos = Math.sin(scrollTop * 0.01 + index) * speed * 10;
        const rotation = scrollTop * 0.1 * (index % 2 === 0 ? 1 : -1);
        el.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
      });

      // Progressive reveal based on scroll position
      const revealElements = document.querySelectorAll('.progressive-reveal');
      revealElements.forEach(el => {
        const elementTop = el.offsetTop;
        const elementHeight = el.offsetHeight;
        const revealPoint = 150;
        
        if (scrollTop + windowHeight - revealPoint > elementTop && scrollTop < elementTop + elementHeight) {
          el.classList.add('revealed');
        }
      });
    };

    // Immediately show hero content with staggered animations
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.classList.add('animate-in');
        
        // Staggered animation for hero children
        const heroChildren = heroRef.current.querySelectorAll('.stagger-child');
        heroChildren.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('animate-in');
          }, index * 200);
        });
      }
    }, 300);

    // Enhanced Intersection Observer with multiple thresholds
    const observerOptions = {
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const intersectionRatio = entry.intersectionRatio;
        
        if (entry.isIntersecting) {
          // Add animations based on intersection ratio
          if (intersectionRatio > 0.1) {
            element.classList.add('animate-in');
            
            // Staggered animations for child elements
            const children = element.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-in');
              }, index * 150);
            });
          }
          
          if (intersectionRatio > 0.5) {
            element.classList.add('fully-visible');
          }
        } else {
          // Optional: Remove animations when elements leave viewport (for repeat animations)
          if (intersectionRatio === 0) {
            element.classList.remove('fully-visible');
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = [heroRef, stepsRef, chatRef, ctaRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
        // Add progressive reveal class
        ref.current.classList.add('progressive-reveal');
        
        // Force initial animation for chat section to ensure image shows
        if (ref === chatRef) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.classList.add('animate-in');
              const childElements = ref.current.querySelectorAll('.stagger-child, .scale-in');
              childElements.forEach(el => el.classList.add('animate-in'));
            }
          }, 1000);
        }
      }
    });

    // Enhanced parallax mouse movement
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      // Animate floating shapes with mouse tracking
      const floatingShapes = document.querySelectorAll('.mouse-float');
      floatingShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        const x = xPercent * speed * 20;
        const y = yPercent * speed * 20;
        const rotation = (xPercent + yPercent) * speed * 5;
        
        shape.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${1 + Math.abs(xPercent) * 0.1})`;
      });

      // Subtle tilt effect on cards
      const tiltCards = document.querySelectorAll('.tilt-card');
      tiltCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const deltaX = (clientX - cardCenterX) / (rect.width / 2);
        const deltaY = (clientY - cardCenterY) / (rect.height / 2);
        
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          const rotateX = deltaY * 10;
          const rotateY = deltaX * 10;
          card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      });
    };

    // Scroll-based animations
    window.addEventListener('scroll', animateOnScroll);
    document.addEventListener('mousemove', handleMouseMove);

    // Initial animation call
    animateOnScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', animateOnScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
  <Box sx={{ 
    minHeight: "100vh", 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
    background: "linear-gradient(135deg, #0A192F 0%, #1A2B4C 50%, #0A192F 100%)", 
    position: "relative", 
    color: "#F8FAFC",
    overflow: "hidden",
    // Enhanced scroll-triggered and interactive animation styles
    '& .fade-in-up': {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(60px)'
      }
    },
    '& .fade-in-left': {
      opacity: 1,
      transform: 'translateX(0) rotateY(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateX(-80px) rotateY(-15deg)'
      }
    },
    '& .fade-in-right': {
      opacity: 1,
      transform: 'translateX(0) rotateY(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateX(80px) rotateY(15deg)'
      }
    },
    '& .scale-in': {
      opacity: 1,
      transform: 'scale(1) rotateZ(0deg)',
      transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0.3,
        transform: 'scale(0.7) rotateZ(-5deg)'
      },
      '&.animate-in': {
        opacity: 1,
        transform: 'scale(1) rotateZ(0deg)'
      }
    },
    '& .slide-in-bottom': {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
      transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(100px) scale(0.9)'
      }
    },
    '& .rotate-in': {
      opacity: 1,
      transform: 'rotate(0deg) scale(1)',
      transition: 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'rotate(180deg) scale(0.5)'
      }
    },
    '& .bounce-in': {
      opacity: 1,
      transform: 'scale(1)',
      transition: 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'scale(0.3)'
      }
    },
    '& .stagger-child': {
      transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
      '&:not(.animate-in)': {
        opacity: 0,
        transform: 'translateY(30px)'
      },
      '&.animate-in': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    '& .progressive-reveal': {
      '&:not(.revealed)': {
        '& > *': {
          opacity: 0.7,
          transform: 'translateY(20px)'
        }
      },
      '&.revealed': {
        '& > *': {
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.8s ease-out'
        }
      }
    },
    '& .floating-element': {
      animation: 'floating 6s ease-in-out infinite',
      transition: 'transform 0.3s ease-out'
    },
    '& .mouse-float': {
      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      willChange: 'transform'
    },
    '& .tilt-card': {
      transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      transformStyle: 'preserve-3d',
      willChange: 'transform'
    },
    '& .parallax-bg': {
      willChange: 'transform'
    },
    '& .pulse-glow': {
      animation: 'pulseGlow 3s ease-in-out infinite alternate'
    },
    '& .text-shimmer': {
      backgroundSize: '200% 100%',
      animation: 'shimmer 3s ease-in-out infinite'
    },
    // Keyframe animations
    '@keyframes floating': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '25%': { transform: 'translateY(-10px) rotate(1deg)' },
      '50%': { transform: 'translateY(-20px) rotate(0deg)' },
      '75%': { transform: 'translateY(-10px) rotate(-1deg)' }
    },
    '@keyframes pulseGlow': {
      '0%': { 
        boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)',
        transform: 'scale(1)'
      },
      '100%': { 
        boxShadow: '0 0 40px rgba(184, 134, 11, 0.6)',
        transform: 'scale(1.02)'
      }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' }
    },
    '@keyframes gradientShift': {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' }
    }
  }}>
    {/* Animated Background Elements */}
    <Box className="parallax-bg" sx={{
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
    <Box className="floating-element mouse-float" sx={{
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
    
    <Box className="floating-element mouse-float" sx={{
      position: 'fixed',
      top: '60%',
      right: '8%',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.2), rgba(26, 43, 76, 0.3))',
      borderRadius: '50%',
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'blur(1px)'
    }} />
    
    <Box className="floating-element mouse-float" sx={{
      position: 'fixed',
      top: '30%',
      right: '15%',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.05), rgba(184, 134, 11, 0.1))',
      borderRadius: '30%',
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'blur(2px)',
      animationDelay: '2s'
    }} />
    
    <Box className="floating-element mouse-float" sx={{
      position: 'fixed',
      bottom: '20%',
      left: '10%',
      width: '50px',
      height: '50px',
      background: 'linear-gradient(45deg, rgba(26, 43, 76, 0.15), rgba(26, 43, 76, 0.25))',
      borderRadius: '50%',
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'blur(1.5px)',
      animationDelay: '4s'
    }} />

      {/* Hero Section */}
      <Box
        ref={heroRef}
        className="progressive-reveal"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 3, md: 8, lg: 12 },
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          background: "linear-gradient(135deg, rgba(10, 25, 47, 0.8) 0%, rgba(26, 43, 76, 0.6) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: { xs: 16, md: 24 },
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.06)",
          border: "1px solid rgba(184, 134, 11, 0.08)",
          position: "relative",
          zIndex: 3,
          mx: { xs: 2, md: 6 },
          mt: 4,
          transition: "all 0.6s ease",
          opacity: 1,
          transform: "translateY(0)",
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: "0 35px 100px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(184, 134, 11, 0.1)"
          }
        }}
      >
        {/* Left Content */}
        <Box className="fade-in-left stagger-child" sx={{ flex: 1, zIndex: 4, opacity: 1, transform: "translateX(0)" }}>
          <Typography
            className="text-shimmer stagger-child"
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.2rem", md: "3.2rem", lg: "3.8rem" },
              background: "linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #B8860B 100%, #B8860B 150%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              filter: "drop-shadow(0 2px 10px rgba(184, 134, 11, 0.2))",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              backgroundSize: '300% 100%',
              animation: 'shimmer 4s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
          >
            AspireAI Online Mentoring.
          </Typography>
          <Typography
            className="fade-in-up stagger-child"
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#CBD5E1",
              opacity: 0.95,
              mb: 4,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1.7,
              fontWeight: 400,
              maxWidth: "500px",
              animationDelay: '0.7s'
            }}
          >
            Unlock your potential with guidance from experienced mentors—empowering your journey to success!
          </Typography>
          <Button
            className="bounce-in pulse-glow stagger-child"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.95) 100%)",
              color: "#F8FAFC",
              fontWeight: 600,
              fontSize: "1rem",
              px: 4,
              py: 1.8,
              borderRadius: 12,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
              textTransform: "none",
              mb: 2,
              border: "1px solid rgba(184, 134, 11, 0.2)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: "perspective(500px) rotateX(0deg)",
              animationDelay: '1s',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent)',
                transition: 'left 0.6s'
              },
              "&:hover": {
                background: "linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(26, 43, 76, 0.9) 100%)",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(184, 134, 11, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.2)",
                transform: "perspective(500px) rotateX(-2deg) translateY(-2px) scale(1.05)",
                border: "1px solid rgba(184, 134, 11, 0.4)",
                animation: 'none',
                '&::before': {
                  left: '100%'
                }
              },
              "&:active": {
                transform: "perspective(500px) rotateX(2deg) translateY(1px)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
              }
            }}
            onClick={() => navigate("/student/register")}
          >
            Find a Mentor
          </Button>
          <Typography
            className="slide-in-bottom stagger-child"
            variant="body2"
            sx={{
              mt: 2,
              fontSize: "0.95rem",
              color: "#94A3B8",
              opacity: 0.9,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              animationDelay: '1.2s'
            }}
          >
            Looking to mentor?{" "}
            <Link
              href="/mentor/register"
              sx={{
                color: "#B8860B",
                textDecoration: "none",
                fontWeight: 500,
                position: "relative",
                transition: "all 0.3s ease",
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: 1,
                  background: 'linear-gradient(90deg, #B8860B, #DAA520)',
                  transition: 'width 0.3s ease'
                },
                "&:hover": { 
                  color: "#DAA520",
                  filter: "drop-shadow(0 0 8px rgba(184, 134, 11, 0.3))",
                  transform: 'scale(1.05)',
                  '&::after': {
                    width: '100%'
                  }
                },
              }}
            >
              Click here
            </Link>
          </Typography>
        </Box>
        {/* Right Content - Professional Images */}
        <Box 
          className="fade-in-right stagger-child"
          sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 4,
            opacity: 1,
            transform: "translateX(0)",
            animationDelay: '0.8s'
          }}
        >
          <Box sx={{ position: "relative", minHeight: "400px", width: "100%" }}>
            {/* Main person image */}
            <Box
              className="scale-in tilt-card floating-element stagger-child"
              component="img"
              src={manImage}
              alt="Professional Mentor"
              sx={{
                width: { xs: "180px", md: "220px", lg: "250px" },
                position: "absolute",
                top: "20%",
                left: "20%",
                zIndex: 3,
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 15px rgba(184, 134, 11, 0.1)",
                border: "2px solid rgba(184, 134, 11, 0.2)",
                transition: "all 0.4s ease",
                animationDelay: '1.2s',
                '&:hover': {
                  transform: 'scale(1.08) rotateY(5deg)',
                  boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 25px rgba(184, 134, 11, 0.3)",
                  border: "2px solid rgba(184, 134, 11, 0.4)"
                }
              }}
            />
            
            {/* Second person image */}
            <Box
              className="scale-in tilt-card floating-element stagger-child"
              component="img"
              src={girlImage}
              alt="Professional Mentee"
              sx={{
                width: { xs: "180px", md: "220px", lg: "250px" },
                position: "absolute",
                top: "45%",
                right: "15%",
                zIndex: 3,
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 15px rgba(184, 134, 11, 0.1)",
                border: "2px solid rgba(184, 134, 11, 0.2)",
                transition: "all 0.4s ease",
                animationDelay: '2s',
                '&:hover': {
                  transform: 'scale(1.08) rotateY(-5deg)',
                  boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 25px rgba(184, 134, 11, 0.3)",
                  border: "2px solid rgba(184, 134, 11, 0.4)"
                }
              }}
            />
            
            {/* Animated background dot pattern */}
            <Box
              className="rotate-in floating-element mouse-float stagger-child"
              component="img"
              src={dotImage}
              alt=""
              sx={{
                width: { xs: "120px", md: "150px" },
                position: "absolute",
                top: "10%",
                right: "40%",
                zIndex: 1,
                opacity: 0.15,
                filter: "sepia(1) hue-rotate(40deg) saturate(1.5)",
                animationDelay: '1.6s'
              }}
            />
            
            {/* Additional floating elements */}
            <Box
              className="bounce-in floating-element mouse-float"
              sx={{
                position: "absolute",
                top: "5%",
                left: "5%",
                width: "30px",
                height: "30px",
                background: "linear-gradient(45deg, rgba(184, 134, 11, 0.2), rgba(184, 134, 11, 0.4))",
                borderRadius: "50%",
                zIndex: 2,
                animationDelay: '2s'
              }}
            />
            
            <Box
              className="bounce-in floating-element mouse-float"
              sx={{
                position: "absolute",
                bottom: "10%",
                right: "5%",
                width: "25px",
                height: "25px",
                background: "linear-gradient(45deg, rgba(26, 43, 76, 0.3), rgba(26, 43, 76, 0.5))",
                borderRadius: "50%",
                zIndex: 2,
                animationDelay: '2.5s'
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Steps Section */}
      <Box 
        ref={stepsRef}
        className="fade-in-up progressive-reveal"
        sx={{ 
          px: { xs: 3, md: 8, lg: 12 }, 
          py: 10, 
          position: "relative", 
          zIndex: 2 
        }}
      >
        <Typography
          className="text-shimmer stagger-child"
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%, #B8860B 150%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 8,
            textAlign: "center",
            filter: "drop-shadow(0 2px 8px rgba(184, 134, 11, 0.2))",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.01em",
            backgroundSize: '300% 100%',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        >
          Sign up and Get Connected.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Box 
              className="scale-in tilt-card pulse-glow stagger-child"
              sx={{ 
                p: { xs: 3, md: 4 }, 
                minWidth: { xs: 250, md: 280 }, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.4) 0%, rgba(10, 25, 47, 0.6) 100%)', 
                backdropFilter: "blur(20px)",
                borderRadius: 16, 
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.08)',
                border: "1px solid rgba(184, 134, 11, 0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: 'relative',
                overflow: 'hidden',
                animationDelay: '0.2s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.3), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-8px) rotateY(5deg) scale(1.02)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 25px rgba(184, 134, 11, 0.2)',
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  '&::before': {
                    opacity: 1
                  }
                }
              }}
            >
              <PhoneIphoneOutlinedIcon className="bounce-in" sx={{ 
                fontSize: 40, 
                color: '#B8860B', 
                mb: 2,
                filter: 'drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))',
                transition: 'all 0.3s ease',
                animationDelay: '0.5s',
                '&:hover': {
                  transform: 'scale(1.2) rotateZ(10deg)',
                  filter: 'drop-shadow(0 4px 12px rgba(184, 134, 11, 0.4))'
                }
              }} />
              <Typography 
                className="stagger-child"
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F1F5F9', 
                  fontSize: '1.2rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center'
                }}
              >
                Sign Up
              </Typography>
              <Typography 
                className="stagger-child"
                variant="body2" 
                sx={{ 
                  color: '#CBD5E1', 
                  lineHeight: 1.6, 
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center',
                  mx: 'auto',
                  maxWidth: '200px'
                }}
              >
                Create your profile and begin your mentorship journey.
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box 
              className="scale-in tilt-card pulse-glow stagger-child"
              sx={{ 
                p: { xs: 3, md: 4 }, 
                minWidth: { xs: 250, md: 280 }, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.4) 0%, rgba(10, 25, 47, 0.6) 100%)', 
                backdropFilter: "blur(20px)",
                borderRadius: 16, 
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.08)',
                border: "1px solid rgba(184, 134, 11, 0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: 'relative',
                overflow: 'hidden',
                animationDelay: '0.4s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.3), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-8px) rotateY(-5deg) scale(1.02)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 25px rgba(184, 134, 11, 0.2)',
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  '&::before': {
                    opacity: 1
                  }
                }
              }}
            >
              <SearchOutlinedIcon className="bounce-in" sx={{ 
                fontSize: 40, 
                color: '#B8860B', 
                mb: 2,
                filter: 'drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))',
                transition: 'all 0.3s ease',
                animationDelay: '0.7s',
                '&:hover': {
                  transform: 'scale(1.2) rotateZ(-10deg)',
                  filter: 'drop-shadow(0 4px 12px rgba(184, 134, 11, 0.4))'
                }
              }} />
              <Typography 
                className="stagger-child"
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F1F5F9', 
                  fontSize: '1.2rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center'
                }}
              >
                Personalize Experience
              </Typography>
              <Typography 
                className="stagger-child"
                variant="body2" 
                sx={{ 
                  color: '#CBD5E1', 
                  lineHeight: 1.6, 
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center',
                  mx: 'auto',
                  maxWidth: '200px'
                }}
              >
                Share your goals and interests to find the best mentor match.
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box 
              className="scale-in tilt-card pulse-glow stagger-child"
              sx={{ 
                p: { xs: 3, md: 4 }, 
                minWidth: { xs: 250, md: 280 }, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, rgba(26, 43, 76, 0.4) 0%, rgba(10, 25, 47, 0.6) 100%)', 
                backdropFilter: "blur(20px)",
                borderRadius: 16, 
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.08)',
                border: "1px solid rgba(184, 134, 11, 0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: 'relative',
                overflow: 'hidden',
                animationDelay: '0.6s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.3), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-8px) rotateY(5deg) scale(1.02)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 25px rgba(184, 134, 11, 0.2)',
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                  '&::before': {
                    opacity: 1
                  }
                }
              }}
            >
              <TextsmsRoundedIcon className="bounce-in" sx={{ 
                fontSize: 40, 
                color: '#B8860B', 
                mb: 2,
                filter: 'drop-shadow(0 2px 8px rgba(184, 134, 11, 0.3))',
                transition: 'all 0.3s ease',
                animationDelay: '0.9s',
                '&:hover': {
                  transform: 'scale(1.2) rotateZ(10deg)',
                  filter: 'drop-shadow(0 4px 12px rgba(184, 134, 11, 0.4))'
                }
              }} />
              <Typography 
                className="stagger-child"
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F1F5F9', 
                  fontSize: '1.2rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center'
                }}
              >
                Connect & Grow
              </Typography>
              <Typography 
                className="stagger-child"
                variant="body2" 
                sx={{ 
                  color: '#CBD5E1', 
                  lineHeight: 1.6, 
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center',
                  mx: 'auto',
                  maxWidth: '200px'
                }}
              >
                Engage with your mentor through secure chat and calls—grow together!
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chat Section */}
      <Box
        ref={chatRef}
        className="fade-in-up progressive-reveal"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 3, md: 8, lg: 12 },
          py: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, rgba(26, 43, 76, 0.6) 0%, rgba(10, 25, 47, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: { xs: 16, md: 20 },
          boxShadow: "0 15px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
          border: "1px solid rgba(184, 134, 11, 0.12)",
          my: 8,
          mx: { xs: 2, md: 6 },
          position: "relative",
          zIndex: 2,
          transition: "all 0.4s ease",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.05), transparent)',
            transition: 'left 1s ease',
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(184, 134, 11, 0.15)",
            '&::before': {
              left: '100%'
            }
          }
        }}
      >
        <Box className="fade-in-left stagger-child" sx={{ flex: 1 }}>
          <Typography
            className="text-shimmer stagger-child"
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%, #B8860B 150%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.01em",
              backgroundSize: '300% 100%',
              animation: 'shimmer 5s ease-in-out infinite',
              animationDelay: '1s'
            }}
          >
            Connect and Collaborate Effortlessly.
          </Typography>
          <Typography
            className="fade-in-up stagger-child"
            variant="body1"
            sx={{
              mb: 3,
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "#CBD5E1",
              opacity: 0.9,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1.7,
              animationDelay: '1.2s'
            }}
          >
            Seamlessly chat, call, and collaborate with your mentor—no extra apps needed, just simple and secure communication.
          </Typography>
        </Box>
        <Box className="fade-in-right stagger-child" sx={{ flex: 1, textAlign: "center" }}>
          <Box
            className="scale-in tilt-card floating-element pulse-glow"
            component="img"
            src={chatImage}
            alt="Chat Interface"
            onError={(e) => {
              console.log('Image failed to load:', e);
              e.target.src = pplImage; // Fallback image
            }}
            onLoad={() => {
              console.log('Chat image loaded successfully');
            }}
            sx={{
              width: { xs: "220px", md: "300px", lg: "350px" },
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 15px rgba(184, 134, 11, 0.1)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              mt: { xs: 4, md: 0 },
              transition: "all 0.4s ease",
              animationDelay: '1.4s',
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              opacity: 1,
              '&:hover': {
                transform: 'scale(1.05) rotateY(3deg) translateZ(20px)',
                boxShadow: "0 20px 50px rgba(0,0,0,0.35), 0 0 25px rgba(184, 134, 11, 0.25)",
                border: "1px solid rgba(184, 134, 11, 0.4)"
              },
              '&.animate-in': {
                opacity: 1,
                transform: 'scale(1) rotateZ(0deg)'
              }
            }}
          />
        </Box>
      </Box>

      {/* Get Started Section */}
      <Box
        ref={ctaRef}
        className="fade-in-up progressive-reveal"
        sx={{
          width: "100vw",
          minHeight: "60vh",
          backgroundImage: `linear-gradient(135deg, rgba(26, 43, 76, 0.8) 0%, rgba(10, 25, 47, 0.9) 100%), url(${pplImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(26, 43, 76, 0.4) 100%)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg, transparent, rgba(184, 134, 11, 0.03), transparent)',
            animation: 'spin 20s linear infinite',
            zIndex: 0
          },
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      >
        {/* Additional floating elements */}
        <Box className="floating-element mouse-float" sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(184, 134, 11, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          animationDelay: '3s'
        }} />
        
        <Box className="floating-element mouse-float" sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(26, 43, 76, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          animationDelay: '4s'
        }} />

        <Box
          className="scale-in bounce-in tilt-card"
          sx={{
            background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
            backdropFilter: "blur(25px)",
            borderRadius: 20,
            p: { xs: 4, md: 8 },
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
            border: "1px solid rgba(184, 134, 11, 0.15)",
            position: "relative",
            zIndex: 2,
            transition: "all 0.6s ease",
            maxWidth: "600px",
            mx: 2,
            overflow: "hidden",
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
              transform: 'translateY(-6px) scale(1.02) rotateY(2deg)',
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(184, 134, 11, 0.15)",
              '&::before': {
                left: '100%'
              }
            }
          }}
        >
          <Typography 
            className="text-shimmer stagger-child"
            sx={{ 
              fontSize: { md: "2.4rem", xs: "2rem" }, 
              fontWeight: 700,
              mb: 3,
              background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%, #B8860B 150%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.01em",
              backgroundSize: '300% 100%',
              animation: 'shimmer 6s ease-in-out infinite',
              animationDelay: '2s'
            }}
          >
            Start your mentorship journey in just a few clicks.
          </Typography>
          <Typography
            className="fade-in-up stagger-child"
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "#CBD5E1",
              mb: 4,
              opacity: 0.9,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              lineHeight: 1.6,
              maxWidth: "400px",
              mx: "auto",
              animationDelay: '2.2s'
            }}
          >
            Connect with experienced mentors and unlock your potential today.
          </Typography>
          <Button
            className="bounce-in pulse-glow stagger-child"
            variant="contained"
            onClick={() => navigate("/student/register")}
            sx={{
              padding: "1rem 2.5rem",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.95) 100%)",
              color: "#F8FAFC",
              borderRadius: 12,
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              animationDelay: '2.5s',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent)',
                transition: 'left 0.8s'
              },
              "&:hover": {
                background: "linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(26, 43, 76, 0.9) 100%)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.35), 0 0 25px rgba(184, 134, 11, 0.25)",
                transform: "translateY(-3px) scale(1.05)",
                border: "1px solid rgba(184, 134, 11, 0.4)",
                animation: 'none',
                '&::before': {
                  left: '100%'
                }
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)"
              },
              mt: 2,
            }}
          >
            Get Started Today
          </Button>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          color: "#F8FAFC",
          pt: 6,
          pb: 6,
          px: { xs: 2, sm: 4 },
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          mt: 8,
          boxShadow: "0 -5px 25px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(184, 134, 11, 0.1)",
          borderBottom: "none",
          position: "relative",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.3), transparent)'
          }
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            mt: { xs: 2, sm: 4 },
            mb: { xs: 2, sm: 4 },
            textAlign: "center",
            maxWidth: "1200px",
            mx: "auto"
          }}
        >
          {/* About AspireAI */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 3, 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                  background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                  fontSize: "1.3rem"
                }}
              >
                AspireAI
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "0.95rem",
                  color: "#CBD5E1",
                  opacity: 0.9,
                  maxWidth: "280px",
                  mx: "auto"
                }}
              >
                Empowering students and professionals to reach their goals through personalized mentorship and support.
              </Typography>
            </Box>
          </Grid>

          {/* Main Menu */}
          <Grid item xs={6} sm={3} md={2}>
            <Box>
              <Typography
                variant="h6"
                sx={{ 
                  mb: 3, 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                  color: "#B8860B",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}
              >
                Main Menu
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link 
                  href="/" 
                  sx={{ 
                    textDecoration: "none", 
                    color: "#CBD5E1",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "#B8860B",
                      transform: "translateX(2px)"
                    }
                  }}
                >
                  Home
                </Link>
                <Link 
                  href="/contact" 
                  sx={{ 
                    textDecoration: "none", 
                    color: "#CBD5E1",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "#B8860B",
                      transform: "translateX(2px)"
                    }
                  }}
                >
                  Contact
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* For Users */}
          <Grid item xs={6} sm={3} md={2}>
            <Box>
              <Typography
                variant="h6"
                sx={{ 
                  mb: 3, 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                  color: "#B8860B",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}
              >
                For Users
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link 
                  href="student/register" 
                  sx={{ 
                    textDecoration: "none", 
                    color: "#CBD5E1",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "#B8860B",
                      transform: "translateX(2px)"
                    }
                  }}
                >
                  Register
                </Link>
                <Link 
                  href="/login" 
                  sx={{ 
                    textDecoration: "none", 
                    color: "#CBD5E1",
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "#B8860B",
                      transform: "translateX(2px)"
                    }
                  }}
                >
                  Login
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="h6"
                sx={{ 
                  mb: 3, 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                  color: "#B8860B",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  color: "#CBD5E1",
                  opacity: 0.9,
                  mb: 3,
                  fontSize: "0.9rem",
                  maxWidth: "280px",
                  mx: "auto"
                }}
              >
                Have questions or need guidance? Our team is here to support you—contact us anytime!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/contact")}
                sx={{
                  background: "linear-gradient(135deg, rgba(26, 43, 76, 0.9) 0%, rgba(10, 25, 47, 0.95) 100%)",
                  color: "#F8FAFC",
                  fontSize: "0.9rem",
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(184, 134, 11, 0.1)",
                  border: "1px solid rgba(184, 134, 11, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    background: "linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(26, 43, 76, 0.9) 100%)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(184, 134, 11, 0.1)",
                    transform: "translateY(-1px)",
                    border: "1px solid rgba(184, 134, 11, 0.3)"
                  }
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;