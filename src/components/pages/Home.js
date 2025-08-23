import React from "react";
import { Box, Grid, Typography, Button, Link, Divider, Card } from "@mui/material";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TextsmsRoundedIcon from "@mui/icons-material/TextsmsRounded";
import manImage from "../../assets/man.png";
import girlImage from "../../assets/girl.png";
import dotImage from "../../assets/Dot.png";
import ballImage from "../../assets/Ball.png";
import arrow1 from "../../assets/Arrow.png";
import arrow2 from "../../assets/Arrow2.png";
import redBall from "../../assets/BallRed.png";
import chatImage from "../../assets/Chat.png";
import pplImage from "../../assets/pplImage.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)", position: "relative", overflow: "hidden" }}>
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)",
          position: "absolute",
          top: 0,
          left: 0,
          animation: "shimmer 2.5s infinite linear",
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 10 },
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          background: "linear-gradient(90deg, #1e3a8a 0%, #0f172a 40%, #ffd700 100%)",
          borderRadius: 16,
          boxShadow: "0 8px 32px 0 rgba(255, 215, 0, 0.2)",
        }}
      >
        {/* Left */}
        <Box sx={{ flex: 1, zIndex: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
              color: "#ffd700",
              mb: 3,
              lineHeight: 1.1,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            AspireAI Online Mentoring.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "#e2e8f0",
              opacity: 0.95,
              mb: 4,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
          >
            Unlock your potential with guidance from experienced mentors—empowering your journey to success!
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
              color: "#1e3a8a",
              fontWeight: 700,
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(255,215,0,0.3), 0 0 16px 2px rgba(255,215,0,0.2)",
              textTransform: "none",
              mb: 2,
              "&:hover": {
                background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                boxShadow: "0 4px 24px rgba(255,215,0,0.4), 0 0 32px 4px rgba(255,215,0,0.3)",
              },
            }}
            onClick={() => navigate("/student/register")}
          >
            Find a Mentor
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontSize: "1rem",
              color: "#e2e8f0",
              opacity: 0.9,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
          >
            Looking to mentor?{" "}
            <Link
              href="/mentor/register"
              sx={{
                color: "#ffd700",
                textDecoration: "underline",
                fontWeight: 600,
                "&:hover": { color: "#ffed4e" },
              }}
            >
              Click here
            </Link>
          </Typography>
        </Box>
        {/* Right */}
        <Box sx={{ flex: 1, position: "relative", minHeight: "350px" }}>
          <Box
            component="img"
            src={ballImage}
            alt="Background Ball"
            sx={{
              width: { xs: "250px", md: "400px", lg: "500px" },
              position: "absolute",
              top: "10%",
              left: "10%",
              zIndex: 1,
              opacity: 0.3,
              filter: "sepia(100%) hue-rotate(45deg) saturate(2)",
            }}
          />
          <Box
            component="img"
            src={dotImage}
            alt="Dot Overlay"
            sx={{
              width: { xs: "120px", md: "180px", lg: "220px" },
              position: "absolute",
              top: "60%",
              left: "60%",
              zIndex: 2,
              opacity: 0.5,
            }}
          />
          <Box
            component="img"
            src={manImage}
            alt="Man"
            sx={{
              width: { xs: "120px", md: "180px", lg: "220px" },
              position: "absolute",
              top: "30%",
              left: "40%",
              zIndex: 3,
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(255,215,0,0.2)",
            }}
          />
          <Box
            component="img"
            src={girlImage}
            alt="Girl"
            sx={{
              width: { xs: "120px", md: "180px", lg: "220px" },
              position: "absolute",
              top: "55%",
              left: "75%",
              zIndex: 3,
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(255,215,0,0.2)",
            }}
          />
        </Box>
      </Box>

      {/* Steps Section */}
      <Box sx={{ px: { xs: 2, md: 10 }, py: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "#ffd700",
            mb: 6,
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
          }}
        >
          Sign up and Get Connected.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Box sx={{ p: 3, minWidth: 220, textAlign: 'center', background: 'linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: 12, boxShadow: "0 4px 16px rgba(255,215,0,0.2)", border: "1px solid rgba(255,215,0,0.3)" }}>
              <PhoneIphoneOutlinedIcon sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#ffd700' }}>Sign Up</Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>Create your profile and begin your mentorship journey.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ p: 3, minWidth: 220, textAlign: 'center', background: 'linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: 12, boxShadow: "0 4px 16px rgba(255,215,0,0.2)", border: "1px solid rgba(255,215,0,0.3)" }}>
              <SearchOutlinedIcon sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#ffd700' }}>Personalize Experience</Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>Share your goals and interests to find the best mentor match.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ p: 3, minWidth: 220, textAlign: 'center', background: 'linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: 12, boxShadow: "0 4px 16px rgba(255,215,0,0.2)", border: "1px solid rgba(255,215,0,0.3)" }}>
              <TextsmsRoundedIcon sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#ffd700' }}>Connect & Grow</Typography>
              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>Engage with your mentor through secure chat and calls—grow together!</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chat Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 10 },
          py: 8,
          background: "rgba(30,58,138,0.3)",
          borderRadius: 6,
          boxShadow: "0 8px 32px 0 rgba(255,215,0,0.1)",
          border: "1px solid rgba(255,215,0,0.2)",
          my: 8,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              color: "#ffd700",
            }}
          >
            Connect and Collaborate Effortlessly.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#e2e8f0",
              opacity: 0.9,
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
            }}
          >
            Seamlessly chat, call, and collaborate with your mentor—no extra apps needed, just simple and secure communication.
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Box
            component="img"
            src={chatImage}
            alt="Chat"
            sx={{
              width: { xs: "220px", md: "320px", lg: "400px" },
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(255,215,0,0.2)",
              mt: { xs: 4, md: 0 },
            }}
          />
        </Box>
      </Box>

      {/* Get Started Section */}
      <Box
        sx={{
          width: "100vw",
          minHeight: "60vh",
          backgroundImage: `url(${pplImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
        }}
      >
        <Box
          sx={{
            background: "rgba(15,23,42,0.9)",
            borderRadius: 6,
            p: { xs: 4, md: 8 },
            textAlign: "center",
            color: "#ffd700",
            boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
            border: "1px solid rgba(255,215,0,0.3)",
          }}
        >
          <Typography sx={{ fontSize: { md: "2.5rem", xs: "1.8rem" }, fontWeight: 700, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", mb: 3 }}>
            Start your mentorship journey in just a few clicks.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/student/register")}
            sx={{
              padding: "1rem 2.5rem",
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: "1.2rem",
              background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
              color: "#1e3a8a",
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
              },
              mt: 2,
            }}
          >
            Get started today
          </Button>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          pt: 6,
          pb: 6,
          px: { xs: 0, sm: 0, lg: 0 },
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          mt: 8,
          borderTop: "2px solid #ffd700",
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            mt: { xs: 2, sm: 6, lg: 12 },
            mb: { xs: 2, sm: 6, lg: 12 },
            textAlign: "center",
            minHeight: "220px"
          }}
        >
          {/* About AspireAI */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography
              variant="h4"
              sx={{ mb: 3, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#ffd700" }}
            >
              AspireAI
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                fontSize: "16px",
                color: "#cbd5e1",
              }}
            >
              Empowering students and professionals to reach their goals through personalized mentorship and support.
            </Typography>
          </Grid>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: "#ffd700",
              mx: 2,
              height: '100px',
              alignSelf: "center"
            }}
          />

          {/* Main Menu */}
          <Grid item xs={6} sm={4} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography
              variant="h4"
              sx={{ mb: 3, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#ffd700" }}
            >
              Main Menu
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
              <Link href="/" sx={{ textDecoration: "none", color: "#cbd5e1", "&:hover": { color: "#ffd700" } }}>
                Home
              </Link>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
              <Link href="/contact" sx={{ textDecoration: "none", color: "#cbd5e1", "&:hover": { color: "#ffd700" } }}>
                Contact
              </Link>
            </Typography>
          </Grid>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: "#ffd700",
              mx: 2,
              height: '100px',
              alignSelf: "center"
            }}
          />

          {/* For Users */}
          <Grid item xs={6} sm={4} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography
              variant="h4"
              sx={{ mb: 3, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#ffd700" }}
            >
              For Users
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
              <Link href="student/register" sx={{ textDecoration: "none", color: "#cbd5e1", "&:hover": { color: "#ffd700" } }}>
                Register
              </Link>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
              <Link href="/login" sx={{ textDecoration: "none", color: "#cbd5e1", "&:hover": { color: "#ffd700" } }}>
                Login
              </Link>
            </Typography>
          </Grid>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: "#ffd700",
              mx: 2,
              height: '100px',
              alignSelf: "center"
            }}
          />

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography
              variant="h4"
              sx={{ mb: 3, fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", color: "#ffd700" }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                color: "#cbd5e1",
                mb: { xs: 2, sm: 3 },
              }}
            >
              Have questions or need guidance? Our team is here to support you—contact us anytime!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/contact")}
              sx={{
                mt: { xs: 2, sm: 3 },
                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                color: "#1e3a8a",
                "&:hover": { 
                  background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                },
                fontSize: { xs: "14px", sm: "16px" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
                borderRadius: 3,
                fontWeight: 700,
                textAlign: "center",
                py: 4,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
              }}
            >
              Contact Us
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;