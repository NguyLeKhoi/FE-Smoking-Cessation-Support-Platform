import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import NavLinks from './NavLinks';
import UserProfileSection from './UserProfileSection';
import MotivationService from './MotivationMessage';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Use the motivation service component
  const { loadingMotivation } = MotivationService({ setNotifications });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

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
      <Toolbar sx={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left section: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>

        {/* Center section: NavLinks - always centered in the header */}
        <Box sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <NavLinks />
        </Box>

        {/* Right section: User Profile or Login */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {authStatus ? (
            <UserProfileSection
              authStatus={authStatus}
              loadingMotivation={loadingMotivation}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                py: 0.8,
                bgcolor: '#000000',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 0 #00000080',
                '&:hover': {
                  bgcolor: '#000000cd',
                  boxShadow: '0 2px 0 #00000080',
                  transform: 'translateY(2px)',
                },
                '&:active': {
                  boxShadow: '0 0 0 #00000080',
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
