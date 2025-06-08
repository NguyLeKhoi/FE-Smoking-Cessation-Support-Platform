import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AnimatedUnderline } from './animated/AnimatedUnderline';
import motivationService from '../services/motivationService';
import toast from 'react-hot-toast';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchMotivationMessage = async () => {
      // Removed sessionStorage check to allow recurring notifications
      try {
        const data = await motivationService.getMotivationMessage();
        if (data && data.data && data.data.message) {
          // The useRef check still prevents double-render in Strict Mode on initial mount
          if (!toastShownRef.current) {
            console.log('New motivation message received:', data.data.message);
            toast.success(data.data.message, {
              duration: 7000,
              position: 'top-center',
              style: {
                background: '#333',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '16px',
                maxWidth: '500px',
              },
              icon: '🎯',
            });
            setUnreadCount(1);
            toastShownRef.current = true; // Mark as shown for the current component instance
            // Removed sessionStorage.setItem as messages will recur
          }
        }
      } catch (error) {
        console.error('Failed to fetch motivation message:', error);
        toast.error('Failed to load motivation message', {
          duration: 4000,
          position: 'top-center',
        });
      }
    };

    fetchMotivationMessage();

    const intervalId = setInterval(fetchMotivationMessage, 7200000); // Re-enabled 2-hour interval

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
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
              <>
                <IconButton
                  color="inherit"
                  onClick={() => setUnreadCount(0)} // Clear badge on click
                  sx={{ color: '#3f332b', fontSize: '2rem' }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" component={RouterLink} to="/profile" sx={{ color: '#3f332b', fontSize: '2rem' }}>
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="contained"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 0 ',
                  '&:hover': {
                    bgcolor: 'black',
                    boxShadow: '0 2px 0 #000000',
                    transform: 'translateY(2px)',
                  },
                  '&:active': {
                    boxShadow: '0 0 0 #000000',
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
    </>
  );
};

export default Header;
