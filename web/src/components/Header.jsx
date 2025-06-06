import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AnimatedUnderline } from './animated/AnimatedUnderline';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
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
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
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
            Zerotine
          </Typography>
        </Box>

        {/* Added spacer */}
        <Box sx={{ flexGrow: 0.5 }} />

        {/* Home link with AnimatedUnderline */}
        <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <AnimatedUnderline>
            <Typography
              variant="h6"
              sx={{
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover img': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <img
                src="icon/icons8-home-64.png"
                alt="Home Icon"
                style={{
                  width: '40px',
                  height: '40px',
                  verticalAlign: 'middle',
                  transition: 'transform 0.3s ease-in-out'
                }}
              />
              Home
            </Typography>
          </AnimatedUnderline>
        </Box>

        {/* Blog link with AnimatedUnderline */}
        <Box component={RouterLink} to="/blog" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', ml: 3 }}>
          <AnimatedUnderline>
            <Typography
              variant="h6"
              sx={{
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover img': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <img
                src="icon/icons8-newspaper-64.png"
                alt="Blog Icon"
                style={{
                  width: '30px',
                  height: '30px',
                  verticalAlign: 'middle',
                  transition: 'transform 0.3s ease-in-out'
                }}
              />
              Blog
            </Typography>
          </AnimatedUnderline>
        </Box>

        {/* Flexible space to push login to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Login button area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {authStatus ? (
            <IconButton color="inherit" component={RouterLink} to="/profile" sx={{ color: '#3f332b', fontSize: '2rem' }}>
              <AccountCircle />
            </IconButton>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                bgcolor: '#00b0ff',
                color: 'white',
                borderRadius: '8px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 0 #007ac1',
                '&:hover': {
                  bgcolor: '#0091ea',
                  boxShadow: '0 2px 0 #007ac1',
                  transform: 'translateY(2px)',
                },
                '&:active': {
                  boxShadow: '0 0 0 #007ac1',
                  transform: 'translateY(4px)',
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
