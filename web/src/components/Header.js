import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow when scrolled more than 10px
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (pathname) => location.pathname === pathname;

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#ffffff',
        boxShadow: scrolled ? '0px 1px 8px -1px rgba(0,0,0,0.01), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.3s ease',
        width: '100%',
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 600,
            fontSize: '3rem',
            color: '#3f332b', // Change to Mustard Yellow color for logo
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          {/* SMOKE FREE */}
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            ml: 3,
            color: '#000000', // Change back to white text color
            textDecoration: location.pathname === '/' ? 'underline' : 'none',
            textDecorationColor: 'black', // Change back to white underline
            '&:hover': {
              opacity: 0.8,
              'img': {
                transform: 'translateY(-5px)'
              },
            }
          }}
        >
          <img src="icon/icons8-home-64.png" alt="Home Icon" style={{ width: '40px', height: '40px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} />
          Home
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/blog"
          sx={{
            ml: 3,
            color: '#000000', // Change back to white text color
            textDecoration: location.pathname === '/blog' ? 'underline' : 'none',
            textDecorationColor: 'white', // Change back to white underline
            '&:hover': {
              opacity: 0.8,
              'img': {
                transform: 'translateY(-5px)'
              },
            }
          }}
        >
          <img src="icon/icons8-newspaper-64.png" alt="Blog Icon" style={{ width: '30px', height: '30px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} />
          Blog
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#000000',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Zerotine <img src="/smile-face.png" alt="Smiling face" style={{ width: '30px', height: 'auto' }} />
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {authStatus ? (
            <IconButton color="inherit" component={RouterLink} to="/profile" sx={{ color: 'white', fontSize: '2rem' }}>
              <AccountCircle />
            </IconButton>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                bgcolor: '#00b0ff', // Vibrant blue background
                color: 'white', // White text color
                borderRadius: '8px', // More rounded corners
                px: 3,
                py: 1,
                boxShadow: '0 4px 0 #007ac1', // Custom box shadow for 3D effect
                '&:hover': {
                  bgcolor: '#0091ea', // Slightly darker blue on hover
                  boxShadow: '0 2px 0 #007ac1', // Adjust shadow on hover
                  transform: 'translateY(2px)', // Move button down slightly on hover
                },
                '&:active': {
                  boxShadow: '0 0 0 #007ac1', // Remove shadow when pressed
                  transform: 'translateY(4px)', // Move button down further when pressed
                },
              }}
            >
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
